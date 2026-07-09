# @kolkrabbi/kol-brand

Kolkrabbi's **brand kit** — the studio's brand manifest conforming to the [`@kolkrabbi/kol-brand-template`](../brand-template) schema, plus the brand SVG assets under `src/svg/`. Manifest is data-only; the `<Asset>` loader needs React (optional peer).

```js
import { brand } from '@kolkrabbi/kol-brand'

brand.meta.name            // 'Kolkrabbi'
brand.ramps[0].stops       // yellow 100–500, literal hex
brand.colors.anchors       // the four semantic identity anchors
brand.logos                // package-relative SVG paths
```

## Brand assets — `src/svg/` + the `<Asset>` loader

All brand marks (logos, wordmark, favicons) live in one `src/svg/` folder with the loader co-located — the `<Icon>`/`<Graphic>` pattern rehomed here. **Nothing is inlined in source; assets are files, loaded.** Two ways in:

```jsx
import { Asset, ASSET_NAMES } from '@kolkrabbi/kol-brand/svg'
<Asset name="kol-wordmark" className="h-6 w-auto text-fg-88" />

// or a raw single-file import (Vite):
import wordmark from '@kolkrabbi/kol-brand/svg/kol-wordmark.svg?raw'
```

Names: `kol-wordmark`, `kol-logomark`, `kol-lockup-hori`, `kol-lockup-vert`, `favicon-kolkrabbi`, `favicon-kol-ds`. The **Workshop wordmark** is font-set (not yet an SVG) — its treatment is preserved at `svg/wordmark-workshop.spec.md` for tracing to `wordmark-workshop.svg` later.

## Sources & scope

Ramps/anchors are the same values as `kol-brand-color.css` (the CSS stays the runtime source of truth; this package carries them as portable facts). Type families match the theme typography reference; logos are the canonical four marks.

**Public package** — personal identifiers, street address, phone, and the person-scoped press archive are deliberately not included. `press`/`stationery` are intentionally empty fields, to be filled deliberately.
