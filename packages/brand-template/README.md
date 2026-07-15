# @kolkrabbi/kol-brand-template

The **brand manifest schema** + baked **house defaults** + a **CSS generator**. The keystone of the brand-kit tier:

> The schema is the product. The template conforms to it, the scraper feeds it, the generator emits the CSS skeleton, stationery consumes it, the styleguide renders it.

```js
import { brand } from '@kolkrabbi/kol-brand-template'            // the dummy fixture
import { defineBrand, validateBrand } from '@kolkrabbi/kol-brand-template/schema'
import { withHouseDefaults, HOUSE } from '@kolkrabbi/kol-brand-template/defaults'
import { emitBrandColorCss } from '@kolkrabbi/kol-brand-template/emit-css'
```

## The problem this solves

Before consolidation the "brand manifest" was **split across four file types**, hand-authored per client and drifting:

| Layer | Lived in | Now |
|-------|----------|-----|
| Identity (name, founder, socials) | `config.js` | `manifest.meta` |
| Color (ramps, roles) | `kol-brand-color.css` | `manifest.ramps` + `manifest.identity` → **emitted** |
| Type (families, cuts) | `kol-brand-typography.css` | `manifest.type` (house default) |
| Presence (press, timeline, socials) | `business-data.js` | `manifest.presence` / `press` / `timeline` |

One object is now the single source; the CSS skeleton is a **projection** of it, not a parallel hand-maintained file.

## One object, every layer

`meta` (declared identity) · `identity` (role→ramp bindings) · `ramps` (stops with literal values) · `colors.anchors` (legacy declared-anchor doc surface) · `type` (families + cuts + scale) · `logos` · `clearspace` · `stationery` · `presence` (scraper-fed footprint) · `press` · `timeline`. Full JSDoc types in `src/schema.js`.

`defineBrand(manifest)` is a type anchor (returns its input, gives editors the field types). `validateBrand(manifest)` checks the types of fields that are **present** — it never demands presence. **Every field is optional**; renderers degrade gracefully on gaps.

## House defaults — declare only what differs

`src/defaults.js` bakes the shared KOL baseline so a new client overrides deltas, not the whole thing:

- **Grey ramp** — the fixed 10-stop neutral `#FCFBFB … #131316`, copied verbatim across every client. Emits as `--grey-NN`.
- **Seven hue ramps** — `yellow · red · blue · orange · teal · green · purple` (5 stops each; anchors vary). `green` + `purple` are **new house hues** — hexes provisional, confirm before a client ships on them.
- **Cream** — the project-flavored utility neutral.
- **Type** — Right Grotesk (PP) cuts + JetBrains Mono, the type of every manifest client.
- **Identity** — the default binding is the Kolkrabbi identity (primary `yellow-300`, on-primary `blue-400`, …).

```js
const brand = defineBrand(withHouseDefaults({
  meta: { name: 'Another Creation' },
  // replace the hue set, keep grey + type + cream:
  ramps: [{ id: 'burgundy', label: 'Burgundy', anchor: 200, stops: [/* … */] }],
  // rebrand = these five lines:
  identity: { primary: 'burgundy-200', onPrimary: 'cream-100', primaryStrong: 'burgundy-100',
              secondary: 'cream-300', onSecondary: 'burgundy-300' },
}))
```

`withHouseDefaults` merges the baseline **under** the client: `ramps` union by `id` (client wins, new ids append), `type` arrays replace if present, `identity` shallow-overrides. Idempotent. A client wanting a lean file with *only* its own ramps authors `ramps` directly and calls `emitBrandColorCss(m, { merge: false })`.

## Generator — one object → the CSS skeleton

`emitBrandColorCss(brand)` returns the **4-section `kol-brand-color.css`** string that is the de-facto standard:

