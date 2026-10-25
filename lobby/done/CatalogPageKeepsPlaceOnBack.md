# CatalogPageKeepsPlaceOnBack

**Staged:** 2026-10-24 · from a kol-mirror session
**Change:** a `CatalogPage` left for a detail page and returned to by Back comes back as it was left: filter chips, search, grid/list and the scroll position of its own region

---

## The problem, in one case
The user, in kol-mirror: *"going back from module or patch to library or some hub page, previous location is not respected"*. Library → MODULES → pick a chip → list → scroll → open a module (`/library/module/<slug>`, StudioDetail) → ‹ Back. Back is `navigate(-1)`, so the route is right, but `CatalogPage` remounts and every piece of state is fresh: `ContentFilters` holds `activeFilters`, `internalLayout`, `internalSearch`, `searchOpen` in `useState` (`ContentFilters.jsx:174–191`), and `fixed` mode scrolls in `CatalogPage`'s own region, which no router scroll restoration reaches. The same reset happens on Home and Create, since every hub page is a `CatalogPage`.

Mirror's own half, the PATCHES · MODULES view, is now in its URL (`?view=`). That one was the consumer's state. The rest is the KOL's.

## The fix
`CatalogPage` (and the `ContentFilters` under it) keeps its place per history entry: the chips, search, layout and its region's `scrollTop` are restored when the same entry is shown again. One idea: key a small store on `history.state.key` (react-router's location key) and restore on mount, so a fresh visit is still fresh and only Back restores. An opt-in prop (`restoreKey`) or always-on is the KOL's call.

## Rejected alternative
Mirror lifts every filter into its own URL and hacks `scrollTop` on the KOL's region by selector. That's a second implementation of ContentFilters' state, and it breaks on the region's next layout change.

## Definition of done
- [ ] Back from a detail page restores chips, search, grid/list and the region's scroll on `CatalogPage` (app preset, `fixed` mode)
- [ ] A fresh navigation to the same route starts clean
- [ ] Published; kol-mirror's receipt names the version

## 🟢 CLOSED — 2026-10-24 · kol-shell 0.80.0 live

`CatalogPage` keeps a place per HISTORY ENTRY (`history.state` — react-router's `key`, else its `idx`; a hash router too) and catalog name: the chips, the search, LIST / GRID, the filter panel's open state, the page's own view and the fixed region's scroll come back when Back or Forward shows the same entry; a fresh navigation is a new entry and starts clean. Always on, nothing to pass; a consumer's `filtersProps` handlers still fire; a view the consumer controls (mirror's `?view=`) stays the consumer's. Two traps found and guarded: the region's last scroll event on the way out (its content goes before the element, scrollTop snaps to 0) and a restore set before the region is tall enough (pending until it is). Walk `_tmp/2026-10-24-catalog-keeps-place/walk.mjs` on rack-hub's Library: chip → LIST → scroll 240 → a patch → ‹ Back restores all four, a fresh Library is clean, console clean (11/11). Registry live (checked once). Receipt returned to kol-mirror's outbox.
