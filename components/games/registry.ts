import { Chess } from "./Chess";
import { TicTacToe } from "./TicTacToe";
import type { GameDefinition } from "./types";
import { Wurdle } from "./Wurdle";

export const GAMES: GameDefinition[] = [
  {
    id: "tic-tac-toe",
    label: "tic tac toe",
    status: "playable",
    Component: TicTacToe,
  },
  {
    id: "wurdle",
    label: "wurdle",
    status: "playable",
    Component: Wurdle,
  },
  {
    id: "chess",
    label: "chess",
    status: "playable",
    Component: Chess,
  },
];

export const DEFAULT_GAME_ID = GAMES[0].id;
