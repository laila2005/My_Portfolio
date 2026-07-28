# 🚀 Laila Mohamed Fikry — Portfolio

Personal portfolio, engineering case study, and technical writing.

**Live:** [my-portfolio-mm2c.vercel.app](https://my-portfolio-mm2c.vercel.app/)

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Vite 5, Tailwind CSS, framer-motion, Lenis (smooth scroll)
**UI primitives:** a small subset of shadcn/ui
**Backend:** Vercel serverless function (`api/contact.js`) → Resend for contact-form email
**Deployment:** Vercel

## 🎯 Features

- **Responsive, mobile-first** layout with a full dark mode (applied pre-paint, so no theme flash)
- **Interactive hero** with a 3D scene, typewriter effects, and glassmorphism
- **Per-project detail pages** — each project is deep-linkable, with gallery and engineering notes, so projects with private repos still have public proof
- **LM-MS case study** — long-form architecture write-up with an inline SVG diagram
- **Writing** — technical posts stored as structured content blocks
- **Contact form** with validation, request timeout, and screen-reader announcements
- **Accessibility** — skip link, labelled controls, keyboard-operable cards, and `prefers-reduced-motion` support throughout
- **Performance** — WebP imagery with intrinsic dimensions set, lazy loading below the fold, and route-level code splitting

## 🚀 Quick Start

```bash
git clone https://github.com/laila2005/My_Portfolio.git
cd My_Portfolio
npm install
npm run dev
```

Visit `http://localhost:8080` (override with `npm run dev -- --port 5273`).

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the built output |
| `npm run lint` | ESLint |
| `npm run assets` | Regenerate the social card + compress `public/` images to WebP |

## 🚀 Vercel Deployment

Configured for Vercel with serverless functions.

### Environment variables required

- `RESEND_API_KEY` — Resend API key
- `EMAIL_FROM` — verified sender address (e.g. `onboarding@resend.dev`)

If either is missing the endpoint returns a clear configuration error rather than failing
silently.

### Steps

1. Connect the GitHub repository to Vercel
2. Set the framework preset to **Vite**
3. Add the environment variables
4. Deploy — the contact form posts to `/api/contact`

## 📁 Project Structure

```
api/contact.js                 Contact form → Resend (input escaped, rate-limited by Vercel)
scripts/generate-assets.mjs    Social card generation + WebP compression (sharp)
src/
├── data/                      Content as data — the single source of truth
│   ├── experience.ts          Roles, education, certifications
│   ├── projects.ts            Project catalogue + detail-page content
│   ├── posts.ts               Writing, as structured blocks (no raw HTML)
│   └── image-dimensions.json  Generated intrinsic sizes (prevents layout shift)
├── pages/                     Home, LM-MS case study, writing, project detail, 404
├── components/                Home-page sections + shared UI
│   └── ui/                    shadcn/ui primitives
└── lib/                       Utilities
```

Work history is rendered from `src/data/experience.ts` by **both** the About and Experience
sections, so the two can never disagree about a job title or employer again.

## 🎨 Key Sections

- **Hero** — 3D scene, typewriter, CTAs, live terminal panel
- **About** — background, education, certifications
- **Skills** — capability areas in a bento grid
- **Experience** — timeline, linking to the case study
- **Projects** — filterable bento grid linking to per-project pages
- **Testimonials** — real client reviews only, with a link to the original review
- **Contact** — validated form with accessible status messaging

## 🔧 Customization

1. **Work history / education** → `src/data/experience.ts`
2. **Projects and their detail pages** → `src/data/projects.ts`
3. **Writing** → `src/data/posts.ts`
4. **Theme tokens and utilities** → `src/index.css` and `tailwind.config.ts`
5. **New or replacement imagery** → add to `scripts/generate-assets.mjs` and run `npm run assets`

## 📝 Content notes

- **Testimonials must be real.** `src/components/Testimonials.tsx` renders nothing when its
  array is empty — never fill it with invented quotes.
- **The LM-MS case study is deliberately architecture-level only.** It omits schema, internal
  component names, hosts, ports, versions, and licensing details because the product is
  commercial. Read the disclosure note at the top of `src/pages/CaseStudyLMMS.tsx` before
  adding detail.
- Unverified figures are rendered as loud amber `[bracketed]` placeholders. If one is visible
  on the live site, it needs filling in or deleting — it is not finished copy.

## 📧 Contact

- **LinkedIn:** [laila-mohamed23](https://www.linkedin.com/in/laila-mohamed23/)
- **GitHub:** [laila2005](https://github.com/laila2005)
- **Email:** laila.mohamed.fikry@gmail.com

⭐ **Star this repo if you found it helpful!**
