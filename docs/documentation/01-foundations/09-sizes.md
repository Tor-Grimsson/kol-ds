---
title: Sizes
type: reference
status: canonical
created: 2026-09-03
updated: 2026-09-03
verified: 2026-09-03
description: One height per size, every family
aliases:
  - sizes
  - size-ladder
  - size-lookup
  - control-sizes
covers:
  - the four sizes and their pixel heights
  - which families are padding-driven and which are pinned
  - the two glyph ladders and why they do not follow the box
  - what is deliberately exempt
sources:
  - packages/theme/kol-components-atoms.css
  - packages/theme/kol-components-molecules.css
  - packages/component/src/hooks/glyphLadders.js
tags:
  - domain/tokens
  - domain/components
  - audience/consumer
related:
  - "[[01-tokens|tokens]]"
  - "[[03-typography|type classes]]"
  - "[[../03-components/05-control-chrome|control chrome law]]"
---

# Sizes — the lookup

> **Values live in [[09-size-lookup|the lookup]]** — the heights, the glyph ladders, generated from the CSS by
> `pnpm lookups`. This page is the reasoning.

**A size is a HEIGHT.** `xs` · `sm` · `md` · `lg` name four pixel heights, and
every control family hits the same number at the same size — that is the whole
point of the scale. A Button, a Dropdown and an Input dropped into one row are
one box.

> **The rule, in the user's words (2026-09-03):** *"xs sm md and lg all have
> height in pixels that has to match"* · *"so button and dropdown can align and
> input and whatever else"*.

## The table

| | **xs** | **sm** | **md** | **lg** |
|---|---|---|---|---|
| **Height** | **22** | **26** | **32** | **40** |
| Padding | `4px 8px` | `4px 12px` | `6px 16px` | `8px 20px` |
| Type | `kol-mono-8` | `kol-mono-12` | `kol-mono-14` | `kol-mono-16` |
| Radius | `--kol-radius-xs` (2px) | `--kol-radius-sm` (4px) | `sm` | `sm` |
| Solo glyph | 12 | 16 | 20 | 24 |
| Adjacent glyph | 10 | 14 | 16 | 18 |

## Mechanisms

Two mechanisms reach the same number. **Neither is free to drift from it.**

| Family | Class | How it gets there |
|---|---|---|
| Input · Textarea · SearchInput · Stepper | `.kol-control-*` | **derived** — padding + type line-height + ring |
| Button, with a label | `.kol-btn-*` | **derived** — same padding, same type |
| ToggleSwitch (`primary` / `outline` shells) | `.toggle-switch--*` | **derived** — same padding |
| Button `iconOnly` | `.kol-btn-icon.kol-btn-*` | **pinned** square |
| IconFrame | `.kol-icon-frame-*` | **pinned** square |
| Dropdown trigger | `.kol-dd-trigger.kol-btn-*` | **pinned** height |
| SegmentedToggle | `.kol-seg--*` | **pinned** height |

**Derived** means the height falls out of `padding × 2 + the size's mono
line-height + the 1px ring`:

```text
xs   4 + 4 + 12 + 2 = 22
sm   4 + 4 + 16 + 2 = 26
md   6 + 6 + 18 + 2 = 32
lg   8 + 8 + 22 + 2 = 40
```

**Pinned** means a literal in the theme, because the box must not move with its
contents — an icon-only control has no line box to size from, and a strip of
cells must not grow with the tallest cell. A pinned number is only ever a copy
of the derived one. **If you change a padding or a mono line-height, the pinned
numbers move with it or the scale breaks.**

## Glyphs

**Glyphs do not follow the box.** The two glyph ladders are their own scale and are read from
`packages/component/src/hooks/glyphLadders.js` — never transcribed at a call
site. The split is whether a label sits beside the glyph, not which component
you are in:

| Ladder | xs · sm · md · lg | For |
|---|---|---|
| `SOLO` | 12 · 16 · 20 · 24 | an icon alone in a pinned square |
| `ADJACENT` | 10 · 14 · 16 · 18 | an icon in a line box beside a label or value |

**`iconSize` overrides either, and is almost always a mistake.** It pins the
glyph and leaves the box on whatever size the call site asked for, which is how
a 32px square ends up around a 14px `x` — the exact defect found in
`ShellDrawer`'s close on 2026-09-03. Change the size, not the glyph.

## Exemptions

| | Why |
|---|---|
| **Tag** (`ICON_SIZES` 10/12/14) | Chip scale is a smaller family than the control sizes, not a third opinion about them. |
| **Slider** | A bare range row, not a pressable surface — one look, no variants. |
| **`.kol-icon-frame-plate`** | An affordance on a photo needs its own opaque plate; the box still takes a size. |

## Touch floor

**It starts at `sm`.** [[../03-components/05-control-chrome|The control chrome law]] puts a **24×24**
hit floor under every pressable control (WCAG 2.5.8 AA, 2026-08-26). `sm` (26),
`md` and `lg` clear it on their drawn size. **`xs` is 22 and does not** — it was
minted for instrument panels (the `kol-controls` rack, 2026-09-01), a pointer
surface, and the law's "the size scale already clears it" line simply predates
it.

So: `xs` is a fine-pointer size. If it is ever wanted on a touch surface the
remedy is the established one — a `::before` extent that lifts the hit box
without moving the drawn size, as `ToggleSwitch` and `Slider` got in theme
0.51.0 — but nothing ships that today and no consumer needs it.

## History

- **2026-09-03** — the ladder conformed. Only `md` had lined up: icon squares
  and `IconFrame` read 20/28/32/36 and the Dropdown trigger 28/32/36, against
  22/26/32/40 for every padding-driven family. An icon button stood 2px *taller*
  than the Input beside it at `sm`, 4px *shorter* at `lg`. The pinned numbers
  were conformed to the derived ones — three families against two, and the
  derived height is the one that follows from the type scale rather than being
  chosen. Glyph ladders untouched. The Dropdown trigger also gained the `xs` pin
  it never had; it had been falling through to the button padding, which landed
  on 22 by accident.
- **2026-09-01** — `xs` added across every family (`kol-controls`).
- **2026-08-30** — the Dropdown trigger put on the icon squares (28/32/36)
  because it sat 4px short of the `IconFrame` beside it. That fixed one row and
  moved the disagreement to `sm` and `lg` everywhere else — the reason this page
  now states one number per size rather than one number per family.
