import { useEffect, useRef } from "react";
import "./FluidCursor.css";

// Port of the nexstudio fluid arrow (1.md) with the palette/tone changes from 2.md Part B.
const INTERACTIVE =
  "a, button, input, textarea, select, label, [role='button'], [data-cursor-interactive], " +
  "[data-hw], [data-hw-appear], [data-project-row]";

export default function FluidCursor() {
  const elRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const el = elRef.current, body = bodyRef.current, html = document.documentElement;
    const mqFine = matchMedia("(hover: hover) and (pointer: fine)");
    const mqCoarse = matchMedia("(pointer: coarse)");
    const mqReduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mqWide = matchMedia("(min-width: 769px)");

    let tx = innerWidth / 2, ty = innerHeight / 2; // target
    let x = tx, y = ty;                           // drawn
    let px = tx, py = ty;                         // previous target
    let tAng = 0, ang = 0, lag = 0, press = 1;
    let enabled = false, ready = false, touch = false, raf = 0;

    const updateTarget = (target) => {
      el.dataset.interactive = target?.closest?.(INTERACTIVE) ? "true" : "false";
      const curtain = document.querySelector('[data-route-curtain="cover"]');
      el.dataset.tone = curtain ? "dark" : target?.closest?.("[data-cursor-tone]")?.dataset.cursorTone || "default";
    };

    const frame = () => {
      const dx = tx - x, dy = ty - y, dist = Math.hypot(dx, dy);
      const posEase = touch ? 0.105 : 0.19, rotEase = touch ? 0.12 : 0.16;
      x += dx * posEase;
      y += dy * posEase;
      lag += (dist - lag) * 0.14;
      ang += (((tAng - ang + 540) % 360) - 180) * rotEase;
      const k = el.dataset.interactive === "true" ? 1.07 : 1;
      press += ((el.dataset.pressed === "true" ? 0.92 : 1) - press) * 0.25; // squash on press, eased release
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${ang}deg)`;
      body.style.transform = `translate(-92%, -50%) scale(${(1 + Math.min(lag / 900, 0.02)) * k * press}, ${(1 - Math.min(lag / 1100, 0.012)) * k * press})`;
      raf = requestAnimationFrame(frame);
    };

    const setup = () => {
      touch = mqCoarse.matches || !mqWide.matches;
      enabled = !mqReduced.matches && (touch || mqFine.matches);
      if (enabled) {
        html.dataset.customCursor = "true";
        html.dataset.cursorInput = touch ? "touch" : "pointer";
        if (touch) {
          if (!ready) { tx = x = px = innerWidth / 2; ty = y = py = innerHeight / 2; ready = true; }
          el.dataset.visible = "true";
        } else {
          el.dataset.visible = "false";
          ready = false;
        }
        if (!raf) raf = requestAnimationFrame(frame);
      } else {
        delete html.dataset.customCursor;
        delete html.dataset.cursorInput;
        el.dataset.visible = "false";
        ready = false;
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const input = (cx, cy, target) => {
      if (!enabled) return;
      tx = cx; ty = cy;
      if (ready) {
        const dx = tx - px, dy = ty - py;
        if (Math.hypot(dx, dy) > 0.5) tAng = (Math.atan2(dy, dx) * 180) / Math.PI;
        px = tx; py = ty;
      } else {
        x = px = tx; y = py = ty; ready = true;
        el.dataset.visible = "true";
      }
      updateTarget(target);
    };

    const onMove = (e) => { if (touch || e.pointerType === "touch") return; input(e.clientX, e.clientY, e.target); };
    const onDown = (e) => { input(e.clientX, e.clientY, e.target); el.dataset.pressed = "true"; };
    const onUp = () => { el.dataset.pressed = "false"; };
    const onLeave = () => { if (!touch) el.dataset.visible = "false"; };
    const onEnter = () => { if (enabled && ready) el.dataset.visible = "true"; };
    // Smooth scrolling moves content under a still pointer: re-check what is under it.
    const onScroll = () => { if (ready && !touch) updateTarget(document.elementFromPoint(tx, ty)); };
    // The curtain changes tone without any pointer movement, so watch for it too.
    const mo = new MutationObserver(onScroll);
    mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["data-route-curtain"] });

    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown, { passive: true });
    addEventListener("pointerup", onUp, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    html.addEventListener("pointerleave", onLeave);
    html.addEventListener("pointerenter", onEnter);
    const mqs = [mqFine, mqCoarse, mqReduced, mqWide];
    mqs.forEach((mq) => mq.addEventListener("change", setup));
    setup();

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      removeEventListener("pointerup", onUp);
      removeEventListener("scroll", onScroll);
      html.removeEventListener("pointerleave", onLeave);
      html.removeEventListener("pointerenter", onEnter);
      mqs.forEach((mq) => mq.removeEventListener("change", setup));
      delete html.dataset.customCursor;
      delete html.dataset.cursorInput;
    };
  }, []);

  return (
    <div ref={elRef} className="fluid-cursor" data-visible="false" data-interactive="false" data-pressed="false" data-tone="default" aria-hidden="true">
      <span ref={bodyRef} className="fluid-cursor__body">
        <svg viewBox="0 0 600 500">
          <path d="M530 225C555 237 555 263 530 275L112 475C76 492 40 462 50 423L181 269C190 258 190 242 181 231L50 77C40 38 76 8 112 25L530 225Z" />
        </svg>
      </span>
    </div>
  );
}
