---
title: Design-editor system
type: reference
status: canonical
created: 2026-09-03
updated: 2026-11-05
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

**Two owners since 2026-11-04 (user ruling).** *"fxr owns its version and DS has a copy to make the float version."*
kol-fxr owns its editor and never consumes this package. `packages/design-editor` is KOL's own copy and the base the
float versions are made from (`TimelineRail`, `timelineView`, the float views in `apps/float`). It is **no longer
refreshed from fxr's source**: the 2026-11-04 refresh was the last, and a part that exists in both (tools, inspector,
transport, colour picker, layer row) stays in both on purpose.

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

Six screens over one engine, all exported; the first five reachable in `apps/editor` (one rail, the drawer on
a phone), the float editor in `apps/float`:

| route | chrome | export |
|---|---|---|
| `/` | the editor — the compositor | `DesignEditor` |
| `/labs` | one source under a params rail; its categories ride the HOST's rail (`railExtras`) | `LabsView` |
| `/randomiser` | two tools — **Generator** and **Effects**. Effects asks for the input media first and keeps it while effects are browsed; the sheet's Back only closes the sheet | `MobileView` |
| `/core` | the editor with no layer packs — what `@kolkrabbi/design-editor/core` gives | `DesignEditor` from `/core` |
| `/output` | chromeless, no rail — the recording surface | `OutputView` |
| apps/float `/views/float-editor` | **the float editor** — the compositor in the float chrome (FloatEditorShell, below) | `FloatDesignEditor` |
| apps/float `/views/float-labs` | **Labs in the float chrome** (plan 3.2, 2026-11-06) — kol-shell `FloatLayout`: the catalog as the frame's nav Rail (expanded · collapsed with flyouts · hidden, `\` and `⇧\`), capsule (commands in its ▾) · transport · actions in the bar, LabsParams in the inspector slot, the mode switch in the bottom Rail; the A · B switch is gone; LabsView untouched | `FloatLabsView` |

