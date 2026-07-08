# @kolkrabbi/kol-theme

Brand-neutral tokens + base CSS for the KOL (Kolkrabbi) design system. The cascade layer every other KOL package and consumer builds on — design tokens, color/opacity scales, typography, and the canonical `kol-*` component classes.

## Install

```sh
npm i @kolkrabbi/kol-theme
```

## Use

In a Vite + Tailwind v4 app, import the barrel after Tailwind:

```css
@import "tailwindcss";
@import "@kolkrabbi/kol-theme";
```

Cascade order is load-bearing — `kol-theme` must come after Tailwind so its component classes and tokens resolve correctly. Individual files are also reachable (`@kolkrabbi/kol-theme/kol-color.css`, etc.) if you need finer control.

All KOL rule CSS lives in the `components` cascade layer, so your Tailwind utility classes always win over KOL chrome (`<Input className="hidden sm:block">` behaves as written). Your own unlayered CSS wins over everything KOL ships.

## Fonts

The typography CSS references the brand fonts at absolute paths (`/fonts/Right-Grotesk/…`, `/fonts/jetbrains-mono/…`). **The package does not ship the font files** — your app must serve them from `/fonts/` (e.g. drop them in your `public/` dir). The showcase in this repo does exactly that. Without them, type falls back to system fonts.

Pure CSS — no JS, no dependencies.
