"use client";

import { useCallback, useEffect, useState } from "react";
import { GamePanel } from "./GamePanel";
import { DEFAULT_GAME_ID, GAMES } from "./registry";

const REVEAL_DELAY_MS = 3500;

function randomGameId(exclude?: string): string {
  const pool = exclude
    ? GAMES.filter((game) => game.id !== exclude)
    : GAMES;
  const choice = pool[Math.floor(Math.random() * pool.length)] ?? GAMES[0];
  return choice.id;
}

export function GameHost() {
  const [revealed, setRevealed] = useState(false);
  const [activeId, setActiveId] = useState(DEFAULT_GAME_ID);

  // Let the hero copy land first, then fade the game in.
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 0 : REVEAL_DELAY_MS;
    const id = window.setTimeout(() => {
      setActiveId(randomGameId());
      setRevealed(true);
    }, delay);
    return () => window.clearTimeout(id);
  }, []);

  const handleShuffle = useCallback(() => {
    setActiveId((current) => randomGameId(current));
  }, []);

  // s shuffles to another game (skip while wurdle is active — s is a letter key).
  useEffect(() => {
    if (!revealed) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "s") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (activeId === "wurdle") return;

      event.preventDefault();
      handleShuffle();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeId, handleShuffle, revealed]);

  const activeGame = GAMES.find((game) => game.id === activeId) ?? GAMES[0];
  const ActiveComponent = activeGame.Component;

  return (
    <div className="aspect-[16/9] w-full max-w-[534px]">
      {revealed ? (
        <div
          className="game-reveal is-in h-full w-full rounded-[5px] bg-base
                     transition-[background-color] duration-[450ms]
                     ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          <GamePanel name={activeGame.label} onShuffle={handleShuffle}>
            <ActiveComponent key={activeId} />
          </GamePanel>
        </div>
      ) : null}
    </div>
  );
}
