---
title: Brand tier, media lobby, icons fixes, entry-chunk perf
type: log
status: archived
updated: 2026-07-03
description: Four new packages (media-client, brand-template, brand, scrape) + two molecules from the lobby, the icons keyline/variants fixes against the reference apps, and the entry-chunk fix ported from kol-labs-single (3.5 MB → 254 kB gzip).
tags:
  - domain/design-system
  - domain/workflow
repo: kol-design-system
related:
  - "[[../../backlog/2026-07-03-kol-brand|kol-brand plan]]"
  - "[[../../backlog/2026-07-03-kol-scrape|kol-scrape plan]]"
  - "[[2026-07-03-blocks-sets-split-e3-close|earlier same-day log]]"
---

# Session: Brand tier, media lobby, icons fixes, entry-chunk perf

**Date:** 2026-07-03 (continuation of the blocks/sets session)
**Summary:** Four new packages stood up (clients + brand-kit tiers), two lobby molecules recreated, the icons pages fixed against the reference apps, and the showcase entry chunk cut 93%. All package changes ride the held release as changesets — publish still parked.

## New packages

- **`@kolkrabbi/kol-media-client`** (`packages/media-client/`) — read-only kol-media CDN client consolidating the byte-identical copies in kol-labs-single + kol-design-editor. Factory + default prod instance; core + `proxied` + `formatSize` + optional `uploadToLibrary`. First of the **clients tier** (ARCHITECTURE §3 amended: one package per service contract, never a grab-bag).
- **`@kolkrabbi/kol-brand-template`** (`packages/brand-template/`) — the **brand manifest schema** (JSDoc-typed, every field optional, `defineBrand`/`validateBrand`) + placeholder "Norðurljós" fixture. The slate for new clients + dev fixture. Keystone: *the schema is the product — template conforms, scraper feeds, stationery consumes, styleguide renders.*
- **`@kolkrabbi/kol-brand`** (`packages/brand/`) — Kolkrabbi's real manifest: identity meta, 4 color anchors, 7 ramps (40 stops, hex verbatim from kol-brand-color.css), type families/scale, the 4 logo SVGs (shipped in-package, `./logos/*` export). **Public-safe only** — kennitala/birthdate/street/phone and the person-scoped internal press archive deliberately excluded. Both manifests `validateBrand` green.
- **`@kolkrabbi/kol-scrape`** (`packages/scrape/`) — all-purpose presence scraper CLI, zero deps (`kol-scrape <url>`; pure `extract()`). Record v1 frozen. Verified live: kolkrabbi.io (+ side-catch: **kolkrabbi.io ships unfilled `__TITLE__`/`__DESCRIPTION__` meta placeholders**) and grapevine.is (profiles ×3, 2 feeds). Brand adapter + curation skill = future work.

## Lobby processed (MediaCard · MediaRow · media-client)

All three specs recreated → `lobby/done/`, INDEX.md now carries a processed-jobs table. `MediaCard`/`MediaRow` molecules in kol-component (slot contract, select mode; **deviation flagged:** passive `SelectIndicator` instead of ToggleCheckbox — the card is the click target, a nested real input double-fires). Demos, workbench stories, registry entries, usage re-mined, API tables regenerated, taxonomy green. Verified live (select toggle measured). Lobby rule recorded: **inbound pipe only — read from it, never author into it.**

## Icons pages vs the reference apps

- `icon-controls.jsx` claimed "ported verbatim" but **KeylineBg had been reinvented** as a generic 8px grid — replaced with the real keyline guide (dashed diagonals + keyline rects + circle, yellow/magenta). Fixes Icons + IconsVariants both.
- Variants page: square cells (`aspectRatio: 1`), truthful mirror gaps (new keys-only `SOLID_ICON_ENTRIES` loader export → 892 icons, 845 mirrored, 47 "—" cells), ContentFilters + Mirror filter ported, reference defaults.

## Entry-chunk perf (port of kol-labs-single's 2026-06-19 fix)

- **Entry: 3,502 kB → 254 kB gzip (−93%).** Icon SVG maps → dynamic-import `iconData.js` chunk (1.3 MB); kol-component's `Graphic` was the bigger offender — 4.8 MB of illustration SVGs (base64-JPEG-bearing) eager-inlined → `graphicData.js` chunk. Dead exports `SVG_ENTRIES`/`GRAPHIC_RAW` deleted (zero consumers).
- BlockViewer: one persistent iframe (device switches/tab flips no longer reboot the app inside — proven with a JS-realm marker) + `loading="lazy"`.

## Also

- Blocks landing polish per review: primary buttons, sidenav naming unification (3 sidenav block variants), shadcn dot-grid mechanics (desktop flush, left-anchor + drag handle), block slug pages, device icons authored into the loader (`tablet`, `smartphone`, `refresh-cw`).
- New memories: kol-ui-defaults (primary buttons, ask stroke-vs-solid, sidenav naming), visual-verification-protocol (screenshot own render vs reference before reporting).

## Arc closed: catalog mode, adapter, curation skill

- **kol-scrape catalog mode** — the real copied scraper surfaced (`_tmp/another_creation_scraper/`, Python): the Squarespace `?format=json` trick. Ported as `kol-scrape catalog <url> [--download dir]` (record `catalog-v1`: title/price/currency/image/url per item; price path `variants[0].priceMoney`, high-res `assetUrl`, sanitized filenames). Verified live: another-creation.com/shop-now → 24 items matching the original's output. `_tmp/` folder now redundant (user keeps/deletes).
- **Scrape adapter** — `draftFromScrape` in `@kolkrabbi/kol-brand-template/adapter` (with the schema, NOT in kol-scrape, per plan): kol-scrape v1 record → partial manifest (meta name/url/social-handles + presence site/profiles/feeds). Verified end-to-end: live scrape → draft → `validateBrand` green.
- **Curation skill** — `kol-press-research` authored in the **dotfiles repo** (`claude/skills/`, local-authored, documented per that repo's rules: `02-skills.md` 22→23 + its own session log + AGENT-CONTEXT entry). The judgment half: alias×angle×native-language search fan-out, every hit fetch-verified via the kol-scrape CLI, curation rules (subject-vs-author, TBD-not-guessed, PII stays out of public packages), output = manifest-shaped `press[]`/`timeline[]`. Both backlog plans now fully closed.

## Changesets held (now 12)

Original 4 + backlog-execution 4 + device-icons, view-toggle-icon-variant, icon-entry-chunk-fix, solid-inventory, graphic-entry-chunk-fix, media-client, media-components, brand-template, brand, scrape (loader/component ones consolidate per package at version time). One batched publish when unparked.

## Next steps

1. User review of the brand/scrape/media work.
2. Generic styleguide renderers consuming manifests; stationery generator plan when needed.
3. kolkrabbi.io meta bug (apps/web ships literal `__TITLE__`/`__DESCRIPTION__`) — user's court, monorepo side.
4. Pre-existing bug parked: `/components` index nests `<a>` in `<a>` (PortalFooter demo card).
5. Unpark the batched publish (12 changesets) when wanted.
