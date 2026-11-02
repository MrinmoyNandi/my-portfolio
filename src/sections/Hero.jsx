import { useEffect, useRef } from "react";
import { hero, site } from "../content/index.js";
import { FINE, REDUCED, matches } from "../lib/hooks.js";
import { useSite } from "../lib/SiteProvider.jsx";
import { Button } from "../components/primitives.jsx";
import "./Hero.css";

const STEP = 90, MAX_VISIBLE = 4;

/** Small images that spawn every 90px of pointer travel over the portrait. */
function useImageTrail(hostRef, layerRef, images) {
  useEffect(() => {
    const host = hostRef.current, layer = layerRef.current;
    if (!host || !images?.length || !matches(FINE) || matches(REDUCED)) return;
    let lx = null, ly = 0, travelled = 0, n = 0;
    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (lx !== null) travelled += Math.hypot(x - lx, y - ly);
      lx = x; ly = y;
      if (travelled < STEP) return;
      travelled = 0;
      const item = document.createElement("span");
      item.className = "trail__item";
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      item.innerHTML = `<img src="${images[n++ % images.length]}" alt="">`;
      item.addEventListener("animationend", () => item.remove());
      layer.appendChild(item);
      while (layer.children.length > MAX_VISIBLE) layer.firstChild.remove();
    };
    const onLeave = () => { lx = null; travelled = 0; };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => { host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerleave", onLeave); };
  }, [hostRef, layerRef, images]);
}

export default function Hero() {
  const { ready } = useSite();
  const portraitRef = useRef(null);
  const trailRef = useRef(null);
  useImageTrail(portraitRef, trailRef, hero.trail);
  let i = 0; // stagger index across all tilted lines

  return (
    <section id="top" className="hero" data-ready={ready}>
      <div className="hero__portrait" ref={portraitRef}>
        <img src={hero.portrait} alt={hero.portraitAlt ?? site.name} fetchpriority="high" />
        <div className="trail" ref={trailRef} aria-hidden="true" />
      </div>

      <div className="hero__inner container">
        <h1 className="hero__name">
          {hero.nameLines.map((line) => (
            <span className="hero__line" key={line}><span className="hero__tilt" style={{ "--i": i++ }}>{line}</span></span>
          ))}
        </h1>
        <p className="hero__tagline text-body-lg">
          {hero.tagline.map((line) => (
            <span className="hero__line" key={line}><span className="hero__tilt" style={{ "--i": i++ }}>{line}</span></span>
          ))}
        </p>
        {hero.chips?.length > 0 && (
          <div className="hero__line">
            <ul className="hero__chips hero__tilt" style={{ "--i": i++ }}>
              {hero.chips.map((c) => <li className="chip" key={c}>{c}</li>)}
            </ul>
          </div>
        )}
        {hero.cta && (
          <div className="hero__line">
            <div className="hero__cta hero__tilt" style={{ "--i": i++ }}><Button href={hero.cta.href} label={hero.cta.label} /></div>
          </div>
        )}
      </div>

      <div className="hero__foot container">
        <span className="label hero__loc">{site.location}</span>
      </div>
    </section>
  );
}
