# Session: Minimal Labs to round 3, the design leads; build agent; workspace link fix

**Date:** 2026-11-17
**Agent:** Claude (Fable 5.2), Opus agents for the builds
**Summary:** After two wrong rounds, `apps/minimal` `#/labs` and its Figma frame are round 3: round 1's look and layout at 240 rails, holding every real Labs part. A `kol-build-agent` now carries the house conventions, and a workspace link slip that stopped `pnpm labs` and `pnpm editor` is fixed.

## Changes Made

### Files Modified
- `apps/minimal/src/labs/` — round 3 screen (`Labs.jsx`, `ToolbarDock.jsx`, `ParamsRail.jsx`, `Generative.jsx`, `Effect.jsx`), driven by the editor package's own state; rounds 1 and 2 code in `_tmp/2026-11-17-minimal-labs-old/` and `_tmp/2026-11-17-minimal-labs-round-2/`
- `apps/minimal/src/ui/` — `Sidebar.jsx` back (five parts); `Panel.jsx` 240 on both sides; `FieldRow.jsx` gained `stacked`; `Section.jsx` padding 12 and 10, gap 6; plus the parts round 2 added (NavRail, PickerCard, PropertyRail, InputNumber, InputColor, SelectStep, ButtonSplit, Menu, ColorSpectrum and others)
- `apps/minimal/src/editor/` — round 2 editor (real editor's regions in dark, engine reached through `engine.js`); not yet redone as round 3
- `apps/minimal/src/App.jsx` — `#/` is a start page with two links; root script `pnpm minimal`
- `apps/style/src/rows.jsx` — minimal column on today's parts (16 of 21); two wide cells scroll
- `packages/shell/package.json`, `packages/design-editor/package.json` — devDependencies on kol-component (and kol-shell, kol-theme) back to the workspace form; `pnpm install`
- `~/.dotfiles/claude/agents/kol-build-agent.md` — new agent: onboarding, 25 rules, checks, report order
- Plans: `plan-2026-11-17-minimal-labs-editor.md` (round 2, built), `plan-2026-11-17-minimal-labs-round-3.md` (round 3, built)

### Features Added/Removed
- Figma, minimal file `iJqsbFmtr8OkIWs364qguy` page `d`: `minimal-labs-3` 16:2483 (`labs-flow` 16:2484 at 240 rails, `labs-export`, `labs-start`); `minimal-gruvbox` 6:2443 (colour proposal: Gruvbox dark mapped onto the minimal roles, raw fills). That file's kit has components but no variables or text styles.
- Figma, des-tols `NzEN7gwu5UyjipXiItWzXs`: `minimal-labs-2` 71:15375 (round 2 screens) and 35 kit parts.

## Current State

### Working
- `pnpm minimal` then `#/labs`: rails 240 and 240, canvas 960, no sideways overflow, Generate fits the rail; 91 of 95 real Labs parts placed, 0 invented.
- `pnpm labs`, `pnpm editor`, `pnpm style` start again.

### Known Issues
- `#/editor` is still round 2 (the real editor's layout in dark), which he rejected as an approach; it needs its own map and a round 3.
- No home yet in Labs: stage zoom, pan, fps; lab-specific editors; Morph's three labs; Color opens the package's own window.
- `labs-export` and `labs-start` in Figma still have the 264 and 320 rails; he called `labs-start` bad and dropped it.
- `apps/minimal` reaches the editor engine through a source alias; a real chrome needs exports from kol-fxr.
- The lesson, saved to memory: for a new style the design leads and the code follows; the current apps are a parts list only.

## Next Steps
1. The editor: a parts map for him to verify, then round 3 on the minimal layout.
2. His call on the Gruvbox proposal.
3. Still open from before: library publish, then linking the reading text in the three `folio` documents.
