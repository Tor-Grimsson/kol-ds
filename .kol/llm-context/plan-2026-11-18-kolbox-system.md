# Plan — kolbox as a KOL system: scales, colors, three pages, themes

**Raised:** 2026-11-18, him. Points verbatim, in the order they came: "I feeel like we should be referencing kol-ds-ui and how atoms molecules etc are set up ALONGSIDE this setup"; "BUTTON in kol-ds-ui fimga file … but this isnt that"; "component page needs TLC"; "many glyphs are not currentColor here?"; "it just occurred that we dont have themes in kolbox?"; "are these sizes normal … seems quite excessive?"; "why do we need so many stops?"; "space, why are we defining so much? isnt is almost counter productive?"; "this is not how foundation presents type styles … nor is this color"; "why dont we check kol? dont we have 8pt scale spaers there?"; "I want numbers for radius not xc sm md etc. and control heights? I mean kol could be lacking?"; "ok /p lets see it together? what are the Ws?"
**Status (2026-11-18, evening):** see "Where it stands and what is next" below: built through W21; open work is W28 and W24, W17, W18, W16, W31, W23 with W25 and W26, W22, W29, W27, W30. Nothing running.
**Earlier status:** 2026-11-18, his go ("get everything done, use 2 agents in figma or more in code when possible"). Wave 1 building: Figma A W10.1 to 10.7; Figma B W1, W2, W3, 10.9, 5.3; code W1 and 2.2. TALK phases are built on the recommendation and marked for his review.
**Shape:** W › phase › list.
**Laws carried:** the design leads and the code follows. Kolbox invents no scale, name or doc frame that KOL already has: it takes KOL's, and where KOL is lacking, KOL grows. One ladder: Atoms, Molecules, Organisms, Modules, Utilities. A master lives once, on Components. A look change in code lands in the Figma library the same turn. A renamed KOL token keeps its old name as an alias on the 30-day ledger. Nodes are moved, never rebuilt; nothing is deleted, it goes to `_trash` with the `_` prefix. No Figma write without his go. I look at every page before handing it over.
**The design is the whole list (his word 2026-11-18: "just make sure to account for everything in the design, even if it doesnt have a function YET"):** every part drawn in the design is built, in the file and in code, whether or not the engine can do it yet. A part with no function is still there, in its place, at its size, in its drawn state; it does nothing when used and is on a written "no function yet" list. Nothing is left out because it is not wired, and nothing is hidden or dimmed to say so.
**How a phase closes:** the acceptance line read by script from the file or the code, the repo gate that covers the change, then the page looked at beside its model. Nothing here moves, so no recording.

Takes over from `plan-2026-11-18-kolbox-figma-three-pages.md` (its W1 and W3 are built and stand; its Foundations page is rejected and redone here as W4).

Files: kolbox `SgfHBi22F7tYO7GHIorUbv` (Components 226:70417, Foundations 226:70418, Layout UI 149:26341); the library `n48kE2bJtrFjl7wxst30xH`.

## Where it stands and what is next (2026-11-18, evening)

Built, in the file and the build: W1 to W6, W10, W11, W13, W14, W15, W19, W20, W21 (as a finding), most of W8. The phase headings below carry their marks.

Open, in build order. Nothing here starts without his go.

| Order | W | What | State |
|---|---|---|---|
| 1 | W28, with W24 | The editor, his second look: the frame moves and renames, selection as the design, one surface for everything that floats, press outside closes, dropdowns open over their field, one chevron size, Pages, right-click menus, the collapsed rail. Quiet edges and the icon button's frame. | to build |
| 2 | W17 | Kolbox light, near neutral | to build, then his look |
| 3 | W18 | Pinch zoom: profile, then fix | to build |
| 4 | W16 | Kolbox's glyphs into `kol-icons` | match, then a review board |
| 5 | W31 | The kit moves into the DS | code done; Figma: atoms and molecules folded, the rest waits on the call limit (31.3) |
| 6 | W23, W25, W26 | The windows: one frame, a generator window per family opened from the Effects menu; the color window; the search window | file first |
| 7 | W22 | The layer model: photo is a fill; pattern, kinetic type and generate are effects; a loop is a layer with motion | size from the engine first |
| 8 | W29 | The style generators into Labs and the generator | the table of pieces first |
| 9 | W27 | The form tuner: its own engine package `kol-tuner`, the standalone `apps/tuner`, and in the editor a mode on one shape with Generate and Modify | named; to build |
| 9b | W32 | The editor takes the kolbox style | size first |
| 10 | W30 | Export, Save as, Home and the user | read, then drawn |
| later | W30.5 | Desktop rendering | parked |
| his | W7, W12 | The older calls; the gaps Layout UI showed | to talk |
| blocked | 8.3 | Code Connect for kolbox | needs W31 |
| parked | W9 | Layer rows, the randomise buttons | on his word |

## W1 — KOL grows the scales kolbox needs — library half ✅ built 2026-11-18 (library `n48kE2bJtrFjl7wxst30xH`, names equal to the code tokens)

Cause: KOL's scales were cut for sites and roomy apps. Under 16 it has four spacing stops, its radius is six names over one value, and it has no control height at 24 or 28, where tool UIs sit. Kolbox filled the holes itself: 29 spacing stops, 17 radius values, 103 sizes.

### 1.1 — Space: add 1, 6, 10, 14 (code: ✅ 2026-11-18, `--kol-spacing-0-25`, `-1-5`, `-2-5`, `-3-5` in kol-design-tokens.css and Tailwind `@theme`) (library: ✅ 2026-11-18, `spacing/0-25` = 1 added; 6, 10, 14 already `spacing/1-5`, `2-5`, `3-5`; 0 existing stops changed)
- KOL has 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. Added: 1, 6, 10, 14. In `packages/theme/kol-base-tokens.css`, the library's `spacing` collection and `docs/documentation/01-foundations/`.
- Acceptance: the four stops exist in code and in the library with the same names and values; 0 existing stops changed.

### 1.2 — Radius: numbers, not names (code: ✅ 2026-11-18, `--kol-radius-0` to `-16` and `-full`; old names aliased, on the ledger; 0 left in packages/ outside the design-editor mirror) (library: ✅ 2026-11-18, 8 numbered `radius/0, 2, 4, 6, 8, 12, 16, full`; none, xs, sm, md, lg, xl, 2xl alias them and resolve to 0, 2, 4, 4, 4, 4, 4 as before)
- The scale is 0, 2, 4, 6, 8, 12, 16, full, named by its number. The old names (xs, sm, md, lg, xl, 2xl) stay as aliases on the retirement ledger, each pointing at the number it equals today (xs 2, the rest 4), so no consumer's look changes.
- A numbered radius means one value in every theme: themes do not change corner radius (W6).
- Acceptance: 8 numbered radius tokens in code and library; every old name resolves to the same px as before; 0 uses of an old name left inside `packages/`.

