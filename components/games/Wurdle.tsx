"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ALLOWED_GUESSES,
  ANSWER_WORDS,
  WORD_LENGTH,
} from "../../data/wurdleWords";

const MAX_GUESSES = 6;

type TileState = "empty" | "correct" | "present" | "absent";
type GameState = "playing" | "won" | "lost";

const ALLOWED_SET = new Set(ALLOWED_GUESSES);

function pickAnswer(): string {
  return ANSWER_WORDS[Math.floor(Math.random() * ANSWER_WORDS.length)] ?? "";
}

function evaluateGuess(guess: string, answer: string): TileState[] {
  const result: TileState[] = Array(guess.length).fill("absent");
  const remaining: Record<string, number> = {};

  for (const ch of answer) remaining[ch] = (remaining[ch] ?? 0) + 1;

  for (let i = 0; i < guess.length; i += 1) {
    if (guess[i] === answer[i]) {
      result[i] = "correct";
      remaining[guess[i]] -= 1;
    }
  }

  for (let i = 0; i < guess.length; i += 1) {
    if (result[i] === "correct") continue;
    const ch = guess[i];
    if ((remaining[ch] ?? 0) > 0) {
      result[i] = "present";
      remaining[ch] -= 1;
    }
  }

  return result;
}

function tileClass(state: TileState): string {
  switch (state) {
    case "correct":
      return "border border-transparent bg-accent text-accent-fg";
    case "present":
      return "border border-transparent bg-wd-present-bg text-wd-present-fg";
    case "absent":
      return "border border-transparent bg-wd-absent-bg text-wd-absent-fg";
    default:
      return "border border-hair-2 bg-cell text-ink";
  }
}

export function Wurdle() {
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [gameState, setGameState] = useState<GameState>("playing");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setAnswer(pickAnswer());
  }, []);

  const evaluations = useMemo(
    () => guesses.map((guess) => evaluateGuess(guess, answer)),
    [guesses, answer],
  );

  const flash = useCallback((text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 1100);
  }, []);

  const submitGuess = useCallback(() => {
    if (gameState !== "playing" || !answer) return;

    if (current.length < WORD_LENGTH) {
      flash("not enough letters");
      return;
    }

    const guess = current.toLowerCase();
    if (!ALLOWED_SET.has(guess)) {
      flash("not in word list");
      return;
    }

    const nextGuesses = [...guesses, guess];
    setGuesses(nextGuesses);
    setCurrent("");
    setNotice("");

    if (guess === answer) {
      setGameState("won");
    } else if (nextGuesses.length >= MAX_GUESSES) {
      setGameState("lost");
    }
  }, [answer, current, flash, gameState, guesses]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (gameState !== "playing") return;

      const key = event.key.toLowerCase();
      if (key === "enter") {
        event.preventDefault();
        submitGuess();
      } else if (key === "backspace") {
        event.preventDefault();
        setCurrent((prev) => prev.slice(0, -1));
        setNotice("");
      } else if (/^[a-z]$/.test(key)) {
        setCurrent((prev) =>
          prev.length < WORD_LENGTH ? prev + key : prev,
        );
        setNotice("");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameState, submitGuess]);

  const solved = gameState === "won";

  const status = notice
    ? notice
    : solved
      ? "solved ✓"
      : gameState === "lost"
        ? `it was ${answer}`
        : "type · enter · ⌫";

  const rows = Array.from({ length: MAX_GUESSES }, (_, r) => {
    if (r < guesses.length) {
      return guesses[r].split("").map((ch, c) => ({
        ch,
        state: evaluations[r][c],
      }));
    }
    if (r === guesses.length && gameState === "playing") {
      return Array.from({ length: WORD_LENGTH }, (_, c) => ({
        ch: current[c] ?? "",
        state: "empty" as TileState,
      }));
    }
    return Array.from({ length: WORD_LENGTH }, () => ({
      ch: "",
      state: "empty" as TileState,
    }));
  });

  return (
    <div>
      <div className="flex flex-col gap-[5px]">
        {rows.map((row, r) => (
          <div key={r} className="grid grid-cols-5 gap-[5px]" role="row">
            {row.map((tile, c) => (
              <div
                key={c}
                role="gridcell"
                aria-label={tile.ch ? `${tile.ch}, ${tile.state}` : "empty"}
                className={[
                  "flex aspect-square items-center justify-center rounded-[3px]",
                  "text-[19px] font-medium uppercase",
                  tileClass(tile.state),
                ].join(" ")}
              >
                {tile.ch}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-[9px] font-mono text-[12px]" aria-live="polite">
        <span className={solved ? "text-accent" : "text-status"}>{status}</span>
      </div>
    </div>
  );
}
