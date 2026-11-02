import { useRef } from "react";
import { useInView } from "../lib/hooks.js";
import { useSite } from "../lib/SiteProvider.jsx";

/** Text split into per-letter spans for the hover wave. Put data-hw on the hover target. */
export function WaveText({ text, offset = 0 }) {
  const chars = [...String(text)];
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars.map((c, i) => (
          <span key={i} data-hw-char="" style={{ "--hwi": i + offset }}>{c}</span>
        ))}
      </span>
    </>
  );
}

/** Anchor that routes through the site navigator (smooth scroll, route curtain, external tabs). */
export function SiteLink({ href, children, wave, className = "", ...rest }) {
  const { go } = useSite();
  const external = /^https?:/.test(href || "");
  return (
    <a
      href={href}
      className={className}
      data-hw={wave ? "" : undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(href);
      }}
      {...rest}
    >
      {wave ? <WaveText text={wave} /> : children}
    </a>
  );
}

export function Button({ href, label, arrow = true, ...rest }) {
  return (
    <SiteLink href={href} className="btn" data-hw="" data-cursor-tone="dark" {...rest}>
      <WaveText text={label} />
      {arrow && <span className="btn__arrow" aria-hidden="true">↗</span>}
    </SiteLink>
  );
}

/** Fades and lifts its child in when scrolled into view. `index` staggers siblings by 90ms. */
export function Reveal({ as: Tag = "div", index = 0, style, children, ...rest }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <Tag ref={ref} data-reveal="" data-revealed={inView ? "true" : "false"} style={{ "--ri": index, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

export function Media({ src, alt = "", className, style, ...rest }) {
  if (!src) return null;
  if (/\.(mp4|webm)$/i.test(src)) {
    return <video className={className} style={style} src={src} autoPlay muted loop playsInline aria-label={alt} {...rest} />;
  }
  return <img className={className} style={style} src={src} alt={alt} loading="lazy" decoding="async" {...rest} />;
}
