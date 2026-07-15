---
component: WorkViewToggle
source: kol-monorepo/apps/web/src/components/layout/Navbar.jsx#L10-L147
date: 2026-07-03
status: draft
deps: [Icon, SearchInput]
---

# WorkViewToggle

## Purpose
The `/work` page's nav-header control: a pill-shaped segmented **Shelf ⟷ List** view switch with a **sliding pill** highlight, sitting beside an **expandable search** affordance. In the resting state it shows the two-option toggle + a collapsed search icon-button. Opening search collapses the toggle to zero width (fades out) and expands the search field to full width, revealing a round close button on the left. It's the single distinctive header control on the Work index — a composite of a segmented toggle and an inline search that swap horizontal space between each other.

## Anatomy
Root: `<div className="flex items-center">` holding three siblings, each animating its own `width`/`margin`/`opacity` so they trade horizontal space.

1. **Close button** (left, appears only when search open) — `<span className="inline-flex overflow-hidden flex-shrink-0">` collapsing wrapper:
   - `width: open ? 36 : 0`, `marginRight: open ? 12 : 0`, `opacity: open ? 1 : 0`.
   - `transition: width 600ms {CUBIC_EASE}, margin 600ms {CUBIC_EASE}, opacity 300ms {CUBIC_EASE}`.
   - Button `flex items-center justify-center w-9 h-9 rounded-full bg-fg-96 transition-colors hover:bg-fg-88`, inline `color: var(--kol-surface-primary)`, **Icon** `name="cross" size={20}`. `onClick` closes search.
2. **Toggle** (center, collapses when search open) — container `relative flex items-center rounded-full bg-fg-04 h-9 overflow-hidden`:
   - `width: open ? 0 : 176`, `marginRight: open ? 0 : 12`, `opacity: open ? 0 : 1`, same 600/600/300ms transitions.
   - **Sliding pill** — `absolute top-0 h-9 rounded-full bg-fg-96`, fixed `width: 96`, `left: viewMode === 'shelf' ? 0 : 80`, `transition: left 600ms cubic-bezier(0.34, 1.2, 0.64, 1)` (note the **overshoot/spring ease** — distinct from `CUBIC_EASE`).
   - **Shelf button** — `relative z-10 flex items-center justify-center rounded-full h-9 kol-helper-s transition-colors duration-300`, `width: 96`, `letterSpacing: 0`; `color: shelf-active ? var(--kol-surface-primary) : color-mix(in srgb, var(--kol-surface-on-primary) 80%, transparent)`; `paddingRight: shelf-active ? undefined : 8`. Inner collapsing icon span (`width shelf-active?20:0`, `marginRight ?8:0`, `opacity ?1:0`, 600/600/300ms) wrapping **Icon** `name="library" size={20}`. Label text `Shelf`.
   - **List button** — same shell plus `-ml-4` (16px overlap onto Shelf), `color` keyed to `viewMode === 'list'`, `paddingLeft: list-active ? undefined : 8`, collapsing icon span → **Icon** `name="view-list" size={20}`. Label text `List`.
3. **Search** (right, always present) — container `flex items-center bg-fg-04 rounded-full h-9`, `width: open ? 280 : 36`, `transition: width 600ms {CUBIC_EASE}`:
   - Icon button `flex items-center justify-center w-9 h-9 rounded-full text-auto flex-shrink-0 border border-transparent` + (when **not** open) `transition-colors hover:border-fg-12`. `onClick` opens search only when closed. **Icon** `name="search-16" size={16} className="text-fg-80"`.
   - When open: `<input>` `bg-transparent outline-none kol-helper-regular-s flex-1 text-fg-80 caret-current pr-4`, `value`/`onChange`, `Escape` closes.

`CUBIC_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'` (module const).

## Variants
No formal variants. Two orthogonal binary states drive all appearance: `viewMode` (`shelf` | `list`) positions the pill and swaps icon/color, and `searchOpen` (bool) cross-fades the toggle out and the search field in (with the close button). No size or tone variants exist in source.

## Props
Currently prop-less — all state comes from `useWorkView()`. **Convert to controlled:**

| prop | type | default | controls |
|------|------|---------|----------|
| value | `'shelf' \| 'list'` | `'shelf'` | Active view; positions sliding pill (`left 0` vs `80`) + icon/color swap |
| onChange | `(mode) => void` | — | Fires on Shelf/List button click |
| search | string | `''` | Controlled search-field value |
| onSearchChange | `(value) => void` | — | Fires on input change |
| searchOpen | boolean | `false` | Whether search is expanded (collapses toggle, reveals field + close) |
| onSearchToggle | `(open) => void` | — | Open (search icon) / close (close btn, Escape) requests |

