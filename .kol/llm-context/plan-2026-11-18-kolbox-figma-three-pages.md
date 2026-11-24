# Plan — kolbox in Figma: Components, Foundations, Layout UI

**Raised:** 2026-11-18, him. Points verbatim: "I feeel like we should be referencing kol-ds-ui and how atoms molecules etc are set up ALONGSIDE this setup. because [the library's Atoms page] this really shows the hiearchy?"; "renamed file kolbox … three pages Components, foundations and layout ui … please /p those pages, wrap it together in plan".
**Status:** W1 and W3 built 2026-11-18 and stand. Everything else is taken over by `plan-2026-11-18-kolbox-system.md`.
**Shape:** W › phase › list.
**Laws carried:** the design leads and the code follows. One ladder, the KOL one: Atoms, Molecules, Organisms, Modules, Utilities (`docs/documentation/03-components/00-taxonomy.md`). A master lives once, on Components; every other page holds linked instances. Master-page layout as the library's: tier sections side by side, top-aligned, 200 apart from 0,0; inside a section the doc frames stack down. Nodes are moved, never rebuilt, so ids and links survive. Nothing is deleted: content goes to `_trash` with the `_` prefix; an empty frame is removed. Every canvas #1E1E1E, dark first. An instance keeps its component's name. No Figma write without his go.
**How a phase closes:** the acceptance line read by script from the file, then one screenshot. Nothing here moves, so no recording.

File `SgfHBi22F7tYO7GHIorUbv`, now `kolbox--kol-ds-ui`. This plan takes over from `plan-2026-11-18-groovebox-figma-outstanding.md`, whose W1 to W6 are built; its open calls are carried here as W4 and W5.

## The file as it stands (read 2026-11-18)

| Page | Id | Holds today |
|---|---|---|
| Cover | 19:9247 | his |
| ➤　Explore | 226:45067 | chapter |
| ↳　Components | 226:70417 | empty |
| ↳　Foundations | 226:70418 | empty |
| ↳　Layout UI | 149:26341 | everything: his reference sheets, the screens, and all masters in `Components` frames on seven sheets |
| _trash | 76:13765 | retired content |

## W1 — Components: the masters, on the KOL ladder

Cause: the masters sit on Layout UI grouped by the view that uses them (Controls, Menus, Mobile app). That shows where a part is used and hides what it is built from. The library's tier pages show the hierarchy.

### 1.1 — The tier map, as a file — ✅ built 2026-11-18 (`_tmp/2026-11-18-kolbox-three-pages/tier-map.md`: 138 rows = 138 masters, 0 empty tiers; Atoms 48, Molecules 55, Organisms 24, Modules 3, Utilities 7, Icons 1; Tooltip and Popover in Utilities by the taxonomy; 22 duplicate Overlay-parts masters left out, see 1.3)
- One table, `_tmp/2026-11-18-kolbox-three-pages/tier-map.md`: every kolbox master, its tier, its family, and its KOL twin where one exists (`Button`, `Input`, `Slider`, `Dropdown`, `Menu`, `Tooltip`, `Avatar`).
- A master with a KOL twin takes the twin's tier from `docs/documentation/03-components/01-inventory.md`. One without takes its tier by the taxonomy's definitions: one element is an atom, a small unit a molecule, a region an organism (the rails, `TopRail`, `ToolDock`, `MotionTimeline`, the eight overlays, `GeneratorWindow`), a page frame with slots a module (`Shell`, `Browser`, `MobileScreen`), no face of its own a utility.
- Glyphs are not on the ladder: they get their own section, Icons.
- Acceptance: the table's row count equals the count of masters in the file; every row has exactly one tier and one family; 0 rows with an empty tier.

