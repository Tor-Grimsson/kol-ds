---
title: Control chrome — the button law
type: reference
status: active
updated: 2026-07-15
verified: 2026-07-08
description: Every interactive control references the Button — two structural variants (primary / outline) plus the role variants (ghost / secondary / accent / danger / grey), one size scale (26/32/40), and interactive fills built on the opaque (oq) tier so nothing goes see-through over content.
aliases:
  - control-chrome
  - chrome-law
  - button-law
tags:
  - domain/design-system
sources:
  - packages/theme/kol-components-atoms.css
  - packages/component/src/atoms/Button.jsx
related:
  - "[[04-diamond-tier|diamond tier]]"
  - "[[01-inventory|component inventory]]"
  - "[[../01-foundations/01-tokens|tokens]]"
---

# Control chrome — the button law

Every KOL control that a user clicks, toggles, or types into wears the **same chrome as the Button**. One vocabulary, one size scale, one state model — so a Dropdown trigger, an Input, a ToggleSwitch, and a SegmentedToggle cell all read as members of one family instead of five bespoke looks. Established 2026-07-08 while root-causing the button-vanish bug (see [[04-diamond-tier|Button, diamond tier]]).

## The variant set (ruled 2026-07-15)

Two **structural** variants carry the hierarchy; the rest are **role** variants with one job each. This replaces the earlier "two variants, ghost retiring" stance — see the ruling below the fill table.

| Variant | Rest | Role |
|---|---|---|
| **primary** | filled `surface-secondary` | The default. Daily chrome. |
| **outline** | transparent + `border-oq-16` | Always secondary to primary. Bordered, no fill. |
| **ghost** | transparent, text `oq-48` | Quiet chrome — icon toolbars, clickable plies, text actions. Pairs with `quiet`/`pressed`. |
| **secondary** | inverted ink | High-emphasis inversion (rare). |
| **accent** | `accent-primary` fill | Brand-accented CTA. |
| **danger** | `--ui-error` fill | Destructive actions — never fake it with a red `className`. |
| **grey** | `oq-12` fill | Quiet filled chrome — dense tool rails, playback transports; also the Dropdown `grey` chrome (rest-only there per the dropdown ruling). |

`default`, `subtle`, `minimal`, `plain`, `control` are **legacy aliases**, not variants (see *Legacy aliases* below).

## The size scale

Padding-driven, not fixed-height — the control hugs its content and the padding + mono type set the height.

| Size | Padding | Type | Height |
|---|---|---|---|
| **sm** | `4px 12px` | `kol-mono-12` | 26px |
| **md** | `6px 16px` | `kol-mono-14` | 32px |
| **lg** | `8px 20px` | `kol-mono-16` | 40px |

## The state model — opaque fills

Interactive fills mix ink into the surface via the **opaque (`oq-*`) tier**, never a translucent `fg-*` wash. A translucent fill over an image or panel reads as the control vanishing — the original bug. Decoration that always sits on a panel (dividers, table washes) still uses `fg-*`; anything that can sit over media uses `oq`. See [[../01-foundations/01-tokens|tokens]] → opaque neutrals.

| Variant | Rest | Hover | Active |
|---|---|---|---|
| primary | `surface-secondary` | `oq-08` | `oq-16` |
| secondary | `surface-on-primary` | `oq-inverse-40` (label stays light, no ink swap) | `oq-inverse-48` |
| accent | `accent-primary` | accent 80% into surface (opaque) | accent 70% mix |
| outline | transparent · `border-oq-16` | `oq-02` | `oq-08` |
| ghost | text `oq-48` | `oq-04` | `oq-08` |
| danger *(2026-07-15)* | `--ui-error` fill · absolute-white label | error 80% into surface (opaque) | error 70% mix |
| grey *(2026-07-15)* | `oq-12` fill | `oq-16` | `oq-24` |
| **pressed** (toggle-on) | solid inverted ink (`surface-on-primary` / `surface-primary`) | — | — |

Plus: a `:focus-visible` ring everywhere (2px `--kol-focus-ring`, offset 2); `:disabled` stays `opacity: .5`; the `@media (hover: hover)` touch guards keep hover off touch. The Button `selected` prop is an alias of `pressed`.

## Which controls conform

| Control | How it wears the chrome |
|---|---|
| **Button** | The origin. Emits `kol-btn kol-btn-{variant} kol-btn-{size}`. |
| **Dropdown** | Trigger emits the `kol-btn` classes (inline-style chrome gone); open state fuses with the panel. Aliases: default/subtle→primary, minimal→outline. |
| **Input / Textarea** | `.kol-control` chrome; `ghost`→`outline` alias. |
| **ToggleSwitch** | Bare by default; optional primary/outline shells at button geometry; track scales; on = inverted ink. |
| **SegmentedToggle** | Cells padding-matched to the button size scale — heights pixel-identical (26/32/40). |
| **Slider** | Exempt — a bare range row, not a pressable surface. One look, no variants (see [[01-inventory\|inventory]]). |

## Legacy aliases — sweep pending

The old variant names still resolve for back-compat but are slated for removal:

`default` · `subtle` · `minimal` · `plain` · `control`

Mappings: Button `control`→`ghost` · Dropdown `default`/`subtle`→`primary`, `minimal`→`outline` · Input/Textarea **shells** `ghost`→`outline` (control shells have no quiet-chrome concept — the shell alias does not contradict the Button variant). The plan is to **sweep consumers, then drop all of them in one major bump** — not piecemeal. Slider's `variant` prop is a documented no-op (0.6.0 collapse); the in-repo dead props were swept 2026-07-15.

**Ghost un-retired (2026-07-15 ruling).** The retirement rationale was "near-zero real usage"; that is no longer true — the chess conformance sweep put icon toolbars and clickable plies on `ghost`(+`selected`), and `SplitToolButton`'s trigger contract is literally `kol-btn-ghost` + `quiet`/`pressed`. Ghost is a real variant (the quiet-chrome slot); the AA-contrast question on its `oq-48` resting label is therefore live again — tracked in the parked threads.

## The tool-trigger trio (ruled 2026-07-15)

Three deliberately distinct dropdown-ish triggers — do not merge, pick by contract (their JSDoc cross-references agree):

| Component | Contract |
|---|---|
| **Dropdown** | Text trigger, single-value list selection. Emits `kol-btn` chrome, fused open panel. |
| **ShapeDropdown** | Two-button split: action half fires, chevron half opens the variant menu. |
| **SplitToolButton** | Single 28×28 trigger: ONE click arms the variant and opens the menu (tool-palette idiom). |
