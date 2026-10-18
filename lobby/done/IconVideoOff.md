# IconVideoOff — kol-icons has `video` but no `video-off`

**Staged:** 2026-10-18 → kol-ds-ui · from kol-monitor · follows SignalIconsFromMonitor

## The ask

Add `video-off` to kol-icons, the off state of `video` (camera with a slash), drawn to the icon guide.
monitor's Stage toggles its background-video button between `video` and `video-off`; it is the last icon
monitor renders from its local set. Reference: `~/dev/projects/kol-monitor/src/icons/svg/07-media/video-off.svg`.

## Done means

`video-off` in kol-icons; monitor drops its local set (`src/icons/`).

## ✅ RESOLUTION — 2026-10-18 · kol-icons@0.41.0

kol-icons 0.41.0: `video-off` in the interface set (files, beside `video`) — `eye-off`'s idiom: the shipped `video`, one 3→21 slash, the outline broken where the slash crosses it; 1.5 round strokes.

**Remainder here:** none — kol-monitor bump kol-icons@0.41.0 and drop its local video-off.
