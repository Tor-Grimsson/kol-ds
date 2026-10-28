# @kolkrabbi/kol-brand

Kolkrabbi's **brand kit** — the studio's brand manifest conforming to the [`@kolkrabbi/kol-brand-template`](../brand-template) schema, plus the brand SVG assets under `src/svg/`. Manifest is data-only; the `<Asset>` loader needs React (optional peer).

```js
import { brand } from '@kolkrabbi/kol-brand'

brand.meta.name            // 'Kolkrabbi'
brand.ramps[0].stops       // yellow 100–500, literal hex
brand.colors.anchors       // the four semantic identity anchors
brand.logos                // package-relative SVG paths
```

## Brand assets — moved to kol-icons (0.2.0, 2026-10-28)

The marks live in **`@kolkrabbi/kol-icons`**, one folder per identity, the brand's at `identity/kolkrabbi/`: `kolkrabbi.svg` (the icon, `<Icon name="kolkrabbi">`) · `kolkrabbi-logomark.svg` · `kolkrabbi-wordmark.svg` · `kolkrabbi-lockup-h.svg` · `kolkrabbi-lockup-v.svg` · `kolkrabbi-favicon.svg`; `kol-ds/` and `metric/` hold those favicons. Import by path — `@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-wordmark.svg?raw` (or `?url`) — and inline any of them with kol-component's loader. The `brand.logos` / `brand.favicons` entries below point there.

**`src/svg/` is the 30-day ledger**: the same files under their old names, dropped 2026-11-27, with the `<Asset>` loader that globbed them. Until then the section below still works.

### Until 2026-11-27 — `src/svg/` + the `<Asset>` loader

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
