---
title: Brand kit
type: reference
status: active
created: 2026-07-10
updated: 2026-08-01
description: The manifest schema and its satellite packages
aliases:
  - brand-kit
sources:
  - packages/brand-template/src/schema.js
  - packages/brand-template/src/defaults.js
  - packages/brand-template/src/emit-css.js
  - packages/brand/src/index.js
  - packages/scrape/src/index.js
tags:
  - domain/brand
  - audience/consumer
  - brand/assets
related:
  - "[[../01-foundations/02-color|color]]"
  - "[[../00-overview/INDEX|overview]]"
  - "[kol-brand plan (executed)](../../../.kol/llm-context/backlog/2026-07-03-kol-brand.md)"
---

# Brand kit — the manifest schema and its satellites

> **The schema is the product. The template conforms to it, the scraper feeds it, the generator emits the CSS skeleton, stationery consumes it, the styleguide renders it.**

A **brand kit** is a data + assets package — no server (unlike the clients tier). It kills the copy-a-client-and-swap-fields workflow: brand facts live in one versioned package per brand, all conforming to one schema.

## The chapter

| Page | What it holds |
|---|---|
| [[01-manifest\|Brand manifest]] | The schema, the house defaults, the emit-css generator |
| [[02-packages\|Brand packages]] | kol-brand, the template slate, what each owns |
| [[03-feeding\|Feeding a brand]] | kol-scrape, the adapter, and the confidentiality rule |

**Three pages, not one** (2026-08-01) — a chapter earns its folder with three documents beside its index, and these were three subjects under three headings in a single file.
