# TimelineRailFromDS → kol-fxr

**Filed:** 2026-11-04 → **kol-fxr**
**Entry:** `~/dev/projects/kol-fxr/lobby/inbox/TimelineRailFromDS.md`
**Ledger:** `~/dev/projects/kol-fxr/lobby/INDEX.md` — **the truth about this ticket**
**Last known:** ⚫ `withdrawn` · 2026-11-04

## Why it went there
`TimelineRail`, `timelineView` and the float `Timeline.jsx` (design-editor 0.26.0 and 0.27.0) exist only in the mirror. The next refresh from fxr's source would erase them, so fxr takes them into `src/editor/params/Timeline.jsx` and the `core.jsx` exports.

**Remainder here:** none — withdrawn 2026-11-04 on the user's ruling: fxr owns its editor and never consumes the DS copy; `packages/design-editor` is no longer refreshed from fxr, so `TimelineRail` and `timelineView` stay here as the float base.
