import { useEffect, useState } from "react";
import { site } from "../content/index.js";
import { useSite } from "../lib/SiteProvider.jsx";
import "./Loader.css";

const CHIP_AT = 820, FRAME_MS = 230, OUT_MS = 420;

/** Letter-by-letter intro: LEFT · [flickering image chip] · RIGHT, then lifts away. */
export default function Loader() {
  const { ready, setReady } = useSite();
  const cfg = site.loader ?? {};
  const frames = cfg.frames?.length ? cfg.frames : ["50% 50%"];
  const [phase, setPhase] = useState("in"); // in | chip | out | gone
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (ready) return;
    const t = [];
    const outAt = CHIP_AT + frames.length * FRAME_MS;
    t.push(setTimeout(() => setPhase("chip"), CHIP_AT));
    frames.forEach((_, i) => t.push(setTimeout(() => setFrame(i), CHIP_AT + i * FRAME_MS)));
    t.push(setTimeout(() => setPhase("out"), outAt));
    t.push(setTimeout(() => setReady(true), outAt + OUT_MS));
    t.push(setTimeout(() => setPhase("gone"), outAt + OUT_MS * 2));
    return () => t.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "gone" || (ready && phase === "in")) return null;

  const left = [...(cfg.left ?? "")], right = [...(cfg.right ?? "")];
  const letter = (c, i) => (
    <span className="loader__mask" key={i}>
      <span className="loader__char" style={{ "--i": i }}>{c}</span>
    </span>
  );

  return (
    <div className="loader" data-phase={phase} aria-hidden="true">
      <div className="loader__word">
        {left.map((c, i) => letter(c, i))}
        <span className="loader__chip">
          <img src={cfg.image} alt="" style={{ objectPosition: frames[frame] }} />
        </span>
        {right.map((c, i) => letter(c, i + left.length))}
      </div>
    </div>
  );
}
