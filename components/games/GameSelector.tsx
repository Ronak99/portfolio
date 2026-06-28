"use client";

type GameSelectorProps = {
  games: { id: string; label: string; status: "playable" | "coming-soon" }[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function GameSelector({ games, activeId, onSelect }: GameSelectorProps) {
  return (
    <div className="game-selector" role="tablist" aria-label="games">
      {games.map((game) => (
        <button
          key={game.id}
          type="button"
          role="tab"
          className="game-selector-tab"
          aria-selected={activeId === game.id}
          aria-controls={`game-panel-${game.id}`}
          onClick={() => onSelect(game.id)}
        >
          {game.label}
        </button>
      ))}
    </div>
  );
}
