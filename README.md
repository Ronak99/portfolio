# portfolio-v2

Ronak Punase's personal portfolio — a static site built with plain HTML, CSS, and
JavaScript. A small in-browser React layer (compiled at runtime with Babel
standalone) powers an optional design "tweaks" panel.

## Pages

- `index.html` — the portfolio (hero, works, experience, about, media, contact).
- `lamp-toggle.html` — standalone demo of the pendant pull-cord theme switch.

## Running it locally

The pages load some scripts (`type="text/babel"` JSX files) over HTTP, so they must
be served from a web server — opening the files directly with `file://` will not
work because the browser blocks those fetches.

### Option 1 — npm (recommended)

```bash
npm install
npm start
```

Then open http://localhost:3000 in your browser.

### Option 2 — Python (no install)

```bash
python3 -m http.server 3000
```

Then open http://localhost:3000.

## Project structure

```
index.html          portfolio entry point
lamp-toggle.html    lamp toggle component demo
css/                site, menu, and lamp styles
js/                 vanilla behavior + in-browser React (jsx) panels
components/         LampToggle.tsx — the Next.js source of the lamp component
assets/previews/    project preview images
```

> Note: `components/LampToggle.tsx` is the React/Next.js source component
> (next-themes + framer-motion). It is reference source and is not loaded by the
> static pages, which use the vanilla `js/portfolio-lamp.js` / `js/lamp-toggle.jsx`
> implementations instead.
