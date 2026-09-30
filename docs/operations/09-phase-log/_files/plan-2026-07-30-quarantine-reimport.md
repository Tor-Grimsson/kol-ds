---
title: Quarantine and readmit — the showcase sidebar execution plan
type: plan
status: draft
updated: 2026-07-30
description: The executable form of the 2026-07-30 recovery roadmap. Four rule documents first, then an admission gate on the derived roster, then seven readmissions each stopping for a user check. No surface is restyled before its rule exists.
tags:
  - domain/design-system
  - domain/workflow
related:
  - "[roadmap](../../docs/operations/03-showcase/01-recovery-roadmap.md)"
  - "[[playbook/2026-07-30-showcase-quarantine|arc playbook]]"
  - "[[plan|the 2026-07-02 execution plan (historical)]]"
---

# Quarantine and readmit — execution plan

The roadmap says *what* and *why*; this says *in what order, touching which file, and where it stops*. Findings and their evidence live in [the roadmap](../../docs/operations/03-showcase/01-recovery-roadmap.md) — not repeated here.

> **EXECUTED — 2026-08-09, all 11 categories admitted, quarantine holds zero.**
> The user's instruction (*"go do whats left, Im not gonna hold your hand through
> this"*) replaced the per-row stop protocol with recorded decisions. The R1
> membership pass ran over all 239 exports — ledger at
> `docs/documentation/03-components/02-placement.md` § The pass; 3 flagged
> (ExitPreview · TagModeGate · AlternativeControlsMock), each page says so via
> `MEMBERSHIP_FLAGS`. R4 verified on all 31 block/set modules. The three
> ruleless surfaces got their rule at
> `docs/operations/03-showcase/04-surface-rules.md`. The icon MODE toggle is
> ruled dead (v1 is single-voice by design). **The open question below was
> resolved by reading 1** — the results page already reads the palette's items.
> Section order re-ruled the same day: showcase sections above Documentation
> (`02-shells.md:138`, gate updated). Verified live at every step; all 18 gates
> clean; nothing published (showcase + scripts + docs only).

> **Status: two gates built, no styling touched.** Written 2026-07-30 after the review. `pnpm validate` now runs all seven gates and prints a scoreboard — **5 clean, width 14, rails 16, 30 total**. The previous plan at `plan.md` is historical (2026-07-02 backlog, executed); it is not superseded, it is unrelated.
>
> The gates came first on purpose: the user's standing instruction is that a report he has to read is worth nothing, and a command he runs himself is worth something. Progress on this plan is measured by that number falling, not by anything written here.

## The one non-negotiable

**No surface is restyled before its rule is written and approved.** Every defect in the review is a case of code written next to a rule without reading it. Fixing the symptoms in the same manner reproduces the disease with better-looking output. Phase 0 ships zero visual change on purpose.

## Phase 0 — the four rules

Each is a vault doc, each cites what already exists, each ends with the validator that will enforce it. **All four are approval gates.**

### R1 · Membership — what belongs in a published package

The gap: `docs/documentation/03-components/02-placement.md` decides *where* a component goes and never asks *whether* it should ship. ExitPreview passes the placement test cleanly and is still a Sanity draft-mode escape hatch in a design system.

Proposed test — a component ships only if it is **(a)** consumed by ≥2 repos or plausibly reusable outside the one that birthed it, **(b)** free of app-specific routing/CMS assumptions, and **(c)** renderable in isolation (a preview that shows nothing is the smell).

Lands as a new section in `02-placement.md`, plus a `taxonomy-ok:`-style exemption comment for deliberate keeps. Enforced by extending `scripts/validate-taxonomy.mjs`.

### R2 · Rail — one row idiom

Supersede the prose at `docs/documentation/04-compositions/02-shells.md:78` with named classes: one row class, one label class, one indent, applied to **both** rails and every section within them. Kills the `kol-mono-12` / `shell-nav-item` / `shell-sidebar-action` split, and the `kol-helper-14` vs `kol-mono-14` split on the left.

Also settles the affordance: a group header either navigates *and* toggles, or it is not a header. Childless routes stop rendering a chevron.

**BUILT** — `scripts/validate-rails.mjs` (`pnpm validate:rails`). Scopes by rail *component*, not by file: `DocumentationReader.jsx` holds both the rail and the article-body renderer, and file-scoping flagged an `<h3>` in the document itself. Currently **16 violations** — three `kol-helper-*` ramps in `ShellSidebar`, three in `WorkshopSidebar`, eight `shell-sidebar-action`/`-link` rows, and `DocsToc`'s `kol-mono-12`.

### R3 · Width — which cap for which content

The tokens exist (`kol-theme.css:75-88`) and a canonical container class exists (`.kol-page`, `kol-framework.css:140-144`, used by zero showcase pages); the *mapping* does not. Write it as a table of content kind → wrapper, and make the wrapper a component rather than a repeated utility string, so a call site cannot forget it.

**The frame comes first and is one line.** `packages/workshop/src/shell/ShellLayout.jsx:186` is `h-full w-full px-4 md:px-5 lg:px-6` — no `max-w`, no `mx-auto`, Tailwind padding steps instead of the ramp. Measured at 2200px viewport: grid 2152, main 1576, inset 24 where the token says 48. Every per-page violation is downstream of this; capping pages while the shell is uncapped just moves the ragged edge.

