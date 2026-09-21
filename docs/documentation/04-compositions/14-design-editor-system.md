---
title: Design-editor system
type: reference
status: canonical
created: 2026-09-03
updated: 2026-09-03
verified: 2026-09-03
description: The editor and its parts
aliases:
  - design editor
  - kol-design-editor
  - editor system
sources:
  - packages/design-editor/src/index.jsx
  - packages/design-editor/README.md
  - packages/component/src/organisms/LayerStack.jsx
tags:
  - domain/compositions
  - audience/consumer
related:
  - "[[../00-overview/01-package-topology|package topology]]"
  - "[[13-controls-system|controls system]]"
  - "[[11-shell-system|shell system]]"
---

# Design-editor system — `@kolkrabbi/design-editor`

A DOM/SVG vector + generative compositor as ONE embeddable React component:
canvas, layers, palette / pattern / type generators, kinetic type, boolean
geometry, image export. It moved into this repo on 2026-09-03 by the user's
ruling, from kol-fxr — which had been publishing it from the app's own
`package.json` for two months, so no gate, roster or taxonomy check had ever
touched it and it sat at 0.1.0 pinning `^0.1.1` peers and a `kol-loader` that
no longer exists.

## The split

**The assembled app is a package; the parts are components.** These are two
different products and the estate ships both:

| | where | why |
|---|---|---|
| `<DesignEditor />` — the whole editor, its own router and state | `@kolkrabbi/design-editor` | you embed it; you do not compose it |
| `LayerStack` · `TimelineDock` · `CurveEditor` · `KeyframeEditor` · `InspectorRail` · `XYPad` · `Canvas` · `SelectionOverlay` · `PathNodeOverlay` · `CropOverlay` · `EditorShell` · `SplitToolButton` · the colour set | `@kolkrabbi/kol-component` | anyone building an editor-shaped surface composes these; they carry no store |

A part that lands in `kol-component` has had its store coupling turned into
props — that is the whole membership test here. `LayerStack` emits
`onReorder(id, parentId, index)`; `TimelineDock` takes `tracks` and a clock as
`t` + `onSeek`; `CurveEditor` takes a `validate` seam instead of the compiler.
The engine keeps the store.

## The build

This package ships `dist/` — [[../../../.kol/llm-context/ARCHITECTURE|ARCHITECTURE]]
§4's single ruled exception. The reason is that it is not a component set: it
is an application, and it carries pixi, three and d3, which every site
installing a Button would otherwise pay for. Raw-source publishing exists so a
consumer can read and patch a component; that argument does not reach a 4.4 MB
compositor.

**The design system stays external.** The bundle imports `kol-component`,
`kol-framework`, `kol-icons`, `kol-shell` and `kol-media-client` at runtime, so
the host and the editor run ONE copy of the DS at the host's version. Peers are
pinned to what the bundle was built against; bump them together.

## Single-copy state

Module-singleton state must have exactly one copy, and a host that keeps its
own gets silence, not an error. Three surfaced during the move, each exported
so both sides read one store:

| | what broke |
|---|---|
| the React contexts | a host mounting its own `ComposeStateProvider` around the package's hook — a context object is identity-compared, so the package's provider can never satisfy a local hook |
| `railExtras` | labs publishes its rail rows, the host's layout reads them; two copies and the layout subscribes to a store nothing writes |
| `mode.js`'s navigator | `setNavigator` on a local copy left the package's `navigator` null, and its fallback is `window.location.assign` — so every in-app navigation did a FULL PAGE LOAD, silently, losing in-memory state |

The last one is the shape to remember: it "worked", the user landed on the
right route, and only a navigation-entry count showed the reload.

## Driven by

kol-fxr is the app that runs, demos and drives the editor — it found twelve
defects in the ported component set on 2026-09-03 by adopting it and measuring.
Fixes land HERE first, and fxr sees them through `kol-link design-editor`
before any publish. Labs, the mobile chrome and the chromeless output window
are alternate chromes over the same engine and ship from this package too:
they are built FROM its internals, not on top of its component.
