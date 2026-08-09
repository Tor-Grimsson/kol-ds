---
title: Feeding a brand
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
description: Scrape, adapt, and the confidentiality rule
tags:
  - domain/brand
  - audience/consumer
  - brand/assets
related:
  - "[[INDEX|brand kit]]"
---

# Feeding a brand

How a client instance gets its data, and the rule that governs it.

- **Mechanical:** `kol-scrape <url>` → presence record → `draftFromScrape(record)` (`@kolkrabbi/kol-brand-template/adapter`) → partial manifest (meta hints + presence). Catalog mode (`kol-scrape catalog <url> --download dir`) pulls Squarespace product catalogs + assets.
- **Judgment:** the `kol-press-research` skill (dotfiles repo) — press/mention/timeline research, every hit fetch-verified, output already manifest-shaped.

## Rules

1. **One schema** — a tool growing its own shape reintroduces the conversion glue this tier exists to kill.
2. **Confidentiality** — client brand data never ships to public npm; PII (kennitala, birthdates, addresses) never enters any public package, including Kolkrabbi's own.
3. **Tools are not contents** — scrapers and generators are producers/consumers of the manifest, never inside a data package; one tool package per tool (no grab-bags).
