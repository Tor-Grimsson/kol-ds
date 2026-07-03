---
title: One system, five parts — stage contract, content contract, flat taxonomy, Docs, Blocks
type: log
status: archived
updated: 2026-07-02
description: Rebuilt the showcase's presentation architecture after research into shadcn/Carbon/Material — demo stage contract, unified content contract, flat A→Z taxonomy with function tags, a Docs section for non-components, and a real Blocks section.
tags:
  - domain/design-system
  - pattern/component-docs
  - pattern/app-shell
repo: kol-design-system
related:
  - "[[session-log/2026-07-02-feedback-sweep-shell-unification|feedback sweep]]"
  - "[[shells/01-reference-shells|reference shells]]"
---

# Session: One system, five parts

**Date:** 2026-07-02
**Agent:** Grim (Fable 5)
**Summary:** Answered "no more shitmix" with research (shadcn IA, Carbon component index, Material functional categories) and one architecture, built in full: C→D→A→B→E.

## The five parts

**C — Demo stage contract** (`lib/DemoStage.jsx`). One presentation contract for every demo: file exports optional `stage = 'hug'|'sm'|'md'|'lg'|'full'`; the stage owns layout (centering, width, gap), the demo owns only component usage. Swept all ~50 demos (3 subagents): hand-rolled wrappers stripped, presets assigned. Same renderer on component pages, Home wall, index cards, blocks — that kills the "one super wide, one narrow" chaos.

**D — Content contract** (`lib/DocHeader.jsx` + `DocSection`, `lib/ApiTable.jsx`, `lib/PreviewCard.jsx`). One header (eyebrow → heading-03 → lede), one section shape (top rule + heading-04 + lede), one props table, one preview card. **PageSection retired from every showcase page** (it's brand-app chapter chrome — its 64px/own-width world was the cross-page misalignment). DocLayout `wide` is now the same centred column with a higher cap (5xl vs 3xl) — same padding, same header position on every page.

**A — Flat taxonomy** (registry). Components sidebar/index is **flat A→Z** (shadcn + Carbon model): a new component always has an exact location — its alphabetical slot; nothing ever reorders. Functional classification (`action/input/display/feedback/navigation/overlay/media/structure/utility` — closed set, Material-style) is **filter metadata**: chips on the index, badge on cards, eyebrow on pages. Never hierarchy.

**B — Docs section** (`/docs/shell-and-layout`). `Layout`, `AppShell`, `ScrollToTop` moved OUT of the components list (`DOCS_ONLY`) — they're wiring, not components (shadcn model: meta material lives in Docs). The page shows the real composition (Layout → AppShell → SideNav/Outlet diagram, honest labeled boxes), APIs, usage — and **SideNav renders live** (framed, `h-dvh` neutralised; also a full component page at /components/side-nav). The flag I'd skipped twice is closed.

**E — Blocks** (`/blocks`, `src/blocks/*`, `lib/blocks-registry.js`). Real section, 3 seeds: **Inspector panel** (the KOL moat composed), **Filter bar**, **Settings form**. Same one-file mechanics (live render + own `?raw` source). In TopBar + sidebar.

## Also
- TopBar: KOL `Input` (filled/sm) for search; GitHub link in a 32px box aligning with ThemeToggle; Blocks link.
- ThemeToggle icon change **reverted** per review (changeset deleted → 3 staged changesets remain: loader inventory, loader social icons, component defaultOpen).
- Workshop-shell import confirmed as the step AFTER this system (lands into these standards).

## Current state
- 11 routes green, 0 compile errors, 50 demos (SideNav new), 3 blocks, 50 listed components (53 − 3 docs-only).
- Research sources: shadcn docs IA + blocks, Carbon component index (flat/filtered), Material functional grouping, atomic-labels critique.

## Ideas / improvements (carried + new)
1. Command-palette search to make the TopBar search real.
2. Promote DocLayout/TopBar/DemoStage into `@kolkrabbi/kol-framework` after the workshop-shell comparison.
3. `react-docgen` for API tables (still the one hand-authored drift vector).
4. Menu-family refactor (unify MenuItem/MenuPopover triggers, ecosystem naming) — own project.
5. More blocks — mine the consumer apps' existing collections.
6. Function tags could drive an "All / by function" toggle on the sidebar if the flat list grows long (>80).

## Next steps
- User review of the whole system → then the queued sequence: shadcn other-aspects sweep → workshop shell + components import (aligns TopBar) → metrics + chess components from the monorepo.
