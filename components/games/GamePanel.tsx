"use client";

import type { ReactNode } from "react";

type GamePanelProps = {
  name: string;
  onShuffle: () => void;
  children: ReactNode;
};

/**
 * Fixed-size shell that wraps every game. The header (name + shuffle) and footer
 * caption are identical across all three games — only `children` (the body)
 * changes. Keyboard shuffle lives in the parent (GameHost).
 */
export function GamePanel({ name, onShuffle, children }: GamePanelProps) {
  return (
    <div
      className="h-[494px] w-[357px] rounded-[5px] border border-hair-3 bg-panel
                 px-5 pb-4 pt-[18px] font-mono transition-[background-color,border-color,color]
                 duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[13px] lowercase text-title">{name}</span>
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

      {children}

      <div className="mt-[14px] text-[10px] tracking-[0.06em] text-faint-2">
        <span className="text-faint">s</span> · another game
      </div>
    </div>
  );
}
