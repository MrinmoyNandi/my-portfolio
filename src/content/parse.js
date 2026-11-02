// Shared by the site (src/content/index.js) and the validator (scripts/validate-content.mjs).
// Keep it free of Vite- or Node-specific APIs.
import { parse as parseYaml } from "yaml";

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/** Split a markdown file into { data, body }. A file without frontmatter is all body. */
export function parseMarkdown(raw) {
  const m = FRONTMATTER.exec(raw);
  if (!m) return { data: {}, body: raw.trim() };
  return { data: parseYaml(m[1]) ?? {}, body: m[2].trim() };
}

/** "content/projects/02-circuit-commerce.md" -> "circuit-commerce" */
export function slugFromPath(path) {
  return path.split("/").pop().replace(/\.md$/, "").replace(/^\d+[-_]/, "");
}

/**
 * Required fields for every content file. The validator enforces these, and
 * the AI update guide points here as the single source of truth.
 * `media` lists fields whose values are paths that must exist under public/.
 */
export const SCHEMA = {
  "site.md": { required: ["name", "wordmark", "email", "meta", "nav", "sections"], media: ["loader.image"] },
  "hero.md": { required: ["nameLines", "tagline", "portrait"], media: ["portrait", "trail[]"] },
  "explorer.md": { required: ["heading", "modes"], media: [] },
  "about.md": { required: ["image"], body: true, media: ["image"] },
  "clients.md": { required: ["rows"], media: ["reel"] },
  "lab.md": { required: ["items"], media: ["items[].image"] },
  "skills.md": { required: ["items"], media: ["items[].preview"] },
  "contact.md": { required: ["title"], media: ["background"] },
  "footer.md": { required: ["tagline"], media: [] },
  "projects/*.md": { required: ["title", "order", "cover"], media: ["cover", "gallery[]"] },
};

export const SECTION_IDS = ["hero", "explorer", "about", "clients", "projects", "lab", "skills", "contact"];
export const SHAPES = ["structure", "ripples", "constellation"];

/** Resolve "a.b", "list[]" and "list[].field" paths to an array of values. */
export function pick(data, path) {
  let vals = [data];
  for (const part of path.split(".")) {
    const isList = part.endsWith("[]");
    const key = isList ? part.slice(0, -2) : part;
    vals = vals.flatMap((v) => {
      const next = v?.[key];
      if (next == null) return [];
      return isList ? (Array.isArray(next) ? next : []) : [next];
    });
  }
  return vals;
}
