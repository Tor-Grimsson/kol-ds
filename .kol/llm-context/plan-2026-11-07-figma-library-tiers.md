# Plan — the KOL Figma library on the atomic taxonomy

**Raised:** 2026-11-07, his question *"ok so lets say we have a system in buttons page, where does it leave us with the remaining figma file structure?"* and his correction *"why have we abandoned the MAIN CLASSIFICATION IN KOL!!!"*. Earlier rulings in `plan-2026-11-06-buttons-page.md`.
**Status:** W1 and 2.1 ✅ built 2026-11-07 (Figma not published — his click). W2 ✅ built 2026-11-07 — the Atoms page is ready (kol-component 0.346.0). W2R and W3 ✅ built 2026-11-07 (Figma not published — his click). W4 4.1–4.5 ✅ built 2026-11-07; 4.6 table ready for his call (`_tmp/2026-11-06-figma-library-layout/organisms-moves.md`). Open: 4.6 ruling, W5–W6.
**Shape:** W › phase › list.
**Laws carried:** a master nests exactly the components its code imports — read the imports first, build from instances, a script confirms 0 drawn parts (the cause behind `docs/operations/10-figma/02-issues.md` 21–40); In use comes from the code's call sites, never from "no library master nests it"; a usage count covers apps, packages, the showcase and the outside-repo usage index (`showcase/src/usage`), since other repos use the KOL too;  the atomic taxonomy is the library's structure — atoms · molecules · organisms · modules (`docs/documentation/03-components/00-taxonomy.md`); a component's page is its tier, never a function group or a template's group list; a set shows only what the code uses (this repo holds every use); tone is the instance's `tone` mode, never a row; a component that nests a part in code nests its instance in Figma; In use holds only real instances; masters moved, never recreated; no Stickers; the index frame is not maintained during the reorganisation; one agent pass per phase, one check at the end; I verify every acceptance line on the screenshots myself before reporting.
**How a phase closes:** measurable acceptance line first; `audit.js` 0 errors on the touched page; master count before = after; 0 unlinked instances in the file; then a legible screenshot I check against his verbatim points.

## W1 — The structure

### 1.1 — ❖ 01 Buttons folds back into the tiers — ✅ built 2026-11-07
- Built: Atoms › Buttons 1194:892 (91 masters), Molecules › Buttons 1194:893 (31); ❖ 01 Buttons holds 0 nodes — his GUI delete.
- Button and CloseButton → a "Buttons" section on ↳ Atoms; ButtonGroup and SplitToolButton → a "Buttons" section on ↳ Molecules (tiers as the inventory states them). The doc frames move as they are.
- The Split button frame (designed, not in code) goes with ButtonGroup on Molecules.
- The ❖ 01 Buttons page is then empty and removed (his GUI delete).
- Acceptance: ❖ 01 Buttons holds 0 nodes; every moved frame's tier breadcrumb matches its page (script); master count before = after; 0 unlinked.

