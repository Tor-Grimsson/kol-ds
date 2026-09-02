# @kolkrabbi/kol-workshop

## 0.27.0 — 2026-09-01

- **`ShellNavCollapsedContext` — a page can shed the left rail.** The TOC has
  had `ShellTocCollapsedContext` since the rails were made collapsible; the
  nav never got the matching seam, so a page could hide one rail and not the
  other. A landing page wants neither: the showcase home's docstring claimed
  "top nav (no sidebar)" and rendered under both. Same contract as the TOC
  seam — set on mount, restore on unmount, the header's own toggles keep
  working on top of it. Nothing moves for a page that does not call it.

## 0.26.0 — 2026-09-01

- **Closing the search palette survives its own query reset.** Close-and-clear
  was two calls — `closeTagMode()` then `setSearchQuery('')` — and on the
  provided path the second is `TagModeContext.setText`, which force-opens, so
  both landed in one React batch and the final state was OPEN. Scrim tap AND
  desktop scrim click were undone in their own event (Escape only worked
  because the context's window listener runs after and wins); `onSelect`'s
  destination branch carried the same pair and navigated with the palette
  still up. One `closeSearch` helper now: the provided path is
  `closeTagMode()` alone (it already resets `text`), the local path closes and
  clears. `setText` keeps its open-on-type behaviour — its call sites are all
  palette-open paths. (WorkshopSearchCloseUndoneBySetText, kol-website)

> **Gap:** 0.3.4 → 0.21.0 shipped without entries (that history lives in the repo's
> session logs). Resumed 2026-08-14 — from here every publish adds an entry, and
> breaking or global-surface changes (token renames, default flips, new bare-element
> rules) are flagged **BREAKING**.

## 0.25.0 — 2026-08-31

- **`TagModeOverlay` reads the query.** Pressing return set `expanded`,
  `ShellLayout` swapped its body for this component, and the component consulted
  `activeTags` and nothing else — so a typed query was replaced by the complete
  unfiltered tag census and ZERO document rows, by construction. Searching `rf`
  listed `project/kol-monorepo 85`, `domain/design-system 13` … not one of which
  contains `rf`.
- Document rows now render on a query OR a chip, matched with the engine's own
  `matchSearchItems` rather than a second predicate, so committed and
  uncommitted results rank identically. The tag cloud narrows to the tags present
  in the result set with counts recomputed over it; an empty query keeps the full
  census, which is a good browse state. A query that matches nothing says so.
  (TagModeOverlayIgnoresQuery, kol-website)

## 0.23.0

### Minor Changes

- **BREAKING — the DS tier is a peer, not a dependency.** kol-component · kol-icons · kol-framework · kol-theme move from
  `dependencies` to `peerDependencies` with a `>=` floor (>=0.68.1 · >=0.18.0 · >=0.23.0 · >=0.51.0).
  A 0.x caret in `dependencies` had pnpm nesting a private, stale copy of the tier
  under this package — a consumer bumped to kol-component 0.68.1 was still rendering
  this package's imports from the pinned line, so no DS fix since could reach those
  surfaces. The consumer now supplies ONE copy; the floor is the version this
  package's named imports were walked against. Same shape as kol-dashboards and
  kol-shell. Consumers: install the tier yourself and drop any `pnpm.overrides`
  forcing one copy.

## 0.22.0

### Minor Changes

- **Exhibit sections — the scaffold moves into the package.** The workshop shell
  was already shared, but the sections _above_ it were not: every consumer
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
    TOC slot. The hook keys its effect on the _content_ of its props, not their
    identity, so a page can pass an inline array literal without setting shell
    state in a loop — which is the trap the copied six-line `useLayoutEffect`
    block left open at every call site.
  - **`ExhibitCard`** — the specimen header (name · description · details ·
    code) inside a section.
  - **`ExhibitLinkCard`** — the child-page card on a landing grid. It arrives
    carrying its own request: the consumer's copy was annotated _"vendored
    verbatim from elder @kol/ui (no DS twin); lobby to the DS if a second
    consumer appears."_

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
