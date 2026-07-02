---
title: Backlog execution plan — phases 0–6
type: plan
status: active
updated: 2026-07-02
description: The 2026-07-02 review backlog sequenced into six executable phases, batched by layer, plus seven system improvements (scanner-first docs data, react-docgen API tables, enforceable taxonomy, a11y ride-along, type-conformance sweep).
phases:
  - 0 — sync + recon
  - 1 — showcase bugs
  - 2 — package ports
  - 3 — taxonomy
  - 4 — docs quality
  - 5 — brand extraction
  - 6 — decide + release
tags:
  - domain/design-system
  - domain/workflow
related:
  - "[[backlog/2026-07-02-review-backlog|review backlog]]"
  - "[[backlog/2026-07-02-brand-extraction-scan|brand extraction scan]]"
  - "[[llm-context/session-log/2026-07-02-review-parse-backlog|review parse log]]"
---

# Backlog execution plan — phases 0–6

Sequences [[backlog/2026-07-02-review-backlog|the review backlog]] into executable phases and folds in seven system improvements the backlog implied but didn't name.

> **Executed 2026-07-02** in one autonomous run — see [[llm-context/session-log/2026-07-02-backlog-execution-phases-0-6|the session log]]. Still open: user review, E3 tier-1 port approvals, the batched publish.

## Why

