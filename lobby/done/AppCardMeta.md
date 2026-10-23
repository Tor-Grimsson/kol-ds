# AppCardMeta

**Staged:** 2026-10-23 · from a kol-monitor session
**Change:** a `meta` line on the `app` card and row (kol-component `ContentText` RAMP)

---

## The problem, in one case
Monitor's Library moved onto `CatalogPage preset="app"` (MonitorLibraryOnAppPreset). Its cards carried a detail line — `6HP 3U — Control` on a module, `12 modules, 9 connections` on a patch. The `app` card draws `ContentText variant="file"`, whose RAMP is `title` + `date` · `size` (`ContentText.jsx:156`), so `detail` and `meta` are both dropped: every Library card is now a name and a byte count. Presets have no date, so the date cell is empty too.

## The fix
Draw `meta` on the `app` card and row when it is passed — a line under the title, beside or under `date` · `size`, as `slide` already does (`ContentText.jsx:64`). Absent `meta` = today's card, so fxr and mirror move nothing.

## Rejected alternative
Putting the counts in `date` — a slot that means a date, read by `useAppItem` as one.

## Definition of done
- [x] `ContentCard` / `ContentRow variant="app"` render `meta` when passed; unchanged without it
- [x] Published; kol-monitor's receipt names the version

## Resolution — 2026-10-22 · kol-component 0.292.0

- `ContentText` gains an `app` ramp: `file` text plus `meta` (`kol-mono-12 text-meta truncate`) between the title and `date` · `size`. ContentCard / ContentRow hand their text `variant="app"` for an app item; the box stays `file`.
- Verified in the showcase CatalogPage `app` variant: a card with `meta` draws title · meta · date · size (plate 97px); one without stays at 73px, unchanged.
