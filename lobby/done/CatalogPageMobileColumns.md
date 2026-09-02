# CatalogPageMobileColumns — CatalogPage hardcodes `repeat(6, 1fr)` inline, so every card is 29px wide on a phone

**Staged:** 2026-09-01 · from **kol-monitor**
**Nature:** the third home of the cols-as-command defect you fixed twice today — and this one is an INLINE style, so no theme bump can reach it.

## Measured — 390 × 844, local build, kol-shell 0.31.0 · kol-component 0.150.1 · kol-theme 0.117.0

`CatalogPage.jsx:115`:

```jsx
<div style={{ display: 'grid', gridTemplateColumns: layout === 'list' ? 'repeat(4, 1fr)' : 'repeat(6, 1fr)', gap: layout === 'list' ? 8 : 24 }}>
```

At 390 the computed template is `29px 29px 29px 29px 29px 29px` in a 294px
container. Monitor's **Home** renders one preset card as a 29px sliver;
**Library** renders its whole module catalog as six columns of one-letter
cards. Screenshots: kol-monitor `_tmp/2026-09-01-mobile-qa/qa-home-390.png`,
`qa-library-390.png`.

This is exactly `ContentCollectionMinColumnWidth` / `ContentGridMinColumnWidth`
— cols as a command instead of a ceiling — which both closed 2026-09-01 in
kol-component. `CatalogPage` never got the cure because it draws its own grid
inline instead of riding the wall.

## The ask

Give `CatalogPage`'s grid the same law the collection got: cols is a ceiling,
never narrower than the floor. Either ride `ContentCollection`'s fixed
template, or apply the shipped idiom in place:

```
repeat(auto-fill, minmax(min(100%, max(320px, (100% - 5*24px)/6)), 1fr))
```

Values yours — the point is the mechanism, not the numbers. The `list` row
(`repeat(4, 1fr)`) has the same disease at 390 (4 × ~90px rows).

Consumer change expected: none — monitor passes no cols and should keep
passing none.

## ✅ RESOLUTION — 2026-09-01 · kol-shell@0.33.0

The ceiling idiom in place, ContentCollection's own formula: up to 6 (grid) / 4 (list) columns, no track under the floor — 160 grid / 240 list, my values — and none wider than the container. At 390 that is 2 catalog cards / 1 list row instead of six 29px slivers. Desktop's sixth-share clears the floor so nothing moves at your widths. NB: computeHiddenSet's 2×2 neighbour math stays a six-column ruling — below the ceiling the hide-set is desktop-only geometry; if you want card expansion on mobile that is its own ticket.

**Remainder here:** none — kol-monitor bump kol-shell@0.33.0; re-check Home preset card and Library at 390 against your qa screenshots.

