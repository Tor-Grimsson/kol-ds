---
title: Design-editor system
type: reference
status: canonical
created: 2026-09-03
updated: 2026-11-20
verified: 2026-10-05
description: The editor and its parts
aliases:
  - design editor
  - kol-design-editor
  - editor system
sources:
  - packages/design-editor/src/index.jsx
  - packages/design-editor/src/editor/kolbox
  - packages/design-editor/README.md
  - packages/component/src/organisms/LayerStack.jsx
  - packages/design-editor/src/editor/compose/layerModel.js
tags:
  - domain/compositions
  - domain/editor
related:
  - "[[../00-overview/01-package-topology|package topology]]"
  - "[[13-controls-system|controls system]]"
  - "[[11-shell-system|shell system]]"
  - "[[26-kolbox-system|kolbox system]]"
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

**The kolbox look of the editor chrome** (plan-2026-11-18-kolbox-system W31.2 batch 5, 2026-11-18): `EditorShell`,
`TimelineDock`, `Rail`, `RailHeader`, `LabeledControlSection`, `TreeRow`, `CommandOverlay`, `ColorInputRow` and
`ColorPickerPopover` take `variant="kolbox"`, and kol-shell's `ToolRail` (with its `ToolRailSlot`), `AppFloatNav`
(`transport`) and `DocumentCapsule` do too: `apps/kolbox` draws the engine's editor, Labs and Morph in them. Every
part, its widths and the props each maps: [[26-kolbox-system|kolbox system]].

