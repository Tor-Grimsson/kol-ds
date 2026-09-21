---
title: Size lookup
type: reference
status: canonical
created: 2026-09-03
updated: 2026-09-03
verified: 2026-09-03
description: One height per size, every family
aliases:
  - size-lookup
  - sizes
  - size-ladder
  - control-sizes
sources:
  - packages/theme/kol-components-atoms.css
  - packages/theme/kol-components-molecules.css
  - packages/component/src/hooks/glyphLadders.js
tags:
  - domain/tokens
  - audience/consumer
related:
  - "[[../03-components/05-control-chrome|control chrome law]]"
  - "[[12-typography-lookup|type lookup]]"
---

> **Generated** by `pnpm lookups` from the theme CSS — every value below is
> parsed, never typed. Edit the token, re-run, do not hand-edit this file.

# Size lookup

**A size is a HEIGHT**, and every control family hits the same number at the
same size — so a Button, a Dropdown and an Input in one row are one box (user
ruling 2026-09-03: *"xs sm md and lg all have height in pixels that has to
match"*).

## Heights

| Family | xs | sm | md | lg |
|---|---|---|---|---|
| `.kol-control` (Input, Textarea, Search…) | **22** | **26** | **32** | **40** |
| Button, text | **22** | **26** | **32** | **40** |
| Button `iconOnly` | **22** | **26** | **32** | **40** |
| IconFrame | **22** | **26** | **32** | **40** |
| Dropdown trigger | **22** | **26** | **32** | **40** |
| SegmentedToggle | **22** | **26** | **32** | **40** |

> ✅ All families agree at all four sizes.

## Derivation

Padding-driven families derive it; pinned boxes copy the derived number because
they have no line box of their own.

| Size | Padding | Type | Line height | + ring | = height |
|---|---|---|---|---|---|
| xs | `4px` | `kol-mono-8` | 12px | 2px | **22** |
| sm | `4px` | `kol-mono-12` | 16px | 2px | **26** |
| md | `6px` | `kol-mono-14` | 18px | 2px | **32** |
| lg | `8px` | `kol-mono-16` | 22px | 2px | **40** |

## Glyphs

Glyphs are their own scale and never follow the box. `iconSize` overrides
either ladder and is almost always a mistake — change the size, not the glyph.

| Ladder | xs | sm | md | lg |
|---|---|---|---|---|
| SOLO | 12 | 16 | 20 | 24 |
| ADJACENT | 10 | 14 | 16 | 18 |
| INDICATOR | 8 | 12 | 14 | 16 |
