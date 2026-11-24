# Plan — the float Rails in Figma, built for code

**Raised:** 2026-11-12 (P12 two options = a toggle; P14 folded is the same tree; P15 fold chevron 12; P16 label is a slot; P17 `horizontal`, not `inline`; P18 no inline parts; P19 fields without `_Field`; P20 one section component), the user on `❖ library--kol-ds-ui` and `◇ float--kol-ds-ui` › ↳ Float labs. Points verbatim:
- P1 *"264 AND 360"* — the two Rail widths (memory `float-rail-widths-264-360`).
- P2 *"WHY IS CLIP CONTENT NOT FUCKIGN ON!!!!"* — on FloatModule (memory `figma-clip-content-always-on`).
- P3 *"NavRail, PropertyRail, ReadingContents ARE ALL RAILS... I SPECIFICALLY MENTIONED ALL OF THEM... YOU DID NOTHING ABOUT THEM??"*
- P4 *"I SPECIFICALLY SAID USE LABELEDCONTROL BUT YOU DIDNT!!!!!"* — the Float labs rows are still hand-drawn `frame › label + frame`.
- P5 *"WE ARE DESIGNING FOR FUCKIGN CODE!!! SO FOCUS ON FUCKIGN FIGMA"*
- P6 *"CAN YOU FUCKING DEPLOUY MORE AGENTS IF THAT SAVES TIME"*

**Status:** DRAFT — 2026-11-12. Open: everything. Nothing built until his go.
**Shape:** W › phase › list.
**Laws carried:** clip content ON on every float master and every screen frame; Rail widths 264 and 360, nothing else; every row a LabeledControl instance around a bare control; every Rail is one shell, family word Rail; library instances only, no hand-drawn rows; no wrapper frames; sizes bound to variables; a set means every member; trash needs `_`; Figma follows code names (Code Connect); never report Figma call counts.
**How a phase closes:** measurable acceptance line first; the Figma audit at 0 errors; then I screenshot the result myself and check it against his verbatim points before he hears about it. No "partial" closes a phase.

## Why it failed last time (one line each)

- P3: the shell was built as a new `FloatModule`, and PropertyRail and NavRail kept their own bodies, so in Figma there are still three separate drawings.
- P4: only the masters were rebuilt; the Float labs rows were deferred to "after the publish" and never redone.
- P2: I briefed "a float master never clips" — wrong; it switched clip off on 23 masters.

## W1 — The library (agents A and B in parallel, disjoint nodes) (P1–P3, P5, P6)

### 1.1 — One Rail shell (agent A) (P3, P1, P2)
- One shell master: header (title · fold · actions), body slot, footer slot, folded pill 40 tall; width bound to the two Rail variables, 264 and 360; clip on.
- NavRail float, PropertyRail and ReadingContents are built FROM it: each is the shell with its own body content, not its own drawing. If Figma refuses a slot-in-slot, the shell is a component set (`rail` = nav · property · contents, `folded` boolean, `wide` boolean) and the three existing masters become those variants, with their Code Connect re-pointed.
- Acceptance: 1 shell master; NavRail, PropertyRail and ReadingContents each contain 0 header/sheet layers of their own (all from the shell); every Rail is 264 or 360 wide; folded = 40 tall; clip on for all.

### 1.2 — Rows, clip, widths (agent B) (P4, P2, P1)
- LabeledControl float inline: label column variable, a control slot; Slider float bare 28, Input fill, Dropdown float, ToggleSwitch float each placeable in it.
- Clip content ON on every float master in the library (the 23 switched off included) and every screen frame in the float file; the kol-figma audit script gains a check that fails on any float master or screen frame with clip off.
- The Rail width variables set to 264 and 360 (replacing 272 · 280 · 352); nothing else changes width.
- Acceptance: audit clip check reports 0 off; Rail width variables = {264, 360}; LabeledControl float master exposes a control slot and every float control fits it at 264 with 0 wrapped values.

## W2 — Code matches (agent C, in parallel with W1) (P1, P5)

### 2.1 — 264 and 360 in code ✓ 2026-11-12
- kol-theme Rail width tokens to 264 and 360; the float spec doc; NavRail float, PropertyRail, ReadingContents, GeneratorRail, Labs read them; Labs and the generator Rails checked at 264 and 360 (Playwright, 0 wrapped values, 0 labels outside LabeledControl); publish.
- Acceptance: `validate:float` 0; every Rail measures 264 or 360 live; published versions registry-verified.