| # | Section | Emits | From |
|---|---------|-------|------|
| 1 | **Palette primitives** | `--kol-color-{hue}-{stop}` + `--kol-color-cream-*` + `--grey-*` | `manifest.ramps` |
| 2 | **Brand roles** | `--brand-{primary,on-primary,secondary,on-secondary}` → ramp stops | `manifest.identity` |
| 3 | **Accent rebind** | `--kol-accent-*` ← the brand roles (+ `--kol-accent-primary-strong`) | `manifest.identity` |
| 4 | **Tailwind contract** | `@theme { --color-brand-*, --color-kol-{hue}-* }` | ramps + roles |

Token convention: primitives use the DS-canonical `--kol-color-*` naming (from the authoritative `apps/brand data/color.js`), **not** the legacy `--brand-{hue}-*` prefix. The `--brand-*` tier survives only for the four semantic **role** tokens — the small rebrand surface. This reconciles the two conventions found in the wild instead of inventing a third.

```js
import { writeFileSync } from 'node:fs'
import { brand, emitBrandColorCss } from '@kolkrabbi/kol-brand-template'
writeFileSync('src/brand/kol-brand-color.css', emitBrandColorCss(brand))
```

## Fill-this-in-per-client flow

1. **Copy** `src/index.js` into the client repo as a local package (`packages/brand-data/` — never public npm).
2. **Fill `meta`** — name, founder, url, socials.
3. **Bind `identity`** — pick which ramp stop is primary/secondary + the ink pairs. Override any `ramps` that differ from the house palette; add client-specific hues by new `id`.
4. **Type** — inherit Right Grotesk + JetBrains Mono, or override `type.families`.
5. **Presence** — seed from the scrape adapter (below); add `press` / `timeline` by hand (judgment work).
6. **Emit** `kol-brand-color.css` from the manifest; import it after the DS theme.

## Scrape adapter

```js
import { draftFromScrape } from '@kolkrabbi/kol-brand-template/adapter'
import { scrape } from '@kolkrabbi/kol-scrape'

const draft = draftFromScrape(await scrape('https://client.com'))
// → { meta: { name, url, socials }, presence: { site, profiles, feeds } }
```

Mechanical fields only. Press/timeline entries need judgment (subject-vs-author, collisions, dating) — that's the `kol-press-research` skill, which emits entries in this schema.

## Migration path for the four ad-hoc clients

The 2026-07-09 scan found 4/8 clients already on the 4-section skeleton (`ac`, `acyr`, `hrafn`, `kolkrabbi`) and 4 holdouts. Migration is **per-client, in each client repo** — this package ships the target, it does not execute the move. For each client:

1. **Author the manifest** — collapse the split sources into one object: `config.js` → `meta`; the hand-written `kol-brand-color.css` ramps/roles → `ramps` + `identity`; `business-data.js` → `presence`/`press`/`timeline`. Inherit the house grey + type; declare only the client's hues.
2. **Emit + diff** — run `emitBrandColorCss(manifest)` and diff against the existing hand-authored CSS. Reconcile until the generated file is equivalent (expect the `--brand-{hue}-*` → `--kol-color-{hue}-*` primitive rename; roles/accent unchanged).
3. **Swap the import** — replace the hand-authored file with the generated one; delete the old split sources.

Per-holdout notes from the scan:

| Client | State | Move |
|--------|-------|------|
| **voyager** | closest to the standard | straight manifest authoring + emit/diff |
| **canalix** (pair) | ad-hoc | consolidate the two repos onto one shared manifest package |
| **aftra** | furthest — the lone type outlier (not Right Grotesk / JetBrains) | override `type.families`; do NOT inherit the house type pair |

The four conforming clients also normalize: their `--brand-{hue}-*` primitives migrate to `--kol-color-{hue}-*` on the emit/diff pass. `acyr` already has a consolidated `packages/brand-data/` — re-shape its exports to the manifest schema.

## Conforming packages

- `@kolkrabbi/kol-brand` — Kolkrabbi's own brand (public).
- Client brands — local packages in each client's repo (never public).