### 1.2 — Six sections, masters moved in — ✅ built 2026-11-18 (sections Atoms 231:2648, Molecules 231:2689, Organisms 231:2730, Modules 231:2759, Utilities 231:2768, Icons 231:2785 at x 0, 2360, 4720, 6680, 8640, 10600, y 0, theme Dark; 34 family doc frames; 138 masters moved, ids kept, 138 inside a doc frame; 0 masters on Layout UI; on Layout UI 0 missing, 0 renamed instances; the 8 overlays and GeneratorWindow left an instance in their sheet slot)
- On `↳ Components`: sections Atoms, Molecules, Organisms, Modules, Utilities, Icons, left to right. Inside each, one doc frame per family, stacked down, the family's masters in it under their names.
- Each master moves from Layout UI to its row in the map. The mobile parts sit in the same tiers, in families named Mobile.
- Acceptance: 0 component masters on any page but `↳ Components`; the count on `↳ Components` equals the file's count before the move; every master is inside a doc frame inside one of the 6 sections; 0 detached, 0 missing, 0 renamed instances in the file; section x positions 200 apart, top-aligned.

### 1.3 — The `Components` frames leave Layout UI — ✅ built 2026-11-18 (the seven frames plus the copies in Text color test 223:42355 and Generator window 225:31417 moved to `_trash` 76:13765 as `_Components (…)`, their 22 duplicate masters `_`-prefixed, 0 instances outside them; `sheet parts` 149:38773 empty and removed; 7 sheets 1600 wide; 0 `Components` frames of ours on Layout UI, his capture 149:30340 inside Publish library modal keeps its name)
- The seven `Components` frames added to the sheets (222:21094, 222:21185, 222:22045, 222:22055, 222:22058, 222:22133, 222:22238) are empty after 1.2 and are removed. The seven sheets go back to 1600 wide.
- Acceptance: 0 frames named `Components` on Layout UI; 0 sheets wider than 1600 that were 1600 before today.

## W2 — Foundations: the variables and styles, shown

Cause: the variables and styles exist in the file with no page that shows them; the only specimens are two sheets on Layout UI (Surfaces, and the brighter text test 223:42338).

### 2.1 — One doc frame per topic — ✅ built 2026-11-18 (sections on 226:70418, top-aligned from 0,0, 200 apart: Color 230:24132 (Groovebox · UI set 230:23833 21/21 in two mode columns, Open roles 230:24015 with the 4 gaps, menu colors 230:24046 9 of menu's 23, Surfaces 149:28650 and Text color test 223:42338 moved in, ids kept); Type 230:24260 (Desktop 230:24133 22, Mobile 230:24204 17: 39/39 text styles); Space 230:25705 (space 32/32, tabs 4/4, tree 1/1, menu numbers 14, so menu 23/23 with Color); Radius 230:25842 (radius 25/25); Size 230:26553 (size 103/103, row 1/1, rail 1/1, avatar 2/2, mobile button 3/3, dock 2/2); Effects 230:26579 (4/4 effect styles). Each variable is one row named by its variable, specimens bound (Swatch instance fill, bar width, box corner radius, text style, effect style), mode columns set by explicit mode; 0 `Frame`, 0 empty frames, 0 loose text, 0 new components)
- On `↳ Foundations`, sections left to right: Color, Type, Space, Radius, Size, Effects. Each holds doc frames built from the kit's `Swatch` and text layers bound to the variable or style they show, with the name and value beside each.
- Color: the `Groovebox · UI set` collection, every role, with the `Brighter text` mode as a second column; the four roles still open (accent hover, disabled text, backdrop, disabled button) shown as labelled gaps. Type: the 6 desktop and 15 `mobile/*` text styles. Space, Radius, Size: every variable, including the `dock`, `mobile button` and `avatar` collections with their modes. Effects: `shadow/float`, `shadow/dock`.
- The Surfaces sheet and the brighter text sheet move from Layout UI into Color.
- Acceptance: every local variable and every local text and effect style appears exactly once on the page; every specimen is bound to what it shows, 0 raw values; a count per section written under this phase equals the file's count per collection.

## W3 — Layout UI: views only

