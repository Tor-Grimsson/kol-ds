# Session: The `app` card variant, mirror's icons, the gates

**Date:** 2026-10-23
**Agent:** Claude (Grim)
**Summary:** kol-fxr's saved-file card shipped as `variant="app"` + `CatalogPage preset="app"` and five follow-up tickets on it; mirror's last five glyphs into kol-icons; every gate but the retirements drop-ready pair green.

## Changes Made

### Files Modified
- `packages/component/src/molecules/AppItem.jsx` — new: `useAppItem`, `AppItemMenuProvider`, the plate, placeholder (`text-oq-24`); download stops its click.
- `packages/component/src/molecules/ContentCard.jsx` · `ContentRow.jsx` — `app` → `file` with slots; text variant `app`; no tone hover for `app`.
- `packages/component/src/molecules/ContentText.jsx` — `app` ramp + order (`meta` under the title); date · size nowrap and the group wraps on `file` / `app`.
- `packages/shell/src/CatalogPage.jsx` — `preset="app"`, every page mounts `AppItemMenuProvider`.
- `packages/hardware/src/value/EnvelopeGenerator.jsx` — no Play/Pause · BPM · Trigger under `now`.
- `packages/icons/src/kol-icon-set-interface/` — `tools/undo` · `tools/redo` · `atomic/atomic-molecule-04` · `shape-forms/wave` · `misc/rabbit` (Lucide's path, ISC); `cuts.json` regenerated.
- `apps/catalog/src/App.jsx` — App preset / card / row in the Variants panel, clickable app slots.
- `showcase/src/previews/CatalogPage.jsx` — `app` variant; usage JSON regenerated.
- Gates: `validate-variants` allowlist (Modal OK, catalog Variants button), `validate-chapters` skips top-level `_` folders; `NO_PREVIEW` gets `AppItemMenuProvider`.
- Docs: `06-content-card-system.md` + `11-shell-system.md` (the `app` variant / preset), icon inventory (252), `04-retirements.md` row split, two headings, 18 descriptions to ≤8 words (mdx + component headers + homes).
- Lobby: tickets filed to kol-fxr · kol-mirror · kol-monitor (adopt `preset="app"`; monitor's Dev tab through `dev={{ tabs }}`) — all three closed there.

### Features Added/Removed
- `ContentCard` / `ContentRow` `variant="app"`, `AppItemMenuProvider`, `CatalogPage preset="app"` — opt-in; every other variant and preset unchanged.

## Current State

### Working
- Live: kol-component 0.295.1 · kol-shell 0.75.0 · kol-hardware 0.6.1 · kol-icons 0.44.0. Lobby inbox empty.
- `pnpm validate`: 31 of 32 gates clean.

### Known Issues
- The comment-only header edits (component, framework, styleguide) and `cuts.json` are unpublished; they ride the next publish.
- kol-icons ships Lucide's rabbit without Lucide's ISC notice in the package.

## Next Steps
1. Push is the user's.
2. Round 16's pick and plan 2.2 are still open.
