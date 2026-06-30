"use client";

import {
  Chess as ChessEngine,
  type Color,
  type PieceSymbol,
  type Square,
} from "chess.js";
import { useCallback, useMemo, useRef, useState } from "react";
import { findCheckSquare, squareName } from "./chessUtils";
import type {
  LastMove,
  MovePolicyContext,
  MovePolicyResult,
  PromotionPending,
} from "./types";

type UseChessInteractionOptions = {
  initialFen: string;
  playableColor?: Color;
  disabled?: boolean;
  autoQueenPromotion?: boolean;
  movePolicy: (ctx: MovePolicyContext) => MovePolicyResult;
  onMoveAccepted?: (ctx: {
    from: Square;
    to: Square;
    fen: string;
    promotion?: PieceSymbol;
  }) => void;
  onMoveRejected?: () => void;
  onPromotionPending?: (pending: PromotionPending) => void;
};

export function useChessInteraction({
  initialFen,
  playableColor = "w",
  disabled = false,
  autoQueenPromotion = false,
  movePolicy,
  onMoveAccepted,
  onMoveRejected,
  onPromotionPending,
}: UseChessInteractionOptions) {
  const gameRef = useRef(new ChessEngine(initialFen));
  const [fen, setFen] = useState(initialFen);
  const [selected, setSelected] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<LastMove | null>(null);

  const loadPosition = useCallback((nextFen: string) => {
    gameRef.current = new ChessEngine(nextFen);
    setFen(nextFen);
    setSelected(null);
    setLastMove(null);
  }, []);

  const board = useMemo(() => gameRef.current.board(), [fen]);

  const checkSquare = useMemo(() => findCheckSquare(gameRef.current), [fen]);

  const legalTargets = useMemo(() => {
    if (!selected || disabled) return new Map<Square, boolean>();
    const moves = gameRef.current.moves({ square: selected, verbose: true });
    const targets = new Map<Square, boolean>();
    for (const move of moves) {
      targets.set(move.to, Boolean(move.captured));
    }
    return targets;
  }, [selected, fen, disabled]);

  const applyMove = useCallback(
    (from: Square, to: Square, promotion?: PieceSymbol) => {
      const game = gameRef.current;
      const verbose = game
        .moves({ square: from, verbose: true })
        .find((move) => move.to === to);

      if (!verbose) return false;

      if (verbose.promotion && !promotion && !autoQueenPromotion) {
        onPromotionPending?.({ from, to });
        setSelected(null);
        return false;
      }

      game.move({
        from,
        to,
        promotion:
          promotion ?? (verbose.promotion ? ("q" as PieceSymbol) : undefined),
      });

      const policyResult = movePolicy({
        game,
        from,
        to,
        promotion:
          promotion ?? (verbose.promotion ? ("q" as PieceSymbol) : undefined),
      });

      if (policyResult === "reject") {
        game.undo();
        setSelected(null);
        onMoveRejected?.();
        return false;
      }

      setLastMove({ from, to });
      setSelected(null);
      setFen(game.fen());
      onMoveAccepted?.({
        from,
        to,
        fen: game.fen(),
        promotion:
          promotion ?? (verbose.promotion ? ("q" as PieceSymbol) : undefined),
      });
      return true;
    },
    [
      autoQueenPromotion,
      movePolicy,
      onMoveAccepted,
      onMoveRejected,
      onPromotionPending,
    ],
  );

  const clickSquare = useCallback(
    (r: number, c: number) => {
      if (disabled) return;

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
          .find((move) => move.to === square);

        if (verbose) {
          if (verbose.promotion && !autoQueenPromotion) {
            onPromotionPending?.({ from: selected, to: square });
            setSelected(null);
            return;
          }

          game.move({
            from: selected,
            to: square,
            promotion: verbose.promotion ? "q" : undefined,
          });

          const policyResult = movePolicy({
            game,
            from: selected,
            to: square,
            promotion: verbose.promotion ? "q" : undefined,
          });

          if (policyResult === "reject") {
            game.undo();
            setSelected(null);
            onMoveRejected?.();
            return;
          }

          setLastMove({ from: selected, to: square });
          setSelected(null);
          setFen(game.fen());
          onMoveAccepted?.({
            from: selected,
            to: square,
            fen: game.fen(),
            promotion: verbose.promotion ? "q" : undefined,
          });
          return;
        }

        if (piece && piece.color === playableColor) {
          setSelected(square);
          return;
        }

        setSelected(null);
        return;
      }

      if (piece && piece.color === playableColor) {
        setSelected(square);
      }
    },
    [
      autoQueenPromotion,
      disabled,
      movePolicy,
      onMoveAccepted,
      onMoveRejected,
      onPromotionPending,
      playableColor,
      selected,
    ],
  );

  return {
    gameRef,
    fen,
    setFen,
    board,
    selected,
    setSelected,
    lastMove,
    setLastMove,
    checkSquare,
    legalTargets,
    loadPosition,
    applyMove,
    clickSquare,
  };
}
