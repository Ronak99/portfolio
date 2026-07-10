"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type GameScoreValue = {
  /** The visitor's live score for the active game (`null` until they start). */
  you: number | null;
  /** Report the visitor's current score. */
  setYou: (value: number | null) => void;
  /** Clear the visitor's score (called when the active game changes). */
  resetYou: () => void;
};

const GameScoreContext = createContext<GameScoreValue | null>(null);

export function GameScoreProvider({ children }: { children: ReactNode }) {
  const [you, setYou] = useState<number | null>(null);

  const resetYou = useCallback(() => setYou(null), []);

  const value = useMemo<GameScoreValue>(
    () => ({ you, setYou, resetYou }),
    [you, resetYou],
  );

  return (
    <GameScoreContext.Provider value={value}>
      {children}
    </GameScoreContext.Provider>
  );
}

/**
 * Access the shared MINE x YOU scoreboard. Games call `setYou` to report the
 * visitor's score; the panel header reads `you`. Safe to call outside a
 * provider — it degrades to a no-op so games stay standalone-renderable.
 */
export function useGameScore(): GameScoreValue {
  const ctx = useContext(GameScoreContext);
  if (ctx) return ctx;
  return NOOP_SCORE;
}

const NOOP_SCORE: GameScoreValue = {
  you: null,
  setYou: () => {},
  resetYou: () => {},
};
