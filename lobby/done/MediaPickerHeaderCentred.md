# MediaPickerHeaderCentred — the picker header row centres on the wordmark (supersedes MediaPickerCloseOnControlRow)

**Staged:** 2026-10-16 · from a kol-monitor session
**Change:** `items-baseline` → `items-center` on `LibraryHeader`'s `<header>` (MediaLibraryPages.jsx ~917), and the
×'s `self-end` back to no self-alignment

---

## The problem, in one case

`MediaPickerCloseOnControlRow` (filed by monitor this morning, shipped in 0.262.0) asked for the wrong thing.
The user drew two lines, at MEDIA's cap height and at its baseline: the WHOLE control row — bucket dropdown,
lock, gear, × — hangs below both. The cause is the row's `items-baseline`, which puts the dropdown's 12px text
on the display title's baseline, so every control box drops below the wordmark. `self-end` only moved the × down
to join the hanging row.

## The fix

`<header className="flex items-center justify-between gap-4">`. Measured in monitor at 1440 with that one rule:
MEDIA cap top 109.7 · baseline 142.5 · cap middle 126.1. Dropdown 127.5, lock 127, gear 127, × 127.

## Carried in monitor

`src/styles/monitor-overrides.css`: `.kol-media-picker header { align-items: center }`

## Definition of done

- [ ] every header control's vertical centre is within 1.5px of the wordmark's cap middle
- [ ] monitor drops the override

## ✅ RESOLUTION — 2026-10-16 · kol-component@0.263.0

`LibraryHeader`'s `<header>` is `items-center`, and the × drops `self-end` — it centres with the row. Measured in apps/media /picker at 1440, light and dark: wordmark cap middle 139.1, gear and × 140.5, dropdown 141; × right edge = content edge. The full-page library header (apps/media /) centres the same way: cap middle 70.6, trash and gear 72.

**Remainder here:** none — kol-monitor bump kol-component@0.263.0; drop the `.kol-media-picker header { align-items: center }` override.