Cause: with masters on Components and specimens on Foundations, Layout UI is left with what it is for, the views and the composed surfaces.

### 3.1 — What stays, and in what order — ✅ built 2026-11-18 (9 sections from x 0, 200 apart, y 0: Contents, Desktop views, Breakpoints, Desktop atoms, Menus and modals, Mobile views, Mobile parts and comparison, Captures matched, Reference; sheets 80 in, 200 apart; 0 masters, 0 overlapping sheets, 0 overlapping sections; 32 nodes at 1440 × 900 or 428 × 926, the 3 with clip off are a MobileDim layer and two frames inside his reference Frame 5)
- Stays: Desktop views (file browser grid and list, design view docked and floating, `editor`, `labs`, `editor motion`, `morph`), Breakpoints, Mobile views, Menus and modals (the overlay builds, Rail states, `Overlays`, `GeneratorWindow` shown as instances), his sheets marked reference for later.
- The Desktop atoms sheets (Controls, Menus, Modals) stay as his reference sheets holding instances; they are not folded into Components.
- Sections re-spaced after W1.3 and W2.1 take their content out: left to right, 200 apart, sheets stacked 200 apart.
- Acceptance: 0 component masters on the page; every screen 1440 × 900 or 428 × 926, clip on; every specimen on a sheet marked built is an instance; 0 overlapping sheets.

### 3.2 — His reference frames come back from `_trash` — ✅ built 2026-11-18 (section Reference 232:21076: Frame 1 37:12650, Frame 5 73:4905, Frame 9 144:32446, toolbars 125:27253 holding the dock 125:27095, Foundations specimen 19:9248, and the loose `ref` 218:42749; `_` prefix dropped, ids unchanged; 0 left on `_trash`; empty `_foundations` 19:9360 removed)
- The frames that sat on the old `↳ shell` and went to `_trash` today (the Figma rail captures, the dock reference 125:27095, the foundations specimen) go into one new section on Layout UI named Reference, since W5 and later work read them.
- Acceptance: those frames are on Layout UI in a section named Reference with their ids unchanged; 0 of them left on `_trash`.

## W7 — The doc frames copy the library's (P: "BUTTON in kol-ds-ui fimga file … but this isnt that. I already told you this?")

Cause: I carried over the library's section layout only and never briefed its doc frame. Each family frame on `↳ Components` is a title over loose masters (his screenshot: Buttons, 1600 × 449, variants in unlabelled rows). The model is the library's Button doc frame, `n48kE2bJtrFjl7wxst30xH` node 1194:892.

### 7.1 — Every family on the library's doc frame — to build on his go
- Read 1194:892 first: its tree, sizes, paddings, text styles, and how the specimen labels its grid (property names across the top, variant and state names down the side).
- Each of the 34 family frames on `↳ Components` is rebuilt on that frame: header (breadcrumb tier / family, name, one line, link), specimen (the component set laid out as a grid with every variant and state labelled), footer. The doc-frame parts are components in kolbox, on a `_util` page, named as the library names them.
- The masters stay the same nodes: only their frame and their arrangement change.
- Acceptance: 34 of 34 family frames hold exactly a header, a specimen and a footer, each an instance of the kolbox doc-frame parts; in every specimen each variant row and column has a label, 0 unlabelled masters; header, footer and specimen paddings and text sizes equal 1194:892's, as a table; master count on the page unchanged at 138; 0 detached, 0 missing, 0 renamed instances.

### 7.2 — The page reads as one grid (P: "component page needs TLC") — to build on his go
- Today the doc frames in one section have different widths (his screenshot: Atoms has one frame wider than the rest, Molecules and Organisms run ragged), so the columns do not line up. Every doc frame in a section takes the section's one width; a specimen too wide for it wraps inside, the frame does not grow.
- The Icons section shows every glyph of the `Icon` set as a labelled tile, not one frame of unnamed dots.
- Acceptance: within each of the 6 sections every doc frame has the same width and x; 0 doc frames overlapping; the Icons section holds one labelled tile per glyph, tile count equals the set's variant count.

