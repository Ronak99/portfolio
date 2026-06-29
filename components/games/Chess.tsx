"use client";

import {
  Chess as ChessEngine,
  type PieceSymbol,
  type Square,
} from "chess.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChessPiece } from "./ChessPieces";

const DEFAULT_MESSAGE = "white to mate in one";

// Mate-in-one puzzles — white to move and deliver checkmate.
const PUZZLES: string[] = [
  "6k1/5ppp/8/8/8/8/8/R6K w - - 0 1", // Ra8#
  "6k1/5ppp/8/8/8/8/5PPP/4Q1K1 w - - 0 1", // Qe8#
  "7k/8/6QK/8/8/8/8/8 w - - 0 1", // Qg7#
  "6k1/8/6K1/8/8/8/8/7R w - - 0 1", // Rh8#
];

const PIECE_NAMES: Record<PieceSymbol, string> = {
  p: "pawn",
  n: "knight",
  b: "bishop",
  r: "rook",
  q: "queen",
  k: "king",
};

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

function squareName(r: number, c: number): Square {
  // board() rows run rank 8 -> rank 1, columns run file a -> h.
  return `${FILES[c]}${8 - r}` as Square;
}

function randomIndex(exclude?: number): number {
  if (PUZZLES.length === 1) return 0;
  let next = Math.floor(Math.random() * PUZZLES.length);
  while (next === exclude) {
    next = Math.floor(Math.random() * PUZZLES.length);
  }
  return next;
}

function Chess_() {
  const gameRef = useRef(new ChessEngine(PUZZLES[0]));

  const [index, setIndex] = useState(0);
  const [fen, setFen] = useState(PUZZLES[0]);
  const [selected, setSelected] = useState<Square | null>(null);
  const [solved, setSolved] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const loadPuzzle = useCallback((i: number) => {
    gameRef.current = new ChessEngine(PUZZLES[i]);
    setIndex(i);
    setFen(PUZZLES[i]);
    setSelected(null);
    setSolved(false);
    setMessage(DEFAULT_MESSAGE);
  }, []);

  // Pick a random puzzle on mount (client only, no hydration mismatch).
  useEffect(() => {
    loadPuzzle(randomIndex());
  }, [loadPuzzle]);

  // After a successful mate, advance to another puzzle automatically.
  useEffect(() => {
    if (!solved) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 400 : 1200;
    const id = window.setTimeout(() => {
      loadPuzzle(randomIndex(index));
    }, delay);

    return () => window.clearTimeout(id);
  }, [solved, index, loadPuzzle]);

  const reset = useCallback(() => {
    loadPuzzle(randomIndex(index));
  }, [index, loadPuzzle]);

  const board = useMemo(() => gameRef.current.board(), [fen]);

  const legalTargets = useMemo(() => {
    if (!selected || solved) return new Map<Square, boolean>();
    const moves = gameRef.current.moves({ square: selected, verbose: true });
    const targets = new Map<Square, boolean>();
    for (const move of moves) {
      targets.set(move.to, Boolean(move.captured));
    }
    return targets;
  }, [selected, fen, solved]);

  const clickSquare = useCallback(
    (r: number, c: number) => {
      if (solved) return;
      const game = gameRef.current;
      const square = squareName(r, c);
      const piece = game.get(square);

      if (selected) {
        if (square === selected) {
          setSelected(null);
          return;
        }

        const verbose = game
          .moves({ square: selected, verbose: true })
          .find((m) => m.to === square);

        if (verbose) {
          game.move({
            from: selected,
            to: square,
            promotion: verbose.promotion ? "q" : undefined,
          });

          if (game.isCheckmate()) {
            setSolved(true);
            setMessage("checkmate ✓");
            setSelected(null);
            setFen(game.fen());
          } else {
            game.undo();
            setSelected(null);
            setMessage("not mate — try again");
          }
          return;
        }

        if (piece && piece.color === "w") {
          setSelected(square);
          return;
        }
        setSelected(null);
        return;
      }

      if (piece && piece.color === "w") {
        setSelected(square);
      }
    },
    [selected, solved],
  );

  return (
    <div className="flex h-full items-stretch gap-5">
      <div
        className="@container grid aspect-square h-full shrink-0 grid-cols-8 grid-rows-8 overflow-hidden rounded-[3px] border border-hair-2"
        role="grid"
        aria-label="chess board"
      >
        {board.flatMap((rankCells, r) =>
          rankCells.map((piece, c) => {
            const square = squareName(r, c);
            const dark = (r + c) % 2 === 1;
            const isSelected = selected === square;
            const isCapture = legalTargets.get(square) ?? false;
            const isMoveTarget = legalTargets.has(square);
            const label = piece
              ? `${piece.color === "w" ? "white" : "black"} ${
                  PIECE_NAMES[piece.type]
                } on ${square}`
              : `${square} empty`;

            return (
              <div
                key={`${r}-${c}`}
                role="gridcell"
                aria-label={label}
                onClick={() => clickSquare(r, c)}
                className={[
                  "relative flex items-center justify-center",
                  solved ? "cursor-default" : "cursor-pointer",
                  isSelected
                    ? dark
                      ? "bg-sq-light ring-1 ring-inset ring-hair-2"
                      : "bg-sq-dark ring-1 ring-inset ring-hair-2"
                    : dark
                      ? "bg-sq-dark"
                      : "bg-sq-light",
                ].join(" ")}
              >
                {isMoveTarget && !isSelected ? (
                  isCapture ? (
                    <span
                      className="pointer-events-none absolute inset-[14%] rounded-full ring-[2.5px] ring-hair-strong"
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      className="pointer-events-none absolute h-[22%] w-[22%] rounded-full bg-hair-strong"
                      aria-hidden="true"
                    />
                  )
                ) : null}
                {piece ? (
                  <ChessPiece
                    color={piece.color}
                    type={piece.type}
                    className="h-[80%] w-[80%]"
                  />
                ) : null}
              </div>
            );
          }),
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5 font-mono">
        <div className="flex flex-col gap-1.5">
          <span
            className={[
              "text-[13px]",
              solved ? "text-accent" : "text-status",
            ].join(" ")}
            aria-live="polite"
          >
            {message}
          </span>
          <span className="text-[10px] tracking-[0.06em] text-faint-2">
            tap a white piece, then its target
          </span>
        </div>
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
          className="cursor-pointer self-start text-[12px] text-muted-2 transition-colors hover:text-hover"
        >
          new puzzle ↻
        </span>
      </div>
    </div>
  );
}

export { Chess_ as Chess };
