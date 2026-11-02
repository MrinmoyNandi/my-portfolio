import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lenis from "lenis";
import { FINE, REDUCED, matches } from "./hooks.js";
import { site } from "../content/index.js";

const SiteContext = createContext(null);
export const useSite = () => useContext(SiteContext);

const COVER_MS = 667;
const REVEAL_MS = 754;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function SiteProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const lenisRef = useRef(null);
  const busy = useRef(false);
  const [ready, setReady] = useState(() => !site.loader?.enabled || matches(REDUCED));
  const [curtain, setCurtain] = useState("idle"); // idle | cover | reveal

  // Lenis only for real mouse/trackpad users, never with reduced motion.
  useEffect(() => {
    if (!matches(FINE) || matches(REDUCED)) return;
    const lenis = new Lenis({ lerp: 0.12, anchors: false, stopInertiaOnNavigate: true, autoRaf: true });
    lenisRef.current = lenis;
    return () => { lenis.destroy(); lenisRef.current = null; };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.loading = ready ? "false" : "true";
    if (ready) lenisRef.current?.start();
    else lenisRef.current?.stop();
  }, [ready]);

  const scrollTo = useCallback((target, { immediate = false } = {}) => {
    const el = typeof target === "string" && target !== "#top" ? document.querySelector(target) : null;
    const top = typeof target === "number" ? target : el ? el.getBoundingClientRect().top + window.scrollY : 0;
    if (lenisRef.current) lenisRef.current.scrollTo(top, { immediate, force: true });
    else window.scrollTo({ top, behavior: immediate || matches(REDUCED) ? "instant" : "smooth" });
  }, []);

  /** One entry point for every link: in-page anchors, routes (behind the curtain) and external URLs. */
  const go = useCallback(async (href) => {
    if (!href) return;
    if (/^(https?:|mailto:|tel:)/.test(href)) { window.open(href, href.startsWith("http") ? "_blank" : "_self", "noopener"); return; }
    const [path, hash] = href.startsWith("#") ? [location.pathname, href] : [href.split("#")[0] || "/", href.includes("#") ? `#${href.split("#")[1]}` : ""];
    if (path === location.pathname) { if (hash) scrollTo(hash); return; }
    if (busy.current) return;
    busy.current = true;
    const animate = !matches(REDUCED);
    if (animate) { setCurtain("cover"); await wait(COVER_MS); }
    navigate(path);
    await wait(30); // let the new route render
    scrollTo(hash || 0, { immediate: true });
    if (animate) { setCurtain("reveal"); await wait(REVEAL_MS); setCurtain("idle"); }
    busy.current = false;
  }, [location.pathname, navigate, scrollTo]);

  const value = useMemo(() => ({ ready, setReady, curtain, go, scrollTo, lenis: lenisRef }), [ready, curtain, go, scrollTo]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
