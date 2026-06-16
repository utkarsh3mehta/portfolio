# Utkarsh Mehta — portfolio

An experimental, anti-convention personal site. Built, not templated.

Implemented in **Next.js (App Router) + TypeScript**, ported from an HTML/CSS/JS
prototype. The visual output is recreated faithfully; the structure is idiomatic
React rather than a copy of the prototype's runtime.

## What's in it

- **Landing statement** — two scroll-snapped screens, `BUILDING SYSTEMS` /
  `THAT SHOULD NOT WORK`, with chromatic-aberration display type.
- **Generative background** — a ~460-particle flow-field painted on `<canvas>`,
  recoloured live by the active palette.
- **WHO AM I** — no bio; identity assembled from terminal output, a git log,
  coordinates, console messages, an abandoned sketch and a deploy log.
- **Projects accordion** — each row expands to field notes, stack, and a live
  mockup of the actual product: App Lab's block-coding studio, ARZEN's
  synchronized fleet wall, Dynamic Pricing's self-repricing cinema seat map,
  UnTaboo's calm lesson reader, and Shaping 3D's printer dashboard.
- **Color Lab** — slide-in panel with 8 presets, live per-channel tuning, and
  custom combinations saved to `localStorage`.
- **⌘K command palette** — searchable navigation, palette switching, toggles;
  full keyboard control (↑/↓/↵/esc).
- **Living cursor** — lerp-trailed ring + difference-blend dot that swells over
  interactive elements (fine pointers only).
- **vCard floppy** — hover ejects, click downloads a real `.vcf` (name, title,
  phone, email, location).
- **Accessibility** — honours `prefers-reduced-motion` (plus a manual toggle),
  keyboard navigation, visible focus, optional UI blips (off by default).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production
```

Requires Node 18.18+ (Node 20+ recommended). Fonts (Anton, JetBrains Mono,
Archivo) load from Google Fonts via a CSS `@import`, so the build itself works
offline; the browser fetches the fonts at runtime.

## Structure

```
app/
  layout.tsx     # fonts + metadata
  page.tsx       # renders <Portfolio/>
  globals.css    # base, keyframes, all component styles (themed via CSS vars)
components/
  Portfolio.tsx  # the whole living site (one client component)
lib/
  palettes.ts    # 8 presets + helpers
  content.ts     # chapters, projects, marquee copy
```

## Theming

Every colour flows through CSS custom properties on `:root` (default = the ACID
preset, so first paint is correct before JS runs). The Color Lab rewrites those
variables live; the canvas, cursor and node wall read the current palette from a
ref so a swap recolours everything without re-rendering.
