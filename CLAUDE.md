# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static single-page landing site for **NB Accounting Visa Services** (Thai accounting / visa / work-permit firm). Bilingual Thai + English. No build step — everything ships straight from `index.html` + `images/` to Vercel.

## Commands

```bash
npm run dev       # serve . on http://localhost:3000 (npx serve)
npm run preview   # serve . on :5000
npm run format    # prettier --write **/*.{html,css,js,json,md}
npm run validate  # html-validate index.html
```

Deploy: auto-deploys on push to `main` via Vercel (config in `vercel.json`). `vercel --prod` from CLI also works.

## Architecture

- **`index.html`** — the entire site. One ~80KB file containing head metadata, inline `<style>` CSS variables/overrides, inline `<script>` for language toggle + interactions, and all section markup (hero, services, team, testimonials, contact). There is **no bundler, no framework, no component system** — edits are made in-place in this file.
- **Styling** — Tailwind via CDN (`cdn.tailwindcss.com`). Brand palette is defined as CSS custom properties (`--brand: #043566` navy) in the inline `<style>` block near the top of `index.html`. Typography: IBM Plex Sans Thai (th) + Plus Jakarta Sans (en) from Google Fonts, switched via `html[lang="…"]` selectors.
- **Icons** — Iconify via CDN (`<iconify-icon>` web component). No local icon assets.
- **i18n** — Language toggle is DOM-driven: elements carry `data-th` / `data-en` attributes and inline JS swaps `textContent` and flips `<html lang>`. When adding copy, add both languages.
- **SEO surface** — canonical URL, Open Graph, Twitter Card, and JSON-LD `AccountingService` structured data live in `<head>`. `sitemap.xml` and `robots.txt` are hand-maintained. After any domain change, update all three of: canonical/og:url in `index.html`, `sitemap.xml`, and `robots.txt` (see README "หลัง deploy แล้วต้องอัปเดต 3 จุด").
- **Vercel config** — `vercel.json` sets security headers (HSTS, X-Frame-Options, Permissions-Policy), immutable cache for `/images/*` and static assets, no-cache for `/`, plus `/home → /`, `/contact → /#contact`, `/services → /#services` redirects.
- **CI** — `.github/workflows/` runs HTML validation.

## Conventions

- Preserve the dual Thai/English content model in every text change.
- Brand color is `#043566` (navy). Change it in the CSS variables at the top of `index.html`, not scattered inline.
- Keep external dependencies as CDN links — do not introduce a bundler/npm runtime deps without explicit request.
- Images in `/images/` are cached immutably; rename on content change rather than overwriting (or accept stale caches).
