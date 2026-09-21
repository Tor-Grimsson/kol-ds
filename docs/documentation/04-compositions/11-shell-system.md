---
title: Shell system
type: reference
status: canonical
created: 2026-08-14
updated: 2026-09-03
description: The application shell set — rail plus scaffolds
aliases:
  - shell
  - kol-shell
  - app shell
  - nav rail
sources:
  - packages/shell/src/index.js
  - packages/shell/README.md
tags:
  - domain/compositions
  - audience/consumer
related:
  - "[[../00-overview/01-package-topology|package topology]]"
  - "[[02-shells|reference shells]]"
  - "[[09-dashboards-system|dashboards system]]"
  - "[[12-section-system|section system]]"
---

# Shell system — `@kolkrabbi/kol-shell`

The **application** shell set — the rail (a collapsed kol-framework `SideNav`
since 0.13.0), the AppShell layout root, and the page scaffolds an app is
built from. Lifted 2026-08-14 from the
hand-copied twins in kol-monitor ("Monitor") and kol-mirror ("Hall of
Mirrors"), whose copies had already drifted (shared dead import, shared
light-theme `GridCard` border bug, the same active-state ruling implemented
two different ways, twice-maintained shortcut lists disagreeing in both).

**The rail is the flat 48px column** (RailFlatGrabOpen, user ruling 2026-08-28 —
*"the div structure is super simple ok … it's 1 div parent and everything is just
in that container"*). This **reverses** the 2026-08-28 morning ruling that made
it a collapsed kol-framework `SideNav` (shell 0.13.0–0.15.0): on the rail that
replaced it the user's shape was *"impossible"* to reach. `NavRail` is one fixed
div — every child a direct child of it — and `AppShell` offsets the content by
`margin-left: var(--kol-shell-rail-width)`, the one live variable the rail
writes. **`kol-framework.css` is no longer required by the shell.**

**Grab to open** (*"when you grab it should not move the icons one pixel, only
reveal the title, and a chevron to see sub categories"* · *"when it opens it
should push the main content inside"*): the pill on the rail's edge — kol-r2b2's,
verbatim — drags the width between 48 and the sidenav ladder's rung (264, 320
from 1536), snaps to the nearer on release, toggles on a click. Every row is
`[32px rung][label][chevron]` clipped by its own width, so the icon column never
moves; the label is revealed by the clip and the content column follows the same
variable. **Two levels** (shell ≥0.17.0, RailTwoLevelSections — user: *"the NAV has 20px
icons in 32px containers, maybe level below has 12px icons in 20px container
aligned to right"*): an item with `sub` is a SECTION — the same L1 row plus its
caret — and its rows are L2, a 12px glyph in a 20px box indented so the glyph
column sits one step right of L1's (x 14 → 30), `oq-64` at rest and `oq-96` on
the route. **Nothing auto-expands**: an L2 row is behind both the clipped width
and its section's own disclosure, and `open` starts false with no prop to get it
wrong. L2 is not a `Button` — the icon-button ladder is 22/26/32/40 (2026-09-03) and
this rung is 20; adding an `xs` rung is a change to that ladder's law. A sub row
with no `icon` renders label-only. `AppShell railComponent` renders a different
rail, so proving a rail change no longer means forking `AppShell` too. The chrome is `.kol-rail-grab` (kol-theme's `kol-animation.css`), the
pointer numbers `GRAB` (kol-component's `utilities/motion`); `gsap` is a peer.

`settings` and `themeToggle` left with the SideNav rail: Settings is a
`bottomItems` rung whose open/close is the consumer's `onNavigate`, and the
theme toggle lives on the settings page.

```js
import {
  AppShell, NavRail, useNavHidden,
  PageShell, PageBleed,
  ContentFilters, TabStrip, GridCard,
  SettingsScaffold, LabeledControlSection, LabelRow,
  WalkthroughPanel, ShortcutsOverlay, Logomark,
} from '@kolkrabbi/kol-shell'
```

## Contracts

- **Router-agnostic** — `currentPath` + `onNavigate` props; render the
  router's element as children. No react-router dependency.
- **Icons** — resolved through the consumer's registry via Button's
  `iconComponent` seam; `ContentFilters` needs `filter` + `search` (in the DS
  set; the seam accepts any renderer).
- **Chrome in kol-theme** — `kol-components-shell.css`:
  `--kol-shell-rail-width` is **live** (theme ≥0.80.0) — the sidenav's width in
  its current state, `0px` while hidden — for consumers that offset a fixed
  element by it; `--kol-shell-page-pad` (48px);
  `.kol-shell-card-preview--{natural|compact|cover}`. The rail's own geometry,
  collapse and active rules are the sidenav's (kol-framework.css, the
  `.kol-sidenav-hop` atoms). `.kol-shell-rail` and the 2026-08-12 rail
  active-state rules retired with it.
- **`CatalogPage preset`** (shell ≥0.50.0, slide-variant-and-shelf-preset — user:
  *"this is a layout SET, I do NOT want to do this again"*): the whole page as
  one word. `catalog` is the defaults; `shelf` is a shelf of slide decks —
  capped, 3 tracks on a 280 floor, the `slide` card and row (component ≥0.178.0),
  stacked list, `kol-tone-secondary` on the root, the All / Recent view strip —
  and `toCard` returns fields and handlers (`bytes count cover onDownload
  onFavourite onDelete favourited`) while the page renders the slots. Explicit
  props win over a preset.
- **Grid geometry (documented default):** catalog grid = **up to** six tracks,
  gap 24 · list = up to four, gap 8 — a CEILING WITH A FLOOR, the same law
  `ContentCollection` carries (2026-09-01): the floor is `CatalogPage
  minColumn` (default 160) and the ceiling `maxColumns` (default 6, shell
  ≥0.49.0 — a three-deck shelf passes 3; the floor is a minimum, never a count — a 26-tile catalog's number; a shelf of three decks
  ), and no grid may take a track narrower than the floor. Six holds from
  1080px of container (160 × 6 + 24 × 5); a `width="capped"` page at 1280 is a
  920 container and renders FIVE at ~165 (measured, kol-client-olina
  2026-09-03). That is the law working, not the page failing — the six was
  ruled on monitor's full-bleed desktop, the floor is what keeps a narrower
  grid from slivers. The grid is `.kol-catalog-grid` (theme ≥0.138.0), the count is
  MEASURED by `CatalogPage` and published as `--kol-catalog-n` (a CSS-only
  count shipped in 0.137.0 and rendered one column in Firefox), and
  `ContentFilters`' first group reads the SAME number, so it sits over the first
  card at every width, not only at six. Corrected 2026-09-03: this line used to read
  `repeat(6, 1fr)` as if the count were fixed. `trailingActions`
  fills the header's right slot (`MediaLibrary`'s SELECT / FLAT slot) — never
  empty beside the divider (user, 2026-09-03). **A composition forwards the whole
  contract of what it composes** (user ruling 2026-09-03): `toCard`'s return is
  spread onto `ContentCard` / `ContentRow`, so every prop either takes is
  reachable per card — `media`, `ratio`, `date`, `size`, `meta`, `tags`,
  `selected`, `variant`, and the ones not written yet; `cardVariant` /
  `rowVariant` set the variant per page, `variant` per card beats them;
  `listLayout` is `grid` (four across, the ruling) or `stack` (one per line);
  `rowVariant` picks the row — `catalog` (default,
  the 36px no-thumb row the app tier was ruled on) or `file` (the 48px thumb
  row) for a catalog whose grid shows a cover. `width="capped"` also takes `.kol-page`'s 64px
  vertical rung (theme ≥0.136.0), so a capped catalog sits level with the
  `PageSection` pages beside it.
- **Shortcuts single-source:** one consumer array feeds both
  `ShortcutsOverlay` and the settings page's `LabelRow` map.
- **`AppShell navKeys`** (shell ≥0.12.0, user ruling 2026-08-28): Option+1…9
  navigates to the rail's nth **row** through `onNavigate` — never while typing,
  Option not Command (⌘1–9 is the browser's), matched on `e.code`. With a
  `logomark` that is the mark (`/`) then the items, the order on screen; without
  one, `items[n-1]` (shell ≥0.19.0 — until then it counted `items` only, so ⌥1
  landed on the second rung). Off by default; monitor · mirror · fxr pass it.
- **`PageHeader` left for `kol-component`** (component 0.174.0, 2026-09-03,
  page-header-one-masthead): the app-shell tier is rails, drawers and the
  portal frame, and a site with no shell could not take the masthead without
  the whole package. Same props plus `register`; kol-shell does not re-export
  it — the import path is the whole migration. Its contract (`actions` on the
  sub-line's baseline at no height, `subtitleMaxWidth`, `--kol-page-header-mb`)
  lives in [[12-section-system|section system]].
- **`PageShell` is a class, one gutter, one tier prop** (shell ≥0.43.0, theme
  ≥0.135.0 — two-page-scaffolds-one-job, kol-client-olina 2026-09-03): the
  geometry is `.kol-shell-page` (+ `--fixed`, `--capped`) in
  `kol-components-shell.css`, inline only for the `style` prop, so a consumer
  has a selector to reach. `--kol-shell-page-pad` aliases `--kol-pad-section-x`
  — the estate's ONE page-content ladder (20 · 32 · 48), which `.kol-page`
  already wore; the shell's own clamp had agreed with it only at 48 and stays
  as the fallback for a theme-only consumer. **`width`** is the tier: `bleed`
  (default) fills the window — the app tier; `capped` takes
  `--kol-container-max` and centres — the site tier. That is the one real
  difference between a shell page and a `.kol-page`, and `CatalogPage`
  forwards it so a site adopting the shipped catalog page does not silently
  get app geometry. Whether the two scaffolds stay two components after this
  is recorded as an open question, not ruled.
- **`PageShell` reserves the scrollbar gutter** (shell ≥0.18.0,
  PageShellScrollbarGutter): a page's content width used to depend on whether it
  scrolled — `scroll` mode gives the viewport scrollbar's width up, `fixed`
  keeps it — which is invisible until something downstream is measured in
  container units. `.kol-filters-first` is `calc((100cqw - 120px) / 6)`, so a
  scrollbar divided by six into the first filter group. One catalog column now
  means one thing on every surface of an app.
- **`useNavHidden`** — load-bearing seam: full-bleed routes (monitor's rack,
  mirror's studio) hide the rail at runtime and render their own nav header.
- **The page background steps up from a primary back (ShellPageWash, user
  ruling 2026-08-27 — shell ≥0.11.0):** `AppShell`'s content wrapper paints
  `surface-primary` always — the back of the back, in every app — and takes
  `pageWash` (a CSS colour, e.g. `'var(--kol-fg-12)'`, default none), set as
  `--kol-shell-page-wash` on that wrapper; `PageShell` paints
  `var(--kol-shell-page-wash, var(--kol-surface-primary))`, and a page root
  that is not `PageShell` reads the same variable. It is a **transparent wash
  over primary, not a surface swap**: `secondary` is the module faceplate, and
  an opaque `oq-*` is the same pixel but hides the structure — the wash steps
  the lightness up and keeps it. Unset renders exactly as before. A prop rather
  than a token each app binds, because fxr's stylesheet is imports-only by rule.
  **One owner per pixel (2026-09-03):** the variable means what is LEFT to
  paint. `AppShell` hands the wash down and `PageShell` paints it; kol-framework's
  `PageLayout` paints it on its own plane and hands down `transparent`, so a
  `PageShell` inside that frame paints nothing over it — both painting made
  `fg-02` render as two 0.02 layers on olina's /slide-deck. It is not
  `--kol-tone-ground`: the wash is a translucent film, the ground is the opaque
  colour a floating surface paints, and CSS cannot flatten one into the other.

## Stays per-app

Domain surfaces (rack, studio, detail pages), accent bindings, product names,
logomark files, nav arrays, walkthrough/shortcut/settings **content**,
touch-device gates. Data and copy are consumer-injected — the set never
fetches.