Optional: `libraryIcon`/`listIcon` overrides, `options` (`[{value,label,icon}]`) if generalized past shelf/list.

## Styling
- Tailwind for layout + KOL utility classes; inline `style` for every animated numeric (`width`/`left`/`margin`/`opacity`/`color`) and the two eases.
- KOL tokens: surfaces `bg-fg-04` (toggle + search track), `bg-fg-96` / `hover:bg-fg-88` (pill + close btn), `hover:border-fg-12` (search idle hover); text `text-fg-80` (search icon/input), `text-auto`; typography `kol-helper-s` (button labels), `kol-helper-regular-s` (input). Active label color = `var(--kol-surface-primary)`; inactive = `color-mix(in srgb, var(--kol-surface-on-primary) 80%, transparent)`.
- **Sliding-pill mechanic:** pill is a fixed-96px `bg-fg-96` rounded rect whose `left` animates `0 → 80` on `cubic-bezier(0.34, 1.2, 0.64, 1)` (600ms, slight overshoot). Buttons are 96px each but List overlaps Shelf by `-ml-4` (−16px), so container width is `176` (= 96+96−16) and the two centered labels sit exactly 80px apart — matching the pill's travel. The active option's icon expands (`width 0→20`, `margin 0→8`, `opacity 0→1`) while the inactive collapses; per-side padding (`paddingRight`/`paddingLeft` = 8 when inactive) keeps each label optically centered as its icon collapses.
- **Search-expand mechanic:** three widths animate in concert — toggle `176→0` (fade out), search track `36→280`, close wrapper `0→36` — all on `CUBIC_EASE`, width/margin 600ms, opacity 300ms; the shorter opacity fade avoids ghosting during the width slide.
- **App-specific bits to DROP:**
  - `useWorkView()` / **WorkViewContext** (`viewMode/setViewMode`, `isSearchOpen/setIsSearchOpen`, `searchQuery/setSearchQuery`) → the six controlled props above.
  - The `useEffect` side effects (focus input on open; clear query on close) → recreate as internal: `useEffect` on `searchOpen` to focus the ref; leave query-clear to the parent's `onSearchToggle` handler (don't mutate a controlled value internally).
  - Consumed inside the app's `Navbar` only (`isWork` branch, grid col-start-7) — that placement is not part of this component.

## States & interactions
- **View switch:** click Shelf/List → `onChange`; pill slides (spring), icons swap, label colors cross-fade (`transition-colors duration-300`).
- **Open search:** click search icon (only when closed) → `onSearchToggle(true)`; toggle collapses, field expands + autofocuses, close button appears.
- **Close search:** close button, or `Escape` in the field → `onSearchToggle(false)`.
- **Type:** input fires `onSearchChange`.
- `aria-pressed` on each toggle button; `aria-label` on close ("Close search") + search ("Search projects") buttons.

## Dependencies
- **Icon** (DS) — `cross` (20), `library` (20), `view-list` (16→20), `search-16` (16).
- **SearchInput** (DS) — candidate to own the expandable-field half; but the collapse-to-icon + width choreography is bespoke here, so likely compose a plain `<input>` inside this component's own animated track rather than dropping in `SearchInput` wholesale.

## Recreation notes
- **Tier:** molecule leaning organism — it composites a segmented toggle *and* an inline search into one space-trading control; not a leaf.
- **Controlled seam replacing WorkViewContext:** the context bundled view + search state app-wide (also read by `Work.jsx` to filter). In the DS, expose the six props (`value`/`onChange`, `search`/`onSearchChange`, `searchOpen`/`onSearchToggle`) and let the consumer own the state (the app re-wires `Work.jsx` + this toggle to the same lifted state). No router, no context import.
- **Reconcile vs DS `ViewToggle` / `SegmentedToggle` — make it its OWN component, not a variant of either.** DS `ViewToggle` (text/icon/single) marks the active option with a filled chip / `bg-fg-absolute-24`, and `SegmentedToggle` is a flat divider strip with `bg-surface-secondary` active — **neither has an animated sliding pill, an expanding icon, nor an embedded search.** The sliding-pill highlight + the collapse-and-swap-with-search choreography is materially different from both. If you want a shared contract, mirror `ViewToggle`'s `viewMode`/`onViewChange`(→`value`/`onChange`) + `options` prop names so it's familiar, but implement the pill/search motion here. A thinner option — add a `variant="pill"` (animated highlight) to `ViewToggle` — would still not cover the search integration; keep the search as this component's own concern.
- **Text casing at call site:** labels `Shelf` / `List` are authored capitalized here — pass them as data (`options`/`labels`), no `text-transform`. Placeholder is empty in source; if added, author verbatim.
