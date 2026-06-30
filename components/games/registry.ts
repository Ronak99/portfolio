import { ChessGame } from "./ChessGame";
import { ChessPuzzles } from "./ChessPuzzles";
import { Game2048 } from "./Game2048";
import { TicTacToe } from "./TicTacToe";
import type { GameDefinition } from "./types";
import { Wurdle } from "./Wurdle";

export const GAMES: GameDefinition[] = [
  {
    id: "tic-tac-toe",
    label: "tic-tac-toe",
    status: "playable",
    Component: TicTacToe,
  },
  {
    id: "2048",
    label: "2048",
    status: "playable",
    Component: Game2048,
  },
  {
    id: "wurdle",
    label: "wordle",
    status: "playable",
    Component: Wurdle,
  },
  {
    id: "chess",
    label: "chess",
    status: "playable",
    Component: ChessGame,
  },
  {
    id: "chess-puzzles",
    label: "chess puzzles",
    status: "playable",
    Component: ChessPuzzles,
  },
];

export const DEFAULT_GAME_ID = GAMES[0].id;
