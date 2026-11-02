import { Fragment, useMemo, useRef } from "react";
import { about } from "../content/index.js";
import { useScrollProgress } from "../lib/hooks.js";
import "./About.css";

/** Pinned paragraph; characters light up in reading order as you scroll (dim → magenta → ink). */
export default function About() {
  const sectionRef = useRef(null);
  const charsRef = useRef([]);
  const litRef = useRef(-1);

  // Plain text only: strip any markdown emphasis so every character is one span.
  const words = useMemo(() => about.body.replace(/[*_`#>]/g, "").split(/\s+/).filter(Boolean), []);
  let n = 0;

  useScrollProgress(sectionRef, (p) => {
    const chars = charsRef.current;
    const lit = Math.round(Math.min(1, p * 1.15) * chars.length);
    if (lit === litRef.current) return;
    const prev = Math.max(0, litRef.current);
    if (lit > prev) for (let i = prev; i < lit; i++) chars[i]?.setAttribute("data-lit", "");
    else for (let i = lit; i < prev; i++) chars[i]?.removeAttribute("data-lit");
    litRef.current = lit;
  });

  return (
    <section id="about" className="about" ref={sectionRef}>
      <div className="about__pin">
        <div className="container about__inner">
          <p className="about__text text-lead">
            <span className="about__photo" aria-hidden={!about.imageAlt}>
              <img src={about.image} alt={about.imageAlt ?? ""} style={{ objectPosition: about.imagePosition }} loading="lazy" />
            </span>
            <span className="sr-only">{words.join(" ")}</span>
            <span aria-hidden="true">
              {words.map((w, wi) => (
                <Fragment key={wi}>
                  <span className="about__word">
                    {[...w].map((c) => {
                      const i = n++;
                      return <span key={i} className="about__char" ref={(el) => (charsRef.current[i] = el)}>{c}</span>;
                    })}
                  </span>{" "}
                </Fragment>
              ))}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
