---
title: Review parse — 16-point walkthrough into the backlog
type: log
status: archived
updated: 2026-07-02
description: Parsed the user's full showcase review into docs/backlog/2026-07-02-review-backlog.md — 6 bugs, 2 component/API fixes, 4 taxonomy tasks, 2 docs-quality tasks, 3 Foundations/brand-extraction tasks. No code changed this pass.
tags:
  - domain/design-system
  - domain/workflow
repo: kol-design-system
related:
  - "[[../../backlog/2026-07-02-review-backlog|review backlog]]"
  - "[[2026-07-02-review-fixes-and-monorepo-ports|review fixes + ports log]]"
---

# Session: Review parse → backlog

**Date:** 2026-07-02
**Agent:** Grim (Fable 5)
**Summary:** End-of-day pass: took the user's 16-point review of the rebuilt showcase and parsed it into a structured task doc — **`docs/backlog/2026-07-02-review-backlog.md`** (new `backlog/` pillar, routed from docs/INDEX). No code changed; context being cleared.

## The backlog in one glance
- **A — Bugs:** TopBar icon size mismatch (16 vs 18px); "value without onChange" console error on Home; Button icon misalignment (**user has a fix in another repo — find + port, don't re-derive**); Stepper dead in preview; SegmentedToggle missing its container chrome (**port the monorepo's correct version**); dark default still leaking (stale localStorage + the vendored workshop `useTheme` defaults — 2nd flag on this).
- **B — Component/API:** Slider's `label` prop reads like a LabeledControl combo (clarify variants + boundary); **CopyButton should be logged as an atom** before CodeBlock nests it.
- **C — Taxonomy (gated by a new helper doc):** write the "where does a component go" convention doc; kill **primitives** as a category (not atomic); audit molecules that are really atoms (Badge/Pill/Tag…); decide how **loaders** are treated (functional infra, not visual UI — Loaders category vs Docs page).
- **D — Docs quality:** name the type styles each component uses under its preview (exposes freestyle Tailwind); link nested components ("Composes" row).
- **E — Foundations/brand:** Foundations type sizes way off (swatch meta inherits 16px body); port the **better brand swatch** from brand.kolkrabbi.io/styleguide; **scan apps/brand for extractable reusables** (e.g. the labeled-container: section label + divider + slot) → categorized report, port on approval.

## Standing state (unchanged this pass)
- 4 changesets staged, publishing parked. Package fixes from the backlog (A3 Button, A5 SegmentedToggle, B2 CopyButton) batch into that same held release.
- Both shells live side-by-side (docs shell vs `/workshop-preview`); shell-comparison decision still open.
- Port-don't-reinvent applies to A3/A5/E2/E3 — working implementations exist in kol-monorepo / kol-client / apps/brand.

## Next steps
- Work the backlog top-down: **A-block bugs first** (A6 dark-default has been flagged twice), then C1 helper doc (gates the taxonomy block), then E3 brand scan report.
