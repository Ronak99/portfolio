"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Player = "x" | "o";
type Cell = Player | null;
type Board = Cell[];

const HUMAN: Player = "x";
const CPU: Player = "o";

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

const EMPTY_BOARD: Board = Array.from({ length: 9 }, () => null);

const CPU_THINK_MS = 420;

function winnerOf(board: Board): Player | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }
  return null;
}

function isFull(board: Board): boolean {
  return board.every(Boolean);
}

// Minimax — the CPU ("o") maximizes; with perfect play it can never be beaten.
function minimax(board: Board, depth: number, cpuToMove: boolean): number {
  const win = winnerOf(board);
  if (win) return win === CPU ? 10 - depth : depth - 10;
  if (isFull(board)) return 0;

  const mark = cpuToMove ? CPU : HUMAN;
  let best = cpuToMove ? -Infinity : Infinity;

  for (let i = 0; i < board.length; i += 1) {
    if (board[i]) continue;
    board[i] = mark;
    const score = minimax(board, depth + 1, !cpuToMove);
    board[i] = null;
    best = cpuToMove ? Math.max(best, score) : Math.min(best, score);
  }

  return best;
}

function chooseCpuMove(board: Board): number {
  let bestScore = -Infinity;
  let candidates: number[] = [];

  for (let i = 0; i < board.length; i += 1) {
    if (board[i]) continue;
    const next = [...board];
    next[i] = CPU;
    const score = minimax(next, 0, false);
    if (score > bestScore) {
      bestScore = score;
      candidates = [i];
    } else if (score === bestScore) {
      candidates.push(i);
    }
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function TicTacToe() {
  const [board, setBoard] = useState<Board>(EMPTY_BOARD);
  const [turn, setTurn] = useState<Player>(HUMAN);
  const cpuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const win = winnerOf(board);
  const draw = !win && isFull(board);
  const gameOver = Boolean(win) || draw;
  const youWin = win === HUMAN;

  const status = win
    ? youWin
      ? "you win ✓"
      : "ai wins"
    : draw
      ? "draw"
      : turn === CPU
        ? "thinking…"
        : "your move";

  const move = useCallback(
    (index: number) => {
      if (gameOver || board[index] || turn !== HUMAN) return;
      setBoard((prev) => {
        const next = [...prev];
        next[index] = HUMAN;
        return next;
      });
      setTurn(CPU);
    },
    [board, gameOver, turn],
  );

  const reset = useCallback(() => {
    if (cpuTimerRef.current) clearTimeout(cpuTimerRef.current);
    setBoard(EMPTY_BOARD);
    setTurn(HUMAN);
  }, []);

  useEffect(() => {
    if (turn !== CPU || gameOver) return;
    cpuTimerRef.current = setTimeout(() => {
      setBoard((prev) => {
        if (winnerOf(prev) || isFull(prev)) return prev;
        const spot = chooseCpuMove(prev);
        if (spot === undefined) return prev;
        const next = [...prev];
        next[spot] = CPU;
        return next;
      });
      setTurn(HUMAN);
    }, CPU_THINK_MS);

    return () => {
      if (cpuTimerRef.current) clearTimeout(cpuTimerRef.current);
    };
  }, [turn, gameOver]);

  useEffect(() => {
    return () => {
      if (cpuTimerRef.current) clearTimeout(cpuTimerRef.current);
    };
  }, []);

  return (
    <div>
      <div
        className="grid grid-cols-3 gap-px border border-hair bg-hair"
        role="grid"
        aria-label="tic-tac-toe board"
      >
        {board.map((v, i) => (
          <button
            key={i}
            type="button"
            role="gridcell"
            onClick={() => move(i)}
            disabled={Boolean(v) || gameOver || turn !== HUMAN}
            aria-label={
              v
                ? `${v === HUMAN ? "you" : "ai"} in cell ${i + 1}`
                : `empty cell ${i + 1}`
            }
            className={[
              "flex aspect-square items-center justify-center bg-cell",
              "text-[34px] font-light leading-none",
              v ? "cursor-default" : "cursor-pointer",
              v === "x" ? "text-ink-2" : "text-accent",
            ].join(" ")}
          >
            {v ? (v === "x" ? "×" : "○") : ""}
          </button>
        ))}
      </div>

      <div className="mt-[14px] flex justify-between font-mono text-[12px] text-status">
        <span className={youWin ? "text-accent" : undefined} aria-live="polite">
          {status}
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={reset}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              reset();
            }
          }}
          className="cursor-pointer text-muted-2 transition-colors hover:text-hover"
        >
          reset ↻
        </span>
      </div>
    </div>
  );
}
