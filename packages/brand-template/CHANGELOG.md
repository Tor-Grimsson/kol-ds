# @kolkrabbi/kol-brand-template

## Unreleased

### Minor Changes

- Consolidate the brand-manifest standard into the template. **House defaults** (`./defaults.js`): the fixed grey ramp (`#FCFBFB…#131316`, verbatim across clients), seven hue ramps (`yellow red blue orange teal` + **new** `green` / `purple`), cream, and the Right Grotesk + JetBrains Mono type pair — baked so a client declares only deltas via `withHouseDefaults` (ramps union by id, type/identity override). **CSS generator** (`./emit-css.js`): `emitBrandColorCss(manifest)` projects one manifest object into the 4-section `kol-brand-color.css` skeleton (palette primitives → brand roles → accent rebind → Tailwind `@theme`), on the DS-canonical `--kol-color-*` primitive convention. Schema gains the `identity` role-binding field + `type.cuts`; the placeholder now inherits the house baseline and overrides only its identity. README documents the schema, the fill-per-client flow, and the migration path for the four ad-hoc clients (documentation only — not executed).

## 0.1.0

### Minor Changes

- c750436: New package: the **brand manifest schema** (JSDoc-typed, every field optional, `defineBrand` + `validateBrand`) plus a placeholder reference implementation — the blank slate copied for each new client brand and the dev fixture for generic styleguide renderers. Also ships the **scrape adapter** (`draftFromScrape`, `./adapter` export): maps a `@kolkrabbi/kol-scrape` v1 record onto a partial manifest (meta hints + presence); press/timeline stay judgment work (the kol-press-research skill). First piece of the brand-kit tier; the schema is the contract the scraper feeds, stationery consumes, and the styleguide renders.
