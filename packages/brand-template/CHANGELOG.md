# @kolkrabbi/kol-brand-template

## 0.1.0

### Minor Changes

- c750436: New package: the **brand manifest schema** (JSDoc-typed, every field optional, `defineBrand` + `validateBrand`) plus a placeholder reference implementation — the blank slate copied for each new client brand and the dev fixture for generic styleguide renderers. Also ships the **scrape adapter** (`draftFromScrape`, `./adapter` export): maps a `@kolkrabbi/kol-scrape` v1 record onto a partial manifest (meta hints + presence); press/timeline stay judgment work (the kol-press-research skill). First piece of the brand-kit tier; the schema is the contract the scraper feeds, stationery consumes, and the styleguide renders.
