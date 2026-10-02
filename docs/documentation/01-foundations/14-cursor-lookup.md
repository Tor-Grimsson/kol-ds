---
title: Cursor lookup
type: reference
status: active
created: 2026-10-01
updated: 2026-10-01
description: Every cursor and pointer in use
aliases:
  - cursor-lookup
  - cursors
  - pointers
tags:
  - domain/components
  - domain/editor
related:
  - "[[INDEX|Foundations]]"
  - "[[../03-components/00-taxonomy|component taxonomy]]"
---

# Cursor lookup

Every cursor and pointer the design system uses — the browser's own and ours. A new one is added
here when it is found or made.

## Browser cursors

| Cursor | Means | Used by |
|---|---|---|
| `pointer` | it can be clicked | every clickable control — buttons, rows, chips, tabs |
| `default` | nothing to do here | static chrome that sits inside a clickable area |
| `text` | it can be typed in | `Input`, `SearchInput` |
| `move` | drag it to move it | editor canvas layers, `PathNodeOverlay` |
| `grab` | it can be picked up | `CurveOverlay`, `SelectionOverlay`, `TimelineDock`, `RecordManager`, the deck editor, the kinetic panel |
| `grabbing` | it is being dragged | the deck editor, the editor canvas, `SignalScope` |
| `crosshair` | pick a point | `SpectrumControls`, `XYPad` |
| `copy` | it will be duplicated | `TimelineDock` |
| `zoom-in` | click to see it larger | `MediaLibrary`, `MediaTileGallery`, `AssetTable` |
| `not-allowed` | it is disabled | `MenuItem`, `SwatchControls`, disabled buttons |
| `col-resize` | drag the edge sideways | the rail grab handle (pill and line variants), `Canvas` rulers, the column browser |
| `row-resize` | drag the edge up or down | `Canvas` rulers, the column browser |
| `ew-resize` | resize left or right | `CropOverlay`, `SelectionOverlay`, `TimelineDock` |
| `ns-resize` | resize up or down, or turn a value | `CropOverlay`, `SelectionOverlay`, `Knob`, `Fader` |
| `nwse-resize` | resize from a corner | `CropOverlay`, `SelectionOverlay`, the kinetic overlay |
| `nesw-resize` | resize from the other corner | `CropOverlay`, `SelectionOverlay`, the kinetic overlay |
| `none` | hidden, because we draw our own | `AsciiCursor`, the foundry intro loader |

## KOL cursors

| Cursor | What it is | Where |
|---|---|---|
| `AsciiCursor` | a character that follows the pointer | kol-component, utilities |

## Elsewhere

| Cursor | Where it lives |
|---|---|
| `CursorTrail`, `CursorOverlay` | the website (`apps/web/src/components/cursor`) |
| the cursor art supplied for the editor | not found in this repo |
