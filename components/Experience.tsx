import type { Experience } from "@/data/types";
import { RichText } from "./RichText";

export function ExperienceSection({
  experience,
}: {
  experience: Experience[];
}) {
  return (
    <section
      className="section wrap"
      id="experience"
      data-screen-label="experience"
    >
      <div className="section-head fade-up">
        <h2 className="section-title">✲ experience</h2>
        <span className="mono">02</span>
      </div>

      {experience.map((xp) => (
        <article key={`${xp.company}-${xp.period}`} className="xp fade-up">
          <span className="mono">{xp.period}</span>
          <div>
            <h3>{xp.company}</h3>
            <ul>
              {xp.bullets.map((line, i) => (
                <li key={i}>
                  <RichText tokens={line} />
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </section>
  );
}
