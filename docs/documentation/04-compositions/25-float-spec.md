---
title: Float spec
type: reference
status: active
created: 2026-11-12
updated: 2026-11-12
verified: 2026-11-12
description: Every float size with its token
aliases:
  - float spec
  - float sizes
  - float module
covers:
  - control heights, type, glyph and chevron per size
  - the module (float Rail) widths, rows, label column and collapsed-v pill
  - the float list's row and its states
  - clip and shadow
sources:
  - packages/theme/kol-design-tokens.css
  - packages/theme/kol-components-molecules.css
  - packages/theme/kol-components-atoms.css
  - packages/component/src/hooks/glyphLadders.js
  - packages/component/src/molecules/RailFloat.jsx
  - packages/component/src/molecules/Header.jsx
  - scripts/validate-float.mjs
  - .kol/llm-context/plan-2026-11-12-float-system.md
tags:
  - domain/compositions
  - domain/tokens
related:
  - "[[24-float-system|float system]]"
  - "[[../01-foundations/09-sizes|sizes]]"
  - "[[../01-foundations/01-tokens|tokens]]"
---

# Float spec

The float look's numbers, each once, each with its token. A float component reads the token; it never types the
number. `pnpm validate:float` fails a float component that hard-codes a module width, a label column, a chevron size
or a fixed input width, or that draws a label beside a control without `LabeledControl`. Touch values (in brackets)
apply on a coarse pointer. The family inventory, foundations and motion are in [[24-float-system|the float system]].

## Controls

| What | sm | md | lg | Token |
|---|---|---|---|---|
| Height (a pill) | 28 (36) | 36 (44) | 44 (52) | `--kol-float-h-{sm,md,lg}` |
| Type, Inter 500 | 12 (13) | 13 (15) | 14 (16) | `--kol-float-t-{sm,md,lg}` |
| Side padding | spacing-3 (spacing-4) | spacing-4 (spacing-5) | spacing-5 (spacing-6) | `--kol-float-px-{sm,md,lg}` |
| Adjacent glyph | 14 (16) | 16 (18) | 18 (20) | `--kol-float-ic-{sm,md,lg}`, the `ADJACENT` ladder of `glyphLadders.js` |
| Chevron | 12 (14) | 12 (14) | 16 | `--kol-float-chev-{sm,md,lg}` |
| A float button's glyph | 18 (20) at every size | | | `--kol-float-ic` |
| Focus | a 2px ring of the ink | | | `--kol-float-focus` |
| Tooltip, an inverted pill | 24 (28) tall, type 11 (12) | | | `--kol-float-tip-h`, `--kol-float-tip-t` |

**Decided for his review:** the chevron is the layer rows' at sm and md and one step up at lg (P3). An indicator never
takes the glyph token: a dropdown's caret reads `--kol-float-chev-*` for the trigger's size.

The float Slider is track and thumb only, standing at the sm height: its track is `--kol-track-h` on
`.kol-slider-float` (3), its thumb 12. Its name is a `LabeledControl`'s label, its value the caller's number box.

## Module

A module is a float Rail: PropertyRail and NavRail float each draw one `RailFloat`, and the reader's Contents is a
`RailFloat` with `ReadingContents` in its body. The module is three slots: the header (a `Header` by default),
the body and the footer, which renders only when given. Collapsed-v is the same module with its body and footer hidden.