## W8 — Glyphs take the ink of what holds them (P: "many glyphs are not currentColor here?")

Not measured yet: the phase starts by counting.

### 8.1 — Count, then bind — to build on his go
- In code a glyph is `currentColor`: it takes the text color of its button, row or tab. In Figma that means every glyph vector's fill or stroke is bound to one ink variable that the holding component sets, never a raw hex and never its own fixed role.
- First a count: every vector inside the `Icon` set and inside every glyph instance on `↳ Components`, split into bound to the ink variable, bound to another variable, raw.
- Then the raw and wrongly bound ones are bound, so a glyph in a hovered, lit or disabled control follows that control's text color.
- Acceptance: 0 raw fills or strokes on glyph vectors in the `Icon` set; in every component state the glyph's resolved color equals that state's label color, as a table of component, state, label color, glyph color with 0 mismatches.

## W9 — Themes (P: "it just occurred that we dont have themes in kolbox?"; "when we ship this we have custom theme, so you can change kolbox to other theme with css, they wont maybe change more then just 'the look' think obsidian"; "you could set f.e. minimal easily. maybe default mono with jetbrains, and maybe folio? give we sync those"; "how does dark mode look? we need to know that right?")

Read 2026-11-18: kolbox has exactly one look. In Figma the color collection `Groovebox · UI set` holds one palette plus the `Brighter text` test mode. In code `apps/kolbox/src/index.css` writes the 13 colors as fixed hex in `@theme static`, with no theme selector and no light or dark switch. So there is no second mode to look at: the one look is the dark Gruvbox one.

A theme changes the look only, as in Obsidian: colors, fonts, radius, shadow. It never changes a component's tree, a size or a layout.

### 9.1 — The theme contract — TALK: which values a theme may set
- Proposal: a theme sets the 13 color roles (plus the four open ones once ruled), the two font families (sans, mono), the radius scale and the shadow styles. Spacing, control sizes and rail widths are not a theme's.
- Every component reads only those role variables. A component that holds a raw value cannot be themed, so the count of raw values is the measure.
- Acceptance: a written list of the roles a theme sets; 0 raw color, font family, radius or shadow values in any master on `↳ Components`.

