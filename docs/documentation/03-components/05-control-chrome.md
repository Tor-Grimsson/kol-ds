---
title: Control chrome — the button law
type: reference
status: active
updated: 2026-07-08
verified: 2026-07-08
description: Every interactive control references the Button — two variants (primary / outline), one size scale (26/32/40), and interactive fills built on the opaque (oq) tier so nothing goes see-through over content.
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

## The two variants

| Variant | Rest | Role |
|---|---|---|
| **primary** | filled `surface-secondary` | The default. Daily chrome. |
| **outline** | transparent + `border-oq-16` | Always secondary to primary. Bordered, no fill. |

That's the whole set. `default`, `subtle`, `minimal`, `ghost`, `plain`, `control` are **legacy aliases**, not variants — they map onto primary/outline (see *Legacy aliases* below).

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

`ghost` · `default` · `subtle` · `minimal` · `plain` · `control`

They map onto primary/outline today. The plan is to **sweep consumers, then drop all of them in one major bump** — not piecemeal. `ghost` in particular is being retired (near-zero real usage), which also cancels the ghost-label AA-contrast question (no point fixing a variant that's leaving). Until the sweep, passing a legacy name is a harmless alias.
