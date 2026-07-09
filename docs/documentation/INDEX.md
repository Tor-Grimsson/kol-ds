---
title: KOL documentation
type: index
status: active
updated: 2026-07-04
description: The design system, documented — numbered sections for overview, foundations, components, compositions, brand kit, research, and the generated usage references.
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
| **01 — Foundations** | [[01-foundations/01-tokens\|tokens]] · [[01-foundations/02-color\|color]] · [[01-foundations/03-typography\|typography]] · [[01-foundations/04-layout-breakpoints\|layout & breakpoints]] | `/foundations`, `/foundations/color`, `/foundations/typography` |
| **02 — Icons** | [[02-icons/INDEX\|loader, set & BYO]] · [[02-icons/01-inventory\|names by category]] | `/icons`, `/icons/v1` |
| **03 — Components** | [[03-components/00-taxonomy\|taxonomy]] · [[03-components/01-inventory\|inventory]] · [[03-components/04-diamond-tier\|diamond tier]] · [[03-components/05-control-chrome\|control chrome]] · [[03-components/02-placement\|placement rules]] · [[03-components/03-taxonomy-audit-and-plan\|taxonomy audit & plan]] | `/components` |
| **04 — Compositions** | [[04-compositions/01-blocks-and-sets\|blocks & sets]] · [[04-compositions/02-shells\|shells]] · [[04-compositions/04-workshop-system\|workshop system]] | `/blocks`, `/sets`, `/docs/shell-and-layout` |
| [[05-brand/INDEX\|05 — Brand kit]] | The manifest schema, kol-brand, template, scrape + adapter | — |
| **06 — Research** | [[06-research/benchmark/INDEX\|shadcn ⇄ KOL benchmark]] · [[06-research/workflows/INDEX\|how other teams work]] | — |
| **07 — Usage** | Generated per-component references — real call-sites mined from ~25 consumer apps (`node scripts/extract-usage.mjs` to refresh) | `/components/:slug` |

> **Operations moved out.** Release pipeline and workbench are repo machinery, not design-system content — they now live at [[../operations/INDEX|docs/operations/]].
