---
title: KOL documentation
type: index
status: active
updated: 2026-08-01
description: The design system, documented — numbered sections for overview, foundations, components, compositions, brand kit, research, and the generated usage references.
aliases:
  - documentation
tags:
  - domain/design-system
related:
  - "[[../INDEX|docs home]]"
---

# KOL documentation

The written record of the KOL design system — the same material the showcase renders live, in readable/portable markdown.

## Read first

`.kol/` is history. **This vault is the law.** If a rule exists here it is not
open — do not re-derive it from source. Three sessions running, every wrong
proposal came from grepping code for something already written down.

| If you are about to touch… | The law is at | It already says |
|---|---|---|
| a width, a `max-w`, a container | [[01-foundations/05-layout-systems\|layout systems registry]] | one frame, content **LEFT-ANCHORED**; the 1400 tier was deliberately killed; only the frame centres |
| a breakpoint or a rail width | [[08-breakpoints/04-kol-ds-rules\|KOL-DS rules]] | the values, and which of them are closed |
| a sidebar, a TOC rail, the shell | [[04-compositions/02-shells\|reference shells]] | one rail system · the three-rung ladder · the eyebrow box · section order |
| type, a font, a text class | [[01-foundations/03-typography\|type classes]] | the roles, and no `text-transform` — ever |
| where a component belongs | [[03-components/02-placement\|placement rules]] | the placement **and** membership tests |

**Precedence.** These docs **define**. Code is the current *state*, and current
state can be wrong — that is what the gates exist for. `pnpm validate` runs 12
of them: a green gate is proof, a doc is the rule, unexamined source is neither.
(This reverses the old "the code wins" line, which was written before the vault
carried laws the code had never been held to.)

**Improvising is a defect.** No new token, width, class or geometry without
first citing the file above that fails to cover it. If none does, say so out
loud — that is a claim, and it belongs in the doc before it reaches the code.

| Section | Docs | Live counterpart |
|---|---|---|
| [[00-overview/INDEX\|00 — Overview]] | What KOL is — tiers, the 15 packages ([[../operations/SHIPPED-PACKAGES\|full list + versions]]), install, the consumer contract | `/` |
| **01 — Foundations** | [[01-foundations/01-tokens\|tokens]] · [[01-foundations/02-color\|color]] · [[01-foundations/03-typography\|typography]] · [[01-foundations/04-layout-breakpoints\|layout & breakpoints]] · [[01-foundations/05-layout-systems\|layout systems registry]] | `/foundations`, `/foundations/color`, `/foundations/typography` |
| **02 — Icons** | [[02-icons/INDEX\|loader, set & BYO]] · [[02-icons/01-inventory\|names by category]] | `/icons`, `/icons/v1` |
| **03 — Components** | [[03-components/00-taxonomy\|taxonomy]] · [[03-components/01-inventory\|inventory]] · [[03-components/04-diamond-tier\|diamond tier]] · [[03-components/05-control-chrome\|control chrome]] · [[03-components/02-placement\|placement rules]] · [[03-components/03-taxonomy-audit-and-plan\|taxonomy audit & plan]] | `/components` |
| **04 — Compositions** | [[04-compositions/01-blocks-and-sets\|blocks & sets]] · [[04-compositions/02-shells\|shells]] · [[04-compositions/03-slug-composition-gallery\|composition gallery]] · [[04-compositions/04-workshop-system\|workshop system]] · [[04-compositions/05-foundry-system\|foundry system]] · [[04-compositions/06-store-system\|store system]] · [[04-compositions/07-content-system\|content system]] · [[04-compositions/08-chess-system\|chess system]] · [[04-compositions/09-dashboards-system\|dashboards system]] · [[04-compositions/10-styleguide-system\|styleguide system]] | `/blocks`, `/sets`, `/docs/shell-and-layout` |
| [[05-brand/INDEX\|05 — Brand kit]] | The manifest schema, kol-brand, template, scrape + adapter | — |
| **06 — Research** | [[06-research/benchmark/INDEX\|shadcn ⇄ KOL benchmark]] · [[06-research/workflows/INDEX\|how other teams work]] | — |
| *07 — Usage* | **Moved out 2026-07-31.** The mined per-component references are app content, not a chapter — they live at `showcase/src/usage/components/`, and the app renders them from `usage-index.json`. See [[../operations/04-content-pipeline/01-sources\|content pipeline → sources]]. | `/components/:slug` |
| [[08-breakpoints/INDEX\|08 — Breakpoints]] | [[08-breakpoints/01-breakpoints\|values]] · [[08-breakpoints/02-best-practices\|best practices]] · [[08-breakpoints/03-methods\|testing methods]] · [[08-breakpoints/04-kol-ds-rules\|KOL-DS rules]] | — |

> **Operations moved out.** Release pipeline and workbench are repo machinery, not design-system content — they now live at [[../operations/INDEX|docs/operations/]].
