# Session: Tool frame, curves rebuilt, the editor back on KOL

**Date:** 2026-09-27
**Agent:** kol-ds-ui (cloud session)
**Summary:** Ran plan-2026-09-27-app-frame-and-curves (waves A–C) and plan-2026-09-27-editor-ds-sync (phases 1–5) end to end; the editor audit is in the backlog.

## Changes Made

### Files Modified
- `docs/documentation/04-compositions/16-app-anatomy.md` — the Tool frame section (six rules, where each app stands); `docs/operations/07-apps-tier/01-tier-rules.md` points to it
- `packages/hardware` 0.3.0 — EnvelopeGenerator fills its parent (mirror's boxes, zoom, BPM transport, four ADSR handles, hold, one-shot + Trigger), `useEnvelopeGenerator` · `EnvelopeModeToggle`; SignalScope zoom/pan/clock/loop/fill; SignalReference `panel`; ADSR `hold` in the engine
- `apps/curves` — PageShell fixed, CURVES masthead, reference as panel / popover / sheet, `S` sheet
- `apps/media` · `apps/controls` — the tool frame; notes / decks lists title-only (media-fixture wiring); `packages/deck` 0.1.1 DeckEditor fixed · bleed
- `packages/component` 0.226.0 — PageHeader actions on the title row (wraps on phone); MenuItem focus ring; KeyframeEditor `t` getter; InspectorSection `actions`; CanvasFrame theme ink; `oq` strokes (XYPad, TimelineDock, icon-only wrappers)
- `packages/icons` 0.28.0 — `Icon` never the click target (the settings-X bug); crop · flip-horizontal/vertical · rotate-left/right · line · text-align-left/center/right into v1
- `packages/shell` 0.57.1 — ShortcutsOverlay capped to the window; `packages/theme` 0.153.0 — menu focus ring, divider `oq`; `packages/styleguide` 0.5.2 — AssetTable ink
- `packages/design-editor` 0.15.0 — its copies swapped for KOL (12 components), EditorIcon + 59 SVGs retired, transport controls into the motion pack, TransportBar rebuilt, inspector pass (tooltips, lock, glyph ladder, text alignment, Fill/Stroke out, labels, one toggle look), canvas fill through the colour target
- `scripts/` — native-title and icon-ink (I3, EditorIcon) gates cover the editor; new `validate-variants` (29 gates)
- `.kol/llm-context/backlog/2026-09-27-editor-ds-audit.md`, `plan-2026-09-27-editor-ds-sync.md` — audit and plan; old files in `_tmp/2026-09-27-editor-copies/`

## Current State

### Working
- 29 gates clean; `check:core` ok; full deploy build and the design-editor lib build clean
- Checked live: curves (1440 / 390, ADSR drags, one-shot), media, controls, presentation, notes; editor full and `/core`

### Known Issues
- Nothing published — the eight bumps above wait on the user
- Editor: many popovers / tooltips still missing (user, on review); #11's grounds (alpha `fg-04/08` beside `surface-*`) untouched
- Deck editor toolbar overlaps at 390 (pre-existing); brand and editor keep their own frames by ruling

## Next Steps
1. Merge `claude/confident-keller-wdpjuv` → main, publish the eight packages
2. Editor: the missing popovers / tooltips pass, then the grounds
3. Wave C leftovers: brand's frame, the deck editor at phone width