| What | Value | Token |
|---|---|---|
| Width, the default Rail (NavRail float expanded, PropertyRail, ReadingContents, the inspector slot) | 264 | `--kol-float-module-w` |
| Width, the wide Rail (Labs params, the generator Rails) | 360 | `--kol-float-module-w-wide` |
| Inset | 16 | `--kol-spacing-4` |
| Radius | 20 (24) | `--kol-float-menu-r` |
| Header | `Header` (property; nav for NavRail float): the title in `kol-float-panel`; expand, collapse-h and collapse-v as sm ghost buttons, 4 apart, 8 off the title | `--kol-float-h-sm` |
| Collapse-v chevron, the nav ⌄ | 12 (14), the chevron token, never the button's 18 glyph | `--kol-float-chev-sm` |
| Between rows, regular | 18 | `--kol-float-module-gap` |
| Between rows, compact | 8 | `--kol-spacing-2` |
| Before a section, compact | 16 | `--kol-spacing-4` |
| Row height | the sm height | `--kol-float-h-sm` |
| Label column (`LabeledControl variant="float" horizontal`) | 110 | `--kol-float-label-w` |
| Label to control | 8 | `--kol-float-label-gap` |
| Label type | `kol-float-hint` at fg-64, as written, no uppercase | the float hint role |
| A label over or beside a control | always `LabeledControl` (float; `settings` in the settings window), never a span beside the control; a slider's value is a number box, never raw text (plan-2026-11-12-float-rails-figma W12.1, W13.1) | `LabeledControl` |
| Collapsed-v pill | 40 (48), the title and a chevron, fully round | `--kol-float-collapsed-h` |

**His ruling (2026-11-12, P1, LAW):** *"264 AND 360"* — float Rails are 264 and 360 wide, nothing else. They replace 272, 280, 352 and 384; the nav footprint `--kol-shell-float-rail-open` reads `--kol-float-module-w`.
An input fills its cell; a number box takes the `ch` width of its value. A two-state on or off is a `ToggleSwitch`; a
pair whose two states are named things (Clip and Visible) stays a choice.

## List

| What | Value | Token |
|---|---|---|
| Row | 34 | `--kol-float-list-row` |
| Panel radius | 8 (10) | `--kol-float-list-r` |
| Panel inset | 4 | `--kol-spacing-1` |
| Offset under the trigger | 8 | `--kol-spacing-2` |
| Row gap | 2, so two fills never touch | `--kol-spacing-0-5` |
| Hover, and keyboard focus | fg-16, the only fill | `--kol-float-row-hover` |
| Selected | no fill; the row carries its dot | `--kol-float-row-selected` |
| A menu sheet's row (the More sheet) | 40 (48) | `--kol-float-row` |
| A menu sheet's inset | 6 | `--kol-float-inset` |

**A selected layer row** (LayerStack, LayerRow, the timeline's layer labels): `--kol-fg-12`, fill only, no stroke; the name at
`--kol-fg-emphasis`, the glyph on `--kol-oq-96`; hover `--kol-fg-04`; a selected container's open children `--kol-fg-08`
(the user's pick from the selected-row board, 2026-11-12; it was an accent mix at 26%).

The two state tokens are set on `.kol-menu-panel--float`, so the fg ladder resolves for the panel's own theme.
The same law holds in every list, float or not (plan-2026-11-12 W11.1): hover and keyboard focus are the only fill, the current row shows its dot (or check) and no fill, and rows sit `--kol-spacing-0-5` (2) apart — Menu, MenuPanel, MenuFlyout, ContextMenu, Dropdown's list, CommandOverlay and RailFlyout.

## Surface

| What | Value | Token |
|---|---|---|
| Lift | the float shadow | `--kol-shadow-float` |
| Radius, a window | 28 (32) | `--kol-float-window-r` |
| Body | scrolls inside the module, its scrollbar hidden; the header stays | `RailFloat` |
| Edges | none: no hairline rims on a float | the no-borders law |
| Clip | on, always: every float master and every screen frame in Figma clips its content | the clip law |

**The clip law (2026-11-12).** Clip content is on for every float master in the library and every screen frame in a
float file, no exceptions. A frame's clip cuts its children, never its own drop shadow, so clipping never costs a float
its lift. The kol-figma audit fails on any float master or screen frame with clip off.

## Related

- [[24-float-system|Float system]]: the families, foundations and motion.
- [[../01-foundations/09-sizes|Sizes]]: the app ladder and the glyph ladders.
