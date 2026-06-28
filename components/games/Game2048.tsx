"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SIZE = 4;
const CELLS = SIZE * SIZE;
const WIN_VALUE = 2048;
const BEST_KEY = "g2048-best";
const GAP = 6;
const PAD = 6;
const SWIPE_THRESHOLD = 24;

type Direction = "up" | "down" | "left" | "right";
type GameState = "playing" | "won" | "lost";

type Tile = {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  justMerged?: boolean;
};

let nextTileId = 0;

function makeTile(value: number, row: number, col: number, isNew = false): Tile {
  return { id: nextTileId++, value, row, col, isNew };
}

function boardFromTiles(tiles: Tile[]): number[] {
  const board = Array.from({ length: CELLS }, () => 0);
  for (const tile of tiles) {
    board[tile.row * SIZE + tile.col] = tile.value;
  }
  return board;
}

function emptyIndices(tiles: Tile[]): number[] {
  const occupied = new Set(tiles.map((t) => t.row * SIZE + t.col));
  const out: number[] = [];
  for (let i = 0; i < CELLS; i += 1) {
    if (!occupied.has(i)) out.push(i);
  }
  return out;
}

function spawn(tiles: Tile[]): Tile[] {
  const empties = emptyIndices(tiles);
  if (empties.length === 0) return tiles;
  const index = empties[Math.floor(Math.random() * empties.length)];
  const row = Math.floor(index / SIZE);
  const col = index % SIZE;
  return [
    ...tiles.map((t) => ({ ...t, isNew: false, justMerged: false })),
    makeTile(Math.random() < 0.9 ? 2 : 4, row, col, true),
  ];
}

function moveTiles(
  tiles: Tile[],
  dir: Direction,
): { tiles: Tile[]; gained: number; moved: boolean } {
  let gained = 0;
  const removedIds = new Set<number>();
  const next: Tile[] = [];

  for (let line = 0; line < SIZE; line += 1) {
    const horizontal = dir === "left" || dir === "right";
    const reversed = dir === "right" || dir === "down";

    let lineTiles = tiles.filter((t) =>
      horizontal ? t.row === line : t.col === line,
    );
    lineTiles.sort((a, b) =>
      horizontal ? a.col - b.col : a.row - b.row,
    );
    if (reversed) lineTiles = [...lineTiles].reverse();

    const mergedLine: Tile[] = [];
    for (const tile of lineTiles) {
      const prev = mergedLine[mergedLine.length - 1];
      if (prev && prev.value === tile.value && !prev.justMerged) {
        prev.value *= 2;
        prev.justMerged = true;
        gained += prev.value;
        removedIds.add(tile.id);
      } else {
        mergedLine.push({
          ...tile,
          isNew: false,
          justMerged: false,
        });
      }
    }

    mergedLine.forEach((tile, idx) => {
      const pos = reversed ? SIZE - 1 - idx : idx;
      next.push(
        horizontal ? { ...tile, col: pos } : { ...tile, row: pos },
      );
    });
  }

  const moved =
    removedIds.size > 0 ||
    tiles.some((tile) => {
      const after = next.find((t) => t.id === tile.id);
      return (
        !after || after.row !== tile.row || after.col !== tile.col
      );
    });

  return { tiles: next, gained, moved };
}

function hasMoves(tiles: Tile[]): boolean {
  const board = boardFromTiles(tiles);
  if (emptyIndices(tiles).length > 0) return true;
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      const v = board[r * SIZE + c];
      if (c < SIZE - 1 && v === board[r * SIZE + c + 1]) return true;
      if (r < SIZE - 1 && v === board[(r + 1) * SIZE + c]) return true;
    }
  }
  return false;
}

function freshTiles(): Tile[] {
  nextTileId = 0;
  return spawn(spawn([]));
}

const TILE_CLASS: Record<number, string> = {
  2: "bg-t2 text-t2-fg",
  4: "bg-t4 text-t4-fg",
  8: "bg-t8 text-t8-fg",
  16: "bg-t16 text-t16-fg",
  32: "bg-t32 text-t32-fg",
  64: "bg-t64 text-t64-fg",
  128: "bg-t128 text-t128-fg",
  256: "bg-t256 text-t256-fg",
  512: "bg-t512 text-t512-fg",
  1024: "bg-t1024 text-t1024-fg",
  2048: "bg-t2048 text-t2048-fg",
};

function tileClass(value: number): string {
  return TILE_CLASS[value] ?? "bg-t2048 text-t2048-fg";
}

function tileTextSize(value: number): string {
  if (value >= 1024) return "text-[8.5cqw]";
  if (value >= 128) return "text-[10cqw]";
  return "text-[12cqw]";
}

const KEY_TO_DIR: Record<string, Direction> = {
  arrowup: "up",
  arrowdown: "down",
  arrowleft: "left",
  arrowright: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

function swipeDirection(dx: number, dy: number): Direction | null {
  if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
    return null;
  }
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "right" : "left";
  }
  return dy > 0 ? "down" : "up";
}

