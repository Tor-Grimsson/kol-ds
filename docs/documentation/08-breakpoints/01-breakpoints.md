---
title: Breakpoints — the values
type: reference
status: active
updated: 2026-07-31
description: Every responsive number in the system — the Tailwind min-width scale, the five content-width tokens, the framework padding ramp, rail widths, and canonical grid-collapse points.
aliases:
  - breakpoint values
sources:
  - packages/theme/kol-theme.css
tags:
  - domain/design-system
  - domain/layout
related:
  - "[[INDEX|breakpoints]]"
  - "[[04-kol-ds-rules|KOL-DS rules]]"
---

# Breakpoints — the values

## The scale

**Tailwind's, min-width only.** No custom pixel media queries in showcase-owned code.

| Break | Min-width |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

## Content-width tokens

Five tokens, `packages/theme/kol-theme.css` content-widths block. The old `page`
(1400) and `wide` (1024) tiers were killed at theme 0.11.22 — width is content,
not page identity — and that still holds: `canvas` is **not** the old `page` tier
restored. `page` was a page *identity* ("this is a page, so it is 1400"); canvas
is a content kind ("this is a field of items"), and it earns its rung because the
shell's main track can never reach the frame value and panel squeezes a grid.

| Token | Value | For |
|---|---|---|
| `--kol-content-canvas` | 87.5rem | the page BODY inside the shell's main column — item fields (swatch grids, icon walls, galleries). Sorts under shell. Added 2026-07-31: shell was too wide to ever fire on the middle grid track, panel too tight for a grid. |
| `--kol-content-shell` | 1800px | THE outer page container — one frame, content left-anchored, rails outside |
| `--kol-content-panel` | 960px | tables, code blocks, framed panels |
| `--kol-content-column` | 768px | reading columns — docs, articles, workshop |
| `--kol-content-measure` | 65ch | running-text cap inside any tier |

Usage: `max-w-[var(--kol-content-shell)]` in JSX · `max-width: var(--kol-content-*)` in chrome CSS. Full-bleed surfaces (chess stage, block previews) take no cap.

## Padding ramp

The kol-framework ramp carries the responsive step — never Tailwind padding
steps on page containers: `padding: var(--kol-pad-section-y) var(--kol-pad-section-x)`.

| Axis | base | @768 | @1024 |
|---|---|---|---|
| x | 20px | 32px | 48px |
| y | 48px | 64px | 80px |

## Chrome numbers

| Thing | Value |
|---|---|
| Nav rails | 256px (`w-64`, `lg:grid-cols-[256px_…]`) |
| Chrome reveal | `lg` — NavDrawer below, TopBar links + sidebar at `lg+` |
| TOC rail | `xl:block` (progressive enhancement) |

## Grid collapses

| Pattern | Steps |
|---|---|
| Card grids | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — first break is always `sm` |
| Masonry walls | `columns-1 sm:columns-2 lg:columns-3 xl:columns-4` |
| Fixed `grid-cols-N` | only for intrinsically tiny cells (icon tiles, steppers) |
| `@container` | embedded product UI only — consumer provides `container-type: inline-size` |
