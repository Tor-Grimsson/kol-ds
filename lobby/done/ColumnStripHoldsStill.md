---
component: ColumnStripHoldsStill
source: kol-component/src/organisms/MediaLibraryPages.jsx (0.341.0) — the columns effect ~L2148–2154
staged: 2026-11-05
status: draft
deps: [MediaLibrary, ColumnBrowser]
---

# ColumnStripHoldsStill

## Purpose
In MediaLibrary's Columns view, clicking a file or a folder slides the whole strip sideways to its far right edge. Seen in kol-website's media app (media.kolkrabbi.io, B2 · vault, `sound/ae-sounds/01-ae-lp/`): with `_assets` open in the third column, clicking `INDEX.md` in the second column slid the view one column to the right. The user's rule, verbatim: *"when you press a folder or file in column view, nothing ever moves your horizontal location other then the mouse or the arrows. never auto slide between columns."*

## Anatomy
The cause is one effect in `MediaLibraryPages.jsx`:

```js
useEffect(() => {
  if (folderView !== 'columns') return undefined
  const root = columnsRef.current?.querySelector('[tabindex="0"]')
  if (!root) return undefined
  const id = requestAnimationFrame(() => root.scrollTo({ left: root.scrollWidth, behavior: 'smooth' }))
  return () => cancelAnimationFrame(id)
}, [folderView, prefix, atTitleRoot, pickedFile, bucketMeta.id])
```

Any change of `prefix` or `pickedFile` — every click — scrolls the strip to `scrollWidth`.

## Behaviour wanted
- A click on a file or folder never changes the strip's `scrollLeft`.
- The strip moves only by the user: mouse / trackpad scroll, or the arrow keys (← → move the selection between columns; when the selected column is off-screen, bring THAT column into view by the minimum amount — `scrollIntoView({ inline: 'nearest' })` — never jump to the end).
- Opening a folder whose new column lands off-screen to the right: no automatic slide either. (If you want a reveal there, raise it with the user first — his rule says never.)

## Props
None needed — this is the default behaviour for every consumer. If you keep the old slide anywhere, gate it behind an opt-in prop, off by default.

## States & interactions
- Click in any column: `scrollLeft` unchanged before/after.
- Arrow ← / →: the selection moves; the strip scrolls only as far as needed to show the selected column.
- Switching bucket or view (`bucketMeta.id`, `folderView`): resetting to the start is fine; no slide to the end.

## Acceptance
Playwright on MediaLibrary in Columns view with three columns open and the strip scrolled so the first column is half off-screen: clicking a file in the second column leaves `scrollLeft` exactly as it was.

## Dependencies
MediaLibraryPages only (ColumnBrowser's strip is the scroller it reaches into).

## ✅ RESOLUTION — 2026-11-05 · kol-component@0.341.1

The columns strip holds still. The real slide was ColumnBrowser's own effect (slide-to-end on every prefix/pick change); MediaLibraryPages' effect was a second, redundant one. Both are gone. A click never moves scrollLeft; an arrow key that lands in an off-screen column brings that column in with scrollIntoView({ inline: 'nearest' }), never to the end. Bucket/view switches reset naturally (the strip remounts or clamps). No opt-in prop: nothing depended on the old slide. Playwright: file click at scrollLeft 650 stays 650, folder click stays 650; arrows move by the minimum (786 to 780 to 520 to 526).

**Remainder here:** none — kol-website bump kol-component@0.341.1.

