import type { PortfolioData } from "@/data/types";
import { RichText } from "./RichText";

export function About({ about }: { about: PortfolioData["about"] }) {
  return (
    <section className="section wrap" id="about" data-screen-label="about">
      <div className="section-head fade-up">
        <h2 className="section-title">✲ about</h2>
        <span className="mono">03</span>
      </div>
      <div className="about-grid">
        <p className="about-copy fade-up">
          <RichText tokens={about.copy} />
        </p>
        <div className="about-meta fade-up">
          <div>
            <h4>education</h4>
            <p>{about.education}</p>
          </div>
          <div>
            <h4>packages published</h4>
            <p>
              {about.packages.map((pkg, i) => (
                <span key={pkg.href}>
                  {i > 0 && " · "}
                  <a href={pkg.href} target="_blank" rel="noopener">
                    {pkg.label}
                  </a>
                </span>
              ))}
            </p>
          </div>
          <div>
            <h4>elsewhere</h4>
            <p>
              <RichText tokens={about.elsewhere} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
