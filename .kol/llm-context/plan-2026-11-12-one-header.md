# Plan — One Header, collapse-v / collapse-h, ModalSettings in float, base parts only

**Raised:** 2026-11-12 evening, the user in the library and the float file. Points verbatim:
- P1 *"I JUST WANT ONE MOTHERFUCKING COMPONENT FOR THE FUCKING HEADERS"* — *"can we not take all those headers and UNIFY them in one header component? so you just switch by toggle/dropdown?? that would be best FOR ME as I m working in figma"*; *"VARIANT.. there will be a variant FOR THE FUCKING SWITCHER… ModalHeader THAT SHOULD BE A FUCKING VARIANT"*; *"inside nav I dont care if that is another component or not"*.
- P2 *"why am i finding 2 seperate components inside the header slot of NavRail? and why is the chevron 18 in stead of 12"*.
- P3 Folded → expanded loses the body (his screenshots: 264×40 pill, then 264×178 with an empty body).
- P4 *"we dont say 'folded'… we say EXPAND COLLAPSE"* → *"collapse-v collapse-h"*.
- P5 *"outline? why did this change? solid toggle doesnt work unless you drill down to 'play' glyph icon"*.
- P6 *"I really dont like this 5 centered buttons.. its basically 4 exports and 1 open, isnt that just 2 buttons with menufloat?… thats what we made the split button for right?… just missing a divider, and maybe a grey option"*.
- P7 *"why is every frame dark instead of the page one time?"*
- P8 ModalDialog settings (his review + his mock, float file node 143:35343): *"what the living fuck is so hard about 'FLOAT'? its literally 2 styles.. A and B.. if Float then USE FLOAT STYLE"*; *"illegal toggleswitch that has LABEL!! no toggle with label is LABELEDCONTROL -- and i see no labeledcontrolsection"*; *"you invent actions — where its so clearly a button group"*; *"new rail style"*; float variant: *"why doesnt it use width? why is filename outside of 'fields'?"*
- P9 *"why do you keep renaming base components .. the component is INPUT that is useful information"*; *"renaming labelled control is also STUPID"*; *"SettingsCell … just wraps labeled control for NO reason"*; *"whats the point of taking a base, and wrapping it and adding nothing"*; *"'readout' should just be an input"*.
- P10 *"the figma file and i assume DS is riddled with these bullshit components? … this cant stand"*; *"if you would successfully USE MY SYSTEM then this would not be a problem"*.
- P11 (2026-11-13) ModalSettings against his mock (float file 143:35343): *"I MADE A VERSION TO FOLLOW… BECAUSE YOU IGNORED IT"*; *"WHAT IS THAT BORDER Ive said about a million times"*; *"its just stupid layout"*; *"mine: CLOSE TO PERFECT"*.
- P12 NavRail: *"cant collapse into simple rail?"*; *"compact and collapse v do the same thing"*; *"wide also fold"*; *"I would just create a component from those two states. NESTED component"*; NavRailFloatBody: *"doesnt make any sense"*.
- P13 *"TABSROW doesnt use components"*; the empty Parameters block: *"supposed to be empty?"*
- P14 Transport: *"a button for the transport to hide more then just play that becomes a play/pause button… we just need some indicator to fold expand"*.
- P15 *"Drift · Storm dont use bullets in the UI"*; *"you just split the content into windows and they expand and collapse as you see fit"*; *"maybe you can also fold within sections?"*; *"Field is still renamed labelled control sections LIKE I HATE"*; *"super random padding that controls spacing?? why not controlled GAP??"*
- P16 (2026-11-13) *"Fix everything I've said.. THEN TRASH this page [float file ↳ Float labs, 40:8925] AND REBUILD it with frames that actually show LABS controls... because you are literally NOT DOING IT NOW"*.

**Status:** DRAFT — 2026-11-12. Nothing built until his go.
**Shape:** W › phase › list.
**Laws carried:** the kol-figma LAW card (16 rules); one name per thing, family word first; base components keep their names and nothing wraps them for nothing (LAW 17); float surfaces use float parts only; names fixed once said (nav · property · modal · settings; collapse-v · collapse-h) and never swapped; code first when code breaks a law; old names stay as aliases on the retirements ledger; chevrons 12.
**How a phase closes:** the acceptance line below, gates green, audit 0 on touched pages, then I look at it myself before he hears about it. He reviews in Figma, never from file paths.

## W1 — One Header (P1, P2)

