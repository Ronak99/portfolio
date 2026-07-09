"use client";

import { useSyncExternalStore } from "react";
import {
  getEngineStatus,
  subscribeEngineStatus,
  type EngineStatus,
} from "@/lib/stockfish/enginePool";

export function useEngineStatus(): EngineStatus {
  return useSyncExternalStore(
    subscribeEngineStatus,
    getEngineStatus,
    () => "idle" as EngineStatus,
  );
}
