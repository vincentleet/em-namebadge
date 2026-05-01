# Escape Masters Name Badge Customiser

Web app for Escape Masters branches to create printable staff name badges.

## What It Does

- Add multiple badges in one session.
- Enter first name and choose role (`Game Master` or `Operations Manager`).
- Live preview each badge at real print size: 3in x 1.2in.
- Print or save all badges as PDF on an A4 page.

## Local Development

1. Install dependencies:
   - `npm install`
2. Start dev server:
   - `npm run dev`
3. Open the URL shown in terminal.

## Printing / PDF Export

1. Click `Print / Save PDF`.
2. In your browser print dialog:
   - Paper size: `A4`
   - Scale: `100%` (or `Actual size`)
   - Margins: `Default` or `None` depending on printer behavior
3. Print directly or save to PDF.

## Background Image And Font Upgrades

- Current background is a placeholder asset at `public/badge-bg-placeholder.svg`.
- To replace the background for all badges, swap that file or update `DEFAULT_BG` in `src/App.jsx`.
- Current text uses a fallback family defined in `src/fonts.css`.
- When you receive Panton files, replace the `@font-face` source in `src/fonts.css`.

## GitHub Pages Deployment

### First-time setup

1. Create a GitHub repository (recommended name: `Escape-Masters-Name-Badge-Customiser`).
2. Push this project to the `main` branch.
3. In GitHub repository settings, enable Pages from `gh-pages` branch.

### Deploy

Run:

- `npm run deploy`

This builds the app and publishes `dist` to `gh-pages`.

## Note About Repository Name

`vite.config.js` currently uses:

- `/Escape-Masters-Name-Badge-Customiser/` as production base path.

If your repository name is different, update the `base` value in `vite.config.js`.
