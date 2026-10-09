---
title: App icons
type: reference
status: active
created: 2026-10-09
updated: 2026-10-09
description: The touch / home-screen icon every KOL app ships — mark size, ground, export
aliases:
  - app icon
  - touch icon
  - apple-touch-icon
tags:
  - domain/iconography
  - domain/brand
related:
  - "[[INDEX|icons]]"
  - "[[01-inventory|icon inventory]]"
---

# App icons

A KOL app icon (the `apple-touch-icon` / home-screen tile) is the app's mark from the `identity`
group, drawn the same way in every app so they sit together on one home screen.

## The rule

| | |
|---|---|
| Mark | the app's `identity/` glyph, in the **middle 60 %** of a 24 grid — a 14.4 square at 4.8 (`translate(4.8 4.8) scale(0.6)`) |
| Ground | `#121215` dark · `#FAFAFA` light |
| Export | 180×180, opaque RGB (no alpha) |
| Linked | the **dark** one is what `apple-touch-icon` links — iOS darkens a light web-clip ground |

At 180px that puts the mark's box at 36–144.

**Why 60 %** (user ruling, 2026-10-09): R2B2's octopus filled the 18-unit keyline square (75 %),
FXR's lettering the middle 60 %; side by side on the home screen the 75 % mark read crowded.

## Not the set fit

The `identity/` glyphs themselves sit on the set keyline like every icon (`kol-ds` at
`translate(3 3) scale(0.75)`), so they line up in a UI row. The 60 % is applied on top, at export.
Favicons (tab icons) are not covered here and keep their own fit.
