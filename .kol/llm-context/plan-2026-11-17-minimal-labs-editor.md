# Plan — Labs as Labs is, the editor as the editor is, in the minimal style

**Raised:** 2026-11-17, him. Points verbatim: "labs doesnt have topbar, editor does. this isnt good. you know what labs looks like and you know what the editor looks like"; "I need you to build labs like labs is and the editor like the editor is in minimal style"; "ok /plan-shape".
**Status:** W0 to W4 built 2026-11-17. Open: 2.3 (his call).
**Shape:** W › phase › list.
**Laws carried:** every region and control comes from the real app, nothing added, nothing moved, nothing left out without being listed; the style stays local to `apps/minimal`; no changes under `packages/` without his word; the editor package is a mirror and is not patched; never delete; he starts his own servers.
**How a phase closes:** the region table read by script from both apps (real beside minimal: same regions, same order, same controls), then both screenshots looked at side by side.

## What the real apps are (read 2026-11-17)

### Labs (`apps/labs`, `LabsView` in `AppShell`), light theme
| Region | Box at 1440×900 | Holds |
|---|---|---|
| Nav rail | left, 380 open (48 folded), full height | logomark and "KOL LABS"; six rows: Color, Effects, Generative, Morph, Vector, Composition; a row with a chevron enters its list of labs (Generative: Scanline, Pattern, Loops, Math, Penrose, Flow, Letter Gap, Drift, Gradients, Soft Forms, 3D Scene) with Back |
| Start picker | centered card over the stage, before a lab is picked | "LABS" and the six categories as buttons; then that category's labs and Back |
| Stage | 680 wide between the rails | the output at its aspect, centered, on a wash |
| Property rail | right, 380, full height | header: lab name and a back button; tabs Generate, Style, Animation |
| Generate tab | in the property rail | Type, Category, Preset (previous, select, next, info); Theme, Invert (Off, On), Palette (select, Roll, icon), Rolls (three chips), Background (Off, On); six sliders each with a number box; a row of buttons Type, Category, Preset, Settings and two icon buttons; Color, Motion Form |
| Style tab | in the property rail | three color fields (Background, Line color, Ring color) and Add FX |
| Animation tab | in the property rail | Add input, an easing select, number fields, a mode select per parameter |
| Dock | bottom of the property rail, 101 high | tabs Transport, Output, File; Transport: play, pause, "Loop / 4s", stop, rewind |

No top bar.

### Editor (`apps/editor`, `DesignEditor`), light theme
| Region | Box at 1440×900 | Holds |
|---|---|---|
| Menu bar | top, 32 high | FXR, File, Edit, Layer, Text, Vector, Tools, View, Window, Help |
| Options bar | under it, 40 high | undo, redo and the active tool's options (image, crop, duplicate shown) |
| Tools | left, 44 wide | select, pen, shape, text, components, zoom; fill and stroke chips at the bottom |
| Left dock | 264 wide | panel 1 tabs Stroke, Color, Swatches (color: fill and stroke chips, eyedropper, opacity, mode select, hue bar, field); panel 2 tabs Layers, Assets, History, Navigator (layer list; a row of layer actions: add, group, FX, mask, adjust, filter, duplicate, remove); footer dock 101 high with tabs Transport, Output, File |
| Canvas column | 868 wide | document title "Untitled @ 56%" (21 high), rulers on top and left, the artboard with its aspect label |
| Right dock | 264 wide | tabs Inspector, Parameters, Effects |

## W0 — The real apps did not start — ✅ fixed 2026-11-17 on his word (devDependencies in `packages/shell` and `packages/design-editor` back to the workspace form, `pnpm install`; both apps start on their own configs, 0 errors; both servers stopped)

### 0.1 — Cause and fix
- Found while reading them: `apps/labs` and `apps/editor` crash at start. `packages/shell/package.json` and `packages/design-editor/package.json` list `@kolkrabbi/kol-component` (and, in design-editor, kol-shell and kol-theme) under devDependencies as a version range, where every other package uses `workspace:^`. The root `pnpm install` an agent ran on 2026-11-16 therefore linked them to the published copy, and Vite fails on that copy's PDF worker import.
- Fix: those devDependencies back to the workspace form, then `pnpm install`. Two package manifests and the lockfile change; I tried and was stopped, so it waits on his word.
- Until then the apps run only with a scratch config (how I read them).
- Acceptance: `pnpm labs` and `pnpm editor` start; `packages/shell/node_modules/@kolkrabbi/kol-component` is a link to `packages/component`.

