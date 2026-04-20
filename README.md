# TriHexa — Marketing Site

Freelance project. Russian-language marketing site for TriHexa, a mat manufacturer (car, home, garage). Static site with a Three.js 3D hero, GSAP-driven animations, and horizontal scroll product sections.

**Live stack:** Astro 4 · React 18 · Tailwind CSS 3 · GSAP · Three.js

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing — 3D cube hero, product overview, features, contact |
| `/car` `/home` `/garage` | Category pages with product cards and marketplace links |
| `/privacy` `/terms` | Legal |

## Notable bits

- **CubeScene.tsx** — Three.js scene with custom GLSL shaders, mouse-reactive face separation, particle system, and glitch effect
- **Products.tsx** — GSAP ScrollTrigger pinned horizontal scroll with text scramble reveals
- **Cursor.tsx** — Custom cursor (dot + ring), disabled on touch devices

## Dev

```bash
npm install
npm run dev      # localhost:4321, HMR
npm run build    # output to dist/
npm run preview  # preview production build
```

No test runner or linter configured.
