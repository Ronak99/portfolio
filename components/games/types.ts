import type { ComponentType } from "react";

export type GameStatus = "playable" | "coming-soon";

export type GameDefinition = {
  id: string;
  label: string;
  status: GameStatus;
  Component: ComponentType;
};
