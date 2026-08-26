# @kolkrabbi/kol-workshop

> **Gap:** 0.3.4 → 0.21.0 shipped without entries (that history lives in the repo's
> session logs). Resumed 2026-08-14 — from here every publish adds an entry, and
> breaking or global-surface changes (token renames, default flips, new bare-element
> rules) are flagged **BREAKING**.

## 0.22.0

### Minor Changes

- **Exhibit sections — the scaffold moves into the package.** The workshop shell
  was already shared, but the sections *above* it were not: every consumer
  rebuilt the same landing page, the same specimen-grid page, the same prose
  companion and the same rail block by hand, so adding the next exhibit meant
  rebuilding all of it. Six new exports, all content-injected:

  - **`ExhibitOverview`** — the landing: concept, one opt-in action (the live
    instance an exhibit documents), every child page as a card.
  - **`ExhibitPage`** — an inner page as a list of sections. The two page shapes
    consumers hand-built collapse into one component, because they were never
    structurally different: a section carrying `specimens` renders a grid of
    `ExhibitCard`-headed demos, one carrying `children` renders anything, and
    `prose: true` adds the reading measure.
  - **`ExhibitSidebar`** + **`useExhibitToc`** — the rail block (on-this-page ·
    doc links · quick actions) and the hook that registers it into the shell's
    TOC slot. The hook keys its effect on the *content* of its props, not their
    identity, so a page can pass an inline array literal without setting shell
    state in a loop — which is the trap the copied six-line `useLayoutEffect`
    block left open at every call site.
  - **`ExhibitCard`** — the specimen header (name · description · details ·
    code) inside a section.
  - **`ExhibitLinkCard`** — the child-page card on a landing grid. It arrives
    carrying its own request: the consumer's copy was annotated *"vendored
    verbatim from elder @kol/ui (no DS twin); lobby to the DS if a second
    consumer appears."*

  **Drift fixed on recreation**, in the same pass rather than reproduced: the
  source's rail block hand-rolled a collapsible section with
  `.shell-sidebar-toggle` **and** `.shell-sidebar-label` stacked on one element,
  inline `paddingRight`/`paddingBottom`/`justifyContent`, and its own chevron at
  L1. All four are things `RailSection` exists to prevent — the eyebrow-box law
  says an eyebrow wears ONE box class and sets no y-spacing inline, and the
  2026-08-01 ruling says L1 draws no chevron. The rungs come from `RailSection`
  now, so the block cannot drift from either rail; `validate:rails` R3 + R4
  assert both halves. The landing card also loses its `uppercase` utility — the
  no-`text-transform` law.

## 0.3.4

### Patch Changes

- Updated dependencies
  - @kolkrabbi/kol-framework@0.8.0
