---
title: Brand kit — the manifest schema and its satellites
type: reference
status: active
updated: 2026-07-10
description: The brand-kit tier — the manifest schema as the contract, its baked house defaults + emit-css generator, the template slate, Kolkrabbi's own kol-brand package, the kol-scrape CLI + adapter that feed it, and the confidentiality rule for client instances.
aliases:
  - brand-kit
sources:
  - packages/brand-template/src/schema.js
  - packages/brand-template/src/defaults.js
  - packages/brand-template/src/emit-css.js
  - packages/brand/src/index.js
  - packages/scrape/src/index.js
tags:
  - domain/design-system
  - brand/assets
related:
  - "[[../01-foundations/02-color|color]]"
  - "[[../00-overview/INDEX|overview]]"
  - "[kol-brand plan (executed)](../../../.kol/llm-context/backlog/2026-07-03-kol-brand.md)"
---

# Brand kit — the manifest schema and its satellites

> **The schema is the product. The template conforms to it, the scraper feeds it, the generator emits the CSS skeleton, stationery consumes it, the styleguide renders it.**

A **brand kit** is a data + assets package — no server (unlike the clients tier). It kills the copy-a-client-and-swap-fields workflow: brand facts live in one versioned package per brand, all conforming to one schema.

## The manifest schema

`@kolkrabbi/kol-brand-template` defines `BrandManifest` (JSDoc-typed): `meta` (declared identity) · `identity` (role→ramp bindings — which stop is primary/secondary + the ink pairs) · `colors.anchors` · `ramps` (literal hex per stop) · `type` (families + cuts + scale) · `logos` (package-relative SVGs) · `clearspace` · `stationery` · `presence` (observed footprint, scraper-fed) · `press` · `timeline`.

**Every field is optional** — fill or leave empty; renderers must degrade gracefully. `defineBrand()` is the type anchor; `validateBrand()` checks types of present fields only.

**House defaults + generator.** `withHouseDefaults()` bakes the shared KOL baseline — the fixed 10-stop grey ramp, the seven house hues + cream, the Right Grotesk (PP) / JetBrains Mono type pair, and the default Kolkrabbi `identity` binding — so a client declares only its deltas (a hue, the identity lines, an overriding `type.families`). `emitBrandColorCss(manifest)` then projects the manifest into the de-facto **4-section `kol-brand-color.css`** skeleton — palette primitives (`--kol-color-*` / `--grey-*`) → brand roles (`--brand-*`) → accent rebind (`--kol-accent-*`) → Tailwind `@theme` contract — ending the hand-authored per-client colour file.

## The packages

| Package | Role | Registry |
|---|---|---|
| `kol-brand-template` | Schema + baked **house defaults** (`withHouseDefaults`) + the **emit-css** generator (`emitBrandColorCss`) + placeholder "Norðurljós" **slate** (dev fixture for generic styleguide renderers). Also ships the scrape **adapter**. | public |
| `kol-brand` | Kolkrabbi's real manifest — identity, 4 anchors, 7 ramps, type; plus the brand SVG assets (logos, wordmark, favicons) in `src/svg/` with an `<Asset>` loader (`./svg` + `./svg/*` raw). Public-appropriate facts only. | public |
| per-client instances | Copy of the template, filled. | **NEVER public npm** — local package in the client's repo |

## Feeding it

- **Mechanical:** `kol-scrape <url>` → presence record → `draftFromScrape(record)` (`@kolkrabbi/kol-brand-template/adapter`) → partial manifest (meta hints + presence). Catalog mode (`kol-scrape catalog <url> --download dir`) pulls Squarespace product catalogs + assets.
- **Judgment:** the `kol-press-research` skill (dotfiles repo) — press/mention/timeline research, every hit fetch-verified, output already manifest-shaped.

## Rules

1. **One schema** — a tool growing its own shape reintroduces the conversion glue this tier exists to kill.
2. **Confidentiality** — client brand data never ships to public npm; PII (kennitala, birthdates, addresses) never enters any public package, including Kolkrabbi's own.
3. **Tools are not contents** — scrapers and generators are producers/consumers of the manifest, never inside a data package; one tool package per tool (no grab-bags).
