---
title: Component taxonomy — audit & consolidation plan
type: plan
status: superseded
superseded_by:
  - "[[00-taxonomy|component taxonomy]]"
updated: 2026-07-04
description: Audit of how KOL categorizes and lists components (two axes, the atomic definitions, doc↔sidebar drift, over-fragmented families) and a phased plan to lock the convention, de-fragment the presentation, and collapse true variant families.
aliases:
  - taxonomy-audit
  - taxonomy-plan
sources:
  - packages/component/src/index.js
  - showcase/src/lib/registry.js
  - showcase/src/usage/usage-index.json
  - scripts/validate-taxonomy.mjs
  - docs/documentation/02-components/02-placement.md
tags:
  - domain/design-system
  - domain/conventions
related:
  - "[[00-taxonomy|component taxonomy]]"
  - "[[02-placement|component placement]]"
  - "[[01-inventory|component inventory]]"
---

# Component taxonomy — audit & consolidation plan

**For review.** This is a proposal, not executed work. It answers two questions the user raised: (1) what categorization convention do we actually use and where is it written, and (2) the roster is over-fragmented — near-identical components (dropdown menu parts especially) are listed as separate components and should be unified.

> Scope note: this is a **draft plan**. Phases 2–4 touch published package APIs and the showcase; each is gated on sign-off. When executed, this doc gets `status: superseded` and its locked definitions move into the `reference` docs it names.

## Execution status (2026-07-04)

**All five phases executed** (awaiting your review; changesets held, unpublished).

- **Phase 1 ✅** — `[[00-taxonomy|00-taxonomy.md]]` created (owns the two axes + the Brad-Frost divergence); `[[02-placement]]` shrunk to the runbook; F2 drift reconciled.
- **Phase 2 ✅** — `component-groups.js` overlay + `componentsByFunction` + `groupComponents` in the registry; persisted `Atomic ⇄ Function` toggle (SegmentedToggle) in the sidebar; Menu/Accordion members render on the parent page. `usage-index.json` untouched. Build + Playwright green (0 console errors). *Only Menu (3) + Accordion (1) had real extra rows — Popover/Modal/Spectrum/Swatch were already single entries.*
- **Phase 3 ✅** — deleted the dead shadow `MenuItem`/`MenuDivider` in `MenuPopover.jsx`; `MenuPopover` off the roster (alias still exported). Changeset `menu-popover-dead-code` (patch).
- **Phase 4 ✅ (evaluated all four families; one merge, three reasoned keeps)** —
  - **MERGED: QuantityStepper → QuantityInput `controls="split"`.** Near-identical, and QuantityStepper had zero non-demo consumers. Export deleted, call-sites migrated. Changeset `quantity-merge` (minor, breaking-in-0.x).
  - **KEPT: SegmentedToggle / ViewToggle / WorkViewToggle** — different shells (`.kol-seg` vs `.kol-control` vs animated pill), a11y (radiogroup vs aria-pressed), and APIs; `WorkViewToggle`'s own source argues it's deliberately not a variant.
  - **KEPT: SearchInput vs Input** — distinct affordances (clear ×, kbd chip, `bare` overlay mode) that would bloat the base `Input`; overlap is only shell chrome.
  - **KEPT: Card/Row twins (WorkCard/WorkListItem, MediaCard/MediaRow)** — card is an organism, row a molecule; merging across tiers violates KOL's own taxonomy.
  - This resolves **D2**: propose-per-family, collapse only the true variant.
- **Phase 5 ✅** — `01-inventory.md` regenerated to real counts (42/29/28/10, was 29/17/3/9); `scripts/validate-groups.mjs` added (`pnpm validate:groups` — overlay-integrity check) + wired; composition manifests regenerated (`usage-index.json` checksum verified unchanged). `validate:taxonomy` + `validate:groups` clean.

- **Follow-on ✅** — index toggle perf: the `/components` grid re-inited all 113 live demos on every regroup (150ms block). Lazy-mounted them behind an IntersectionObserver (`showcase/src/pages/Components.jsx`) → **150ms → 0ms**; also trims initial load. Showcase-only, no changeset.

**Net roster: 119 → 113 browsable components** (−4 sub-part members folded in, −2 deprecated/merged).

