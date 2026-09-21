---
title: Opacity lookup
type: reference
status: canonical
created: 2026-09-03
updated: 2026-09-03
verified: 2026-09-03
description: Every ink ladder, role and stop
aliases:
  - opacity-lookup
  - opacity
  - ladders
  - ink-lookup
sources:
  - packages/theme/kol-opacity.css
  - packages/theme/kol-opaque.css
tags:
  - domain/tokens
  - audience/consumer
related:
  - "[[01-tokens|tokens]]"
  - "[[11-color-lookup|color lookup]]"
  - "[[09-size-lookup|size lookup]]"
---

> **Generated** by `pnpm lookups` from the theme CSS — every value below is
> parsed, never typed. Edit the token, re-run, do not hand-edit this file.

# Opacity lookup

**Colour is hue; this is ink weight.** [[11-color-lookup|Color]] holds the
surfaces and ramps. Everything here is the theme's own ink at a strength, over
something.

## Ink roles

Eight names, each an alias onto one numeric stop. A role is a position on the
ladder, never a colour.

| Role | Stop |
|---|---|
| `--kol-fg-subtle` | `--kol-fg-24` |
| `--kol-fg-meta` | `--kol-fg-48` |
| `--kol-fg-body` | `--kol-fg-64` |
| `--kol-fg-lede` | `--kol-fg-72` |
| `--kol-fg-strong` | `--kol-fg-80` |
| `--kol-fg-shout` | `--kol-fg-88` |
| `--kol-fg-scream` | `--kol-fg-96` |
| `--kol-fg-emphasis` | `--kol-surface-on-primary` |
| `--kol-fg-default` | `--kol-fg-body` |

## Ladders

`fg` mixes ink into **transparent**; `oq` mixes it into the **surface**, so
`oq` is opaque and safe over media. `ab` mixes between pure `#000`/`#fff`,
`absolute` between the theme's own near-black and near-white.

| Family | Stops | Flips toward | Kind | Range |
|---|---|---|---|---|
| `--kol-fg-*` | 15 | ink | translucent | `01`…`96` |
| `--kol-fg-ab-*` | 15 | ground | translucent | `01`…`96` |
| `--kol-fg-ab-inverse-*` | 15 | ink | translucent | `01`…`96` |
| `--kol-fg-absolute-*` | 15 | frozen | translucent | `01`…`96` |
| `--kol-fg-absolute-inverse-*` | 15 | frozen | translucent | `01`…`96` |
| `--kol-fg-inverse-*` | 15 | ink | translucent | `01`…`96` |
| `--kol-oq-*` | 15 | ink | opaque | `01`…`96` |
| `--kol-oq-ab-*` | 16 | ground | opaque | `01`…`100` |
| `--kol-oq-ab-inverse-*` | 16 | ink | opaque | `01`…`100` |
| `--kol-oq-absolute-*` | 15 | frozen | opaque | `01`…`96` |
| `--kol-oq-absolute-inverse-*` | 15 | frozen | opaque | `01`…`96` |
| `--kol-oq-inverse-*` | 15 | ground | opaque | `01`…`96` |

## Utilities

`bg-` · `text-` · `border-` on every family and stop, plus `hover:`
variants on the standard and inverse tiers:

`fg-*` · `fg-ab-*` · `fg-ab-inverse-*` · `fg-absolute-*` · `fg-absolute-inverse-*` · `fg-inverse-*` · `oq-*` · `oq-ab-*` · `oq-ab-inverse-*` · `oq-absolute-*` · `oq-absolute-inverse-*` · `oq-inverse-*`
