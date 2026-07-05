import type { Work } from "@/data/types";
import { RichText } from "./RichText";

export function Works({ works }: { works: Work[] }) {
  return (
    <section className="section wrap" id="works" data-screen-label="works">
      <div className="section-head fade-up">
        <h2 className="section-title">✲ works</h2>
        <span className="mono">01</span>
      </div>

      {works.map((work) => (
        <article key={work.id} className="project fade-up" id={work.id}>
          <span className="mono">{work.date}</span>
          <div>
            <h3>{work.title}</h3>
            <ul>
              {work.bullets.map((line, i) => (
                <li key={i}>
                  <RichText tokens={line} />
                </li>
              ))}
            </ul>
          </div>
          <a
            className="project-thumb-link"
            href={work.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${work.title}`}
          >
            <img
              className="project-thumb"
              src={work.image}
              alt={`${work.title} preview`}
            />
          </a>
        </article>
      ))}
    </section>
  );
}