**Status:** superseded — the living convention is [[00-taxonomy|component taxonomy]] (canonical) + [[01-inventory|inventory]]; this doc is kept as the audit + execution record.

---

## Why — the confusion is real, but a convention does exist

The premise "I don't see a conventions markdown in docs" is *almost* right. A convention doc exists — `[[02-placement|02-placement.md]]` — but it's **misnamed and buried**: it's framed as "where a **new** component goes" (a routing job for the author of a new file), not "what our **categories mean**" (a definition a browser looks up). Same content, wrong front door. So the definitions are there; nobody finds them.

Two things then compound it: the doc has **drifted** from what the sidebar actually renders, and the roster has **over-fragmented** as ~78 components landed in the monorepo batch. Both are fixable.

---

## Current state — how classification actually works today

There are **two orthogonal axes** in the code. Naming them is half the fix; today they're tangled in the reader's head.

### Axis 1 — Tier (structural). The code-organization axis.

Which `packages/component/src/<folder>/` a file lives in, enforced by `scripts/validate-taxonomy.mjs`. Defined in `02-placement.md` by a **mechanical nesting test**, not by complexity:

| Tier | Test (verbatim from placement doc) | Folder |
|---|---|---|
| **Atom** | Nests **no** KOL component. Hand-rolled internals don't disqualify. | `atoms/` |
| **Molecule** | Nests **≥1** KOL component-tier component. | `molecules/` |
| **Organism** | A self-contained composed UI **region** (bar, table, gallery), regardless of nesting. | `organisms/` |
| **Framework** | App chrome / page structure. | `packages/framework/src/` |
| **Loaders** | Name→asset resolvers (Icon, Graphic). Not visual UI. | `kol-loader`, `graphics/` |

Key point the user already intuited: **this is *not* Brad Frost atomic.** Classic atomic is a complexity/composition ladder. KOL's is "does this file import another KOL component file." That's a deliberate divergence — it's mechanical and lint-enforceable — but the doc never *says* "we diverge on purpose, here's why," so it reads like a mislabeled atomic system instead of an owned one.

### Axis 2 — Function (Material-style). The browsing/filter axis.

`registry.js → FUNCTIONS`: a closed set `action · input · display · feedback · navigation · overlay · media · structure · utility`. Every component maps to exactly one. Today it's **filter-chip metadata only** — it never groups or orders the sidebar.

### What the sidebar actually renders

`registry.js → CATEGORY_ORDER` groups the sidebar by **Tier**, not Function:
`atoms · molecules · organisms · fw-chrome · fw-structure · fw-behavior · hooks · misc`
— with the flat `framework` tier split three ways and A→Z within each group. One doc page per `usage-index.json` entry (125 entries).

---

## Findings

### F1 — The convention doc is misnamed and buried
`02-placement.md` owns the definitions but presents them as a filing rule. A browser looking for "what's an atom here / what are the categories" won't open a doc titled *"where a new component goes."* **Fix: a definitions-first doc that owns the taxonomy; placement.md shrinks to the mechanical checklist that points at it.**

### F2 — Doc ↔ sidebar drift
The placement doc's tier table and the rendered sidebar disagree:

| Placement doc says | Sidebar renders | Gap |
|---|---|---|
| one `framework` tier | `fw-chrome` / `fw-structure` / `fw-behavior` | 3-way split undocumented (registry itself flags it "open question") |
| `loaders` is a tier | *no* loaders group (Icon/Graphic are `DOCS_ONLY`) | doc lists loaders in the tier table as if browsable |
| — | `hooks`, `misc` groups | present in sidebar, absent from the doc |

### F3 — The atom/molecule line is low-signal for browsing
The pure nesting test produces siblings that split across tiers for a reason a *browser* doesn't care about:
- `Slider` is a **molecule** (nests `Input`); `RotaryDial`, `Stepper`, `QuantityInput` are **atoms** — all four are "drag/step to set a number."
- `ColorSwatch` is a **molecule** (nests `TransparentX`) but is conceptually a leaf chip.

The nesting test is *correct* for its real job — **import discipline + file placement** — and should stay. It's just the wrong thing to *group the browsing sidebar by*. (Registry history agrees the axis is unsettled: flat-A→Z → categories-restored was already one round-trip.)

