"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ANSWER_WORDS, WORD_LENGTH } from "../../data/wurdleWords";

const MAX_GUESSES = 5;

type TileState = "empty" | "correct" | "present" | "absent";
type GameState = "playing" | "won" | "lost";

// The answer is always a real word from the curated list, but player guesses
// are unrestricted — any 5-letter A–Z string is accepted (no dictionary check).
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

// Color encoding for tile feedback:
//   correct → green (right letter, right spot)
//   present → amber (letter in word, wrong spot)
//   absent  → dark slate (letter not in word)
//   empty   → board cell, slightly distinct from absent
function tileClass(state: TileState): string {
  switch (state) {
    case "correct":
      return "border border-transparent bg-[#5cb88a] text-[#0d1117]";
    case "present":
      return "border border-transparent bg-[#d4a843] text-[#0d1117]";
    case "absent":
      return "border border-transparent bg-[#2a2f3a] text-[#c9d1d9]";
    default:
      return "border border-hair-2 bg-cell text-ink";
  }
}

// Per-key coloring mirrors the tile feedback so the on-screen keyboard tracks
// which letters have been ruled in/out across previous guesses.
function keyClass(state: TileState | undefined): string {
  switch (state) {
    case "correct":
      return "border border-transparent bg-[#5cb88a] text-[#0d1117]";
    case "present":
      return "border border-transparent bg-[#d4a843] text-[#0d1117]";
    case "absent":
      return "border border-transparent bg-[#2a2f3a] text-faint";
    default:
      return "border border-hair-2 bg-cell text-ink hover:border-hair-strong";
  }
}

// "back" = backspace, "enter" = submit; everything else is a letter.
const KEY_ROWS: string[][] = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["back", "z", "x", "c", "v", "b", "n", "m", "enter"],
];

const STATE_RANK: Record<TileState, number> = {
  empty: -1,
  absent: 0,
  present: 1,
  correct: 2,
};

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

    // Only requirement: exactly 5 letters (A–Z). No dictionary validation —
    // any 5-letter string is accepted and scored.
    if (current.length < WORD_LENGTH) {
      flash("not enough letters");
      return;
    }

    const guess = current.toLowerCase();
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

  const reset = useCallback(() => {
    setAnswer(pickAnswer());
    setGuesses([]);
    setCurrent("");
    setGameState("playing");
    setNotice("");
  }, []);

  // On-screen keyboard entry point.
  const handleKey = useCallback(
    (key: string) => {
      if (gameState !== "playing") return;
      if (key === "enter") {
        submitGuess();
      } else if (key === "back") {
        setCurrent((prev) => prev.slice(0, -1));
        setNotice("");
      } else if (/^[a-z]$/.test(key)) {
        setCurrent((prev) => (prev.length < WORD_LENGTH ? prev + key : prev));
        setNotice("");
      }
    },
    [gameState, submitGuess],
  );

  // Best-known status for each letter, used to tint the on-screen keys.
  const letterStates = useMemo(() => {
    const map: Record<string, TileState> = {};
    guesses.forEach((guess, r) => {
      guess.split("").forEach((ch, c) => {
        const state = evaluations[r]?.[c];
        if (!state || state === "empty") return;
        const prev = map[ch];
        if (!prev || STATE_RANK[state] > STATE_RANK[prev]) map[ch] = state;
      });
    });
    return map;
  }, [guesses, evaluations]);

  const solved = gameState === "won";

  const status = notice
    ? notice
    : solved
      ? "solved ✓"
      : gameState === "lost"
        ? `it was ${answer.toUpperCase()}`
        : "guess the 5-letter word";

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

  const tiles = rows.flat();

  return (
    <div className="flex h-full items-stretch gap-5">
      <div
        className="@container grid aspect-square h-full shrink-0 grid-cols-5 grid-rows-5 gap-[5px]"
        role="grid"
        aria-label="wordle board"
      >
        {tiles.map((tile, i) => (
          <div
            key={i}
            role="gridcell"
            aria-label={tile.ch ? `${tile.ch}, ${tile.state}` : "empty"}
            className={[
              "flex items-center justify-center rounded-[3px]",
              "text-[8.5cqw] font-medium uppercase",
              tileClass(tile.state),
            ].join(" ")}
          >
            {tile.ch}
          </div>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3 py-0.5 font-mono">
        <span
          className={[
            "text-[12px] tracking-[0.04em]",
            solved ? "text-accent" : "text-status",
          ].join(" ")}
          aria-live="polite"
        >
          {status}
        </span>

        <div
          className="flex w-full max-w-[340px] flex-col gap-[5px]"
          role="group"
          aria-label="on-screen keyboard"
        >
          {KEY_ROWS.map((row, ri) => (
            <div key={ri} className="flex justify-center gap-[5px]">
              {row.map((key) => {
                const isEnter = key === "enter";
                const isBack = key === "back";
                const isAction = isEnter || isBack;
                const label = isEnter ? "↵" : isBack ? "⌫" : key;

                const colorClass = isEnter
                  ? "border border-transparent bg-accent text-accent-fg"
                  : isBack
                    ? "border border-hair-2 bg-cell text-ink hover:border-hair-strong"
                    : keyClass(letterStates[key]);

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKey(key)}
                    disabled={gameState !== "playing"}
                    aria-label={isEnter ? "enter" : isBack ? "delete" : key}
                    className={[
                      "flex h-9 items-center justify-center rounded-[3px] select-none",
                      "font-medium uppercase transition-colors",
                      "disabled:cursor-default disabled:opacity-60",
                      gameState === "playing" ? "cursor-pointer" : "",
                      isAction
                        ? "min-w-0 flex-[1.5_1_0%] max-w-[52px] text-[13px]"
                        : "min-w-0 flex-1 max-w-[30px] text-[11px]",
                      colorClass,
                    ].join(" ")}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Always reserve this row so the keyboard never shifts when the game ends. */}
        <span
          role={gameState !== "playing" ? "button" : undefined}
          tabIndex={gameState !== "playing" ? 0 : undefined}
          onClick={gameState !== "playing" ? reset : undefined}
          onKeyDown={
            gameState !== "playing"
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    reset();
                  }
                }
              : undefined
          }
          className={[
            "h-[18px] text-[12px] leading-[18px]",
            gameState !== "playing"
              ? "cursor-pointer text-muted-2 transition-colors hover:text-hover"
              : "invisible pointer-events-none",
          ].join(" ")}
        >
          new word ↻
        </span>
      </div>
    </div>
  );
}
