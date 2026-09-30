# Analog Terminal — Portfolio

Personal portfolio for Jeeva Krishnasamy. Aesthetic: a 1970s IBM terminal operator designing a website in 2026 — CRT phosphor glow, film grain, IBM Plex trifecta, warm darkroom palette.

## Stack
- Next.js 14 (App Router with Node.js backend server)
- `geoip-lite` (server-side IP geolocation for automatic France/English language detection)
- CSS Modules
- Framer Motion (UI animation)
- GSAP + ScrollTrigger (scroll-driven reveals)

## Run
```bash
npm install
npm run dev      # http://localhost:3000 (Development server)
npm run build    # Production build
npm run start    # Start production server
```

## Bilingual Support (Automatic Geolocation & Manual Switch)
- **Automatic Geolocation**: The backend server inspects the visitor's IP address (via `geoip-lite`), CDN headers (`cf-ipcountry`, `x-vercel-ip-country`), and `Accept-Language`. If the visitor is from France, the site renders automatically in **Français**. Otherwise, it defaults to **English**.
- **Manual Toggle**: Visitors can toggle `[ EN | FR ]` at any time from the navigation rail or mobile tab bar, which persists their preference in a cookie.
- **Backend API**: Accessible at `/api/geo` for real-time location and locale resolution. Testing override: `?country=FR` or `?lang=fr`.

## Deploy
GitHub Pages, via `.github/workflows/deploy.yml` at the repo root. The custom domain
lives in `public/CNAME` so it ships with every build.

## Pages
- `/` — boot sequence, identity, current status, entry points
- `/work` — projects with domain filters; `/work#<slug>` opens a case study directly
- `/record` — experience timeline, education, certifications
- `/info` — bio, dossier, stack, tools
- `/log` — annotated influences
- `/signal` — contact terminal

## Updating content
Everything lives in `data/site.js`:
- `SITE` — name, email, links, location, status, `lastUpdated`
- `VERSION` — shown in the boot log, sidebar, and footer
- `PROJECTS` — add an object; `domains` must match an id in `DOMAINS`
- `EXPERIENCE` — newest first; `end: null` marks the current role
- `EDUCATION`, `CERTIFICATIONS`, `STACK`, `TOOLS`, `INFLUENCES`

Counts in headings ("Nine projects", "Eleven years, five chapters") are computed
from this data, so they stay correct as you add entries.

## Features
- AI Agent Chatbot: click `>_ ASK AGENT` (or type `agent` / `chat` in the command line) to converse with Jeeva's interactive portfolio agent powered by local RAG over all projects, experience, skills, and availability (with optional external LLM mode)
- Command line: press `/` or `Ctrl/⌘ + K` anywhere (or click `/` in the sidebar)
- Boot sequence is skippable with any key or tap, and skipped automatically on repeat visits in the same session
- Sitemap, robots.txt, favicon, and schema.org `Person` data generated at build time
- Respects `prefers-reduced-motion`; skip link and visible focus states for keyboard users
- Film grain is a pure SVG `feTurbulence` filter — no image assets

## Notes
- Replace the portrait placeholder in `components/Info.jsx` with a real photo (duotone styles already applied via CSS).
- `public/images/` holds logos from the previous version of the site; they are not currently used.
