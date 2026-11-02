# Tech stack

What this portfolio site is built with. Versions are the ones installed from `package-lock.json`.

## Core

| Technology | Version | Used for |
|---|---|---|
| [React](https://react.dev) | 19.3.1 | UI components: every section in `src/sections/` and page in `src/pages/` |
| [React DOM](https://react.dev) | 19.3.1 | Rendering React in the browser |
| [React Router](https://reactrouter.com) | 7.18.4 | Client-side routes: the home page and case studies at `/work/<slug>` |
| [Vite](https://vite.dev) | 8.3.5 | Dev server, hot reload and production build into `dist/` |
| [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) | 6.1.2 | JSX and React Fast Refresh in Vite |
| JavaScript (ES modules) + JSX | — | All source code; no TypeScript |
| Node.js | 24 (tested) | Running Vite and the scripts in `scripts/` |

## Motion and graphics

| Technology | Version | Used for |
|---|---|---|
| [Lenis](https://lenis.darkroom.engineering) | 1.3.27 | Smooth scrolling, set up in `src/lib/SiteProvider.jsx` |
| [three.js](https://threejs.org) | 0.186.1 | The Signal Explorer (Research & Interests) point cloud. Loaded only when the section scrolls into view, and skipped on small screens and with reduced motion |
| CSS (plain, one file per component) | — | Layout and animation: loader, 3D-tilt hero, scroll-lit About text, marquee, project accordion, footer clip-path, route curtain |
| Canvas / pointer events | — | Fluid arrow cursor (`src/components/FluidCursor.jsx`) and the hero image trail |

Brand colours live once in `src/styles/tokens.css`: `#050505` jet black, `#FF00A8` magenta pink, `#F5FF00` electric yellow.

## Content pipeline

| Technology | Version | Used for |
|---|---|---|
| Markdown + YAML frontmatter | — | All site copy, in `content/*.md` and `content/projects/*.md` |
| [yaml](https://eemeli.org/yaml/) | 2.9.1 | Parsing frontmatter at build time |
| [marked](https://marked.js.org) | 18.1.1 | Turning case-study Markdown into HTML at build time |
| Custom Vite plugin (`virtual:content`) | — | Defined in `vite.config.js`. Bundles the parsed content as JSON and reloads the dev page when a `.md` file changes |
| `scripts/validate-content.mjs` | — | `npm run check`: checks required fields, media paths and placeholder text. Runs before every build |
| `scripts/make-placeholders.mjs` | — | `npm run placeholders`: regenerates the placeholder SVG art |

`yaml` and `marked` run only at build time, so neither ships to visitors.

## Fonts

Loaded from Google Fonts in `index.html`:

- **Funnel Display**: main sans-serif
- **Archivo**: chips and labels
- **Space Grotesk**: monospace-style details

## Hosting and deployment

The site builds to static files with a single-page-app fallback:

- `vercel.json`: deep-link rewrites for Vercel
- `public/_redirects`: deep-link rewrites for Netlify and Cloudflare Pages

No hosting platform is connected yet. The brief prefers Cloudflare with deploys on every GitHub push.

## Contact form

The form needs no backend. When `formAction` in `content/contact.md` is empty, submitting opens a pre-filled email in the visitor's mail app. Setting `formAction` to a form service URL (e.g. Formspree) makes the form post there instead.

## Not in the stack yet

The portfolio brief asks for these, and the site does not have them yet:

- Astro with React islands (proposed, not adopted)
- Blog with MDX articles
- Bengali and Hindi versions with `hreflang`
- Server-side contact API with validation, rate limiting and a honeypot
- XML sitemap, `robots.txt`, JSON-LD structured data, `llms.txt`
- Analytics (Google Analytics, Search Console)

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server at http://localhost:5173
npm run check      # validate content
npm run build      # check + production build into dist/
npm run preview    # serve dist/ locally
```
