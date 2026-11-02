import { useEffect, useRef, useState } from "react";
import { skills } from "../content/index.js";
import { FINE, REDUCED, matches } from "../lib/hooks.js";
import { Reveal } from "../components/primitives.jsx";
import "./Skills.css";

/** Preview that eases after the mouse (0.12) and tilts with horizontal speed, clamped ±14°. */
function useFollowPreview(listRef, previewRef) {
  useEffect(() => {
    const list = listRef.current, el = previewRef.current;
    if (!list || !el || !matches(FINE) || matches(REDUCED)) return;
    let tx = 0, ty = 0, x = 0, y = 0, lastX = 0, tilt = 0, raf = 0, placed = false;
    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      const vx = x - lastX;
      lastX = x;
      tilt += (Math.max(-14, Math.min(14, vx * 0.6)) - tilt) * 0.2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!placed) { x = lastX = tx; y = ty; placed = true; el.style.visibility = "visible"; }
    };
    const onLeave = () => { placed = false; el.style.visibility = "hidden"; };
    el.style.visibility = "hidden";
    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerover", onMove);
    list.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); list.removeEventListener("pointermove", onMove); list.removeEventListener("pointerover", onMove); list.removeEventListener("pointerleave", onLeave); };
  }, [listRef, previewRef]);
}

export default function Skills() {
  const [hovered, setHovered] = useState(-1);
  const listRef = useRef(null);
  const previewRef = useRef(null);
  useFollowPreview(listRef, previewRef);

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <div className="skills__head">
          {skills.heading && <Reveal as="h2" index={1} className="text-section">{skills.heading}</Reveal>}
        </div>
        <ul className="skills__list" ref={listRef} data-hovering={hovered >= 0} onPointerLeave={() => setHovered(-1)}>
          {skills.items.map((s, i) => (
            <Reveal as="li" className="skill" key={s.title} index={i} data-hovered={hovered === i} onPointerEnter={() => setHovered(i)}>
              <span className="skill__rule" aria-hidden="true" />
              <span className="skill__num label">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="skill__title text-lead">{s.title}</h3>
              <p className="skill__blurb">{s.blurb}</p>
            </Reveal>
          ))}
        </ul>
      </div>
      <div className="skills__preview" ref={previewRef} data-visible={hovered >= 0 && !!skills.items[hovered]?.preview} aria-hidden="true">
        {skills.items.map((s, i) => s.preview && (
          <img key={s.title} src={s.preview} alt="" data-on={hovered === i} loading="lazy" />
        ))}
      </div>
    </section>
  );
}