## W3 — The Float labs screens (after his library publish) (P4, P3, P2)

### 3.1 — Every state rebuilt from instances — BUILT 2026-11-12 (14 frames in section 40:14657 on ↳ Float labs, old frames in `_trash` section 116:3959 with `_`; every Rail a FloatModule instance, rows LabeledControl float, groups LabeledControlSection float; open: an LCS can't hold an LCS in Figma so nested sections sit beside "Parameters"; phone Rail 342 = code's width 100%; file audit errors outside this page untouched)
- Every Rail on every Float labs state is a shell instance; every row is a LabeledControl instance with a bare control; screen frames clip.
- Each state measured against live code at 264/360.
- Acceptance: 0 hand-drawn rows (no `frame › label + frame` rows); 0 Rails outside the shell; 0 clip off; each state within 2px of live; audit 0 errors, 0 unlinked.

## W4 — The Rail shell is slots, and every part inside it is clean (P7–P10)

Raised after W1 (2026-11-12), points verbatim:
- P7 *"why is header not component?"*
- P8 *"why is ReadingContents wrapped in body div?"*
- P9 *"why is footer empty? NESTED INSIDE IS empty 32 px tall unamed FRAME"*
- P10 *"'chapters' THAT with '9 INTERLUDES' could be considered LabeledSection? … did you not consider CLEANING UP THE FUCKING COMPONENTS WE TOUCH"* and *"most of the time we use slots except now?"*

Law carried (memory `clean-every-component-you-touch`): a touched component leaves clean. Every layer is named, a repeated part is a component, a body is a slot, there are no spacer or empty frames, and a label + rows group is a LabeledControlSection.

### 4.1 — Code: the parts the Figma tree mirrors ✓ 2026-11-12
- `FloatModuleHeader` (kol-component): title, an `actions` slot and the fold ⌃/⌄, extracted from FloatModule; FloatModule's `header` defaults to it.
- FloatModule has three slots, `header`, `body` (children) and `footer`; the footer renders only when given. Folded is the SAME component with the SAME `FloatModuleHeader` in the header slot, body and footer slots hidden, never removed (P14 *"EVEN THE FOLDED will get header body and footer?!?!?! RIIIGHT????"*), drawn as the 40-tall pill.
- The fold chevron is the 12 chevron token, not the float Button's 18 glyph, in FloatModuleHeader (P15 *"why is the chevron 18? … USE 12px chevron"*); the same token as the Dropdown and the layer rows.
- ReadingContents is body content: no `bare` mode, no own sheet, no top margins. Column gap 24: `book` (title + author, gap 4), a float `LabeledControlSection` ("9 interludes" over the TocRows, gap 12, rows gap 4, TocRow 36 tall), `progress` (head label · value over the ProgressBar, gap 12). The status line leaves ReadingContents and goes into the module's footer slot at the use site (apps/float `/parts/calendar` and any other caller).
- Acceptance: the fold chevron measures 12×12 live, open and folded; folded mounts 1 FloatModuleHeader and its body and footer exist hidden; 0 `mt-*` in ReadingContents; FloatModule mounts 1 FloatModuleHeader and 0 footer nodes when none is passed; every caller of ReadingContents updated (grep); live Contents rail within 2px of the tree below at 264; gates green; published.

