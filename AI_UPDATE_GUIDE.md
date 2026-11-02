# AI update guide

This is for any AI assistant (Claude, Copilot, ChatGPT, …) asked to update this portfolio.
The owner sends information about themselves as markdown. Your job is to turn it into site content.
**Edit only `content/` and `public/media/`.** You do not need to touch any code under `src/`
to change what the site says.

## Workflow

1. **Read the input.** The owner drops raw notes into `inbox/` (any file name, any structure),
   or pastes them into the chat. Treat them as facts about the owner. They do not have to follow this site's format.
2. **Map each fact to a content file** using the table below. Update the existing files. Don't create
   new section files.
3. **Keep the voice.** Headings are short and confident. Labels are UPPERCASE in brackets, like `(ABOUT)`.
   Taglines are two short lines. Don't invent facts. If something the layout needs is missing,
   keep the current placeholder and list it in your reply.
4. **Media.** Put new images or videos in `public/media/` and reference them as `/media/<file>`.
   Use `.webp`/`.jpg`/`.png`/`.svg`, or `.mp4`/`.webm` for video fields that allow it. If ImageMagick
   is installed, convert large photos: `magick in.png -resize '1600x>' -quality 85 public/media/name.webp`.
5. **Validate:** run `npm run check`. It must pass with no errors. Warnings list files that still contain
   the word `PLACEHOLDER`. Remove that word once real content replaces it.
6. **Build:** run `npm run build` to confirm the site compiles.
7. **Clean up:** move processed inbox files to `inbox/processed/`, so they aren't applied twice.
8. **Report** which files changed, and which fields are still placeholders.

## Where each kind of info goes

| Info from the owner | File | Fields |
|---|---|---|
| Name, role, email, location, socials, page title/description | `content/site.md` | `name`, `role`, `wordmark`, `email`, `location`, `socials`, `meta` |
| Intro loader word (usually the name split in two) | `content/site.md` | `loader.left`, `loader.right` |
| Show, hide or reorder home sections | `content/site.md` | `sections` (ids: hero, explorer, about, clients, projects, lab, skills, contact) |
| Menu links | `content/site.md` | `nav` (`href: "#<section id>"`) |
| Big name lines, tagline, chips, portrait | `content/hero.md` | `nameLines`, `tagline` (2 lines), `chips`, `cta` (`label`, `href`), `portrait`, `portraitAlt`, `trail` |
| "What I do" in three parts (the playable dots) | `content/explorer.md` | `heading`, `headingAccent`, body text, `modes[]` (exactly 3; `shape` stays one of structure / ripples / constellation) |
| Bio / about me paragraph | `content/about.md` | the body text (plain prose, 50–70 words reads best), `image` |
| Clients, companies, collaborators, schools | `content/clients.md` | `rows` (two lists of names) |
| Each project / case study | `content/projects/NN-slug.md` | one file per project, see below |
| Experiments, side projects, open source, writing | `content/lab.md` | `items[]` (`image`, `alt`, `text`, optional `title`), `buttons` |
| Skills, services, tools | `content/skills.md` | `items[]` (`title`, `blurb`, `preview` image) — 3 to 6 rows work best |
| Contact copy, form endpoint | `content/contact.md` | `title`, `label`, `submitLabel`, `formAction` (Formspree etc., or empty for mailto) |
| Footer tagline and links | `content/footer.md` | `tagline`, `links`, `credit` |

## Projects

One file per project in `content/projects/`. The file name is `NN-slug.md`. `NN` is only there to sort
the files. The URL is `/work/slug`.

```markdown
---
title: "Project name"          # required
order: 1                       # required, lower = earlier in the list
category: "Major project"      # or "Minor project"
status: "In Development"       # Completed | In Development | Planned
role: "Lead developer"
timeline: "3 months"
year: 2026
team: "4 people"
tags: ["React", "WebGL"]
summary: "One sentence shown in the list and at the top of the page."
cover: "/media/projects/name-cover.webp"   # required, 3:2 works best
gallery: ["/media/projects/name-1.webp"]   # optional extra images
link: "https://live-site.example"          # optional
draft: false                               # true hides it from the site
---
## The brief
Markdown body → the case-study page. Use ## headings, lists, links, images.
```

To **add** a project, create a new file. To **remove** one, delete its file or set `draft: true`.
To **reorder** projects, change `order`.

## Rules

- Frontmatter is YAML. Quote any string that contains `:` `#` or starts with a special character.
- Every path in a media field must exist under `public/`. `npm run check` enforces this.
- Keep the brand colours. They are defined once in `src/styles/tokens.css` (`#050505` background,
  `#FF00A8` primary accent, `#F5FF00` secondary accent). Content never sets colours.
- Never put secrets in content files. Everything in them ships to the public site.
- The required fields for each file are in `SCHEMA` in `src/content/parse.js`.
