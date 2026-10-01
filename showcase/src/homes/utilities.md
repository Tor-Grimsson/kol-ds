---
title: Utilities
type: index
status: active
created: 2026-09-30
updated: 2026-09-30
description: Purpose without a face
tags:
  - domain/components
  - domain/components/utilities
---

# Utilities

A utility has **purpose but no face of its own** — real exports with real consumers that are not interface elements:

| Kind | Example |
|---|---|
| a layout wrapper | a grid that paints nothing, a page frame |
| a mechanism other components wear | a popover's positioning, a tooltip, a fullscreen overlay |
| an overlay drawn onto a target | a selection box, a crop frame, path nodes, a curve |
| a guard or a fallback state | an error boundary, the placeholder an image falls back to |

It is one group, on purpose — not a scatter of homes. Any tier may import a utility; a utility reaches only down to atoms.
