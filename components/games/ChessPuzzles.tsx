"use client";

import { useCallback, useEffect, useState } from "react";
import { CHESS_PUZZLES, randomPuzzleIndex } from "@/data/chessPuzzles";
import { ChessBoard } from "./chess/ChessBoard";
import { useChessInteraction } from "./chess/useChessInteraction";
import type { MovePolicyContext, MovePolicyResult } from "./chess/types";

const DEFAULT_MESSAGE = "white to mate in one";

function puzzleMovePolicy({ game }: MovePolicyContext): MovePolicyResult {
  if (game.isCheckmate()) return "accept";
  game.undo();
  return "reject";
}

export function ChessPuzzles() {
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const {
    board,
    selected,
    legalTargets,
    checkSquare,
    lastMove,
    loadPosition,
    clickSquare,
  } = useChessInteraction({
    initialFen: CHESS_PUZZLES[0],
    playableColor: "w",
    disabled: solved,
    autoQueenPromotion: true,
    movePolicy: puzzleMovePolicy,
    onMoveAccepted: () => {
      setSolved(true);
      setMessage("checkmate ✓");
    },
    onMoveRejected: () => {
      setMessage("not mate — try again");
    },
  });

  const loadPuzzle = useCallback(
    (i: number) => {
      loadPosition(CHESS_PUZZLES[i]);
      setIndex(i);
      setSolved(false);
      setMessage(DEFAULT_MESSAGE);
    },
    [loadPosition],
  );

  useEffect(() => {
    loadPuzzle(randomPuzzleIndex());
  }, [loadPuzzle]);

  useEffect(() => {
    if (!solved) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 400 : 1200;
    const id = window.setTimeout(() => {
      loadPuzzle(randomPuzzleIndex(index));
    }, delay);

    return () => window.clearTimeout(id);
  }, [solved, index, loadPuzzle]);

  const reset = useCallback(() => {
    loadPuzzle(randomPuzzleIndex(index));
  }, [index, loadPuzzle]);

  return (
    <div className="flex h-full items-stretch gap-5">
      <ChessBoard
        board={board}
        selected={selected}
        legalTargets={legalTargets}
        lastMove={lastMove}
        checkSquare={checkSquare}
        disabled={solved}
        onSquareClick={clickSquare}
      />

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