### 4.2 — Figma: one shell with slots, built to the tree ✓ 2026-11-12
- FloatModule is one master exactly as the tree below: three slots, and every two-option property a boolean toggle, never a variant list: `folded` is a boolean property (it hides body and footer); `wide` and `compact` are not properties at all, they are variable modes on the width and gap variables; `rail` goes (the content is in the slots) and `collapsed` moves to NavRail's own content; the nav · property · contents variants retire, and every Rail is a FloatModule instance with its content in the slots (existing instances re-linked, never detached).
- FloatModuleHeader and ReadingContents are built exactly as the tree: every node's frame type, sizing, gap and padding as written, every layer named.
- Folded: the same tree, header slot showing the same FloatModuleHeader instance, body and footer slots present and hidden; no loose `title` / `end` (today's folded variant is a separate drawing and is replaced). The fold chevron is 12 (bound to the chevron variable) in every state.
- Acceptance: the folded layer dump = header (FloatModuleHeader instance) · body (slot, hidden) · footer (slot, hidden); fold chevron 12×12 open and folded; on a FloatModule instance, 0 properties with two options show as a list (every one is a toggle); the layer dump of FloatModule, FloatModuleHeader, ReadingContents and the Contents rail instance matches the tree node for node (type, auto-layout direction, W/H sizing, gap, padding); 0 unnamed `Frame`, 0 empty frames, 0 spacer frames; clip on; audit 0 errors, 0 unlinked.

### 4.3 — The audit catches it next time ✓ 2026-11-12
- The kol-figma audit fails on any unnamed `Frame`, empty frame or spacer frame (a childless frame used only for height) inside a master.
- Acceptance: 0 on the library after 4.2; the retired ReadingContents in `_trash` is reported as failing.
- Status 2026-11-12 (open): the rules exist and pass on every root 4.2 touched (FloatModule, FloatModuleHeader, ReadingContents, the Rail contents: 0 unnamed / empty / spacer); library-wide they still fail on masters outside W4 (Molecules: 112 unnamed, 68 spacer, 2 empty — SectionHead, SpecList, Slider base, TabsRow…). chevron-size: 12 left, all non-float chains (regular Button / Dropdown filled inside LabeledControlSection float=false, Dialog settings, SettingsSelect/Ramp, Card window) that the owner-name float test reads as float; the audit refinement (float chain only; folded-tree on shells only) was refused by permission and waits on his go.

### 4.4 — I check the tree myself ✓ 2026-11-12
- I dump the four layer trees and compare them line by line with the tree below; he gets the dump.
- Acceptance: the dump matches the tree node for node.

**Target tree (his approval 2026-11-12, "fucking finally"; code and Figma the same):**
```
FloatModule                    COMPONENT · auto layout VERTICAL
│                              W fixed = float/module-w 264 (wide → 360) · H hug
│                              padding 16 · gap float/module-gap 18 (compact 8)
│                              radius float/menu-r 20 · fill surface/secondary
│                              effect shadow/float · clip ON
│                              props: folded (bool) · wide (bool) · compact (bool)
├─ header   SLOT · auto layout HORIZONTAL · W fill · H hug
│           default → FloatModuleHeader
├─ body     SLOT · auto layout VERTICAL · W fill · H hug · gap 18 · clip ON
└─ footer   SLOT · auto layout VERTICAL · W fill · H hug · hidden when empty

  folded=true → the SAME component, the SAME tree:
  header slot (the same FloatModuleHeader) shown · body + footer slots HIDDEN, not removed
  auto layout HORIZONTAL · W fixed 264 · H fixed 40 · padding L16 R6 · radius full


FloatModuleHeader              COMPONENT · auto layout HORIZONTAL
│                              W fill · H hug · align center · space-between · gap 8
├─ title    TEXT  kol-float-panel · W fill · truncate
└─ end      auto layout HORIZONTAL · W hug · gap 4
    ├─ actions   SLOT (empty by default)
    └─ fold      Button float ghost sm · iconOnly chevron-up / chevron-down · glyph 12 (chevron token, not 18)


ReadingContents                COMPONENT · auto layout VERTICAL
│                              W fill · H hug · gap 24 · no padding (the module pads)
├─ book                        auto layout VERTICAL · W fill · H hug · gap 4
│   ├─ title    TEXT  kol-float-section  "The Waves"
│   └─ author   TEXT  kol-float-hint fg-64  "Virginia Woolf"
├─ LabeledControlSection       INSTANCE (float) · W fill · H hug · gap 12
│   ├─ label    TEXT  "9 interludes"
│   └─ rows     auto layout VERTICAL · W fill · gap 4
│       └─ TocRow × n          INSTANCE · W fill · H 36 · padding X12 · gap 16
└─ progress                    auto layout VERTICAL · W fill · H hug · gap 12
    ├─ head                    auto layout HORIZONTAL · W fill · space-between
    │   ├─ label   TEXT  kol-float-hint fg-64  "Through the book"
    │   └─ value   TEXT  kol-float-timecode  "42%"
    └─ ProgressBar             INSTANCE (float) · W fill · H 4


Contents rail on a screen = FloatModule INSTANCE, slots filled:
├─ header  ← FloatModuleHeader   title "Contents"
├─ body    ← ReadingContents
└─ footer  ← TEXT kol-float-label fg-64  "Reading position saved"
```

## W7 — LabeledControl: two slots, named by direction (P16, P17)

Raised 2026-11-12, verbatim: *"why not make 'label' a slot? for chases where we might need differnt things, icons or whatever? isnt that more future proof?"* and *"why do you call this 'inline' ??? this is obviously horizontal and this vertical"*.

### 7.1 — Code ✓ 2026-11-12
- `LabeledControl` gets `horizontal` (boolean: true = the label beside the control, false = the label above). `inline` stays as a deprecated alias that maps to `horizontal`, on the retirement ledger. `label` already takes any node (text, an icon with text); its default is the label text in the float hint style.
- Every caller in the repo moves from `inline` to `horizontal` (grep packages, apps, showcase), and the docs and component page say `horizontal`.
- Acceptance: 0 `inline` props on LabeledControl in the repo outside the alias; the alias still renders a passed `inline` the same (one test render); gates green; published with the change in the CHANGELOG.

### 7.2 — Figma — built 2026-11-12, one line open (horizontal)
- Status: label and control are SLOTs, `inline` renamed `horizontal`, 0 instances changed look, Code Connect updated. Open: `horizontal` is a false/true variant (Figma shows it as a toggle); a BOOLEAN property only hides layers and cannot switch auto-layout direction, so the audit's two-value-variant still reports it. His call: accept false/true as the toggle (and teach the audit), or name another shape.
- LabeledControl master: `label` is a SLOT (default: a TEXT layer in the label style, so an icon or anything else can go in) beside the existing `control` slot. The property is `horizontal`, a boolean toggle (horizontal = auto layout HORIZONTAL, label column bound to float/label-w; off = auto layout VERTICAL, gap 8). The old `inline` property retires, and every instance keeps its look through the swap.
- Acceptance: the LabeledControl dump = label (SLOT) · control (SLOT); one boolean `horizontal` and no list property with two options; 0 instances changed look (before and after screenshots of the Labs and Generate rails match within 1px); audit 0 errors, 0 unlinked.

## W8 — No inline parts: the selected line is LayerStackRow (P18)

Raised 2026-11-12, verbatim: *"'select' why is this not a component?!?! … WE ARE NOT FUCING MAKING FRAMES we are making A FUCKING SYSTEM!?!??"*

### 8.1 — Code ✓ 2026-11-12
- PropertyRail's `selected` line (glyph · name · eye) renders `LayerStackRow` instead of inline JSX. It is the same part: a layer's glyph, name and visibility. Props map: `selected.icon` → its glyph, `selected.name` → name, `selected.visible` / `onVisible` → its eye.
- Acceptance: PropertyRail contains 0 inline icon + name + button rows (grep); the selected line mounts 1 LayerStackRow; the line looks the same live (before and after within 1px); gates green; published.

### 8.2 — Figma ✓ 2026-11-12
- PropertyRail's `selected` frame is replaced by a LayerStackRow instance (824:68319).
- Acceptance: 0 frames named `selected` holding loose glyph, text and button layers.

### 8.3 — The rule, set-wide
- Every named part inside a component is an existing component or a new one, never a frame of loose layers. The audit (W5.4) fails on a named frame that holds a glyph, text and button pattern with no instance. The law card (W5.1) carries it.
- Acceptance: the audit run on the float masters reports every such frame; after W4, W7 and W8 it reports 0.

## W9 — Fields: the frame is the field (P19)

Raised 2026-11-12, verbatim: *"is this input and _field how we do things? is this the best way to work with inputs?"* and *"at some point someone changed every input to follow this pattenr... which is very strange."*

### 9.1 — Find every field master ✓ 2026-11-12
- A check lists every library master with a `_Field` layer inside it: Input, Textarea, SearchInput, the Dropdown trigger if it has one, and any other.
- Acceptance: the list exists, with a count per master.

### 9.2 — Rebuild on one pattern ✓ 2026-11-12
- The component's own frame is the field: fill, radius and states on the frame. Inside are three parts named by role: `leading` (SLOT: icon or prefix), `value` (TEXT) and `trailing` (SLOT: suffix, clear, unit). No hidden base layer, and no Tailwind class names as layer names (`min-w-0` and the like).
- Code does not change: `iconLeft` and `prefix` fill `leading`, `suffix` and `slotRight` fill `trailing`, and the Code Connect files map them.
- Every instance keeps its look and its link through the swap. `_Field` moves to `_trash` (with the `_` prefix) once nothing uses it.
- Acceptance: 0 masters with a `_Field` layer; every field master dumps as frame › leading (SLOT) · value (TEXT) · trailing (SLOT); 0 layer names that are Tailwind classes; 0 instances changed look (before and after screenshots of the Parts and Float labs pages within 1px); audit 0 errors, 0 unlinked.

## W10 — One section component: LabeledControlSection with slots (P20)

Raised 2026-11-12, verbatim: *"look at this section … what do you call this? its the same as the TocRow chapter with label in ReadingContents. this should be a component with slots that has multiple items?"* Agreed.

### 10.1 — Code ✓ 2026-11-12
- `LabeledControlSection` (kol-component, float variant) is the one section: a `head` (the label, which takes any node, plus an `end` for a + button or meta) over `items` (children, any number).
- PropertyRail's sections stop drawing their own `<section>` and head and render LabeledControlSection, collapsible sections included (the chevron goes into the head). ReadingContents' "9 interludes" + TocRows uses the same component (W4.1 already names it). GeneratorRail's group heads move onto it too. NavRail float's group headings (`{ heading }` items: WORKSPACE, STUDIO & LIBRARY) render LabeledControlSection as well, with their nav rows as the items, so every grouped list in every Rail uses the one component (his check 2026-11-12: *"just making sure we put the components to use right away?"*: PARAMETERS, LINES, TRANSFORM, APPEARANCE, WORKSPACE, STUDIO & LIBRARY, 9 INTERLUDES).
- Acceptance: 0 inline `<section>` + head pairs and 0 inline group headings in PropertyRail, GeneratorRail, ReadingContents and NavRail float (grep); each section mounts 1 LabeledControlSection; Labs, the Generate Rails, the Contents Rail and the nav Rail look the same live (before and after within 1px); gates green; published.

### 10.2 — Figma ✓ 2026-11-12
- One master, built to this tree:
```
LabeledControlSection          COMPONENT · auto layout VERTICAL · W fill · H hug · gap 12
├─ head                        auto layout HORIZONTAL · W fill · space-between
│   ├─ label    SLOT  (default: TEXT, float label style)
│   └─ end      SLOT  (empty by default: + button, meta)
└─ items        SLOT  auto layout VERTICAL · W fill · gap 8
                (any number: LabeledControl rows, field pairs, TocRows)
```
- Every `section` frame in PropertyRail, GeneratorRail and ReadingContents, and every group heading in NavRail float (WORKSPACE, STUDIO & LIBRARY), becomes an instance of it, with its items in the slot.
- Acceptance: the master dump matches the tree node for node; 0 frames named `section` or `head` built from loose layers in the float masters; audit 0 errors, 0 unlinked.

## W11 — The library sweep, fixed in one pass (P21)

Raised 2026-11-12, verbatim: *"surely you see how rediculous it is this process???"* → one read-only sweep by pattern, every page (`_tmp/2026-11-12-library-sweep/SWEEP.md`, 2055 live hits), then *"now you are gonna fix? yes go obviously"*.

### 11.1 — Code: list rows (pattern 4) ✓ 2026-11-12
- Menu and dropdown lists get a row gap (2px, `--kol-spacing-0-5` or the nearest spacing token); the current or selected row shows its dot and NO fill, in every panel (float and not); hover, plus keyboard focus, is the only fill.
- Acceptance: on every list in apps/float /parts/menus and the showcase menus page, with the pointer on a second row, exactly 1 row has a fill and adjacent row boxes are ≥2px apart (script); gates green; published.

### 11.2 — Library, split by page (patterns 1–3, 5–9); three agents on disjoint pages ✓ 2026-11-12 (left: 20 raw-label hits that copy code — code first; 5 grouping frames that are plain groups in code)
- Agent A: Atoms, Iconset, Identity. Agent B: Molecules, Utilities. Agent C: Organisms, Modules, Sets. Each fixes the masters ON its pages; instances elsewhere follow.
- 1 and 2: the component's own frame is the sheet, or the content goes inside the sheet's slot; no background sheets, no wrappers (LAW 15).
- 3: clip ON on every frame that draws a sheet; never on a wrapper whose child draws the shadow (LAW 4).
- 4: list rows in Figma match 11.1.
- 5: frames that should be components become instances.
- 6: two-option lists become toggles (true/false, or a boolean property when it only hides); icon sets `outline/solid` → `solid` true/false.
- 7: chevrons are already 0.
- 8: hygiene, every layer named; 0 spacer, empty or unnamed frames. The Slider's `run` is a track: name it, keep it.
- 9: wrapper frames that add nothing are flattened; a hidden layer with no property is wired to a boolean property if the code has that option, otherwise removed, and each removal is listed.
- Code Connect files for every master whose properties change are updated (not published).
- Acceptance: the audit (`audit.js`, FULL, every page) reports 0 on the agent's pages for sheet-background, sheet-wrapper, clip-off-sheet, clip-cuts-shadow, list-two-lit, list-no-gap, row-selected-filled, two-value-variant, unnamed / empty / spacer-frame, tailwind-name, not-instance-part; 0 unlinked; every touched master looks the same within 1px except list rows (11.1) and the clip fixes (shadows now visible).

## W12 — Everything the sweep left (P22)

Raised 2026-11-12, verbatim: *"CODE IS WRONG"* and *"WHY IS THIS HAPPENING NOW?! … what else wassnt done?"*. The cause: the W11 briefs said copy the code when Figma and code disagree, never fix it. **Rule from now: if the code breaks a law, fix the code first, then Figma.**

### 12.1 — Code first: 20 label rows onto LabeledControl — code ✓ 2026-11-12 · Figma ✓ 2026-11-12 (LabeledControl `settings`; Slider, SettingsCell/Toggle/Ramp, ReadingSettings, ShareButtons on LabeledControl; raw-label 0, Modal title + MediaLibrary stats exempt by component)
- Code done: Slider's `label` (row, dual, vertical), SettingsCell · SettingsToggle · SettingsRamp, ReadingSettings (6 rows, now the float label) and ShareButtons render LabeledControl; SettingsSlider/Range values are number boxes. Exempt for the audit (not label rows): Modal title beside its control (6), MediaLibrary's count line beside the unlabelled tile-size slider (5). Figma half open.
- Every row where code draws a label beside a control itself (Slider readouts, SettingsToggle, ReadingSettings rows, MediaLibrary stats and the rest in `_tmp/2026-11-12-library-sweep/B-audit-after.txt` / `C-audit-after.txt` raw-label) renders `LabeledControl variant="float"` in code, then in Figma. A heading beside a button (Modal title) is not a label row: the audit stops flagging it.
- Acceptance: raw-label 0 in the full audit; the code grep finds 0 hand-drawn label + control rows in those components; looks unchanged live (±1px); published.

### 12.2 — The 5 grouping frames — code ✓ 2026-11-12 · Figma ✓ 2026-11-12 (NavRail top `actions` a slot; MediaLibrary/settings = SettingsPanel + SettingsSections; TimelineRail settings, HubSettings about exempt by name)
- Code: none repeats as a group, so no new component. NavRail top `actions` is the consumer's slot; TimelineRail's toolbar right side and HubSettings' about column are one-off named groups; ShareButtons' frame is the component's own root (now a LabeledControl); MediaLibrary settings is SettingsPanel + SettingsSections in code, so Figma uses those instances. Figma half open.
- NavRail top actions, TimelineRail settings, HubSettings about, ShareButtons, MediaLibrary settings: if the code repeats the group, it becomes a component in code and Figma; if not, it stays a named group and the audit exempts it. Acceptance: frame-should-be-component 0.

### 12.3 — Size switches as variable modes — code ✓ 2026-11-12 (no change) · Figma ✓ 2026-11-12 (TableCell `iconLarge` had 0 uses: its 12 variants and the property removed)
- Code: `size` props (InlineAddRow, CodeBlock, ColorSwatch, StatTiles, TaskCard) are the code's size ladder and read tokens; FloatModule `wide` reads the two module tokens and `compact` spacing tokens. TableCell `iconLarge` has no code twin. Nothing to change in code; the modes are Figma's. Figma half open.
- Two-option size toggles (TableCell `iconLarge` and the others agent B made) become variable modes (LAW 7), like Kbd. Acceptance: 0 size or spacing toggles left as properties.

### 12.4 — The 4 kept wrappers — code ✓ 2026-11-12 (no change) · Figma ✓ 2026-11-12 (hop-icon · indicator · option · change; exempt by name)
- Code: each box does something, so each stays, named by code: ThemeToggle row `icon-box` = `kol-sidenav-hop-icon` (a 20 column for the 16 glyph), ToggleCheckbox `plate` = `toggle-checkbox-indicator` (the drawn box), ViewToggle `rest` = the option button (32 round, hover fill), Delta `change` = arrow + value (4 apart vs 8 to `from`). Figma half: rename to those names.
- ThemeToggle icon-box, ToggleCheckbox plate, ViewToggle rest, Delta change: if the code box exists for a reason, it's a named part; otherwise flattened in code and Figma. Acceptance: 0 sheet-wrapper or wrapper hits.

### 12.5 — Code Connect — ✓ 2026-11-12 (parse exit 0, 1317 entries, 0 missing ids; 73 files on deleted or `_trash` nodes moved to `_tmp/2026-11-12-codeconnect-retired/`, DeltaBadge repointed, float folded into the base files; publish waits on his library publish)
- Fix the 3 files that point at deleted nodes (ToggleSwitchFloat, ProgressBarFloat, PillFloat); all files parse; Code Connect published after his library publish. Acceptance: 0 files referencing missing ids; publish exit 0.

### 12.6 — GeneratorRail master — ✓ 2026-11-12 (GeneratorRail 1983:18183 on Organisms › Float windows: generate · radial · grid · mirror · type, 360 wide, live heights to the pixel)
- GeneratorRail gets a Figma master built from code: FloatModule wide, LabeledControlSection groups, LabeledControl rows. Acceptance: master dump matches the code tree; audit 0.

## W13 — The three tool windows to the laws (P23)

Raised 2026-11-12, verbatim: *"the modal in labs that holds tool settings, is it built already?"* → *"its also radial repeat and font tool … is it or will it be built?"*. Built 11-05/06 (code: `Dialog variant="settings"` + GeneratorWindow, `packages/design-editor/src/editor/generate/windows.js`: GENERATE · REPEAT (radial · grid · mirror) · TYPE (Paratype letter); Figma: Dialog settings 1043:26465, GeneratorWindow 1055:26279) before today's laws: controls drawn, not instances.

### 13.1 — Code to the laws ✓ 2026-11-12
- Done: dialog groups and Preview on LabeledControlSection `settings`, every row a LabeledControl (`settings` variant; Live preview and Live update included), the disclosure chevron the 12 token, the lit section row unfilled (LAW 16), header and footer spacer spans gone; the Rail was already a 360 FloatModule. Trees for the Figma build: `_tmp/2026-11-12-tools/trees.md`. Published kol-theme 0.223.0, kol-component 0.370.0, kol-content 0.18.0, design-editor 0.42.0.
- All three windows, dialog and rail form: every row a LabeledControl, every group a LabeledControlSection, the rail form a FloatModule wide (360), list rows per LAW 16, chevrons 12, binary as toggles. Code first wherever it breaks a law.
- Acceptance: `validate:float` 0; 0 hand-drawn label + control rows (grep); every window opens live with 0 console errors; published.

### 13.2 — Figma from instances — ✓ 2026-11-12 (Dialog settings 1043:26221 rebuilt; GeneratorWindow 1975:17225 generate · radial · grid · mirror · type; dumps `_tmp/2026-11-12-tools/figma-dumps.txt`)
- Dialog settings and GeneratorWindow rebuilt to the code tree, written out first (LAW 1): the dialog is a ModalShell sheet with its own header/body/footer slots (LAW 15), the rail is a FloatModule instance; Generate, Repeat (radial, grid, mirror) and Type, each as dialog and rail.
- Acceptance: the layer dump matches the code tree; full audit 0 on these masters; each within 2px of live.

## W5 — The rules load themselves (P11)

Raised 2026-11-12, verbatim: *"is there a fucking way … where you can … REMEMBER this … next time you open figma THEN AUTOMATICALLY another skill gets read that tells you TO STOOP FUCKING ME … AND DO THINGS CORRECTLY so i dont loose my fucking mind"* — and *"if you mention that memory THAT DOESNT WORK"*. Memory is not the mechanism; the harness is.

### 5.1 — The Figma law card ✓ 2026-11-12
- One file, `~/.claude/skills/kol-figma/LAW.md`, short (one line per rule, his words cited): clip content ON on every float master and screen frame; header · body · footer are SLOTS, never frames; a repeated part (header, footer) is a component; every row is a LabeledControl around a bare control; Rails 264 and 360, nothing else; 0 unnamed `Frame`, 0 empty frames, 0 spacer frames; a set means every member, every cut, in its named home; we design for code: Figma and code share one tree, written out (frame type · direction · sizing · gap · padding) before building; a property with two options is a BOOLEAN TOGGLE, never a list (his words 2026-11-12: *"BINARY FUCKING TOGGLE if 2 options then dont fucking use a list, use a fucking toggle"*); an agent never reports a rule as "partial".
- A new rule from him goes into this file once and reaches everything below.
- Acceptance: the card exists, ≤ 40 lines, every rule traceable to a dated quote.

### 5.2 — A hook injects it on every Figma call ✓ 2026-11-12
- A `PreToolUse` hook in his user settings, matching every Figma tool (`mcp__plugin_figma_figma__.*`) and `Agent` calls whose `subagent_type` is `kol-figma-agent`, prints the card into the context before the call runs — for me and every agent. Set up through the update-config skill; the hook script lives in `~/.dotfiles/claude/hooks/` beside goal-loop.
- Acceptance: a test `use_figma` read call shows the card in its context; an Agent call to kol-figma-agent shows it; nothing else is matched.

### 5.3 — The agent definition carries it ✓ 2026-11-12
- The `kol-figma-agent` definition (`.claude/agents/kol-figma-agent.md`, wherever it lives) includes the card verbatim at the top of its instructions, so the first step of every Figma agent starts with the rules.
- Acceptance: the definition contains the card's text; a spawned agent's first message quotes the rules it is under.

### 5.4 — The audit fails on every rule ✓ 2026-11-12
- The kol-figma audit (`~/.claude/skills/kol-figma/scripts/audit.js`) has one check per card rule: clip-off, frame-not-slot in a shell, raw label beside a control (no LabeledControl), Rail width ∉ {264, 360}, unnamed / empty / spacer frames, a variant property with exactly two values (must be a boolean toggle), a folded state that is not the open tree with body/footer hidden, a chevron glyph ≠ the chevron token, a header or footer that is not an instance. An agent cannot report pass while one is red.
- Acceptance: run on today's library before W4.2 it reports the known violations (FloatModule frames, ReadingContents spacers); after W4.2 it reports 0.

## W6 — Glass variants out, stashed (P13)

Raised 2026-11-12, verbatim: *"remove every glass light dark variant and stash disconnected somewhere either in _trash or _stash or whatever we can add it later."*

### 6.1 — Stash the glass ✓
- Every float master in the library with a `surface` glass-dark or glass-light variant: instances using a glass variant are swapped to solid first, never detached in place. The glass variants then move out of their sets, detached from them, onto a `_stash` page (after a divider, `_` prefix, so nothing on it publishes). Each keeps its old name with a `_` prefix, grouped by the master it came from, so it can be added back later.
- A `surface` property left with one value is removed from the set.
- Code is untouched: the `surface` prop stays in code; only the Figma variants go.
- Acceptance: 0 variants with surface = glass-dark or glass-light on any published master; 0 instances lost their link (audit 0 unlinked); the `_stash` page holds every removed variant, counted before and after (same number); 0 `surface` properties with a single value.

## Order

W1 ✓ and W2 ✓ → … → W11 (sweep fix: code list rows, then library pages A · B · C in parallel) → W12 (what the sweep left: code first) → W13 (the three tool windows to the laws) → W5 (the card, the hook, the agent definition, the audit checks) → W6 (glass out to `_stash`, fewer variants to rebuild) → W7 (LabeledControl label slot, `horizontal`) → W9 (fields: the frame is the field) → W8 (selected line = LayerStackRow) → W10 (one section component) → W4.1 code → W4.2 Figma → W4.3 audit → W4.4 my tree check → his library publish → W3 screens rebuilt from the slotted shell → I check W3 against P1–P10.
