import { StockfishClient } from "./stockfishClient";

export type EngineStatus = "idle" | "loading" | "ready" | "failed";

let client: StockfishClient | null = null;
let status: EngineStatus = "idle";
let initPromise: Promise<void> | null = null;

const listeners = new Set<() => void>();

function setStatus(next: EngineStatus) {
  if (status === next) return;
  status = next;
  for (const listener of listeners) listener();
}

/**
 * Kick off (or reuse) a single Stockfish worker for the whole session. Safe to
 * call repeatedly: once loading has started every call returns the same promise,
 * and a ready engine resolves immediately.
 */
export function preloadEngine(): Promise<void> {
  if (status === "ready") return Promise.resolve();
  if (status === "failed") {
    return Promise.reject(new Error("Stockfish engine failed to load"));
  }
  if (initPromise) return initPromise;

  setStatus("loading");

  initPromise = (async () => {
    const nextClient = new StockfishClient();
    await nextClient.init();
    client = nextClient;
    setStatus("ready");
  })().catch((error) => {
    client?.quit();
    client = null;
    initPromise = null;
    setStatus("failed");
    throw error;
  });

  return initPromise;
}

export function getEngineStatus(): EngineStatus {
  return status;
}

/** The live client, only available once the engine is fully ready. */
export function getEngineClient(): StockfishClient | null {
  return status === "ready" ? client : null;
}

export function subscribeEngineStatus(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Mark the engine dead after a runtime failure (e.g. a worker crash mid-game)
 * so the shuffle pool stops offering vs-AI chess for the rest of the session.
 */
export function reportEngineFailure(): void {
  if (status === "failed") return;
  client?.quit();
  client = null;
  initPromise = null;
  setStatus("failed");
}
