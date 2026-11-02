# Portfolio site

React 19 + Vite. Lenis handles smooth scrolling and three.js powers the Signal Explorer. All copy and media paths live in
`content/*.md` (YAML frontmatter + markdown body). They are parsed at build time by the
`virtual:content` plugin in `vite.config.js`.

- **Updating content from the owner's notes:** follow `AI_UPDATE_GUIDE.md`. Notes arrive in `inbox/`.
- Validate with `npm run check`, then build with `npm run build`. Run the dev server with `npm run dev`.
- Brand tokens are in `src/styles/tokens.css`. Each section is a component in `src/sections/` with its own CSS file.
- Design references: `../2.md` (layout and motion), `../1.md` (cursor), `../3.md` (Signal Explorer).
