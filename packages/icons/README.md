# @kolkrabbi/kol-icons

The KOL icon loader — `<Icon/>` plus the 341-icon registry and raw SVG entries.

> **Vite-only.** Uses `import.meta.glob` to load the SVG set, so it requires a Vite-based build.

## Install

```sh
npm i @kolkrabbi/kol-icons   # react / react-dom are peers
```

## Use

```jsx
import { Icon, ICONS, ALL_ICONS, hasIcon } from '@kolkrabbi/kol-icons'

<Icon name="arrow-right" size={16} />
```

- `ICONS` — registry grouped by category (`rack`, `navigation`, `actions`, …).
- `ALL_ICONS` — flat array of every icon name.
- `hasIcon(name)` / `getCategory(name)` — lookup helpers.
- `SVG_ENTRIES` — raw SVG strings for building icon galleries.

## Bring your own icons

Register an app-local SVG folder so `<Icon name>` resolves icons that never ship in the package — each repo carries only what it needs, and the shared set stays small.

```js
import { registerIcons } from '@kolkrabbi/kol-icons'

// once, at app boot. Runs in YOUR source: import.meta.glob is compile-time + path-relative.
registerIcons(import.meta.glob('./icons/**/*.svg', { eager: true, query: '?raw', import: 'default' }))
```

```jsx
<Icon name="my-app-icon" size={16} />   // resolved from your folder
```

Registered icons are keyed by filename (basename), win over the packaged set (add **or** override), and resolve synchronously. Author them with `currentColor` so they theme.

## Tailwind v4 consumers

`Icon`'s wrapper uses Tailwind utilities (`inline-block`, `inline-flex items-center justify-center`), and Tailwind skips `node_modules` when scanning — so point it at this package's source or icon alignment breaks:

```css
@source "../node_modules/@kolkrabbi/kol-icons/src";
```

(Or import `@kolkrabbi/kol-theme/kol-sources.css` once — it carries the `@source` line for every raw-JSX KOL package.)

## Vite consumers: exclude from prebundling

The icon maps are built with `import.meta.glob`, which esbuild's dependency
prebundling doesn't execute — a prebundled copy ships **empty maps**, and every
icon resolves to "not found" in dev. Exclude the package:

```js
// vite.config.js
export default defineConfig({
  optimizeDeps: { exclude: ['@kolkrabbi/kol-icons'] },
})
```

Production builds are unaffected (Rollup handles the glob natively).