### 9.2 — The themes that ship — TALK: his list
- Named so far: kolbox (today's look, the default), minimal, mono (JetBrains Mono for everything), folio. Each as dark, and as light where it has one. Minimal's and folio's values come from their own files and apps, never guessed here.
- His question, light or dark first for each, is answered by building them: 9.3 shows every theme side by side.

### 9.3 — Themes as modes in Figma — to build after 9.1 and 9.2
- Each theme is a mode of the color collection; fonts, radius and shadow get collections with the same mode names. `Brighter text` stops being a mode once he rules on it (W4).
- One sheet on `↳ Foundations`, Themes: the same `editor` screen, one rail and one menu, once per theme, labelled.
- Acceptance: one mode per ruled theme in each themed collection, same names in all; the Themes sheet holds one labelled specimen row per theme, each differing from the next only by variable mode; 0 components edited to make a theme work.

### 9.4 — Themes in code — PARKED: with W6, after the file is accepted
- `apps/kolbox/src/index.css`: the roles stay the `@theme` names; each theme is a `[data-kolbox-theme="…"]` block that sets them, the default with no attribute. A user theme is a CSS file setting the same roles.
- Acceptance: switching the attribute changes the look and no layout box moves (every element's width, height and position equal before and after, read by script); 0 hex colors in `apps/kolbox/src` outside the theme blocks.

## W10 — Code Connect (P: "should we not connect this to code connect?")

### 10.1 — Every master mapped to its kolbox component — PARKED: after W6, since the code is about to change to match the file
- Each master on `↳ Components` gets a Code Connect map to its file in `apps/kolbox/src/ui/` (and `editor/`, `labs/` where the part lives there), props mapped to variant properties, as the library does in `figma/*.figma.js`.
- A master with no code part, or a code part with no master, goes on a written list: that list is the real gap between the file and the code.
- Acceptance: every master is mapped or on the "no code part" list; every `apps/kolbox/src/ui` export is mapped or on the "no master" list; 0 maps pointing at a file that does not exist.

## W11 — Foundations: too many variables, and the wrong presentation (P: "are these sizes normal … seems quite excessive?"; "radius … why do we need so many stops?"; "space, why are we defining so much? isnt is almost counter productive?"; "effects clip"; "this is not how foundation presents type styles … nor is this color"; "why are we using fg all of a sudden, Id guess you didnt check your work? you didnt see this"; "if we want fg- and or oq- thats fine we should probably just set it in DS as variable mode with different light and dark then default?")

Read from the file 2026-11-18. I had not looked at the page before handing it over.

| Collection | In the file | What his stylesheet ruled |
|---|---|---|
| size | 103, among them 13 glyph sizes (15 to 32), layout results stored as sizes (`file-cover` 198.9, `file-card` 355.66, `file-pill` 247.8) and one per mobile part | control 28, top rail 56, rails, timeline 128 |
| radius | 25 names over 17 values (1, 3, 4, 5, 6, 7, 8, 12, 13, 14, 16, 17, 22, 24, 26, 31, 38); 5 is defined four times, 12 three times | 4, 5, 8, 12, 14 |
| space | 29 stops: nearly every whole number from 2 to 18, then 20, 22, 24, 28, 30, 31, 32, 33, 34, 36, 40, 270 | 4, 8, 12, 16, 24, 32 |
| names | two styles side by side: `color/text` and `var(--color-hover)`, `menu/row` and `var(--menu-row-pad)` | one |

Cause, one for all three: my acceptance lines asked for "0 raw values" and "within 1px of his reference" in the same phase. The references were captures of Figma's own app, whose numbers are not on a scale, so every odd number an agent met became a new variable. A scale with every whole number on it is not a scale.

Cause of the `fg`: the two sheets moved into Color (Surfaces, Text color test) are doc sheets built with the KOL library's parts, bound to the library's `--kol-fg-*`, `--kol-oq-*`, `--kol-surface-*`, its spacing and its Right Grotesk text styles, in Light. So are the other sheets on Layout UI. Kolbox's own components do not use `fg`.

### 11.1 — Kolbox takes KOL's scales (his answer 2026-11-18: "why dont we check kol? dont we have 8pt scale spaers there? 1 2 4 6 8 12 16 20 24 32 etc. we can also add 10 and 14 if we want ? just wondering whats already defined?") — to build on his go; the three additions below are his to rule

What KOL defines today (`packages/theme/kol-base-tokens.css`, `docs/documentation/01-foundations/09-sizes.md`):

| Scale | KOL has | Kolbox needs beyond it |
|---|---|---|
| Space | 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 | 1 and 6 are on his list and not in KOL; 10 and 14 only if a part cannot do without |
| Radius | names xs, sm, md, lg, xl, 2xl, full; xs is 2, full is 9999, every other name is 4 | his stylesheet's 4, 5, 8, 12, 14 fit the five names sm to 2xl exactly, as the kolbox mode's values |
| Control height | 22, 26, 32, 40 | his stylesheet's control is 28, which is between sm and md |
| Glyph | its own ladder, never follows the box | none: kolbox's 13 glyph sizes collapse onto it |

- Space: kolbox binds to KOL's stops. 1 and 6 are added to KOL (his list has them, tight rails use 6); 10 and 14 are not added unless a named part fails without them.
- Radius: kolbox adds no names. Radius is part of the look (W9), so the kolbox mode sets sm 4, md 5, lg 8, xl 12, 2xl 14 where KOL's default has 4 for all.
- Size: only control heights, glyph sizes, rail widths and bar heights are variables. A width or height that comes out of auto-layout is not a variable. Control 28: TALK, either a kolbox value for KOL's `sm` or kolbox moves to 26.
- The price: parts move by up to 2px against the reference captures.
- Acceptance: 0 space stops in kolbox that KOL does not define (after 1 and 6 are added); radius uses exactly KOL's 7 names; size ≤ 20 variables; each stop defined once; 0 variables whose value is a layout result; 0 unused; one naming style, 0 names starting `var(`; a table of every rebound property with old and new value, largest move ≤ 2px.

### 11.2 — Foundations presented as the library presents them — to build on his go
- The model is the library's Styles chapter, `n48kE2bJtrFjl7wxst30xH` pages Colors, Typography, Spacing + sizes, Radius + effects (1453:66451 to 1453:66454): read first, then copied frame for frame with kolbox's values in place.
- The six sections built today are replaced; today's frames go to `_trash`. Surfaces and Text color test go back to Layout UI, where they came from.
- Effects: each specimen has room around it and no clipping ancestor, so the whole shadow shows (today the tile's row cuts it).
- Acceptance: one page section per library Styles page, each doc frame's tree, paddings and text sizes equal to its library model, as a table; every specimen bound to what it shows; for each effect specimen the shadow's full extent lies inside every clipping ancestor, 0 cut.

### 11.3 — Kolbox's colors are a mode of the DS color collection — RULED 2026-11-18 ("A mode in the DS"); to build on his go
- Kolbox components bind to the library's names (surface, fg, oq, accent, the tones) in place of the 13 roles; kolbox is a mode of the library's `color` collection, dark and light. The 13 roles' values become that mode's values; muted text becomes an fg step, so a few tints shift slightly.
- This settles W9's shape: a theme is a mode of the DS collections. Minimal, folio and mono are modes there too; 9.1 and 9.2 still need his list.
- It is a change to the library file `n48kE2bJtrFjl7wxst30xH` and to `packages/theme/kol-color.css`, mirrored the same turn.
- Acceptance: 0 kolbox masters bound to a kolbox-only color variable; the library `color` collection has kolbox modes for dark and light; a table of the 13 old roles, the DS variable each maps to and the old and new hex, with every shift listed; the same mode exists in code under one selector.

## W4 — His calls — TALK

Nothing here is built before he rules.

### 4.1 — From today's build — TALK
- The dock has a 1px divider line his reference does not draw, and a 12 chevron where his is 24.
- `GeneratorWindow` is 880 wide, taken from code, with extra space above its Image group. Its parts with no kit piece are listed in the old plan under 6.1.
- `labs morph` was renamed `morph`.

### 4.2 — Carried over — TALK
- The four Surfaces colors: accent hover, disabled text, backdrop, disabled button.
- The mobile sheets' mapped colors (accent for his blue, the avatar colors) and the one canvas crop used in all four file views.
- The mobile menu rows have no gap.
- The search glyph and the four back chevrons, changed without his go: keep or undo.
- Phone layout for the design view: no drawing to build from.
- Built and waiting on his review: left rail states, right rail sections, overlay parts and states, the one rail system, the Labs rails.

## W5 — Set aside — PARKED: seen 2026-11-17, he has not asked for them

- Layer rows against his older rail 144:32321.
- The randomise buttons in the Labs right rail.
- The audit of every part against his reference sheets.
- Small differences: lit tint warmer than Figma's; effects menu 167 wide against his 202; active tab in Stroke settings accent where his is white; sliders have no filled run; the time field is two cells where Figma's is one; no stop glyph.

## W6 — Code — PARKED: kolbox is brought into line with the file only after he accepts the three pages

## Order
1.1 → 1.2 → 1.3, then 2.1, then 3.1 and 3.2 (built). Next: 7.1 → 7.2 → 8.1; 9.3 after he rules 9.1 and 9.2; W6 code, then 9.4 and 10.1. W4 whenever he rules.
