# paulrusu.ro

Personal website and CV of Paul Rusu (Rusu Adrian Paul), senior full-stack developer. Built to support a search for a full-time role.

## Stack and deploy

- Static site, no build step, no framework. Edit the files and push.
- Hosted on **Cloudflare Pages**, connected to this repo. Every push to `main` deploys automatically to https://paulrusu.ro (DNS is on Cloudflare).
- `_headers` sets cache lifetimes (fonts immutable for a year).
- Google Search Console is set up for the domain property; sitemap submitted as `https://paulrusu.ro/sitemap.xml`.

## Files

| File | What it is |
|---|---|
| `index.html` | Home page: hero with portrait and "request path" console, numbers, projects (Hyper, Cazare Mihaieni), experience with tech filter, approach, skills, contact. All CSS and JS inline. |
| `cv.html` | CV page: plain white text on black on screen, black on white when printed. |
| `cv.pdf` | 2-page A4 CV rendered from `cv.html` (print styles). Regenerate it whenever `cv.html` changes. |
| `analytics.js` | GA4 (`G-9NFBESNLGG`) behind a consent banner. gtag loads only after Accept. Custom events via `data-track="event_name"` and optional `data-track-label`. |
| `fonts/` | Self-hosted, trimmed variable fonts: Archivo (display), Figtree (body), JetBrains Mono (labels), Source Serif 4 (CV headings). Latin + latin-ext files. |
| `photo.webp`, `photo-208.webp` | Portrait, 344px and 208px, served with `srcset`. |
| `robots.txt`, `sitemap.xml`, `llms.txt` | Search and AI discovery. AI crawlers are explicitly allowed. `llms.txt` follows the link-list format. |
| `404.html` | Needed so Cloudflare Pages does not serve the home page for unknown URLs. |

## Regenerating cv.pdf

Render `cv.html` with Chromium in print mode, A4, backgrounds on, CSS page size preferred (Playwright `page.pdf(format='A4', print_background=True, prefer_css_page_size=True)` after `emulate_media(media='print')`). Serve the folder over HTTP so `/fonts/...` resolves. Check it stays at **2 pages**; tighten the `@media print` rules in `cv.html` if it spills.

## Content rules (decided with Paul)

- Site and CV are in **English**.
- Do **not** name the current client (a global sports betting and gaming group, via We as Web). Say "a global sports betting and gaming group".
- Do **not** mention team sizes (no "team of five"); say "cross-functional development team".
- Keep AI tooling **tool-agnostic**: "AI coding assistants", "agentic workflows". Never name a specific AI product.
- Do **not** mention Goldchain Software (his company, being closed).
- Named clients/projects that are OK: LexisNexis and Fortune (3Pillar), Animoca Brands and Motorverse (StarChain, no link to Motorverse), imobiliare.ro, Hyper, Cazare Mihaieni (https://cazaremihaieni.ro).
- Hyper is both a multi-tenant SaaS and a white-label platform deployable per client with their own brand and domain.
- Numbers section: 10+ years, 10+ clients, 20+ projects, 50+ technologies, 5+ countries, 1M+ users. Only real figures from Paul.
- Phone number appears on the CV page only, not on the home page.
- The same CV content also lives in a Claude Docs document and must be kept in sync when the CV changes.

## Design rules

- **Light theme only** on the home page (no dark mode). The CV page is intentionally black.
- "Liquid glass" look: translucent gradient surfaces with inset light rims, animated colour fog in the background, pointer-following sheen on cards.
- No borders: separate things with tone, space and soft shadows.
- **Performance rule:** do not add `backdrop-filter` anywhere except the floating nav, and do not put live `filter: blur()` on the fog. Both were measured to drop a throttled phone from 60 fps to ~15 fps and caused poor LCP/INP in real-user data. The fog uses pre-softened radial gradients and composited transforms only.
- Hero animations must not start at `opacity: 0` (it delays LCP).
- The page is wrapped in `<!--email_off-->` so Cloudflare does not inject its email-decode script.
- Respect `prefers-reduced-motion`.

## Commits

Author as `Paul Rusu <paul.rusu94@gmail.com>`. Push to `main` deploys to production, so check the page renders before pushing.
