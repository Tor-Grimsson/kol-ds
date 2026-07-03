# @kolkrabbi/kol-brand

Kolkrabbi's **brand kit** — the studio's brand manifest conforming to the [`@kolkrabbi/kol-brand-template`](../brand-template) schema. Data + assets; no server, no React.

```js
import { brand } from '@kolkrabbi/kol-brand'

brand.meta.name            // 'Kolkrabbi'
brand.ramps[0].stops       // yellow 100–500, literal hex
brand.colors.anchors       // the four semantic identity anchors
brand.logos                // package-relative SVG paths
```

Logo assets ship in the package and resolve via the `./logos/*` export:

```js
import wordmark from '@kolkrabbi/kol-brand/logos/kol-wordmark.svg?raw'  // Vite
```

## Sources & scope

Ramps/anchors are the same values as `kol-brand-color.css` (the CSS stays the runtime source of truth; this package carries them as portable facts). Type families match the theme typography reference; logos are the canonical four marks.

**Public package** — personal identifiers, street address, phone, and the person-scoped press archive are deliberately not included. `press`/`stationery` are intentionally empty fields, to be filled deliberately.
