---
title: Component placement — where a new component goes
type: reference
status: active
updated: 2026-07-04
description: The mechanical runbook for placing a new KOL component into its Tier — the decision checklist, the rules that keep the atom/molecule test mechanical, the worked calls from the 2026-07-02 sweep, and validator enforcement. Tier definitions live in the taxonomy doc.
aliases:
  - component-placement
tags:
  - domain/design-system
  - domain/conventions
related:
  - "[[00-taxonomy|component taxonomy]]"
  - "[[03-taxonomy-audit-and-plan|taxonomy audit & plan]]"
  - "[[../backlog/2026-07-02-review-backlog|review backlog]]"
  - "[execution plan](../../../.kol/llm-context/plan.md)"
---

# Component placement — where a new component goes

This is the **runbook** for placing a new component file into its Tier. The Tier *definitions* (atom/molecule/organism/framework/loader/hook, and why KOL's tiers deliberately aren't Brad Frost atomic) live in [[00-taxonomy|the taxonomy doc]] — read that first if the terms are new. This doc is the mechanical decision procedure and the enforcement.

Every component gets exactly one location, decided by **structure, not vibes or complexity**. A new component slots into its tier and its alphabetical position — nothing else moves.

## The test in one line

- **Atom** — nests no KOL component (`Icon`/`Graphic` don't count).
- **Molecule** — nests at least one KOL component.
- **Organism** — a self-contained composed region (bar, table, gallery), regardless of nesting.
- **Framework / Loader / Hook** — see the checklist below.

## Rules that make the tests mechanical

1. **kol-icons `Icon`/`Graphic` are infrastructure, not components.** Nesting an Icon does NOT make an atom a molecule (Button, Stepper, Tag stay atoms).
2. **Downward-only imports.** Atoms never import molecules or organisms. Molecules may import atoms and sibling molecules. Enforced by `scripts/validate-taxonomy.mjs`.
3. **Structure beats complexity.** A hard-to-build component with no KOL nesting is still an atom (Popover/Tooltip); a trivial wrapper that nests one is a molecule (Image → AssetPlaceholder).
4. **Same-file nesting counts** but is invisible to the validator — mark the file with a `taxonomy-ok:` comment naming the reason (see Accordion).
5. **Organism is a judgment tier** for full regions. If you're debating atom vs molecule, structure decides; if you're debating molecule vs organism, ask "is this a self-contained section of an interface?"

## Decision checklist

1. Is it app chrome / page structure? → **framework** (`fw-chrome` / `fw-structure` / `fw-behavior`).
2. Does it resolve names to assets rather than render its own UI? → **loaders** (Docs page, not the components list).
3. Is it reusable behavior with no markup of its own? → **hooks**.
4. Is it a self-contained composed region (bar, table, gallery)? → **organism**.
5. Does it nest a KOL component (imports one, or same-file)? → **molecule**.
6. Otherwise → **atom**.

## Worked calls — the 2026-07-02 sweep

Moves the backlog named, decided by rule 1 + the molecule test:

- **Badge, Pill, Tag → atoms** — nest nothing KOL (Icon doesn't count).
- **Section, SectionLabel, SegmentedToggle, ToggleBracket, ViewToggle, LabeledControl, DropdownTagFilter, QuantityInput, QuantityStepper, Popover (usePopover/PopoverPanel/Tooltip) → atoms** — same test, same result.
- **Slider → molecules** — nests `Input`. The rule cuts both ways: the same test that demotes Badge promotes Slider.
- **ColorSwatch → molecules** — nests `TransparentX`.
- **ContentFilters → organisms** — a full filter bar (search + tag groups + view modes).

The 8 ex-primitives (`primitives` is dead — it was never part of the atomic system):

- **AssetPlaceholder, ExitPreview, FullscreenOverlay → atoms** — nest nothing; overlay/link mechanics are hand-rolled internals.
- **CodeBlock → molecules** — nests the `CopyButton` atom (extracted 2026-07-02).
- **Image → molecules** — nests `AssetPlaceholder`.
- **Accordion → molecules** — nests `AccordionPanel` same-file (`taxonomy-ok:` comment carries the call).
- **Carousel → organisms** — a self-contained slider region (checklist step 4 beats "nests nothing").

Loaders verdict (C4): **Docs page**, not a components-list category — `Icon` + `Graphic` joined `DOCS_ONLY` in the showcase registry, documented on `/docs/loaders`, galleries unchanged on `/icons`.

## Enforcement

`node scripts/validate-taxonomy.mjs` fails loud when:

- a component file sits outside the closed folder set (`atoms` / `molecules` / `organisms` / `graphics` / `hooks`),
- an atom imports from `molecules/` or `organisms/`,
- a molecule imports no KOL component and has no `taxonomy-ok:` exemption comment.

Run it after adding or moving any component. If it fights a genuinely correct placement, the rules get amended deliberately — [[00-taxonomy|the taxonomy doc]], this runbook, and the script move together.
