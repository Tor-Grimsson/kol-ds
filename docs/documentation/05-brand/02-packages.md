---
title: Brand packages
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
description: kol-brand, the template slate, and their jobs
tags:
  - domain/brand
  - audience/consumer
  - brand/assets
related:
  - "[[INDEX|brand kit]]"
---

# Brand packages

The packages that carry the brand tier and what each one owns.

| Package | Role | Registry |
|---|---|---|
| `kol-brand-template` | Schema + baked **house defaults** (`withHouseDefaults`) + the **emit-css** generator (`emitBrandColorCss`) + placeholder "Norðurljós" **slate** (dev fixture for generic styleguide renderers). Also ships the scrape **adapter**. | public |
| `kol-brand` | Kolkrabbi's real manifest — identity, 4 anchors, 7 ramps, type; plus the brand SVG assets (logos, wordmark, favicons) in `src/svg/` with an `<Asset>` loader (`./svg` + `./svg/*` raw). Public-appropriate facts only. | public |
| per-client instances | Copy of the template, filled. | **NEVER public npm** — local package in the client's repo |
