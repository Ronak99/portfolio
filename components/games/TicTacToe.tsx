"use client";

import { useCallback, useState } from "react";

type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[];

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

const EMPTY_BOARD: Board = Array.from({ length: 9 }, () => null);

function getWinner(board: Board): Player | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function isDraw(board: Board): boolean {
  return board.every(Boolean) && !getWinner(board);
}

export function TicTacToe() {
  const [board, setBoard] = useState<Board>(EMPTY_BOARD);
  const [turn, setTurn] = useState<Player>("X");

  const winner = getWinner(board);
  const draw = isDraw(board);
  const gameOver = Boolean(winner || draw);

  const status = winner
    ? `${winner.toLowerCase()} wins`
    : draw
      ? "draw"
      : `${turn.toLowerCase()}'s turn`;

  const handleCellClick = useCallback(
    (index: number) => {
      if (gameOver || board[index]) return;

      setBoard((prev) => {
        const next = [...prev];
        next[index] = turn;
        return next;
      });
      setTurn((prev) => (prev === "X" ? "O" : "X"));
    },
    [board, gameOver, turn],
  );

  const handleCellKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleCellClick(index);
      }
    },
    [handleCellClick],
  );

  const handleReset = useCallback(() => {
    setBoard(EMPTY_BOARD);
    setTurn("X");
  }, []);

  return (
    <div className="game-panel ttt">
      <div className="ttt-head">
        <p className="mono ttt-status" aria-live="polite">
          {status}
        </p>
        <button type="button" className="mono ttt-reset" onClick={handleReset}>
          reset
        </button>
      </div>

      <div className="ttt-grid" role="grid" aria-label="tic tac toe board">
        {board.map((cell, index) => (
          <button
            key={index}
            type="button"
            className="ttt-cell"
            role="gridcell"
            aria-label={
              cell
                ? `${cell === "X" ? "x" : "o"} in cell ${index + 1}`
                : `empty cell ${index + 1}`
            }
            disabled={Boolean(cell) || gameOver}
            onClick={() => handleCellClick(index)}
            onKeyDown={(event) => handleCellKeyDown(event, index)}
          >
            {cell?.toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
