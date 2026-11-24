---
component: LogoShapesReorganized
source: kol-branding/docs/documentation/05-logo-shapes/_files/canvas-organized/project/line-swell.js
staged: 2026-11-21
status: draft
deps: [IconPlate (KeylineGuide), Slider, SegmentedToggle, Toggle, Select]
---

# LogoShapesReorganized

## Purpose
A second, cleaner version of the logo shape generators filed on 2026-11-18 as [LogoShapes](LogoShapes.md). That ticket is still open and unread; this one does not replace it. It is here so the design system can diff the two and build from whichever is better. The user's own words: "we lobbied this artifact to DS but I didn't realise how repetitive it was, now we have isolated the effects ... re ticket DS so they can diff it and maybe it's a better version."

The canvas is a reorganized copy, "Line Swell organized", https://claude.ai/artifact/A7rTvoHJNvi9DrCEevJeBt (private to the user). The original canvas of the first ticket is untouched.

**Read these, not this file, for detail:**
- `kol-branding/docs/documentation/05-logo-shapes/07-controls-audit.md`: every control on every master, measured, with what was fixed.
- `kol-branding/docs/documentation/05-logo-shapes/_files/canvas-organized/project/`: the source as of 2026-11-21 (`line-swell.js`, `wave-organism.js`, one `.dc.html` per board, `canvas.json`). Diff `line-swell.js` against `_files/canvas/project/line-swell.js` of the first ticket.
- `kol-branding/.kol/llm-plan/21-` to `24-`: what was asked and what was built, in order.

## What changed against LogoShapes

| | First ticket | This version |
|---|---|---|
| Structure | 9 pages, effects spread and repeated; one catch-all "master" board that did every preset | 7 pages, one master per effect, one sheet under each master |
| A master | varied in size and controls | every master 1200 × 800; every sheet 2000 × 2404, 4 tiles across |
| Sheet tile to board | read the caption, type the values | a `variant` number loads the tile |
| Controls | 764 settings, five boards carrying the same 61 | audited: 881 measured, then cut and renamed; the five heavy masters now 38 and 32 |
| Construct | a page of its own | dropped by the user |
| Tuner | simple board and advanced board | one board (the advanced one); the simple one retired |
| New | | gradient master, SVG library dropdown, saved slots, export frame |

## Anatomy
- `engine` (`line-swell.js`, `window.LineSwell`): pure functions, settings in, one SVG path out.
  - Swell family: `vals(props, name)` for sun, blinds, steps, keys, hex, ridge, glyph, pulse and the three image effects; `master(props)` for telescope, taper, dash and the two piano effects.
  - Line family: `warp`, `radial`, `moire`, `pinch`, `flow`, `rotor`, `vortex`.
  - `system`, `tuner`: as in the first ticket.
  - `gradient(props)`: any swell effect with a linear ramp from the plain filled shape to the full effect.
  - `sheet(kind)`: the tiles for one effect. `exportMark(opts)`: a mark framed at a ratio, as one SVG string.
- `wave-organism.js` (`window.WaveOrganism`): `body`, `needles`: the two oscillator shapes, by loop position.
- Per effect on the canvas: one master board and one sheet board. In KOL this is one component per effect plus a shared "variations" view, or one component with a `kind`. The DS decides.

## Variants
The effects, by page:
- gen: piano-shape-half, piano-shape, sun, blinds, steps, keys, hex, ridge, glyph, pulse, telescope, taper, dash.
- img: upload (lines), relief, inverted. Source is an image or a library mark.
- line: warp, radial, moire, pinch, flow, rotor, vortex.
- osc: band, capsules. They move; a `frame` value holds a moment.
- tune: System, Tuner.
- gradient: one board over the 13 gen effects.
- export: one frame over 23 of the masters.

## Props
The full, measured list per effect is the audit doc's last section. The shape that should carry over:

| prop | type | controls |
|---|---|---|
| effect settings | per effect | see audit; each is alive, or conditional with its condition written down |
| `variant` | int | 0 is the settings as given; 1..n a generated variation; after that the reference marks; after that saved slots |
| `library` | name or none | on effects that take an image: one of 151 marks as the source |
| `gradientAngle`, `start`, `end` | number | the gradient's direction and two stops |
| `master`, `variant`, `ratio`, `fit`, `foreground`, `surface`, `transparent` | export frame | which mark, the frame's shape (9 ratios, short side 1080), how much it fills, the two colors |

## Styling
Nothing here uses KOL tokens. Canvas colors are fixed values: ink `#1e1e1e` on ground `#fafafa` on the gen page; sheets `#121215` with `#c8c8cc` captions in JetBrains Mono 13/18; handles `#f5c400`. All of it is to be replaced with KOL tokens and type classes on recreation.

## States & interactions
- Drag handles: the solid cut on piano-shape-half, the poles on pinch, the two gradient stops, System's six points. A drag is not written back to the controls on the canvas; in KOL it should be.
- Tuner: `constructionAmount` 0 to 1 removes the working marks in steps (all, no measures, no circles, outline only, form alone).
- Copy SVG on the export frame.

## Dependencies
None from KOL yet. The engine needs a canvas 2D context for the shape field and DOM path measuring for the Tuner's SVG reader.

## Recreation notes
**Canvas workarounds. Do not copy these:**
- Switches used as buttons (`newSlot`, `removeSlot`): the canvas's settings panel has no button. In KOL, real buttons.
- `SHEET_BASE`, `LINE_SCHEMA`, `GRAD_SAVED`, `OSC` inside the engine: copies of what each board had saved, because a sheet cannot read its board. In KOL the sheet takes the component's own state.
- `localStorage` under `lineswell:` for saved slots and the export frame's live link: boards are separate frames. In KOL, ordinary state or the app's store.
- `alias()` and the old control names it maps: only there so slots saved before a rename keep loading.
- Copy and paste export: the canvas forbids downloads from a board. In KOL, a real SVG and PNG download.
- Controls that cannot be greyed out, so they were removed or left conditional. In KOL, disable them.

**Two open design calls the user left to judgment ("do whatever"), recommended for the KOL build and not done on the canvas:**
- One model for settings. Today eight gen effects take direct values (`thin` 0 to 1) and five take offsets from a hidden preset (`thin` -1 to 1). Build all on direct values; then `angle`, `count`, `thin`, `thick`, `transition`, `overhang`, `levels` and `pattern` can share one range each.
- One way to set color: a palette list with a custom choice, the same on every effect. The canvas has three.

**Known limits, from the audit:** `motionAmount` runs -360 to 360 whatever it moves; nine wave controls needed two other controls set before they did anything (removed with the wave source from the gen effects); the Tuner's SVG reader samples each part of a multi-part path alone, sharing 8000 points between the parts.

**Not verified:** most checks ran by script against the canvas's files, not on the canvas. Seen on the canvas itself: the gen page layout, the export frame, and the export frame following a master live.
