# Playbook — Mixer bug round and Studio B

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** the bug round on `apps/mixer` + `apps/mixer-hub` (plan `plan-2026-10-03-mixer-and-mixer-hub.md` § F), then his idea as a second tab — Studio B. Goal file: `.active-goal-05e84691-….md` (T1–T13).

**Standing rules (non-negotiable):**
- kol-mirror is a clone: never edited, and not told anything yet (his word, 2026-10-03).
- No publish, no git. Never delete — quarantine to `_tmp/`.
- Today's studio layout stays untouched as A; Studio B is a separate tab.
- Look before building: map to what ships (monitor's `StageDock` / `StageBezel`, kol-hardware frames) first.

---
## Entries

[17:56 GMT · 2026-10-03] · setup · playbook created
  what → initialised the live playbook   why → /kol-goal + /playbook, "do everything in one go"
  rulings → 1 icons to oq · 2 follow monitor (masthead "Library / Modules and patches") · 3 mirror's patch.png its own filename · 4 /media rewrite · 5 dials onto ./signal · 6 hand-built controls onto the DS · 7 Icons onto ContentFilters, Tape left · 8 ModulePalette's search chrome to _tmp · 9 mirror is told nothing yet
  already built before go → F1 viewframe: desk box capped at half the window less its chrome (`SymphonyMixer.jsx`), monitor slides left to clear the deck (`SymphonyViewport.jsx`); 1600×1000 frame 509×380, was 152×179; 3333×2025 unchanged; render gate ✓ mixer + mixer-hub
  already built before go → F2 icon ink: 26 sites `text-fg-NN` → `text-oq-NN`, same stop, hover variants too; `validate:icon-ink` ✓
  found → kol-theme ships no `hover:text-oq-*` (the file's header promises "+ hover", only bg has it); nine swapped wrappers have no hover colour until T1

[18:10 GMT · 2026-10-03] · T1 theme hover · packages/theme/kol-opaque.css · CHANGELOG (Unreleased)
  what → `hover:text-oq-*` + `-inverse`, fifteen stops each, mirroring `kol-opacity.css`'s text-hover block
  verify → hub Create "Rename mixer" button: rest oq-48 → hover oq-96 in the browser ✓ · icon-ink ✓

[18:10 GMT · 2026-10-03] · T2 masthead · apps/mixer-hub/src/components/CatalogLibrary.jsx · pages/MixerPage.jsx
  what → `useCatalogLibrary` takes `subtitle`; the Mixer page passes monitor's "Modules and patches"; Library keeps its own
  found → monitor has no separate module sheet: Modules · Patches are views of its Library page ("Library / Modules and patches"). Mirror's two pages are his 2026-09-02 split — not undone.
  verify → #/mixer h1 "Library" + "Modules and patches" ✓ · #/library unchanged ✓

[18:10 GMT · 2026-10-03] · T3 patch.png · public/previews/modules/mixer-patch.png · apps/mixer/src/data/moduleRegistry.js
  what → mirror's image copied in under its own name; the desk's patch module points at it; monitor's `patch.png` untouched
  verify → the Mixer sheet's Patch card loads `mixer-patch.png` (560 wide) ✓

[18:10 GMT · 2026-10-03] · T4 /media · vercel.json · apps/mixer + mixer-hub vite.config.js (comment)
  what → mirror's own rewrite, verbatim: `/media/(.*)` → `https://r2.kolkrabbi.io/$1`, ahead of the catch-all
  verify → dev proxy: listing 200 (433 objects), `/media/01.jpg` 200, canvas read-back clean ✓ · the rewrite itself needs a deploy to prove

[18:10 GMT · 2026-10-03] · T5 icons page · apps/mixer-hub/src/pages/IconsPage.jsx
  what → own search field + group chips → `ContentFilters` ("All Icons", one Groups chip group, search on name); tiles kept
  ▣ → the page as it stood: `_tmp/2026-10-03-icons-page-own-chrome/`
  note → Tape left as is: its Run chip is text, it draws no icon — nothing for the signal set
  verify → 337 tiles · search "arrow" → 11 · console clean ✓

[18:10 GMT · 2026-10-03] · T6 ModulePalette · apps/mixer/src/components/mirror/ModulePalette.jsx
  what → the ⌘K search half cut; the E shelf stays
  ▣ → the file as it stood: `_tmp/2026-10-03-module-palette-search/`
  verify → E opens the shelf ✓ · ⌘K opens the search modal ✓

[18:10 GMT · 2026-10-03] · T7 F9 sheet · apps/mixer/src/Standalone.jsx
  what → the standalone sheet drops the rail's two rows (`rail`, `nav`); the hub's sheet keeps them
  verify → S in apps/mixer: no "Show / hide rail", no "Jump to rail item" ✓

[18:10 GMT · 2026-10-03] · T8 F6 list row · packages/component/src/molecules/ContentText.jsx · CHANGELOG (Unreleased)
  what → catalog row: title and detail both one line; new `lead` line — the title keeps its width, the detail takes the rest and truncates
  why → the row is a fixed 36px rung and neither slot truncated: a long detail wrapped the title to three lines
  verify → hub Create › Modules list: 40 rows, every one 36px ✓ · "Slit-Scan Camera" on one line ✓

[18:10 GMT · 2026-10-03] · T9 F12 chips · packages/component/src/organisms/ContentFilters.jsx · CHANGELOG (Unreleased)
  found → real: "Displacement" picked in Variants left Effects with 0 cards and "(1) filter active"
  what → only chips the current `filterGroups` offer apply (`liveFilters`); the stored set is untouched, so the chip returns with its view
  verify → variants 23 → +chip 8 → effects 10 → back on variants 8, chip still on ✓
  not checked → recording and export · real iOS Safari

[18:10 GMT · 2026-10-03] · T10 Studio B · apps/mixer/src/{hooks/useFloating.js, components/mirror/FloatingFrame.jsx, components/mirror/SymphonyViewport.jsx, components/mirror/MirrorViewport.jsx, pages/MirrorPlayground.jsx, components/hall-of-mirrors/SymphonyMixer.jsx} · apps/mixer-hub/src/App.jsx
  what → `arrangement="float"`: the desk fills the view (`fill`), the monitor is a window (`FloatingFrame` on monitor's `useFloating`, copied) — drag by the body, corner grip scales, V or `[Frame]` hides; the deck is a desk module ("Tape"); second rail tab "Studio B" at #/studio-b
  kept → A's tree: `Stage` is `InfiniteCanvas` with the same props when not floating; nothing renders differently there
  ponytail → `useFloating` is a second copy (lift to a package if B is kept) · Screen 2 is not drawn in B · the window's place is not remembered across reloads
  B only → the wire-diagram row is patch-mode only (no reserved 80px) · no height grab on the rule
  verify → 1600×1000: window 488×368 bottom-right, drag → moved, grip → 712×494, V → opacity 0 and "[No frame]", V → back · console clean ✓ · Studio A measures as before (bezel 509×380, deck whole) ✓

[18:28 GMT · 2026-10-03] · T11 ruling 5 · apps/mixer/src/hooks/useExpressionValue.js · apps/mixer/package.json (+ kol-hardware, lockfile)
  what → `compile` is kol-hardware `./signal`'s `compileExpression`; same shape, `fn` or null
  ▣ → the hook's own helpers: `_tmp/2026-10-03-mixer-expression-compiler/`
  verify → 46 expression strings in both apps: 42 identical at min 0, 0 differ, 0 refused, 2 random, 2 not expressions ✓ · typed `wave(t*4)` runs with the transport ✓
  differs → helpers span [min, max]: `wave(t)` on TEMPO floors at 10, was 0

[18:28 GMT · 2026-10-03] · T12 ruling 6 · apps/mixer/src/components/{hall-of-mirrors/RotaryDial.jsx, atoms/QuantityInput.jsx, atoms/ColorPicker.jsx} · src/index.css (controls pack)
  what → RotaryDial = adapter over `Knob variant="panel"` (box kept 64 · 40 · 104, knob lg · md/lg · xl), expression box + modulation menu stay · QuantityInput = adapter over `Stepper` with its own draft · ColorPicker's chip = `ColorSwatch`
  found → two pairings in the plan were names, not twins: the DS `QuantityInput` is a display-only picker (the twin is `Stepper`); `ChannelStrip` is the channel card's frame, not `ChannelMaster`'s
  not swapped → `ChannelMaster`: no shipped twin for a full-height fader with a scale; nothing ships for the RGBA popover either
  ▣ → the three originals: `_tmp/2026-10-03-mixer-own-controls/`
  verify → dial 30% → drag 60% → expression ✓ · Resolution field: "5" accepted, 500 commits, 7 clamps to 100, bump 101 ✓ · colour popover opens ✓ · desk height unchanged (669) so no module reflowed ✓

[18:28 GMT · 2026-10-03] · found · apps/mixer/src/pages/MirrorPlayground.jsx
  what → `placeUnit: () => {}` on the studio's palette api
  why → an FX unit or a one-per-desk module picked from ⌘K or the shelf threw "api.placeUnit is not a function" — Create's verb, never on this api
  open → what an FX pick should do in the studio is his

[18:28 GMT · 2026-10-03] · T13 close
  verify → `pnpm validate` 31 of 32 (`retirements` 2, not this work) · `validate:render` mixer + mixer-hub ✓ (24 page views, Studio B added to its routes) · both apps build ✓ · showcase Mixer set ✓ (read off his running showcase)
  state → nothing published; kol-theme and kol-component carry Unreleased entries; no server of mine left running (5295 · 5297 closed)
  not checked → recording and export (scripted twice, no take reached) · real iOS Safari
  waiting on the user → his eye on A against B, on the panel knobs, and on the FX-pick question

[18:36 GMT · 2026-10-03] · FX pick · apps/mixer/src/pages/MirrorPlayground.jsx
  ruling → "picking an fx should load in the effects from the effects page? right?"
  what → `placeUnit('fx:<id>')` appends the effect to the target channel's chain (`appendFx`, lifted out of the api so `addCanvasFx` and `placeUnit` share it), capped at MAX_CANVAS_FX; a one-per-desk module pick still does nothing
  verify → ⌘K "posterize" → channel 1 on, chain [posterize] · "dither" → [posterize, dither] · "routing" → unchanged, no throw · console clean ✓ (`_tmp/2026-10-03-mixer-testbed/fx-pick.mjs`)
  note → the chain is only drawn in the master's IN panel for a channel patched into the master; an unpatched channel shows the pick as its power dot coming on

[18:49 GMT · 2026-10-03] · FX module · apps/mixer/src/{hooks/patchGraph.js (+ patchGraph.test.mjs), hooks/useMirrorState.js, hooks/useFrameBuffer.js, components/mirror/SymphonyViewport.jsx, components/hall-of-mirrors/{SymphonyMixer,PatchCableOverlay,ChannelPatchPanel,MasterModule}.jsx, components/hall-of-mirrors/modules/FxModule.jsx, pages/MirrorPlayground.jsx} · apps/mixer-hub ModuleFront import
  ruling → "no it should go into a independednt fx module with inputs and outputs" · "no preconfigured paths ever. just load the fx. the whole point is to patch yourself … think about a physical mixer, does it ever do anything on auto"
  ⤺ → the chain-append from the entry above: `placeUnit` no longer touches a channel; `addCanvasFx` is back as it was
  what → an FX pick adds one module to `symphonyFxModules` with `input: null`; the panel is `FxModule` (moved hub → tool) with real `Jack`s on its face; `processFxModules` runs each module on whatever its IN is cabled to and holds the frame under `fxm:<id>` beside the bus buffers; master IN, matrix IN and channel IN take a module's OUT; cables drawn by the overlay
  rule → a channel cabled only into a module renders hidden — in the mix when it is in a master slot, not before
  verify → pick: module ←∅, channels off, master [∅,∅,∅] ✓ · CH 1 OUT → FX IN, FX OUT → MASTER IN 1 by hand: posterized frame on the monitor, 2 cables ✓ · a module's OUT into its own IN ✓ · remove: its master slot clears, the other module keeps its loop ✓ · console clean · `patchGraph.test.mjs` ✓ · validate 31 of 32 (retirements) · render gate ✓
  ponytail → not in undo or patch files · full level in a master slot · Screen 2 and the patch table do not carry module cables
  memory → no-preconfigured-signal-paths