### 1.2 — The doc frame is the template — ✅ built 2026-11-07 (Buttons + Controls; later families take it in their own phase)
- Every component frame on the tier pages takes the Buttons anatomy: _Header (tier breadcrumb, title, one line from the code, resources) → Component (set + _Annotation labels) → In use → _Footer, from _Utility.
- Each tier page: one section per family, one column from x 0, 200 between sections.
- Acceptance: written per family in W2–W5 (each family's frames all carry _Header and _Footer instances — script, 100%).

## W2 — Atoms, family by family — the Atoms page ready at the end

Ruled 2026-11-07: *"FOLD INTO /plan-shape everything here so at the end atoms page is ready"* — every phase below is decided (no TALK); each still starts with a code-usage pass, and the pass decides the axes by the law (show what the code uses). Points verbatim this round: *"why logomark/kolkrabbi? why only some icon containers and not others?"* · *"why is there a group called utilities, it directly questions the utilities category"* · *"if this tooltip is for float, where is the tooltip we use EVERYWHERE ELSE, also called popover?"* · *"what is ProsePreview for? and how is it an atom? … should it not be made from other components?"* · *"i dont care what you call the utility page that holds figma frame components"*.

Every phase's acceptance, on top of its own lines: each set shows only the code's used props/values (the pass's numbers written into the phase when built; a value with 0 uses does not exist); tone as mode where the code tones it; float siblings where kol-theme draws float as its own shape; nested parts are instances (0 drawn); In use 100% real instances (or none, stated, when no library composition nests it); every frame carries the template; 0 unlinked; audit 0 errors.

### 2.1 — Controls — ✅ built 2026-11-07, decided for review
- Usage pass: `_tmp/2026-11-06-figma-library-layout/controls-usage.md`. Input (default · property × xs/sm/md, rest/disabled; filled/outline/ghost are tone modes), Input float, Textarea, Textarea float, ToggleSwitch (bare · outline · primary × sm/md × off/on; disabled on bare), ToggleSwitch float, ToggleCheckbox (default · media × checked), ToggleCheckbox float, ViewToggle (text · icon), ViewToggle float, IconToggle (sm/md × pressed), SortHeader (active × dir), OriginPicker.
- 0 raw colours, 0 drawn glyphs, In use 100% instances (none for IconToggle, SortHeader, OriginPicker — no library composition nests them). 0 unlinked of 5,079; audit clean.

### 2.2 — Display — ✅ built 2026-11-07
- Built: Display rebuilt to usage (`_tmp/2026-11-06-figma-library-layout/atoms-usage.md`): Tag 18 + Tag float 4, Pill 4 + float, Badge 9 + float, Avatar xs–lg, Divider h/v, Kbd sm/md ± icon, Label, SectionLabel md, ProgressBar + float, Delta, LiveDot, SizeChip, ValueField, ThemeTile.
- Tag, Pill, Badge, Avatar, Divider, Kbd, Label, SectionLabel, ProgressBar, Delta, LiveDot, SizeChip, ValueField, ThemeTile — each rebuilt to its usage pass.
- Any of them the inventory files outside atoms moves to its tier's page in the same pass.

### 2.3 — Icon frames are the code's icon containers (P: "why logomark/kolkrabbi? why only some icon containers") — ✅ built 2026-11-07
- Built: IconFrame (default · nav × sm/md/lg + round md; tone as mode) and IconPlate (ground light/dark + guide); logomark in Icon masters › identity.
- The family = `IconFrame` (static decoration frame) and `IconPlate` — the only two icon containers the code has. Rebuilt to their usage pass.
- `logomark/kolkrabbi` is an identity mark: it moves to ↳ Icon masters in an "Identity" section beside the marks the KOL owns.
- Acceptance: the family holds IconFrame and IconPlate only; the logomark is in the Identity section.

### 2.4 — Data glyphs — ✅ built 2026-11-07
- Built: Sparkline stays an atom; Legend, WeeklyBars, ProportionBar moved to Molecules › Charts (the inventory's tier).
- Legend, WeeklyBars, ProportionBar, Sparkline — each rebuilt to its usage pass.

### 2.5 — Specimen atoms — ✅ built 2026-11-07
- Built: BlockType, MoodTile, AssetCard to usage; TypeSample, TypeSpecCard, SourcesReferences have 0 uses and keep one default, stated on their frames; ColorSwatch moved to Molecules › Colour + type.
- BlockType, TypeSample, TypeSpecCard, MoodTile, AssetCard, SourcesReferences — each rebuilt to its usage pass; any the inventory files outside atoms (SourcesReferences is kol-content) moves to its tier's page.

### 2.6 — Utilities get their own page (P: "it directly questions the utilities category") — ✅ built 2026-11-07
- Built: ↳ Utilities 1218:87 (Tooltip, ProsePreview, PopoverPanel); `_Doc parts` renamed; audit and skill updated.
- Utilities is the code's tier outside the ladder (`00-taxonomy.md`: "purpose without a face"). A new page ↳ Utilities beside ↳ Modules holds every Figma master whose code lives in `utilities/` — Tooltip, PopoverPanel, ProsePreview first.
- The private doc-parts page (`_Utility`) is renamed `_Doc parts` so the two never read alike (not KOL, his: "I dont care what you call it").
- Acceptance: 0 utilities masters on ↳ Atoms; ↳ Utilities holds every master whose code is in `utilities/`; `_Doc parts` exists, `_Utility` does not.

### 2.7 — Tooltip and PopoverPanel, as the code has them (P: "where is the tooltip we use EVERYWHERE ELSE, also called popover?") — ✅ built 2026-11-07
- Built: Tooltip default + float; PopoverPanel 1218:116 default + float; 12 menu masters now nest it.
- `Tooltip` (one component, `utilities/Popover.jsx`): `variant` default · float (`.kol-tooltip` / `.kol-tooltip-float`), with the usage pass's counts. Today Figma only has float.
- `PopoverPanel` (the panel every menu, dropdown and picker opens): a new master, default and float, from the code's panel CSS. Every menu/dropdown master on Molecules that opens a panel nests it.
- Acceptance: Tooltip has default and float; PopoverPanel exists; 0 drawn panels inside menu/dropdown masters (script).

### 2.8 — ProsePreview is built from its parts — code first, decided for review (P: "should it not be made from other components? … it could be great and display workshop style, document style") — ✅ built 2026-11-07
- Built: kol-component 0.346.0 `collection` prose · doc (prose renders as before); Figma 1218:136 two collections, 0 unstyled text.
- Code: ProsePreview stops being one comped block. It composes the shipped parts — headings and body from the prose text classes, `QuoteBlock`, `ImageBlock`, `TableBlock`, `CodeBlock`, the pullout and indent — and takes `collection`: `prose` (default, today's view) · `document` (MarkdownPage's classes) · `workshop` (DocumentationReader's classes). 0 call sites today, so nothing moves; kol-component (or kol-content if the parts require it) publishes.
- Figma mirrors it on ↳ Utilities: one frame per collection, every block an instance or a text style — no raw text block.
- Acceptance: ProsePreview's source renders only imported parts and class sets (grep: 0 hand-styled elements); Figma ProsePreview = 3 collections, 0 unstyled text, 0 drawn parts.

### 2.9 — The Atoms page is ready — ✅ built 2026-11-07
- Built: ↳ Atoms holds 43 masters, all atoms; 0 utilities; audit 0 errors; 0 unlinked of 8,632. For review: the code's classification file calls the charts atoms while the inventory says molecules (followed the inventory); logomark duplicates kolkrabbi-logomark in Icon masters (both kept).
- Acceptance: every master on ↳ Atoms is filed as an atom in `01-inventory.md` (script, 100%); every family section is one column with template frames; 0 utilities; audit 0 errors and 0 warnings; 0 unlinked in the file.

## W2R — Atoms, his review (issues 1–22, `docs/operations/10-figma/02-issues.md`)

His read: *"either the text in 'in use' is bullshit or there are serious problems."* Decided for review; one pass.

### 2.10 — In use was guessed, not read (issues 7, 8, 9, 12, 18) — ✅ built 2026-11-07
- Built: 36 Atoms frames carry "Used in" (call-site files + outside count); 13 In use from matching call sites, 23 name the files; 0 hidden/clipped (ThemeTile's clip was ReadingSettings' row clipping, fixed).
- Cause: frames said "none — no library master nests it" without reading the code's call sites; examples hid or clipped the component.
- Every Atoms frame's In use is rebuilt from the code's call sites (SourcesReferences in the article, Sparkline's 15 uses, Divider's 132): the library composition that matches a real call site, the component visible and unclipped. Where the call site's composition has no master yet, the frame names the call site (file) instead.
- Acceptance: every Atoms frame lists ≥1 code call site (file path) or states 0 uses; 0 In use examples where the component is hidden or clipped (script: visible, inside bounds).

### 2.11 — Every atom states where it is used (issues 2–6, 10, 11, 15, 16) — the "0 uses" were wrong — ✅ built 2026-11-07
- Built: nothing retired; headers say what each is for and where used.
- Recount 2026-11-07 (apps, packages, showcase, plus the showcase's outside-repo usage index): no atom has 0 uses. The earlier "0" scanned apps/packages only and missed the showcase and other repos — TypeSample 9 outside (3 apps), TypeSpecCard 15 (2 apps), SourcesReferences 5, ProsePreview 3 (kol-client, canalix), Label 22 (11 apps), SectionLabel 30 (5 apps), Sparkline 26.
- Nothing retires. Each frame's header names its call sites (in-repo files and outside apps) and what it is for.
- Acceptance: every Atoms frame names ≥1 call site; usage counts include the showcase and the outside-repo index.

### 2.12 — Atoms drawn as re-inventions (issues 13, 14, 17, 21, 22) — ✅ built 2026-11-07
- Built: Slider rebuilt (10 variants) on a private `_Slider base` + Input; range is the code's `variant="dual"`; ProgressBar has its own track in code; SizeChip is not Tag/Pill (stated); Kbd sm 16 / md 20, no border in code.
- Slider is a molecule in code (`molecules/Slider.jsx`); its base (the track + thumb atom it renders) gets an atom master and Slider nests it plus Input — no opacity value list, the axes the usage pass finds. ProgressBar reuses the slider track if the code does; SizeChip is checked against Tag/Pill and retires if it is one of them.
- Range (two-thumb) slider: not in code → a frame "designed, not in code yet" (the split button's rule), built from the slider base.
- Kbd: the sm cap gets the code's sm stroke and height (kol-theme `.kol-kbd-sm`); its In use shows a real call site.
- Acceptance: Slider and ProgressBar masters contain the base instance (0 drawn tracks); Kbd sm matches the CSS (stroke, height) by measure.

### 2.13 — The icon loader gets its component; IconFrame says what it is for (issue 34) — ✅ built 2026-11-07
- Built: `IconLoader` 1234:22012 (sizes 10–24 by code count + 40/48, outline · solid, glyph swap; an `icon` variable collection scales stroke by size); 0 loose glyphs on Atoms; FileIcon new; IconFrame nests IconLoader.
- The icon loader is `<Icon/>` (kol-icons — "The KOL icon loader", `docs/documentation/02-icons/02-loader.md`): it loads a glyph by name from the four sets, with `size` and `variant` outline · solid. In Figma it becomes one component named **`IconLoader`** (his name, 2026-11-07: *"its THE most used component since the beginning"*; Code Connect maps it to `<Icon>` from kol-icons) — `size` (the code's sizes in use) × `variant`, the glyph an instance swap from Icon masters — on ↳ Atoms. Every icon inside another master becomes an `IconLoader` instance.
- IconFrame = a static box around one icon (decoration at a button's size, never a control) — its header says so, with its call sites; it nests `IconLoader`.
- `VectorLoader` (any SVG by URL — wordmarks, marks) gets no master: what it renders is the SVG itself. `FileIcon` gets a master (it draws a file-type tile) nesting `IconLoader`.
- Acceptance: `IconLoader` exists with the code's sizes × variants and a glyph swap; 0 masters on ↳ Atoms holding a glyph that is not inside an `IconLoader` instance (script); IconFrame and FileIcon nest `IconLoader`.

### 2.14 — Utilities page and Icon masters (issues 1, 19, 20) — ✅ built 2026-11-07
- Built: ↳ Identity 1232:89 holds the identity set; Icon masters holds icons and names IconLoader / VectorLoader; KeylineGuide on `_Doc parts`.
- The ↳ Utilities page stays (the code's own tier, `00-taxonomy.md`); his doubt is recorded and the page's header says why it exists.
- KeylineGuide → `_Doc parts` (a drawing aid). Identity: the identity *icons* stay on Icon masters; the identity *set* (marks, favicons, the duplicate logomark) moves to its own page ↳ Identity after ↳ Utilities; the duplicate is removed (his GUI delete).
- Acceptance: Icon masters holds only icons; ↳ Identity holds the marks; KeylineGuide is on `_Doc parts`.

## W3 — Molecules, family by family (issues 23–40)

Method per family: (1) read each component's code imports; (2) the master nests exactly those components as instances, built to the usage pass; (3) In use from call sites; (4) script: 0 drawn parts, 0 unlinked; one pass per family, decided for review.

### 3.1 — Inputs (issues 23–26) — ✅ built 2026-11-07
- Built: Input gained placeholder, iconLeft, prefix, slotRight; PasswordInput, FieldPair, InlineAddRow, LinkAddRow, AccountForm nest Input / Button / Kbd / IconLoader; QuantityInput float hugs; SearchInput default + float sm/md/lg. Code findings: SearchInput and QuantityInput do not render Input in code.
- QuantityInput hugs its width and has its regular and float looks as the code has them; SearchInput and PasswordInput nest Input (sm/md/lg as used); FieldPair, InlineAddRow, LinkAddRow nest Input; the 13/18 type is the code's role, centred by the control's own height.
- AccountForm (kol-shell, organism or molecule per the inventory) nests Input and Button float.
### 3.2 — Navigation and rails (issues 27, 28, 31, 32) — ✅ built 2026-11-07
- Built: RailRow and RailSection new; RightRail and ShellSidebar built from them (two components in code, no `side`); Rail nests CloseButton + Divider; DocsToc list · rail · float on TocRow.
- Rail nests its rows (SettingsRow, LabeledControl as the code imports); DocsToc nests TocRow in both looks; RightRail and ShellSidebar are checked against the code — one component with a `side` if the code is one, else two, each nesting the code's row parts (shell-nav-item · items · group-header · group · rail-stack-inner · sidebar-toggle · rail-section as components).
### 3.3 — Content (issues 29, 30, 33, 35–40) — ✅ built 2026-11-07
- Built: ContentMedia, ContentText, ActionButton, CopyButton, AssetPlaceholder new; ContentCard / ContentRow from ContentMedia + ContentText; CodeBlock nests CopyButton; PageHeader is a SectionText instance (code passes no meta, so float has no meta row); QuickLookHeader default + float, eyebrow retired (not in code).
- List shows the levels and kinds the code uses; ShareButtons, FoldedHead and LinkPreview: header states what each is, with call sites, and each nests Button / its parts — retire on the ledger if 0 uses or redundant (FoldedHead vs SectionHead).
- ContentCard and ContentRow are built from their code parts (the text section + the image placeholder). PageHeader gets its styles; PageHeader/float its meta row. CodeBlock's `bare` (the frame dropped, the host owns it) is shown and named. QuickLookHeader: its float variant reconciled with the default as the code has it; eyebrow and mono are one variant if the code differs only by font.
### 3.4 — The remaining Molecules families (Menus, Colour + type, Cards, Charts, Print kit, Float readouts, Float rows) — ✅ built 2026-11-07
- Built: 115 masters: 0 code-rendered parts missing, 0 drawn; 131 template frames; Menu, DashTooltip, ProgressLine, ClearspaceDiagram, RowMenuButton, TransparentX new; Button/bare restored (the code uses it); BlockSwatch merged; 0 loose glyphs, 0 unlinked, audit 0 errors on Molecules / Organisms.
- Same method, one pass each.
- Acceptance for every W3 phase: per master, the code's imported components = its nested instances (script diff, 0 missing, 0 drawn); In use 100% instances from a call site; every frame on the template; 0 unlinked; audit 0 errors.

## W4 — Organisms (issues 81–95; audit `_tmp/2026-11-06-figma-library-layout/organisms-audit.md`)

Read-only audit 2026-11-07: 99 masters in 14 sections. 12 in the wrong tier; 55 miss parts their code renders and draw stand-ins instead (worst: PropertyRail 0 of 6 parts nested, 392 drawn nodes; SettingsPanel 0 of 7; SlideInspector 0 of 11; AppFloatNav, CommandOverlay, Timeline); 3 broken (NavRail variants near-empty, Overlay a blank rect, DocumentLibrary an empty text); 0 of 99 on the template. Same method as W3, decided for review, one pass per phase, one check at the end.

### 4.1 — The shared bases first (issues 82, 84, 88, 90, 91, 94) — ✅ built 2026-11-07
- Built: ModalShell (stacked bands, his Move-file model) nested by QuickLookFrame, Dialog float, Modal float; RailRow/RailSection the rail base (NavRail's three rows stay — three different rows in code); PopoverPanel float, LabeledControl, Slider float confirmed; SectionText gained actions; one MediaLibrary set; CalendarHead + CalendarEvent new.
- Cause: the organisms each draw their own shell, so nothing reads alike. Build (or reuse) the bases they nest, from the code:
- Modal shell (6 masters: DeckFile, DeckSettings, MediaLibrary/modal, ShortcutsOverlay, the Dialog/QuickLook family) — one header component (title, actions) with its own padding, a body, a footer; float and default.
- Rail shell (11: PropertyRail, SettingsPanel, AppItemRail, NavRail, RightRail, ShellSidebar …) on RailRow / RailSection (dedupe NavRail/row, item and icon against the Molecules RailRow).
- Float panel shell = PopoverPanel float (8). Settings row (5) = LabeledControl. Slider base (6: ProgressDock and the rest). SectionText inside PageHero, PageSection and the Section* (7). Menu inside MenuBar. One MediaLibrary set (float, modal, browser — today three masters in three sections). CalendarHead + event chip for the 4 calendar masters.
- Acceptance: each base exists once; a script finds 0 masters drawing a structure that a base covers.

### 4.2 — The 12 in the wrong tier move (issues 81, 86, 92) — ✅ built 2026-11-07
- Built: all 12 off Organisms (8 to Molecules, Overlay to Utilities as FullscreenOverlay, nav-studio to Icon masters, SiteLayoutTocSlot + ShellNavColumn to Modules); CanvasStudio stays (organisms/ in code).
- To Molecules: SectionText, SpecList, ReadingHighlight, ReadingActions, ReadingChapterNav, ReadingNotes, ReadingSettings, VariantsControl. To Atoms: Overlay, CanvasStudio if its code is an atom. nav-studio is a glyph → Icon masters. SiteLayoutTocSlot → Modules. ShellNavColumn → with its layout on Modules.
- Acceptance: every master on ↳ Organisms is an organism by the inventory or its folder (script, 100%).

### 4.3 — The 55 rebuilt from their parts, on the bases (issues 83, 85, 87, 89, 93) — ✅ built 2026-11-07
- Built: 88 masters across 14 sections nest exactly what their code renders, 0 drawn stand-ins (the only drawn-looking layers are raw markup in the code itself); new ThemeToggle, Image, Notes, TabsRow stacked, ToolPalette, LayerStack, SlideInspector, SettingsPanel set, ColorInputRow, stacked LabeledControl; MenuBar from Menus with the code's keys.
- Section by section: every master nests exactly what its code renders (instances on the 4.1 bases), 0 drawn stand-ins; AppHub/header-actions, MediaLibrary/browser, DeckEditor/present, VariantsControl and FloatActionMenu included.
- Acceptance: nesting diff over all organisms — missing 0, drawn 0; 0 loose glyphs.

### 4.4 — The breakages — ✅ built 2026-11-07
- Built: NavRail filled, DocumentLibrary's empty cell hidden, DocumentIndex merged, Timeline overhangs sized, FloatActionMenu glyphs and rows fixed, pressed Button float glyph ink fixed.
- NavRail's empty variants, Overlay's blank rect, DocumentLibrary's empty text, DocumentIndex twice under one name (merge), ToolPalette and LayerStack present only as sub-parts (full masters), the Timeline and SlideRenderer overhangs.
- Acceptance: each listed item fixed and re-screenshotted; 0 duplicate master names on the page.

### 4.5 — Every organism on the template — ✅ built 2026-11-07
- Built: 81 of 81 Organisms frames on the template; 0 loose glyphs, 0 duplicate names, 0 unlinked, audit 0 errors.
- 99 frames: _Header (tier breadcrumb, code line, "Used in" with call sites + outside count), Component, In use from a real call site, _Footer.
- Acceptance: 100% carry the template.

### 4.6 — Family moves, by the rule with the outside counts (issue 95) — PARKED: his ruling 2026-11-07, nothing leaves until fixed (list in 02-issues.md › Held)
- Table: `_tmp/2026-11-06-figma-library-layout/organisms-moves.md`.
- Rule: a master leaves the library only if one family uses it, counting outside-repo uses too; float-system parts stay; layouts and hubs stay (his ruling). Candidates from the audit: deck parts (SlideInspector, DeckFile, DeckSettings, SlideRenderer, DeckEditor/present) → presentation; Timeline, TimelineDock, ToolPalette/tool → editor; document parts (DocumentIndex, DocumentLibrary, DocumentView, DocumentHeader) and website parts (Section*, SiteHero, StackHero, ArticleHeader, ParallaxShelf, WebsiteNavbar, TakeoverMenu, WebsiteFooter, SheetArticle, StickyNavCard, PortableTextRenderer) → each only if its count says one family.
- Shown to him as a table (master · families · outside count · verdict) before anything is staged; he does the cut and paste.
- Acceptance: the table exists with counts; every moved master's instances stay linked after his publish.

## W4R — Round 4: the check by key, and the controls it let through (issues 96–99) — ✅ built 2026-11-07
- Built: `~/.claude/skills/kol-figma/scripts/nesting-check.js` (by key); fakes Molecules 20 → 0, Organisms 38 → 0, Modules 3 → 0; LabeledControl 22:34 = label + slot (7 variants, 0 baked); LabeledControlSection 1417:14004 (18 instances); Figma RailSection/RailRow renamed ShellNavSection/ShellNavRow; Dropdown on Button with the IconLoader chevron at 12/14/16 (float 18).

### 4.7 — The nesting check compares component keys, not names (issue 99)
- The script resolves every layer named after a KOL component and counts it only if it is an INSTANCE whose main component (or its set) is that component's master; a frame/group carrying the name is a fake. Re-run over ↳ Atoms, ↳ Molecules, ↳ Organisms, ↳ Utilities.
- Acceptance: the fake count per page, then 0 after 4.8–4.9.

### 4.8 — LabeledControl is label + slot; LabeledControlSection exists (issues 96, 97)
- LabeledControl: label (+ hint) and a `control` slot; axes `inline` false/true and label width (the code's 48 / 74 / 160 / auto as used). No baked controls; every former variant's control becomes slot content, instances swapped.
- LabeledControlSection: a real component — the uppercase header over a slot of LabeledControl instances (`SettingsPanel.jsx`); Code Connect to the export. SlideInspector, SettingsPanel, Dialog settings, the Labs and settings rails nest it.
- RailSection/RailRow clash: the Figma ones built from the workshop nav are renamed to their workshop names (shell-nav section/row) so the code aliases `RailSection` = LabeledControlSection and `RailRow` = SettingsRow are unambiguous.
- Acceptance: LabeledControl has 0 baked controls; every LabeledControlSection-named layer is an instance (key check).

### 4.9 — Every fake the key check finds is replaced (issue 98 and the rest)
- Dropdown: chevron = IconLoader at the indicator ladder (xs 8 · sm 12 · md 14 · lg 16), the trigger nests Button as the code does; then every other fake from 4.7.
- Acceptance: 4.7's fake count = 0 on every page.

## WF — Foundations (his ask 2026-11-07: v4's Colors page as the model) — his go 2026-11-07 ("do what you think, I'll review when done")

First build (one-frame-per-section, 16,600 px Typography) rejected: not v4's form, never shown before building. Audit: `_tmp/2026-11-06-figma-library-layout/foundations-audit.md`. Refs: v4 surfpbnNoPsWIDXvu4JrIh page Colors 1:6; his images `/private/tmp/claude-501/-Users-kolkrabbi-dev-projects-kol-ds-ui/51da3721-261a-4bbf-a1f0-845ac8a2433a/images/107–115.png`.

### F.1 — Foundations holds only KOL's own tokens, in v4's form — ✅ built 2026-11-07
- One frame per TOPIC (v4: Primitives, Surfaces, Ink, Ladders, Accent + status as separate 1600 frames side by side in a row per section), each short; section order 01 Colors · 02 Typography · 03 Spacing + breakpoints · 04 Sizes · 05 Radius · 06 Effects.
- 07 Opacity, 08 Motion, 09 Icons retire to `_trash`. Variables: keep `opacity/disabled` (232 bindings); remove the 4 unbound opacity vars and the 12 unbound motion vars.
- Acceptance: 6 sections; no frame over 2,400 px tall; 0 text < 10 px.

### F.2 — Each topic drawn the way it reads — ✅ built 2026-11-07 (27 frames; tallest 2,356; screenshots fv2-*)
- Colors: primitives as ramps of big swatches with step + hex (Untitled UI ramp); role tables Light | Dark | alias, the Light cell on a light ground.
- Typography: one specimen per family, then a compact role table — never one row per text style.
- Spacing: a diagram — boxes with padding and gap drawn on them; breakpoints in ONE frame (merged out of 03 and 04).
- Radius and Effects: v4 token table (token · visual · value · code); shadows as a row of cards on a light ground; glass light/dark over a photo.
- Acceptance: each frame matches its reference form; values bound to the live variables/styles.

### F.3 — layout-color / layout-type move to the brand file (his ruling: brand-generated, nothing to do with KOL) — ✅ built 2026-11-07 (brand WsyWxelBX6QLNgRBQ1aK4W: 205 + 52 vars, 22 styles local; library bindings 0; his delete pending)
- He cuts the brand layout components (LayoutType, LayoutColor, LayoutLogo, LayoutText, LayoutGuide, BlockSwatch, CardLogo, BlockType) + the `10 Layout tokens` frame into `brand--kol-ds-ui`; the agent recreates both collections there (same names, values, mode `kolkrabbi`), rebinds, and the library's collections are removed at 0 bindings (his click).
- Acceptance: 0 library bindings to layout-*; brand file components bound to its own collections.

## W5 — Modules — his go 2026-11-07 ("do what you think, I'll review when done"); audit `_tmp/2026-11-06-figma-library-layout/modules-audit.md`

### 5.1 — The 11 masters on ↳ Modules made true modules — ✅ built 2026-11-07
- PageShell, AppHub, WebsiteLayout, SiteLayout, AppShell, AppStudio, FloatLayout get the doc template (_Header with tier + call sites incl. outside count, In use, _Footer); ShellLayout: count uses incl. outside — 0 → `_trash`, else template.
- ShellNavColumn → ↳ Organisms (a region); SiteLayoutTocSlot stays as SiteLayout's slot part inside its doc frame; `page-layout--document` (no code match) → `_trash`; the 3 loose phone frames become each master's phone variant (or In use if the code has no phone variant).
- Acceptance: 0 masters without template; nesting check (by key, self excluded) 0 fakes; Code Connect on every master.

### 5.2 — The Rail system — ✅ built 2026-11-07 (21 Rails; `_tmp/2026-11-06-figma-library-layout/rails.md`)
- Every code Rail (desktop + phone) as a master built from LabeledControlSection / SettingsRow / ShellNavRow — HubSettingsRail, PropertyRail, AppItemRail, RightRail and the rest the code exports.
- Acceptance: one master per exported Rail; 0 fakes.

### 5.3 — The Home system — ✅ built 2026-11-07
- HubHome, AccountForm (sign in / sign up), HubSettings as masters nesting real parts.
- Acceptance: masters exist; 0 fakes; Code Connect.

### 5.4 — Studio and Catalog masters — PARKED: ask him first (2026-11-07)
- StudioCreate, StudioDetail, CatalogPage, CatalogGrid, CategoryPage, framework Layout.
- Acceptance: masters exist; the Studio and Catalog page screens rebuilt as their instances (0 loose screens).

### 5.5 — Studio and Catalog pages leave for `layout--kol-ds-ui` (his cut + publish)

## W6 — Pages outside the tiers — decided for review
- Other apps and Not yet drawn hold no masters (headers, ~286 placeholder cards) → `_trash`. Sets stays in Collection. Empty 01 Buttons page: his delete.


## WA — Article parts — PARKED: his call 2026-11-07 ("we deal with it later")
- The article is document style. Code has ArticleHeader, AuthorLine, ShareButtons, SourcesReferences and the renderer's blocks (CodeBlock, QuoteBlock, ImageBlock, VideoBlock, TableBlock — `packages/content`); Figma has only SourcesReferences (he put it in website--kol-ds-ui) and StackHero. Build them as components and rebuild the article screens from them.

## WS — Sets, Studio, Catalog (his go 2026-11-08: "then Sets, Studio and Catalog")

### S.1 — Sets stay in the library, tidied
- 24 set sections (instances only). Laid out per the page law (sections left→right); each set gets a `_Header` (crumb "Sets / <Name>", one line, "Used by: <app>", "View in showcase" → ui.kolkrabbi.io/sets/<name>); every instance real (nesting 0 fakes). `growth` (0 instances) → `_trash`.
- Acceptance: 23 sets on the law, 0 fakes, 0 empty sections.

### S.2 — Studio: masters, then screens from them
- Build StudioCreate and StudioDetail (code: packages/shell AppStudio family — grep) as module masters on ↳ Modules; rebuild the 3 studio + 8 studio-hub screens as instances of AppStudio/AppHub + those masters. The page then waits for his cut to layout--kol-ds-ui.
- Acceptance: 0 loose screen layers (every screen an instance of a layout master); nesting 0 fakes.

### S.3 — Catalog: masters, then screens from them
- Build CatalogPage, CatalogGrid, CategoryPage (code — grep) as masters; rebuild the 12 catalog screens from them; rename the page `↳ Catalog`. Waits for his cut.
- Acceptance: as S.2.
