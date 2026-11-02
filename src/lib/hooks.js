import { useEffect, useRef, useState } from "react";

export const REDUCED = "(prefers-reduced-motion: reduce)";
export const FINE = "(hover: hover) and (pointer: fine)";

export function matches(query) {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}

export function useMedia(query) {
  const [value, setValue] = useState(() => matches(query));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setValue(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return value;
}

/** Calls fn(progress, rect) on scroll/resize, once per frame. progress runs 0 → 1 across the element's scrollable travel. */
export function useScrollProgress(ref, fn, { mode = "pin" } = {}) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // pin: 0 when the top hits the viewport top, 1 when the bottom hits the viewport bottom.
      // enter: 0 when the top enters at the bottom of the viewport, 1 once the element is fully in view.
      const p = mode === "pin" ? -rect.top / Math.max(1, rect.height - vh) : (vh - rect.top) / Math.min(vh, rect.height);
      fnRef.current(Math.min(1, Math.max(0, p)), rect);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, mode]);
}

/** true once the element has scrolled into view (12% above the viewport bottom). */
export function useInView(ref, { once = true, rootMargin = "0px 0px -12% 0px" } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) io.disconnect();
      } else if (!once) setInView(false);
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, rootMargin]);
  return inView;
}