export function Game2048() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [cellSize, setCellSize] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(gameState);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const animatingRef = useRef(false);

  stateRef.current = gameState;

  useEffect(() => {
    setTiles(freshTiles());
    const stored = Number(window.localStorage.getItem(BEST_KEY) ?? "0");
    if (Number.isFinite(stored)) setBest(stored);
    setReduceMotion(matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const measure = () => {
      const w = board.clientWidth;
      setCellSize((w - PAD * 2 - GAP * (SIZE - 1)) / SIZE);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(board);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setBest((prev) => {
      if (score <= prev) return prev;
      window.localStorage.setItem(BEST_KEY, String(score));
      return score;
    });
  }, [score]);

  const applyMove = useCallback((dir: Direction) => {
    if (stateRef.current !== "playing" || animatingRef.current) return;

    setTiles((prev) => {
      const { tiles: moved, gained, moved: didMove } = moveTiles(prev, dir);
      if (!didMove) return prev;

      animatingRef.current = !reduceMotion;

      const next = spawn(moved);
      if (gained > 0) setScore((s) => s + gained);

      const board = boardFromTiles(next);
      if (board.includes(WIN_VALUE)) setGameState("won");
      else if (!hasMoves(next)) setGameState("lost");

      if (reduceMotion) animatingRef.current = false;
      else {
        window.setTimeout(() => {
          animatingRef.current = false;
        }, 160);
      }

      return next;
    });
  }, [reduceMotion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const dir = KEY_TO_DIR[event.key.toLowerCase()];
      if (!dir) return;
      event.preventDefault();
      applyMove(dir);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [applyMove]);

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    if (stateRef.current !== "playing") return;
    swipeStart.current = { x: event.clientX, y: event.clientY };
    boardRef.current?.setPointerCapture(event.pointerId);
  }, []);

  const onPointerUp = useCallback(
    (event: React.PointerEvent) => {
      if (!swipeStart.current) return;
      const dx = event.clientX - swipeStart.current.x;
      const dy = event.clientY - swipeStart.current.y;
      swipeStart.current = null;
      boardRef.current?.releasePointerCapture(event.pointerId);

      const dir = swipeDirection(dx, dy);
      if (dir) applyMove(dir);
    },
    [applyMove],
  );

  const onPointerCancel = useCallback((event: React.PointerEvent) => {
    swipeStart.current = null;
    boardRef.current?.releasePointerCapture(event.pointerId);
  }, []);

  const reset = useCallback(() => {
    setTiles(freshTiles());
    setScore(0);
    setGameState("playing");
    animatingRef.current = false;
  }, []);

  const won = gameState === "won";
  const status = won
    ? "2048 reached ✓"
    : gameState === "lost"
      ? "no moves left"
      : "merge to 2048";

  const slideMs = reduceMotion ? 0 : 150;

  return (
    <div className="flex h-full items-stretch gap-5">
      <div
        ref={boardRef}
        className="@container relative aspect-square h-full shrink-0 touch-none rounded-[4px] border border-hair bg-hair p-[6px] select-none"
        role="grid"
        aria-label="2048 board"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <div
          className="grid h-full w-full grid-cols-4 grid-rows-4 gap-[6px]"
          aria-hidden
        >
          {Array.from({ length: CELLS }, (_, i) => (
            <div key={`cell-${i}`} className="rounded-[3px] bg-cell" />
          ))}
        </div>

        {cellSize > 0
          ? tiles.map((tile) => (
              <div
                key={tile.id}
                className="absolute left-0 top-0"
                style={{
                  width: cellSize,
                  height: cellSize,
                  transform: `translate(${PAD + tile.col * (cellSize + GAP)}px, ${PAD + tile.row * (cellSize + GAP)}px)`,
                  transition:
                    slideMs > 0
                      ? `transform ${slideMs}ms cubic-bezier(0.16, 1, 0.3, 1)`
                      : undefined,
                  zIndex: tile.justMerged ? 2 : 1,
                }}
              >
                <div
                  role="gridcell"
                  aria-label={`${tile.value}`}
                  className={[
                    "flex h-full w-full items-center justify-center rounded-[3px] tabular-nums",
                    "font-medium leading-none",
                    tileTextSize(tile.value),
                    tileClass(tile.value),
                    tile.isNew && !reduceMotion ? "animate-tile-new" : "",
                    tile.justMerged && !reduceMotion ? "animate-tile-merge" : "",
                  ].join(" ")}
                >
                  {tile.value}
                </div>
              </div>
            ))
          : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5 font-mono">
        <div className="flex flex-col gap-2.5">
          <span
            className={[
              "text-[13px]",
              won ? "text-accent" : "text-status",
            ].join(" ")}
            aria-live="polite"
          >
            {status}
          </span>

          <div className="flex gap-5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-[0.1em] text-faint-2">
                score
              </span>
              <span className="text-[15px] tabular-nums text-ink">{score}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-[0.1em] text-faint-2">
                best
              </span>
              <span className="text-[15px] tabular-nums text-muted">{best}</span>
            </div>
          </div>

          <span className="text-[10px] tracking-[0.06em] text-faint-2">
            swipe or arrows / wasd
          </span>
        </div>

        <span
          role="button"
          tabIndex={0}
          onClick={reset}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              reset();
            }
          }}
          className="cursor-pointer self-start text-[12px] text-muted-2 transition-colors hover:text-hover"
        >
          {gameState === "playing" ? "restart ↻" : "new game ↻"}
        </span>
      </div>
    </div>
  );
}
