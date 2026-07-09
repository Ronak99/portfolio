"use client";

import type { ComponentType } from "react";
import { useCallback, useEffect, useState } from "react";
import { useEnginePreload } from "@/hooks/useEnginePreload";
import { useEngineStatus } from "@/hooks/useEngineStatus";
import { GameLoadingShell } from "./GameLoadingShell";
import { GamePanel } from "./GamePanel";
import { getPlayableGames } from "./playableGames";
import { DEFAULT_GAME_ID, GAMES } from "./registry";
import type { GameDefinition } from "./types";

const REVEAL_DELAY_MS = 3500;

function randomGameId(pool: GameDefinition[], exclude?: string): string {
  const candidates = exclude
    ? pool.filter((game) => game.id !== exclude)
    : pool;
  const source = candidates.length > 0 ? candidates : pool;
  const choice =
    source[Math.floor(Math.random() * source.length)] ?? GAMES[0];
  return choice.id;
}

function LazyGame({ game }: { game: GameDefinition }) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setComponent(null);
    setLoadError(false);

    game
      .load()
      .then((mod) => {
        if (!cancelled) setComponent(() => mod.default);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [game]);

  if (loadError) {
    return (
      <div
        className="flex h-full items-center justify-center font-mono text-[11px]
                   tracking-[0.06em] text-faint-2"
        aria-live="polite"
      >
        couldn&apos;t load {game.label} — press s for another
      </div>
    );
  }

  if (!Component) return <GameLoadingShell label={game.label} />;

  return <Component />;
}

export function GameHost() {
  const [revealed, setRevealed] = useState(false);
  const [activeId, setActiveId] = useState(DEFAULT_GAME_ID);

  const engineStatus = useEngineStatus();
  useEnginePreload();

  // Let the hero copy land first, then fade the game in.
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 0 : REVEAL_DELAY_MS;
    const id = window.setTimeout(() => {
      setActiveId(randomGameId(getPlayableGames(GAMES, engineStatus)));
      setRevealed(true);
    }, delay);
    return () => window.clearTimeout(id);
    // Pool membership is read when the timer fires, not on every status change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShuffle = useCallback(() => {
    setActiveId((current) =>
      randomGameId(getPlayableGames(GAMES, engineStatus), current),
    );
  }, [engineStatus]);

  // s shuffles to another game.
  useEffect(() => {
    if (!revealed) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "s") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      event.preventDefault();
      handleShuffle();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleShuffle, revealed]);

  const activeGame = GAMES.find((game) => game.id === activeId) ?? GAMES[0];

  return (
    <div className="aspect-[16/9] w-full max-w-[534px]">
      {revealed ? (
        <div
          className="game-reveal is-in h-full w-full rounded-[5px] bg-base
                     transition-[background-color] duration-[450ms]
                     ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          <GamePanel name={activeGame.label} onShuffle={handleShuffle}>
            <LazyGame key={activeId} game={activeGame} />
          </GamePanel>
        </div>
      ) : null}
    </div>
  );
}
