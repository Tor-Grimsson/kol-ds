---
title: The canvas family
type: reference
status: draft
created: 2026-10-23
updated: 2026-10-25
description: Two canvases on one engine, one key table
aliases:
  - canvas-family
  - canvas-editor
  - canvas-studio
tags:
  - domain/components
  - domain/app-shell
sources:
  - packages/component/src/hooks/canvasViewport.js
  - packages/component/src/organisms/Canvas.jsx
  - packages/component/src/organisms/CanvasStudio.jsx
  - apps/rack/src/rack/RackViewport.jsx
  - apps/mixer/src/components/hall-of-mirrors/SymphonyMixer.jsx
related:
  - "[[01-inventory|component inventory]]"
  - "[[06-content-card-system|content card system]]"
  - "[[../04-compositions/16-app-anatomy|app anatomy]]"
  - "[[../../operations/01-release/04-retirements|retirements]]"
---

# The canvas family

**Status: built 2026-10-23** — kol-component 0.296.0, unpublished. User ruling, 2026-10-23.

| Component | What it is | Who sits on it |
|---|---|---|
| `CanvasEditor` | the artboard: a fixed 1080-virtual frame at a chosen aspect, letterboxed, with rulers and guides, that you pan and zoom around | the design editor (fxr's compositor); `Canvas` is its old name |
| `CanvasStudio` | the studio: an infinite dotted surface with no frame, the grid moving with the work | kol-monitor's rack (`apps/rack`), kol-mirror's desk (`apps/mixer`), the Studio's Create page |
| `useCanvasViewport` | the engine under both — the view, the gestures, the keys, `CanvasZoomContext` | every canvas; a consumer composing its own stage |

Two surfaces, one engine. They differ in model, not in gesture: a frame you move around, a field that moves under you. Until this page the gestures lived three times (the editor's viewport, the rack's, the desk's), each with its own modifier and clamp. The ruling that ended it: **⌘ is the canvas's modifier, globally; ⌥ belongs to the Hub's page keys (⌥1 to ⌥9)**. Nothing on a canvas reads ⌥.

## Keys

`CANVAS_KEYS`, exported from kol-component, is the one table both surfaces read, and what a Hub's shortcuts sheet lists.

| Does | Keys | Surface |
|---|---|---|
| Grab and pan (hold) | Space + drag | both |
| Pan | middle-drag, ⌘ drag | both |
| Pan | scroll (Shift for sideways) | both |
| Zoom at the pointer | ⌘ scroll, pinch | both |
| Zoom in, out | ⌘ =, ⌘ − | both |
| Reset pan and zoom | ⌘ 0 | both |
| Framerate chip | F | both |
| Dot grid | G | studio |
| Lock the view | L | studio |
| Snap positions — 7 8 9 top, 4 5 6 middle, 1 2 3 bottom, each left · centre · right; a pan to 48 inside the edge, never a zoom (`snapKeys={false}` for a canvas that needs its digits; `snapRef` names the box) | 1–9 | studio |

Touch: two fingers pan at their midpoint and pinch-zoom anchored there, on both. On the studio a lone finger pans empty surface (a finger on a control is the control's). On the editor a lone finger is the tool's, except a tap, which fires `onSpaceTap`. Keys never fire while typing in a field.

## The engine

`useCanvasViewport({ ref, view, defaultView, onViewChange, minZoom, maxZoom, fit, locked, onLockChange, grid, onGridChange, gridKey, lockKey, touch, spaceWhenOver, ignore, onSpaceTap })`. The view is `{ zoom, x, y }`, one `translate(x, y) scale(zoom)` with origin 0 0 on the transform layer, so a consumer's screen to content math divides by the zoom and nothing else. Controlled or not. The clamp is the surface's: the editor clamps in real terms through `fit` (2 % to 3200 % of screen px per frame px), the studio clamps the zoom itself (0.1 to 2 by default, the rack's floor so a 1716px rack fits a 390 phone). `CanvasZoomContext` publishes the live zoom, which editing chrome divides by to stay screen-constant.

## Studio

`CanvasStudio` is the background only: the dot grid (a 1px `--kol-fg-12` dot on a 36px cell, the cell scaled by the zoom and the field offset by the pan, kol-monitor's and kol-mirror's exact rule), pan, zoom, the lock and the keys. What sits on it is the app's, as `children` (in the pan-zoom layer) or `overlay` (screen space over it). The rack's modules snapping to HP, its patch cables and workbench stay in `apps/rack`; the desk's embla loop stays in `apps/mixer`. `gridRef` paints the grid on a bigger box than the surface (monitor's Create paints it on the whole page); `surfaceRef` hands the surface element to an overlay that measures against it (cables); `spaceWhenOver` keeps Space the transport's off the desk; `touch="none"` opts out of the touch gestures.

## The aliases

`Canvas` (one default under two names), `PanZoomViewport` and `PanViewport` (deprecated in place) are on [[../../operations/01-release/04-retirements|the ledger]], replaced by `CanvasEditor` and its `panEnabled`. The design editor mirrored in this repo carries its own copy of the artboard and is not on these names.
