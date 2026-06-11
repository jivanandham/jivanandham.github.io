# Analog Terminal — Portfolio

Personal portfolio for Jeeva Krishnasamy. Aesthetic: a 1970s IBM terminal operator designing a website in 2026 — CRT phosphor glow, film grain, IBM Plex trifecta, warm darkroom palette.

## Stack
- Next.js 14 (App Router)
- CSS Modules
- Framer Motion (UI animation)
- GSAP + ScrollTrigger (scroll-driven reveals)

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Deploy
Vercel-ready out of the box — import the `portfolio/` directory as the project root.

## Structure
- `app/` — pages: `/` (INDEX), `/work`, `/info`, `/log`, `/signal`
- `components/` — Sidebar, Landing (boot sequence), WorkList, Info, Signal
- `data/site.js` — all content (name, projects, stack, influences). Edit this to update the site.
- `hooks/useTypewriter.js` — human-feeling variable-delay typing effect

## Notes
- Respects `prefers-reduced-motion` (typing/reveals degrade to instant/opacity).
- Film grain is a pure SVG `feTurbulence` filter — no image assets.
- Replace the portrait placeholder in `components/Info.jsx` with a real photo (duotone styles already applied via CSS).
