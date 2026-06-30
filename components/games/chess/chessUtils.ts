import type { Chess, Color, PieceSymbol, Square } from "chess.js";

export const PIECE_NAMES: Record<PieceSymbol, string> = {
  p: "pawn",
  n: "knight",
  b: "bishop",
  r: "rook",
  q: "queen",
  k: "king",
};

export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

export const STARTING_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function squareName(r: number, c: number): Square {
  return `${FILES[c]}${8 - r}` as Square;
}

export function findKingSquare(game: Chess, color: Color): Square | null {
  const board = game.board();
  for (let r = 0; r < board.length; r += 1) {
    for (let c = 0; c < board[r].length; c += 1) {
      const piece = board[r][c];
      if (piece?.type === "k" && piece.color === color) {
        return squareName(r, c);
      }
    }
  }
  return null;
}

export function findCheckSquare(game: Chess): Square | null {
  if (!game.inCheck()) return null;
  return findKingSquare(game, game.turn());
}

export function parseUciMove(uci: string): {
  from: Square;
  to: Square;
  promotion?: PieceSymbol;
} | null {
  const trimmed = uci.trim();
  if (trimmed === "(none)" || trimmed.length < 4) return null;

  const from = trimmed.slice(0, 2) as Square;
  const to = trimmed.slice(2, 4) as Square;
  const promotion = trimmed[4] as PieceSymbol | undefined;

  return {
    from,
    to,
    promotion: promotion || undefined,
  };
}

export function drawReason(game: Chess): string {
  if (game.isStalemate()) return "stalemate";
  if (game.isThreefoldRepetition()) return "threefold repetition";
  if (game.isInsufficientMaterial()) return "insufficient material";
  if (game.isDraw()) return "draw";
  return "draw";
}
