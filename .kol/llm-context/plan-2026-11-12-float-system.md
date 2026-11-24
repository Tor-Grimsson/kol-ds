# Plan — the float system: one spec, tokens, a gate

**Raised:** 2026-11-12, the user reviewing Float labs in `◇ float--kol-ds-ui` and the library. Points verbatim:
- P1 *"dropdown float icon is 18px"* (library 1492:13560, float / sm, 28 tall)
- P2 *"dropdown list cant be like this … figma does it with caps in layers or it dosnt highlight selected, only hover"*
- P3 *"if layer panel uses 12 chevron shouldnt dropdown small also? … this is very big difference no?"*
- P4 *"whats going on here in 'PropertyRail'?"* (the Lights / Point editor row: values wrap, the row breaks)
- P5 *"is this not a labelled control? does float not use labelled controls? nothing in PropertyRail is a component labelledcontrol?? AND THE SLIDER IS BROKEN … SOME IDIOT tried to put label on the slider instead of using a fucking LABELEDCONTROL"*
- P6 *"WHAT CONTROLS THE WIDTH of regular and compact??? where do the numbers come from??? 352 and 272??"*
- P7 *"why is input fixed width? 115, but only sometimes?"*
- P8 *"3 properties have 2 options USE FUCKING TOGGLE WHEN option is BINARY"*
- P9 *"why arent all rails in the same shell? also the floating nav?? because it should ALSO have a collapsed state, not just collapsed rail, but collapsed in the same way right rail collapses."*
- P10 *"WHERE THE FUCK IS THE SYSTEM!"*

**Status:** W1–W4 BUILT in code 2026-11-12; W5.1 masters BUILT in the library 2026-11-12, waiting on his publish for the Float labs re-measure. His go: "Go, spec first". W1 built 2026-11-12. W2 built in code 2026-11-12. W3 built 2026-11-12.
**Shape:** W › phase › list.
**Laws carried:** docs define, code is state (documentation INDEX); sizes come from `09-sizes` and `glyphLadders.js`, never a call site; Tailwind first, new CSS only for tokens; no borders; `variant` is the only word; family-prefix naming; every code look change lands in the Figma library the same turn; a set means every member; one Figma agent at a time; nothing deleted (`_tmp/`, `_trash` with `_`).
**How a phase closes:** measurable acceptance line first, gates green, then Playwright against his own words; the Figma master measured against the live render.

## Why it keeps drifting (one line each)

- Float sizes are split: heights, type and one glyph size are tokens in kol-theme; chevron sizes, rail widths, label columns, input widths and list states are literals in each component (`size={12}`, `w-[110px]`, `w-[64px]`, `width = 272`, `352`, `W = 384`).
- Three files each draw their own label and control row: PropertyRail `Row`, GeneratorRail `RailControl`, and Labs through `float/controls.jsx`. Slider float carries its own label head.
- Nothing checks a float component against the spec, and the Figma masters are drawn from whichever literal the code had that day.

## W1 — The float spec (P10, P6, P1, P3) — BUILT 2026-11-12 (kol-theme 0.218.0)

### 1.1 — One spec doc
- `docs/documentation/04-compositions/25-float-spec.md` (reference archetype, lookup-first): control heights, type, glyph and chevron size per control size, the module (rail) widths, the label column, row height and gaps, list row states, clip and shadow, the folded pill. Each row names its token.
- The existing `24-float-system.md` links to it and keeps the family inventory only.
- Acceptance: every number a float component uses appears in the doc exactly once, with a token name; `validate-headings`, `vault-links` and `no-middots` pass.

