import { useEffect, useRef, useState } from "react";
import { explorer } from "../content/index.js";
import { REDUCED, matches } from "../lib/hooks.js";
import { SiteLink, WaveText, Reveal } from "../components/primitives.jsx";
import SignalText from "../components/SignalText.jsx";
import "./SignalExplorer.css";

/** The playable point cloud: Build / Teach / Connect morph 2,400 dots between three shapes. */
export default function SignalExplorer() {
  const modes = explorer.modes;
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);
  const visualRef = useRef(null);
  const sceneRef = useRef(null);
  const activeRef = useRef(0);
  const mode = modes[active];

  useEffect(() => {
    const host = visualRef.current;
    if (!host || matches(REDUCED) || matches("(max-width: 700px)") || document.documentElement.dataset.motion === "off") return;
    let cancelled = false; // guards a late import after unmount
    const io = new IntersectionObserver(([entry]) => {
      if (sceneRef.current) return sceneRef.current.setVisible(entry.isIntersecting);
      if (!entry.isIntersecting) return;
      Promise.all([import("three"), import("./signalScene.js")]).then(([THREE, { createSignalScene }]) => {
        if (cancelled || sceneRef.current) return;
        try {
          sceneRef.current = createSignalScene(THREE, host, { onFail: () => setLive(false) });
          sceneRef.current.select(activeRef.current);
          setLive(true);
        } catch {
          setLive(false);
        }
      });
    }, { rootMargin: "200px 0px" });
    io.observe(host);
    return () => { cancelled = true; io.disconnect(); sceneRef.current?.dispose(); sceneRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (i) => { activeRef.current = i; setActive(i); sceneRef.current?.select(i); };

  return (
    <section id="explorer" className="section explorer">
      <div className="container explorer__grid">
        <div className="explorer__copy">
          <Reveal as="h2" index={1} className="text-section explorer__heading">
            {explorer.heading} {explorer.headingAccent && <em>{explorer.headingAccent}</em>}
          </Reveal>
          {explorer.html && <Reveal index={2} className="explorer__body text-body-lg muted" dangerouslySetInnerHTML={{ __html: explorer.html }} />}
        </div>

        <div className="signal">
          <div className="signal__topline label">
            <span>{explorer.topline}</span>
            <span>{String(active + 1).padStart(2, "0")} / {String(modes.length).padStart(2, "0")}</span>
          </div>

          <div className="signal__visual" ref={visualRef} data-live={live} data-cursor-interactive="">
            <div className={`signal__fallback shape-${mode.shape}`} aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => <i key={i} />)}
            </div>
            <div className="signal__center label"><SignalText text={mode.shape.toUpperCase()} trigger={active} /></div>
          </div>

          <div className="signal__options" role="group" aria-label="Choose a perspective">
            {modes.map((m, i) => (
              <button key={m.label} className="signal__option" aria-pressed={i === active} data-cursor-tone={i === active ? "dark" : undefined} data-hw="" onClick={() => select(i)}>
                <WaveText text={m.label} /> <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>

          <div className="signal__story" aria-live="polite" key={active}>
            <h3 className="text-lead">{mode.title}</h3>
            <p className="muted">{mode.copy}</p>
            {mode.link && <SiteLink href={mode.link.href} className="signal__link label" wave={`${mode.link.label} →`} />}
          </div>
          {explorer.hint && <p className="signal__hint label muted">{explorer.hint}</p>}
        </div>
      </div>
    </section>
  );
}
