import type { PortfolioData } from "@/data/types";
import { GameHost } from "@/components/games/GameHost";

export function Hero({ hero }: { hero: PortfolioData["hero"] }) {
  return (
    <section className="hero wrap" data-screen-label="hero">
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="mono hero-label">
            <span className="mask">
              <span className="mask-in" style={{ "--d": 0 } as React.CSSProperties}>
                {hero.label}
              </span>
            </span>
          </p>
          <h1>
            <span className="mask">
              <span className="mask-in" style={{ "--d": 1 } as React.CSSProperties}>
                {hero.firstName}
              </span>
            </span>
            <span className="mask">
              <span className="mask-in" style={{ "--d": 2 } as React.CSSProperties}>
                {hero.lastName}
              </span>
            </span>
          </h1>
          <p className="hero-sub">
            <span className="mask">
              <span className="mask-in" style={{ "--d": 3 } as React.CSSProperties}>
                {hero.subtitle}
              </span>
            </span>
          </p>
        </div>
        <div className="hero-games">
          <GameHost />
        </div>
      </div>
      <div className="hero-foot">
        <span className="mono">
          <span className="mask">
            <span className="mask-in" style={{ "--d": 4 } as React.CSSProperties}>
              {hero.current}
            </span>
          </span>
        </span>
        <span className="mono">
          <span className="mask">
            <span className="mask-in" style={{ "--d": 5 } as React.CSSProperties}>
              scroll ↓
            </span>
          </span>
        </span>
      </div>
    </section>
  );
}