### 1.2 — Tokens in kol-theme
- New `--kol-float-*` tokens for what is a literal today: chevron and glyph per size (sm · md · lg), the module widths (the rail-width set), the label column, the folded pill height, list row hover and selected.
- Module widths, decided for his review: `--kol-float-module-w` 272 (the inspector), `--kol-float-module-w-wide` 352 (a tool Rail whose rows carry two controls), nothing else. GeneratorRail's 384 moves to wide.
- Chevron per size, decided for his review: sm 12, md 12, lg 16, matching the layer rows (P3). The adjacent glyph follows `glyphLadders.js`.
- Acceptance: `grep` finds 0 pixel literals for these in float components (W1.3's gate is the check); kol-theme publishes.

### 1.3 — The gate
- `scripts/validate-float.mjs` (`pnpm validate:float`, in `validate-all`): fails a float component (anything rendering `variant="float"` chrome or a `kol-float-*` class in kol-component, kol-shell, kol-dashboards, design-editor `float/` and `generate/`) that hard-codes a width, a glyph size or a label column the spec names, or draws a label beside a control without `LabeledControl`.
- Acceptance: the gate fails on today's tree (list the hits), and passes after W2 and W3.

## W2 — One row, one control (P5, P4, P7, P8) — BUILT in code 2026-11-12 (kol-theme 0.219.0 · kol-component 0.363.0 · kol-shell 0.121.0 · design-editor 0.38.0); the Figma lines are W5's

### 2.1 — Every row is LabeledControl
- PropertyRail `Row` (`labeled`, `select`, `slider`, `switch`), GeneratorRail `RailControl` and the Lights rows render `LabeledControl variant="float" inline` around a bare control. The label column is the token.
- Slider float loses its label head: track and thumb only, at the control height; its readout is the caller's number box. A `label` passed to Slider float is drawn by LabeledControl.
- Acceptance: in the built Labs and Generate rails, every label node is inside a LabeledControl (script: 0 labels outside); every Slider float is 28 tall with its track on the row's centre line (±1).

### 2.2 — Inputs fill, nothing wraps
- No fixed input widths: an input fills its cell, a number box takes the `ch` width of its value. The Lights row (X, Y, Radius, Intensity) fits the wide module without a wrapped value.
- Acceptance: 0 two-line values in any rail at 272 and at 352 (script reads each input's height = control height); Figma Input masters are Fill, 0 fixed 115.

### 2.3 — Binary is a toggle
- Every two-state choice is a ToggleSwitch: Labs' Invert and Background (and any other Off/On pair in the param schemas), the generator rows. A pair whose two states are named things (Clip / Visible) stays a choice.
- Figma: every two-value variant property that is on or off becomes a boolean property (PropertyRail `state` → `folded`, `density` → `compact`, and the rest found by the audit).
- Acceptance: 0 Off/On TabsRow or ButtonGroup pairs in the rails; 0 two-value on/off variant properties on float masters.

## W3 — Dropdown (P1, P2, P3) — BUILT 2026-11-12 (kol-theme 0.220.0 · kol-component 0.364.0 · kol-shell 0.122.0 · kol-dashboards 0.16.0 · design-editor 0.39.0)

### 3.1 — Chevron and list states
- The float Dropdown trigger's chevron reads the token for its size (12 at sm).
- The list: hover is the only fill; the selected row carries its dot and no fill. Keyboard focus uses the hover fill.
- Acceptance: at sm the chevron box is 12; with the list open and the pointer on a second row, exactly 1 row has a fill (script).

## W4 — One module shell (P9) — BUILT 2026-11-12 (kol-component 0.365.0 · kol-shell 0.123.0 · design-editor 0.40.0; FloatModule in kol-component, re-exported by kol-shell)

### 4.1 — FloatModule
- The shell PropertyRail grew today (header with title, fold, actions; body slot; footer slot; folded pill) is extracted as `FloatModule` in kol-shell. PropertyRail, NavRail float and ReadingContents render inside it.
- NavRail float gets the same folded pill (title and chevron), separate from its 72 collapse and its hide.
- Acceptance: PropertyRail, NavRail float and ReadingContents each mount exactly 1 FloatModule; each folds to a pill of the token height; Labs shows both rails folding.

## W5 — Figma follows

### 5.1 — Masters on the tokens — BUILT in the library 2026-11-12 (unpublished; the Float labs re-measure waits on his publish)
- The library's float masters (Dropdown, Slider, Input, LabeledControl, PropertyRail, NavRail float, FloatModule, TreeRow) are rebuilt on the spec: sizes bound to variables named after the tokens, rows as LabeledControl instances, booleans for binary properties.
- The Float labs page is re-measured against live.
- Acceptance: each master within 1px of its live render; audit 0 errors, 0 unlinked; 0 fixed-width inputs; the held folded pills swapped to the folded state.

## Order

W1 → W2 → W3 → W4 in code, publishing after each W; then W5 in Figma in one pass, then his library publish.
