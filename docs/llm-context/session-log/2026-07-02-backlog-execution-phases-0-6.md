---
title: Backlog execution — phases 0–6 in one run
type: log
status: active
updated: 2026-07-02
description: All six phases of the execution plan run end-to-end — showcase bugs, package ports + a11y, taxonomy sweep + validator, scanner-first docs meta + react-docgen tables, brand swatch port + extraction report, shell verdict. Publish and E3 ports remain user-gated.
repo: kol-design-system
tags:
  - domain/design-system
  - domain/workflow
related:
  - "[[../../plan|execution plan]]"
  - "[[../../backlog/2026-07-02-brand-extraction-scan|brand extraction scan]]"
  - "[[../../taxonomy/01-component-placement|component placement]]"
---

# Session: Backlog execution — phases 0–6

**Date:** 2026-07-02
**Agent:** Grim (Fable 5) + 3 recon agents
**Summary:** The whole execution plan ran in one autonomous pass. Every backlog item is closed or explicitly gated; `pnpm build` green; 8 changesets staged (4 held + 4 new). Publish and E3 tier-1 ports await the user.

## What changed

- **Phase 1 — showcase bugs:** theme boot versioned (`kol-theme-v=2` discards pre-cutover saved themes incl. the old workshop `theme` key); vendored workshop theme aligned to `kol-theme`/light/boot-truth; TopBar GitHub icon 18px; Foundations swatch metas got `kol-helper-10` (E1); Stepper demo passes the event through (A4 was a demo bug — Stepper's contract is event-shaped, QuantityStepper's is number-shaped, inconsistency flagged).
- **Phase 2 — packages:** Input controlled-only-when-`value` (+readOnly when no onChange) — the A2 root cause; Button icons render directly as flex items (kol-client fix ported); SegmentedToggle chrome moved to `.kol-seg*` in kol-theme (root cause: Tailwind never scans package sources) + radiogroup/radio a11y with roving tabindex + arrow keys; CopyButton atom extracted, CodeBlock nests it, framework's `.kol-codeblock-copy` slimmed to positioning.
- **Phase 3 — taxonomy:** `primitives` dissolved; ~20 files re-tiered (incl. rule-driven surprises: Slider + ColorSwatch → molecules); placement doc at `docs/taxonomy/01-component-placement.md`; `pnpm validate:taxonomy` enforces closed set / downward-only imports / molecule test — green. Loaders verdict: Docs page (`/docs/loaders`), Icon + Graphic now DOCS_ONLY.
- **Phase 4 — docs quality:** `pnpm extract:docs` mines type classes + composes per component (D1/D2 render from source via `MetaRows` on ComponentPage); react-docgen API tables merged with authored rows (43/44 components); Slider B1 verdict — inline `label` stays, boundary documented, demo shows bare-first + all 3 variants. Type-conformance sweep flags 7 components (report-only).
- **Phase 5 — brand extraction:** better Swatch ported (`showcase/src/lib/Swatch.jsx`, live on Foundations); full E3 report at `docs/backlog/2026-07-02-brand-extraction-scan.md` — tier-1 shortlist headed by TypeSpecCard→LabeledSection.
- **Phase 6:** shell verdict recorded in `docs/shells/01-reference-shells.md` (docs shell keeps the showcase; workshop shell promotes only on a second real consumer); 8 changesets staged as one batch.

## Next steps

- User: review round (visuals + flags in chat status), approve E3 tier-1 ports, unpark the publish.
- Fix the 7 freestyle-type components when touched next; consider promoting Swatch → kol-component as `TokenSwatch`.