### 1.1 — Code: one `Header` with `variant`
- One component, `Header`, `variant` = `nav` · `property` · `modal` · `settings`. Toggles: icon, ⌄ (nav), expand, collapse-h, collapse-v, close. Title is a slot.
- RailHeader float, NavRailFloat's switcher row, ModalHeader and the ModalSettings header render it. Old names stay as aliases.
- The nav ⌄ and the collapse-v chevron are 12 (`--kol-float-chev-sm`), not `chev-lg`.
- Acceptance: 1 header component in packages (grep: 0 other header row implementations in RailFloat, NavRailFloat, ModalDialog, ModalSettings); 0 `float-chev-lg` in headers; gates green; published.

### 1.2 — Figma: one `Header` set
- One component set `Header`, variant dropdown nav · property · modal · settings, the same toggles. RailHeader float, NavRail/switcher, ModalHeader and `_ModalSettingsHeader` fold into it; NavRail/switcher and the leftovers go to `_trash` with `_` names.
- Every header slot in the library and the float file holds one Header instance — the NavRail he found (switcher + loose Fold) included. Doc frame named Header.
- Acceptance: 0 header slots holding anything but one Header instance (script count, both files); 0 chevrons in Header other than 12; Code Connect parse 0.

## W2 — collapse-v and collapse-h (P3, P4)

### 2.1 — Words
- collapse-v = the chevron: the Rail collapses up to its header bar. collapse-h = the panel button: the Rail collapses sideways out of view. "fold" leaves code, Figma and docs.
- Code props: `folded`/`foldable`/`onFold` → `collapsedV`/`collapsibleV`/`onCollapseV`; the panel button `onCollapse` → `onCollapseH`. Old names aliased.
- Acceptance: grep `fold` in RailFloat, RailHeader, NavRailFloat, PropertyRail, Figma property names = 0 outside aliases.

### 2.2 — Collapsed is the same tree
- RailFloat's collapse-v variant keeps the SAME header, body and footer slots, body and footer hidden, never removed; the chevron points ⌄ when collapsed.
- Acceptance: in Figma, toggle collapse-v on then off on a filled NavRail instance → body, footer and their contents identical before and after (script compares child counts and text).

## W3 — Transport lit = solid (P5)
- The transport button's lit state shows the glyph's `-solid` cut by itself, as code does (`AppFloatNav.jsx` `lit()`); the glyph's `solid` property is exposed on the button.
- Acceptance: every lit transport button in the library and float file renders the solid cut; `solid` is settable on the button without drilling in.

## W4 — Export as two buttons (P6)

### 4.1 — Code: `ButtonSplit`
- `ButtonSplit` (family word first): main action, a divider, ⌄ opening MenuFloat. Variants default · float, and a grey one.
- EditorFooter's Output: `ButtonSplit` "Export PNG" ⌄ (Export PNG · Export loop (webm) · Record · Batch export) + `Button` "Open output window". Labels unchanged.
- Acceptance: 0 of the five centred buttons left; the menu lists exactly those four; gates green; published.

### 4.2 — Figma
- SplitButton (1181:989) becomes ButtonSplit with the divider and the grey variant; the Output section in the library and float file uses it.
- Acceptance: matches 4.1 in a screenshot pair; Code Connect parse 0.

## W5 — Theme once per page (P7)
- The float file's screens inherit Dark from the page (or the section), not one frame at a time; `10 · light theme` is set Light.
- Acceptance: 0 screen frames on Float labs with their own Dark mode; 10 shows Light.

## W6 — ModalSettings in the float style, base parts only (P8, P9)

Cause: the settings window was built from invented parts instead of the float system. Target: his mock, float file 143:35343.

### 6.1 — Code
- ModalSettings (and ModalDialog `settings`) renders only base float parts: the one Header (variant settings); nav rows = the float list row (selected fg-12, hover fg-04); each control row a `LabeledControl` (vertical) around a float `Slider` + `Input` pill, float `Dropdown`, float `Input`; groups are `LabeledControlSection`; "Live preview" is a `LabeledControl` (horizontal) + bare `ToggleSwitch`; the footer buttons are a `ButtonGroup` of `Button` float. No borders, no 6px-radius boxes.
- Retired (aliased where published, else moved to `_tmp/`): `SettingsCell`, `SettingsSlider`, `NumberBox`, `SettingsSelect`, `SettingsSegmented`, `SettingsRange`, `SettingsToggle` and any other pass-through. Real parts stay (field map, lights editor, point).
- ModalDialog float: width from the width token; File name inside `fields`; Loop playback a `LabeledControl` + bare `ToggleSwitch`; the button row a `ButtonGroup`.
- Acceptance: in ModalSettings' rendered DOM, 0 `.kol-btn` that is not float, 0 bordered input boxes, every label+control pair is one LabeledControl (script count = rows); grep finds 0 uses of the retired wrappers; gates green; published.