### F4 — Over-fragmentation: sub-parts and near-duplicates listed as standalone components
The showcase makes **one sidebar row + one doc page per barrel export**. So compositional *parts* and *aliases* show up as peer "components." Worst offender is the menu/dropdown family — and it's carrying dead code:

- `MenuItem` (the trigger) + `MenuDropdownItem` + `MenuDropdownDivider` + `MenuDropdownNest` are **one compound component already living in one file** (`MenuItem.jsx`), listed as **4 rows**.
- `MenuPopover` is a **deprecated alias of `MenuItem`** (2026-07-02 unify) — still listed as its own component.
- `MenuPopover.jsx` **also redefines** a *different* `MenuItem` (a row) plus `MenuDivider` — dead duplicates of the real ones, shadowed and **not barrel-exported**. Pure redundancy to delete.
- `Dropdown`, `DropdownTagFilter`, `ShapeDropdown` — three more "dropdown" things with genuinely different jobs, no cross-link between them.

Same shape (sub-exports listed, or not, as standalone) elsewhere: `Popover` (`usePopover`/`PopoverPanel`/`Tooltip`), `Modal` (`ModalProvider`/`useModal`), `SpectrumControls` (`HueStrip`/`SBSquare`/`WheelTriangle`), `SwatchControls` (`SwatchStack`/`EyedropPick`), `Accordion`/`AccordionPanel`.

**The fragmentation splits into three different problems needing three different fixes — do not lump them:**

| Pattern | Example | Right fix | Layer | Risk |
|---|---|---|---|---|
| **P-a — Compound sub-parts** | Menu parts, Popover/Modal/Spectrum/Swatch sub-exports, AccordionPanel | Keep code exports; present as **one page, member sub-sections** | Presentation only | Low |
| **P-b — Dead / deprecated redundancy** | MenuPopover.jsx shadow defs; MenuPopover alias | Delete dead defs; drop alias from the list (keep export til next major) | Code (patch) | Low |
| **P-c — True variant families** | ViewToggle/WorkViewToggle vs SegmentedToggle; Stepper/QuantityStepper/QuantityInput; SearchInput vs Input; Card/Row twins | Merge into one component + variant prop, migrate call-sites | Code (minor/major) | High, per-family |

### F5 — `01-inventory.md` counts are stale
Frontmatter says "29 atoms, 17 molecules, 3 organisms." Actual folders now hold **42 atoms, 29 molecules, 28 organisms** (post-monorepo-batch). The inventory drifted and needs a regen pass.

---

## Target state

