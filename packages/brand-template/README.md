# @kolkrabbi/kol-brand-template

The **brand manifest schema** + a placeholder reference implementation. The keystone of the brand-kit tier:

> The schema is the product. The template conforms to it, the scraper feeds it, stationery consumes it, the styleguide renders it.

```js
import { brand } from '@kolkrabbi/kol-brand-template'          // the dummy fixture
import { defineBrand, validateBrand } from '@kolkrabbi/kol-brand-template/schema'
```

## Two jobs

1. **The slate.** New client brand? Copy `src/index.js` into the client's repo as a local package, fill the fields, delete what you don't need. **Every field is optional** — renderers must degrade gracefully on missing fields. **Per-client instances never ship to public npm** (confidentiality rule).
2. **The dev fixture.** Generic styleguide renderers (type specimens, swatches, spectrum grids) develop against this obviously-dummy brand ("Norðurljós Vinnustofa").

## The manifest shape

`meta` (declared identity) · `colors.anchors` · `ramps` (stops with literal values) · `type` (families + scale) · `logos` (package-relative SVG paths) · `clearspace` · `stationery` · `presence` (scraper-fed observed footprint) · `press` · `timeline`. Full JSDoc types in `src/schema.js`.

`defineBrand(manifest)` is a type anchor (returns its input, gives editors the field types). `validateBrand(manifest)` checks the types of fields that are **present** — it never demands presence.

## Scrape adapter

```js
import { draftFromScrape } from '@kolkrabbi/kol-brand-template/adapter'
import { scrape } from '@kolkrabbi/kol-scrape'

const draft = draftFromScrape(await scrape('https://client.com'))
// → { meta: { name, url, socials }, presence: { site, profiles, feeds } }
```

Mechanical fields only. Press/timeline entries need judgment (subject-vs-author, collisions, dating) — that's the `kol-press-research` skill, which emits entries in this schema.

## Conforming packages

- `@kolkrabbi/kol-brand` — Kolkrabbi's own brand (public).
- Client brands — local packages in each client's repo (never public).
