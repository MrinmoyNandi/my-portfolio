// Node-side: reads content/*.md and returns the JSON the site renders.
// Used by the Vite plugin in vite.config.js (served as the "virtual:content" module).
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";
import { parseMarkdown, slugFromPath } from "./parse.js";

const SECTIONS = ["site", "hero", "explorer", "about", "clients", "lab", "skills", "contact", "footer"];

export function buildContent(dir) {
  const read = (rel) => parseMarkdown(readFileSync(join(dir, rel), "utf8"));
  const out = {};
  for (const name of SECTIONS) {
    const { data, body } = read(`${name}.md`);
    out[name] = { ...data, body, html: body ? marked.parse(body) : "" };
  }
  out.projects = readdirSync(join(dir, "projects"))
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, body } = read(`projects/${f}`);
      return { slug: data.slug || slugFromPath(f), ...data, body, html: marked.parse(body) };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  return out;
}
