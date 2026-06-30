// Mate-in-one puzzles — white to move and deliver checkmate.
export const CHESS_PUZZLES: string[] = [
  "6k1/5ppp/8/8/8/8/8/R6K w - - 0 1", // Ra8#
  "6k1/5ppp/8/8/8/8/5PPP/4Q1K1 w - - 0 1", // Qe8#
  "7k/8/6QK/8/8/8/8/8 w - - 0 1", // Qg7#
  "6k1/8/6K1/8/8/8/8/7R w - - 0 1", // Rh8#
];

export function randomPuzzleIndex(exclude?: number): number {
  if (CHESS_PUZZLES.length === 1) return 0;
  let next = Math.floor(Math.random() * CHESS_PUZZLES.length);
  while (next === exclude) {
    next = Math.floor(Math.random() * CHESS_PUZZLES.length);
  }
  return next;
}
