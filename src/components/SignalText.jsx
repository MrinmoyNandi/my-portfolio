import { useEffect, useRef, useState } from "react";
import { REDUCED, matches } from "../lib/hooks.js";

const GLYPHS = "01/·—";
const DURATION = 550;

/** "Decode" text: unrevealed letters cycle through 01/·— and resolve left to right. */
export default function SignalText({ text, trigger }) {
  const [shown, setShown] = useState(text);
  const ref = useRef(null);
  const lastRun = useRef(0);

  const run = () => {
    if (matches(REDUCED)) return setShown(text);
    const now = performance.now();
    if (now - lastRun.current < 1000) return;
    lastRun.current = now;
    const start = now;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / DURATION);
      const solved = Math.floor(p * text.length);
      setShown([...text].map((c, i) => (i < solved || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(""));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    lastRun.current = 0;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, trigger]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span ref={ref} className="signal-text">
      <span className="sr-only">{text}</span>
      <span className="signal-text__size" aria-hidden="true">{text}</span>
      <span className="signal-text__live" aria-hidden="true">{shown}</span>
    </span>
  );
}
