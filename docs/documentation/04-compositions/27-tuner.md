---
title: Tuner
type: reference
status: active
created: 2026-11-18
updated: 2026-11-19
verified: 2026-11-19
description: The form tuner engine and its app
aliases:
  - tuner
  - kol-tuner
  - form tuner
  - logo shapes
sources:
  - packages/tuner/src/index.js
  - packages/tuner/test/run.mjs
  - packages/component/src/organisms/LogoSystem.jsx
  - packages/component/src/organisms/LogoTuner.jsx
  - packages/tuner/src/specs.js
  - packages/design-editor/src/editor/kolbox/editor/tune/TunePanel.jsx
  - packages/design-editor/src/editor/kolbox/ui/RailTweaks.jsx
  - apps/tuner/src/App.jsx
tags:
  - domain/compositions
  - audience/agency-internal
related:
  - "[[INDEX|Compositions]]"
  - "[[../00-overview/01-package-topology|Package topology]]"
---

# Tuner

One engine builds a mark from a few measures and rebuilds a dropped logo from circles and lines on one ladder; one app puts both on a page. It is the structure half of kol-branding's Line Swell canvas (spec: kol-branding `docs/documentation/05-logo-shapes/`), carried verbatim as ES modules. The line effects (Swell, Warp, Radial and the rest) are not here: they are the editor's generator styles.

| Part | Package | What it is |
|---|---|---|
| `harmonies` · `HARMONY` · `divisions` · `systemGrow` | `@kolkrabbi/kol-tuner` | the ratios and scales every measure grows by (`harmonies.js`) |
| `grid` · `gridScore` · `keylines` | `@kolkrabbi/kol-tuner` | guides shared by both tools (`guides.js`); `keylines` is geometry only, an app draws kol-component's `KeylineGuide` |
| `construct` · `constructSeeds` · `recipeNum` | `@kolkrabbi/kol-tuner` | shapes on a harmonic grid and the recipe language System writes in (`construct.js`) |
| `system` · `systemDrag` · `systemSeeds` · `systemMeasures` | `@kolkrabbi/kol-tuner` | a mark from measures, the value under a dragged handle, the sheet of 24 rolls (`system.js`) |
| `tuner` · `tunerVectors` · `tunerPresets` · `tunerDefaults` | `@kolkrabbi/kol-tuner` | read, fit, tune, round, curve and draw a form (`tuner.js`) |
| `systemSpec` · `systemSeedsSpec` · `tunerSpec` · `tunerAdvancedSpec` · `systemHelp` | `@kolkrabbi/kol-tuner` | each board's own Tweaks panel, its `data-props` copied from the live canvas (`specs.js`, written by `_tmp/2026-11-19-tuner-system/extract-specs.mjs`) |
| `LogoSystem`, `LogoTuner` | `@kolkrabbi/kol-component` | the two boards as organisms: the drawing and the handles, settings in and callbacks out; keylines are `KeylineGuide`, inks are `.kol-logo-*` in kol-theme |
| `RailTweaks`, `TunePanel` | `@kolkrabbi/design-editor` (kolbox) | a spec drawn as kolbox rail sections; System's and Tuner's panels, shared by the editor's Tune mode and `apps/tuner` |
| `apps/tuner` (5220) | app | the board and kolbox's right rail with System and Tuner, the Tune mode's panels |

## The engine

- Settings in, SVG path strings and labels out, in the canvas's 1200 by 800 board with its origin at the centre. No colour: where the canvas returned ink and ground, the port returns nothing, and `systemSeeds` and `keylines` say `grey` and `light` instead.
- Plain JS, no React. The DOM is touched only where the canvas touched it: a canvas to trace an image or a letter, the document to read an SVG's own curves. System, Construct and the built-in crescent run anywhere.
- `tuner(props, img)` takes an `Image`; an SVG file carries its text as `img.__svg` so its curves are read as vectors.

## The checks

```
pnpm --filter @kolkrabbi/kol-tuner test           # node checks, the parity, and the four Tuner pages in Chrome
node packages/tuner/test/run.mjs --node           # the node half only
```

| Check | Where | Holds |
|---|---|---|
| check-system, check-comb | node | the canvas's two scripts on the port, line for line equal to the reference engine's |
| parity | node | 50 fixed setting sets draw the same strings on the port and the reference |
| tuner-w5, w9, w10, w11 | Chrome (`channel: 'chrome'`) | the canvas's four check pages, run on both engines, results equal line for line (timings aside), then the spec's Measured table read off the port |

The reference engine is `TUNER_REFERENCE` (default kol-branding beside this repo) and the reference marks are `TUNER_REFS` (default `~/Downloads/ref-log`); neither ships.

## The components

| Component | Props in | Callbacks out |
|---|---|---|
| `LogoSystem` | `settings` (the engine's System props), `reference` (`{ src, w, h }`), `peek`; a `palette` (with `ink`, `ground` for custom) draws the canvas's ground and ink | `onDrag(key, value)` on a handle drag, `onDragReset()` on a double-click, `onFile(file)` on a drop |
| `LogoTuner` | `settings` (the engine's Tuner props), `image` (an `Image`; an SVG's text on `image.__svg`), `peek` | `onFile(file)` on a drop or a click to pick |

The settings UI is the host's. In `apps/tuner` and the editor's Tune mode it is `TunePanel`, his boards' panels drawn by `RailTweaks`. `logoInks(settings)` gives a host the same ground and ink.

## The app

`pnpm tuner`: kolbox's look (theme variant kolbox, the kit's `variant="kolbox"`), the board on the left, kolbox's right rail on the right with System and Tuner as tabs. The rails are the editor's Tune mode's, one to one.

| Tab | Board | Rail |
|---|---|---|
| System | `LogoSystem`, `system-01-arcs` at its defaults (ink on paper, the grey form, construction, math, six handles) | `system-01-arcs`: Randomise (random, with his note as help), Measures, Arcs, Parts, Layout, Grid, Show, Color; then the 24 rolls of `system-02-seeds` as pictures, a pick sets random |
| Tuner | `LogoTuner`, `tuner-01-form`: drop or pick a file; the built-in crescent until then | `tuner-01-form`: Start here, Guides; the `advanced` switch draws `tuner-02-advanced`'s every section instead |

A drag moves its measure and is kept, settings stay in the browser. H switches to the form alone and back. The tuning settings the advanced board adds (Follow the form, Ladder, Curves, Corners) stay unset until moved, so the preset governs them, and each shows what is drawn.

## Related

- [[../00-overview/01-package-topology|Package topology]]: the engine tier.
