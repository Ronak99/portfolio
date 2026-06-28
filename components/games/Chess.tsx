"use client";

import { Chess, type Color, type PieceSymbol, type Square } from "chess.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chooseMove, type Difficulty } from "./chess/ai";

const HUMAN: Color = "w";
const AI: Color = "b";

const AI_THINK_MS = 420;

const GLYPHS: Record<Color, Record<PieceSymbol, string>> = {
  w: { p: "♙", n: "♘", b: "♗", r: "♖", q: "♕", k: "♔" },
  b: { p: "♟", n: "♞", b: "♝", r: "♜", q: "♛", k: "♚" },
};

const PIECE_NAMES: Record<PieceSymbol, string> = {
  p: "pawn",
  n: "knight",
  b: "bishop",
  r: "rook",
  q: "queen",
  k: "king",
};

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

const DIFFICULTIES: Difficulty[] = ["easy", "normal", "hard"];

type Scores = { you: number; draws: number; ai: number };

const EMPTY_SCORES: Scores = { you: 0, draws: 0, ai: 0 };

function squareName(row: number, col: number): Square {
  // board() rows run rank 8 -> rank 1, columns run file a -> h.
  return `${FILES[col]}${8 - row}` as Square;
}

export function Chess_() {
  const gameRef = useRef(new Chess());
  const game = gameRef.current;

  const [fen, setFen] = useState(game.fen());
  const [selected, setSelected] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(
    null,
  );
  const [thinking, setThinking] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [scores, setScores] = useState<Scores>(EMPTY_SCORES);

  const recordedRef = useRef(false);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);

  // `fen` is the source of truth that drives re-renders; everything else is
  // derived from the live chess.js instance.
  const turn = game.turn();
  const board = useMemo(() => game.board(), [fen, game]);
  const gameOver = game.isGameOver();
  const inCheck = game.inCheck();

  const legalTargets = useMemo(() => {
    if (!selected) return new Set<string>();
    const moves = game.moves({ square: selected, verbose: true });
    return new Set(moves.map((m) => m.to));
  }, [selected, fen, game]);

  const checkedKingSquare = useMemo<Square | null>(() => {
    if (!inCheck) return null;
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const piece = board[row][col];
        if (piece && piece.type === "k" && piece.color === turn) {
          return squareName(row, col);
        }
      }
    }
    return null;
  }, [inCheck, board, turn]);

  const status = (() => {
    if (game.isCheckmate()) return turn === HUMAN ? "ai wins" : "you win";
    if (game.isStalemate()) return "stalemate";
    if (game.isDraw()) return "draw";
    if (thinking) return "ai thinking…";
    if (inCheck) return "check";
    return "your move";
  })();

  const applyMove = useCallback(
    (from: Square, to: Square, promotion?: string) => {
      const move = game.move({ from, to, promotion });
      if (!move) return false;
      setLastMove({ from: move.from, to: move.to });
      setSelected(null);
      setFen(game.fen());
      return true;
    },
    [game],
  );

  const handleSquareClick = useCallback(
    (square: Square) => {
      if (gameOver || thinking || turn !== HUMAN) return;

      const piece = game.get(square);

      if (selected) {
        if (square === selected) {
          setSelected(null);
          return;
        }
        if (legalTargets.has(square)) {
          // Auto-promote to queen — by far the most common choice.
          const verbose = game
            .moves({ square: selected, verbose: true })
            .find((m) => m.to === square);
          applyMove(selected, square, verbose?.promotion ? "q" : undefined);
          return;
        }
        if (piece && piece.color === HUMAN) {
          setSelected(square);
          return;
        }
        setSelected(null);
        return;
      }

      if (piece && piece.color === HUMAN) {
        setSelected(square);
      }
    },
    [applyMove, game, gameOver, legalTargets, selected, thinking, turn],
  );

  const handleReset = useCallback(() => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    requestIdRef.current += 1; // invalidate any in-flight AI search
    recordedRef.current = false;
    gameRef.current = new Chess();
    setFen(gameRef.current.fen());
    setSelected(null);
    setLastMove(null);
    setThinking(false);
  }, []);

  // Spin up a Web Worker so deeper searches never block the main thread.
  // Falls back to synchronous compute if workers aren't available.
  useEffect(() => {
    if (typeof Worker === "undefined") return;
    let worker: Worker | null = null;
    try {
      worker = new Worker(
        new URL("./chess/engine.worker.ts", import.meta.url),
      );
      workerRef.current = worker;
    } catch {
      workerRef.current = null;
    }
    return () => {
      worker?.terminate();
      workerRef.current = null;
    };
  }, []);

  // AI turn — respond after a short, deliberate pause.
  useEffect(() => {
    if (turn !== AI || gameOver) return;

    setThinking(true);
    const requestId = (requestIdRef.current += 1);
    const startFen = game.fen();
    const startedAt = Date.now();

    // Enforce a minimum "thinking" pause so instant replies still feel natural.
    const settle = (choice: ReturnType<typeof chooseMove>) => {
      const wait = Math.max(0, AI_THINK_MS - (Date.now() - startedAt));
      aiTimerRef.current = setTimeout(() => {
        if (requestId !== requestIdRef.current) return;
        if (choice) {
          applyMove(
            choice.from as Square,
            choice.to as Square,
            choice.promotion,
          );
        }
        setThinking(false);
      }, wait);
    };

    const worker = workerRef.current;
    if (worker) {
      const onMessage = (event: MessageEvent) => {
        if (event.data?.id !== requestId) return;
        worker.removeEventListener("message", onMessage);
        settle(event.data.move);
      };
      worker.addEventListener("message", onMessage);
      worker.postMessage({ id: requestId, fen: startFen, difficulty });

      return () => {
        worker.removeEventListener("message", onMessage);
        if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
      };
    }

    // No worker — compute on the main thread after the pause.
    aiTimerRef.current = setTimeout(() => {
      if (requestId !== requestIdRef.current) return;
      const choice = chooseMove(startFen, difficulty);
      if (choice) {
        applyMove(choice.from as Square, choice.to as Square, choice.promotion);
      }
      setThinking(false);
    }, AI_THINK_MS);

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [turn, gameOver, fen, difficulty, applyMove, game]);

  // Tally the result exactly once per finished game.
  useEffect(() => {
    if (!gameOver || recordedRef.current) return;
    recordedRef.current = true;

    setScores((prev) => {
      if (game.isCheckmate()) {
        return turn === HUMAN
          ? { ...prev, ai: prev.ai + 1 }
          : { ...prev, you: prev.you + 1 };
      }
      return { ...prev, draws: prev.draws + 1 };
    });
  }, [gameOver, turn, game]);

  useEffect(() => {
    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, []);

  const interactionLocked = gameOver || thinking || turn !== HUMAN;

  return (
    <div className="game-panel chess">
      <div className="ttt-head">
        <p className="mono ttt-status" aria-live="polite">
          {status}
        </p>
        <button type="button" className="mono ttt-reset" onClick={handleReset}>
          {gameOver ? "play again" : "reset"}
        </button>
      </div>

      <div
        className="chess-board"
        role="grid"
        aria-label="chess board"
        data-disabled={interactionLocked ? "true" : undefined}
      >
        {board.map((rankCells, row) => (
          <div className="chess-rank" role="row" key={row}>
            {rankCells.map((cell, col) => {
              const square = squareName(row, col);
              const isLight = (row + col) % 2 === 0;
              const isSelected = selected === square;
              const isTarget = legalTargets.has(square);
              const isCapture = isTarget && Boolean(cell);
              const isLast =
                lastMove?.from === square || lastMove?.to === square;
              const isCheck = checkedKingSquare === square;

              const label = cell
                ? `${cell.color === HUMAN ? "your" : "ai"} ${
                    PIECE_NAMES[cell.type]
                  } on ${square}`
                : `${square} empty`;

              return (
                <button
                  key={square}
                  type="button"
                  role="gridcell"
                  className="chess-square"
                  data-shade={isLight ? "light" : "dark"}
                  data-selected={isSelected ? "true" : undefined}
                  data-target={isTarget && !isCapture ? "true" : undefined}
                  data-capture={isCapture ? "true" : undefined}
                  data-last={isLast ? "true" : undefined}
                  data-check={isCheck ? "true" : undefined}
                  aria-label={label}
                  aria-pressed={isSelected}
                  disabled={interactionLocked && !isTarget && !cell}
                  onClick={() => handleSquareClick(square)}
                >
                  {cell ? (
                    <span
                      className="chess-piece"
                      data-color={cell.color}
                      aria-hidden="true"
                    >
                      {GLYPHS[cell.color][cell.type]}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="chess-controls">
        <div className="chess-levels" role="group" aria-label="difficulty">
          {DIFFICULTIES.map((level) => (
            <button
              key={level}
              type="button"
              className="chess-level"
              aria-pressed={difficulty === level}
              onClick={() => setDifficulty(level)}
            >
              {level}
            </button>
          ))}
        </div>

        <dl className="mono ttt-scores chess-scores" aria-label="score">
          <div className="ttt-score">
            <dt>you</dt>
            <dd>{scores.you}</dd>
          </div>
          <div className="ttt-score">
            <dt>draws</dt>
            <dd>{scores.draws}</dd>
          </div>
          <div className="ttt-score">
            <dt>ai</dt>
            <dd>{scores.ai}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export { Chess_ as Chess };
