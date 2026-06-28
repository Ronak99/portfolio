"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ALLOWED_GUESSES,
  ANSWER_WORDS,
  WORD_LENGTH,
} from "../../data/wurdleWords";

const MAX_GUESSES = 6;

type LetterState = "correct" | "present" | "absent";
type GameState = "playing" | "won" | "lost";

const KEY_ROWS: string[][] = [
  "qwertyuiop".split(""),
  "asdfghjkl".split(""),
  ["enter", ..."zxcvbnm".split(""), "back"],
];

const ALLOWED_SET = new Set(ALLOWED_GUESSES);

function pickAnswer(): string {
  const pool = ANSWER_WORDS;
  return pool[Math.floor(Math.random() * pool.length)] ?? "";
}

function evaluateGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(guess.length).fill("absent");
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

const STATE_RANK: Record<LetterState, number> = {
  absent: 0,
  present: 1,
  correct: 2,
};

export function Wurdle() {
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [gameState, setGameState] = useState<GameState>("playing");
  const [message, setMessage] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setAnswer(pickAnswer());
  }, []);

  const flash = useCallback((text: string) => {
    setMessage(text);
    setShake(true);
    window.setTimeout(() => setShake(false), 450);
  }, []);

  const evaluations = useMemo(
    () => guesses.map((guess) => evaluateGuess(guess, answer)),
    [guesses, answer],
  );

  const keyStates = useMemo(() => {
    const map: Record<string, LetterState> = {};
    guesses.forEach((guess, row) => {
      const evaluation = evaluations[row];
      for (let i = 0; i < guess.length; i += 1) {
        const ch = guess[i];
        const next = evaluation[i];
        if (!map[ch] || STATE_RANK[next] > STATE_RANK[map[ch]]) {
          map[ch] = next;
        }
      }
    });
    return map;
  }, [guesses, evaluations]);

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
    setMessage("");

    if (guess === answer) {
      setGameState("won");
      flash("splendid!");
    } else if (nextGuesses.length >= MAX_GUESSES) {
      setGameState("lost");
      setMessage(answer.toUpperCase());
    }
  }, [answer, current, flash, gameState, guesses]);

  const handleKey = useCallback(
    (key: string) => {
      if (gameState !== "playing") return;

      if (key === "enter") {
        submitGuess();
        return;
      }

      if (key === "back") {
        setCurrent((prev) => prev.slice(0, -1));
        setMessage("");
        return;
      }

      if (/^[a-z]$/.test(key) && current.length < WORD_LENGTH) {
        setCurrent((prev) => prev + key);
        setMessage("");
      }
    },
    [current.length, gameState, submitGuess],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const key = event.key.toLowerCase();
      if (key === "enter") {
        event.preventDefault();
        handleKey("enter");
      } else if (key === "backspace") {
        event.preventDefault();
        handleKey("back");
      } else if (/^[a-z]$/.test(key)) {
        handleKey(key);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey]);

  const handleReset = useCallback(() => {
    setAnswer(pickAnswer());
    setGuesses([]);
    setCurrent("");
    setGameState("playing");
    setMessage("");
    setShake(false);
  }, []);

  const status =
    gameState === "won"
      ? "you won"
      : gameState === "lost"
        ? "out of tries"
        : `guess ${Math.min(guesses.length + 1, MAX_GUESSES)} of ${MAX_GUESSES}`;

  const rows = Array.from({ length: MAX_GUESSES }, (_, row) => {
    if (row < guesses.length) {
      return { letters: guesses[row].split(""), states: evaluations[row] };
    }
    if (row === guesses.length && gameState === "playing") {
      return { letters: current.split(""), states: null };
    }
    return { letters: [], states: null };
  });

  return (
    <div className="game-panel wurdle">
      <div className="wurdle-head">
        <p className="mono wurdle-status" aria-live="polite">
          {status}
        </p>
        <button
          type="button"
          className="mono wurdle-reset"
          onClick={handleReset}
        >
          new word
        </button>
      </div>

      <div
        className={`wurdle-board${shake ? " is-shaking" : ""}`}
        role="grid"
        aria-label="wurdle board"
      >
        {rows.map((rowData, row) => (
          <div className="wurdle-row" role="row" key={row}>
            {Array.from({ length: WORD_LENGTH }, (_, col) => {
              const letter = rowData.letters[col] ?? "";
              const state = rowData.states?.[col];
              return (
                <div
                  key={col}
                  role="gridcell"
                  className={`wurdle-tile${state ? ` is-${state}` : ""}${
                    letter ? " is-filled" : ""
                  }`}
                  aria-label={
                    letter
                      ? `${letter}${state ? `, ${state}` : ""}`
                      : "empty"
                  }
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="mono wurdle-message" aria-live="assertive">
        {message}
      </p>

      <div className="wurdle-keyboard" aria-label="keyboard">
        {KEY_ROWS.map((keyRow, index) => (
          <div className="wurdle-key-row" key={index}>
            {keyRow.map((key) => {
              const isAction = key === "enter" || key === "back";
              const state = keyStates[key];
              return (
                <button
                  key={key}
                  type="button"
                  className={`wurdle-key${isAction ? " is-action" : ""}${
                    state ? ` is-${state}` : ""
                  }`}
                  onClick={() => handleKey(key)}
                  aria-label={key === "back" ? "backspace" : key}
                >
                  {key === "back" ? "\u232b" : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
