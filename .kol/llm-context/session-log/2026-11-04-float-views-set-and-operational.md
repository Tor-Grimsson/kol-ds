# Session: Float views, the Float set, float operational

**Date:** 2026-11-04
**Agent:** Claude Opus 5.5 (Grim), with Opus background agents
**Summary:** Three float plans built end to end — the views on FloatLayout in apps/float, Float as a set (family pages, showcase set, Figma chapter + slotted screens), and every gap closed in its package and mirrored to Figma; the kol-figma protocol skill born.

## Changes Made

### Files Modified
- `packages/shell` — FloatLayout (new; `bottom`, `eyebrow`, `inspector` slots), AppFloatNav transport `inline`, PropertyRail xs tabs → 0.102.0 … 0.103.0
- `packages/component` — NavRail float `onItemHover`; Dialog + ModalProvider `container` → 0.337.0, 0.338.0
- `packages/design-editor` — `TimelineRail` + `timelineView` (renamed from TimelineSheet, Rail law) → 0.27.0
- `packages/dashboards` — SourceCard `meta`/children, CaptureCard optional image → 0.11.0
- `packages/styleguide` — DocumentLangMark `langMark` (0.22.0), no middots + `validate:no-middots` (0.22.1)
- `packages/icons` — `typography/bold` (library--kol-icon 237:21006) in 0.64.0, published
- `apps/float` — new app: Home, Parts (13 family pages, solid/glass tabs), Views (6 screens); hash routing
- `showcase/src/sets/float.jsx` — the Float set mounts apps/float; showcase aliases design-editor /core
- `showcase/src/open-questions/2026-11-04.jsx` — round 25 (W6 size calls, W7 Rails scope), open
- `scripts/validate-variants.mjs` — float primary `tone="inverted"` legal by rule
- `~/.dotfiles/claude/skills/kol-figma/SKILL.md` (new) + `kol-figma-agent.md` (loads it first, background worker)
- Plans: `plan-2026-11-04-float-views.md` (done), `plan-2026-11-04-float-set.md` (done), `plan-2026-11-04-float-operational.md` (W1–W5 done, W6/W7 TALK)

### Features Added/Removed
- Figma library: ➤ Float chapter (13 family pages), FloatLayout slotted master, apps/float screens as FloatLayout instances on ↳ Apps, Float tile on ↳ Sets; new masters QuantityInput · SearchInput · ContextMenu · PageHeader/float · EmptyState (code's) · bold; Button `tone`, TopControlsBar/PropertyRail/Card slots, ValueField `trailing`
- Lobby: DocumentLangMark + StyleguideNoMiddots closed (receipts 📌 to kol-website); IconsBoldOnWebsite filed to kol-website

## Current State

### Working
- apps/float: 22 routes × 1600/390, 0 console errors, 0 sideways scroll; the Float set renders in the showcase
- All touched packages live on npm at their local versions; shipped-packages doc matches

### Known Issues
- validate:variants still exits 1 on 10 non-float hits (resume, styleguide ColorLab/PrintStudio, metric, style, stylesheet, AccountForm, VariantsControl, TextPanel)
- Figma library unpublished (his click)

## Next Steps
1. His rulings on round 25 (11 size calls + Rails board) — then apply set-wide
2. He republishes the Figma library; he pushes
