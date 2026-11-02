// All site content, parsed from /content/**/*.md at build time (see vite.config.js).
// Sections import the object they need from here; nothing else touches the files.
import content from "virtual:content";

export const { site, hero, explorer, about, clients, lab, skills, contact, footer, projects } = content;
