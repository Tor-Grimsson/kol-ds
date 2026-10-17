# MediaPickerCloseOnControlRow — the picker's × sits 10px above the controls beside it

**Staged:** 2026-10-16 · from a kol-monitor session
**Change:** one class on the × in `organisms/MediaLibraryPages.jsx` `LibraryHeader`

---

## The problem, in one case

Third report on this ×. `MediaPickerCloseOnTheHeaderRow` (kol-fxr 2026-10-10) and
`media-picker-close-and-title` (kol-mirror 2026-10-15) moved it **sideways**. Its vertical was never
right: `LibraryHeader`'s row is `items-baseline`, so the title and the bucket · lock · gear cluster share
the text baseline. The × has no text and is `self-center`, so it centres on the display wordmark instead.
Measured in monitor at 1440: × centre y 141, gear and lock y 151. The × floats 10px above the row it
belongs to. The user's words: *"CLOSE X BUTTON IS IN THE WRONG PLACE … HOW HARD IS IT TO PUT X IN THE
CORRECT PLACE"*. Horizontally it is already right: its right edge is the content edge, the same as the
columns below.

## The fix

`self-center` → `self-end` on the header's `CloseButton` (line ~956). Bottom-aligned, it lands on the
cluster's line: measured 151.5 against 151 (26px button, 27px cluster).

## Carried in monitor meanwhile

`src/styles/monitor-overrides.css`: `.kol-media-picker header > button:last-child { align-self: flex-end }`

## Definition of done

- [ ] the ×'s vertical centre is within 1px of the gear's, in the picker and the modal variant
- [ ] its right edge stays the content edge
- [ ] monitor drops the override

## ✅ RESOLUTION — 2026-10-16 · kol-component@0.262.0

`LibraryHeader`'s × is `self-end`, not `self-center`. Measured in apps/media /picker at 1440, light and dark: × centre 151.5, gear 151; right edge = content edge (1211). The `modal` variant has no gear row — its × is the overlay sheet's own corner close, and did not move.

**Remainder here:** none — kol-monitor bump kol-component@0.262.0; drop the `.kol-media-picker header > button:last-child` override in monitor-overrides.css.

