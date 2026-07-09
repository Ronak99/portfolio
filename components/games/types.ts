import type { ComponentType } from "react";

export type GameStatus = "playable" | "coming-soon";

export type EngineRequirement = "none" | "stockfish";

export type GameDefinition = {
  id: string;
  label: string;
  status: GameStatus;
  engineRequirement: EngineRequirement;
  load: () => Promise<{ default: ComponentType }>;
};
