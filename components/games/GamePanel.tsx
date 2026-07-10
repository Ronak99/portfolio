"use client";

import type { ReactNode } from "react";
import { useGameScore } from "./GameScoreContext";

type GamePanelProps = {
  name: string;
  onShuffle: () => void;
  mine: number;
  children: ReactNode;
};

/**
 * Landscape (16:9) shell that wraps every game. The header (name + MINE x YOU
 * scoreboard + shuffle) and footer caption are identical across all games -
 * only `children` (the body) changes. `mine` is the owner's challenge score;
 * `you` comes from the shared score context and reads `—` until the visitor
 * starts scoring. Keyboard shuffle lives in the parent (GameHost).
 */
export function GamePanel({ name, onShuffle, mine, children }: GamePanelProps) {
  const { you } = useGameScore();
  const beaten = you !== null && you >= mine;

  return (
    <div
      className="flex h-full w-full flex-col rounded-[5px] border border-hair-3 bg-panel
                 px-5 pb-[14px] pt-[16px] font-mono transition-[background-color,border-color,color]
                 duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[13px] lowercase text-title">{name}</span>

        <div className="flex items-center gap-3">
          <div
            className="flex items-baseline gap-[7px] text-[10px] tracking-[0.08em]"
            aria-label={`mine ${mine}, you ${you ?? "none"}`}
          >
            <span className="uppercase text-faint-2">mine</span>
            <span className="tabular-nums text-muted">{mine}</span>
            <span className="text-faint-2">×</span>
            <span className="uppercase text-faint-2">you</span>
            <span
              className={[
                "tabular-nums",
                beaten ? "text-accent" : "text-ink",
              ].join(" ")}
            >
              {you ?? "—"}
            </span>
          </div>

          <button
            type="button"
            onClick={onShuffle}
            aria-label="shuffle to another game"
            title="another game"
            className="flex h-[18px] w-[18px] cursor-pointer items-center justify-center
                       rounded-[3px] border border-hair text-[10px] leading-none text-faint
                       transition-[border-color,color] hover:border-hair-strong
                       hover:text-muted"
          >
            s
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1">{children}</div>

      <div className="mt-[10px] text-[10px] tracking-[0.06em] text-faint-2">
        <span className="text-faint">s</span> · another game · beat my score
      </div>
    </div>
  );
}
