# FileCardTitleClearsActions — a long title truncates under the plate's actions, not before them

**Staged:** 2026-10-22 · from a kol-fxr session
**Change:** `ContentCard` plate — `packages/component/src/molecules/ContentCard.jsx:295-302` (actions) · `ContentText.jsx:59` (file title)

---

## The problem, in one case

kol-fxr's Library on the `file` card (kol-component 0.287.0), actions = a stacked cog over trash: a title like `Morph W 1791484577796 - a name far longer than the card` runs to the plate's edge and its ellipsis lands UNDER the cog — the layout breaks. The user: *"TRUNCATE so the layout doesnt fucking break"*.

The title already has `truncate` (`ContentText.jsx:59`), but the actions are `absolute` on the plate's right (`ContentCard.jsx:295`), so the text column still spans the full width and truncates at the card edge, behind them.

## The fix

When `actions` are present, the text column stops before them (reserve the actions' width on the text side), so the title truncates to the left of the actions. Same on `ContentRow`.

## Definition of done

- [x] A long title on a `file` card with actions ends in an ellipsis left of the actions, nothing overlaps
- [x] Same on the `file` row

## Resolution — 2026-10-22 · kol-component 0.290.0

- `ContentCard`: the absolute actions are measured (ResizeObserver) and their width + one pad is reserved as `pr` on the text, so `truncate` ends left of them.
- `ContentRow`: the plate’s ContentText takes `min-w-0`, so it shrinks beside the actions column.
- Verified in the showcase: card and row with a long title — ellipsis ends 12px left of the actions, no overlap.