### 6.2 — Figma
- ModalDialog `settings` and the 5 ModalSettings windows rebuilt from library instances to match 6.1 and his mock; `SettingsCell`, `SettingsSlider`, `_NumberBox`, `_ModalSettingsFooter`'s "Live preview" part, `readout`, `value`, `actions` gone (to `_trash`). `Slider` float is the Slider, not a wrapper round `slider-base`. `ToggleSwitch` loses its `label`. Doc frame "Dialog" renamed ModalDialog.
- Acceptance: 0 instances of the retired parts in the library and float file; 0 `ToggleSwitch` with a label layer; audit 0; side by side with his mock within 2px on rows he filled.

## W7 — The same disease everywhere (P10)

Cause: base parts renamed or wrapped for nothing across code and the library.

### 7.1 — Find, by script (no reading agents)
- Figma: every component whose only visible child is one instance of another component; every layer named like a renamed base (`readout`, `value`, `*Box`, `*Cell`, `slider-base`…); every control carrying its own label; every button row not a ButtonGroup. Code: every component that only passes props to one base (about 30 `Settings*` to start).
- Acceptance: one list, as a page in the library (`　　↳　Wrappers`), each row = the offender instance, the base it should be, my verdict (remove / keep + why). Count stated.

### 7.2 — His strike-through — TALK
- He strikes any verdict he disagrees with, in Figma. Nothing is removed before that.

### 7.3 — Fix, code first
- Each use switches to the base; wrappers retired (aliases on the ledger where published); Figma follows, wrappers to `_trash`.
- Acceptance: 7.1's script reports 0 "remove" rows left; gates green; published; audit 0.

### 7.4 — It cannot come back
- `audit.js` fails on a single-child wrapper component, a renamed base and a labelled control; the code gate fails on a new pass-through component.
- Acceptance: a planted wrapper in a scratch frame trips the audit.

## W8 — ModalSettings to his mock, exactly (P11)

Cause: W6 was built and checked against the live code, not against his mock; the code itself carries the border and the layout faults. His mock (float file 143:35343) is the source; code and the library follow it value for value.

Measured from his mock vs the library today:
- Sheet 880×656, padding 0, radius 20 (library: padding 1, radius 16, a visible oq-16 border).
- Rows: header 60 · rule · body 536 (fills) · rule · footer 60 (library: body 490, footer 104 — the footer stretches, the nav stops short, Lights is cut off).
- Footer: Live preview = LabeledControl with the small toggle; Reset · Cancel · Apply all Button float sm 28 on one centre line, Reset and Cancel on the grey tone (library: big toggle, black well pills, Cancel sitting higher than Apply inside a 36 ButtonGroup).
- Content: section 354 tall for the 12 rows, label-to-control gap tight (library 412: the rows are too far apart, so the section overflows).
- Nav: surface-primary column filling the body, no extra border beyond the one rule.

### 8.1 — Code
- ModalDialog settings / ModalSettings: no outer border, radius 20, padding 0; header 60, body fills, footer 60 hugging; the two rules as in his mock; row spacing, footer buttons, the small toggle and the grey tone from his mock's values.
- Acceptance: live window screenshot over his mock at 880×656: every block edge (header, nav, content, aside, footer, each row) within 2px; 0 outer border; footer buttons share one centre line.

### 8.2 — Figma
- ModalDialog `settings` and the 5 ModalSettings windows rebuilt from HIS frame's values (his frame is the reference, laid beside it); base parts only (LAW 17).
- Acceptance: the library window over his mock within 2px on every block; audit 0.

## W9 — NavRailFloat (P12)

### 9.1 — ✅ built 2026-11-13 (by hand, no agent)
- `NavRailFloat` component set, `collapse-h` false (264) / true (72), each cut one RailFloat that fills its height. Library node 2085:16101. Round trip tested: toggle on/off at 700 tall, content identical.

