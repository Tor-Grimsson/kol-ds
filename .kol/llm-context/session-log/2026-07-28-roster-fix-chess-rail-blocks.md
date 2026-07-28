# Session: roster gate fix — chess rail blocks classified

**Date:** 2026-07-28
**Agent:** Grim (Fable 5)
**Summary:** Vercel deploy of `31e7789` (kol-ds-0034) failed at the roster gate — the chess 0.5.2 barrel exports (`SetupPanel`, `PiecePalette`, `GamePicker`, `MaterialSummary`, `useChessKeyboardShortcuts`) were never registered in `showcase/src/lib/classification.js`. Classified all five (four rail blocks → molecules; functions action/input/input/display; hook → utility), all three validators green locally (roster 221 exports), redeploy verified green by the user. Showcase-side only — no package bump.

- `showcase/src/lib/classification.js` — 5 entries added (TIERS ×4, FUNCTIONS_BY_NAME ×5)