**The dock and ⌘K** (0.31.0, plan 7.7): View › Tools puts the tools in the left Rail or a bottom dock (the phone's default) — kol-shell's horizontal ToolRail with each family's ▾, hand, undo and the ⌘K pill. ⌘K (`FloatCommandSearch`) lists every menu-bar leaf (Actions), every tool and every page under All · Actions · Tools · Pages, opening on Recent; anchored on the dock while it is up, the centred search modal otherwise.

**The float editor** (design-editor 0.28.0, plan-2026-11-05-float-editor W2). `FloatEditorShell`
(`editor/float/`) sits beside `EditorShell`, which stays as is: the same engine and state — compose,
tools, the panels registry and its tabs, the workspace store — under his Section 5 (Figma
7K5v68l4tblHPFuiLdokRu 20:12208). kol-shell's `MenuBar` on top (its rows `useFloatMenus` — every
MenuTop command as data, the Window rows under View › Cards), then the canvas edge to edge with the
chrome floating over it: DocumentCapsule + Breadcrumb top-left, the transport on the clock top-centre,
GlobalActions top-right, ToolRail and its ⋮ left, the cards right (scrolling), the mode switch
bottom-left, the Timeline along the bottom while it is up. **The cards are data** (`registry.cards`
in `float/FloatCompose.jsx`): every registry tab sits in a dashboards `Card variant="float"` —
Typography (the text surface, out of the inspector under this chrome) · Color/Swatches/Stroke ·
Layers/Assets/History/Navigator · Transform · Appearance · the object inspector (Design · Motion ·
Effects, his 19:10408) · Output (the rail footer). **0.29.0 (W2b):** Transform and Appearance are their
own cards (his 19:10125 · 19:10192) on the inspector's own fields in his float look — `AxisField` under
the float chrome is 32 high, radius 8, on the float well; Appearance is the float blend select, the float
Opacity slider, fill · stroke (hollow) · none swatches (`PaintPopover bare`) and the stroke weight. The
inspector's Design tab is his: the layer's line, Transform, Appearance, Effects (Drop shadow · Layer blur
add the effect and open its tab), then a Geometry pane for what his frame has no field for (align,
origin, skew, flips, corners, the lock, text resizing), the generator's Generate · Style
(`ParametersPanel only`) and a pattern's surface; Motion is the generator's Animation. A card may
`hold` tabs (their openers light the tab holding them), `yield` to another (Transform and Appearance
step out while the inspector is open) and `lead` (the open inspector heads the stack, frame 04).
Every opener the rails answered unfolds the card holding that tab. A text layer selected brings the
text options toolbar (family · style · size). The selection draws `SelectionOverlay variant="float"`
(name above, size under). Under 768 (his frame 06) the menu bar becomes his menu capsule — File ·
Edit · View · More (Layer, Text, Vector, Tools as levels), kol-shell `MenuBar variant="capsule"` — and
the app menu and Help sit in the ⋮ top-right; the tools are a row. **The generator windows** (0.29.0, W7): Tools › Generate…,
Repeat… and Paratype letter… open `editor/generate/GeneratorWindow.jsx` on kol-component's `Dialog
variant="settings"` (his 12:2282). The windows are data (`editor/generate/windows.js`, his window spec
name for name): Generate's Field · Ramp · the style · Mask · Warp · Randomness · Frame, its seven styles;
Repeat's mode tabs and their rows; the Paratype letter's Glyph · Metrics · Weights · Expressive.
**fxr's engines** (0.30.0, W7.6): `src/generate/` is fxr's generator and repeat engine copied verbatim
(field · geom · glyphs · path · raster · repeat · presets · fonts · `styles/` · index, and its `*.check.mjs`
— `node src/generate/<name>.check.mjs`, all pass); two owners — fxr keeps its own, this copy never feeds
back. fxr's editor side came with it (`editor/generate/` generateCore · GenerateLayer · RepeatLayer · rings ·
useGenerateFont · useGenerateImage; the `generate` and `repeat` layer types, their canvas render, their
export as `<g>` and Expand — `flattenGenerate` · `flattenRepeat`). Every control `bind`s to the engine's
flat params (`{ get, set }`), so the tool's state IS those params (`editor/generate/store.js`, one per tool,
`useGeneratorTool` in `tool.jsx`): presets, a reopened layer and both forms read back the same numbers.
The engine draws eight styles from the seven names (Stipple / Mosaic's cell shape None draws Stipple, Hex ·
Square Mosaic). Disabled — no engine param: Line Screen's Angle and Flare, Repeat's Align to path.
**Two forms, one state:** Tools › Generate · Repeat · Paratype letter opens the tool's **Rail**
(`GeneratorRail.jsx` — kol-shell's PropertyRail `density="compact"`, his 32:16215 frames' content and order:
a label column, collapsible sections, the field map live, the copy grid, the glyph with its guides, a status
foot; the slider run, the toggles and Generate on the KOL accent) in the right-hand column; its ↗ expands to
the dialog. Generate's foot button and the dialog's Apply place a live `generate` layer (then every edit
lands on it); Repeat goes live once it has a source (the selection by default), Paratype on the first edit;
Expand bakes it. The inspector's Generate tab and a double-click on the layer reopen its tool on it.
`pnpm check:float` holds MenuTop's rows, the keymap, the rail's tools, band and
footer, and the registry's tabs against the float chrome's data — 0 missing.

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

The same chromes inside kol-fxr's shell — the Hub's Home and Settings, fxr's Library, its rail and
its keys — are `apps/editor-hub`: fxr's files, copied, on this repo's packages. It is the rehearsal
for fxr's bump. On `AppHub` since 2026-10-07, as fxr is: Home's SAVED set reads `loadLibrary()`
(design-editor 0.22.0) on every render, so the shell tier mounts no library provider — one above
the shell went stale beside the editor's own, which `Editor.jsx` mounts itself.

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

