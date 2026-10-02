# Session: Monitor rehearsed on the new packages — apps/rack and apps/rack-hub

**Date:** 2026-10-02
**Agent:** Claude (Grim)
**Summary:** kol-monitor's whole `src/` copied in and run on this repo's packages, compared pixel by pixel against the live site; the breaks found were fixed in the design system and published. A phone pass over the showcase was run first and parked.

## Changes Made

### Files Modified
- `apps/rack` — rebuilt: kol-monitor's rack page alone (59 module types, cables, render loop, sidebar, edit mode), its files copied, control seams on kol-hardware. Entry is a `MemoryRouter` around `rack/Standalone.jsx`, which the showcase's Rack set mounts
- `apps/rack-hub` — new (5196): monitor's shell, Home, Library, Create, Stage and Settings, importing the rack from `apps/rack/src`
- `public/` — monitor's assets (`previews/` · `images/` · `kol-vector/` · `thumbnails/` · `svg/modules` · `svg/patches`), ~11MB
- packages/component — `Dropdown` (list zooms with its trigger · rows wear the trigger's face, text edge and height · the hairline for every tone · `stayOpen` · carries `kol-hw-panel` out of a module), `Input` (desk height inside a module on touch), `ShellSearchOverlay selectLabel`, `MenuDropdownItem rowClass`, `usePopover` `dismiss` as an options object, export map alias for `atoms/RotaryDial`
- packages/theme — the touch rung skips `.kol-hw-panel`; the module plate is the ground for its dropdowns; `.kol-dd-list` inline padding; `--kol-tone-panel-border-w: 0px`
- packages/hardware — `ModuleFrame` carries `kol-hw-panel`; peers on the component and theme of this release
- showcase — `picker = 'multi'` (the axes as one `MultiSelect`) on the Button and Dropdown previews; the Dropdown preview stays open; app list entries for rack and rack-hub
- scripts — `validate:phone` (`validate-gaps.mjs --phone`: sideways scroll, page inset, frames on their neighbours at 390); `validate-render` routes for rack-hub
- `LLM_RULES.md` is the dotfiles symlink now (the old file is `LLM_RULES.local.md`); bulletin posted for the `PageHeader` move
- docs — apps-tier rows, the three changelogs, shipped packages

### Features Added/Removed
- Published: theme 0.164.0 · component 0.238.0 · hardware 0.4.1
- Quarantined to `_tmp/2026-10-02-rack-testbed/`: the hand-drawn rack test bed, the 13-module port, two monitor files nothing imports (`ModuleHeader` seam, `LibrarySearchOverlay`), every comparison script and screenshot

## Current State

### Working
- 56 of 60 module instances pixel-identical to `monitor.kolkrabbi.io`; the four that differ are explained (Patch ×2 by the button change, Sequencer's random steps, Constant's label drawn small — live draws it oversized)
- Home, Library, Create, Stage: 0% difference at desktop; no console errors on any route of either app
- Touch hold on a knob and on a fader opens `ParamSheet`; trackpad pinch zooms about the cursor
- All 32 default gates clean; the render gate was run over every app before the publish

### Known Issues
- The phone pass is parked, nothing fixed: `plan-2026-10-02-mobile-pass.md` (crawl findings + his nine points, each waiting on an answer)
- `/apps/mixer` and `/apps/panels` still look wrong — `backlog/2026-10-02-rack-and-mixer-apps-fail.md`. Mixer starts from kol-mirror; do not propose it until he says monitor is done
- What the bump visibly changes (shortcuts sheet redesign, phone filter-bar tabs, bigger controls on touch) is listed for his eye in `backlog/2026-10-02-monitor-bump-notes.md` § 4
- Not rehearsed: recording and file export, real iOS Safari
- kol-website found two things, tickets to come from there: kol-markdown 0.1.2 pins kol-search `^0.2.0` (a harmless duplicate), and `PageSection` double-insets inside the workshop shell
- The line under an open dropdown's trigger: he is "not loving" it — open

## Next Steps
1. User pushes kol-ds-ui and dotfiles
2. He bumps kol-monitor and applies `backlog/2026-10-02-monitor-bump-notes.md` § 1 (the `PageHeader` import is the hard break)
3. Then mixer, on his word
