# Session: Deconstruction — the editor seam, apps/editor, apps/controls

**Date:** 2026-09-27
**Agent:** kol-ds-ui (Claude Opus 5.5), MBP
**Summary:** The deconstruction roadmap was written, and phases 1–5 were run as one goal. The design editor now has a core and three layer packs behind a seam. apps/editor and apps/controls are the review sites.

## Changes Made

- **Plan:** `plan-2026-09-27-deconstruction-roadmap.md`: tracks 1–6, the coupling map, the action list, the done notes and deviations.
- **design-editor 0.14.0 (published):**
  - `editor/packs.js` (the seam) and `src/packs/{generators,effects,motion,index}.js`.
  - `core.jsx` is the new `/core` entry; `index.jsx` = core + packs + the labs/mobile chromes.
  - A multi-entry lib build, with subpath exports for `/core`, `/generators`, `/effects`, `/motion`.
  - `LoopFields` moved out of ParametersPanel verbatim. `kinetic/morph.js` → `editor/modes/type/morph.js`.
  - The `mediaClient` and `settingsStore` props.
  - `scripts/check-core.mjs` (`pnpm check:core`).
- **media-fixture:** the fake D1 gained `tool_settings (tool, json)`, with the client verbs `loadToolSettings` / `saveToolSettings`. The fixture test is extended.
- **apps/editor (:5180):** the editor from source through a Vite alias. `/core` mounts the core entry.
- **apps/controls (:5181):** three pages (Parametric · App controls · Compositions). Each specimen lists where the same thing is still hand-built.
- Root scripts, the build chain, vercel rewrites, showcase Apps rows and the 07-apps-tier INDEX rows cover both apps.
- **`public/fonts/TG/`:** the package's kinetic fonts, copied from kol-fxr (188K).

## Current State

### Working
- The core's import graph reaches no pack. Its static JS is 1.2 MB against 2.2 MB full.
- The full editor is unchanged, checked live: all 7 types, loop + picker + params, the Effects tab, the dither chain, kinetic, draft restore, SVG export.
- `/core`: 4 types, no Generative or Effects menus, 0 pack modules loaded, pack layers inert.
- 28 gates clean; the root deploy build is clean.

### Known Issues
- kol-controls `JackSocket` defaults to `labelSize='xxs'`, which names the retired `kol-helper-xxs`, so bare jack labels render unsized (monitor too). Not fixed.
- design-editor keeps its own LayerStack · TimelineDock · CurveEditor · KeyframeEditor · ToolPalette · InspectorRail beside kol-component's.
- The editor's labs/randomiser menu entries navigate to routes apps/editor does not mount.

## Next Steps
1. The DS-vs-inline audit of the editor. The user's review findings are logged at `backlog/2026-09-27-editor-review-findings.md` (13 items); the audit goes first.
2. The §3 ruling on module frames (apps/controls).
3. The labs and randomiser apps, and the curve generator (plan tracks 1 and 3).
