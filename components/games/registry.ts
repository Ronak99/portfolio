import type { GameDefinition } from "./types";

export const GAMES: GameDefinition[] = [
  {
    id: "tic-tac-toe",
    label: "tic-tac-toe",
    status: "playable",
    engineRequirement: "none",
    load: () => import("./TicTacToe").then((m) => ({ default: m.TicTacToe })),
  },
  {
    id: "2048",
    label: "2048",
    status: "playable",
    engineRequirement: "none",
    load: () => import("./Game2048").then((m) => ({ default: m.Game2048 })),
  },
  {
    id: "wurdle",
    label: "wordle",
    status: "playable",
    engineRequirement: "none",
    load: () => import("./Wurdle").then((m) => ({ default: m.Wurdle })),
  },
  {
    id: "chess",
    label: "chess",
    status: "playable",
    engineRequirement: "stockfish",
    load: () => import("./ChessGame").then((m) => ({ default: m.ChessGame })),
  },
  {
    id: "chess-puzzles",
    label: "chess puzzles",
    status: "playable",
    engineRequirement: "none",
    load: () =>
      import("./ChessPuzzles").then((m) => ({ default: m.ChessPuzzles })),
  },
];

export const DEFAULT_GAME_ID = GAMES[0].id;
