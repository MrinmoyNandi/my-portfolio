import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { site } from "../content/index.js";
import { useSite } from "../lib/SiteProvider.jsx";
import { SiteLink, WaveText } from "./primitives.jsx";
import "./Nav.css";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { go, lenis } = useSite();
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (open) lenis.current?.stop(); else lenis.current?.start();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const follow = (href) => { setOpen(false); setTimeout(() => go(href), 260); };

  return (
    <>
      <header className="nav" data-open={open}>
        <div className="nav__bar container">
          <SiteLink href="/#top" className="nav__mark" wave={site.wordmark} />
          <button className="nav__burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="menu" onClick={() => setOpen((v) => !v)}>
            <span /><span />
          </button>
        </div>
      </header>
      <div className="menu__scrim" data-open={open} onClick={() => setOpen(false)} />
      <nav id="menu" className="menu" data-open={open} aria-hidden={!open} inert={!open}>
        <p className="label">(MENU)</p>
        <ul className="menu__list">
          {site.nav.map((item, i) => (
            <li key={item.href} className="menu__mask">
              <a href={item.href} className="menu__link text-project" data-hw="" style={{ "--i": i }}
                onClick={(e) => { e.preventDefault(); follow(item.href.startsWith("#") ? `/${item.href}` : item.href); }}>
                <span className="menu__num label">{String(i + 1).padStart(2, "0")}</span>
                <WaveText text={item.label} />
              </a>
            </li>
          ))}
        </ul>
        <div className="menu__foot">
          <a className="label menu__mail" href={`mailto:${site.email}`} data-hw=""><WaveText text={site.email} /></a>
          <div className="menu__socials">
            {site.socials?.map((s) => <SiteLink key={s.href} href={s.href} className="label" wave={s.label} />)}
          </div>
        </div>
      </nav>
    </>
  );
}
