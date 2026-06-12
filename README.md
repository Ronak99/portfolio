# Ronak Punase — personal portfolio (Next.js)

A static portfolio built with Next.js App Router, TypeScript, and Tailwind CSS v4. All content lives in a single JSON file for easy editing.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content

All portfolio content is in [`data/portfolio.json`](data/portfolio.json). Edit this file to update:

- Hero text, works, experience, about, media links, socials, contact email
- Project bullets use structured tokens (`text`, `strong`, `link`) — see [`data/types.ts`](data/types.ts)

Preview images live in [`public/assets/previews/`](public/assets/previews/).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build static export to `out/` |
| `npm run preview` | Serve the `out/` folder locally |

## Deploy to Vercel

Push to GitHub and connect the repo in Vercel. Next.js is auto-detected — no extra config needed. The site uses `output: 'export'` for a fully static build.

## Project structure

```
app/              layout, page, globals.css
components/       React sections + interactive UI (menu, lamp)
hooks/            Animation logic (scroll reveal, menu, lamp)
data/             portfolio.json + TypeScript types
public/assets/    Preview images
```
