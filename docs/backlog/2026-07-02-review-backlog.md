---
title: Review backlog — 2026-07-02 walkthrough
type: plan
status: active
updated: 2026-07-02
description: The user's full review of the rebuilt showcase parsed into actionable tasks — bugs, component fixes, taxonomy decisions, docs-page quality, and brand-app extraction.
tags:
  - domain/design-system
  - domain/workflow
related:
  - "[[../plan|execution plan]]"
  - "[[2026-07-02-brand-extraction-scan|brand extraction scan]]"
  - "[[llm-context/session-log/2026-07-02-review-fixes-and-monorepo-ports|review fixes + ports log]]"
  - "[[shells/01-reference-shells|reference shells]]"
---

# Review backlog — 2026-07-02 walkthrough

User review of the rebuilt showcase, parsed into tasks. Sizes: S (< 30 min), M (session-chunk), L (own session+). Layer says where the change lives.

## A — Bugs (fix first)

- [ ] **A1 · TopBar icon sizes** — GitHub icon is 16px, ThemeToggle's is 18px; they don't read as siblings. Set GitHub to 18. (S, showcase)
- [ ] **A2 · Home console error** — "value prop without onChange" on an input. Candidates: TopBar search `Input` (needs `readOnly` or `defaultValue` until search is real) or `Input`'s internal value handling. Locate via the component stack, fix at the source. (S, showcase or kol-component)
- [ ] **A3 · Button icon misalignment** — `iconRight`/`iconLeft` glyphs sit off the text baseline (see hero "Browse components →"). **User already fixed this in another repo — find that fix first** (check kol-client + kol-monorepo Button) and port it; don't re-derive. (M, kol-component)
- [ ] **A4 · Stepper dead in preview** — typing in the field does nothing and +/− doesn't step on the component page. Check the demo's onChange contract vs Stepper's actual callback signature (event vs number), and that the index-card `pointer-events-none` isn't leaking into the page preview. (S–M, showcase demo or kol-component)
- [ ] **A5 · SegmentedToggle renders wrong** — current render jams the labels with no container chrome; correct reference (monorepo screenshot) is a bordered pill container, padded segments, filled active segment. Port the working version/CSS from the monorepo rather than patching. (M, kol-component + kol-theme CSS)
- [ ] **A6 · Dark default STILL appearing (2nd flag)** — light-default boot script exists in `index.html`, but two leaks remain: (a) stale `localStorage.kol-theme = 'dark'` from earlier sessions wins over the new default — consider versioning the key; (b) the **vendored workshop `useTheme`/`theme.js`** carries the monorepo's own storage key/default and may flip the document to dark when `/workshop-preview` mounts. Align both to the light default. (S, showcase)

## B — Component fixes & API questions

- [ ] **B1 · Slider demo/API confusion** — the demo's `label` prop render reads like a `LabeledControl` combo. Clarify: show the bare slider, then variants (`default`, `minimal` — confirm the real variant set from source), and decide whether Slider's built-in `label` duplicates LabeledControl's job (document the boundary, or deprecate one path). (S–M)
- [ ] **B2 · CopyButton is an unlogged atom** — CodeBlock (and the showcase's own copy affordances) embed an inline copy button. Extract/log **CopyButton as an atom** in kol-component, then CodeBlock nests it. Atoms get logged before they're lifted into composites. (M, kol-component)

## C — Taxonomy & conventions (needs the helper doc first)

- [ ] **C1 · Write the placement helper doc** — `docs/` convention doc answering "where does a new component go": atom = base element (no KOL component nested), molecule = nests atoms, organism = composed sections; decision checklist + examples. **The system must give every component a location without reordering.** (S–M, docs — gates C2–C4)
- [ ] **C2 · Kill "primitives" as a category** — not part of the atomic system. Reclassify the 8 (Accordion, AccordionPanel, AssetPlaceholder, Carousel, CodeBlock, ExitPreview, FullscreenOverlay, Image) into atoms/molecules/organisms per C1. (M)
- [ ] **C3 · Audit molecule/atom placements** — Badge, Pill, Tag et al. sit in molecules but nest no KOL components → likely atoms. Audit all ~50 against C1, move misfiled, note each call in the doc. (M)
- [ ] **C4 · Loaders aren't visual UI** — Icon/Graphic loaders are functional infrastructure, not components; "graphics" as a category is odd. Proposal to settle in C1: a **Loaders** category (or Docs page) covering all loaders (icon, graphic, future), with the visual galleries staying on the Icons/Graphics pages. Decide: components-list entry vs Docs treatment. (decision + S)

## D — Component-page quality (system transparency)

- [ ] **D1 · Name the type styles a component uses** — under each preview, list the kol type classes the component renders text with (e.g. `.kol-mono-12`) so system-conformance vs freestyle-Tailwind is visible at a glance. Start authored in DOC_DATA; later auto-scan component source for `kol-sans-*/kol-mono-*/kol-helper-*`. (M, showcase)
- [ ] **D2 · Link nested components** — when a component composes others (ContentFilters → Tag/ViewToggle/Divider; CodeBlock → CopyButton), render a "Composes" row linking to their pages (shadcn's Composition section). Authored `composes: []` in DOC_DATA first; later derive from imports. (M, showcase)

## E — Foundations & brand extraction

- [ ] **E1 · Foundations type sizes off** — swatch labels/values render much larger than sibling pages (`.kol-swatch-meta` sets family, not size → inherits 16px body). Fix to helper-10/12 scale to match the rest. (S, showcase)
- [ ] **E2 · Port the better brand swatch** — brand.kolkrabbi.io/styleguide swatch (chip + tiny `token` bottom-left / `hex` bottom-right) beats the current one. Port it (verbatim, brand app source) and use it on Foundations + Color pages; candidate for promotion. (M)
- [ ] **E3 · Scan the brand app for extractable reusables** — user example: the "labeled container" (section label + divider + arbitrary slot). Sweep `apps/brand` (styleguide pieces: LabeledDivider/section headers, Swatch, TypeSample, LogoCard, AssetTable, …), report findings **with categories** and promotion proposals. Report first, port on approval. (M scan → report)

## Standing context for these tasks

- Publishing stays parked; 4 changesets staged. Package fixes from this list (A3, A5, B2) batch into the same held release.
- Port-don't-reinvent rule applies to A3, A5, E2, E3 — the working implementations exist in kol-monorepo / kol-client / apps/brand.
- C1's doc gates the C-block; write it first, then reclassify once.
