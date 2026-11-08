---
component: DragResizeBottomWake
source: kol-component@0.336.0 src/hooks/useDragResize.js (useGrabEdge(grabRef) — no axis)
staged: 2026-11-04
status: draft
deps: [useDragResize, useGrabEdge, .kol-rail-grab--top/--bottom]
---

# DragResizeBottomWake — useDragResize's pill never wakes on a top/bottom Rail

## Purpose
kol-website /library: Featured stories is a bottom Rail on `useDragResize(railRef, { token: 'kol-library-featured', side: 'bottom' })`, handle `kol-rail-grab kol-rail-grab--top`. The user: *"the rail, animation, is not showing, and you need to see it to know where to grab"*.

## Cause
`useDragResize` calls `useGrabEdge(grabRef)` with no options, so the near test is always across a VERTICAL line (`axis: 'y'`, distance on x). On a `side: 'top' | 'bottom'` Rail the handle is a horizontal edge; the pointer is never "near" on x, `is-near` never lands, the pill never shows. The CSS (`.kol-rail-grab--top/--bottom`, `--kol-rail-grab-x`) and `useGrabEdge({ axis: 'x' })` already exist — only the hook does not pass the axis.

## The ask
In `useDragResize`: `useGrabEdge(grabRef, { axis: vertical ? 'x' : 'y' })` — `vertical` is already computed there (`side === 'top' || side === 'bottom'`). Also `aria-orientation` on `grabProps` from the same flag (it is hard-coded `'vertical'`).

## Recreation notes
- One line plus the aria flag; no API change. EditorShell / Rail callers with a bottom or top side get the wake for free.
- Consumer meanwhile: kol-website passes its own ref to `useGrabEdge(ref, { axis: 'x' })` over `grabProps` (exported hook, not a fork); on the bump it drops that and keeps `grabProps.ref`.

## ✅ RESOLUTION — 2026-11-04

**kol-component 0.338.1** (live). `useDragResize` calls `useGrabEdge(grabRef, { axis: vertical ? 'x' : 'y' })`, so a top or bottom Rail's pill wakes on approach like a side Rail's; `grabProps` `aria-orientation` is `horizontal` on a top/bottom Rail. No API change. Docs: 04-compositions/17-rail-and-overlay.md.