Two dead hardcodes get removed in the same pass: `DocumentationReader.jsx:379` `max-w-[1400px]` (tier killed at theme 0.11.22) and `TagModeOverlay.jsx:37` `max-w-[864px]`.

**BUILT** — `scripts/validate-width.mjs` (`pnpm validate:width`). Three checks: the shell frame carries a `--kol-content-*` cap · no hardcoded `max-w-[Npx]` · a page rendering a `Table`/`CodeBlock` references the panel token. Currently **14 violations**, including `PageSection.jsx:15` hardcoding `960px` — the panel token's own value, typed out by hand.

### R4 · Metadata — one dialect, or an honest three

The decision he has to make, because it is a real fork:

- **Converge** — MDX pages and set/block modules adopt the kol-docs contract (title/type/status/updated/tags/description). One panel, one parser, one truth. Costs a generator that must land in `scripts/` this time, and a pass over 96 files.
- **Declare** — accept three dialects, and make each surface render *its own* full schema instead of filtering for a foreign one. Cheaper, and permanently means "frontmatter" denotes three different things.

**Recommendation: converge.** The framework contract already exists and the vault already honours it; the MDX and JSX schemas are accidents of a codemod and a registry, not decisions.

Enforced by extending `scripts/validate-docs-meta.mjs` (new) over all three surfaces.

## Phase 1 — quarantine

The sidebar is derived, not hand-written (`showcase/src/lib/roster.js:34-58`), so quarantine is an admission gate on that derivation:

1. `showcase/src/lib/admitted.js` — a new hand-authored set, empty at first. Same seam and same spirit as `classification.js`.
2. `roster.js` marks each row `admitted: boolean`.
3. `shell-nav.js` builds `SHELL_ROUTES` from admitted rows only.
4. `showcase/src/pages/Quarantine.jsx` — one page listing everything held, with its reason and the rule it awaits. Route `/quarantine`.
5. Sidebar drops to: the four rule docs, and Quarantine.

Reversible at every step: readmitting a category is a line in `admitted.js`.

**Stops for a check.** He sees an empty shell and confirms the holding page reads correctly before anything comes back.

## Phase 2 — readmission

Foundations first, because everything downstream cites it. **Each row is a separate stop — he looks, he says yes or no, and only then does the next start.**

| # | Category | Work | Gate |
|---|---|---|---|
| 0 | **Shell frame** | `ShellLayout.jsx:186` gains cap + ramp; TOC column's `lg`/`xl` mismatch fixed (`:48` vs `:87`); `hasToc` (`:78`) stops treating an always-truthy element as content; two dead hardcodes deleted | at 1024–1279px the main column is full height, not half; at 2200px the frame stops at 1800 |
| 1 | Foundations | R3 wrappers on the swatch grid + both tables; page-local hexes removed | tokens/colour/type render at panel; no horizontal scroll |
| 2 | Icons | R2 header navigates; verify the ramp, keyline overlay and BG toggle live | the page opens from the sidebar; controls work. **Icon *mode* toggle is not restorable** — variant prop removed at kol-icons 0.8.0; needs its own decision if he wants it back |
| 3 | Documentation | R4 panel renders the real contract; tag colour by namespace not hash; graph gains a real entry point | frontmatter shows the framework fields; tags are stable across reloads |
| 4 | Atoms | R1 applied component by component; each rejection written down | he reviews the keep/reject list before it renders |
| 5 | Molecules + organisms | same | same |
| 6 | Framework, workshop, flat packages | same | same |
| 7 | Blocks + Sets | one preview card (fold `BlockViewer` into `PreviewCard` with its extras as props); R4 metadata | both surfaces render identical chrome at identical width |

A rejected category returns to quarantine **with its reason recorded** — it is not quietly patched and re-shown.

## Phase 3 — enforcement

Wire R1–R4's validators into the existing gate set (`validate-taxonomy` · `validate-roster` · `validate-groups` · `validate-foundations` · `validate-imports`) and into CI. A rule with no gate is folklore, and folklore is how a documented width law, a documented rail law and a documented tag taxonomy were all walked past in one arc.

## Sequencing notes

- **Nothing publishes until phase 3.** These are showcase-side edits plus package fixes; package edits each get a changeset and one batched publish at the end, per the standing trap (edit without bump = same version, different content).
- **`_tmp/` for any before/after staging**, gitignored, deleted after.
- **git stays his.** No branch, no stage, no commit appears in this plan, including as a future step.

## Open question — needs his answer before phase 2 row 4

The sidebar "paste the JSX name" ask has two readings and they lead to different builds:

1. **Search accepts a pasted JSX name** — ⌘K or a sidebar filter matches `LabeledControl` typed or pasted verbatim. Today `buildShellSearchItems` (`shell-nav.js:95-122`) feeds only the ⌘K palette; the tree itself has no filter input.
2. **The tree rows stop showing PascalCase** — `LabeledControl` renders as `Labeled Control`, i.e. spaced display labels over the raw export name.

Not guessing between them.
