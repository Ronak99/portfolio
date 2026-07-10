"use client";

import type { PieceSymbol } from "chess.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChessBoard } from "./chess/ChessBoard";
import { drawReason, parseUciMove, STARTING_FEN } from "./chess/chessUtils";
import type {
  ChessDifficulty,
  ChessGameResult,
  ChessGameStatus,
  MovePolicyContext,
  MovePolicyResult,
  PromotionPending,
} from "./chess/types";
import { useChessInteraction } from "./chess/useChessInteraction";
import { useStockfishEngine } from "./chess/useStockfishEngine";
import { useGameScore } from "./GameScoreContext";

const DIFFICULTIES: { level: ChessDifficulty; label: string }[] = [
  { level: 1, label: "easy" },
  { level: 2, label: "medium" },
  { level: 3, label: "hard" },
];

const PROMOTION_CHOICES: PieceSymbol[] = ["q", "r", "b", "n"];

function playerMovePolicy(_ctx: MovePolicyContext): MovePolicyResult {
  return "accept";
}

function statusMessage(
  status: ChessGameStatus,
  result: ChessGameResult,
  resultReason: string,
  inCheck: boolean,
  engineError: string | null,
  isReady: boolean,
): string {
  if (engineError) return "engine unavailable";
  if (!isReady && status !== "game-over") return "loading engine…";

  if (status === "game-over") {
    if (result === "win") return "checkmate - you win";
    if (result === "loss") return "checkmate - you lose";
    if (result === "draw") {
      if (resultReason === "stalemate") return "stalemate - draw";
      return `${resultReason} - draw`;
    }
    return "game over";
  }

  if (status === "promotion") return "choose promotion";
  if (status === "ai-thinking") return "engine thinking…";
  if (inCheck) return "check - your move";
  return "your move";
}

