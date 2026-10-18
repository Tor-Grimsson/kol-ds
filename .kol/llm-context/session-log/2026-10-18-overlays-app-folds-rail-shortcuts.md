# Session: Overlays — apps/overlays, fold rows, one overlay padding, the shortcuts rail

**Date:** 2026-10-18
**Agent:** Claude (Grim)
**Summary:** Five kol-monitor tickets closed, then the overlay family reworked live with the user in a new `apps/overlays` app — CommandOverlay folds, rail/overlay naming, `--kol-pad-overlay`, ShortcutsOverlay on SettingsPanel, AppHub's ⇧S rail — and shipped as an Overlays set.

## Changes Made

### Files Modified
- packages/component — `CommandOverlay` (shortcuts = fold rows; fold rows in any mode via `items`; page sections open on arrival; ⌘↵ expand/collapse all; eyebrow group headings; `go` folded into `search`; back arrow in the field's glyph slot; 44px footer lines on touch), `ShortcutsOverlay` (now `SettingsPanel` overlay/rail via `variant`, `title`; no Elsewhere), `SettingsPanel` (`variant="rail"` default, `drawer` alias; overlay = drawer anatomy, ⌘K width, scrim), `SettingsRow`/`LabeledControl` `text`, `SearchInput onBack`, `QuickLookFrame` × on the right, `Rail` on `--kol-pad-overlay`
- packages/shell — `AppHub`: `S` = CommandOverlay shortcuts, `⇧S` = `ShortcutsOverlay variant="rail"` (`shortcutsRailKey`); `HubSettings` on `variant="rail"`
- packages/theme — `--kol-pad-overlay` (20 · 24) in kol-design-tokens.css
- packages/workshop — ShellLayout on `variant="rail"`
- apps/overlays — new app (`pnpm overlays`, :5201): every overlay on apps/controls' Specimen frame, monitor's real modules + keymap (`monitor-data.js`); `Overlays.jsx` is the shared list
- showcase — `sets/overlays.jsx` (mounts `apps/overlays/src/Overlays.jsx`), `@source`, SET_FAMILY
- docs — 05-layout-systems (Overlay padding row), 16-app-anatomy (S / ⇧S row), inventory (LabeledControl text), shipped-packages
- memories — close-after-registry-live now checks the TARBALL (200), no publish while developing in an in-repo app; user added the `pnpm publish` allow rule

### Features Added/Removed
- Published: kol-component 0.268 → 0.275 · kol-shell 0.68 → 0.71 · kol-theme 0.176 · kol-workshop 0.41
- Tickets closed: ShortcutsOverlayList · SettingsRowMonoBaseline · SettingsRowTextKeepsLabel · ShortcutsOverlayCategories (+ follow-up receipt); SectionHeaderAboveTextRows withdrawn by monitor (its 0.270.0 header reverted in 0.271.0)

## Current State

### Working
- Every overlay opens in apps/overlays and the Overlays set; 390 / 768 pass with no overflow; rail-pages, taxonomy, foundations gates clean

### Known Issues
- `packages/design-editor` (fxr mirror) still passes `variant="drawer"` — works via the alias
- 0.275.0 / 0.71.0 tarballs were still propagating at log time; monitor not yet told about ⇧S

## Next Steps
1. When 0.275.0 / 0.71.0 download: message kol-monitor — drop `src/overlays/ShortcutsRail.jsx` + its ⇧S listener, AppHub owns ⇧S now
2. User pushes kol-ds-ui

## Amended — 2026-10-18

- kol-component 0.275.0 · kol-shell 0.71.0: `ShortcutsOverlay variant="rail"`; AppHub binds ⇧S to it (`shortcutsRailKey`) — monitor told to drop its ShortcutsRail
- SignalIconsFromMonitor closed → kol-icons 0.40.0: 24 signal icons redrawn in place to monitor's shapes (two review rounds on Open questions › Round 12), `grid-3x3` new, `ascii-back/-dot/-pipe-02` keep the boxed drawings; old drawings in `_tmp/2026-10-18-signal-icons/before/`
- IconVideoOff closed → kol-icons 0.41.0: `video-off` (eye-off idiom), shipped unreviewed on the user's word; Round 13 records it
- Monitor messaged on each, after the tarball served
