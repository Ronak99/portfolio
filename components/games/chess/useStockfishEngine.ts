"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { StockfishClient } from "@/lib/stockfish/stockfishClient";
import type { BestMove } from "@/lib/stockfish/stockfishClient";
import type { ChessDifficulty } from "./types";

const CPU_THINK_MS = 420;

type UseStockfishEngineResult = {
  requestMove: (fen: string, difficulty: ChessDifficulty) => Promise<BestMove>;
  isReady: boolean;
  isThinking: boolean;
  error: string | null;
};

export function useStockfishEngine(): UseStockfishEngineResult {
  const clientRef = useRef<StockfishClient | null>(null);
  const requestIdRef = useRef(0);
  const [isReady, setIsReady] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const client = new StockfishClient();
    clientRef.current = client;

    client
      .init()
      .then(() => {
        setIsReady(true);
      })
      .catch((initError) => {
        setError(
          initError instanceof Error
            ? initError.message
            : "Engine unavailable",
        );
      });

    return () => {
      requestIdRef.current += 1;
      client.quit();
      clientRef.current = null;
    };
  }, []);

  const requestMove = useCallback(
    async (fen: string, difficulty: ChessDifficulty): Promise<BestMove> => {
      const client = clientRef.current;
      if (!client) {
        throw new Error("Engine unavailable");
      }

      const requestId = ++requestIdRef.current;
      setIsThinking(true);
      setError(null);

      try {
        await client.ensureReady();
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
    error,
  };
}
