"use client";

import { useEffect, useState } from "react";
import { GameSelector } from "./GameSelector";
import { DEFAULT_GAME_ID, GAMES } from "./registry";

const STORAGE_KEY = "portfolio-active-game";

function getStoredGameId(): string {
  if (typeof window === "undefined") return DEFAULT_GAME_ID;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && GAMES.some((game) => game.id === stored)) {
    return stored;
  }

  return DEFAULT_GAME_ID;
}

export function GameHost() {
  const [activeId, setActiveId] = useState(DEFAULT_GAME_ID);

  useEffect(() => {
    setActiveId(getStoredGameId());
  }, []);

  const handleSelect = (id: string) => {
    setActiveId(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const activeGame = GAMES.find((game) => game.id === activeId) ?? GAMES[0];
  const ActiveComponent = activeGame.Component;

  return (
    <div className="game-host">
      <GameSelector
        games={GAMES.map(({ id, label, status }) => ({ id, label, status }))}
        activeId={activeId}
        onSelect={handleSelect}
      />
      <div
        id={`game-panel-${activeGame.id}`}
        role="tabpanel"
        aria-label={activeGame.label}
      >
        <ActiveComponent />
      </div>
    </div>
  );
}
