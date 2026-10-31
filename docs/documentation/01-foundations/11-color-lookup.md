---
title: Color lookup
type: reference
status: canonical
created: 2026-09-03
updated: 2026-09-03
verified: 2026-09-03
description: Every surface, accent, state and ramp value
aliases:
  - color-lookup
  - colors-lookup
  - color-values
sources:
  - packages/theme/kol-base-tokens.css
  - packages/theme/kol-color.css
  - packages/framework/kol-brand-color.css
tags:
  - domain/tokens
  - audience/consumer
related:
  - "[[02-color|color]]"
  - "[[10-opacity|opacity]]"
  - "[[01-tokens|tokens]]"
---

> **Generated** by `pnpm lookups` from the theme CSS — every value below is
> parsed, never typed. Edit the token, re-run, do not hand-edit this file.

# Color lookup

Hue and surface values. **Ink weight is not here** — the `fg-*` / `oq-*`
ladders and the eight ink roles live in [[10-opacity|opacity]], because they are
neutral ink at a strength rather than colour.

## Surfaces

| Token | Dark | Light |
|---|---|---|
| `--kol-surface-primary` | `var(--kol-neutral-076)` | `var(--kol-neutral-980)` |
| `--kol-surface-on-primary` | `var(--kol-neutral-980)` | `var(--kol-neutral-076)` |
| `--kol-surface-secondary` | `var(--kol-neutral-106)` | `var(--kol-neutral-949)` |
| `--kol-surface-on-secondary` | `var(--kol-neutral-973)` | `var(--kol-neutral-106)` |
| `--kol-surface-tertiary` | `var(--kol-color-black)` | `var(--kol-color-ab-white)` |
| `--kol-surface-on-tertiary` | `var(--kol-color-ab-white)` | `var(--kol-color-black)` |
| `--kol-surface-sunken` | `var(--kol-oq-ab-96)` | `var(--kol-oq-ab-100)` |
| `--kol-surface-secondary-hover` | `var(--kol-surface-sunken)` | `rgb(from var(--kol-surface-secondary) calc(r - 8) calc(g - 8) calc(b - 8))` |
| `--kol-surface-secondary-press` | `rgb(from var(--kol-surface-sunken) calc(r - 8) calc(g - 8) calc(b - 8))` | `rgb(from var(--kol-surface-secondary) calc(r - 16) calc(g - 16) calc(b - 16))` |
| `--kol-surface-inverse` | `var(--kol-color-white)` | `var(--kol-color-black)` |
| `--kol-surface-on-inverse` | `var(--kol-color-black)` | `var(--kol-color-white)` |
| `--kol-surface-secondary-inverse` | `var(--kol-neutral-878)` | `var(--kol-neutral-129)` |
| `--kol-surface-tertiary-inverse` | `var(--kol-neutral-839)` | `var(--kol-neutral-259)` |
| `--kol-surface-contrast` | `var(--kol-neutral-045)` | `var(--kol-neutral-949)` |
| `--kol-surface-support-split` | `var(--kol-neutral-137)` | `var(--kol-neutral-933)` |
| `--kol-surface-support-split-inverse` | `var(--kol-neutral-933)` | `var(--kol-neutral-137)` |
| `--kol-surface-ab-split` | `var(--kol-color-ab-black)` | `var(--kol-color-ab-white)` |
| `--kol-surface-ab-split-inverse` | `var(--kol-color-ab-white)` | `var(--kol-color-ab-black)` |

## Absolutes

Theme-invariant poles. `ab` is pure; `--kol-color-white/black` are the
theme's own near-white and near-black.

| Token | Value | Flips? |
|---|---|---|
| `--kol-color-ab-white` | `#ffffff` | theme-invariant |
| `--kol-color-ab-black` | `#000000` | theme-invariant |

## Accents

Bound by `kol-brand-color.css`. Without it the DS is brand-neutral and the
accent falls back to surface ink.

| Token | Resolves to |
|---|---|
| `--kol-accent-primary` | `var(--kol-color-yellow-300)` |
| `--kol-accent-on-primary` | `var(--kol-color-blue-400)` |
| `--kol-accent-primary-strong` | `var(--kol-color-yellow-400)` |
| `--kol-accent-secondary` | `var(--kol-color-red-200)` |
| `--kol-accent-on-secondary` | `var(--kol-color-cream-100)` |

## State

| Token | Dark | Light |
|---|---|---|
| `--ui-error` | `#F87171` | `#B91C1C` |
| `--ui-warning` | `#FACC15` | `#EAB308` |
| `--ui-info` | `#60A5FA` | `#1D4ED8` |
| `--ui-success` | `#3DD68C` | `#15803D` |

## Ramps

| Stop | Yellow | Red | Blue | Orange | Teal | Green | Purple | Cream |
|---|---|---|---|---|---|---|---|---|
| 100 | `#FFEA57` | `#CC7762` | `#497DA2` | `#F5CF81` | `#9BCCCD` | `#A8CBA0` | `#B9A8D6` | `#FAF7F0` |
| 200 | `#FFDF43` | `#AD5038` | `#3F6485` | `#E3A054` | `#6FB6B7` | `#7FB073` | `#9179B8` | `#F5F0E6` |
| 300 | `#FFCF33` | `#913F2B` | `#314152` | `#DF760B` | `#49A0A2` | `#4C9A5F` | `#6B4E9E` | `#F5EBD8` |
| 400 | `#FFBC1F` | `#662C1E` | `#222D3D` | `#A54209` | `#387E7F` | `#37733F` | `#4E3873` | `#F0E0C0` |
| 500 | `#FFA113` | `#522418` | `#181F29` | `#7C2900` | `#275A5B` | `#285229` | `#38285A` | `#EBD5A9` |
