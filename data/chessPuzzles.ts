// Mate-in-one puzzles — white to move and deliver checkmate.
// Each puzzle was verified with chess.js (exactly one mating move).
// Back-rank mates excluded for variety.

export type ChessPuzzle = {
  fen: string;
  solution: string;
  source: string;
};

export const CHESS_PUZZLES: ChessPuzzle[] = [
  {
    fen: "3Q4/8/6pp/P3kp2/1PPb4/6PK/6P1/6q1 w - - 4 41",
    solution: "Qe7#",
    source: "https://lichess.org/training/COku5",
  },
  {
    fen: "r1bq1rk1/pp1n1p1p/4p1p1/2bp2P1/3Q1PNP/1BN5/PPP5/R3R1K1 w - - 1 19",
    solution: "Nh6#",
    source: "https://lichess.org/training/a124k",
  },
  {
    fen: "8/2p2b1R/5Nk1/1p4B1/5pKP/8/1Pn1p1P1/r7 w - - 0 36",
    solution: "h5#",
    source: "https://lichess.org/training/thcQK",
  },
  {
    fen: "r2q1b1r/pbp1kpp1/1p1p1nnp/1B1Pp3/4P2N/2N5/PPPB1PPP/R2QK2R w KQ - 6 11",
    solution: "Nf5#",
    source: "https://lichess.org/training/D96tP",
  },
  {
    fen: "6k1/pp3ppp/1b2p3/3qQ3/2r5/8/PB3PPP/R5K1 w - - 0 24",
    solution: "Qxg7#",
    source: "https://lichess.org/training/oCImc",
  },
  {
    fen: "r2r2kb/1p2pp1p/p2pn1pB/3N4/2P1P3/1P5P/P2q1PP1/2RR2K1 w - - 0 21",
    solution: "Nxe7#",
    source: "https://lichess.org/training/gkjJh",
  },
  {
    fen: "4r3/ppqn1p1p/2pbrk2/3p4/3P4/3B1P1P/PPPQ1P2/2K3RR w - - 0 18",
    solution: "Qg5#",
    source: "https://lichess.org/training/TtDMz",
  },
];

export function randomPuzzleIndex(exclude?: number): number {
  if (CHESS_PUZZLES.length === 1) return 0;
  let next = Math.floor(Math.random() * CHESS_PUZZLES.length);
  while (next === exclude) {
    next = Math.floor(Math.random() * CHESS_PUZZLES.length);
  }
  return next;
}
