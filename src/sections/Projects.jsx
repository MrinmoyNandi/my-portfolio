import { useEffect, useRef, useState } from "react";
import { projects } from "../content/index.js";
import { useMedia } from "../lib/hooks.js";
import { Button, Reveal, SiteLink, WaveText } from "../components/primitives.jsx";
import "./Projects.css";

const META = [["status", "Status"], ["category", "Type"], ["role", "Role"], ["timeline", "Timeline"], ["year", "Year"], ["team", "Team"]];

/** Accordion list: the active row grows, turns magenta and reveals its cover + metadata. */
export default function Projects() {
  const [active, setActive] = useState(0);
  const listRef = useRef(null);
  const hoverMode = useMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");

  // Touch / small screens: the active row is the one closest to the middle of the viewport.
  useEffect(() => {
    if (hoverMode) return;
    let raf = 0;
    const pick = () => {
      raf = 0;
      const rows = [...(listRef.current?.children ?? [])];
      const mid = innerHeight / 2;
      let best = 0, bestD = Infinity;
      rows.forEach((row, i) => {
        const r = row.getBoundingClientRect();
        const d = Math.abs(r.top + Math.min(r.height, 112) / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      setActive(best);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(pick); };
    addEventListener("scroll", on, { passive: true });
    pick();
    return () => { removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, [hoverMode]);

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <div className="projects__head">
          <Reveal as="h2" className="text-section">Selected Projects</Reveal>
        </div>
        <ul className="projects__list" ref={listRef}>
          {projects.map((p, i) => (
            <li
              key={p.slug}
              className="proj"
              data-project-row=""
              data-active={i === active}
              onMouseEnter={() => hoverMode && setActive(i)}
              onFocusCapture={() => setActive(i)}
            >
              <span className="proj__num label">{String(i + 1).padStart(2, "0")}</span>
              <div className="proj__main">
                <SiteLink href={`/work/${p.slug}`} className="proj__title text-project" wave={p.title} />
                <div className="proj__details">
                  {p.summary && <p className="proj__summary muted">{p.summary}</p>}
                  <dl className="proj__meta">
                    {META.filter(([k]) => p[k]).map(([k, label]) => (
                      <div key={k}><dt className="label">{label}</dt><dd>{p[k]}</dd></div>
                    ))}
                  </dl>
                  <Button href={`/work/${p.slug}`} label="Jump to project" tabIndex={i === active ? 0 : -1} />
                </div>
              </div>
              <SiteLink href={`/work/${p.slug}`} className="proj__cover" tabIndex={-1} aria-hidden="true">
                <img src={p.cover} alt="" loading="lazy" />
                <span className="proj__scrim" />
                {p.tags?.length > 0 && (
                  <span className="proj__tags">{p.tags.map((t) => <span className="proj__tag" key={t}>{t}</span>)}</span>
                )}
              </SiteLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
