"use client";

type GameLoadingShellProps = {
  label: string;
};

/**
 * Placeholder shown while a game's chunk is still downloading. Fills the panel
 * body so the 16:9 frame does not collapse between shuffle and mount.
 */
export function GameLoadingShell({ label }: GameLoadingShellProps) {
  return (
    <div
      className="flex h-full items-center justify-center font-mono text-[11px]
                 tracking-[0.06em] text-faint-2"
      aria-live="polite"
    >
      loading {label}…
    </div>
  );
}
