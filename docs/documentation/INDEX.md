---
title: KOL documentation
type: index
status: active
updated: 2026-07-03
description: The design system, documented — numbered sections for overview, foundations, components, compositions, brand kit, operations, research, and the generated usage references.
aliases:
  - documentation
tags:
  - domain/design-system
related:
  - "[[../INDEX|docs home]]"
---

# KOL documentation

The written mirror of the KOL design system — the same material the showcase renders live, in readable/portable markdown. When a doc and the code/showcase disagree, **the code wins** (these docs mirror, they don't define).

| Section | Docs | Live counterpart |
|---|---|---|
| [[00-overview/INDEX\|00 — Overview]] | What KOL is — tiers, the 8 packages, install, the consumer contract | `/` |
| **01 — Foundations** | [[01-foundations/01-tokens\|tokens]] · [[01-foundations/02-color\|color]] · [[01-foundations/03-typography\|typography]] | `/foundations`, `/foundations/color`, `/foundations/typography` |
| **02 — Components** | [[02-components/01-inventory\|inventory]] · [[02-components/02-placement\|placement rules]] · [[02-components/03-icons\|icons]] | `/components`, `/icons` |
| **03 — Compositions** | [[03-compositions/01-blocks-and-sets\|blocks & sets]] · [[03-compositions/02-shells\|shells]] | `/blocks`, `/sets`, `/docs/shell-and-layout` |
| [[04-brand/INDEX\|04 — Brand kit]] | The manifest schema, kol-brand, template, scrape + adapter | — |
| **05 — Operations** | [[05-operations/01-release-pipeline\|release pipeline]] · [[05-operations/02-workbench\|workbench]] | GitHub Actions, `pnpm workbench` |
| **06 — Research** | [[06-research/benchmark/INDEX\|shadcn ⇄ KOL benchmark]] · [[06-research/workflows/INDEX\|how other teams work]] | — |
| **07 — Usage** | Generated per-component references — real call-sites mined from ~25 consumer apps (`node scripts/extract-usage.mjs` to refresh) | `/components/:slug` |