## W1 — Labs, as Labs is

### 1.1 — Regions one for one — ✅ built 2026-11-17 (regions and controls diff empty except three swatch names on the Style tab; rails 380 and 48; no top bar)
- `#/labs` rebuilt: nav rail (open and folded) with the six categories that enter their lab lists, the start picker, the stage, the property rail with its header and back, the three tabs, the dock with its three tabs. No top bar.
- The made-up parts go: the top bar, the toolbar pill, the sidebar header block, the Audio section, the invented presets and theme.
- Acceptance: the region list read from the real app and from `#/labs` matches name for name and order for order; 0 controls in `#/labs` that the real Labs lacks.

### 1.2 — Every lab, through the real chrome's data — ✅ built 2026-11-17 (25 labs plus Color from the package catalog; 21 open with parameters; Morph's 3 inert, Type and Kinetic show a note; inert: What Settings rolls, From library, Record, Batch export; lab-specific editors not drawn)
- The lab list and each lab's parameters come from the package's own catalog and schemas, so every lab the real Labs offers opens, not only Flow.
- Acceptance: the count of labs offered equals the real app's; each opens with its parameters or is listed as not buildable from what the package exports.

### 1.3 — Minimal parts the real Labs needs and the kit lacks — ✅ built 2026-11-17 (NavRail, PickerCard, PropertyRail, InputNumber, InputColor, SelectStep, ButtonSplit, Textarea, Divider in `apps/minimal/src/ui/`; not yet in the Figma kit)
- Number box beside a slider, Off/On pair, previous and next around a select, color field, filled chip, dock tabs. Built in `apps/minimal/src/ui/` and added to the Figma kit.
- Acceptance: 0 controls on the screen drawn outside `src/ui/`.

## W2 — The editor, as the editor is

### 2.1 — Regions one for one — ✅ built 2026-11-17 (every region within 4px of the real editor; 34 of 39 control readings an empty diff; the footer dock is always up here, the real one shows it only when the timeline is pinned: decided for review)
- `#/editor` rebuilt: menu bar, options bar, tools strip, left dock with its two tabbed panels and footer dock, canvas column with title and rulers, right dock with Inspector, Parameters, Effects.
- The made-up layout goes: the single Layers panel, the single Inspector, the timeline strip along the bottom, the toolbar pill.
- Acceptance: region list matches the real app name for name; panel tabs match.

### 2.2 — What the engine lets a host drive — ✅ built 2026-11-17 (menus, tools, layers, Inspector, Parameters, Effects wired through `src/editor/engine.js`; inert list in the session log: settings host, batch export, layer drag, media picker, bind dots, text typography, loop look and palette rows, modulation list, kinetic and pattern panels, sweep stack; no timeline dock, no pane drag or resize)
- Each control is wired to the engine where the package exports the means; the rest are shown in place but inert and listed, so the layout is whole and the gap is visible.
- Acceptance: a table of every control: wired, or inert with the missing export named.

### 2.3 — The export list for kol-fxr — TALK
- The layer state, the transport clock, tools and menus are internal to the package. A real minimal chrome needs them exported, which is a change in kol-fxr. His call whether to file it.

## W3 — The switch between them

### 3.1 — Where it lives — ✅ built 2026-11-17 (`#/` is a start page with two links)
- Not a top bar. The real apps are separate apps; in the demo the switch is two plain links outside both layouts (the app's own start page listing Labs and Editor), so neither screen carries anything it does not have.
- Acceptance: 0 switch controls inside either screen.

## W4 — Figma follows

### 4.1 — The two screens redrawn — ✅ built 2026-11-17 (frame `minimal-labs-2` 71:15375: `labs-flow` 71:15376, `editor` 75:15740, each one instance of a slotted `Labs` or `Editor` master; 35 parts and 50 icons added to the kit; Labs 13 of 13 regions within 4px, editor 18 of 19, menu bar 5px wide; existing kit parts changed to match code: Button, Segment, Select, FieldRow, Menu, Slider, `minimal/caps`)
- `labs-flow` and a new `editor` screen in des-tols, from the kit, matching W1 and W2. The earlier screens stay beside them as the earlier round.

## Order
W0 (his word) → W1.3 → W1.1 → W1.2 → W2.1 → W2.2 → W3.1 → W4.1. W2.3 on his call.