1. **Two named axes, owned in one doc.** *Tier* = code placement + import lint (keep the nesting test, add the "we diverge from Brad Frost on purpose" statement). *Function* = the closed Material set.
2. **The sidebar can group by either axis — a persisted `Atomic ⇄ Function` toggle** (D1). Both axes already ride on every registry entry (`.category` tier + `.function`), so grouping either way is just a different reduce over the same list — no data change. Function is the default (it's how people look for a component); Atomic is one click away for when you're thinking about composition/build structure. The tier badge shows on every page regardless. This dissolves the "why is Slider a molecule" weirdness without forcing an either/or.
3. **One page per *component*, not per *export*.** Sub-parts render as members of their parent (`Menu` → Item/Divider/Nest); infra modules (`Popover`, `Modal`) render as one page. Grouping lives in a **hand-authored overlay**, never in the mined `usage-index.json`.
4. **Dead redundancy gone**, deprecated aliases demoted out of the list.
5. **True variant families collapsed** where they share ~99% of the use case, each behind a sign-off + changeset.

---

## Decisions

- **D1 — Sidebar grouping axis. RESOLVED (2026-07-04): ship a toggle, not a choice.** Tier and Function are independent axes on the same data, so the sidebar gets a persisted **`Atomic ⇄ Function`** switch instead of a fixed grouping. Both grouper functions read the registry as-is (`componentsByCategory` exists; add `componentsByFunction`). Function is the default; the tier still shows as a per-page badge. The switch itself is a KOL `SegmentedToggle`/`ViewToggle` — the showcase dogfoods its own component. Cheap and non-breaking; folded into Phase 2.
- **D2 — How aggressive on P-c collapses.** *Open.* Default: propose each family, collapse only on your per-family yes. No silent merges (they're breaking API changes → major/minor bumps + call-site migration).

---

## Phases

### Phase 0 — Sign off this doc
Lock D1 + D2. No code. Output: this doc goes `status: active`, the two decisions recorded.

### Phase 1 — Own the convention (docs only, non-breaking)
- New definitions-first doc (`02-components/00-taxonomy.md` or fold into a renamed placement doc) that owns: the two axes, the five tier definitions **+ the explicit Brad-Frost divergence statement**, the Function set, and the "one page per component" rule.
- Reconcile F2: document the framework 3-way split (or re-merge it), state loaders/hooks/misc honestly.
- Shrink `02-placement.md` to the mechanical checklist, cross-linked to the new doc.
- **Acceptance:** a reader can answer "what's an atom / what are the categories / why isn't this atomic" from one doc; doc tiers == rendered groups.

### Phase 2 — De-fragment the presentation + grouping toggle (P-a + D1, non-breaking, biggest UX win)
- **Sub-part grouping.** Add a hand-authored `showcase/src/lib/component-groups.js` overlay: `parent → [members]`. Registry reads it so members render **inside** the parent page (one sidebar row). Fold in: Menu (Item/Divider/Nest), Popover (Panel/Tooltip/hook), Modal, SpectrumControls, SwatchControls, Accordion.
- **Grouping toggle (D1).** Add `componentsByFunction()` beside the existing `componentsByCategory()`; a persisted `Atomic ⇄ Function` switch in the sidebar header (localStorage, same pattern as ThemeToggle), rendered with a KOL `SegmentedToggle`/`ViewToggle`. Default = Function. Tier badge stays on every page.
- **Critical:** both groupings + the overlay read the registry as-is — **nothing writes `usage-index.json`** (the miner landmine wipes the 125 hand-seeded entries).
- **Acceptance:** menu family = 1 row showing all parts; sidebar regroups on toggle and remembers the choice; `usage-index.json` unchanged; `pnpm build` + Playwright green.

### Phase 3 — Kill dead & deprecated redundancy (P-b, patch bump)
- Delete the shadow `MenuItem`/`MenuDivider` defs in `MenuPopover.jsx` (dead, not barrel-exported).
- Drop `MenuPopover` from the components list (keep the alias export with its deprecation note until the next major).
- Changeset: `patch`. **Acceptance:** no dead exports; barrel unchanged for consumers; validate-taxonomy green.

### Phase 4 — Collapse true variant families (P-c, per-family, gated)
Each family is its own mini-project: source review → unify into one component + variant prop → migrate showcase/sets call-sites → changeset → validate → regenerate composition. Ranked by value/effort:
1. **Segmented family** — ViewToggle / WorkViewToggle as presets of `SegmentedToggle`.
2. **Numeric-stepper family** — Stepper / QuantityStepper / QuantityInput → one stepper + variants.
3. **SearchInput → Input** (`type="search"` + kbd/clear affordances) — it's already "Input's search sibling."
4. **Card/Row twins** — WorkCard/WorkListItem, MediaCard/MediaRow → `layout="card|row"` (ArticleCard's size-variant pattern is the precedent).
- **Acceptance (per family):** one export replaces N; call-sites migrated; changeset staged; no console errors.

### Phase 5 — Enforce & sync
- Extend `validate-taxonomy.mjs` (or a sibling lint) to flag a new sub-part export that should be a member, not a top-level row.
- Regen `01-inventory.md` counts (F5); regenerate composition manifests.
- **Acceptance:** lint catches the next fragmentation regression; inventory counts match reality.

---

## Risks & constraints
- **Don't run the usage miner** (`extract:docs` usage step) during any of this — it regenerates `usage-index.json` and wipes the 125 hand-seeded entries. Phase 2's overlay approach exists specifically to avoid touching that file.
- **7 changesets already held, unpublished.** Phases 3–4 add more; batch them into the same held release, don't publish mid-plan.
- **Phase 4 is breaking.** Barrel exports drop → major or minor per family. That's why each is individually gated (D2).
