import type { Chess, Color, PieceSymbol, Square } from "chess.js";

export type LastMove = {
  from: Square;
  to: Square;
};

export type BoardMatrix = ReturnType<Chess["board"]>;

export type MovePolicyResult = "accept" | "reject" | "pending-promotion";

export type MovePolicyContext = {
  game: Chess;
  from: Square;
  to: Square;
  promotion?: PieceSymbol;
};

export type PromotionPending = {
  from: Square;
  to: Square;
};

export type ChessDifficulty = 1 | 2 | 3;

export type ChessGameStatus =
  | "player-turn"
  | "promotion"
  | "ai-thinking"
  | "game-over";

export type ChessGameResult = "win" | "loss" | "draw" | null;

export type BoardOrientation = "white" | "black";

export type PlayableColor = Color;
