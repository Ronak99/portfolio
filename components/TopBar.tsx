"use client";

import { useMenuState } from "@/hooks/useMenuState";

type TopBarProps = {
  onToggle: () => void;
  onLogoSpin: (spin: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

export function TopBar({ onToggle, onLogoSpin, triggerRef }: TopBarProps) {
  const { isOpen } = useMenuState();

  return (
    <header className="topbar">
      <a
        className="logo"
        id="logoMark"
        href="#top"
        aria-label="home"
      >
        ✲
      </a>
      <button
        type="button"
        className="trigger"
        id="menuTrigger"
        ref={triggerRef}
        aria-expanded={isOpen}
        aria-controls="overlay"
        onClick={onToggle}
        onMouseEnter={() => onLogoSpin(true)}
        onMouseLeave={() => onLogoSpin(false)}
      >
        <span className="trigger-mask">
          <span className="trigger-track">
            <span className="t-word">menu</span>
            <span className="t-word">close</span>
          </span>
        </span>
      </button>
    </header>
  );
}
