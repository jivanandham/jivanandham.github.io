# jivanandham.com

Personal portfolio of Jeeva Krishnasamy — AI engineer, computer vision and LLM systems.

The site is a **Next.js app** in [`portfolio/`](portfolio/) with:
- Server-side rendering, dynamic API routes, blog engine
- Admin portal for publishing posts
- Multilingual support (EN/FR) via geo-detection

---

## Local Development

```bash
cd portfolio
npm install
cp .env.example .env.local   # then fill in your values
npm run dev                   # http://localhost:3000
```

---

## Deployment (Vercel — recommended)

The site requires a Node.js server (API routes, admin, rate limiting) and **cannot** be hosted on GitHub Pages as a static export.

### First-time setup

1. Push this repo to GitHub (already done).
2. Go to **[vercel.com](https://vercel.com)** → **Add New Project** → import `jivanandham.github.io`.
3. Set **Root Directory** to `portfolio`.
4. Add the following **Environment Variables** in the Vercel dashboard:

   | Variable | Value |
   |---|---|
   | `ADMIN_PASSWORD` | your strong password |
   | `TOKEN_SECRET` | run `openssl rand -hex 32` to generate |
   | `NODE_ENV` | `production` |

5. Click **Deploy**. Vercel builds and deploys automatically.

### Every subsequent push

```bash
git add .
git commit -m "your message"
git push origin main
```

Vercel automatically redeploys on every push to `main`.

### Custom domain

In the Vercel dashboard → **Domains** → add `jivanandham.com` (or your domain).

---

## Admin Portal

Once deployed, go to `https://your-domain.com/admin` to publish blog posts.
The admin panel is blocked from search engine indexing.

---

## Content updates

To update projects, experience, education, or contact details, edit
[`portfolio/data/site.js`](portfolio/data/site.js) — every page reads from it.

---

## Architecture

```
portfolio/
├── app/              # Next.js App Router pages + API routes
│   ├── api/
│   │   ├── admin/    # login, logout, session check, comment moderation
│   │   └── posts/    # CRUD, votes, comments
│   ├── admin/        # Admin portal page
│   └── blog/         # Blog list + post view
├── components/       # UI components (all with CSS Modules)
├── lib/
│   ├── auth.js       # Admin token signing/verification
│   ├── blogStore.js  # JSON-file based blog persistence
│   ├── rateLimit.js  # In-memory rate limiter
│   └── validation.js # Input sanitisation
├── data/
│   ├── site.js       # All personal content
│   ├── posts.js      # Seed blog posts
│   └── storage/      # Runtime data (votes, comments, posts) — git-ignored
└── context/
    └── LanguageContext.jsx  # EN/FR i18n provider
```