export function ChessGame() {
  const { setYou } = useGameScore();
  const [status, setStatus] = useState<ChessGameStatus>("player-turn");
  const [result, setResult] = useState<ChessGameResult>(null);
  const [resultReason, setResultReason] = useState("");
  const [difficulty, setDifficulty] = useState<ChessDifficulty>(2);
  const [pendingDifficulty, setPendingDifficulty] =
    useState<ChessDifficulty | null>(null);
  const [promotion, setPromotion] = useState<PromotionPending | null>(null);
  const [, setWins] = useState(0);
  const difficultyRef = useRef(difficulty);
  const statusRef = useRef(status);
  const recordedRef = useRef(false);

  // Count each win over the engine once and report it as YOU.
  useEffect(() => {
    if (status !== "game-over" || result !== "win" || recordedRef.current) {
      return;
    }
    recordedRef.current = true;
    setWins((prev) => {
      const next = prev + 1;
      setYou(next);
      return next;
    });
  }, [status, result, setYou]);

  const { requestMove, isThinking, isReady, error: engineError } =
    useStockfishEngine();

  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const finishIfGameOverRef = useRef<(afterPlayerMove: boolean) => boolean>(
    () => false,
  );
  const runAiTurnRef = useRef<(fen: string) => Promise<void>>(async () => {});

  const {
    gameRef,
    fen,
    board,
    selected,
    legalTargets,
    checkSquare,
    lastMove,
    loadPosition,
    applyMove,
    clickSquare,
    setFen,
    setLastMove,
  } = useChessInteraction({
    initialFen: STARTING_FEN,
    playableColor: "w",
    disabled: status !== "player-turn",
    autoQueenPromotion: false,
    movePolicy: playerMovePolicy,
    onPromotionPending: (pending) => {
      setPromotion(pending);
      setStatus("promotion");
    },
    onMoveAccepted: ({ fen }) => {
      setPromotion(null);
      if (!finishIfGameOverRef.current(true)) {
        void runAiTurnRef.current(fen);
      }
    },
  });

  const finishIfGameOver = useCallback((afterPlayerMove: boolean) => {
    const game = gameRef.current;

    if (game.isCheckmate()) {
      setResult(afterPlayerMove ? "win" : "loss");
      setResultReason("checkmate");
      setStatus("game-over");
      return true;
    }

    if (game.isGameOver()) {
      setResult("draw");
      setResultReason(drawReason(game));
      setStatus("game-over");
      return true;
    }

    return false;
  }, [gameRef]);

  const runAiTurn = useCallback(
    async (fen: string) => {
      setStatus("ai-thinking");

      try {
        const bestMove = await requestMove(fen, difficultyRef.current);
        if (statusRef.current === "game-over") return;

        const parsed = parseUciMove(bestMove.uci);
        if (!parsed) {
          throw new Error("Invalid engine move");
        }

        const applied = gameRef.current.move({
          from: parsed.from,
          to: parsed.to,
          promotion: parsed.promotion,
        });

        if (!applied) {
          throw new Error("Illegal engine move");
        }

        setLastMove({ from: parsed.from, to: parsed.to });
        setFen(gameRef.current.fen());

        if (!finishIfGameOver(false)) {
          setStatus("player-turn");
        }
      } catch {
        if (statusRef.current !== "game-over") {
          setStatus("game-over");
          setResult(null);
          setResultReason("engine unavailable");
        }
      }
    },
    [finishIfGameOver, gameRef, requestMove, setFen, setLastMove],
  );

  useEffect(() => {
    finishIfGameOverRef.current = finishIfGameOver;
    runAiTurnRef.current = runAiTurn;
  }, [finishIfGameOver, runAiTurn]);

  const resetGame = useCallback(() => {
    recordedRef.current = false;
    loadPosition(STARTING_FEN);
    setStatus("player-turn");
    setResult(null);
    setResultReason("");
    setPromotion(null);
  }, [loadPosition]);

  const handleDifficultyChange = useCallback(
    (level: ChessDifficulty) => {
      if (level === difficulty) return;

      const gameInProgress = fen !== STARTING_FEN;
      if (!gameInProgress) {
        setDifficulty(level);
        return;
      }

      setPendingDifficulty(level);
    },
    [difficulty, fen],
  );

  const confirmDifficultyChange = useCallback(() => {
    if (!pendingDifficulty) return;
    setDifficulty(pendingDifficulty);
    setPendingDifficulty(null);
    resetGame();
  }, [pendingDifficulty, resetGame]);

  const cancelDifficultyChange = useCallback(() => {
    setPendingDifficulty(null);
  }, []);

  const handlePromotion = useCallback(
    (piece: PieceSymbol) => {
      if (!promotion) return;

      const applied = applyMove(promotion.from, promotion.to, piece);
      if (!applied) {
        setPromotion(null);
        setStatus("player-turn");
      }
    },
    [applyMove, promotion],
  );

  const inCheck = Boolean(checkSquare);

  const message = statusMessage(
    status,
    result,
    resultReason,
    inCheck,
    engineError,
    isReady,
  );

  const boardDisabled =
    status === "ai-thinking" ||
    status === "game-over" ||
    status === "promotion" ||
    isThinking ||
    !isReady ||
    Boolean(engineError);

  return (
    <div className="flex h-full items-stretch gap-5">
      <ChessBoard
        board={board}
        selected={selected}
        legalTargets={legalTargets}
        lastMove={lastMove}
        checkSquare={checkSquare}
        disabled={boardDisabled}
        onSquareClick={clickSquare}
      />

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5 font-mono">
        <div className="flex flex-col gap-1.5">
          <span
            className={[
              "text-[13px]",
              status === "game-over" && result === "win"
                ? "text-accent"
                : "text-status",
            ].join(" ")}
            aria-live="polite"
          >
            {message}
          </span>
          <span className="text-[10px] tracking-[0.06em] text-faint-2">
            {status === "promotion"
              ? "pick a piece to promote"
              : "tap a piece, then its target"}
          </span>

          {status === "promotion" ? (
            <div className="mt-1 flex gap-2">
              {PROMOTION_CHOICES.map((piece) => (
                <button
                  key={piece}
                  type="button"
                  onClick={() => handlePromotion(piece)}
                  className="cursor-pointer rounded-[3px] border border-hair px-2 py-1 text-[11px]
                             uppercase text-muted-2 transition-colors hover:border-hair-strong
                             hover:text-hover"
                >
                  {piece}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="chess-controls !mt-0">
          {pendingDifficulty ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] tracking-[0.04em] text-status">
                changing difficulty resets your game
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={confirmDifficultyChange}
                  className="cursor-pointer text-[11px] text-muted-2 transition-colors hover:text-hover"
                >
                  confirm
                </button>
                <button
                  type="button"
                  onClick={cancelDifficultyChange}
                  className="cursor-pointer text-[11px] text-faint-2 transition-colors hover:text-muted-2"
                >
                  cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="chess-levels" role="group" aria-label="difficulty">
              {DIFFICULTIES.map(({ level, label }) => (
                <button
                  key={level}
                  type="button"
                  className="chess-level"
                  aria-pressed={difficulty === level}
                  onClick={() => handleDifficultyChange(level)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <span
            role="button"
            tabIndex={0}
            onClick={resetGame}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                resetGame();
              }
            }}
            className="cursor-pointer text-[12px] text-muted-2 transition-colors hover:text-hover"
          >
            rematch ↻
          </span>
        </div>
      </div>
    </div>
  );
}
