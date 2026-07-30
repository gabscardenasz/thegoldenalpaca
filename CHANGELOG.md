# Changelog — The Golden Alpaca

Tracks each change to `index.html` and `admin.html`. The version number bumps
(1.1, 1.2, 1.3, ...) every time either of those two files is edited. Supporting
asset changes (images, icons, etc.) are listed under whichever version
introduced them.

## v1.1 — 2026-07-30

### Changed
- `index.html` — added 5 `<link rel="icon">` / `<link rel="apple-touch-icon">` tags in `<head>`, right after the viewport meta tag, so browser tabs show the alpaca favicon.
- `admin.html` — added `<link rel="icon">` and `<link rel="apple-touch-icon">` tags so the admin panel's browser tab also shows the alpaca favicon.

### Added (supporting assets)
- `favicon.svg` — favicon built from the alpaca illustration in the site logo, on a cream circular background.
- `favicon.ico` — multi-resolution icon (16×16, 32×32, 48×48), for browsers that don't support SVG favicons.
- `favicon-192.png`, `favicon-512.png` — PNG favicons for Android/PWA use.
- `apple-touch-icon.png` (180×180) — icon shown when the site is added to an iOS home screen.
- `og-image.jpg` (1200×630) — social share preview image using the brand logo, tagline "Handwoven 100% Baby Alpaca — 3× Warmer Than Wool," and site URL. Fixes blank link previews in WhatsApp, iMessage, Facebook, LinkedIn, etc. Referenced by the existing `og:image` meta tag (no meta tag changes needed).

### Notes
- No other content, styling, or script changes were made to either file in this version.
- Deployment target: GitHub Pages. Takes effect once these files are committed to the repo root and GitHub Pages finishes rebuilding (~1–2 min).
- Browser favicon caches and WhatsApp/Facebook link-preview caches update independently of this changelog — expect a delay even after deployment.

---

## How this file works
- Every time `index.html` or `admin.html` changes, a new version entry is added above (v1.2, v1.3, ...) with a dated header and `Changed`/`Added`/`Removed`/`Fixed` sections.
- If only supporting assets change (no edits to `index.html` or `admin.html`), they'll be listed under the current version's `Added`/`Changed` section rather than triggering a new version number.
