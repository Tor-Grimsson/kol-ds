# AppCardDateSizeWrap

**Staged:** 2026-10-23 · from a kol-mirror session · second consumer: kol-fxr
**Change:** the `app` card's date · size line never wraps (kol-component `ContentText.jsx` `app` ramp / group)

---

## The problem, in one case
`CatalogPage preset="app"` at a 1280px viewport draws 6 columns, ~170px each. A saved file's card puts `['group', 'date', 'size']` (`ContentText.jsx:163`) beside the plate's trash. Neither slot has `whitespace-nowrap` or `truncate` (`ContentText.jsx:65`), so each breaks mid-value:
- mirror: `2026-10-` / `23` and `1.7` / `KB` stacked — `_assets/2026-10-23-app-card-date-size-wrap/mirror-library.png` (first card)
- fxr: `2026-10-` / `08` and `320` / `B` stacked — `_assets/2026-10-23-app-card-date-size-wrap/fxr-home-recent.png`

Both apps pass the same fields (fxr's contract, AppLayout.jsx:336-352): `date` (ms) · `size` (bytes) · `verbs` · `download` · `media`.

## The fix
A value never breaks inside itself: `whitespace-nowrap` on `date` and `size` in the `app` (and `file`) ramp. When the group still doesn't fit beside the plate, the DS decides what yields — drop `size` before `date`, or let the group drop below — not each app.

## Carry in consumers
None. Neither app works around it; both take the fix by a bump.

## Definition of done
- [x] At ~170px columns an `app` card shows `2026-10-23` and `1.7 KB` unbroken, or `size` yields cleanly
- [x] Published; kol-mirror's receipt names the version

## Resolution — 2026-10-22 · kol-component 0.295.0

- `ContentText`: `date` and `size` carry `whitespace-nowrap` in the `file` and `app` ramps; for those variants the `group` is `flex-wrap` (column gap 24, row gap 0), so a pair that does not fit puts `size` on the next line whole.
- Verified in apps/catalog at 1280px, App preset (177px cards): `2026-09-28` one line (16px), `64 KB` one line below it; nothing breaks inside a value.
- Second consumer kol-fxr takes the same fix by the bump.
