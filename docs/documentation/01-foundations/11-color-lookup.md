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
| `--kol-surface-primary` | `#121215` | `#fafafa` |
| `--kol-surface-on-primary` | `#fafafa` | `#121215` |
| `--kol-surface-secondary` | `#19191d` | `#f2f2f2` |
| `--kol-surface-on-secondary` | `#f8f8f8` | `#19191d` |
| `--kol-surface-tertiary` | `#0e0e11` | `#ffffff` |
| `--kol-surface-on-tertiary` | `#ffffff` | `#0e0e11` |
| `--kol-surface-sunken` | `var(--kol-oq-ab-96)` | `var(--kol-oq-ab-100)` |
| `--kol-surface-inverse` | `#fcfbf8` | `#0e0e11` |
| `--kol-surface-on-inverse` | `#0e0e11` | `#fcfbf8` |
| `--kol-surface-secondary-inverse` | `#e0e0e0` | `#212121` |
| `--kol-surface-tertiary-inverse` | `#d4d4d8` | `#424242` |
| `--kol-surface-contrast` | `#0b0b0c` | `#f2f2f2` |
| `--kol-surface-support-split` | `#202026` | `#eeeeee` |
| `--kol-surface-support-split-inverse` | `#eeeeee` | `#202026` |
| `--kol-surface-ab-split` | `#000000` | `#ffffff` |
| `--kol-surface-ab-split-inverse` | `#ffffff` | `#000000` |

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
