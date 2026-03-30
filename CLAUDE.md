# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Astro dev server (with HMR)
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview the production build locally

No test runner or linter is configured.

## Architecture

This is a **Russian-language marketing site** for TriHexa (коврики / mats for cars, home, and garage), built with:

- **Astro 4** — Static site generator; `.astro` pages and layout in `src/pages/` and `src/layouts/`
- **React 18** — All interactive components use `client:load` hydration
- **Tailwind CSS 3** — Utility-first styling with custom brand tokens (see below)
- **GSAP** — All animations (entrance timelines, ScrollTrigger-based reveals, glitch effects, text scramble)
- **Three.js** — Interactive 3D cube in `CubeScene.tsx` with custom GLSL shaders showing product textures

### Page structure

- `src/pages/index.astro` — Landing page, composes: Cursor, Nav, Hero (with 3D cube), Products (horizontal scroll), Features, Contact, Footer
- `src/pages/car.astro`, `home.astro`, `garage.astro` — Product category pages using the shared `ProductPage.tsx` component with a `category` prop
- `src/layouts/Layout.astro` — HTML shell with meta tags, Google Fonts preconnect, lang="ru"

### Key components

- **CubeScene.tsx** — Three.js scene with custom vertex/fragment shaders, mouse-reactive face separation, glitch effects, and particle system. Manages its own render loop and cleanup.
- **Products.tsx** — GSAP ScrollTrigger-pinned horizontal scroll (3 panels × 100vw) with animated text scramble reveals
- **Cursor.tsx** — Custom cursor (dot + ring) with GSAP tracking; disabled on touch devices
- **Intro.tsx** — Full-screen loading/intro overlay (currently commented out in index.astro)
- **ProductPage.tsx** — Shared template for `/car`, `/home`, `/garage` with product cards and marketplace links

### Styling conventions

Brand colors defined as Tailwind tokens (`th-red`, `th-navy`, `th-dark`, `th-light`, `th-white`) and matching CSS custom properties in `global.css`. Fonts: `Oswald` (display/headings), `Inter` (body). Background patterns (`hex-pattern`, `grid-pattern`) and effects (`glitch`, `marquee`, film grain overlay) are in `global.css`.

All content is in Russian. The default cursor is hidden (`cursor: none` on body) in favor of the custom cursor component.

### TypeScript

Uses Astro's strict tsconfig with `jsx: "react-jsx"` and `strictNullChecks: true`.
