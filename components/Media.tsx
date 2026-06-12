import type { MediaItem } from "@/data/types";

export function Media({ media }: { media: MediaItem[] }) {
  return (
    <section
      className="section wrap"
      id="media"
      data-screen-label="videos and writing"
    >
      <div className="section-head fade-up">
        <h2 className="section-title">✲ videos &amp; writing</h2>
        <span className="mono">04</span>
      </div>
      <ul className="media-list fade-up">
        {media.map((item) => (
          <li key={item.index}>
            <a
              className="media-row"
              href={item.href}
              target="_blank"
              rel="noopener"
            >
              <span className="mono">{item.index}</span>
              <span>{item.title}</span>
              <span className="arrow">{item.source} ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
