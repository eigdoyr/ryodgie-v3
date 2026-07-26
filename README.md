# ryodgie.com

![The wall](https://raw.githubusercontent.com/eigdoyr/ryodgie-v3/main/public/og-home.jpg)

Portfolio V3 — a single-page wall of design work. Live coded websites,
editorial pieces, posters, type and layout experiments.

**Live:** [www.ryodgie.com](https://www.ryodgie.com)

## Stack

- [Astro](https://astro.build) — static output, content collections
- Plain CSS with custom properties, no framework
- Minimal vanilla JS (eased scroll, staggered reveal)
- Self-hosted DM Sans via Astro's Fonts API
- Deployed on Vercel, auto-deploy on push to `main`

## Structure

Content is data, rendering is disposable. Each project is a JSON file in
`src/content/works/`, validated by a Zod schema in `src/content.config.ts`.
Images are optimized at build time by Astro/sharp. A redesign touches the
components and styles, never the content.

## Adding a project

1. Drop the exported frames in `src/assets/works/<slug>/` (`01.jpg`, `02.jpg`…)
2. Add `src/content/works/<slug>.json` — copy a neighbor and edit
3. `git push` — Vercel builds and deploys

The filename is the slug and the URL. Never rename a published one.

## Develop

​`bash
pnpm install
pnpm dev          # localhost:4321
pnpm build        # production build to dist/
pnpm preview      # serve the built output (needed to test 404, OG)
​`

---

Designed & built by Ryodgie Barnatia. Typeface: DM Sans.
