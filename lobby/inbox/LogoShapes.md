---
component: LogoShapes
source: kol-branding/docs/documentation/05-logo-shapes/_files/canvas/project/line-swell.js
staged: 2026-11-18
status: draft
deps: [IconPlate (KeylineGuide), Slider, SegmentedToggle, Toggle, Select]
---

# LogoShapes

## Purpose
Generators for logo shapes, built and tested on a claude.ai Design canvas ("Line Swell", https://claude.ai/artifact/4Npm9zbKAg753Cz4TMPSKw, private to the user). Asked for as a KOL package: one engine, with System and the Tuner as the first two components and the line effects as a second group.

**The spec is already written. Read it there, not here:**
`kol-branding/docs/documentation/05-logo-shapes/` (overview, line effects, Construct and System, Tuner, process, limits). Every board and all 764 settings are in tables. Reference source and checks: its `_files/` (`canvas/project/line-swell.js` is the engine, about 185 KB, plain JS, no dependencies; `checks/` runs in node and a browser).

## Anatomy
- `engine` (pure functions: settings in, SVG paths and labels out; `window.LineSwell` today)
  - `system(props)` + `systemDrag` + `systemSeeds`: a mark from measures
  - `tuner(props, img)` + `tunerPresets`: a form rebuilt from circles and lines
  - `keylines`, `grid`, `gridScore`, `harmonies`: guides shared by both
  - `warp`, `radial`, `moire`, `pinch`, `flow`, `rotor`, `vortex`, `wave`, `keys`, `master`, `roll`, `sheet`: line effects
- `System` component: svg (grey form, construction lines, six drag handles) + HTML labels + readout
- `Tuner` component: file drop, svg (form, traced line, construction circles, comb, grid, keylines) + HTML labels

## Variants
- System: `join` union or flip. Seeds sheet of 24 rolls.
- Tuner: simple (8 settings: preset, effect, read, view, reset, keylines, grid, comb) and advanced (34 settings). Same engine; on the canvas they are two boards only because its settings panel cannot hide a control. In KOL this is one component with an advanced disclosure.
- Line effects: one component per effect, or one with a `kind`. The DS decides.

## Props
The full tables are in `03-construct-and-system.md` and `04-tuner.md`. The ones that carry meaning:

| prop | type | default | controls |
|------|------|---------|----------|
| System `y`, `x`, `steps`, `harmony`, `circles`, `axisAt`, `footAt`, `footSize` | number / enum | see doc | the measures everything derives from |
| System `join` | `union` / `flip` | `union` | how bands between circle pairs combine |
| Tuner `preset` | custom, faithful, golden, fifth, bold, smooth | custom | a starting point; any setting the user moves wins |
| Tuner `effect` | 0 to 100 | 100 | master: share of all tuning applied |
| Tuner `read` | outline, strokes, auto | outline | read the form as an outline or as lines with a weight |
| Tuner `view` | tuned, fitted, original | tuned | which stage is drawn |
| Tuner `corner`, `cornerSize` | sharp / round, ladder step | sharp, -2 | corners eased by an arc off the same ladder |
| Tuner `curves`, `harmonize`, `drift` | circles / bezier, bool, percent | circles | Bezier with curve harmony and a drift limit |
| `keylines`, `grid`, `comb` | bool / enum / bool | off | guides |

## Styling
- Canvas boards use hardcoded colors; all are to DROP for KOL tokens: ink `#111111`, ground `#f4f4f4`, form grey, traced line red, handles yellow.
- Keylines are KOL's own: `IconPlate.jsx` KeylineGuide (24 units, diagonals `#0A8DA4`, keylines `#CA3ABC` light and `#F2D24B` dark, stroke 0.1, dash 0.4 0.6). Reuse the atom, do not keep the engine's copy.
- Labels are HTML over the svg because the canvas drops svg text. In KOL they can be either; type should be `kol-mono-*`.
- Settings UI on the canvas is its own Tweaks panel. KOL needs real controls.

## States & interactions
- System: six handles drag y, the axis, x, the angle and the foot. H toggles between the full board and the form alone.
- Tuner: drop or pick a file (SVG read as vectors, anything else traced at 2048). H toggle as above. `reset` ignores tuning settings while on; in KOL it should actually reset state. A combination that cannot be drawn keeps the last good form and prints one line.
- Canvas limits to DROP: a drag cannot be saved; a board cannot write its own settings.

## Dependencies
None in the engine (canvas 2D for tracing, DOM for reading SVG paths). Consumer-only helpers to replace: the DC board wrapper (`.dc.html` template and `DCLogic`), the `data-props` settings list, HTML label overlay.

## Recreation notes
- Likely a new package (engine) plus organisms in `packages/component`, not atoms. First: System and Tuner. Second: line effects.
- Port the engine as ES modules, split by tool; keep the checks (`check-system.js`, `check-comb.js`, the `tuner-*.html` pages) as its tests. Measured numbers to hold are in `04-tuner.md` under Measured.
- Known gaps (see `06-limits.md`): the newest Tuner settings (effect, corner, reset, help, presets, strokes, bezier, comb, grid) and file upload were only run on a local test page, never used on the live canvas. Round joins in stroke reading are not detected. A thin-line mark read as outline fits badly; read it as strokes.
- Parked, waiting on the user's ruling: handle balance (Tunni), snapping a form to a grid, the relief effect.
