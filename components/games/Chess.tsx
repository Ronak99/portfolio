"use client";

import {
  Chess as ChessEngine,
  type Color,
  type PieceSymbol,
  type Square,
} from "chess.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_MESSAGE = "white to mate in one";

// Mate-in-one puzzles — white to move and deliver checkmate.
const PUZZLES: string[] = [
  "6k1/5ppp/8/8/8/8/8/R6K w - - 0 1", // Ra8#
  "6k1/5ppp/8/8/8/8/5PPP/4Q1K1 w - - 0 1", // Qe8#
  "7k/8/6QK/8/8/8/8/8 w - - 0 1", // Qg7#
  "6k1/8/6K1/8/8/8/8/7R w - - 0 1", // Rh8#
];

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

  const reset = useCallback(() => {
    loadPuzzle(randomIndex(index));
  }, [index, loadPuzzle]);

  const board = useMemo(() => gameRef.current.board(), [fen]);

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
    <div>
      <div
        className="grid grid-cols-8 overflow-hidden rounded-[3px] border border-hair-2"
        role="grid"
        aria-label="chess board"
      >
        {board.flatMap((rankCells, r) =>
          rankCells.map((piece, c) => {
            const square = squareName(r, c);
            const dark = (r + c) % 2 === 1;
            const isSelected = selected === square;
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
                  "flex aspect-square items-center justify-center text-[21px] leading-none",
                  solved ? "cursor-default" : "cursor-pointer",
                  isSelected
                    ? "bg-accent"
                    : dark
                      ? "bg-sq-dark"
                      : "bg-sq-light",
                  piece && piece.color === "w"
                    ? "text-ink"
                    : "text-piece-muted",
                ].join(" ")}
              >
                {piece ? GLYPHS[piece.color][piece.type] : ""}
              </div>
            );
          }),
        )}
      </div>

      <div className="mt-3 flex justify-between font-mono text-[12px]">
        <span
          className={solved ? "text-accent" : "text-status"}
          aria-live="polite"
        >
          {message}
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

export { Chess_ as Chess };