The backlog is 16 items across 5 blocks with three different change layers (showcase app, published packages, docs/taxonomy) and internal gates (C1 gates C2–C4; the shell comparison gates A6's durable fix and the workshop-shell promotion). Worked top-down item-by-item it would thrash between layers and re-open the same files; sequenced by layer and gate, it's ~4 working sessions plus two approval points.

## Scoping rules

- **Batch by layer.** Showcase-only edits are free (HMR, no release). Package edits (`kol-component` / `kol-theme` / `kol-loader`) each get a changeset into the already-held release — one publish at the end, not five. Publishing stays parked until phase 6.
- **Port, don't reinvent** (A3, A5, E2, E3): the working implementations exist in kol-monorepo / kol-client / apps/brand. Locate first, adapt imports only.
- **Decisions are named as decisions:** B1 (Slider `label` vs LabeledControl boundary), C4 (loaders placement), shell comparison. Each gets a one-line verdict recorded in the relevant doc, then execution — no silent calls.

## Current state

Rebuilt shadcn-style showcase live; 4 changesets staged and held; both shells (docs shell, `/workshop-preview`) side-by-side pending comparison. Backlog parsed, nothing executed.

## Target state

Zero console errors; every backlog item closed or explicitly deferred with a verdict; taxonomy self-enforcing (validation script, not just a doc); component pages show type-usage + composition derived from source; one batched release shipped when publishing unparks.

## Phases

| Phase | What | Items | Layer | Exit criteria |
|---|---|---|---|---|
| **0 — Sync + recon** | Locate the A3 Button fix (kol-client / kol-monorepo) and A5 SegmentedToggle reference source | — | repo | Both port sources pinned to file paths |
| **1 — Showcase bugs** | Dark-leak durable fix: versioned theme storage key + align the vendored workshop `useTheme` (A6); TopBar icon sizes 18/18 (A1); Home controlled-input error, fixed at source (A2); Stepper demo contract (A4); Foundations swatch-meta type scale (E1) | A6, A1, A2, A4, E1 | showcase | Zero console errors; light boots clean over stale `localStorage` |
| **2 — Package ports** | Port Button icon-baseline fix (A3); port monorepo SegmentedToggle w/ container chrome (A5); extract CopyButton as a logged atom, CodeBlock nests it (B2); a11y basics ride the open files — Stepper `spinbutton` + arrow keys, SegmentedToggle `radiogroup`/`radio` + arrow keys, visible focus on both (improvement 6) | A3, A5, B2 | kol-component / kol-theme | 3 new changesets staged into the held release; both ported components operable by keyboard |
| **3 — Taxonomy** | Write the C1 placement doc (atom = no KOL component nested / molecule = nests atoms / organism = composed section; checklist + worked examples), then ONE sweep: kill `primitives` (C2), audit all ~50 placements (C3), loaders verdict (C4 — proposal: **Docs page**, loaders are infrastructure like Shell & Layout) | C1→C4 | docs + registry | Every component has exactly one defensible location; validation script green (improvement 3) |
| **4 — Docs quality** | B1 Slider boundary verdict + demo fix; type-styles row (D1) and Composes row (D2) — **scanner-first** (improvement 1); react-docgen API tables (improvement 2); the D1 scanner doubles as a **freestyle-Tailwind offender report** (improvement 7) | B1, D1, D2 | showcase | Component pages render type classes + composition from source, not hand-authored data; offender report delivered |
| **5 — Brand extraction** | Scan `apps/brand` → categorized report with promotion proposals (E3, feeds C1's examples — improvement 4); port the better swatch onto Foundations + Color (E2) | E2, E3 | showcase → report | Report delivered; ports land only on approval |
| **6 — Decide + release** | Shell comparison verdict (closes A6b properly, gates workshop-shell → kol-framework); type-conformance sweep — fix the phase-4 offender report's freestyle text styles to kol classes, approval-gated (improvement 7); unpark the release: 4 held + phase-2 + sweep changesets as one batch | — | packages | One publish; changeset queue empty; D1 rows show kol classes, not freestyle utilities |

## Improvements folded in (beyond the literal backlog)

1. **D1/D2 scanner-first, not hand-authored.** The backlog says "author in DOC_DATA, auto-scan later" — that authors ~50 entries twice. `scripts/extract-usage.mjs` already proves the mining pattern; a sibling script scanning component source for `kol-sans-*`/`kol-mono-*`/`kol-helper-*` classes and `@kolkrabbi` imports is less work than hand-authoring and can't drift.
2. **react-docgen API tables.** `component-docs.js` is the last hand-authored drift surface (flagged in AGENT-CONTEXT). Phase 4 kills it while already in those files.
3. **C1 enforceable, not advisory.** A registry-validation script: every component has a category from the closed set and a location matching the C1 rules; fails loud on violations. Without it the taxonomy re-rots on the next added component.
4. **E3 feeds C1.** The brand-scan's categorized report doubles as the placement doc's worked-examples section — run the scan while writing the doc, not after.
5. **A6 durable, not patched.** Versioned theme key + one theme source of truth; the vendored `useTheme` is aligned in phase 1 and then either promoted or deleted by the phase-6 shell verdict.
6. **A11y rides the ports.** Stepper and SegmentedToggle are exactly the components the benchmark flags under gap #1 (no behavior/a11y layer). While phase 2 has their files open: arrow-key operation + ARIA roles + visible focus, bounded to these two, basics only — the cheapest first bite of that gap, no separate session.
7. **Type-conformance sweep, report-then-fix.** D1's scanner makes freestyle Tailwind text styling visible; without a fix pass it ends at "we can see the problem." Offender report falls out of phase 4 for free; the conforming sweep of package source lands in phase 6, approval-gated, batching into the same held release.

## Acceptance criteria

- [x] Phase 1: fixes landed, build green; live console/visual pass = the user review
- [x] Phase 2: A3/A5/B2 changesets staged (+ taxonomy-restructure); release still parked; SegmentedToggle radiogroup/arrows/focus-visible shipped, Stepper spinbutton + arrows are native (`input type=number`, no code needed)
- [x] Phase 3: C1 doc exists; zero `primitives`; `pnpm validate:taxonomy` green
- [x] Phase 4: D1/D2 rows render from scanner output; API tables generated (43/44, ScrollToTop renders null); offender report delivered — 7 components (AssetPlaceholder, Avatar, ToggleCheckbox, ToggleSwitch, Accordion/Panel, SideNav)
- [x] Phase 5: E3 report delivered (**tier-1 approvals pending**); E2 swatch live on Foundations
- [ ] Phase 6: shell verdict recorded ✓; **pending user:** type-conformance fix approval, publish (8 changesets, one batch)

When executed, mark `status: superseded` and point at the closing session log.
