---
title: Tone lookup
type: reference
status: canonical
created: 2026-09-26
updated: 2026-09-26
verified: 2026-09-26
description: The seven control tones, ordered by depth
aliases:
  - tone-lookup
  - tones-lookup
  - tone-values
sources:
  - packages/theme/kol-components-molecules.css
  - packages/theme/kol-base-tokens.css
tags:
  - domain/tokens
  - audience/consumer
related:
  - "[[../03-components/05-control-chrome|control chrome]]"
  - "[[11-color-lookup|color lookup]]"
  - "[[10-opacity-lookup|opacity lookup]]"
---

> **Generated** by `pnpm lookups` from the theme CSS — every value below is
> parsed, never typed. Edit the token, re-run, do not hand-edit this file.

# Tone lookup

A tone is the ground a control sits on — one `kol-tone-*` class on a wrapper tones
every control inside it that passes no tone of its own. The rules are in
[[../03-components/05-control-chrome|control chrome]] § Tone; the live visualiser is
the showcase's `/foundations/tones`.

## Filled

Ordered by how far the fill sits from the page: **sunken** is below it,
**secondary** is the page itself, then up to **inverted**, the text colour as fill.
In the dark theme that reads darkest → brightest; in the light theme the same list
runs the other way. **The names cross:** tone `primary` paints `surface-secondary`,
tone `secondary` paints `surface-primary`.

| Tone | Fill | Dark | Light | Ink |
|---|---|---|---|---|
| `kol-tone-sunken` | `var(--kol-surface-sunken)` | `var(--kol-oq-ab-96)` | `var(--kol-oq-ab-100)` | `var(--kol-fg-96)` |
| `kol-tone-secondary` | `var(--kol-surface-primary)` | `#121215` | `#fafafa` | `var(--kol-surface-on-primary)` |
| `kol-tone-primary` | `var(--kol-surface-secondary)` | `#19191d` | `#f2f2f2` | `var(--kol-surface-on-primary)` |
| `kol-tone-grey` | `var(--kol-oq-12)` | — | — | `var(--kol-surface-on-primary)` |
| `kol-tone-inverted` | `var(--kol-surface-on-primary)` | `#fafafa` | `#121215` | `var(--kol-surface-primary)` |

## Unfilled

No fill of their own — the control shows the ground through it.

| Tone | Fill | Dark | Light | Ink |
|---|---|---|---|---|
| `kol-tone-outline` | `transparent` | — | — | `var(--kol-surface-on-primary)` |
| `kol-tone-ghost` | `transparent` | — | — | `var(--kol-oq-48)` |
