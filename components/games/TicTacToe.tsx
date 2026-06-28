"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[];

const HUMAN: Player = "X";
const CPU: Player = "O";

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

const CPU_THINK_MS = 480;

type WinInfo = { player: Player; line: readonly number[] };

function getWinInfo(board: Board): WinInfo | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a] as Player, line };
    }
  }
  return null;
}

function isFull(board: Board): boolean {
  return board.every(Boolean);
}

/**
 * Minimax with depth weighting so the CPU prefers the quickest win and the
 * slowest loss. The CPU ("O") is the maximizing player — with perfect play it
 * can never be beaten, only held to a draw.
 */
function minimax(board: Board, depth: number, cpuToMove: boolean): number {
  const win = getWinInfo(board);
  if (win) return win.player === CPU ? 10 - depth : depth - 10;
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

  // Tie-break randomly among equally optimal moves for variety between games.
  return candidates[Math.floor(Math.random() * candidates.length)];
}

type Scores = { you: number; draws: number; cpu: number };

const EMPTY_SCORES: Scores = { you: 0, draws: 0, cpu: 0 };

export function TicTacToe() {
  const [board, setBoard] = useState<Board>(EMPTY_BOARD);
  const [turn, setTurn] = useState<Player>(HUMAN);
  const [firstPlayer, setFirstPlayer] = useState<Player>(HUMAN);
  const [scores, setScores] = useState<Scores>(EMPTY_SCORES);

  const win = getWinInfo(board);
  const draw = !win && isFull(board);
  const gameOver = Boolean(win) || draw;
  const cpuThinking = turn === CPU && !gameOver;

  const recordedRef = useRef(false);
  const cpuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const status = win
    ? win.player === HUMAN
      ? "you win"
      : "cpu wins"
    : draw
      ? "draw"
      : cpuThinking
        ? "cpu thinking…"
        : "your move";

  const handleCellClick = useCallback(
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

  const handleCellKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleCellClick(index);
      }
    },
    [handleCellClick],
  );

  const startGame = useCallback((first: Player) => {
    if (cpuTimerRef.current) clearTimeout(cpuTimerRef.current);
    recordedRef.current = false;
    setBoard(EMPTY_BOARD);
    setTurn(first);
  }, []);

  const handleReset = useCallback(() => {
    startGame(firstPlayer);
  }, [firstPlayer, startGame]);

  // Switching who opens the game starts a fresh round immediately so the choice
  // always takes effect on the current board, never mid-game.
  const handleSetFirst = useCallback(
    (first: Player) => {
      if (first === firstPlayer) return;
      setFirstPlayer(first);
      startGame(first);
    },
    [firstPlayer, startGame],
  );

  // CPU turn — respond after a short, deliberate pause.
  useEffect(() => {
    if (turn !== CPU || gameOver) return;

    cpuTimerRef.current = setTimeout(() => {
      setBoard((prev) => {
        if (getWinInfo(prev) || isFull(prev)) return prev;
        const move = chooseCpuMove(prev);
        if (move === undefined) return prev;
        const next = [...prev];
        next[move] = CPU;
        return next;
      });
      setTurn(HUMAN);
    }, CPU_THINK_MS);

    return () => {
      if (cpuTimerRef.current) clearTimeout(cpuTimerRef.current);
    };
  }, [turn, gameOver]);

  // Tally the result exactly once per finished game.
  useEffect(() => {
    if (!gameOver || recordedRef.current) return;
    recordedRef.current = true;

    setScores((prev) => {
      if (win?.player === HUMAN) return { ...prev, you: prev.you + 1 };
      if (win?.player === CPU) return { ...prev, cpu: prev.cpu + 1 };
      return { ...prev, draws: prev.draws + 1 };
    });
  }, [gameOver, win]);

  useEffect(() => {
    return () => {
      if (cpuTimerRef.current) clearTimeout(cpuTimerRef.current);
    };
  }, []);

  const winningCells = win ? new Set(win.line) : null;

  return (
    <div className="game-panel ttt">
      <div className="ttt-head">
        <p className="mono ttt-status" aria-live="polite">
          {status}
        </p>
        <button type="button" className="mono ttt-reset" onClick={handleReset}>
          {gameOver ? "play again" : "reset"}
        </button>
      </div>

      <div
        className="mono ttt-controls"
        role="group"
        aria-label="who moves first"
      >
        <span className="ttt-controls-label">first</span>
        <button
          type="button"
          className="ttt-toggle"
          aria-pressed={firstPlayer === HUMAN}
          onClick={() => handleSetFirst(HUMAN)}
        >
          you
        </button>
        <button
          type="button"
          className="ttt-toggle"
          aria-pressed={firstPlayer === CPU}
          onClick={() => handleSetFirst(CPU)}
        >
          cpu
        </button>
      </div>

      <div
        className="ttt-grid"
        role="grid"
        aria-label="tic tac toe board"
        data-disabled={cpuThinking || gameOver ? "true" : undefined}
      >
        {board.map((cell, index) => {
          const isWinning = winningCells?.has(index) ?? false;
          return (
            <button
              key={index}
              type="button"
              className="ttt-cell"
              role="gridcell"
              data-mark={cell ? cell.toLowerCase() : undefined}
              data-winning={isWinning ? "true" : undefined}
              aria-label={
                cell
                  ? `${cell === HUMAN ? "you" : "cpu"} in cell ${index + 1}`
                  : `empty cell ${index + 1}`
              }
              disabled={Boolean(cell) || gameOver || cpuThinking}
              onClick={() => handleCellClick(index)}
              onKeyDown={(event) => handleCellKeyDown(event, index)}
            >
              {cell?.toLowerCase()}
            </button>
          );
        })}
      </div>

      <dl className="mono ttt-scores" aria-label="score">
        <div className="ttt-score">
          <dt>you</dt>
          <dd>{scores.you}</dd>
        </div>
        <div className="ttt-score">
          <dt>draws</dt>
          <dd>{scores.draws}</dd>
        </div>
        <div className="ttt-score">
          <dt>cpu</dt>
          <dd>{scores.cpu}</dd>
        </div>
      </dl>
    </div>
  );
}
