# @kolkrabbi/kol-loader

The KOL icon loader — `<Icon/>` plus the 341-icon registry and raw SVG entries.

> **Vite-only.** Uses `import.meta.glob` to load the SVG set, so it requires a Vite-based build.

## Install

```sh
npm i @kolkrabbi/kol-loader   # react / react-dom are peers
```

## Use

```jsx
import { Icon, ICONS, ALL_ICONS, hasIcon } from '@kolkrabbi/kol-loader'

<Icon name="arrow-right" size={16} />
```

- `ICONS` — registry grouped by category (`rack`, `navigation`, `actions`, …).
- `ALL_ICONS` — flat array of every icon name.
- `hasIcon(name)` / `getCategory(name)` — lookup helpers.
- `SVG_ENTRIES` — raw SVG strings for building icon galleries.
