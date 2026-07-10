// The owner's ("mine") challenge score per game — the number visitors try to
// beat. Keyed by the game ids in components/games/registry.ts. Edit freely.
export const OWNER_SCORES: Record<string, number> = {
  "tic-tac-toe": 1,
  "2048": 12840,
  wurdle: 3,
  chess: 2,
  "chess-puzzles": 7,
};

export function ownerScoreFor(gameId: string): number {
  return OWNER_SCORES[gameId] ?? 0;
}
