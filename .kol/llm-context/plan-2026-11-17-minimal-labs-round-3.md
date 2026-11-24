# Plan — Labs in the minimal style, round 3 (Labs only)

**Raised:** 2026-11-17, him. Points verbatim: "I see you changed things drastically in minimal labs and editor … I said look at labs and editor as references, I didnt say change the style to follow it. the whole point is NOT to follow the current style"; "im not setting you off on another hour work session without knowing you understand the job"; "yes /plan-shape for labs only so I can verify".
**Status:** map verified by him 2026-11-17 ("yes get it done"); 1.1 to 1.4 built. Open: the editor's own plan.
**Shape:** W › phase › list.
**Laws carried:** the style is round 1 (Figma `minimal-labs` 1:16296 in the minimal file, `labs-flow`): its layout, widths and parts. The real Labs is a parts list only. Nothing made up, nothing dropped: a real part with no home is listed. Labs has no top bar. Round 2 (`minimal-labs-2`, today's `#/labs`) stays where it is as the earlier round; the code for it is retired to `_tmp/`, not deleted. The style stays local to `apps/minimal`.
**How a phase closes:** the parts list read by script from the real Labs against the minimal screen: every real part present or on the "no home yet" list, 0 parts on the minimal screen that the real Labs lacks; then the screenshot looked at beside round 1 for the look.

## The job in one line
Round 1's look and layout, holding everything the real Labs holds.

## The map: every real part and its home in minimal

| Real Labs part | Home in minimal | Minimal part |
|---|---|---|
| Logomark and "KOL LABS" | Sidebar, top block: logomark tile and "KOL labs". No subtitle and no switcher chevrons (the real one has neither) | SidebarHeader |
| Six categories: Color, Effects, Generative, Morph, Vector, Composition | Sidebar, under the group label "Labs": six rows with their icons | SidebarGroupLabel, SidebarItem |
| A category's labs (25 in all) | Under its category row, indented behind a hairline; the open lab is lit. Color has no list | SidebarSub, SidebarSubItem |
| Rail expand and collapse | Sidebar footer row "Collapse"; collapsed shows icons only | SidebarItem |
| Start picker card (before a lab is picked) | Centered on the canvas while no lab is open: the six categories, then that category's labs, Back | PickerCard |
| Stage with the output | Canvas: the output centered at its aspect | plain |
| Lab name and back button | Rail header: lab name left, preset name in mono right, a ghost back button at the far right | Button (icon only) |
| Tabs Generate, Style, Animation | Rail, under the header | Segmented |
| Type, Category | Rail, section named for the lab (e.g. "Flow"): two rows | FieldRow, Select |
| Preset with previous, next and info | Same section: one row | SelectStep, Button (icon only) |
| Theme | Same section | Select |
| Invert (Off, On) | Same section | Toggle |
| Palette: select, Roll, color modes button | Same section: one row | Select, Button (outline), Button (icon only) |
| Rolls chips | Same section: chips that wrap | Button (outline) |
| Background (Off, On) | Same section | Toggle |
| Parameter sliders with number boxes | Rail, section "Parameters": one row each, value at the right in mono, editable in place | Slider |
| Randomise row: Type, Category, Preset, Settings, and the two icon buttons | Rail, section "Randomise": outline pills and two icon buttons | Button |
| Color, Motion form buttons | Same section, second row | Button (ghost) |
| Style tab: color fields, Add FX | Rail, Style tab: section "Colors" (one row per color), section "Effects" (Add FX and the list) | InputColor, Button |
| Animation tab: Add input, easing, numbers, a mode per parameter | Rail, Animation tab: section "Inputs" (Add input, easing), section "Parameters" (one mode select per parameter) | Select, InputNumber, Button |
| Dock, Transport: play, pause, Loop and seconds, stop, rewind | The floating pill under the canvas: loop, rewind, play or pause, stop, time in mono | Toolbar |
| Dock, Output: aspect | The pill, after a divider: aspect select | Select |
| Dock, Output: export size, Export PNG, Open output window, Record, Batch export | The pill, right end: "Export" (filled) opening a menu with those five | Button, Menu |
| Dock, File: Save to file, Load from file | The pill: "File" (ghost) opening a menu with those two | Button, Menu |
| Dock, audio source: Off, Mic, File | The pill, before File: a small select | Select |

No top bar anywhere.

## Out of round 1, because the real Labs has no such thing
- The top bar (Labs menu, Save, Load, Open output window, Export PNG): its real items move to the pill's two menus.
- The sidebar header's subtitle "FXR" and its switcher chevrons.
- The made-up presets ("Dense stream", "Wide rings") and theme ("Paper"): the lists come from the package.
- "Light mode" in the sidebar footer, unless the real Labs rail turns out to have it (checked in 1.1).

## No home yet (real parts this round does not place)
- Stage zoom, pan and the fps readout.
- Lab-specific editors: soft forms layers, Penrose layers, curves, keyframes, camera pose slots, the modulation list, the Kinetic and Type panels.
- Morph's three labs (they live on another route of the package).

## W1 — Labs

### 1.1 — The parts list, from the real app — ✅ built 2026-11-17 (`_tmp/2026-11-17-minimal-labs-round-3/parts.md`, 95 entries; the real rail has no theme toggle; the map's back button is Undo and Redo)
- Read every category, lab, tab and control of the real Labs (running, plus source) into one list with kinds; settle the open points above (Light mode, what the Output and File tabs hold exactly).
- Acceptance: the list exists as a file; every row of the map above matches a list entry; rows the map lacks are added to it or to "No home yet".

### 1.2 — The screen — ✅ built 2026-11-17 (91 of 95 parts on the screen, 4 on "No home yet", 0 invented; rails 264 and 320, no bar; all behaviour checks pass; added to the map: Export loop (webm), Effect and Motion tabs, halftone chips, the media source card, Look, Time, Speed and Phase)
- `#/labs` rebuilt on round 1's layout: sidebar 264, canvas, property rail 320, floating pill; the parts from the map; driven by the package's own state as today.
- Today's round 2 code moves to `_tmp/2026-11-17-minimal-labs-round-2/`.
- Acceptance: every list entry from 1.1 is on the screen or on "No home yet"; 0 parts the real Labs lacks; left rail 264, right rail 320, no element above the canvas and rails; every lab in the catalog opens.

### 1.3 — Kit parts the map needs — ✅ built 2026-11-17 (`ui/Sidebar.jsx` back with five parts; Menu, Slider, Section gained optional props)
- What the app's `src/ui/` lacks for the map (the sidebar parts were retired in round 2 and come back; a menu on a pill button).
- Acceptance: 0 controls drawn outside `src/ui/`.

### 1.4 — Figma — ✅ built 2026-11-17 (minimal file `iJqsbFmtr8OkIWs364qguy`, frame `minimal-labs-3` 16:2483: `labs-flow` 16:2484, `labs-export` 16:3390, `labs-start` 16:4380; 74 of 74 boxes within 4px; that file's kit has components but no variables or text styles, none created)
- A new screen `labs-flow` in a new frame beside rounds 1 and 2, from the kit, matching 1.2.
- Acceptance: region boxes within 4px of the running screen.

## Order
His verify of the map → 1.1 → 1.3 → 1.2 → 1.4. The editor gets its own plan after this one is accepted.

## W2 — One frame, the design leads (P: "sidebar are at 240 ish, while you are making them way wider"; "I dont want you to match the code, I want you to follow fucking instructions.... we are CHANGING THE CURRENT SETUP"; "skip labs-start … just make [16:2484] this frame")

Cause: the right rail went to 320 on my own suggestion in the app, and the Figma screen and the kit's `Panel` were then changed to match the app. His references have both side rails at 264 (round 1, 1:16296) and 241 (Frame 2, 1:17381). For this style the Figma design leads and the code follows; Figma is never measured against the code.

### 2.1 — `labs-flow` 16:2484: both rails 240 — ✅ built 2026-11-17 (rails 240 and 240, canvas 960, 0 layers past the rail edge, content 837 of 852 high; the label column cannot be narrowed inside an instance, so Preset and Palette carry their label above and their controls the full width; section padding 12/10 and row gap 6 in this frame only)
- Left sidebar and right rail set to 240 in that frame only; the canvas takes the rest (960); output and pill stay centered in it.
- Right rail content refitted to 240: label column 72, controls fill the rest, the Preset row and the Randomise row still fit on their lines.
- Done by me directly in that frame, no agents. The kit, `labs-export`, `labs-start` and rounds 1 and 2 are not touched; `labs-start` is dropped from the work and left where it is.
- Acceptance: left rail 240, right rail 240, canvas 960; 0 text layers wrapped to a second line that were on one; 0 layers extending past their rail's edge.

### 2.2 — The app is built to the frame (P: "why the fuck would I just want figma changed?") — ✅ built 2026-11-17 (read at 1440×900: rails 240 and 240, canvas 960, 0 sideways overflow, Generate content 852 of 852; `ui/Panel.jsx` both sides 240, `ui/FieldRow.jsx` gained `stacked`, `ui/Section.jsx` padding 12 and 10 with gap 6, Preset and Palette stacked in `labs/Generative.jsx`; `#/editor` loads with 0 errors, the styles board starts)
- `apps/minimal` `#/labs` made to match the Figma frame `labs-flow` 16:2484, which is the source: left rail 240, right rail 240, the canvas takes the rest, the output and the pill centered in it.
- Right rail as in the frame: Preset and Palette with the label above and the controls the full width; the other rows label beside control; section padding 12 and 10, row gap 6; Rolls and Randomise wrap as in the frame.
- Done by me directly, no agents. Only `src/labs/` and the rail width it passes; `#/editor` and the styles board keep working.
- Acceptance, read from the running app at 1440×900 against the frame: left rail 240, right rail 240, canvas 960; the rail's rows in the frame's order with Preset and Palette stacked; the rail has no sideways overflow; the Generate tab's content is at most 852 high; `#/editor` loads and the styles board starts with 0 errors.