### 1.3 — Control heights: numbers, with 24 and 28 (code: ✅ 2026-11-18, `--kol-ctl-22` to `-44` in kol-base-tokens.css; 09-sizes.md lists the seven) (library: ✅ 2026-11-18, 7 numbered `ctl/22` to `ctl/44` in `size`; xs, sm, md, lg alias them, 22, 26, 32, 40 in both modes)
- KOL has 22, 26, 32, 40 under xs, sm, md, lg. The ladder gains 24 and 28 and every step is also named by its number: 22, 24, 26, 28, 32, 40, 44 (44 is the touch size kolbox's mobile parts use). The size names stay.
- Acceptance: 7 numbered height tokens in code and library; xs, sm, md, lg resolve to the same px as before; `09-sizes.md` lists the seven.

## W2 — Kolbox's colors are a mode of the DS color collection — RULED 2026-11-18

Cause: kolbox has its own 13 roles (ground, panel, text, muted, accent …), so it cannot share a theme with anything, and its doc sheets, built from library parts, show the library's `fg` in Light beside it.

### 2.1 — The map — ✅ built 2026-11-18 (`_tmp/2026-11-18-kolbox-system/color-map.md` and `kolbox-modes.json`; 13 of 13 roles plus the sheet roles and 14 extras; largest shift `clip-border` 16, every base role 0)
- A table: each of the 13 roles, the DS variable it becomes (surface, fg, oq, accent, the tones), the old hex and the new. Muted text becomes an fg step, so a few tints shift; every shift is listed. The four open roles (accent hover, disabled text, backdrop, disabled button) are answered by the DS's own states.
- Acceptance: 13 of 13 roles mapped; the largest color shift written as a number per role.

### 2.1b — The map follows his palette sheet (P: "I havent even seen a stylesheet, so I havent even fully seen the color set, but at some point this was made [226:57874, Minimal on Gruvbox]") — ✅ built 2026-11-18 (oq/08, 16, 24, 32, 48, 64 pinned to the Gruvbox grounds in both kolbox modes, `accent/tint` 25% and `accent/tint-soft` 15% added; every sheet role shift 0 in library and kolbox; the map's top section lists the values changed after the first write for the code side)
- Cause: the first map let canvas, field and border fall out of the DS's oq formula (shift 4 to 6, warm greys turned green-grey) and turned the selected wash neutral by float's list-row rule. His sheet rules both: the greys are Gruvbox's grounds, and selected is the accent.
- The kolbox modes set the oq steps those roles sit on to the exact grounds: canvas #32302F, field and line #3C3836, border and field-hover #504945, line-strong #665C54, text-faint #7C6F64. Selected rows keep the accent at their old alphas. The sheet's roles the map lacked (field-hover, line, line-strong, text-faint, warning) are rows in it.
- Acceptance: every role on sheet 226:57874 resolves in kolbox dark to the sheet's hex, shift 0; code and library equal.

### 2.2 — The mode, in code and library (code: ✅ 2026-11-18, `data-theme-variant="kolbox"` in kol-color.css; 104 of 104 code variables equal the map in each of four theme cases; the 4 ui tints have no code token) (library: ✅ 2026-11-18, `theme` collection gains kolbox dark and kolbox light; 117 of 117 variables valued in both)
- The library's `color` collection gains kolbox dark and kolbox light; `packages/theme/kol-color.css` gains the same under one selector.
- Acceptance: both modes exist in both places with equal values; every DS color variable has a value in each.

### 2.3 — Kolbox rebinds — built 2026-11-18, open (996 paints on `↳ Components` rebound to a local `theme` mirror, 0 bindings left on the old collection, now `_Groovebox · UI set`; open: 38 raw paints are color-picker content, the `menu` mode switch keeps its color variables as aliases of DS ones, the old collection is retired not deleted because Foundations, Layout UI and `_trash` still bind it)
- Library rebind 2026-11-18: colors (`theme`) and font families (`type`) still bind kolbox's local mirrors, waiting on the library: its `theme` has Light, Dark, kolbox dark and kolbox light but no minimal or folio modes, and its `type` modes are fonts, not themes (`_tmp/2026-11-18-kolbox-system/removed-variables.md`).
- Every kolbox master binds to the DS variables; kolbox's own color collection goes to `_trash`. The `Brighter text` test becomes a question of which fg step text sits on.
- Acceptance: 0 masters bound to a kolbox-only color variable; 0 raw fills or strokes.

## W3 — Kolbox takes KOL's scales

Cause: "0 raw values" and "within 1px of the reference" were asked for in the same phase, the references were captures of Figma's own app, so every odd number became a variable.

### 3.1 — Rebind and cut — built 2026-11-18, open (`_tmp/2026-11-18-kolbox-system/rebind-table.md`; 15 kolbox sizes left, 0 `var(` names, 0 Components bindings on the 164 retired variables; ✅ 2026-11-18 mobile glyphs restored: every glyph on the twelve mobile screens equals its capture within 1px, six `size/mobile-glyph-*` sizes and two mode collections, table in `rebind-table.md` (kolbox's own sizes are now 15 plus those six); open: `radius/mobile-menu` 24 and `radius/mobile-rail` 38 have no stop, `tree/indent` stays raw, retired variables wait for W4 to free Foundations)
- Library rebind 2026-11-18: `spacing/*`, `stroke/0`, `stroke/1`, `radius/0…16, full` and `ctl/22…44` now bind to `❖ library--kol-ds-ui` on every page; the 35 local mirrors and the local `spacing` collection are removed (`_tmp/2026-11-18-kolbox-system/removed-variables.md`); kolbox's own sizes, radii and mode collections stay local.
- Space, radius and control heights bind to W1's stops, nearest wins. 5 goes to 4 or 6, 13 and 14 to 12 or 16. A width or height that comes out of auto-layout is not a variable. Glyph sizes collapse onto KOL's glyph ladder. Rail widths and bar heights stay as kolbox sizes.
- Acceptance: 0 space, radius or height variables in kolbox that KOL does not define; kolbox's own size variables ≤ 15; 0 variables holding a layout result; 0 unused; 0 names starting `var(`; a table of every rebound property, old and new value, largest move ≤ 2px.

## W4 — Foundations, presented as the library presents them

Cause: I never briefed the library's Styles pages as the model, and did not look at the result.

### 4.1 — Rebuilt on the library's Styles pages — ✅ built 2026-11-18 (Foundations 226:70418: 01 Colors 260:8107 with Primitives (27 Gruvbox swatches from his sheet, new `primitives` collection), Roles (his 21-row role table), Surfaces, Ladders (fg, oq and both inverse ladders, both modes), Accent + status; 02 Typography 261:8284 (Inter and JetBrains Mono: font card, font sheet, ramp of all 44 text styles); 03 Spacing + sizes 262:22110; 04 Radius + effects 262:22363; doc frames 1600 wide, header, content p64 gap48, footer, as the library's; doc parts `_Swatch`, `_Role row`, `_Token row`, `_Section label`, `_SpecimenSheet`, `_SpecimenSample`, `_SpecimenRampRow` on `_util`; 0 raw paints, 0 retired bindings on the page, 0 shadows cut; the six old sections on `_trash` with `_`; Surfaces 149:28650 and Text color test 223:42338 in 149:28649 on Layout UI; retired variables still bound: Layout UI 4728 on 2277 nodes, `_trash` 14496 on 6693, Components 0)
- Model: the library's Colors, Typography, Spacing + sizes, Radius + effects pages (1453:66451 to 1453:66454), read first, copied frame for frame with kolbox's mode and values. Built after W2 and W3, so it shows the cut scales and the DS colors.
- Today's six sections go to `_trash`. Surfaces and Text color test go back to Layout UI.
- Effects: every specimen has room around it and no clipping ancestor cuts its shadow.
- Acceptance: one section per library Styles page; each doc frame's tree, paddings and text sizes equal its model, as a table; every specimen bound to what it shows; 0 effect specimens with a shadow cut by a clipping ancestor.

## W5 — Components, presented as the library presents them

### 5.1 — Every family on the library's doc frame — ✅ built 2026-11-18 (34 of 34 family frames hold exactly `_Header`, `Specimen`, `_Footer`; same frame ids (231:2649 to 231:2786); doc parts are local copies on `_util` 251:14 (`_Header` 251:15, `_Footer` 251:26, `_Annotation` 251:39), the library's are private and not reachable from kolbox; table against 1194:892: frame 1600 wide, header 248 tall with 64 padding and 64 gap, intro gap 16, crumb 14, title 40, line 20, specimen padding 64, footer 81 tall with 32 / 64 padding and 12 text, all equal; colors and spacing bound to kolbox `theme` (kolbox dark) and `spacing`; 0 unlabelled masters; masters 143 (the 138 plus the five added today), 0 missing or renamed instances, 0 detached; every set's variants laid out as a grid with rows and columns labelled; family labels moved to `_trash` in `_W5 family labels` 253:7465)
- Model: the library's Button doc frame 1194:892, read first. Each of the 34 family frames gets its header (tier / family, name, one line, link), a specimen laid out as a grid with every variant and state labelled, and a footer. The doc-frame parts are components on a `_util` page, named as the library names them. The masters stay the same nodes.
- Acceptance: 34 of 34 family frames hold exactly header, specimen, footer; 0 unlabelled masters; paddings and text sizes equal 1194:892's, as a table; master count unchanged at 138; 0 detached, missing or renamed instances.

### 5.2 — The page reads as one grid — ✅ built 2026-11-18 (all 6 sections: every doc frame 1600 wide at x 80, stacked 200 apart; sections side by side 200 apart from 0,0; 0 overlaps, 0 specimens wider than the frame; Icons 231:2786 shows 121 labelled tiles for the 121 variants of `Icon` 24:9344)
- Every doc frame in a section has the section's one width; a wide specimen wraps inside. Icons shows one labelled tile per glyph.
- Acceptance: within each of the 6 sections every doc frame has the same width and x; 0 overlaps; Icons tile count equals the set's variant count.

### 5.3 — Glyphs take the ink of what holds them — ✅ built 2026-11-18 (count: 253 master and 842 instance glyph paints, 0 raw; 56 glyphs moved to their label's ink; then `menu/glyph` (kit `surface/on-primary`, overlay `oq/88`) on the MenuItem master and 31 rows rebound to their label's ink, the 2 accent rows to `accent/primary`; 0 menu rows off their label's ink)
- Count first: every glyph vector, split into bound to the ink variable, bound to another, raw. Then bind, so a glyph in a hovered, lit or disabled control follows that control's text color, as `currentColor` does in code.
- Acceptance: 0 raw fills or strokes on glyph vectors; a table of component, state, label color, glyph color with 0 mismatches.

## W6 — Themes

Cause: kolbox has one look, hard-coded: fixed hex in `apps/kolbox/src/index.css`, one palette in Figma. W2 makes a theme possible: a theme is a mode of the DS collections.

### 6.1 — What a theme sets — decided 2026-11-18, for his review
- Colors and the two font families (sans, mono). Not radius (W1.2), not spacing, not sizes, not layout.
- Acceptance: a written list of the variables a theme sets; 0 raw color or font family values in any master.

### 6.2 — The themes that ship — TALK: his list — ✅ built 2026-11-18 (decided for his review: kolbox, minimal, mono, folio; 7 modes in `theme` and in the new `type` collection, same names: kolbox dark, kolbox light, minimal dark, mono dark, mono light, folio light, folio dark; minimal has no light in its source; 117 of 117 colors valued in every mode; values and sources in `_tmp/2026-11-18-kolbox-system/themes.json`)
- Named so far: kolbox (the default), minimal, mono (JetBrains Mono throughout), folio; dark, and light where a theme has one. Minimal's and folio's values come from their own files, never guessed.

### 6.3 — The themes side by side — after 6.2 — ✅ built 2026-11-18 (05 Themes 262:35467 on Foundations: 7 labelled rows, each `Shell`, `RightRail` editor and `MenuFile`, differing only by the row's `theme` and `type` modes; 44 of 44 text styles bind their family to `font/sans` or `font/mono`, the 5 Semi Bold ones also `font-weight/semibold`; 0 components edited; not following: the 2 color-picker swatches in `RightRail`'s Fill and Stroke rows, raw content)
- One sheet on Foundations: the `editor` screen, one rail and one menu, once per theme, labelled, differing only by mode.
- Acceptance: one mode per ruled theme, same names in every themed collection; one labelled row per theme; 0 components edited to make a theme work.

## W10 — Layout UI: our components in place of every capture (P: "lets talk about the layout page"; "replace with what we have THEN we know if we are missing anythign AND remove screenshots"; "when this is done then I can point to whats wrong")

Cause: the page is still his reference page with our parts dropped in sheet by sheet. Half of it is Figma captures marked "reference for later", so it cannot show what kolbox has and what it lacks.

### 10.1 — Breakpoints (149:27143; P: "missing breakpoint, its just 4 frames from mobile to desktop, dont we want to do this?") — ✅ built 2026-11-18 (4 sheets, each one layout instance, clip on: 428 × 926 `MobileScreen` 244:28511 in 149:27241, 768 × 1024 `Browser` 244:28631 in 149:27338, 1440 × 900 `Browser` 244:28962 in 149:27553, 1920 × 1080 `Browser` 244:29293 in 149:27771; 0 captures; the 390 sheet 149:27144 and the four drawn frames on `_trash` in 168:35313, `_` prefix)
- The four frames, phone to desktop, built from `Shell`, `Browser` and `MobileScreen` at his four widths; the captures leave.
- Acceptance: 4 frames at the 4 widths of his sheet, each one layout instance, clip on; 0 captures on the sheet.

### 10.2 — Desktop atoms says what it shows (149:28649; P: "are these just instancees? its confusing … just dont knwo what im looking at") — ✅ built 2026-11-18 (Controls 149:28719: 12 rows labelled with their component, 25 specimens, 0 unlabelled; header names them instances with tier and family)
- They are instances: the masters live on Components. Every specimen gets its component's name as a label, and the sheet header says it shows instances, with the tier and family.
- Acceptance: every specimen on the section's sheets has a label equal to its component name; 0 unlabelled specimens.

### 10.3 — Menus and modals shown in the UI (149:28929; P: "maybe remove screenshots at this point? and show these moddals in actual UI views? could dim the UI to highlight the modal?") — ✅ built 2026-11-18 (`Dim` 241:4536 on Components, Utilities; 15 views 1440 × 900, clip on, each Shell + Dim + one overlay: 7 rail overlays with the build's RightRail in the right rail slot and the trigger lit, 5 menus, 2 modals, GeneratorWindow over Labs; 0 captures, 0 overlays outside a view; Overlays sheet 220:20089 and every capture and loose build on `_trash`. Triggers missing for 5 menus and Share are on the gap list)
- Each menu, panel and modal is shown open in a real view: an `editor`, `labs` or `Browser` screen instance, the UI under it dimmed by one `Dim` layer, the overlay at full strength, anchored to its trigger with the trigger lit.
- The captures and the loose overlay builds leave.
- Acceptance: one 1440 × 900 view per overlay, each holding exactly one screen instance, one dim and one overlay component; 0 captures in the section; 0 overlays placed outside a view.

### 10.4 — Mobile views grouped (149:27986; P: "wrong format for mobile views. they can rather group better not 1 huge space for each") — ✅ built 2026-11-18 (12 screens on 3 sheets of 4: start 244:29624, browse 244:29707, file 244:29761; every screen the moved `MobileScreen`, 428 × 926, clip on, `SectionLabel` under it; the 12 old sheets on `_trash`)
- The twelve screens sit in groups on a few sheets (start: Log in, Recents ×3; browse: Search, Activity, Mirror, Settings; file: File view, with menu, Comments, Page picker), side by side, each with its name under it. One sheet per group, not one per screen.
- Acceptance: 12 screens on ≤ 4 sheets; every screen 428 × 926, clip on, labelled; 0 sheets holding a single screen.

### 10.5 — The remaining capture sections proved with our parts (149:29201, 149:29453; P: "we need to convert for this, or if we have, then we sholud replace these to proove it"; "same with this") — ✅ built 2026-11-18 (0 captures in either section; File menu as a view, Device list, Play menu, Page theme and Frame type as `Menu`, Present bar as `Popover`, Mobile app phone and parts from kolbox components; 14 labelled gaps, listed in `_tmp/2026-11-18-kolbox-system/layout-ui-gaps.md`)
- Every capture is replaced by the same thing built from our components. Where we have no part, the spot stays as a labelled gap naming what is missing, and the gap goes on a list.
- Acceptance: 0 captures left in the two sections; a written list of every gap, each naming the missing part.

### 10.6 — The three modals (149:30094, 149:30183, 149:30258; P: "do we have this? or this … or this") — ✅ built 2026-11-18 (3 of 3 modals are views of our components, 0 captures: Move file (Shell, Dim, Popover with ModalSearch, ModalTabs, ModalFolderList) in 149:30094, Manage libraries 246:30284 in 149:30176, Publish library 246:31326 in 149:30251 (ModalTwoPane, a second Dim, Popover with SearchField, Textarea, ModalCheckRows). New on Components: `ModalTwoPane` 241:4565, `ModalLibraryRow` 241:4546, `ModalCheckRow` 241:4539 in Molecules, Modal; `Textarea` 241:4537 in Atoms, Inputs. The side list row is the existing `ListRow`, so no `ModalSideRow`. Toast and three glyphs on the gap list)
- Read 2026-11-18. Move file: yes, its parts exist (`Modal`, `ModalSearch`, `ModalTabs`, `ModalFolderList`, `ModalFolderRow`); the "File moved" toast is unproved. Manage libraries: no, there is no two-pane modal with a side list, no library row with its thumbnail. Publish library: no, there is no checklist row with a thumbnail, no text area, and no modal over a dimmed modal.
- Move file is rebuilt from ours in place of the capture. The missing parts for the other two are built as components (two-pane modal, side list row, library row, checklist row, `Textarea`), then both modals are shown as 10.3 shows them.
- Acceptance: 3 of 3 modals are instances of our components, 0 captures; the new parts are on Components in their tier.

### 10.7 — To `_trash` (P: "we can move this to trash"; "this can go to _trash, EXCEPT toolbar") — ✅ built 2026-11-18 (149:29869 and the five other Reference frames (37:12650, 73:4905, 144:32446, 19:9248, 218:42749) moved to `_trash` 76:13765 inside 168:35313, `_` prefix; the `toolbars` frame 125:27253, which holds the toolbar reference 125:27095, stays in Reference on Layout UI, id unchanged)
- 149:29869 goes to `_trash`. The Reference section 125:27253 goes to `_trash` except the toolbar reference, which stays.
- Acceptance: both are on `_trash` with the `_` prefix; the toolbar reference is still on Layout UI with its id unchanged.

### 10.8 — The toolbar, owed (P: "because we still owe toolbar in better style") — ✅ built 2026-11-18 (`ToolDock` 28:9326 and `ToolButton` 28:9325; against Figma's dock 125:27095, reference / built: height 48 / 48, side padding 8 / 8, radius 13 / 12, cell 32 / 32, cell radius 5 / 6, tool with chevron 53 / 53 (chevron cell 24 at -3, glyph 12 by LAW 9 where Figma draws 24), tool gap 4 / 4, group gap 17 / 17 (8, divider 1, 8), well 122 × 32 / hug × 32, well inset 2 / 2, well cell 28 / 28, well gap 2 / 2, well radius 5 / 6, shadows and hairline the same four effects, no outline; active cell accent with an on-accent glyph; the 72 instances keep their well setting; shown in the kept toolbars frame 125:27253 under the reference, 125:27229 with its well on; missing cells in `_tmp/2026-11-18-kolbox-system/inspector-gaps.md`; code: ✅ 2026-11-18 (kolbox ToolDock and ToolButton on the master: padding 8, groups 8 apart, tools 4, tool with chevron 53, well 2 in, radius 6, 28 cells, shadow/dock; 18 above the canvas foot, centred; `_tmp/2026-11-18-kolbox-system/chrome-measure.md` 55 of 55 boxes within 1px, 16 of 16 colors equal))
- `ToolDock` is redone beside the kept reference and his capture of Figma's own dock: 32 cells, the active tool a filled rounded cell, a chevron beside each tool with variants, the second group in an inset well after a divider, no outline.
- Acceptance: every measure of the dock against the reference in a table, within 1px; shown on a sheet beside the reference.

### 10.9 — Inputs line up (P: "why are inputs always so hard for you to keep straight?"; "what excercise is this? using slot to hard set padding? on top of regular padding? I dont get this?") — ✅ built 2026-11-18 (cause: emptied hug slots kept 16 and 15 px plus two gaps; 13 empty slots hidden so they take 0, 4 cell controls set to fill; GeneratorWindow 225:30450 values no longer cut; rails 2026-11-18: 56 controls in PropertyRow cells scanned in RightRail and GeneratorWindow, 16 more empty slots hidden, 0 not filling, 0 text cut; LeftRail and HomeRail hold none)
- Seen in his screenshot of the generator window: the Type dropdown runs past its cell, slider values are cut at the right edge ("0.60"), value boxes differ in width. Measured first; the likely cause is fixed widths where the cell should fill, and `Input`'s `leading` and `trailing` slots holding a fixed width when empty, so they act as padding on top of the padding.
- `Input` has one padding. A slot that holds nothing takes no space. Every control in a `PropertyRow` cell fills the cell.
- Acceptance: empty `leading` and `trailing` measure 0 wide; in every two-cell row both controls have the cell's width and the same left and right edge as the row above; 0 text cut by its box, in `GeneratorWindow` and every rail.

## W11 — The editor's inspector follows Figma's model (P: "figma nothing selected … figma frame selected"; "all of this is unneccessary, why? because Vector effects should load as effects"; "geometry corner radius is the same as appearance corner"; "we dont need dropdown to change shape"; "parameters shape parameters and Convert to path could all go into here [the Vector menu]"; "I can grab it and move it, which changes its x y location … but none of this is set in code build"; "code confuses background color to frame color")

Cause: the code build grew its right rail from the old editor's sections (Parameters, Kind, Geometry, Vector effects, Background), not from the design. Drawn in Figma first, then code.

### 11.1 — Three selection states, drawn — ✅ built 2026-11-18 (code: ✅ 2026-11-18 (apps/kolbox right rail in the three drawn states; measured against 264:41071: nothing selected 18 of 21, frame 67 of 71, rectangle 67 of 71 within 1px, font sizes equal, the misses Inter glyph widths up to 1.8; `_tmp/2026-11-18-kolbox-system/inspector-measure.md`, no-function list `no-function-inspector.md`)) (`RightRail` 147:21543 editor, both floating variants, holds the frame state: Position (alignment 6 in two groups, X, Y, rotation, rotate 90, flip horizontal, flip vertical), Layout (4 mode buttons, W, H, resize to fit, Clip content), Appearance (eye and blend; opacity, corner radius, corners toggle, 4 per-corner fields), Fill (styles, plus, the fill row), Stroke, Effects, Layout guide, Export collapsed with a plus; header Frame with chevron and 3 icons; sheet `editor selection states` 264:41071 in Desktop views: Nothing selected (Page, Styles with 4 text and 1 effect style groups, Export), Frame selected, Vector selected, three instances of one RightRail; 0 sections named Parameters, Kind, Geometry, Vector effects or Background; 1 corner radius control in the vector state; 6 missing glyphs drawn as labelled Tags, in `_tmp/2026-11-18-kolbox-system/inspector-gaps.md`)
- `RightRail` editor as three states on one sheet. Nothing selected: the page (page color, styles, export). Frame selected: Position, Layout, Appearance, Fill, Stroke, Effects, Layout guide, Export. Vector shape selected: the same sections, no more.
- Every control in his captures is drawn, the ones kolbox cannot do yet included: the header icons, the alignment row, rotate and flip, clip content, the per-corner radius, Layout guide, Export.
- Acceptance: 3 states of one `RightRail`; section names and order equal his three captures; a count of controls per section equal to his capture's, 0 left out; 0 sections named Parameters, Kind, Geometry, Vector effects or Background.

### 11.2 — Where the extra sections go — ✅ built 2026-11-18 (code: ✅ 2026-11-18 (the seven vector effects are MenuEffects rows and Effects rows on the engine's own toggles; `ui/MenuVector.jsx` is the main menu's Vector submenu with Shape parameters… and Convert to path; 0 Parameters, Kind, Geometry or Vector effects sections, 1 corner radius control; `drive-w11-effects.mjs` 14 of 14)) (`MenuEffects` 220:21653 gains its fourth group, Vector effects, heading and 7 rows; new `MenuVector` 262:39360 on one `Menu` beside MenuBoolean in Overlays: Unite, Subtract, Intersect, Exclude, Release boolean, then Shape parameters…, Convert to path, Blend…, the menu bar's Vector menu; the vector state's one corner field is Appearance's)
- Vector effects (Offset path, Smooth, Pucker and bloat, Twist, Warp, Zigzag, Distress) are entries in the Effects add menu, each added as an effect row like any other.
- Corner radius is Appearance's corner field; Geometry goes. The Kind dropdown goes. Shape parameters and Convert to path are rows in the Vector menu.
- Acceptance: `MenuEffects` lists the 7 vector effects in their own group; the Vector menu holds Shape parameters and Convert to path; the vector state of `RightRail` has exactly one corner radius control.

### 11.3 — A frame is an object — sized 2026-11-18 from a read of the engine; the smallest change is built, decided for his review — ✅ built 2026-11-18 (frame selected: selectedIds exactly ['canvas']; a 24,18 px drag at 0.5896 px per unit moved X,Y by 40.70,30.53, the whole-px move nearest 40,30, one undo entry, 0 layer x/y changed; frame fill write left the layers array untouched; saved and reopened: same fill, opacity, page color, X, Y; export at X 100 equals export at X 0, 1 rect in the frame fill at its opacity; an old file opens at 0,0 on the default fills; `_tmp/2026-11-18-kolbox-system/drive-11.3.mjs` 15 of 15, `check-11.3-frame.mjs` 4 of 4; export does not subtract the offset: layers are frame-relative)
- Read: the artboard is not an object. It is loose values in the compose store (`packages/design-editor/src/editor/compose/state.jsx`: aspect, W, H, fill, fill opacity, page color) and a magic selection id `canvas`, always drawn at 0,0. Selecting it selects every layer. A saved file forgets the frame fill and the page color today.
- Built now, one frame only: the frame gains X and Y; a press on its empty area selects it and only it; dragging it moves it; its color is its Fill, on the same fill row as any shape; the page color is its own row; fill, page color, X and Y are saved with the file; export subtracts the offset and paints the frame fill.
- Not built, each its own later piece: resize handles on the frame (W and H fields only for now), several frames, the frame as a real node in the layer list.
- Built in `packages/design-editor/src` here, as the text engine was; kol-fxr does not have it.
- Acceptance: with the frame selected `selectedIds` is exactly `['canvas']`; a drag of 40,30 on the frame changes its X and Y by 40,30 in frame units and moves no layer's stored x or y; setting the frame's fill changes only the frame; a saved and reopened file has the same frame fill, page color, X and Y; an exported SVG of a frame at X 100 has its layers at the same place as at X 0 and one rect in the frame fill; old files open with X 0, Y 0.

### 11.4 — The fill row — ✅ built 2026-11-18 (code: ✅ 2026-11-18 (`ui/FillRow.jsx` one joined field, hex segment and opacity segment split by the divider, then eye and minus; field 160 within 1px; the opacity segment 1.6 wider and the hex segment 1.6 narrower than 47 and 112, the % glyph of the browser's Inter)) (`FillRow` 84:12831, 4 of 4 variants: one field holding a `hex` segment (swatch, hex) and an `opacity` segment (value, %) split by its divider, then eye and minus; the segments carry the padding, the field none)
- His: swatch, hex, opacity and % in one joined field, then eye and minus. The build: swatch and hex in a box, opacity loose beside it.
- Acceptance: `FillRow` is one field holding swatch, hex, opacity, %; its tree equals his capture's.

## W13 — The Toggle in the file follows the build (P: "[kolbox] has this toggle, but another toggle in design, this one is correct. its wrong in toggle")

### 13.1 — `Toggle` 26:9474 redrawn from the code's toggle — ✅ built 2026-11-18 (from `apps/kolbox/src/ui/Toggle.jsx`, code / master: hit box 36 × 28 (h-control, px-1) / 36 × 28, radius 4 / 4, track 28 × 16 (w-7 h-4) / 28 × 16, track radius full / full, inset 2 (p-0.5) / 2, knob 12 (size-3) / 12, knob travel 12 / 12; on: track `accent` #FABD2F / `accent/primary`, knob `on-accent` #1D2021 / `accent/on-primary`; off: track `border` #504945 / `oq/24`, knob `text` #EBDBB2 / `surface/on-primary`; disabled opacity 0.4 / 0.4; focus outline 1 accent / 1 outside `accent/primary`; 6 variants on, disabled, focus, labelled in the grid; 26 instances; code: ✅ 2026-11-18 (Toggle.jsx and the master agree: hit 36 × 28, track 28 × 16, knob 12, travel 12, on accent / on-accent, off oq/24 / text, focus 1px accent outline, disabled 0.4; nothing added))
- The build's toggle is the right one: on is an accent track with a dark knob. The `Toggle` master in the file draws something else. The master is redrawn from `apps/kolbox/src/ui/Toggle.jsx`, every state, measured from the running part.
- Acceptance: track width, height, radius, knob size and inset, and the on and off colors of the master equal the build's computed values, as a table, within 1px and shift 0.

## W14 — Shortcuts in menus (P: "why are we not using kbd or whatever keyboard icon for shortcuts?"; "arent settings usually command ,? maybe we do that ?")

### 14.1 — A `Kbd` part for kolbox — to build on his go (code: ✅ 2026-11-18, `apps/kolbox/src/ui/Kbd.jsx`: KOL's Kbd sizes 16 and 20, one cap per key, on-accent ink on a lit row; in menus, search modal rows and footer, Settings' Shortcuts tab and dock tooltips; 0 menu rows with bare-text shortcuts in dark and light) (Figma: ✅ 2026-11-18 (`Kbd` 279:41328 in Atoms, Labels 231:2665, `Set · Kbd` with labelled columns: 16 high, 16 min wide, 4 in, radius 2, plate oq/08, ink oq/64, mono/metadata; onAccent=true the row's highlight ink over a 15% wash of it; one key per instance, `label` text property. `MenuItem` 26:9430: a `keys` slot of Kbd instances in all 6 variants, `shortcut` boolean; the old text is `meta` for the device sizes; 40 rows on Components, Foundations and Layout UI show one Kbd per key, hover rows onAccent; MenuBoolean's menu widened to the code's 160 so the keys fit; the file has no Settings menu row and no ⌘ glyph in `Icon`, so ⌘ is the typed key until it is drawn; `MenuItemMobile` untouched; 264:41071 header reads kolbox))
- Cause: kolbox's menu row draws a shortcut as plain muted mono text (`apps/kolbox/src/ui/Menu.jsx`), copied from Figma's menus, which do the same. KOL has a `Kbd` atom and its own menus use it.
- Kolbox gains `Kbd`, in the file (Atoms, Labels) and in code, sized from KOL's `Kbd` with kolbox text; `MenuItem` shows a shortcut as one `Kbd` per key.
- Acceptance: 0 menu rows drawing a shortcut as bare text; every shortcut is `Kbd` instances, one per key; file and build boxes within 1px.

### 14.2 — Settings on ⌘, — to build on his go (code: ✅ 2026-11-18, kolbox rebinds `settings-drawer` to `Mod+,` in `apps/kolbox/src/editor/engine.js`, engine keymap untouched; ⌘, opens Settings on Home, Editor, Labs and Morph with the default prevented; a bare `,` opens nothing; a comma types in a field)
- Today Settings opens on a bare `,` (`apps/kolbox/src/ui/TopRail.jsx`), the old editor's key. It moves to ⌘, on every screen, and the row shows ⌘ and `,`.
- Acceptance: ⌘, opens Settings on Home, Editor, Labs and Morph and the browser's own settings do not open; a bare `,` does nothing; typing a comma in a text field types a comma.

## W15 — The four themes, named (P: "mono and kolbox both are almost if not IDENTICAL in light mode?"; "I was talking about 'default' the default style, which has mono buttons ... We have to name it"; "kolcore, kolbox, kolminimal, kolfolio"; "well keep it kolbox for now"; "let minimal stay minimal and folio stay folio"; "minimal need light?")

Cause: I read "default mono with jetbrains" as a theme called mono and built kolbox's colors in JetBrains Mono, so it differs from kolbox by the font only. He meant KOL's own default look.

### 15.1 — The names — RULED 2026-11-18 ("let minimal stay minimal and folio stay folio. so kolcore will be default and kolbox kolbox"); to build on his go (code: ✅ 2026-11-18 (kol-color.css variants kolcore, kolbox, minimal, folio; Settings Theme row lists the four in that order; 0 `mono` variant values in code or docs; kolbox still boots kolbox)) (Figma: ✅ 2026-11-18 (`theme` and `type` carry exactly eight modes, kolcore, kolbox, minimal and folio each dark and light, 0 named mono; Themes rows labelled the same))
- The themes are `kolcore`, `kolbox`, `minimal`, `folio`. `kolcore` is the name for KOL's default look. In `packages/theme/kol-color.css` (`data-theme-variant` values), kolbox's Settings Theme row, the Figma `theme` and `type` modes, the Themes sheet's labels, and the docs.
- Acceptance: exactly those four values in code, in Settings and in the Figma modes; 0 uses of `mono` as a variant value.

### 15.2 — `kolcore` is KOL's default look; the theme called mono goes (code: ✅ 2026-11-18 (0 mono blocks; kolcore equals no variant on 602 of 602 variables in all four theme states; in kolbox 17 of 17 sampled colors and both families equal KOL default in dark and light; a saved mono boots kolbox; kolbox and folio unchanged on 602 of 602)) (Figma: ✅ 2026-11-18 (the mono modes 262:12/262:14 and 262:13/262:15 renamed kolcore and refilled, no node lost a mode; 117 of 117 colors equal the library's theme Dark and Light with aliases resolved; type: KOL's default sans and mono set as strings, the sans is one the plugin cannot load, so no text was edited; `themes.json` carries kolcore))
- `kolcore` sets nothing: it is KOL's default colors and families, unchanged, under a name. The `mono` blocks are removed from `kol-color.css` and the mono modes from Figma; a saved choice of `mono` falls back to `kolbox`.
- Acceptance: with `kolcore`, every color and family variable equals KOL's default with no variant set, in all four theme states; 0 mono blocks or modes left.

### 15.3 — `minimal` gets a light look — decided for his review (code: ✅ 2026-11-18 (minimal light and dark follow the theme state; light equals themes.json `minimal light` 416 of 416, dark unchanged 602 of 602; ink 20.5, muted 6.5, accent 20.5, status 4.51 to 4.54 on white; screenshots `_tmp/2026-11-18-kolbox-system/w15/`)) (Figma: ✅ 2026-11-18 (mode minimal light 276:0 / 276:1, 117 of 117 colors and 3 of 3 type values copied from themes.json; 05 Themes 262:35467 holds eight labelled rows, kolcore, kolbox, minimal, folio by dark and light, each Shell with LeftRail editor in its left rail slot))
- Minimal's CSS defines dark only. Light is the plain inverse: white ground, near-black ink, the same grey steps flipped, the accent and status colors as its dark has them where they hold contrast.
- Acceptance: `minimal` has dark and light in code and Figma; in light every text role on its ground meets 4.5:1; the Themes sheet shows eight rows, four themes by two.

## W16 — Kolbox's glyphs go into `kol-icons` (P: "yeah draw icons that are missing and bring into kol-icons you mean?"; "only 7? from everything thats unique in kolbox?"; "these are all in kolbox [231:2785], why dont we move them to kol-ds")

Cause: kolbox's `Icon` set (24:9344, section 231:2785) was drawn inside the kolbox file, on a 16 grid with a 1.25 stroke, partly from his reference vectors, and never checked against `kol-icons` (24 grid, 1.5 stroke). The build takes its glyphs from `kol-icons` except 7 drawn locally in `apps/kolbox/src/ui/Icon.jsx`. So the same glyph can exist three times, and some exist nowhere.

### 16.1 — The match — to build on his go
- Every glyph in kolbox's `Icon` set, and the 7 local ones in the build, matched against `kol-icons` by what it shows: already in the set, new, or missing everywhere (freeform, independent corners, stop, UI kits, Offset path, Smooth, Pucker & bloat, Twist, Warp, Distress).
- Acceptance: a table with one row per glyph and exactly one of the three verdicts; the count of each; 0 glyphs unmatched.

### 16.2 — The new ones, drawn to the set's spec, on one review board — to build on his go
- The new and the missing glyphs are drawn to the `kol-icons` spec (24 grid, 1.5 stroke, keyline fit, `currentColor`), siblings on shared bases, and shown on one review board built the way icon reviews are built (the kol-icon skill, glyphs mode: old beside new, keylines, size control). Nothing enters the set before his look.
- Acceptance: every new glyph passes the spec check (grid, stroke, keyline, centring, no name collision); one board, every glyph on it.

### 16.3 — Into `kol-icons`, and kolbox takes them from there — on his word after the board
- The approved glyphs go into `packages/icons` and the library's Iconset page. In the kolbox file every glyph that the set has is the set's; in the build the 7 local drawings and the text tags go, replaced by set names.
- Acceptance: 0 glyphs drawn locally in `apps/kolbox/src/ui/Icon.jsx`; 0 text tags standing in for a glyph in the right rail; every glyph instance in the kolbox file resolves to a `kol-icons` glyph.
- **Done in code, 2026-11-18 (round 2, his "I just accept whatever happens in round 2"):** redrawn in the set's language (radius rule r 2 / r 1 / arc r 4.5, round caps and joins) and in `packages/icons`, unreleased. 11 of the 39 took a set substitute. New in `layout`: `component-01` (now the outline; the solid is `component-01-solid`), `corner-top-left`, `corner-top-right`, `corner-bottom-right`, `corner-bottom-left`, `corner-independent`, `aspect-ratio`, `section`, `layout-freeform`. New in `design`: `keyframe`, `stroke-weight`, `stroke-sides`, `flatten`, `shadow-inner`, `shadow-drop`, `blur-layer`, `blur-background`, `noise`, `texture`, `glass`, `perspective`, `paint-solid`, `paint-noise`, `offset-path`, `pucker-bloat`, `twist`, `warp`. New in signal `cap`: `join-miter`, `join-bevel`, `join-round`. Staging, substitute table and board: `_tmp/2026-11-18-kolbox-icons-r2/` (https://claude.ai/artifact/1WAFe2Wu9yWNGKt4AdaQUa). The map for the kolbox swap (148 rows): `_tmp/2026-11-18-kolbox-icons-r2/kolbox-map.md`. Open: the swap in `apps/kolbox/src` and the Figma side.
- **Swap done, 2026-11-18:** kolbox now takes its glyphs from the set: `apps/kolbox/src/ui/Icon.jsx` resolves every name through a kolbox-to-set name table, 0 drawn locally; the old drawings are in `_tmp/2026-11-18-kolbox-migration/icons/`. Open: the Figma side.

## W17 — Kolbox light, near neutral (P: "the light is rediculous"; "pull grounds back to near neutral")

Cause: kolbox had no light look, so an agent derived one from Gruvbox's light palette and marked it for his review. Every ground came out cream and yellow (ground #f9f5d7, panel #fbf1c7, page #F2E5BC), so the whole app reads as a wall of yellow.

### 17.1 — The grounds in code, for his look — to build on his go (code: built 2026-11-18 (mix: each ground 24% toward white, then cut to 30% of its chroma in Oklab at the same lightness, decided for his review because 24% alone still read cream; ground #f7f6f0, panel #f6f4ea, oq 08 #eeebe2, 16 #e8e4db, 24 #d7d3cb, 32 #c6c2bc; every ink ratio held or rose, text lowest 7.77; kolbox dark, kolcore, minimal, folio 0 variables changed; Figma values `_tmp/2026-11-18-kolbox-light/values.md`))
- In the kolbox light block of `packages/theme/kol-color.css`: the grounds (surface primary and secondary, and the pinned steps that carry canvas, field, border and line) move to a near-neutral warm white and its greys. The ink, the accent and the status colors stay Gruvbox's.
- First cut, from his own find (P: "I pressed command , for settings and it got lighter and it was immedietly better"): what he saw is the modal's backdrop, a 24% white veil over the app. So each ground starts as today's value mixed 24% toward white (ground #f9f5d7, panel #fbf1c7, page #F2E5BC and the pinned greys the same way), and is tuned from there.
- He reloads kolbox with Mode on light and looks. Nothing goes to Figma before that.
- Acceptance: in kolbox light, with no modal open, each ground equals today's value mixed 24% toward white within 2 per channel; text on each ground at least 4.5:1; accent and status hex unchanged; kolbox dark unchanged on every variable.

### 17.2 — The same values into Figma — on his word after the look
- The `kolbox light` mode in the kolbox file and in the library takes the values he accepted; the Roles and Surfaces tables and the Themes row follow.
- Acceptance: code and the Figma mode equal on every variable of kolbox light.

- His ruling 2026-11-18 on seeing it: the mustard accent reads "weird" on the neutral ground; kolbox LIGHT's accent is rust `#AF3A03` (Gruvbox's light orange), dark keeps its yellow. Built in `packages/theme/kol-color.css`. Note: `--ui-warning` in kolbox light is the same `#af3a03`. Figma: one more variable to set with the values in `_tmp/2026-11-18-kolbox-light/values.md`.

## W18 — Pinch zoom on the canvas is slow and jittery (P: "pinch zoom in and out on canvas is slow and jittery")

Cause: not known yet. Nothing is changed before it is measured. Suspects from today's work, each to be ruled in or out by the profile: the top rail's zoom readout re-rendering the rail on every zoom step; the rulers re-measuring on every view change (added with the frame's X and Y); the frame now drawn at an offset. The real editor (`apps/editor`) on the same engine is the baseline.

### 18.1 — Profile, then fix the cause — ✅ built 2026-11-18 (profile first, `_tmp/2026-11-18-canvas/zoom-profile.md`: each wheel event was its own setView and the zoom store re-rendered the menu data, apps/editor's `MenuTop` (14ms a render) and kolbox's `Screen` through `useMenus` (15ms); fix in the engine: `PanZoomViewport` folds wheel and pinch steps into one setView per frame, `zoomStore` gains `useZoomSettled` (150ms rest, a transition) for MenuTop, useFloatMenus and kolbox's useMenus, readouts stay live; 60-event pinch over 33 layers with a loop and a generated layer, before / after: kolbox 7 / 0 frames over 16.7ms, 6 / 0 over 33ms, longest task 86 / 16.8ms; apps/editor 11 / 0, 7 / 0, 88 / 34.8ms; point under the cursor 0.00px drift both; kolbox readout ends 65% of 65; clips `before/` and `after/*-pinch.mp4` at 30fps)
- A pinch on the canvas is recorded in kolbox and in `apps/editor` with the same file: a performance trace (frame times, what runs per wheel event) and a 30fps screen recording of each.
- The cause the trace names is fixed, and only that. If the first fix does not move the numbers, stop and report with the trace.
- Acceptance: during a 2 second pinch in kolbox, 95% of frames are under 16.7ms and none over 50ms; kolbox's median frame time is within 10% of `apps/editor`'s; the recording, watched, shows the canvas following the fingers without steps.

## W19 — The editor against his design 149:26890 (P: "canvas is wrong , heres the design"; "code is wrong chevrons too big color shouldnt be there, wrong icons etc."; "sidebar code terrible"; "remove 'space to pan' text its stupid"; "this is not in design"; "both design and code need this"; "the 'saved' doesnt need to be hard coded, its just notification"; "why is this in the canvas?"; "why are these styles here? no styles should already be saved, thats a per file thing")

The design is the editor at 149:26890 on Layout UI. Everything below is measured against that node, nothing else.

Cause, one for the right rail and the dock: I briefed both from his captures of FIGMA'S OWN app (its right panel, its dock), control for control, when those captures were there to show the model (what a selection shows, where effects live). So the build and the masters gained Figma's layout modes, clip content, per-corner fields, Layout guide, a well with search and the color pair. His design has none of them.

### 19.1 — The right rail is his design's (design 149:26890; build "terrible") (Figma: ✅ 2026-11-18 (RightRail editor, both floating values: the design's header and seven sections; out-list in `_trash`; 3 states on 264:41071 one rail)) (code: ✅ 2026-11-18 (header, Position, Layout, Appearance, Fill, Stroke, Effects, Export as 149:26890 draws them; layout modes, fit, Clip content, corner fields, corners tag and Layout guide out; per-corner radius is Layer › Corner radius…; boxes against 149:26890: frame 44 of 44, rectangle 54 of 54 within 1px, font sizes equal, dark and light, `_tmp/2026-11-18-kolbox-system/w19-rail-measure.md`; no-function list and lost-controls.md updated))
- His rail, top to bottom: the header (layer name, then the icons, no "Frame" chevron row); Position (six align buttons in two groups, X, Y, rotation, rotate, flip, flip); Layout (W, H, one icon); Appearance (opacity, corner radius, one corners icon; eye and blend in the header); Fill (the joined field, eye, minus; styles and plus in the header); Stroke (the same, then position dropdown, weight, two icons); Effects; Export.
- Out of the masters and the build: the layout mode row (freeform, vertical, horizontal, grid), fit, Clip content, the four per-corner fields and the "corners" tag, Layout guide. The `RightRail` master and its three states are corrected to this, then the build follows.
- Acceptance: the section list and each section's control count equal 149:26890's rail; every control's box in the build within 1px of the design's; 0 controls in the build or the master that the design does not draw.

### 19.2 — The tool dock is his design's (Figma: ✅ 2026-11-18 (ToolDock 28:9326 415 wide, the design's 8 tools and 2 dividers, chevrons 12; well and divider to `_trash`; transport checked)) (code: ✅ 2026-11-18 (`editor/tools/ToolDockEditor.jsx`: the design's 8 tools, 2 dividers, 0 wells; dock 415 × 48, every cell and divider at the design's x within 0, chevron cell 24 × 32, the design's 12 chevron; glyphs: select, pen, rectangle, T, hand, image and the chevron drawn in `ui/Icon.jsx` from the design's vectors, crop and `pattern-tool` your icons'; 10 above the canvas foot; dock centred, 58.5 left of the design's off-centre x, decided for review; search and the paint pair are Tools rows, `_tmp/2026-11-18-kolbox-system/lost-controls.md`; table `w19-chrome-measure.md`))
- His dock: select with chevron, pen with chevron, rectangle with chevron, text (T) with chevron, the grid tool; a divider; hand with chevron; a divider; image, crop. Small chevrons. No well, no search, no color pair.
- The build's glyphs are the design's glyphs (its pen, rectangle, T, image and crop differ today). The search and the fill and stroke pair leave the dock in both the master and the build; where they go is his call (TALK), they are not dropped silently: until he rules they are reachable from the Tools menu.
- Acceptance: tool count, order, dividers and glyphs equal the design's dock; chevron size equal; every cell within 1px; 0 wells.

### 19.3 — The canvas is his design's (Figma: ✅ 2026-11-18 (CanvasReadout and "Space to pan" off all 25 Shell screens and the design; components kept; frame label left as his call)) (code: ✅ 2026-11-18 (fresh file: 0 rulers, the 4:5 tag hidden from kolbox's CSS, 0 readout, 0 "Space to pan", 0 canvas text outside the frame and its label; rulers on Shift+R and View, the choice remembered across reloads; engine not edited))
- His canvas: the page ground, the frame with its selection outline and its label, nothing else. The build shows rulers, a "4:5" tag inside the frame, and a readout over the ruler corner.
- "Space to pan" goes, from the design and the build.
- The readout at the canvas's top left ("Untitled 1080 × 1350"): it is there because the design draws one ("Composition 01 1080 × 1350") and the build copied it. He asks why it is in the canvas. TALK: it goes from both, and the frame's name and size live on the frame's own label, unless he wants it kept.
- Rulers and the "4:5" tag: not in the design. They are off by default in the build; rulers stay switchable from the View menu.
- Acceptance: with a fresh file, the canvas area in the build holds exactly what the design's holds; 0 text on the canvas outside the frame and its label.

### 19.3b — The selection label is the layer's name; the dock sits right on every screen (P: "just name of layer, not something pre decided"; "ok why is this on me?") (Figma: ✅ 2026-11-18 (SelectionBox default and 25 screen labels read the selected layer's name; Shell's transport moved up to sit 8 above the dock, 21 docks reset to the design's 571,842; labs, morph and generator window draw no dock)) (code: ✅ 2026-11-18 (the label part: `pages/Editor.jsx` FrameLabel reads the selected layer's Layers-row name and nothing else, "Rectangle" over the rectangle, "Canvas" over the frame, 25 up and 1 out within 0.2, accent while selected, dark and light; the Figma screens' dock is not code's))
- The label on a selected frame or layer reads that layer's name and nothing else. In the file it reads "Flow · selected layer", a made-up string: every screen's label takes the name of the layer it marks. In the build the label is the selected layer's name.
- On 18 screens that have the transport on, the tool dock is pushed below the frame. That is a fault in my work, not a call for him: on every screen the dock sits where the design at 149:26890 has it, with the transport on or off.
- Acceptance: 0 selection labels in the file or the build holding text other than a layer's name; on all 25 screens the dock's box is inside the frame at the design's position, 0 docks outside their screen.

### 19.4 — The left rail (Figma: ✅ 2026-11-18 (collapse-all IconButton in the Layers header, master and 25 rails; new Icon `collapse-all`; no foot row anywhere)) (code: ✅ 2026-11-18 (foot row gone, `LayersFooter.jsx` to `_tmp/2026-11-18-kolbox-system/retired/`; Layer menu gains Insert (22.1), Duplicate, Delete, Adjustment, Mask layer, beside Group selection, Layer Effects…, Live Filters; Collapse all (`fold-vertical`, 16, right edge 224 as the design's slot) closed 5 rows to 3; Canvas root stays open, decided for review))
- The row of icons at the foot of the left rail (add, folder, FX, mask, adjust, filter, duplicate, delete) is not in the design: it goes. Each of its actions stays reachable from the Layer menu, listed one by one, except the plus: its add-layer menu is handled by 22.1.
- The Layers header gains the collapse-all button at its right, in the design and the build (his capture of Figma's Layers header is the model).
- Acceptance: 0 parts in the build's left rail that the design does not draw; the Layers header has the button in master and build, and it collapses every group; every action of the removed row is reached once from a menu.

### 19.5 — Saved is a notification (Figma: ✅ 2026-11-18 (DocumentTitle save state out of both variants, to `_trash`; its two properties removed)) (code: ✅ 2026-11-18 (0 save marks in the top rail; ⌘S raised 1 toast, "Saved" with Show in Files; no unsaved mark at all))
- The fixed "Saved" and "Unsaved" mark beside the file title goes, from the design and the build. Saving raises the toast; an unsaved file says so the way the title does it in the design (TALK if he wants a mark at all).
- Acceptance: 0 fixed save marks in the top rail in master and build; saving shows one toast.

### 19.6 — No styles in a new file (Figma: ✅ 2026-11-18 (nothing-selected state: Styles is title and plus, 0 rows; sample rows to `_trash`)) (code: ✅ 2026-11-18 (Styles is its title and plus; 0 style rows in a fresh file, 0 hard-coded style names))
- With nothing selected the rail lists "inter, mono, mobile, sans, shadow": those are the kolbox Figma file's own style names, copied into the build as if they were content. Styles are per file: a new file has none, so the Styles section shows its title and plus and nothing else. The master's sample rows are marked as sample content.
- Acceptance: a fresh file shows 0 style rows; the build holds 0 hard-coded style names.

### 19.7 — UI text is not selectable (P: "and we need to disable text selectable") (code: ✅ 2026-11-18 (`user-select: none` on body in index.css's chrome block, inputs, textareas and contenteditable opt back in; ⌘A selects 0 chrome characters on Home, Editor, Labs and Morph, dark and light; a field, a layer rename and canvas text in edit still select))
- A drag or ⌘A over kolbox's chrome selects its labels today (his screenshot: KOL, Untitled, Saved, Pages, Page 1, Layers, Canvas all highlighted). The chrome's text does not select; text the user types or reads as content still does: inputs, the text tool on the canvas, rename fields, and values meant to be copied.
- Set once on kolbox's root, with inputs and editable content opting back in, not per part.
- Acceptance: ⌘A on Home, Editor, Labs and Morph selects 0 characters of chrome; a drag across both rails selects nothing; text inside an input, a rename field and a text layer being edited still selects.

### 19.8 — Eye and lock show on hover only (P: "eye and lock shoud be only viisble on hover") (code: ✅ 2026-11-18 (`editor/layers/LayersList.jsx`: selected row, pointer elsewhere 0 icons; under the pointer 2; hidden row 1, locked row 1; dark and light))
- In the Layers list the eye and the lock show on the selected row all the time. They show only while the pointer is over a row, selected or not. A layer that is hidden or locked keeps its own mark visible, so the state is never invisible (decided for his review).
- In the `ListRow` master the same: the two icons belong to the hover state.
- Acceptance: a selected, visible, unlocked row with the pointer elsewhere shows 0 trailing icons; any row under the pointer shows both; a hidden or locked row shows its one mark without hover.

### 19.9 — One color popover everywhere (P: "wrong color picker popover … its correect here [Fill] but not in 'page'") (code: ✅ 2026-11-18 (FillRow opens PopoverColor itself when its caller hands none, beside the rail level with the swatch; Page, the frame's fill, Labs' and the effect cards' colors no longer fall through to the platform picker; 0 `type="color"` in apps/kolbox/src; Page swatch opens the popover and a picked swatch changes the page color, dark and light))
- The Page color's swatch opens the operating system's color window ("Choose a color"). Fill opens kolbox's own color popover, which is the right one. Every swatch in kolbox opens kolbox's popover: Page, Fill, Stroke, the frame's fill, Labs' colors, the generator window.
- Acceptance: 0 native color inputs left in `apps/kolbox/src`; clicking the Page swatch opens the same popover part as Fill, anchored to its swatch; a color picked there changes the page color.

## W20 — Labs and Morph after today's changes (P: "labs transport is broken"; "labs rail is off and it scrolls horizontally in the rail"; "more rail styles should be shared between editor and labs f.e. color in editor vs color in labs"; "left rail in morph is not for whatever this is it should be like labs just the tree?")

Cause, for the first two: today's rail and dock work changed parts that Labs shares with the editor (`RailSection`, `Input`, `Slider`, the dock shell the transport sits in) and every check was run on the editor alone. The agents said so in their reports ("RailSection, Input and Slider changed for every rail") and I did not have Labs looked at.

### 20.1 — Labs' transport (code: ✅ 2026-11-18 (cause: Input's lead is now a 16 letter slot, so "Loop /" wrapped; and the dock's well; `ui/ToolbarTransport.jsx` lets the lead run its width on one line and the value hug; `ui/ToolDock.jsx` draws no well; cells 32, 4 apart as Transport 28:9433, 0 wraps, 0 overlaps, playing and paused))
- Seen: the loop length reads "Loop / 4 s" broken over two lines and running into the field beside it; the group at the right sits in a well it did not have.
- Measured first against the file's transport (`Transport` 28:9433 on `ToolDock`), then fixed where it differs.
- Acceptance: every part of the transport within 1px of the file's; 0 text wrapping; 0 parts overlapping.

### 20.2 — Labs' right rail fits its width (code: ✅ 2026-11-18 (cause: a row's hidden tooltip, absolute, widened the rail body to 271; RightRail clips its content sideways; scroll width 240 = client width on every tab of Flow, Math, Penrose and Morph, insets 16 and 16, 0 labels at an edge, dark and light, `w20-labs-measure.md`))
- Seen: the rail's content is wider than the rail, so it scrolls sideways and the labels are cut at the left ("pe", "tegory", "eme"); rows sit at uneven insets.
- Acceptance: at 1440 × 900 the rail's scroll width equals its width on every Labs tab (Generate, Style, Animation) and every lab; every row's left and right inset equal the editor rail's; 0 clipped labels.

### 20.3 — One set of rail parts for the editor and Labs (code: ✅ 2026-11-18 (`labs-shared-parts.md`; new `ui/ButtonGroup`, `ui/DropdownStepper`, `ui/Textarea`; Labs' color row is the editor's FillRow, same box; 0 hand-drawn parts left in labs/ that ui/ has))
- Seen: the same job drawn twice. A color in the editor is the joined fill field (swatch, hex, opacity, %, then eye and minus); a color in Labs is a labelled swatch-and-hex box of another shape.
- A list of every control Labs' rail draws beside the editor part that does the same job: color, slider with value, dropdown, on and off, tabs, buttons. Where the editor has the part, Labs uses it; where Labs needs something the editor lacks (the Roll chips, the preset stepper), it is one shared part, in the file too.
- Acceptance: the list, one row per Labs control with the shared part it uses; 0 controls in `apps/kolbox/src/labs` that redraw a part `ui/` already has; a color row in Labs and in the editor have the same box, within 1px.

### 20.4 — Morph's left rail is the tree, as in Labs — reading confirmed 2026-11-18 ("I think so") (code: ✅ 2026-11-18 (`ui/Shell.jsx` draws the timeline over the canvas only, 960 wide, under neither rail; Morph's rail 0, 56, 240 × 844 equals Labs'; 0 timeline parts in it; play ran 0 to 1.3 s, Add a key 3 keys to 4))
- Seen: Morph's left rail holds the Shape, Blend and Crossfade tree, has no header, and its foot is taken by the timeline's transport and track heads ("Layers", "Morph").
- The left rail in Morph is the same rail as Labs', header and picker tree and nothing else, full height; the timeline keeps to its own area and does not take the rail's foot.
- Acceptance: Morph's left rail and Labs' left rail are the same part with different content; the rail's height in Morph equals Labs'; 0 timeline parts inside the rail.

## W21 — The generator window's sliders do nothing (P: "none of the sliders do anything to the preview in tools/generate if you wanna add that?")

Cause: not known yet. Seen in Stripe Array, section Field: Radius X and Y, Angle, Frequency X and Y, Phase, Bend, Span, Offset, Seed move and the preview stays the same, with Live preview on. Two candidates, to be told apart by reading the engine: the window's controls were never connected to the generator's settings (the earlier build marked some "Not wired"), or they are connected and this style does not read the field.

### 21.1 — Every control in the generator window changes the preview, or is listed (code: ✅ 2026-11-18 (cause: the chain is whole, Stripe Array and Tiling draw no field, ramp, mask or warp, Radial Array reads field and mask only with Width by field, which the window has no control for; the window's three unbound controls now in their normal look; 377 of 513 controls change the preview, 128 listed in `no-function-generator.md`, 8 Photo layer not measured; Apply's layer path equals the preview's; table `w21-controls.md`; engine untouched))
- For each generator and each section (Field, Ramp, the style's own, Mask, Warp, Randomness, Frame): which controls the engine's generator reads. Each one that it reads is connected, so moving it redraws the preview and Apply writes it to the layer. One the engine has no setting for stays in place, does nothing, and goes on the "no function yet" list with what it would do.
- Acceptance: for every control in the window, either the preview's pixels change when it moves from its lowest to its highest value (read by script, per control), or it is on the list; 0 controls that are connected in the engine and dead in the window; Apply gives the layer the same picture the preview showed.

## W22 — The layer model: shapes, text and frames; the rest is a fill or an effect (P: "the layers are still kind of incorrect. there should be no + for new layer, new layer is created with shape tool, or drag and drop, photo layer is just any layer with fill set to photo, pattern sholud be effect, text is just T, loop would be any layer with motion effect and motion timeline mode active, Kinetic type would be effect, no idea what 'misc' layer is, no idea what empty layer is, and generate would be effect")

Cause: kolbox shows the old editor's layer types as they are in the engine (`packages/design-editor/src/editor/compose/state.jsx`, `ALL_LAYER_TYPES`: pattern, photo, shape, text, loop, kinetic, misc, group, generate), through an add-layer menu on a plus. His model is Figma's: a layer is something drawn; what it is filled with and what is done to it are properties of the layer.

| Old layer type | In his model |
|---|---|
| Shape | a layer, made with the shape tool |
| Text | a layer, made with the text tool (T) |
| Photo | any layer whose fill is an image; also made by dropping an image on the canvas |
| Pattern | an effect on a layer |
| Kinetic type | an effect on a text layer |
| Generate | an effect on a layer |
| Loop | any layer with a motion effect, worked in the motion timeline |
| Misc | unknown to him: to be read and reported |
| Empty layer | unknown to him: to be read and reported |

### 22.1 — No plus for a new layer — to build with W19 (code: ✅ 2026-11-18 (no plus anywhere; Layer › Insert holds Pattern, Loop, Kinetic type, Misc, Generate; the rectangle tool, the text tool and a dropped image each made a layer, 3 to 4, 5, 6; engine types untouched))
- The add-layer menu and its plus go. A layer is made with the shape tool, the text tool, or by dropping a file on the canvas.
- Until 22.2 to 22.5 are built, the old types that have no other door (Pattern, Loop, Kinetic type, Misc, Generate) stay reachable from one temporary submenu, Layer › Insert, so nothing a user could do is lost. It goes when the last of them has its new home.
- Acceptance: 0 plus buttons that open a list of layer types; the shape tool, the text tool and a dropped image each make a layer; every old type is still made once, through the tool or the temporary submenu.

### 22.2 — Photo is a fill — to size from the engine, then build on his go (code: ✅ 2026-11-19 (sizing `_tmp/2026-11-19-layer-model/sizing.md`; `compose/layerModel.js`: a photo is a rectangle with `fill: { type: 'image', … }` holding every photo field, drawn by the old photo code; kolbox only, flag `layerModel` on its Editor; old photo files plain, cropped and filtered: canvas and PNG export 0 px changed, dark and light; driven: Fill › Image on a rectangle and an ellipse, swap, eye, minus, clipped to the ellipse, duplicate carries it, export within the old engine's own canvas-to-export difference; 0 photo entries in kolbox menus; apps/editor keeps the old type and draws a converted file 0 px changed; not reached: crop on the canvas))
- A fill has a paint type; image is one of them. Any shape can take an image fill; a dropped image makes a rectangle with that fill. Old photo layers open as rectangles with an image fill.
- Acceptance: 0 photo entries in any menu; a rectangle given an image fill renders as the old photo layer did (pixel-equal at the same size and crop); an old file with a photo layer opens and looks the same.

### 22.3 — Pattern, Kinetic type and Generate are effects — to size from the engine, then build on his go (code: ✅ 2026-11-19 (rows in `layer.content`, drawn by the old layer code; Effects › Generate › Screens, Arrays, Line effects, Repeat each add a row and open the family's window on it; Effects › Layer effects › Pattern, Kinetic type open their card (the old Parameters in a `ContentScope`), decided for review; driven on a rectangle, dark and light: row added, two settings changed, off, on (same picture), settings reopen, removed leaves the plain rectangle; old pattern, kinetic and generate files 0 px changed canvas and export; Layer › Insert holds only Misc; not reached: kinetic element editing on the canvas, Flatten inside the Pattern card does nothing))
- Each is added to a selected layer from the Effects menu and listed in the layer's Effects with its settings where effect settings open (the generator window for Generate). Old layers of these types open as a layer carrying the effect.
- Acceptance: the three are in the Effects menu and not in any layer menu; an old file with each opens and looks the same; removing the effect leaves the plain layer.

### 22.4 — A loop is a layer with motion — to size from the engine, then build on his go (code: ✅ 2026-11-19 (a `loop` row, listed as Motion, from Effects › Layer effects; old loop files 0 px changed canvas and export; driven: plays (frames 0.7 s apart differ), webm export 710 KB; undo and redo reach all 36 recorded states of the whole drive in order, dark and light; not reached: the timeline cannot bind a row's params yet))
- There is no loop layer. A layer with a motion effect is a loop, and it is worked with the motion timeline on.
- Acceptance: 0 loop entries in any layer menu; an old loop layer opens as a layer with its motion effect and plays the same.

### 22.5 — Misc and Empty layer — read first (read 2026-11-19, no change: Misc is Para Type, a generative letter composition (`state.jsx` ALL_LAYER_TYPES `misc`, "placeholder home for rule-driven generators that are neither Generative types nor Effects"), drawn by the loop code (LayerRenderer `case 'misc'`, build.js loopLayerSvg); made by Layer › Insert › Misc, Tools › Type › Para Type and the generator window's Paratype letter Apply; used by the shipped Labs file Composition › Para Type (library/shipped.js 68). Empty layer is `group` with no children (state.jsx 428, Affinity's Add Layer: an empty container to drop layers into); no door in kolbox, no shipped file uses one. His call)
- What each is in the engine, what makes one, and what files use them, reported in plain words. Then they are folded into the model above or retired, on his call.
- Acceptance: a written answer for each, with the engine file and what it does; no change before he rules.

## W23 — The generator window, made usable (P: "I cant grab or move the modal at all"; "some weird hover above Expand"; "these are the type of what? these are the cusom what? and these layers are what?"; "field map cant click"; "weird way to show light why not drag in frame?"; "we have to connect the r2 bucket so we can route images … because there is no way to upload?"; "weird scrollbar in the middle of the modal ther should be a divider or something as well?"; "I love all the settings, but they are not really the most intuative. maybe some should be hidden behind 'advanced'? and try to make this a little bit more simple?"; "maybe we need some presets and or 'randomise' value to get cool shapes?")

What the window is, in plain words: it draws one generated picture. The first dropdown is the STYLE of mark (Line Screen, Dot Screen, ASCII, Stripe Array, Radial Array, Tiling, Stipple / Mosaic). The second is a PRESET of that style ("Custom" means edited by hand). The left list is not layers: it is the steps the picture is built in (Field, Ramp, the style, Mask, Warp, Randomness, Frame). None of that is said on the window, which is the fault.

Built after W21 landed (the same files), file first where a part changes. 23.0 comes first: the phases below apply to each family's window.

### 23.0 — One frame, a window per family (his ruling 2026-11-18: "I dont like the idea of pushing every effect into the same modal … it either needs a restructure and simplification or we make some splits and give groups their own modals. tuned to their settings") — code: built 2026-11-18, no drawing, decided for review (one frame, the existing window's; the Generate window is its family's: `FAMILIES` in `editor/generate/windows.js`, Screens (Line Screen, Dot Screen, ASCII, Stipple / Mosaic), Arrays (Stripe Array, Radial Array, Tiling), Line effects (the eight `lineSwell`), Repeat and Type their own windows as before, Motion not built (W29.3); the title reads the style and the family; the Style list holds only the family's styles, 9 of 9 driven in kolbox and float, dark and light; the window opens on the style the family last showed; every step a style shows is read by it, 23.9's numbers)
- Cause of the window "comming apart at the seam": one window pushes every style through the same seven steps (Field, Ramp, the style, Mask, Warp, Randomness, Frame). W21 measured the result: 128 of 513 controls belong to a step the chosen style does not read.
- There is ONE window frame (25.1: header, steps list, controls, preview, footer) and several windows on it. Each family has its own window, with only the steps that family reads, in the order it builds its picture, and its own presets.
- The families, to be confirmed against the engine's readings in `_tmp/2026-11-18-kolbox-system/w21-controls.md` before anything is drawn:

| Window | Styles | Its steps |
|---|---|---|
| Screens | Line Screen, Dot Screen, ASCII, Stipple / Mosaic | Field, Ramp, the screen, Mask, Warp (not for Line Screen), Randomness, Frame |
| Arrays | Stripe Array, Radial Array, Tiling | the array, its ramp by index, Randomness, Frame; Radial Array's Field and Mask only behind its "Width by field" switch |
| Repeat and Type | Repeat, Paratype letter (the engine's other windows) | their own, as they are today |
| Line effects | Swell, Warp, Radial, Moire, Pinch, Flow, Rotor, Vortex (W29.2) | Source, Lines, Transition, the effect's own, Rolls |
| Motion | Wave, Keys, the lattice, the signal set, the record set, the relief (W29.3), in Labs | Time, the piece's own, Rolls |

- A style lives in exactly one window. A window is opened from the Effects menu's Generate group (23.0b), on the style last used in that family.
- Acceptance: a written table, one row per style, with its window and the steps it reads from the engine; every style in exactly one window; in every window every step is read by every style listed in it, or shown only for the styles that read it (23.9's script: 0 visible controls that change nothing).

### 23.0b — The generators are opened from the Effects menu (his ruling 2026-11-18: "Im just wondering if we move the select to effect layer? … it just seems more natural to group with other FX?"; "agreed") — code: built 2026-11-18 in kolbox, no drawing (`editor/Properties.jsx`: four rows, each a submenu, Layer effects, Shader effects (the stages by category), Vector effects, Generate (Screens, Arrays, Line effects, Repeat); each family opens its window on a selected rectangle, dark and light; with the Generate submenu open the menu ends at 748 of 900. Not built: the family is not added as an effect row on the layer, since Generate is still a layer type (22.3 unbuilt), Apply makes the generate layer as before; the dock's grid tool unchanged, his call; `MenuEffects` in Figma not drawn, the call limit)
- Generate is an effect on a layer (22.3), so its door is the layer's Effects menu, not a tool or a style dropdown in a window's header. The Effects menu has four groups, each a submenu so the menu stays on the screen: Layer effects, Shader effects, Vector effects, and Generate.
- Generate's rows are the families: Screens, Arrays, Line effects, Repeat. Picking one adds that effect to the selected layer and opens the family's window (23.0); picking the style happens inside the window, among that family's styles only. The added effect is a row in the layer's Effects, with eye and minus like any other, and its settings button reopens the window.
- The grid tool in the dock, which opens the generator today, either goes or makes a new layer with a Generate effect on it: his call (TALK). Until then it keeps working.
- Drawn in the file first: `MenuEffects` with its four submenus.
- Acceptance: the Effects menu has exactly four groups, each a submenu; Generate lists the families of 23.0 and nothing else; picking a family on a selected rectangle adds one effect row to it and opens that family's window; 0 style dropdowns that list styles of another family; the menu's height fits a 900 tall screen with any submenu open.

### 23.1 — The window moves — ✅ built 2026-11-18 (`useMovable` in kol-component `molecules/Modal.jsx`, `movable` on `ModalDialog` kolbox and settings, used by kolbox's GeneratorWindow and the engine's ModalSettings: a press and drag of 300,-120 on the header moved the window 300.00,-120.00 in kolbox and float, dark and light; past the top left it stops at 0,0, past the bottom right the header's foot stops at 900 with 160 px left on screen, decided for review; a release over the dim does not close it; a drag starting on the Style dropdown moves nothing and the dropdown still opens; close still closes; it keeps its place on a step change and when reopened; it stays a modal window on the dim; 30fps clips `_tmp/2026-11-18-generator-window/move-kolbox.mp4`, `move-float.mp4`)
- Dragging its header moves it; it stays inside the screen; its position is remembered while the app is open.
- Acceptance: a 200,100 drag on the header moves the window's box by 200,100; it cannot leave the viewport; controls in the header still click.

### 23.2 — The stray hover above Expand — ✅ built 2026-11-18 (cause: kol-component's `Tooltip variant="kolbox"` was placed in CSS inside its trigger, so the window shell's overflow hidden cut the Expand tip; it is now portalled to the body and placed from the trigger, as kolbox's menus are, so every caller has it; Expand's tip fully on screen and under no clip in kolbox and float, dark and light; Settings' tip the same; the color popover and the search window carry no tooltip; KOL default and float tooltips untouched (their code path unchanged))
- A plate shows above the Expand button on hover with nothing in it. Find what it is (a tooltip with no text, or one cut by the header) and either give it its words or remove it.
- Acceptance: hovering every control in the header shows either a readable tooltip fully inside the window or nothing.

### 23.3 — The window says what things are — ✅ built 2026-11-18 (Style and Preset each a `LabeledControl` in the header in both windows; the list is titled Steps (`sectionsLabel` on the settings variant); the field map and the lights keep their labels; 0 unlabelled header dropdowns, dark and light)
- The two dropdowns carry their labels, Style and Preset. The left list is titled for what it is, the steps, in build order, and each step's second line keeps saying its current state.
- Acceptance: 0 unlabelled dropdowns in the header; the list's title is not "Settings".

### 23.4 — Work in the picture, not in number boxes — ✅ built 2026-11-18 in kolbox (`PreviewPad` in GeneratorWindow.jsx: a press at the preview's centre set Centre 0.50, 0.50; a press on the field map at a quarter set Centre X 0.25; a light dragged by a tenth of the drawn picture moved its X 0.40 to 0.50, its rim dragged set its radius 0.30 to 0.40; Radial Array without its field takes its own centre from the press; the X, Y, Radius and Intensity boxes stay; not built in the float window)
- The field's centre is set by clicking or dragging in the preview and on the field map. A light is a handle in the preview: drag to move it, drag its edge for the radius; the X, Y, Radius and Intensity boxes stay, under Advanced.
- Acceptance: a click at the preview's centre sets Centre to 0.50, 0.50 within 0.01; dragging a light handle by 51 px on a 512 preview changes its X or Y by 0.10 within 0.01; the field map answers a click.

### 23.5 — Images come from Media and from a drop — to size first — built 2026-11-18 as far as this repo connects (kolbox: Media is the fixture library, `media-fixture`'s client, shown as R2 kol-media; the Photo layer row gains From Media, which opens the media picker and puts the pick as a photo layer over the frame, and a file dropped on the window does the same, both set the field and change the preview, dark and light. Not built: listing or uploading to the real R2 bucket, which needs the media worker and its keys, not connected here; the float window)
- The Image source lists only "None" and there is no way to add one. It takes an image from Media (the R2 bucket behind it, through the media client the engine already carries), from a dropped file, and from an image already in the document.
- First a read: how Media is connected in this repo and in kolbox (`@kolkrabbi/kol-media-client`, the engine's `library/mediaLibrary.js`, kolbox's Media entry), and what is missing for kolbox to list and upload. Reported before building.
- Acceptance: the Image source lists the bucket's images; picking one makes it the field and the preview changes; dropping a file on the window does the same.

### 23.6 — The middle column scrolls quietly, and the columns are divided — ✅ built 2026-11-18 in kolbox (the three columns scroll on a 6 px bar, thumb the border ink, no track, Tailwind utilities; one 1 px divider before the preview, the colour of the header's line, dark and light)
- The settings column's scrollbar is a thick grey bar in the middle of the window. It takes kolbox's thin scroll style, and a divider stands between the settings column and the preview column.
- Acceptance: the scrollbar's thumb is at most 6 wide and takes the border color; one 1px divider between the two columns, the same line the header's is.

### 23.7 — Simple first, the rest under Advanced — ✅ built 2026-11-18 (`SIMPLE` and `splitSection` in windows.js, rendered by both windows: one Advanced row per step, closed by default, its state kept per step; every closed More group goes under it; with Advanced closed the most a step shows is 6 (Line Screen's Ramp); every control still reachable; the split is the SIMPLE table, the first six visible where a step has none, decided for review)
- Each step shows the few controls that change the picture most; the rest fold under one Advanced row, closed by default, remembered per step. Field: Type, Centre, Radius; Advanced: Angle, Frequency X and Y, Phase, Bend, Span, Offset, Seed, the light boxes, Second source. The other steps the same way, the split written down per step for his review.
- Acceptance: with Advanced closed no step shows more than 6 controls; every control is still reachable; the split is a written table, one row per control.

### 23.8 — Presets and Randomise — ✅ built 2026-11-18 (every style lists at least 6 presets: Tiling, Stipple and Mosaic filled with named window presets, the seven Line effects boards with five engine rolls each, named by roll, decided for review; Randomise in both footers starts from one of the style's presets and rolls every visible slider but Frame's within a quarter of its range, rolling again when nothing is drawn; 20 presses gave 20 different previews, 0 blank or solid, in kolbox and float, dark and light, and 20 of 20 per style read from the engine)
- Each style has presets worth picking (at least six, named for what they look like), and one Randomise button that rolls the step's values inside ranges that give a usable picture; the engine's own rolls are used where it has them. Randomise never touches Frame.
- Acceptance: every style lists at least 6 presets; 20 presses of Randomise give 20 different previews, 0 of them blank or solid.

### 23.9 — Inside a window, a style shows only what it reads (found by W21, 2026-11-18) — ✅ built 2026-11-18 (windows.js: the steps from the engine's own flags (unsampled styles read no Field, Ramp, Mask or Warp; `warp: false` no Warp; Radial Array its Field and Mask only with its new Width by field switch); a control shows only when the engine's schema reads its param now (`engineReads`, plus each field kind's rows); read from the engine per style on its first preset, 289 visible controls: 287 change the drawing, 2 do not and are on the no-function list (Line Screen's Angle and Flare), 2 more read as dead only off the browser (ASCII's Font needs the font loaded, Radial Array's Inner radius on its first preset); `_tmp/2026-11-18-generator-window/check-visible.txt`)
- W21's finding: nothing was disconnected. 377 of 513 controls change the preview; the other 128 belong to steps the chosen style does not read. Stripe Array and Tiling read no Field, Ramp, Mask or Warp (they ramp by strip index); Radial Array reads Field and Mask only with a "Width by field" setting the window has no control for; Line Screen and Radial Array take no Warp. So on Stripe Array every Field slider is live in the store and changes nothing in the picture, which is what he hit.
- For each style the left list shows only the steps that style reads. A step it does not read is not listed; a single control it does not read is not shown. Radial Array gets its "Width by field" switch, since the engine has the setting.
- Acceptance: for every style, every control visible in the window changes the preview's pixels between its lowest and highest value (the W21 script, rerun): 0 visible controls that do nothing, apart from those on the written "no function yet" list with an engine reason.

## W24 — Edges are quiet everywhere (P: "in general, I hate the super heavy border everywhere … this is too much hey? you dont see such bright borders here [the editor]")

Cause: the overlays (modal, popover, menu, toast) and the outlined fields take a bright edge (the map's menu edge, `fg/32`) while the rails take the quiet border (`oq/24`). On a window full of outlined controls it reads as a cage.

### 24.1 — One quiet line — code: ✅ 2026-11-18 (windows, popovers, toast, tooltip and the engine's Color Modes on `kol-kolbox-surface`, the dock's shadow-dock with the quiet `border` line; 0 borders brighter than the rail divider among them, dark and light; the menus and dropdowns are the other agent's) — Figma: ✅ 2026-11-18 (every line inside a floating part and every outlined Dropdown and secondary Button binds `oq/24`; ModalTwoPane's pane rules and MenuSeparator moved off `menu/rule`; 0 `fg/32` or `menu/inset` paints on a floating master; outer outlines off as the dock; "Surfaces, one style" 317:54756 on Layout UI; values in `_tmp/2026-11-18-kolbox-system/w28-surface.md`)
- Every outline and divider in kolbox uses the rails' line: the window's edge, its header and footer rules, the outlined dropdowns and buttons, popovers, menus, the toast. The overlay keeps its shadow, which is what lifts it. In the file's masters and in the build.
- Acceptance: 0 borders in kolbox whose resolved color is brighter than the rail divider's; the generator window, a menu, a popover and the editor's rails screenshotted side by side show one line weight and color.

### 24.2 — The icon button's frame (P: "too small icon frame") — code: ✅ 2026-11-18 (`ui/IconButton.jsx`: the hover and lit fill is its own 24 square, radius 4, centred on the glyph, as the design's IconButton 112:14111 draws it; was the button's box, 16 in the rail headers and 28 elsewhere; Pages' plus now lights 24 on a 16 box, dark and light) — Figma: ✅ 2026-11-18 (`IconButton` 112:14111 was a 16 box with 24 fills hanging outside it; is 28 x 28 on `ctl/28`, radius 4, the fill on its own frame (hover `oq/16`, lit `accent/tint`, active `oq/16`), as `Button` icon only; every rail action icon in the masters and on Layout UI is now an IconButton (263 swapped), the collapse one at 24; code must follow: 28 box, not a 24 fill on 16; the old fills on `_trash` in `_W24.2 IconButton parts`)
- The hover frame of the plus (an `IconButton`) is smaller than it should be. Measured against the design's `IconButton`, then set to it.
- Acceptance: the icon button's hover frame equals the design's box within 1px, in the rails and the window.

## W25 — The color tool is a window like the generator's (P: "what is this then? is this the color tool? did we not have amodal for this? something along these lines? [float file 622:271360]")

What it is: the old editor's "Color Modes" window, carried into kolbox as it was (the engine's `color/ModalColorModes.jsx`). It builds a palette: a base color, a harmony (Analogous and the rest), Roll, a count, five colors with their roles (Accent, Background, Ink, Dim, Warm), lock and delete per color, Load palette, Save, Apply to document. Since today it opens from Tools › Fill and stroke color.

Cause: it was never redrawn. It is a stack of full-width fields and three full-width buttons, on none of kolbox's window parts. The model he points at is the window in the float file `879P1yBsBPqpdGI5a5v2Y5`, node 622:271360 (the Repeat and Paratype letter windows): header with title and kind, a steps list at the left, the controls in the middle, a live preview at the right, and a footer with Live preview, Reset, Cancel, Apply. The generator window is already on that model.

### 25.1 — One window model, drawn — file first, on his go
- The window model becomes one part in the kolbox file (the generator window is its first use): header, steps list, controls column, preview column, footer. Read from 622:271360 for its structure, drawn in kolbox's kit.
- The color tool is drawn on it: steps Base (color, harmony, count, Roll), Colors (the list with roles, lock, delete, add), Palettes (load, save); the preview shows the palette applied to the document; the footer applies it.
- Acceptance: `GeneratorWindow` and the color window are two uses of one window part, 0 parts of their own for header, list, footer; every control of today's Color Modes window is on the new one or on a written "dropped, why" list.

### 25.2 — Built — after 25.1
- The build's color window follows the file; the engine's palette functions stay as they are.
- Acceptance: every part within 1px of the file; rolling, locking, saving, loading and applying each work once, read back from the document.

## W26 — The search window needs care (P: "this needs tlc")

Seen in his capture: the tab track stops short of the window's width and reads as a loose block; the file rows are large and heavy against the rest of kolbox; two files both named "Untitled" with nothing to tell them apart; the Pages group mixes a file with pages; the footer's hints sit on a line of their own weight.

### 26.1 — Measured against its master, then tuned — file first, on his go
- The build is measured against the file's search part (`CommandSearch` and `ModalSearch`). What differs is fixed. Where the master itself is the fault, the master is redrawn first: rows on kolbox's row height and text sizes, the tab track spanning the window, a file row carrying what tells it apart (when it was edited, where it lives), groups that hold one kind of thing.
- Acceptance: every part within 1px of the master; row height and text sizes equal the menu's; 0 rows in a group that are not of that group's kind; two files with the same name differ by their second line.

## W27 — The LogoShapes ticket (lobby/inbox/LogoShapes.md, from kol-branding, staged 2026-11-18; P: "ticket goes into /p as well"; "read it now so we can send it with the plan")

Read 2026-11-18: the ticket in full, the spec in `kol-branding/docs/documentation/05-logo-shapes/` (overview, System, Tuner, the effects list, process, limits), and the engine's surface in `_files/canvas/project/line-swell.js`. The Line Swell artifact itself is a Design canvas whose boards are the `.dc.html` files mirrored in that `_files` folder; I read the mirror, not the live boards.

### What it is, in plain words
- One engine, `line-swell.js`: 193 KB of plain JS, about 80 functions, no dependencies. Settings in, SVG paths and labels out. It uses a canvas only to trace an uploaded image and the DOM only to read an SVG's own curves.
- **System**: a mark built from measures, nothing placed by hand. Circles on one axis, each grown from the last by a harmony (golden, a fifth, a scale), bands between circle pairs filled, a bar and a foot. Six handles drag the measures. A sheet of 24 rolls.
- **Tuner**: drop a logo; it fits circles and lines to the outline, snaps every radius to a ladder built from one unit and a harmony, eases corners, can turn the pieces into harmonized Bezier curves, and draws the construction over the form with keylines, a grid and a curvature comb. Simple (8 settings) and advanced (34): one component with an Advanced fold in KOL.
- **Line effects**, the second group: Swell, Warp, Radial, Moire, Pinch, Flow, Rotor, Vortex, and the two motion ones, Wave and Keys.
- 764 settings in all, every one in the spec's tables. The engine's own checks and their measured numbers come with it.

### 27.1 — Sizing, and the calls that are his
| Question | Proposal |
|---|---|
| Where it lives | An engine package beside `kol-growth` and `kol-print` (ARCHITECTURE §3, engine tier: plain JS, no React), with its components as organisms in `kol-component`, the way `GrowthLineStage` sits over `kol-growth`. Touching a canvas for tracing has the same precedent as those two. |
| Its name | `@kolkrabbi/kol-tuner` (his "ok" 2026-11-18, after I withdrew `kol-shapes` as too vague: he calls it the tuner). |
| Its app | `apps/tuner`, standalone. His ruling 2026-11-18 when I proposed dropping it: "no i like it a standalone version is valuable, since it ships as a package to other repos". It is where the engine is proved and what other repos see running. |
| Components | `LogoSystem` and `LogoTuner`. The line effects are not this package's: W29. |
| Controls | The ticket lists Slider, SegmentedToggle, Toggle, Select. A choice is a Dropdown or text tabs here, so the segmented ones become those. |
| Keylines | Reused from `IconPlate`'s `KeylineGuide`, never the engine's copy; in Figma, the published keyline guides in `library--util`. |
| Colors | Every hardcoded color on the boards is dropped for KOL tokens. |

Two things he should know before saying go:
- **The engine-tier rule asks for a second consumer that exists today.** The filer, kol-branding, is one. The line effects overlap with the editor's own generator styles (Line Screen, Radial Array and the rest in `packages/design-editor/src/generate/styles`): Swell is "lines thick where a source is strong", which is what Line Screen does with a field. Kolbox's generator could be the second consumer for that group, or the two could stay apart. His call.
- **The ticket is marked draft, and parts of the Tuner were never run on the live canvas** (upload, strokes, Bezier, comb, grid, presets, corners, reset). Round joins are not detected; thin-line marks must be read as strokes. Three things wait on his ruling inside the spec: handle balance (Tunni), snapping a form to a grid, the relief effect.

### 27.0 — Two engines (his question 2026-11-18: "should it not be split 2 engines? form tuner and the style?") — ruled
- Yes, two. The form tuner is its own new engine package, `@kolkrabbi/kol-tuner`: strict geometry with its own rules. The style side (Line Swell and the line effects) is NOT a second new package: it goes into the generator engine the editor already has (`packages/design-editor/src/generate/styles`), as a style family named `lineSwell` after his canvas, beside line screen and dot screen. That is W29.
- Where it shows in the product is the EDITOR (`apps/editor`, `pnpm editor`), in the kolbox style: his correction 2026-11-18, "kolbox is a style not an editor, pnpm is the editor". Wherever this W says "in kolbox" it means in the editor wearing the kolbox style (W32).
- Nothing blocks starting: it is all code. The per-family windows (W23) are not built, so the new styles land in today's generator window first and move when the windows are redone.

### 27.2 — The engine package — to build (the name is ruled)
- `line-swell.js` ported as ES modules, split by tool: the shared parts (harmonies, keylines, grid, grid score), System, Tuner; the line effects in a second pass. Behavior carried verbatim: a port, not a rewrite.
- Its checks come with it as the package's tests: `check-system.js`, `check-comb.js`, and the four Tuner pages as scripted checks.
- Acceptance: the spec's Measured table (04-tuner.md) holds on the port, number for number: traced area within 0.4 percent on all eight forms; fit as outline 0.03 to 0.7 percent on six; every radius on the ladder at full strength on seven; Bezier curvature mismatch at most 0.093 percent; 500 random combinations with none lacking a form or a message; both node checks pass; for 50 fixed setting sets the port's SVG paths equal the reference engine's, string for string.
- **Built 2026-11-18.** `packages/tuner` (`@kolkrabbi/kol-tuner` 0.1.0, unpublished): `util`, `harmonies`, `guides`, `construct`, `system`, `tuner` cut line for line from `line-swell.js`; the colour outputs dropped (`grey` and `light` stand in). `pnpm --filter @kolkrabbi/kol-tuner test`: check-system and check-comb equal to the reference line for line, parity 50 of 50, and tuner-w5, w9, w10, w11 run in Chrome on port and reference with equal results. Measured on the port: area worst 0.151 percent on eight; fit 0.029 to 0.693 on six, ref-05 0.848, ref-01 3.054; same pieces at both rasters on seven, ref-01 differs by 6; circle 0.029, ring 0.032; SVG as vectors exact, x1000 identical; on the ladder on seven; Bezier mismatch at most 0.093, second run 0.0008 px; ref-01 as strokes 20 lines, fit 0.22, joints 0; ref-05 as strokes 27 pieces, fit 0.79; keyline square 0.15; 500 combinations 0 without a form. Not readable: "line ends read 11 of 12" (tuner-w10's 10.2 prints nothing on the reference too).

### 27.3 — The app — after 27.2
- `apps/tuner`: System with its six handles and the 24-roll sheet; Tuner with file drop, the simple view and the Advanced fold. Real KOL controls, where the canvas had its Tweaks panel. A drag is kept (the canvas could not save one); Reset really resets.
- Acceptance: every setting in the spec's System and Tuner tables is reachable in the app; dragging each of the six handles changes its measure and the mark; a dropped SVG and a dropped PNG each give a tuned form; no color on the page that is not a KOL token.
- **Built 2026-11-18.** `apps/tuner` (`pnpm tuner`, 5220) on AppHub: System, Rolls, Tuner, each a board and a kol-shell `PropertyRail` (Advanced is its collapsible section). Settings reachable: System 26 of 29, Rolls 4 of 7, Tuner 31 of 34; the 3 left on each are palette, ink and ground, which are the KOL theme. Six of six handles change their measure and the mark, kept after a reload, Reset clears them. Dropped SVG: read as vectors; dropped PNG (ref-12): traced at 2048. Colours not a KOL token value: 0 on all three pages in dark and light (KeylineGuide's own spec colours left out). Phone at 390: no side scroll. Screenshots `_tmp/2026-11-18-tuner/`.

### 27.4 — The components in `kol-component` — after 27.3
- `LogoSystem` and `LogoTuner` as organisms over the engine, with docs, the taxonomy and inventory entries, and their masters in the Figma library in the same pass.
- Acceptance: both on the showcase with their previews; the taxonomy gate green; the app renders them from the package, 0 local copies.

### 27.5 — The line effects leave this package — his ruling 2026-11-18
- His words: "there is a devide, one one hand its style generator and the other ist hyper structured form treatment tool". The structure tools (Construct, System, Tuner) are this package. The style generators (Swell and the line effects, Wave, Keys) are W29.

### 27.5b — In the editor it is a mode on one shape, with two modes of its own (his ruling 2026-11-18: "the way I thought about it was 'glyphs' where you are working on one shape and you get speed punk heatmap and all these tools that analyse curvature"; "ok lets go for that, and it has 2 modes, generate, where you control the shape number and interaction and modify where yyou supply svg or image file")
- It is entered on ONE shape, the way a shape is entered to edit its nodes. Inside, the canvas shows only that shape with the construction lines, the keylines, the grid and the curvature comb, and the right rail shows the tool's settings. Leaving returns to the document.
- Two modes inside it:
  - **Generate** (the engine's System): there is no source. The mark is built from measures: how many shapes, how they grow on each other by a harmony, and how they combine (union or flip), with the handles dragged on the canvas.
  - **Modify** (the engine's Tuner): the source is supplied: the layer's own vector shape, a dropped or picked SVG, or a plain black and white image. It is fitted, snapped to the ladder, its corners and curves treated, with the simple settings first and the rest under Advanced.
- What it leaves on the layer is a live effect, Tune, with its amount from 0 to 100: the original shape is kept, the effect can be turned down or off, and its settings button re-enters the mode. On a shape made in Generate the measures are kept the same way.
- Where it is opened: from the layer's Effects menu (its own row, beside the Generate group), and by entering a shape that already carries the effect.
- Drawn in the file first: the mode's screen (canvas with the analysis overlays, the rail in Generate and in Modify), on the kolbox kit.
- Acceptance: entering on a rectangle and leaving without a change leaves the document identical; in Modify, a vector layer, a dropped SVG and a dropped black and white PNG each give a tuned form; in Generate, changing the number of shapes changes the mark and dragging each handle changes its measure; after leaving, the layer has exactly one Tune effect row, setting its amount to 0 shows the original shape pixel for pixel, and its settings button re-enters with the same values; every overlay (construction, keylines, grid, comb) can be switched on and off.

### 27.6 — Out the door
- Published with the other packages; kol-branding's receipt written once the registry shows the version, which is what closes the ticket there.

## W28 — The editor, his second look (P, 2026-11-18, 17 points: "bad modal"; "bad overlay and bad icons [BORDER]"; "bad boder"; "cant click in canvas to close modal"; "bad modal boder, even too intense shadow?"; "this has shadow and fx that are nice, but its the only one"; "still too intense border"; "do all menus do this? do no menus connect like normal dropdown? in FIGMA menu modal open OVER dropdown"; "too big chevrons … they are correct in toolbar"; "why is there blue accent around the canvas?"; "there are no right click context menus?"; "Pages dont work, search doesnt even work it sholud open search"; "cant double click on frame to rename, cant even move frame on canvas [3rd time i mention this]"; "PAges should not be open until you press '+' it should be like … just name and '+'"; "why does icon change so much"; "both chevrons too big"; "canvas")

(This section was lost from the file for a few hours on 2026-11-18 by an edit of mine to W27 and restored the same evening; the agents building 28.3 to 28.6 worked from briefs that quoted it, and their marks are written here from their reports.)

File first where a part changes, then the build. Each phase is driven in the running app before it closes, not only measured.

### 28.1 — The frame moves and renames (point 13: said three times) — ✅ built 2026-11-18 in the engine (`compose/CanvasArea.jsx` any press on the frame arms a frame move past a 3px dead zone, a click selects it, Shift on the frame is the additive marquee; `compose/FrameChrome.jsx` the label, double-click renames; `canvasName` in compose state, the file and the draft; rename on the Layers Canvas row in the engine's LayerStack and kolbox's LayersList; kolbox's FrameLabel now labels layers only): fresh file, one drag of 100,60 px, nothing selected first, moved the frame 100.00,60.00 px, 169.60,101.76 units at 0.5896 (kolbox) and 177.87,106.72 at 0.5622 (apps/editor); label field, Enter renames label and row, Escape cancels, row double-click renames; a drag on a layer moved it 48px and the frame 0; dark and light, both apps, `_tmp/2026-11-18-canvas/drive-28.mjs` 58 of 58, clips `drive-28/*-move.mp4`, `*-rename.mp4`)
- Pressing on the frame and dragging moves it, without selecting it first. Double-clicking its label or its row in Layers renames it. 11.3 built a move that needs the frame selected first; that is not what he asked for, and it was never driven the way he uses it.
- Acceptance: on a fresh file, one press-and-drag of 100,60 on the frame moves it by 100,60 in frame units; a double-click on the label opens a rename field, typing a name and Enter changes the label and the Layers row; both recorded as a 30fps clip and watched.

### 28.2 — Selection on the canvas is the design's (points 10 and 17) — ✅ built 2026-11-18 in the engine (`index.lib.css` takes the accent, on-accent, label ink and quiet line from :root into `[data-canvas-frame]`, past the editor's teal; the frame's line is that oq-16; FrameChrome draws the design's selection): outline 1.000 screen px, four 6 x 6 handles centred on the corners, label at -1,-25, 18 high, radius 4, 10/14 500, each the accent and on-accent of the theme in kolcore, kolbox, minimal and folio, dark and light (8 of 8); teal by hue on the canvas in hover, dragging, selected and layer selected, dark and light, both apps: 0 in 24 shots (the old 11.3 shots: 3666); kolbox frame line equals the rail divider in dark and light; apps/editor's is oq-16, its divider oq-08)
- The design: an accent outline, four small accent corner handles, and the name on an accent pill above the top left. The build draws a thin blue outline (the engine's own color) around the frame. Every selection and hover outline on the canvas takes the accent; no blue anywhere. In light the frame's 1px outline is also brighter than the rail divider (`packages/design-editor/src/editor/shell/CanvasView.jsx` around line 141): it takes the quiet line.
- Acceptance: the selected frame's outline, handles and label in the build equal the design's at 149:26890 within 1px and in color; 0 pixels of the engine's blue on the canvas in any state (hover, selected, dragging).

### 28.3 — One surface for everything that floats (points 1, 2, 3, 5, 6, 7; with W24) — code ✅ 2026-11-18 (class `kol-kolbox-surface` in `apps/kolbox/src/index.css`, the dock's shadow; on the dock, Popover and every Modal and window on it, the four popovers, ModalSearch, Toast, Tooltip; box shadow equal on all of them on Home, Editor, Labs, Morph and Settings in dark and light; 0 borders brighter than the rail divider among them; the restore prompt was already the confirm part and takes the surface through it); Figma: ✅ 2026-11-18 (effect style `shadow/dock` on ToolDock, Menu, Popover (and the four popovers and GeneratorWindow on it), Modal, ModalTwoPane, CommandSearch, Toast, Tooltip, FilePill and the floating RightRail; outer outlines off on Menu, Modal, CommandSearch and Tooltip, as the dock; one edge color `oq/24` inside them; `shadow/menu`, `shadow/modal` and `shadow/float` on no part, only their Foundations swatches; restore prompt a `Popover` instance, 0 parts of its own, view 317:53896 in Modals; review frame "Surfaces, one style" 317:54756; `w28-surface.md`)
- The dock is the one he likes: a soft shadow, a faint inner highlight, a quiet edge. Menus, popovers, the color popover, modals, the restore prompt and the toast each have a brighter border and a heavier shadow of their own. All of them take the dock's surface, as one shared style in the file and one in the build.
- The restore prompt ("Restore your last canvas?") is on kolbox's confirm window: its size, radius and buttons as the other prompts.
- Acceptance: one effect style and one edge color used by every floating part in the file; in the build the computed border color and box shadow of the dock, a menu, a popover, a modal and the toast are equal; the restore prompt is the confirm part, 0 parts of its own.

### 28.4 — A press outside closes what is open (point 4) — code: ✅ 2026-11-18 (the overlay layer in `ui/Menu.jsx` listens on the window in the capture phase, since the canvas stage stops its own presses; a press on the canvas that closes is spent, its mouse events and click swallowed; menu, dropdown and popover each close on the canvas, both rails and the top rail, selection unchanged in all 12 presses, dark and light; `_tmp/2026-11-18-kolbox-system/w28-menus-measure.md`)
- With a menu or popover open, a press on the canvas does not close it. Any press outside closes it, canvas included, and that press does not also act on the canvas.
- Acceptance: each of menu, dropdown, popover closes on a press over the canvas, the rails and the top rail; the canvas selection is unchanged by that press.

### 28.5 — A dropdown opens over its field (point 8) — Figma ✅ 2026-11-18 (`Dropdown` 26:9408: both open variants hold a `Menu` at the field's x, as wide as the field, the checked row lying on the field; a `show menu` boolean; the Zoom view's menu sits over its field, flipped to the field's right edge near the screen edge; a new view "On this page menu, open" 317:52781; the rule in numbers in `_tmp/2026-11-18-kolbox-system/w28-dropdown.md`; one audit error kept on purpose, clip off on the open variant so the menu is not cut); code: ✅ 2026-11-18 (Menu placement `over` for `Dropdown` and the zoom; 46 dropdowns driven on Home, Editor, the color popover, Settings, the generator window, Labs and Morph in dark and light: chosen row on the field in all, left edges 0 apart, menu never narrower; the file's right-edge flip; a list taller than the window starts at its rows and scrolls; typing a letter jumps; `w28-menus-measure.md`)
- Every kolbox dropdown hangs its menu below the field with a gap. In his reference the menu opens over the field, with the chosen row sitting on the field, and a dropdown takes the width of its row. All dropdowns follow that; menus that are not dropdowns (the main menu, context menus) keep opening beside their trigger.
- Still open from the file pass: the inspector's "Inside" dropdown cuts to "Insi…" in two views, because its `PropertyRow` is 12 narrower there; in code "On this page" in the color popover is fixed narrow and must fill.
- Acceptance: for every dropdown, the open menu's chosen row overlaps the field's box and the menu's left edge is within 4px of the field's; 0 dropdown menus opening below with a gap.

### 28.6 — One chevron size (points 9 and 16) — code: ✅ 2026-11-18 (`ui/Icon.jsx`: every `chevron-*` is the dock's 12 drawing at `CHEVRON` 12, whatever size a caller passes; 80 chevrons read on Home, Editor, Labs and Morph in dark and light, 0 off the dock's box or drawing) — Figma: ✅ 2026-11-18 (the dock's chevron is 12 x 12, glyph 6 x 3, `size/chevron`; Dropdown's 12 and DocumentTitle's 2 now bound, SplitButton's 16 to 12; every chevron in the masters 12 on `size/chevron`)
- The dock's chevrons are right. The ones in dropdowns, beside the file title in the top rail and in the rail header are bigger. Every chevron is the dock's size.
- Acceptance: every chevron in the build has the dock chevron's box; the same in the masters.
- Settled between file and build 2026-11-18: the file redrew `IconButton` as a 28 box (`ctl/28`, radius 4, fill on the button) after the build had copied the old master's 24. The build's lit frame is now 28 too, centred on the glyph; callers that set a 16 or 24 box keep their layout. Every rail action in the file is an `IconButton` instance (263 swapped).

### 28.7 — Pages (points 12 and 14) — to size from the engine first
- With one page the section is its title and a plus, nothing else: no list, no search. The plus adds a page and the list opens. The search icon, once there are pages, opens a find field in the rail (his reference: a field in place of the header, a filter menu, a close), and it finds layers.
- "Pages dont work": first a read of what a page is in the engine today (whether a file can hold more than one, what selecting one does). Reported, then built: selecting a page shows that page's frame and layers.
- Acceptance: a fresh file shows Pages as title and plus, 48 high; after the plus there are two pages and the list; selecting each shows its own layers; typing in find lists matching layers and Enter selects one.

### 28.8 — Right-click menus (point 11) — to build
- A right click on a layer on the canvas, on a row in Layers and on a page opens a menu for that thing, on kolbox's `Menu`: copy, paste here, bring to front, send to back, group, flatten, use as mask, show or hide, lock or unlock, flip, rename, duplicate, delete. Actions the engine has are connected; the rest are in place, do nothing, and are listed.
- Acceptance: a right click on each of the three opens kolbox's menu at the pointer and never the browser's; every connected row does its action once, read back from the document.

### 28.9 — Collapsing the left rail (point 15) — to build
- Collapsed, the build shows a narrow strip with a different icon. His reference: the rail goes, and a small floating pill at the top left holds the mark, the file name and the same panel icon, which brings the rail back. The icon is the same glyph in both states.
- Acceptance: collapsed, 0 rail strip; one pill with mark, name and the panel icon; the icon's glyph is identical in both states; the canvas takes the freed width.

## W29 — The style generators go into Labs and the generator (P: "it takes a style like this and makes is fully gererative and customiseable with a bunch of settings"; "I would even look at another file, grab the emboss 3d map … the three record animation, pattern animation … and the signal animation … what do you think")

Read 2026-11-18, four canvases:

| Canvas | What is in it | State |
|---|---|---|
| Line Swell (`4Npm9zbKAg753Cz4TMPSKw`) | Swell with 15 presets, Warp, Radial, Moire, Pinch, Flow, Rotor, Vortex, and the motion ones Wave and Keys; a sheet of 24 rolls under each | One engine, every setting already a parameter, rolls built in |
| Atlas Cube Motion (`G64pR5zu9ktkbtNQFSoD9x`) | The pattern animations: a cube lattice with waves of growing cubes (white 01 to 06), and the pulse and sweep versions (blue) | The newest boards are parametric (speed, direction, scroll, cubes, margin, spin, breath, sweep, spacing); the older ones are fixed |
| Atlas Web Sketch parts (`TKf6MhVxzWG2r1xNd2nvHZ`) | The emboss map: Iceland as a relief, three takes (loop, globe, coast). The record animations: wave, flags, ledger, and the record card | Fixed pieces, each about 28 to 48 KB, made for one picture and one data set |
| Atlas Visual Identity (`QabPsMCnAnH47nK6sTV3mA`) | The signal animations: 17 boards (in use, live, signal 12 to 17), their video cuts, and the Styleset they come from (lines, bands, circles, data, dots) | Fixed pieces; the bridge one carries one SVG's 3721 dots packed into its code |

What I think:
- They are one family with the Line Swell generators and they belong together: a mark or a field, drawn in a style, with settings, rolls and a loop. That is what Labs is for and what the generator window draws. So they come in as Labs entries and generator styles, not as a package of their own and not into the logo tool.
- They are not equally ready. Line Swell and the newest cube patterns are generators already. The signal, record and emboss pieces are finished animations of one thing: bringing one in means finding its mechanism and giving it settings, which is a rebuild of that piece, not a copy.
- What is Atlas's stays Atlas's: the island, the record data, its colors and type. A generator takes the mechanism (a relief from a height picture; a dot field that breathes and sways; a lattice with travelling waves) and reads its source from the user's own image or layer.
- The emboss map answers something parked in the ticket: the "relief" effect. A relief from a height picture is the general form of it, and the generator's Image source is where the picture comes from.

### 29.1 — The list, one row per piece — on his go — ✅ built 2026-11-18 (`_tmp/2026-11-18-style-generators/pieces.md`: 135 boards on the four canvases, one verdict each: 31 generators as they stand, 16 after a rebuild with what must become a setting, 88 one-offs; Line Swell 29, 0, 8 (its seven tuner boards are W27's); Cube Motion 2, 3, 14; Web Sketch 0, 4, 6; Visual Identity 69 boards, not 68: 0, 9, 60; Swell is not folded into Line Screen, the reason in the file's notes, decided for his review)
- Every piece on the four canvases in one table: its mechanism in a sentence, what it reads (nothing, a shape, an image, data), its settings today, whether it loops, and a verdict: a generator as it stands, a generator after a rebuild, or a one-off that stays where it is.
- Acceptance: one row per board on the four canvases; exactly one verdict each; the rebuild rows name what has to become a setting.

### 29.2 — Line Swell's generators into the engine's generator — after 29.1 — ✅ built 2026-11-18 (`packages/design-editor/src/generate/lineSwell/`: Swell, Warp, Radial, Moire, Pinch, Flow, Rotor, Vortex as eight styles of family `lineSwell`, the board engine carried verbatim with a pure field; 26 presets (Swell's 16 bases, its master board, each effect's board, two studies), each style's Roll and Spread; in today's generator window as its own group, sections built from its own rows, a row shown only where it changes the picture; in Labs as type Line Swell; 20 setting sets against the board engine in Chrome, largest difference 0.005 percent of pixels (`compare.md`); 0 styles folded or duplicated; Wave and Keys wait for 29.3, the style contract carries no time; the per-family window of W23 not built)
- Swell and the line effects go into the engine's `generate/` and get their OWN window on the shared frame (23.0), with their own steps, presets and rolls: not more styles in the Screens window. Where one only repeats an existing style (Swell is lines thick where a source is strong, which Line Screen already is with a field), that is settled in 29.1's table before the port: one of the two, never both.
- Acceptance: each effect reachable in the Line effects window and in Labs; for 20 fixed setting sets its picture equals the Line Swell board's, compared as images within 1 percent of pixels; 0 styles that duplicate another.

### 29.3 — The motion pieces as Labs loops — after 29.1, the rebuild ones each on its own — 🟡 part built 2026-11-18 (in: Wave, Keys and Swell's wave source, `generate/lineSwell/motion.js`, `labs.js`, `wave`/`keys`/`waveField` carried verbatim into `source.js`; the cube lattice, `loops/shape/cubeLattice.js`, 47 settings, 4 presets for white-05, white-06, blue-01-pulse, blue-01-sweep. Board against loop at u 0.1, 0.37, 0.71: Wave, Spikes, Keys (letter cleared), Swell on the wave, white-05, blue pulse, blue sweep 0.000 percent of pixels; white-06 0.43, 0.91, 1.24 (its node pulse snapped 15.28 to 15 cycles per loop); Keys with the board's letter A 3.4 to 3.6 (pixel font in Labs). Seam u 0 against u 1: 0.000 for all nine; step across the seam within the frame-to-frame step, watched at 30 fps (`_tmp/2026-11-18-style-generators/loops/compare.md`, `clips/`). Not reached: the signal set, the record animations, the relief, and the line effects' Motion sections)
- Wave and Keys, the cube lattice, then the signal set, the record animations and the relief, each as a Labs entry with settings and a closed loop.
- Acceptance, per piece: every number that was fixed in the board and changes the picture is a setting; the loop closes (last frame equals first within 1 percent of pixels); with the board's own values its picture equals the board's; recorded at 30fps and watched.

## W30 — Not thought through yet (P: "a few things that we haven thought about, color mode modal, export modal, save as settings, home and user, output rendering [if we make a electron or tauri version]")

Each starts with a read of what kolbox and the engine do today, written down in plain words, then a drawn proposal in the file. Nothing here is designed yet; the proposals below are starting points for his ruling.

### 30.1 — The color window — covered by W25
- The color tool on the shared window frame. Nothing to add here.

### 30.2 — The export window — TALK
- Today: an Export button in the top rail; the engine can write SVG, PNG, a WebM of a loop, and a batch across aspects. The right rail has an Export section that does nothing yet.
- Proposal: one Export window on the shared frame. What is exported (the frame, the selection, every frame), the format (SVG, PNG, and video for anything that moves), size or scale, with or without the frame's fill, and a preview of the result. The rail's Export section holds the same settings per layer, so a layer remembers how it exports.
- To settle: which formats ship; whether video is WebM only in the browser; naming of exported files.

### 30.3 — Save and Save as — TALK
- Today: Save, Save as, Rename, Duplicate and Files in the file menu; a restore prompt on load. First a read of where a file actually goes (the browser's storage, the library, a download) and what a saved file holds.
- Proposal: Save as is one small window: the name, where it goes (a folder on Home), and what is kept with it (its media, its fonts, its theme). A file has one place it lives, shown in the title.
- Settled by him 2026-11-18: storage is not an open question. kol-fxr already has D1 connected for this; kolbox in this repo is not connected, so these screens are drawn and built against the same shape and wired when kolbox meets that backend.
- To settle: whether a file can be exported as one portable file and opened elsewhere.

### 30.4 — Home and the user — TALK
- Today: Home is a file browser with sample files, the rail has Media and Sign in, and the account chip drawn this week has no home. First a read of what Sign in does now and what an account would own.
- Proposal: the account owns files, media, palettes and themes. Home shows recents and folders; the account chip sits at the foot of Home's rail with its menu (profile, plan, sign out), as his reference has it.
- Settled by him 2026-11-18: accounts exist on the kol-fxr side (D1). Here the screens are drawn and built; the connection comes with that backend.

### 30.5 — Output rendering in a desktop build — PARKED: after the web app is accepted
- The question: in the browser a loop is recorded in real time, so quality and length are limited by the machine and the format by the browser. A desktop build (Electron or Tauri) could render frame by frame to a real encoder, at any size and length, and read and write files on disk directly.
- Proposal when it comes up: Tauri for the shell (small, and the app is already a Vite build), with rendering as a separate step that draws each frame off screen and hands it to an encoder; the web app stays the same code.
- To settle then: which formats and sizes matter (ProRes, MP4, image sequences), and whether the engine's draw loop can be stepped frame by frame without its timers.

## W31 — The kit moves into the DS (his ruling 2026-11-18: "ok we do this then we move to DS?"; agreed: W28 first, then the move)

Cause: kolbox's parts live in `apps/kolbox/src/ui`, local to one app. They cannot be used by another app, and they cannot have Code Connect, because the plan allows it on one library, the DS's (8.3 is written and blocked for exactly that reason).

### 31.1 — Sized first — on his go, after W28
- A read, written down: which kolbox parts are the same component as a KOL one in another look (they become a `variant` of it, as float's are), which are new to KOL (they are added in their tier), and which are app parts that stay in kolbox (the windows, the rails' contents). The mapping from 8.3's Code Connect work and the tier map are the starting lists.
- Acceptance: one row per kolbox part with exactly one verdict (variant of, new in tier, stays); the package each goes to; nothing built.
- Sizing written 2026-11-18: `_tmp/2026-11-18-kolbox-system/w31-sizing.md` (97 rows: 54 variant of, 6 new, 37 stays; the order, his calls, the risks).

### 31.1b — Sized and ruled, 2026-11-18
- The sizing is `_tmp/2026-11-18-kolbox-system/w31-sizing.md`: 97 parts. 54 are a KOL part in another look (47 take the variant, 7 are simply KOL's part), 6 are new to KOL (Link, DropdownStepper, MenuScroll, Toast, SwatchGrid, a labelled divider), 37 stay in kolbox.
- His rulings: the look is `variant="kolbox"`. Kolbox's widths (rails 240 and 49, modal 480, search 576) are kept and written into the foundations docs as the kolbox variant's. The 14 glyphs drawn locally in kolbox go into `kol-icons` through a review board first (W16), with the icon skills (`/kol-icon` to carve and stage, `/lobby-icon` to promote).
- First batch, movable today: Avatar, ButtonGroup, OriginPicker, XYPad, and the `useBelow` hook. Before anything after that, kolbox's type sizes become KOL type classes, as float's are.
- Still his: Avatar has no 24 size in KOL (kolbox takes 20 unless 24 is added); name clashes to settle (kolbox's `ColorField` is KOL's saturation square, kolbox's `RailSection` is KOL's `LabeledControlSection`).

### 31.2 — The move — after his ruling on 31.1
- Phases written then. The masters move to the DS library by his cut and paste (an agent cannot move between files); the code moves into the packages with docs, taxonomy and the Figma mirror in the same pass; kolbox then takes the parts from the packages, and Code Connect goes on in the DS library.
- Batch 1 is in, 2026-11-18, with batch 0 (kolbox's type as `kol-kolbox-*` classes): Avatar, ButtonGroup, OriginPicker, XYPad and useBelow come from `@kolkrabbi/kol-component`; per part, numbers and what batch 2 needs: `_tmp/2026-11-18-kolbox-migration/batch-1.md`.
- Batch 2 is in, 2026-11-18: Toggle, Checkbox, Textarea, Kbd (Keys as `KbdKeys`), LabeledControl, PropertyRow (`FieldPair`), ColorWheel (`WheelTriangle`) and SwatchStack as `variant="kolbox"`, and two new parts, `Link` and `DividerLabel` (was GroupLabel); every box on the twelve states within 1px, type equal, default and float 0 pixels changed; per part and what batch 3 needs: `_tmp/2026-11-18-kolbox-migration/batch-2.md`.
- Batch 3 is in, 2026-11-18: Button and IconButton (`Button iconOnly`), SplitButton (`ButtonSplit`), IconGroup (`ButtonGroup layout="joined"`), Input, Slider, Tabs (`TabsRow`) and AlignmentRow (`AlignmentGrid`) as `variant="kolbox"`, kolbox's sub-look words mapped to KOL's (`tone`, `pressed`, `size`, `readout`; the table heads the batch file); every box on 24 states within 1px, type equal, default and float 0 pixels changed, `validate:variants` 117 findings to 43; per part and what batch 4 needs: `_tmp/2026-11-18-kolbox-migration/batch-3.md`.
- Batch 4 is in, 2026-11-18: the floating parts. Menu (with `MenuScroll`), Dropdown, Tooltip, PopoverPanel (kolbox's Popover, its shell `ModalShell`), ModalDialog, `ModalProvider` (the confirm and the prompt) and AccountMenu as `variant="kolbox"`, kolbox's layer as `PopoverLayer`, and three new parts, `DropdownStepper`, `Toast` and `SwatchGrid`; `kol-kolbox-surface` is one kol-theme class; `TabsRow`'s tooltip seam is gone; per part, the numbers and what batch 5 needs: `_tmp/2026-11-18-kolbox-migration/batch-4.md`.
- Batch 5 is in, 2026-11-18, and the move is complete in code: the rails, rows, dock, transport, timeline, shell frame, color parts, search modal and Home's parts are KOL components' `variant="kolbox"` in kol-component and kol-shell; `apps/kolbox/src/ui` holds only what stays. The map of all 97 parts (where each ended, for the Figma masters and Code Connect): `_tmp/2026-11-18-kolbox-migration/batch-5.md`.

### 31.3 — The Figma side, where it stands (2026-11-18, night)
- Done: all 154 kolbox masters cut by him into the KOL library, sorted into "Kolbox" sections per tier, every binding rebound to the library's own (38 `kolbox/*` text styles, `shadow/kolbox`, `kolbox/*` sizes and mode collections added first). Atoms and molecules folded into their KOL masters (`variant=kolbox` inside the set, or a sibling `X kolbox` set) and published by him.
- Stopped by Figma's call limit for the seat, nothing half-written: (1) the re-point of the kolbox file's `↳ Layout UI` after the molecule fold: instances still show the old cached masters (Rail 77, RailSection 315, ListRow 432, Tabs 41, SplitButton 34, PropertyRow 191, IconGroup 98, FillRow 67, Menu 17, Tab 128, Avatar 19); (2) the fold of organisms, modules and utilities: mapped, not built.
- To resume, ONE Figma agent at a time (his rule): first the re-point (`figma-repoint-kolbox.js`, `DRY = false`), then the last fold (`fold-org-unsent.js` and the mapping in the recipe), then his publish, then the final re-point, then Code Connect (53 files in `figma/kolbox/` already repointed at the package components).
- Everything is in `_tmp/2026-11-18-kolbox-migration/figma-paste-recipe.md`.
- Left for him in the Kolbox sections: app-content masters, masters no code draws, and the mobile masters; the recipe lists each with a recommendation.

## W32 — The editor takes the kolbox style (his words 2026-11-18: "so can we fit pnpm editor with the style?"; "kolbox is a style not an editor, pnpm is the editor")

Cause: `apps/kolbox` was built as a second shell around the same engine to prove the style. Now the style is in the DS as `variant="kolbox"` (W31), so the editor itself (`apps/editor`, on `packages/design-editor`) can wear it, and two shells around one engine is one too many.

### 32.1 — Sized first — on his go
- A read, written down: every KOL component the editor's shell renders (rails, dock, top rail, inspector rows, menus, windows, timeline), whether it already has a `variant="kolbox"` from W31, and what `apps/kolbox` has that the editor's shell lacks or does differently (his design 149:26890: the layout, the left rail's Pages and Layers, the inspector's model from W11, the dock). What of `apps/kolbox` becomes the editor's, what stays as app content, what retires to `_tmp`.
- Acceptance: one row per shell part with one verdict (variant exists, variant missing, layout differs); a count of what is missing; nothing built.
- Sizing written 2026-11-18: `_tmp/2026-11-18-editor-kolbox/w32-sizing.md` (61 KOL components in the engine's shell: 2 kolbox look passed through, 20 kolbox look hardcoded, 39 no kolbox look; 13 of kolbox's 20 parts are structure; the mechanism, 9 batches, his 5 calls).

### 32.2 — The switch — after his ruling on 32.1
- Phases written then. The look is a setting, not a fork: the editor renders in kolcore or kolbox by the variant, and its Settings choose it.
- Acceptance, set now: with the kolbox style on, the editor's Editor, Labs and Morph screens equal `apps/kolbox`'s within 1px on the same file, and every interaction W28's driving list covers gives the same result; with it off, the editor is unchanged, 0 pixels.

## W33 — A frame exists only when it is drawn (his ruling 2026-11-19: "default background of a frame should be FFFFFF not 000000 and only when drawn. frame is not automatically there when you open page.")

Cause: the engine has ONE implicit frame, always there, that every layer lives in (`compose/frame.js`: its place, fill, name; `shell/CanvasView.jsx` draws it; rulers, guides, export and the aspect all read it). He wants the page to open EMPTY: a frame is an object the user draws with the frame tool, as in his reference, white by default.

### 33.0 — A new frame is white — ✅ built 2026-11-19 (`FRAME_DEFAULTS.canvasFill` is `#ffffff` in every theme; it was the theme's flipping surface, black in dark)

### 33.1 — Sized first — after W22 (the layer model is being changed in the same files)
- A read, written down: everything that assumes the one frame (where layers get their coordinates, the fit and zoom, rulers' zero, guides, export's bounds, the aspect and size controls, Labs and Morph which have no page), and what a document with no frame, one frame and several frames means for each. What a layer drawn straight on the page is.
- Acceptance: one row per place that reads the frame, with what it does at 0 frames; the migration for old files (they open with their one frame, unchanged); nothing built.

### 33.2 — The build — after his look at 33.1
- A new file opens on an empty page: no frame, the Layers list empty, the inspector showing Page. The frame tool draws a frame (white, no stroke) by drag; it can be moved, resized, renamed, filled, hidden, removed (28.1, 28.2 and the fill work already done apply to each frame). Old files open as they were.
- Acceptance: a fresh file has 0 frames and 0 pixels drawn on the page besides the page color; one drag with the frame tool makes one frame of the dragged size with a `#ffffff` fill; a file saved before this opens with its frame, fill and layers pixel-equal; export of a page with no frame says so rather than exporting nothing.

## W12 — The gaps Layout UI showed — built 2026-11-18 on his go ("DO EVERYTHING until plan is done"), the split decided 2026-11-18, for his review (12.1, 12.2)

Found 2026-11-18 by replacing every capture with our parts (`_tmp/2026-11-18-kolbox-system/layout-ui-gaps.md`). Each is something Figma's app has in his captures and kolbox has no part for. Some are kolbox's to have, some are Figma's own product.

- Triggers with no part or no open state: `DocumentTitle` open, a Prototype tab, the play split button, the avatar chip, a page-theme dropdown, a frame-type dropdown, a Share button, a zoom control, the generator's trigger.
- Parts: a vertical tool rail, a toast, the menu scroll arrow, a library cover image, a backdrop color variable.
- Glyphs: headphones, refresh, lightbulb, UI kits.
- Glyphs now in `Icon` (2026-11-18, `_tmp/2026-11-18-kolbox-system/glyphs.md`): mask, layout-vertical, layout-horizontal, resize-to-fit, zigzag, tool-pattern, tool-image, tool-crop, swap, headphones, refresh, lightbulb, and the `SwatchStack` part in the dock's well; still missing: freeform, independent corners, six vector effects, UI kits.
- Also his call: the Publish library view stacks a modal over a dimmed modal; the phone breakpoint was read as 428, so the 390 sheet went to `_trash`.

### 12.1 — What kolbox takes — ✅ built 2026-11-18, decided 2026-11-18, for his review (what the build does to follow: `_tmp/2026-11-18-kolbox-system/w12-code.md`; code: ✅ 2026-11-18 (`ui/Toast.jsx` with `Link.jsx` and a host, raised on every save as "Saved" with Show in Files; `ui/AccountChip.jsx`; `MenuScroll` in `ui/Menu.jsx`, scrolling while hovered; TopRail's zoom `Dropdown` (`outlined` false) with `ui/MenuZoom.jsx`, the editor's live percent from its zoom store and its rows on `kol:zoom-to` and `kol:zoom-fit`; DocumentTitle open already lit; boxes within 1px of the nodes in `w12-code/measure.md`; no function yet: the File moved toast, AccountChip, the zoom off the editor, in `no-function-chrome.md`))
- `Toast` 288:7452, new in Molecules, Feedback (doc frame 288:7971): his Move file toast, read from the drawing on `_trash` 149:30169: one row, padding 8 / 12 / 8 / 16, gap 12, radius 12 (his 13), `surface/secondary` with Popover's four shadows, clip on; `message` text property ("File moved", inter/help-medium) and one `Link` ("Show in kol-ds-ui [library files]", his words). Shown in the Move file view 246:29902 under the modal, centred, 107 below it as in his drawing.
- `DocumentTitle` 288:6775 is now a set: `open` false / true; open lights the name and its chevron in `accent/primary`, as the code's open file button does. The File menu view shows `open=true` in its Shell.
- `TopRail` 36:9458: the zoom `Dropdown` 288:6791 (the Controls sheet's unbordered one, "100%", 63 wide) as its last child, right of Export, where his top bar has the zoom; boolean `zoom`, default on. It sits after the right slot, not in it: a slot's children cannot take a property. Lit (`state=open`) in the Zoom menu view 242:36910.
- `AccountChip` 288:7401, new in Molecules, Identity (doc frame 288:7406): `Avatar` and a 12 chevron (`size/chevron`, `oq/64`), 4 apart. Shown in the Present bar sheet 149:29634 in place of its gap.
- `MenuScroll` 288:8017 in Molecules, Menu (231:2710): 24 high (`ctl/24`), the 12 chevron-down centred in `oq/64`. Shown at the foot of the Device list's long menu 246:28712.
- Backdrop: `Dim` 241:4536 binds `fg-ab/24`, the backdrop the color map gave it (`color/dim` was the mobile 20%). Nothing changed.
- Their four gap boxes are on `_trash` in 168:35313 with the `_` prefix.

### 12.2 — Not kolbox's: Figma's own product, not kolbox's — decided 2026-11-18, for his review
- The Prototype tab and its "No device" Dropdown (gap 246:29113), the play split button (246:29270), the page-theme Dropdown (246:29322), the frame-type Dropdown (246:29695), the vertical tool rail (246:29702), the library cover image (246:31063), the UI kits glyph (246:31057). Their gap boxes stay on Layout UI, relabelled "not kolbox's: … (Figma's own product)".

## W7 — His calls — TALK

- Control 28: with W1.3 it is a real step, so this is settled unless he wants kolbox on 26.
- The dock's 1px divider line his reference does not draw, and its 12 chevron where his is 24.
- `GeneratorWindow` 880 wide from code; extra space above its Image group; its parts with no kit piece.
- `Rail` in Molecules while the three rails are Organisms; `Popover` and `Tooltip` in Utilities.
- The mobile sheets' mapped colors and the one canvas crop; the mobile menu rows with no gap; the search glyph and back chevrons changed without his go.
- Phone layout for the design view: no drawing to build from.
- Built earlier and still waiting on his review: left rail states, right rail sections, overlay parts and states, the Labs rails.
- 58 old kit masters on `_trash` without the `_` prefix, which would publish.

### 7.1 — Done 2026-11-18, decided 2026-11-18, for his review (code: ✅ 2026-11-18 (GeneratorWindow already rules between its groups, nothing changed; looked at in `w12-code/generator-window.png`))
- `GeneratorWindow` 225:30450: the space above the Image group was its `PanelSection` with `divider` switched off, so its 16 top padding and the 20 group gap read as a bare band; the divider is on, so all three groups sit on one rhythm (rule, 16, title). 880 wide, unchanged.
- The 58 old kit masters on `_trash` 76:13765 (1:3082 `Icon`, 1:3229 `Button` … 1:4025 `Editor`) are prefixed `_`; 0 unprefixed left; nothing else about them changed.
- Everything else in W7 stays as it is, waiting on his call.

## W8 — Code — PARKED: after he accepts the file

### 8.1 — Kolbox brought into line with the file — ✅ built 2026-11-18 (`apps/kolbox/src/index.css` imports kol-base-tokens, kol-color, kol-opacity, kol-opaque and kol-design-tokens only, layer(components); 18 of 18 color roles point at their DS variable, 13 of 13 base roles resolve in kolbox dark to their old hex, shift 0; 0 hex colors in `apps/kolbox/src` outside user content; control, row, cell on `--kol-ctl-28, 24, 32`, radius on `--kol-radius-*` (track 5 to 6, modal 14 to 16, menu 13 to 12), Home grid 34, 31, 23 to 32, 32, 24 and list header 39 to 40; before and after at 1440 × 900: editor 72 px, labs 216, morph 72 changed (the track and dock corners), Home 141417 (the grid move), Settings 1027116 (the dim 0.5 to 0.24 and the new Theme row); the engine sheet's unlayered brand layer re-bound accent and palette, handed back by `revert-layer`)
- `apps/kolbox` on KOL's tokens and the kolbox mode; the fixed hex block goes.

### 8.2 — Themes in code
- The switch is in (2026-11-18, with 8.1): Settings, Display, Theme (kolbox, minimal, mono, folio) sets `data-theme-variant` on `<html>` and remembers it; `apps/kolbox/index.html` stamps it and the theme (explicit, else dark) before first paint. Box check against kolbox dark: 0 boxes moved in kolbox light, minimal, folio light and dark on Home, editor, Labs and Settings; mono moves 35 to 115 text boxes, its sans being JetBrains Mono.
- Each theme one selector that sets the mode's variables; a user theme is a CSS file setting the same ones.
- Acceptance: switching theme moves no layout box (every element's size and position equal before and after, by script); 0 hex colors in `apps/kolbox/src`.

### 8.3 — Code Connect — written, waiting on his publish (2026-11-18: 69 of 149 masters mapped in `figma/kolbox/`, own config; 80 masters with no code part, 89 code exports with no master, in `_tmp/2026-11-18-kolbox-system/code-connect-gaps.md`; dry run valid, 0 maps pointing at a missing file; the kolbox file is not a published library, so the mappings wait on that)
- Every master mapped to its kolbox component, props to variant properties; a master with no code part, or a part with no master, on a written list.
- Acceptance: every master mapped or listed; 0 maps pointing at a missing file.

### 8.4 — The build against the design, his list (P: "so much misalignment")
- Left rail: file title row and Pages row inset as drawn; the chevron at 12, not larger; the Pages search icon is missing; the selected page has no accent bar or lit text.
- Rulers take the UI's color, not a lighter one.
- Right rail with a shape selected: inputs too tall; the alignment row snaps in instead of being there; chevrons too big; extra icons in the header; buttons misaligned; sections missing; UI text too big. Fixed by W11 and W3, then measured.
- Tool dock at the bottom as redrawn in 10.8.
- Acceptance: for each view, every part's box in the build within 1px of the same part in the file, read by script from both; 0 parts in the build that are not in the file, 0 in the file missing from the build, parts with no function included; a "no function yet" list naming each such part and what it will do.

## W9 — Set aside — PARKED: he has not asked for them

- Layer rows against his older rail; the randomise buttons in the Labs right rail; the audit against his reference sheets; the small differences listed in `plan-2026-11-17-groovebox-labs-editor.md`.

### 9.1 — The small differences — ✅ built 2026-11-18, decided 2026-11-18, for his review (code: ✅ 2026-11-18 (MenuEffects 202 wide; the slider's run in the text ink in the right rail and Labs; the timeline's time one joined field, seconds and ms split by a divider; PopoverStroke's active tab already the text ink; the stop glyph waits))
- The effects menu: `MenuEffects` 220:21653's Menu is 202 wide (was 167).
- `PopoverStroke` 220:23459: the active tab's text is `surface/on-primary`, the plain text color (was the accent), as the code's track tabs draw it.
- `Slider` 54:10822, all 10 variants: the run from the track's start to the knob is `surface/on-primary` at full strength (his reference slider's run is opaque, read from his Effect settings capture 121:15711); the rest stays `oq/24`. Found and fixed while there: `position=25` drew its run at 140 and its knob at the middle; now 70, knob at a quarter.
- The timeline's time: `MotionTimeline` 141:17606's `time` is one joined field (fill `oq/16`, radius 4, 28 high) holding `seconds` (0 s) and `ms` (0 ms) split by a divider, as `FillRow`; the two old Input instances are on `_trash` in 168:35313 with `_`.
- The stop glyph: `Icon` 24:9344 has no stop glyph, so the transport keeps its gap.
- Left parked: the layer rows against his older rail (no ruling), the randomise buttons in the Labs right rail (he said not now), the audit against his reference sheets (the reference sheets are replaced).

## Order
W10 first: it is what he is looking at, and it shows what kolbox lacks. Then W1 → W2 → W3, since everything after is drawn in those values. Then W4, W5, W11 (11.1, 11.2, 11.4). W6.3 once he rules 6.2. W8 last. W7 and 11.3 whenever he rules.
