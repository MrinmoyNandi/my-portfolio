// Checks every file in content/ against SCHEMA: frontmatter parses, required
// fields exist, referenced media exists under public/, explorer shapes are valid.
// Run: npm run check   (also runs before every build)
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdown, pick, SCHEMA, SECTION_IDS, SHAPES } from "../src/content/parse.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "content");
const errors = [];
const warnings = [];

function check(rel, rule) {
  const path = join(CONTENT, rel);
  if (!existsSync(path)) return errors.push(`${rel}: file is missing`);
  let parsed;
  try {
    parsed = parseMarkdown(readFileSync(path, "utf8"));
  } catch (e) {
    return errors.push(`${rel}: frontmatter is not valid YAML (${e.message.split("\n")[0]})`);
  }
  const { data, body } = parsed;
  for (const key of rule.required) {
    if (pick(data, key).length === 0 || data[key] === "") errors.push(`${rel}: required field "${key}" is missing`);
  }
  if (rule.body && !body) errors.push(`${rel}: needs body text below the frontmatter`);
  for (const key of rule.media) {
    for (const src of pick(data, key)) {
      if (typeof src !== "string" || !src || /^https?:/.test(src)) continue;
      if (!existsSync(join(ROOT, "public", src))) errors.push(`${rel}: ${key} -> "${src}" not found in public/`);
    }
  }
  const text = JSON.stringify(data) + body;
  if (text.includes("PLACEHOLDER")) warnings.push(`${rel}: still contains PLACEHOLDER text`);
  return data;
}

for (const [rel, rule] of Object.entries(SCHEMA)) {
  if (!rel.includes("*")) {
    const data = check(rel, rule);
    if (rel === "site.md" && data?.sections) {
      for (const id of data.sections) if (!SECTION_IDS.includes(id)) errors.push(`site.md: unknown section "${id}" (valid: ${SECTION_IDS.join(", ")})`);
    }
    if (rel === "explorer.md" && data?.modes) {
      if (data.modes.length !== 3) errors.push("explorer.md: modes must have exactly 3 entries");
      for (const m of data.modes) if (!SHAPES.includes(m.shape)) errors.push(`explorer.md: shape "${m.shape}" must be one of ${SHAPES.join(", ")}`);
    }
    continue;
  }
  const dir = join(CONTENT, dirname(rel));
  const slugs = new Set();
  for (const name of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const data = check(`${dirname(rel)}/${name}`, rule);
    const slug = data?.slug || name.replace(/\.md$/, "").replace(/^\d+[-_]/, "");
    if (slugs.has(slug)) errors.push(`${dirname(rel)}/${name}: duplicate slug "${slug}"`);
    slugs.add(slug);
  }
}

for (const w of warnings) console.warn(`  warn  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`  error ${e}`);
  console.error(`\ncontent check failed: ${errors.length} error(s)`);
  process.exit(1);
}
console.log(`content check passed${warnings.length ? ` (${warnings.length} placeholder warning(s))` : ""}`);