**The kolbox style** (plan-2026-11-19-kolbox-whats-left C3, 2026-11-19, decided for his review): the editor's style is
one `variant`, `<DesignEditor variant="kolbox">` from the root entry (`index.jsx`; the core entry has no packs and only
the default style), and a Style row (Default, Kolbox) in the editor's Settings, the app setting `style`. The prop wins
over the row. It is never the theme: `data-theme-variant` stays its own choice. Under kolbox the editor mounts
`editor/kolbox/KolboxView.jsx`: kolbox's Editor, Labs and Morph on the hash (`#/editor`, `#/labs`, `#/morph`,
`RailSwitcher`'s spaces) and the Randomiser (`#/randomiser`), with the app-wide prompt, toasts, Settings doors and the phone's
bottom bar (`app/PhoneNav.jsx`) around them, in the variant context at
`'kolbox'` (`editor/variant.js`; float's `ChromeContext` is the same context under its old name, still `'float'`
there). Morph is a mode of the kolbox style only; the default keeps it as a tab in Labs. The kolbox shell and screens
live in `src/editor/kolbox/` (moved whole from apps/kolbox: `ui`, `search`, `app`, `files`, `editor`, `labs`, `morph`,
the four pages with the Randomiser and its `randomiser/` parts, and the sheet `kolbox.css`); `apps/kolbox` imports them
back. Home and Library are host pages, never the engine's: a host hands them in as `pages` (`{ '/home': Home,
'/library': Library }`) and KolboxView draws them on their addresses, opening on Home when it is given (a phone: the
Randomiser). Their one copy lives in `apps/editor/src/kolbox/` (`pages/Home.jsx`, `pages/Library.jsx`, `home/`,
`library/`, `ui/HomeRail.jsx`); `apps/kolbox` imports them from there. `@kolkrabbi/kol-tuner` (the kolbox Tune mode) is
a peer and a `workspace:*` dev dependency, as the other KOL packages. A host hands the media client and the
settings rows to `editor/kolbox/host.js` (`setKolboxHost`) before a screen loads (DesignEditor does it from its props)
and loads `kolbox.css` under its own Tailwind root (`apps/editor/src/kolbox.css`). The editor is developed in this repo
for this work, against §3's mirror rule, on his word.

### What the host connects (kolbox)

The account and the media are the host app's (kol-fxr's); the editor only takes them as props
(plan-2026-11-20-kolbox-everything-left W4). Nothing else in the editor signs in or fetches media.

| Prop | Shape | With none passed |
|---|---|---|
| `account` | `{ session, signIn, signOut }`: `session` is `{ name, email, picture }` or `null` when signed out; `signIn()` and `signOut()` are the host's own. Pass a new object when the session changes | the account menus read "Not signed in"; Sign in… opens a window saying no account is connected; no request leaves the page |
| `mediaClient` | kol-media-client's shape: `buckets()` → `[{ id, label }]`, `listMedia(prefix, { bucket })` → `[{ key, size, contentType, lastModified }]`, `mediaUrl(key, bucket)`, `proxied(url)` | the Media space (the Library's Media tab) and the media window read the editor's sample library (four pictures drawn in the editor, `editor/kolbox/app/sampleMedia.js`) and say so in one line |

```jsx
<DesignEditor variant="kolbox" account={{ session, signIn, signOut }} mediaClient={client} pages={pages} />
```

Where they are read: `editor/kolbox/host.js` keeps both; `files/account.js` (`sessionUser`, `signInHost`, `signOut`) is
what the Sign in window, Home's account chip and the right pill call; the screens set the media client once
(`hostClient() ?? sampleMediaClient`).

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

## Text and fonts

A text layer's font is a **family**, a **weight** and **italic** (`editor/modes/type/families.js`). Since 2026-11-18
the outline families are variable fonts (plan-2026-11-18-kolbox-round-2 W7):

| family | files (root `public/`) | axes | italic | draws as |
|---|---|---|---|---|
| Inter (the default) | `fonts/inter/Inter-VariableFont_slnt,wght.ttf` | wght 100 to 900, slnt -10 to 0 | the same file at slnt -10 | outlines |
| Malromur | `fonts/TG/TGMalromurRomanVF.ttf`, `TGMalromurItalicVF.ttf` | wght 300 to 900 | its italic file | outlines |
| JetBrains Mono, the Google list | woff2 | their own weights | their italics | live text; export through foreignObject |

- **Weight is any value on the axis.** `fontLoader.js` parses the file with opentype.js and hands back an instance fixed
  at that weight (and slant); draw, Flatten, the weight-to-weight morph (`weight` to `weight2`) and the SVG/PNG export
  run on its outlines. The canvas draws the same files as FontFaces with the axis range (Inter as one face whose
  oblique range is its slnt axis, so `font-style: italic` draws the real slant, never a synthetic skew), so screen and
  export match. Inter's FontFace is named `Inter VF`, so the theme's own Inter never stands in for it.
- **The opentype.js 2.0.0 gaps closed in `fontLoader.js`:** gvar tuples that cover "all points" are read as if they
  used the shared points (it broke whole glyphs on Inter's slant), so each glyph's tuples are re-read from the file;
  the path writer prints NaN for a coordinate a hair off a whole number, so coordinates are snapped before writing;
  advances at a weight (HVAR, or gvar's phantom points for Malromur, which has no HVAR); kerning (both families keep it
  behind GPOS Extension lookups, which opentype does not read, and vary it per weight through GDEF's item store,
  which opentype drops). Rot and Gullhamrar keep the same varying kerning in plain pair lookups, which opentype reads
  without the deltas, so those are re-read too; the deltas are cached per full set of axis values (Rot's kerning moves
  with width as well as weight). Measured against Chrome drawing the same files at 100px, 2026-11-18: advances and kerning
  match to 0.1px for Inter at 300, 500 and 800, upright and italic, for Malromur roman and italic at 300, 500 and 800,
  for Rot roman and italic at widths 64 and 172 and weights 100 and 900, and for Gullhamrar at 300 and 900.
- **Old documents migrate at read time.** A layer on the Right Grotesk cut system (`family: 'right-grotesk'` or none,
  a width cut and a weight), a layer saved as Inter Tight (the outline family for an hour on 2026-11-18) and a layer on
  the Google Inter row all read as Inter, the weight clamped into the axis; the old `mono` width is JetBrains. Nothing
  rewrites stored data. The 98-file static cut list left the engine (`_tmp/2026-11-18-static-cuts/`). The family list
  has one Inter row: the Google duplicate is left out.
- **Every other font picker is on the same model** (plan-2026-11-18-kolbox-round-3 W6): a family from the outline
  families and a weight on its axis, 100 to 900 (the loader clamps Malromur to 300). Old stored values read as Inter
  at their weight; nothing rewrites them.

| picker | keys now | old keys, how they read |
|---|---|---|
| Generate letter mask (window `letter-font`, `letter-weight`; rail `mFamily`, `mWeight`) | `mFamily`, `mWeight` (a slider) | `mCut` is not read: Inter at `mWeight` (`generate/field.js` `letterFamily`) |
| Generate ASCII font (window `font`, `font-weight`; rail `font`, `fontWeight`) | `font` pixel, inter or malromur; `fontWeight` | `font: 'rg-<cut>-<weight>'` is Inter at that weight (`generate/styles/ascii.js` `asciiFontKey`) |
| Pattern glyph tile | `glyphFamily`, `glyphWeight` (a slider) | `glyphFont` is not read: Inter at `glyphWeight` |
| `TypeBlock` fallback | `familyCssFor(value)` | an old width cut is Inter |

- **Kinetic type has four fonts** (`kinetic/fonts.js`): the two outline families, through `families.js`' FontFaces, and
  his TG Rot (`fonts/TG/TGRotVF.ttf`, italic `TGRotItalicVF.ttf`: wdth 64 to 172, wght 100 to 900) and TG Gullhamrar
  (`fonts/TG/TGGullhamrarVF.ttf`: wght 300 to 900), kinetic's own as before; Rot's presets drive its width axis. The TG
  files are the 2026-11-12 exports from kol-foundry (the September ones are in `_tmp/2026-11-18-tg-fonts-september/`):
  ranges unchanged, the default weight of Malromur roman and Gullhamrar moved from 300 to 400, Rot gained its italic. Rot and Gullhamrar are not outline
  families: the text tool and the mask, ASCII and pattern pickers stay Inter and Malromur. A stored comp draws its own
  font. An italic is Malromur's italic file or Inter's slant (`oblique 10deg`, never a synthetic skew), in the live
  text, the outline morph and the export's embedded faces. Every kinetic outline (the morph) parses through
  `fontLoader.js` (`loadFontFile`), so all four get the same opentype fixes. Penrose's glyph shape keeps its TG faces
  (`TG_FACES`: Rot, Malromur, Gullhamrar). `data/typography-cuts.js` keeps `applyCase` only. Old versions:
  `_tmp/2026-11-18-static-cuts-2/`.

## Layer model

Layer model 2 (plan-2026-11-18-kolbox-system W22, 2026-11-19), his words: layers are shapes, text and frames; the rest is
a fill or an effect. One module holds it: `editor/compose/layerModel.js`.

| Old layer type | In layer model 2 | Where its data goes |
|---|---|---|
| shape, text, path, boolean, group | stays a layer | unchanged |
| photo | a rectangle whose fill is an image | `fill: { type: 'image', src, srcType, fit, imgX, imgY, imgW, imgH … }`, everything the photo held |
| pattern, kinetic type, generate | an effect on the layer | a row in `content: [{ key, type, enabled, params }]`, `params` the old layer minus its box |
| loop | a layer with motion | a `loop` row in `content` (listed as Motion) |
| repeat (from the Effects menu) | an effect: copies of the layer it is on | a `repeat` row; old repeat layers (copies of another layer) stay layers |
| misc, Empty layer | not converted | waits on his ruling (22.5) |

- **Drawing reuses the old code.** A layer with an image fill or content rows draws as its "vehicles": the fill as the old
  photo layer, each row as the old layer of its type, built from the row and the layer's box, clipped to the layer's
  outline when it is not a plain box, and its own body between them (left out when it paints nothing). The canvas
  (`LayerRenderer`) and the export (`build.js` `layerToSvg`, `useComposeFile`) go through the one seam, `expandLayer`.
  The layer's filter chain and layer effects run on its first vehicle; vehicles carry the layer's id, so a press on
  any of them selects the layer.
- **Old files convert on load, in one place**: `reidLayers` (files, presets, library inserts) and the draft restore,
  only where the chrome passes `layerModel` to `ComposeStateProvider` (kolbox's Editor). `addLayer` of an old type goes
  through the same converter there, so every old door (a dropped image, Tools rows, the generator's Apply) makes the new
  model. A saved file carries `layerModel: 2` and is never converted again; nothing in a stored file changes until it is
  saved, and the converted layer keeps every old field inside its fill or row. Labs, Morph, the Randomiser and
  apps/editor's own chrome keep the flag off: their stages and inspectors switch on the old types. Drawing is shared,
  so every chrome draws a layer-model-2 file.
- **The verbs**: `addContent(id, type, params)` returns the new row; `updateContent(id, key, patch)` merges into a row
  (a box key or the chain goes to the layer); eye and minus are layer writes of `content`; an image fill is a layer
  write of `fill` (its eye is `fill.hidden`). `ContentScope` makes the layer read as a row's old layer for the old
  settings surfaces, every write landing in the row. The generator tool edits a row through `editContent` (generate/store.js).
- **Measured 2026-11-19**: each old type as a fixture, opened as it was and converted, canvas and PNG export compared:
  0 pixels changed for photo (plain, cropped, filtered), pattern, kinetic type, generate and loop, dark and light
  (`_tmp/2026-11-19-layer-model/check-convert.mjs`).
- **Not reached yet**: photo crop and kinetic element editing on the canvas still switch on the old types; the timeline
  binds flat layer props, so it cannot bind a row's params (a converted loop plays the bindings it has); two
  canvas-drawn rows on one layer share the id the export finds a live canvas by.

## Frames

Frames as objects (plan-2026-11-19-kolbox-whats-left C1, 2026-11-19), his ruling: "frame is not automatically there when
you open page", and a drawn frame is white. One module holds it: `editor/compose/frame.js`.

| Part | What it is |
|---|---|
| a frame | a top-level layer `{ type: 'frame', x, y, w, h, color, fillOpacity, name, density }` in the page's space; `density` is export px per page unit (1 for a drawn frame) |
| a layer in a frame | a top-level layer carrying `frameId`, so the canvas edits it as any layer |
| the page | the engine's stage: no fill, no edge, no name; the page color around it is `infiniteFill` |
| on | `ComposeStateProvider frames` (kolbox's Editor); Labs, Morph and apps/editor keep the one built-in frame |

- **Old files and drafts convert in one place**, `toFramesDoc`: one frame at the old stage's place and size, its fill,
  opacity, name and export px, every layer in it with its coordinates unchanged. A saved file carries `frameModel` (2,
  now 3 with pages) and is never converted again. Self-check: `pnpm --filter @kolkrabbi/design-editor check:frames`.
- **Verbs**: the frame tool draws one (white, no stroke); a press on a frame or its name moves it with its layers (one
  group move); `FrameChrome` with `box` draws its outline, corner handles (which resize it) and name (double click
  renames); delete takes its layers in one undo step named for the Undo row (`undoLabel`); `moveFrame(id, x, y)` is
  the inspector's X and Y.
- **Readers**: `activeFrameOf` (the selected frame, the selected layer's, else the first) is the frame the rulers,
  guides and zoom fit read (its chrome carries `data-ruler-origin`), the size fields edit and the export renders (its
  layers at its origin, its fill, its px); with no frame the export is the page's layers' bounds, with nothing it says
  "Nothing to export".
- **Not built**: a drop in Layers does not move a layer into or out of a frame; a frame does not clip its layers on the
  canvas (the export does); duplicating a frame copies the frame alone.

### Pages

Pages in the document (plan-2026-11-19-kolbox-whats-left C4.4, 2026-11-19), his words: "Pages dont work". Where frames
are on, a document holds 1 or more pages, each with a name, its own page color and its own frames and layers.

| Part | What it is |
|---|---|
| in the file and the draft | `pages: [{ id, name, color }]` in order, and one `layers` list where every layer and frame carries its `pageId`; `frameModel: 3` |
| in the engine | `pages` (each `{ id, name, color, layers }`), `pageId` the open page; the open page's layers are the live `layers`, so the canvas, Layers, the inspector and every write read it unchanged |
| the page color | `infiniteFill` is the open page's `color`; a setting, not an undo step |
| an older file | `toPages` after `toFramesDoc`: one page holding everything, its color the file's `canvas.infiniteFill` |

- **Verbs**: `setPage(id)` (no undo step; the selection clears), `addPage(name?)` (opens it), `renamePage(id, name)`,
  `duplicatePage(id)` (its content with new ids, opens it), `deletePage(id)` (its content with it; the Undo row names
  it, "Delete Page 2 and its 1 layer"; the last page stays). Undo carries the pages and the open page, so undoing an
  edit made on another page opens that page.
- **Readers**: `pagesDoc()` writes the file's `pages` and stamped `layers` (useComposeFile's buildSpec, the draft);
  `everyFrame(pageId?)` lists `{ pageId, pageName, frame, layers }` for every frame on every page, or on one, for an
  export of every frame.
- **The clipboard** (`compose/clipboard.js`): `copySelected({ cut })` keeps the selection in the app (a frame with its
  layers) and its words go to the system clipboard; `pasteLayers({ client })` puts a fresh copy (new ids, fills and
  effect rows kept) on the open page, in place or at a screen point, each layer in the frame under it or on the page
  (`placePaste`). The keys are the browser's own copy, cut and paste events, frames on only; a paste of text from
  another app makes a text layer.
- The library's `validatePreset` keeps `pages`, `frameModel` and `layerModel` (it dropped them before).

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
Effects, his 19:10408) · Output (the rail footer: two buttons, a `ButtonSplit` "Export PNG" whose ⌄ lists Export PNG · Export loop (webm) · Record · Batch export, and "Open output window"; grey tone under the float chrome, 0.44.0 · 0.45.1). **0.29.0 (W2b):** Transform and Appearance are their
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
Repeat… and Paratype letter… open `editor/generate/ModalSettings.jsx` on kol-component's `ModalDialog
variant="settings"`, drawn from base float parts only (design-editor 0.45.0: `LabeledControl` around `Slider variant="float" readout="input"`, float Dropdown / Input / TabsRow / Button / ToggleSwitch, a `ButtonGroup` footer) (his 12:2282). The windows are data (`editor/generate/windows.js`, his window spec
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
**Line Swell, as his canvas has it** (2026-11-19, plan-2026-11-19-kolbox-whats-left R8.1 to 8.3; replaces the W29.2
port's styles, Steps, Field map, Advanced, Roll and Spread, retired to `_tmp/2026-11-19-line-swell/retired/`). His live
canvas (claude.ai artifact `4Npm9zbKAg753Cz4TMPSKw`) is the source. `src/generate/lineSwell/`:

| File | What it is |
|---|---|
| `source.js` | the board engine, his `line-swell.js` verbatim, its canvas reads replaced by a pure scan (`vals` and the reference `STUDIES` carried 2026-11-19); one port addition, shape `layer`: the editor layer's own outline fitted into the circle's 2R square |
| `spec/build.mjs` → `spec.json` | every board's Tweaks panel read out of its `data-props`: per form its board, the engine call its `renderVals` makes, its sections and controls in order (editor, range, step, unit, default, options), the controls left out and why (Motion: the layer does not animate, 8.4 is Labs; `handles`; `view`); the presets (refs-01-sheet's 24 marks as each form's values, each checked to draw its reference's exact path); the picker's tiles |
| `row.js` | a row's data side: source, colors, the generate vehicle it draws as (light: the layer model imports it) |
| `index.js` | the one generate style `lineSwell` that draws a form; `labs.js` the Labs loops from the same spec |

Forms: the master board (rows named by its preset, Piano, Half), Blinds, Warp, Radial, Moire, Pinch, Flow, Rotor,
Vortex. **How it opens:** the layer's Effects plus › Line Swell (one row; gone from Generate and the generator window)
opens a small movable window (`editor/kolbox/editor/lineSwell/WindowLineSwell.jsx`): a search and his three groups,
Swell (Piano on a circle, a hexagon, a letter; Blinds), Half (variants 2, 9, 22) and Line effects (the seven), each
tile drawn by the engine (`LineSwellPicture.jsx`). A pick adds one `lineSwell` row to `layer.content` (eye, minus),
with the layer as the source where the form takes one (a shape or path: shape `layer`; a text layer: its first
letter). **Settings:** `LineSwellSettings.jsx` draws a form's spec in the rail under Effects: his section titles, his
control names, a range as slider and number, an int or text a field, a two-option enum both words, a longer one a
dropdown, a boolean a switch, a color the color row with his swatches; Randomise carries his sentence. The head's
`preset` opens the form's references as pictures. Checks: `node src/generate/lineSwell.check.mjs` (forms draw, 24
presets exact), `node src/generate/lineSwell/spec/build.mjs` (rebuild after a canvas change). Not matched: a letter is
the editor's Inter where the board's canvas falls back to Arial Black.

**Line Swell in Labs** (2026-11-19, plan-2026-11-19-kolbox-whats-left R8.4). Every board Labs carries is a loop in the
`lineswell` group (`generate/lineSwell/labs.js`), its categories his canvas's pages in its order: Presets (Blinds),
Master (Swell), Line Effects (the seven), References (the refs sheet's 24 marks), Motion (Wave loop, Keys loop, Spikes,
Ribbon, Center bars) and Wave shapes (Capsules, Band, Manual home). `spec/build.mjs` reads the Motion and Wave shapes
boards whole into `spec.json` `loops` (sections, the engine call, the clock, the frame) and each form's Motion section
(`motion`, shown in Labs only). Wave and Keys are `source.js`'s `wave` and `keys`; Band, Capsules and the landing are
`waveOrganism.js` (his `wave-organism.js`, verbatim). The rail (`editor/kolbox/labs/LineSwellLabs.jsx`, no tabs): the
page's boards as picture tiles (each drawn by its loop at its defaults), then `LineSwellSettings` on the board's spec.
Time is the board's: `loop` sets the transport's length, `play` off holds the board at `frame`; a board whose speeds
need not be whole (Capsules, the landing) loops over the fewest cycles that close both waves (20 at its defaults, so
240 s). A line effect with its `motion` on moves by it (`motionT` is the loop's u). A board name a layer field holds
(vortex's `x`, `y`) is stored as `lsX`, `lsY` and shown under his name. Check: `node src/generate/lineSwell.motion.check.mjs`
(each board against his live engines, moves, closes). Not matched: a letter in Labs is the pixel font (Keys' A).

**Atlas Cube Motion** (2026-11-18, W29.3). The lattice is `cube-lattice` (`loops/shape/cubeLattice.js`, Loops ›
Simple › Grids: Cube waves, Cube waves with nodes, Cube dashes pulse, Cube dashes lit band): every fixed number of the
four boards a setting, its moving parts snapped to whole cycles over Loop length (the presets' lengths are where the
boards' speeds close), colours the theme's. Boards against loops in Chrome: `_tmp/2026-11-18-style-generators/loops/compare.md`.
**The rebuilt Atlas pieces** (2026-11-19, plan-2026-11-19-kolbox-whats-left C7). Each board's mechanism as a loop, its
fixed numbers as settings, the theme's colours, every motion snapped to whole cycles over Loop length. Loops › Simple:
`signal-spikes` (Lines: mirrored, hanging, dense; signal-06 and 07), `signal-bars` (Lines: two waves, long blocks, rain;
signal-10), `signal-steps` (Lines: tiers, ramp, bold; signal-16, its block lengths a Lengths list), `record-tape` (Lines:
tape, close, plain; web-08 Wave and Flags, its runs your Values or rolled from Seed, its events your Markers),
`signal-ring` (Rings: three circles, fine, bold; signal-09), `signal-monitor` (Curves: three waves, one wave, dots only;
signal-08), `dot-warp` (Grids: circle, star, fine ring; signal-11, dot size and warp read from your source), and
`cube-lattice` gains Nested size, Ring and Fade out (Grids: Cube grow, slow; white-01). Math › Surfaces: `math-relief`
(turning, on a globe, flying the shore; web-01, 02 and 03), the height read from your source, its shore loop traced
from it. A source is a vector shape, pasted SVG or an image address (`loops/lib/source.js`: Source, Soften, Invert).
Not rebuilt: Line, Lines and Locator (a hand-traced path or a placed marker over a photo; in the editor that is a photo
layer and a path).
**Two forms, one state:** Tools › Generate · Repeat · Paratype letter opens the tool's **Rail**
(`RailSettings.jsx` — kol-shell's PropertyRail `density="compact"`, his 32:16215 frames' content and order:
a label column, collapsible sections, the field map live, the copy grid, the glyph with its guides, a status
foot; the slider run, the toggles and Generate on the KOL accent) in the right-hand column; its ↗ expands to
the dialog. Generate's foot button and the dialog's Apply place a live `generate` layer (then every edit
lands on it); Repeat goes live once it has a source (the selection by default), Paratype on the first edit;
Expand bakes it. The inspector's Generate tab and a double-click on the layer reopen its tool on it.
**His mock, value for value** (0.46.0, plan-2026-11-12-one-header W8.1 — float file 143:35343): the dialog's rows are
`LabeledControl variant="settings"` (10/12 label 6 over the control; slider rows 44 with a 26 value pill and a bright run), the
Source group's 12 rows in 301, the footer on one centre line (Live preview + the small switch, Reset · Cancel grey, Apply
inverted, float sm 28). Measured live: sheet, header, nav, content, aside, footer, sections and rows within 2px.
**FloatLabs as windows** (0.46.0, W10.1 · W11): the right side is PropertyRail `windows` — the effect's parameters
(title the effect, the preset its `kind`; `sheetLabels` → `{ title, kind, pill }`), Output and File (`EditorFooter
part="output" | "file"`), each collapsing alone; the float sections space by gap (no `divided`). The float `Transport` is one
play/pause button (last, beside the timecode); FloatLabs' is `collapsibleH`. `Movable` keeps a dragged float from its right
and bottom edges.
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

