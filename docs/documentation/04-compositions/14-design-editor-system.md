---
title: Design-editor system
type: reference
status: canonical
created: 2026-09-03
updated: 2026-10-05
verified: 2026-10-05
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
  - domain/editor
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
| `LayerStack` · `TimelineDock` · `CurveEditor` · `KeyframeEditor` · `InspectorRail` · `XYPad` · `Canvas` · `SelectionOverlay` · `PathNodeOverlay` · `CropOverlay` · `EditorShell` · `SplitToolButton` · `ToolPalette` · the color set | `@kolkrabbi/kol-component` | anyone building an editor-shaped surface composes these; they carry no store |

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

A fourth, found 2026-09-29 mounting every chrome in `apps/editor`: **the host's configuration**.
`mediaClient`, `mediaProxyBase` and `settingsStore` are `DesignEditor` props, but underneath they are
module setters that only `DesignEditor` called — so a host routing straight to `LabsView` or
`MobileView` got the Kolkrabbi CDN behind a `/media/` proxy it never stood up, and every picked image
rendered empty. `setMediaClient` · `setMediaProxyBase` · `setSettingsStore` are exported; call them
once before a chrome mounts.

The last row of the table is the shape to remember: it "worked", the user landed on the
right route, and only a navigation-entry count showed the reload.

## Driven by

kol-fxr is the app that runs, demos and drives the editor — it found twelve
defects in the ported component set on 2026-09-03 by adopting it and measuring.
Fixes land HERE first, and fxr sees them through `kol-link design-editor`
before any publish. Labs, the mobile chrome and the chromeless output window
are alternate chromes over the same engine and ship from this package too:
they are built FROM its internals, not on top of its component.

## The chromes

Five screens over one engine, all exported, all reachable in `apps/editor` (one rail, the drawer on
a phone):

| route | chrome | export |
|---|---|---|
| `/` | the editor — the compositor | `DesignEditor` |
| `/labs` | one source under a params rail; its categories ride the HOST's rail (`railExtras`) | `LabsView` |
| `/randomiser` | two tools — **Generator** and **Effects**. Effects asks for the input media first and keeps it while effects are browsed; the sheet's Back only closes the sheet | `MobileView` |
| `/core` | the editor with no layer packs — what `@kolkrabbi/design-editor/core` gives | `DesignEditor` from `/core` |
| `/output` | chromeless, no rail — the recording surface | `OutputView` |

`/core` is a full page load in and out: packs register module-globally when an entry is imported, so
an SPA hop would reach `/core` with every pack already in. `currentView()` reads the LAST path
segment, so a host that mounts the chromes under a base (`/apps/editor/labs`) keeps its view keymap.

**Labs and the generator share one frame** (2026-10-05). Their controls sit in the same place and
open the same way: **a rail on the right at a desk** (`--kol-sidenav-w` wide, top to bottom, the
first bar on one y in both) and **a sheet along the bottom on a phone — or in any window under
768** (`useNarrow`, `editor/mobile/device.js`; the width kol-shell folds its rail at). The sheet
is **half the display, or tall on its grabber** (`SheetGrab` · `SHEET_H`), one height on every tab,
and both stages refit above it. **Labs opens on an entry card** (`LabsCatalogCard`, both frames): the catalog's four sections,
then a section's groups; Effects and Vector then ask for media in a card (`LabsSourceCard`). At a
desk the params rail appears with the first pick. Labs' sheet starts under 1024 (`LABS_BELOW`),
the randomiser's under 768. **The compositor stands
down under 1024** (`Editor.jsx`): a card in its place with Labs and the randomiser as doors.
Decided on the recommendation 2026-10-05, for the user's review. The panel's first row is `PanelHeader` — the title
collapses it — and collapsed it is `PanelPills`, bottom-left; both chromes take them from
`editor/components/PanelHeader.jsx`. The nav is the host's rail: its drawer on a phone, the
hamburger top-right. What differs between the two is what the panel holds — labs' parametric
controls, the generator's rolls — not where it is. Each is alone in `apps/labs` and
`apps/randomiser`.

The same chromes inside kol-fxr's own shell and pages — Home, Library, Settings, its rail and its
keys — are `apps/editor-hub`: fxr's files, copied, on this repo's packages. It is the rehearsal for
fxr's bump.

**The panels** — the layout every one of those chromes shares (categories → sub-categories → a
leaf, its tabs, folded sections, labeled rows, the modulation dot) — are `AutoControls` over each
schema, inside two surfaces: labs' params rail (`LabsParams`, which the randomiser's sheet shares
its parts with) and the compositor's inspector (`SelectionPalettePanel`). `apps/panels` is labs
with the stage taken out: labs' catalog on the rail, its one layer in the document, and those two
surfaces side by side — the touch drawer on a phone. A panel fix lands in `editor/params/` or
`editor/labs/`, and the app shows it with no image in the way.

**The labs skin has one segmented control** (user, 2026-09-01): the default `SegmentedToggle` — one
group shell, dividers, the sunken selected cell (`kol-labs.css`). `variant="filled"` is the
compositor inspector's; in the labs rail and the randomiser's sheet it reads as bare text, and a
stateless strip there has no button shape at all.