### 9.2 — Finish it
- NavRailFloatBody is retired: its content (search field · LabeledControlSections of TreeRows) sits directly in NavRailFloat; the master moves to `_trash`. Move the set into its doc frame on the right page. FloatLayout and the float file's nav rails use NavRailFloat instances.
- RailFloat `compact` / `wide`: switching them on a stretched rail must keep its height and body (today the body's stretch resets and the rail shrinks round clipped content). Fix the master's sizing so it survives; test on a rail in a screen.
- Acceptance: 0 NavRailFloatBody instances; on a NavRail in a Float labs screen, collapse-h, compact and wide each switch and switch back with identical content and height (script numbers).

## W10 — Rails as windows, sections that collapse (P13, P15)

### 10.1 — Code
- The right side is a stack of separate rails (windows), each its own RailFloat with collapse-v: e.g. the effect's parameters, Output, File — no scrolling inside one container. PropertyRail's tabs/sections become windows.
- No middot in UI titles: "Drift · Storm" → Header title "Drift" + its quiet second text "Storm".
- LabeledControlSection: collapsible with one indicator, the 12 chevron at the right end of its head (the same chevron as the Header). Spacing between sections is the body's GAP token; the section's own top padding (21) goes.
- With no effect picked, "Parameters" sits directly above the rule (no empty block).
- Acceptance: FloatLabs right side renders ≥2 RailFloat windows, each collapsing alone; 0 middots in rail titles (grep + DOM); 0 section top padding (computed style); gates green; published.

### 10.2 — Figma
- The same in the library and the float file. Section instances keep the layer name `LabeledControlSection` (never "Field", "Sky", "section"). TabsRow is built from a `Tab` component's instances — no loose tab frames, no hidden spares.
- Acceptance: 0 LabeledControlSection instances with another layer name; 0 non-instance tabs in TabsRow; the empty block gone; audit 0.

## W11 — Transport collapses to play/pause (P14)

His ruling 2026-11-13: the indicator is a regular small chevron, as Figma does it (the small ⌄ beside ▷, beside +, beside 17%) — *"not double. just regular, figma uses regular small"*.

- One play/pause button in both states (play at rest, pause solid while playing); it sits beside the timecode and never moves. Collapsed = that button + the timecode; any toggle that is ON (Loop) stays visible.
- The indicator: one small regular 12 chevron (`--kol-float-chev-sm`, quiet oq-64) directly beside the play/pause button, Figma-style. It points to where the extras open: ‹ collapsed, › expanded. The extras (skip-start · stop · loop) open to its left; the pill's right edge stays put.
- Code: Transport's fold props become collapse-h (`collapsedH`, `collapsibleH`, `onCollapseH`, old names aliased); starts collapsed, remembers the choice.
- Acceptance: live transport toggles between the two states by the chevron with the play/pause button's x unchanged (measured); the library transport has a `collapse-h` toggle giving the same two states; chevron is the 12 token.

## W12 — Float labs page, trashed and rebuilt with the real Labs controls (P16)

Cause: the screens show a stand-in rail (one Drift panel, an empty Parameters block, a black stage), not what Labs really shows. Runs after W8–W11 and his library publish.

- The current ↳ Float labs page moves to the `_trash` page (renamed `_Float labs 2026-11-12`), never deleted. A new ↳ Float labs page is built.
- Every frame is measured from the live app (`/#/views/float-labs`, 1600×1000 and 390×844) AFTER W10 lands: NavRailFloat (Labs catalog, collapse-h both ways), the right side as windows with each effect's REAL controls — at least Color, Effects › Halftone, Generative › Drift, Generative › Flow, Morph › Shape — each control a LabeledControl around the base float part the code renders; Output and File windows; the transport expanded and collapsed; the stage showing the effect's render (a screenshot fill from the live app, not black).
- States: empty stage · one frame per effect above · nav collapse-h · a window collapse-v · restore prompt · waiting for media · light theme · phone (windows collapsed, nav behind the trigger).
- Acceptance: for each frame, the control labels and values read from the live DOM equal the frame's (script diff = 0 missing, 0 extra); 0 hand-drawn rows; every rail a RailFloat/NavRailFloat instance, one Header each; audit 0, 0 unlinked; each frame within 2px of live on rail edges.

## Order
W1.1 → W2.1 (code, one publish) → W1.2 + W2.2 + W3 + W4.2 + W5 (one Figma pass) → his library publish → Code Connect publish. W4.1 rides with the W1.1 publish. Then W6.1 → W6.2 → his publish. Then W7.1 → his strike-through (7.2) → W7.3 → W7.4.
Then (2026-11-13): W8 first (his mock) → W9.2 → W10 → W11; code first each time; W7.3 after his Wrappers strike-through. Then W12 after his publish.
