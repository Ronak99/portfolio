"use client";

import { useCallback, useRef, useState } from "react";
import {
  getEngineClient,
  preloadEngine,
  reportEngineFailure,
} from "@/lib/stockfish/enginePool";
import type { BestMove } from "@/lib/stockfish/stockfishClient";
import { useEngineStatus } from "@/hooks/useEngineStatus";
import type { ChessDifficulty } from "./types";

const CPU_THINK_MS = 420;

type UseStockfishEngineResult = {
  requestMove: (fen: string, difficulty: ChessDifficulty) => Promise<BestMove>;
  isReady: boolean;
  isThinking: boolean;
  error: string | null;
};

export function useStockfishEngine(): UseStockfishEngineResult {
  const requestIdRef = useRef(0);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const status = useEngineStatus();
  const isReady = status === "ready";
  const engineError = status === "failed" ? "engine unavailable" : error;

  const requestMove = useCallback(
    async (fen: string, difficulty: ChessDifficulty): Promise<BestMove> => {
      const requestId = ++requestIdRef.current;
      setIsThinking(true);
      setError(null);

      try {
        // The engine is preloaded before chess ever enters the pool, but call
        // through preload once more so a warm client is guaranteed here.
        await preloadEngine();
        const client = getEngineClient();
        if (!client) {
          throw new Error("Engine unavailable");
        }

        const move = await client.requestMove(fen, difficulty);

        if (requestId !== requestIdRef.current) {
          throw new Error("Stale engine response");
        }

        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduced) {
          await new Promise((resolve) => {
            window.setTimeout(resolve, CPU_THINK_MS);
          });
        }

        if (requestId !== requestIdRef.current) {
          throw new Error("Stale engine response");
        }

        return move;
      } catch (requestError) {
        const isStale =
          requestError instanceof Error &&
          requestError.message === "Stale engine response";

        // A genuine failure (worker crash, timeout) retires the engine for the
        // session so the shuffle pool stops offering vs-AI chess. Stale
        // responses from shuffling away must not retire a healthy engine.
        if (!isStale) {
          reportEngineFailure();
        }
        if (requestId === requestIdRef.current) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Engine move failed",
          );
        }
        throw requestError;
      } finally {
        if (requestId === requestIdRef.current) {
          setIsThinking(false);
        }
      }
    },
    [],
  );

  return {
    requestMove,
    isReady,
    isThinking,
    error: engineError,
  };
}
