# ShellHomeSystemMonitorGaps — two seams kol-monitor hit adopting kol-shell 0.8.0

**Staged:** 2026-08-27 · from **kol-monitor** (the ShellHomeSystem adoption, same day as fxr's)
**Change:** kol-shell — one field name reconciled, two props threaded through `CatalogPage`

## The problem, in two cases

**1. `SettingsShortcuts` and `ShortcutsOverlay` disagree on the field name.**
`SettingsShortcuts`' docstring says it takes *"the same `[{ section, items: [{ id,
label, combo }] }]` array `ShortcutsOverlay` takes"* — and reads `k.combo`
(`SettingsShortcuts.jsx:24`). `ShortcutsOverlay`'s `Row` destructures `{ label, keys }`
(`ShortcutsOverlay.jsx:41, 74`). One array cannot feed both; monitor's
`src/data/shortcuts.js` maps `combo → keys` once so the pair cannot drift. The
promise in the docstring is the right one — the code should keep it.

**2. `CatalogPage` cannot host monitor's Library.** Two things the page needs
never reach the organism / the card:
- `mutuallyExclusiveFilters` — Library's Category and Size groups are one-of
  (`['category', 'u_label']`); `CatalogPage` passes a fixed prop set to
  `ContentFilters` and this is not in it.
- `expanded` / `expandedContent` — `ContentCard catalog` carries both since
  component 0.72.0 (the reason the retirement map was reopened for monitor ·
  mirror · fxr), but `toCard`'s contract is `{ key, title, detail, media, actions,
  onClick, href, onNavigate }` — the 2×2 expand cannot be expressed.

So monitor's Home is on `CatalogPage` and its Library + Create are on
`ContentFilters` + `ContentCard` / `ContentRow catalog` directly — the same
grid the page renders, written a second time.

## The fix

1. `ShortcutsOverlay` reads `combo ?? keys` (or `SettingsShortcuts` reads
   `keys ?? combo`) — one name in the docs, the other tolerated for a release.
2. `CatalogPage`: pass `mutuallyExclusiveFilters` through (or spread a
   `filtersProps` object onto `ContentFilters` so the next gap is not a
   release), and add `expanded` / `expandedContent` to what `toCard` may return,
   handed to `ContentCard`. Neighbour-hiding stays consumer-side — a 2×2 cell
   hides three grid neighbours (`computeHiddenSet` in monitor's `LibraryPage.jsx`).

## Rejected alternative

A `renderItem` override on `CatalogPage` — it would let monitor's Create page
(which renders the RackViewport inside the filter panel in its CASE view) move
too, but that page is monitor-specific chrome, not the catalog, and an override
that big is the fork the set exists to end. Create stays where it is.

## Definition of done

kol-shell published with both; monitor swaps Library onto `CatalogPage` on the
bump (that is the remainder here).

## ✅ RESOLUTION — 2026-08-27 · kol-shell 0.9.0

ShortcutsOverlay reads combo (keys tolerated for a release) — one array feeds both. CatalogPage: filtersProps spreads onto ContentFilters last (mutuallyExclusiveFilters and whatever comes next); toCard may return expanded / expandedContent, handed to ContentCard catalog. Verified in source only (no server run, by your rule).

**Remainder here:** none — kol-monitor bump kol-shell 0.9.0; swap Library onto CatalogPage with filtersProps={{ mutuallyExclusiveFilters: ['category', 'u_label'] }} and expanded / expandedContent from toCard; drop the combo → keys map in src/data/shortcuts.js.

