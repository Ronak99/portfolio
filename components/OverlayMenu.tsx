"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioData, Work } from "@/data/types";
import { useMenuState, type MenuView } from "@/hooks/useMenuState";
import type { useMenu } from "@/hooks/useMenu";
import { MenuHoverPreview } from "./MenuHoverPreview";

type MenuHandlers = ReturnType<typeof useMenu>;

type OverlayMenuContentProps = {
  works: Work[];
  socials: PortfolioData["socials"];
  email: string;
  view: MenuView;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  navViewRef: React.RefObject<HTMLElement | null>;
  itemRefs: React.RefObject<(HTMLButtonElement | null)[]>;
  menu: MenuHandlers;
};

export function OverlayMenuContent({
  works,
  socials,
  email,
  view,
  overlayRef,
  navViewRef,
  itemRefs,
  menu,
}: OverlayMenuContentProps) {
  const { setView } = useMenuState();
  const [hovered, setHovered] = useState<number | null>(null);
  const leaveTimer = useRef<number>(0);

  const enter = (i: number) => {
    if (menu.touchRef.current) return;
    window.clearTimeout(leaveTimer.current);
    setHovered(i);
  };

  // Leaving a row clears `hovered` after a 60ms grace period so that
  // moving straight onto another row reads as a switch, not an exit.
  const leave = () => {
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => setHovered(null), 60);
  };

  useEffect(() => {
    if (view !== "works") setHovered(null);
  }, [view]);

  return (
    <div
      className="overlay"
      id="overlay"
      ref={overlayRef}
      data-view={view}
      role="dialog"
      aria-modal="true"
      aria-label="menu"
      data-screen-label="overlay menu"
    >
      <div className="ov-views">
        <nav
          className="ov-view ov-view-nav"
          id="navView"
          ref={navViewRef}
          data-screen-label="menu - nav"
        >
          <ul className="ov-nav">
            <li className="rv-mask">
              <span className="rv" style={{ "--d": 0, "--dr": 2 } as React.CSSProperties}>
                <button
                  type="button"
                  className="ov-link"
                  id="navWorks"
                  onClick={() => setView("works")}
                >
                  <span className="roll">
                    <span className="roll-a">works</span>
                    <span className="roll-b" aria-hidden="true">
                      works
                    </span>
                  </span>
                </button>
              </span>
            </li>
            <li className="rv-mask">
              <span className="rv" style={{ "--d": 1, "--dr": 1 } as React.CSSProperties}>
                <button
                  type="button"
                  className="ov-link"
                  onClick={() =>
                    menu.handleCloseMenu(() => menu.scrollToSection("#about"))
                  }
                >
                  <span className="roll">
                    <span className="roll-a">about</span>
                    <span className="roll-b" aria-hidden="true">
                      about
                    </span>
                  </span>
                </button>
              </span>
            </li>
            <li className="rv-mask">
              <span className="rv" style={{ "--d": 2, "--dr": 0 } as React.CSSProperties}>
                <button
                  type="button"
                  className="ov-link"
                  onClick={() =>
                    menu.handleCloseMenu(() => menu.scrollToSection("#contact"))
                  }
                >
                  <span className="roll">
                    <span className="roll-a">contact</span>
                    <span className="roll-b" aria-hidden="true">
                      contact
                    </span>
                  </span>
                </button>
              </span>
            </li>
          </ul>
        </nav>

        <div
          className="ov-view ov-view-works"
          id="worksView"
          data-screen-label="menu - works list"
        >
          <span className="rv-mask">
            <span className="rv" style={{ "--d": 0 } as React.CSSProperties}>
              <button
                type="button"
                className="works-back"
                id="worksBack"
                onClick={() => setView("nav")}
              >
                ✲ back
              </button>
            </span>
          </span>
          <ul className="works-list" id="worksList">
            {works.map((work, i) => (
              <li key={work.id} className="rv-mask">
                <span
                  className="rv"
                  style={{ "--d": i + 1 } as React.CSSProperties}
                >
                  <button
                    type="button"
                    className="work-item"
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    data-scroll-target={`#${work.id}`}
                    onMouseEnter={() => enter(i)}
                    onMouseLeave={leave}
                    onFocus={() => enter(i)}
                    onBlur={leave}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest(".wi-thumb")) {
                        window.open(work.href, "_blank", "noopener,noreferrer");
                        return;
                      }
                      menu.handleCloseMenu(() =>
                        menu.scrollToSection(`#${work.id}`)
                      );
                    }}
                  >
                    <img className="wi-thumb" src={work.image} alt="" />
                    <span className="wi-title">{work.title}</span>
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ov-foot">
        <span className="rv-mask">
          <a
            className="rv"
            style={{ "--d": 7, "--dr": 0 } as React.CSSProperties}
            href={`mailto:${email}`}
          >
            {email}
          </a>
        </span>
        <ul className="ov-socials">
          {socials.map((s, i) => (
            <li key={s.label} className="rv-mask">
              <a
                className="rv"
                style={{ "--d": 8 + i, "--dr": 0 } as React.CSSProperties}
                href={s.href}
                target="_blank"
                rel="noopener"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <MenuHoverPreview works={works} hoveredIndex={hovered} />
    </div>
  );
}
