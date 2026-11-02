import { useEffect, useRef } from "react";
import { footer, site } from "../content/index.js";
import { useScrollProgress } from "../lib/hooks.js";
import { SiteLink } from "../components/primitives.jsx";
import "./Footer.css";

const easeCubic = (t) => 1 - (1 - t) ** 3;

/** Opens from inset(5% 7% 0 7%) to full bleed as it scrolls in. Wordmark is fitted to the width. */
export default function Footer() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const markRef = useRef(null);

  useScrollProgress(outerRef, (p) => {
    const k = 1 - easeCubic(Math.min(1, p * 1.25));
    if (innerRef.current) innerRef.current.style.clipPath = `inset(${5 * k}% ${7 * k}% 0 ${7 * k}%)`;
  }, { mode: "enter" });

  useEffect(() => {
    const el = markRef.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = "100px";
      const parent = el.parentElement, cs = getComputedStyle(parent);
      const w = el.scrollWidth, avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      el.style.fontSize = `${(avail / w) * 100 * 0.99}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, []);

  return (
    <footer className="footer" ref={outerRef}>
      <div className="footer__inner" ref={innerRef}>
        <div className="container footer__top">
          <p className="footer__tagline text-lead">{footer.tagline}</p>
          <nav className="footer__links">
            {footer.links?.map((l) => <SiteLink key={l.label} href={l.href.startsWith("#") ? `/${l.href}` : l.href} className="text-lead" wave={l.label} />)}
          </nav>
          <div className="footer__socials">
            {site.socials?.map((s) => <SiteLink key={s.href} href={s.href} className="label" wave={s.label} />)}
          </div>
        </div>
        <div className="container footer__markwrap">
          <div className="footer__mark" ref={markRef} aria-hidden="true">{site.wordmark}</div>
        </div>
        <div className="container footer__base">
          <span className="label">{footer.credit}</span>
          <span className="label">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
