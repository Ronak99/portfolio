"use client";

import type { PortfolioData, Work } from "@/data/types";
import { useMenuState, type MenuView } from "@/hooks/useMenuState";
import type { useMenu } from "@/hooks/useMenu";

type MenuHandlers = ReturnType<typeof useMenu>;

type OverlayMenuContentProps = {
  works: Work[];
  socials: PortfolioData["socials"];
  email: string;
  view: MenuView;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  navViewRef: React.RefObject<HTMLElement | null>;
  worksViewRef: React.RefObject<HTMLDivElement | null>;
  worksListRef: React.RefObject<HTMLUListElement | null>;
  cardRef: React.RefObject<HTMLDivElement | null>;
  cardInnerRef: React.RefObject<HTMLDivElement | null>;
  glowRef: React.RefObject<HTMLDivElement | null>;
  chRRef: React.RefObject<HTMLImageElement | null>;
  chGRef: React.RefObject<HTMLImageElement | null>;
  chBRef: React.RefObject<HTMLImageElement | null>;
  incomingRef: React.RefObject<HTMLImageElement | null>;
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
  worksViewRef,
  worksListRef,
  cardRef,
  cardInnerRef,
  glowRef,
  chRRef,
  chGRef,
  chBRef,
  incomingRef,
  itemRefs,
  menu,
}: OverlayMenuContentProps) {
  const { setView } = useMenuState();
  const defaultImage = works[0]?.image ?? "";

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
          data-screen-label="menu — nav"
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
          ref={worksViewRef}
          data-screen-label="menu — works list"
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
          <ul className="works-list" id="worksList" ref={worksListRef}>
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
                    data-image={work.image}
                    data-glow={work.glow}
                    data-scroll-target={`#${work.id}`}
                    onFocus={() => {
                      if (menu.touchRef.current) return;
                      menu.keyboardModeRef.current = true;
                      menu.pxRef.current = innerWidth * 0.78;
                      menu.pyRef.current = innerHeight * 0.5;
                      if (!cardRef.current?.classList.contains("is-visible"))
                        menu.showCard(menu.pxRef.current, menu.pyRef.current);
                      menu.setActive(i);
                      if (menu.reducedRef.current) menu.positionCardStatic();
                    }}
                    onClick={() =>
                      menu.handleCloseMenu(() =>
                        menu.scrollToSection(`#${work.id}`)
                      )
                    }
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

      <div
        className="preview-card"
        id="previewCard"
        ref={cardRef}
        aria-hidden="true"
      >
        <div className="pc-inner" ref={cardInnerRef}>
          <div className="pc-glow" ref={glowRef} />
          <div className="pc-imgs">
            <img className="ch ch-r" ref={chRRef} src={defaultImage} alt="" />
            <img className="ch ch-g" ref={chGRef} src={defaultImage} alt="" />
            <img className="ch ch-b" ref={chBRef} src={defaultImage} alt="" />
            <img
              className="pc-incoming"
              ref={incomingRef}
              src={defaultImage}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
