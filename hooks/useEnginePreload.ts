"use client";

import { useEffect } from "react";
import { preloadEngine } from "@/lib/stockfish/enginePool";

/**
 * Start downloading the Stockfish worker in the background once the browser is
 * idle, so the ~7 MB WASM never competes with first paint, fonts, or CSS. The
 * preload is fire-and-forget: failures leave the engine in a `failed` state and
 * vs-AI chess simply stays out of the shuffle pool.
 */
export function useEnginePreload() {
  useEffect(() => {
    const start = () => {
      void preloadEngine().catch(() => {});
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 5000 });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(start, 2000);
    return () => window.clearTimeout(id);
  }, []);
}
