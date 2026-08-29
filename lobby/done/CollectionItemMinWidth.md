---
component: CollectionItemMinWidth
source: kol-component/src/organisms/ContentCollection.jsx#L107-L119 · seen on kol-website /work LIST after WorkListingRowsAndFilters (0.100.0)
staged: 2026-08-27
status: draft
deps: [ContentCollection, ContentRow]
---

# CollectionItemMinWidth — a collection item never sizes to its content

## Purpose

`/work` LIST on 0.100.0/0.102.0: the first row measured **3586px wide inside a
1232px collection**; the type/year column sat off-screen and the description
ran past the page. Cause, measured: the list track is `gridTemplateColumns:
'1fr'` (= `minmax(auto, 1fr)`) and the `<li>` item has `min-width: auto`, so a
`truncate`d (nowrap) line inside a row hands its min-content width to the
track and the grid overflows instead of clipping. Every truncating row in the
family is exposed; `/work`'s description is just the first long one.

## Ask

The collection's items never take min-content: `min-width: 0` on every
`<li>` (both forms), and the list track `minmax(0, 1fr)` (the `listMin` form
already is). Measured bar: the `/work` row's width equals the collection's,
`truncate` on the body clips with an ellipsis, the trailing column sits at
the row's right edge.

Local rule carried until it ships: `.work-list > li { min-width: 0 }`.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.102.1

Every collection <li> is min-w-0 and the list track is minmax(0, 1fr); a truncated nowrap line can no longer hand its min-content width to the track. Verified statically (no server run, by your rule): the track string and the item class are in the shipped source; the grid form's cols classes were already minmax(0, 1fr) via Tailwind. Measure the /work row against the wall on your bump.

**Remainder here:** none — kol-website bump kol-component 0.102.1; delete .work-list > li { min-width: 0 }.

