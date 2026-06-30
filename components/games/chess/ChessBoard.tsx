"use client";

import type { Square } from "chess.js";
import { ChessPiece } from "../ChessPieces";
import { PIECE_NAMES, squareName } from "./chessUtils";
import type { BoardMatrix, BoardOrientation, LastMove } from "./types";

type ChessBoardProps = {
  board: BoardMatrix;
  selected: Square | null;
  legalTargets: Map<Square, boolean>;
  lastMove?: LastMove | null;
  checkSquare?: Square | null;
  orientation?: BoardOrientation;
  disabled?: boolean;
  onSquareClick: (row: number, col: number) => void;
};

function displayCoords(
  row: number,
  col: number,
  orientation: BoardOrientation,
): { row: number; col: number } {
  if (orientation === "white") return { row, col };
  return { row: 7 - row, col: 7 - col };
}

export function ChessBoard({
  board,
  selected,
  legalTargets,
  lastMove = null,
  checkSquare = null,
  orientation = "white",
  disabled = false,
  onSquareClick,
}: ChessBoardProps) {
  const rows = Array.from({ length: 8 }, (_, row) => row);

  return (
    <div
      className="@container grid aspect-square h-full shrink-0 grid-cols-8 grid-rows-8 overflow-hidden rounded-[3px] border border-hair-2"
      role="grid"
      aria-label="chess board"
      data-disabled={disabled ? "true" : "false"}
    >
      {rows.flatMap((row) =>
        Array.from({ length: 8 }, (_, col) => {
          const { row: displayRow, col: displayCol } = displayCoords(
            row,
            col,
            orientation,
          );
          const piece = board[displayRow][displayCol];
          const square = squareName(displayRow, displayCol);
          const dark = (row + col) % 2 === 1;
          const isSelected = selected === square;
          const isCapture = legalTargets.get(square) ?? false;
          const isMoveTarget = legalTargets.has(square);
          const isLastMove =
            lastMove?.from === square || lastMove?.to === square;
          const isCheck = checkSquare === square;
          const label = piece
            ? `${piece.color === "w" ? "white" : "black"} ${
                PIECE_NAMES[piece.type]
              } on ${square}`
            : `${square} empty`;

          return (
            <div
              key={`${row}-${col}`}
              role="gridcell"
              aria-label={label}
              onClick={() => onSquareClick(displayRow, displayCol)}
              className={[
                "relative flex items-center justify-center",
                disabled ? "cursor-default" : "cursor-pointer",
                isCheck
                  ? dark
                    ? "bg-sq-light ring-1 ring-inset ring-hair-strong"
                    : "bg-sq-dark ring-1 ring-inset ring-hair-strong"
                  : isSelected
                    ? dark
                      ? "bg-sq-light ring-1 ring-inset ring-hair-2"
                      : "bg-sq-dark ring-1 ring-inset ring-hair-2"
                    : isLastMove
                      ? dark
                        ? "bg-sq-dark/80"
                        : "bg-sq-light/80"
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
  );
}
