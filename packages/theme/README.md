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
@import "@kolkrabbi/kol-theme";            /* everything, domain packs included */
/* or the app tier only — chess · workshop · foundry · dashboards · styleguide
 * are 23 % of the theme, and an app that renders none of them need not ship them:
 * @import "@kolkrabbi/kol-theme/core";
 * @import "@kolkrabbi/kol-theme/kol-components-dashboards.css" layer(components);  ← a pack you do render, after it */
```

Cascade order is load-bearing — `kol-theme` must come after Tailwind so its component classes and tokens resolve correctly. Individual files are also reachable (`@kolkrabbi/kol-theme/kol-color.css`, etc.) if you need finer control.

All KOL rule CSS lives in the `components` cascade layer, so your Tailwind utility classes always win over KOL chrome (`<Input className="hidden sm:block">` behaves as written). Your own unlayered CSS wins over everything KOL ships.

## The `@source` contract — required for every KOL package that ships JSX

Tailwind v4 **does not scan `node_modules`**, so layout utilities emitted inside KOL components never generate unless you point the scanner at each package's source. Without these lines components **silently degrade** — no error, no warning, just missing layout/motion (a frozen ThemeToggle roll, a collapsed AppShell grid). Paste one line per installed KOL package, next to the imports above:

```css
@source "../node_modules/@kolkrabbi/kol-component/src";
@source "../node_modules/@kolkrabbi/kol-framework/src";
```

(Adjust the relative path to your CSS file's location. Component-load-bearing *chrome* lives in this package's CSS and needs no `@source` — the contract covers the remaining per-render utilities.)

## Fonts

The typography CSS references the brand fonts at absolute paths (`/fonts/right-grotesk/…`, `/fonts/jetbrains-mono/…`). **The package does not ship the font files** — your app must serve them from `/fonts/` (e.g. drop them in your `public/` dir). The showcase in this repo does exactly that. Without them, type falls back to system fonts.

Pure CSS — no JS, no dependencies.
