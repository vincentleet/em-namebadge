# Escape Masters Name Badge Generator

Web app for Escape Masters branches to lay out staff name badges on A4 and download a print-ready PDF.

## Features

- **Editor (left):** Add or remove badges (at least one stays). For each badge: **first name** (uppercase, up to 22 characters), **role** via preset (**Game Master**, **Operations Manager**) or **custom role** (free text, up to 28 characters). Long names are scaled down automatically so they fit the badge artwork.
- **Preview (right):** Live **A4 print preview**. Each badge is **3in × 1.2in**, up to **14 badges per page**. Extra badges continue on further A4 pages.
- **Save PDF:** Renders each A4 sheet with [html2canvas](https://github.com/niklasvh/html2canvas) and builds a multi-page PDF with [jsPDF](https://github.com/parallax/jsPDF). Downloads as `escape-masters-name-badges.pdf`. There is no separate browser “Print” button; use **Save PDF** for a consistent result.
- **Header:** Supplier link for blank magnetic badges (Temu) and on-page credit.

## Tech stack

- [React](https://react.dev/) 19 and [Vite](https://vitejs.dev/) 8
- PDF pipeline: `html2canvas` + `jspdf` (see `savePdf` in `src/App.jsx`)

## Local development

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open the URL shown in the terminal.

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Badge background image

The face of each badge uses a raster background referenced in `src/App.jsx` as `DEFAULT_BG`:

- Expected file: **`public/namebadge-bg.png`** (URL includes a cache-busting query; change the file or bump the query in code if you replace the art).

The file `public/badge-bg-placeholder.svg` is **not** used by the app today. To point at a different asset, change `DEFAULT_BG` in `src/App.jsx`.

## Fonts

Panton font files live under `src/assets/fonts/` and are wired in `src/fonts.css` (UI faces plus **Panton Black Caps** for the name line on the badge, with a local **Arial Black** fallback).

## PDF vs browser print

- **Recommended:** **Save PDF** in the preview panel.
- The stylesheet still includes basic `@media print` rules if you use the browser’s print dialog, but layout is optimized around the PDF export path.

## GitHub Pages deployment

Deployments use **GitHub Actions** (`.github/workflows/deploy-github-pages.yml`). On each push to `main`, the workflow runs `npm ci`, `npm run build`, and publishes the `dist` folder to Pages.

### First-time setup

1. Push this repo to GitHub on the `main` branch (or edit the workflow to match your default branch).
2. **Settings → Pages → Build and deployment:** set **Source** to **GitHub Actions**.
3. Run the workflow once (push a commit, or **Actions → Deploy to GitHub Pages → Run workflow**).

Live URL pattern:

`https://<your-username>.github.io/<repository-name>/`

The workflow sets `REPO_NAME` so Vite’s production `base` matches that path; you normally do not edit `vite.config.js` when renaming the repo.

### Local production build

```bash
REPO_NAME=<repository-name> npm run build
npm run preview
```

Without `REPO_NAME`, production builds still default to `/Escape-Masters-Name-Badge-Customiser/` for the asset base path.

### Alternative: `gh-pages` branch

You can run `npm run deploy` to push `dist` to the `gh-pages` branch. In **Settings → Pages**, use **Deploy from a branch** with `gh-pages`, **or** GitHub Actions—not both at once.
