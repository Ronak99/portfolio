import type { PortfolioData } from "@/data/types";

export function Contact({
  meta,
  socials,
}: {
  meta: PortfolioData["meta"];
  socials: PortfolioData["socials"];
}) {
  return (
    <section className="contact wrap" id="contact" data-screen-label="contact">
      <h2 className="fade-up">
        let&apos;s build
        <br />
        something ✲
      </h2>
      <a className="contact-email fade-up" href={`mailto:${meta.email}`}>
        {meta.email}
      </a>
      <div className="foot">
        <span className="mono">{meta.footerLine}</span>
        <ul className="foot-links">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
