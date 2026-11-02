// Generates on-palette SVG placeholder images into public/media/placeholders/.
// They stand in for project covers, trail tiles, lab images and skill previews
// until real media is supplied. Run: npm run placeholders
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../public/media/placeholders");
mkdirSync(OUT, { recursive: true });

const BG = "#050505", PINK = "#FF00A8", YELLOW = "#F5FF00", INK = "#F2F0EC";

// Small deterministic PRNG so the output is stable between runs.
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

function art(w, h, seed, label) {
  const r = rng(seed);
  const cx = w * (0.3 + r() * 0.4), cy = h * (0.3 + r() * 0.4);
  const rad = Math.min(w, h) * (0.22 + r() * 0.18);
  const bars = Array.from({ length: 7 }, () => {
    const vertical = r() > 0.5, c = r() > 0.6 ? YELLOW : PINK;
    const x = r() * w, y = r() * h, len = (vertical ? h : w) * (0.05 + r() * 0.25);
    return vertical
      ? `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(2 + r() * 4).toFixed(1)}" height="${len.toFixed(1)}" fill="${c}"/>`
      : `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${len.toFixed(1)}" height="${(1.5 + r() * 3).toFixed(1)}" fill="${c}" opacity=".8"/>`;
  }).join("");
  const scan = Array.from({ length: 14 }, (_, i) =>
    `<rect x="0" y="${((i + r()) * h / 14).toFixed(1)}" width="${(w * (0.2 + r() * 0.8)).toFixed(1)}" height="1" fill="${PINK}" opacity="${(0.05 + r() * 0.2).toFixed(2)}"/>`
  ).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${PINK}"/><stop offset=".72" stop-color="${PINK}" stop-opacity=".85"/><stop offset="1" stop-color="${PINK}" stop-opacity="0"/></radialGradient>
<pattern id="p" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="${INK}" stroke-opacity=".05"/></pattern></defs>
<rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>
<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(rad * 1.25).toFixed(1)}" fill="url(#g)" opacity=".35"/>
<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rad.toFixed(1)}" fill="${PINK}"/>
<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(rad * 0.42).toFixed(1)}" fill="none" stroke="${YELLOW}" stroke-width="${(rad * 0.06).toFixed(1)}"/>
${scan}${bars}
<text x="${(w * 0.04).toFixed(1)}" y="${(h * 0.93).toFixed(1)}" font-family="monospace" font-size="${Math.round(h * 0.045)}" fill="${YELLOW}" letter-spacing="2">${label}</text>
</svg>`;
}

const sets = [
  ["cover", 6, 1200, 800],
  ["trail", 6, 320, 320],
  ["lab", 2, 1200, 900],
  ["skill", 4, 640, 440],
];
let seed = 7;
for (const [name, count, w, h] of sets) {
  for (let i = 1; i <= count; i++) {
    const id = String(i).padStart(2, "0");
    writeFileSync(join(OUT, `${name}-${id}.svg`), art(w, h, seed++ * 977, `PLACEHOLDER / ${name.toUpperCase()} ${id}`));
  }
}
console.log(`placeholders written to ${OUT}`);
