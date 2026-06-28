import { Chess, type Color, type Move, type PieceSymbol } from "chess.js";

export type Difficulty = "easy" | "normal" | "hard";

const SEARCH_DEPTH: Record<Difficulty, number> = {
  easy: 1,
  normal: 2,
  hard: 3,
};

const PIECE_VALUE: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-square tables (from White's perspective, a8 -> h1 reading order to
// match chess.js board()). Values nudge the engine toward sensible development,
// centre control, and king safety. Black mirrors these vertically.
// prettier-ignore
const PAWN_PST = [
   0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0,
];
// prettier-ignore
const KNIGHT_PST = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];
// prettier-ignore
const BISHOP_PST = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];
// prettier-ignore
const ROOK_PST = [
   0,  0,  0,  0,  0,  0,  0,  0,
   5, 10, 10, 10, 10, 10, 10,  5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
   0,  0,  0,  5,  5,  0,  0,  0,
];
// prettier-ignore
const QUEEN_PST = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20,
];
// prettier-ignore
const KING_PST = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20,
];

const PST: Record<PieceSymbol, number[]> = {
  p: PAWN_PST,
  n: KNIGHT_PST,
  b: BISHOP_PST,
  r: ROOK_PST,
  q: QUEEN_PST,
  k: KING_PST,
};

/**
 * Static evaluation from the perspective of `perspective` (positive = good for
 * that colour). Combines material with piece-square placement.
 */
function evaluate(game: Chess, perspective: Color): number {
  const board = game.board();
  let score = 0;

  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const piece = board[rank][file];
      if (!piece) continue;

      // board() is rank 8 -> rank 1; PST is indexed the same way for White,
      // and mirrored vertically for Black.
      const index = rank * 8 + file;
      const pstIndex = piece.color === "w" ? index : (7 - rank) * 8 + file;
      const value = PIECE_VALUE[piece.type] + PST[piece.type][pstIndex];

      score += piece.color === perspective ? value : -value;
    }
  }

  return score;
}

/**
 * Order moves so that captures (most-valuable-victim first) are searched early.
 * Better move ordering makes alpha-beta pruning far more effective.
 */
function orderMoves(moves: Move[]): Move[] {
  return [...moves].sort((a, b) => captureScore(b) - captureScore(a));
}

function captureScore(move: Move): number {
  if (!move.captured) return 0;
  return PIECE_VALUE[move.captured] - PIECE_VALUE[move.piece] / 10;
}

const MATE_SCORE = 1_000_000;

function negamax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  perspective: Color,
): number {
  if (game.isGameOver()) {
    if (game.isCheckmate()) {
      // Side to move is checkmated. Prefer faster mates / slower losses via depth.
      const mated = game.turn();
      const sign = mated === perspective ? -1 : 1;
      return sign * (MATE_SCORE + depth);
    }
    return 0; // stalemate, draw, etc.
  }

  if (depth === 0) {
    return game.turn() === perspective
      ? evaluate(game, perspective)
      : -evaluate(game, perspective);
  }

  let best = -Infinity;
  const moves = orderMoves(game.moves({ verbose: true }) as Move[]);

  for (const move of moves) {
    game.move(move);
    const score = -negamax(game, depth - 1, -beta, -alpha, perspective);
    game.undo();

    if (score > best) best = score;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }

  return best;
}

/**
 * Pick a move for the side to move in `fen`. Returns the chosen move in
 * `{ from, to, promotion }` form, or null if there are no legal moves.
 */
export function chooseMove(
  fen: string,
  difficulty: Difficulty,
): { from: string; to: string; promotion?: string } | null {
  const game = new Chess(fen);
  const perspective = game.turn();
  const moves = game.moves({ verbose: true }) as Move[];
  if (moves.length === 0) return null;

  // Easy: mostly random, but never miss a free capture-by-mate or a hanging
  // queen — depth 1 already covers immediate tactics.
  const depth = SEARCH_DEPTH[difficulty];

  let bestScore = -Infinity;
  let candidates: Move[] = [];

  for (const move of orderMoves(moves)) {
    game.move(move);
    const score = -negamax(
      game,
      depth - 1,
      -Infinity,
      Infinity,
      perspective,
    );
    game.undo();

    if (score > bestScore) {
      bestScore = score;
      candidates = [move];
    } else if (score === bestScore) {
      candidates.push(move);
    }
  }

  // Tie-break randomly among equally good moves for variety between games.
  const choice = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    from: choice.from,
    to: choice.to,
    promotion: choice.promotion,
  };
}
