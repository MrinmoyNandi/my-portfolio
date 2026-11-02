# portfolio-web

A dark, neon, editorial portfolio site:

- **Look and motion** from `../2.md`: letter-rise loader, 3D-tilt hero, scroll-lit paragraph, marquee,
  project accordion, mouse-follow skill previews, clip-path footer and route curtain.
- **Fluid arrow cursor** from `../1.md`.
- **Signal Explorer** from `../3.md`: a playable 2,400-point three.js cloud, placed right after the intro.

Palette: `#050505` background · `#FF00A8` primary accent · `#F5FF00` secondary accent.

## Run

```bash
npm install
npm run dev        # http://localhost:5173, reloads when content/*.md changes
npm run check      # validate content
npm run build      # check + production build into dist/
npm run preview    # serve dist/
```

## Editing content

Everything the site says is in `content/`:

```
content/
  site.md        name, email, socials, nav, section order, loader
  hero.md        big name, tagline, chips, portrait
  explorer.md    the playable Build / Teach / Connect section
  about.md       scroll-lit bio paragraph
  clients.md     marquee names
  projects/      one .md per case study -> /work/<slug>
  lab.md         experiments
  skills.md      skill rows + hover previews
  contact.md     contact card + form endpoint
  footer.md      footer tagline + links
```

To have an AI do it: drop your notes in `inbox/` and ask it to "update the portfolio from the inbox".
The procedure is in `AI_UPDATE_GUIDE.md`.

Placeholder art lives in `public/media/placeholders/` (regenerate it with `npm run placeholders`).
Replace it with real media as you add content.

## Stack

React 19, Vite, react-router (case-study pages), Lenis (smooth scroll), three.js (lazy-loaded),
yaml + marked (build time only). The site is a static SPA. `vercel.json` and `public/_redirects` handle
deep links on Vercel and Netlify.

## Structure

```
src/
  content/     parse.js (shared schema), build.js (node), index.js (exports)
  lib/         SiteProvider (Lenis, loader state, curtain navigation), hooks
  components/  FluidCursor, Loader, Nav, RouteCurtain, SignalText, primitives
  sections/    Hero, SignalExplorer (+ signalScene.js), About, Clients, Projects, Lab, Skills, Contact, Footer
  pages/       Home (renders site.md `sections` in order), ProjectPage
  styles/      tokens.css, global.css
```
