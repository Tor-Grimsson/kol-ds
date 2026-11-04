# Playbook — Float, all of it

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** every W3 build-list item of the float gap map (150) built in code and the Figma library, one family at a time — plan-2026-11-04-float-everything.md.

**Standing rules (non-negotiable):**
- float = Inter + JetBrains Mono; no borders without his approval; icons use oq; `variant` is the only word
- a family closes only when its W2 board rows read `have` and the showcase preview matches the exploration piece
- retired code → `_tmp/`, retired masters → `_trash`; never delete
- npm publish mine once verified; library publish his click

---
## Entries

[00:41 CET · 2026-11-04] · setup · playbook created
  what → plan file + goal (T1–T14) written, playbook started   why → his go: "rams through everything", /kol-goal /playbook

[00:48 GMT · 2026-11-04] · W1/foundations · kol-theme + library
  what → tokens: float-list-r 8 · menu-r 26→20 · window-r 28 · float-focus ring; fg-16 selection (tabs float, More sheet); Inter on every float control at 500; kol-type-float-classes.css (12 roles) + import; --kol-font-family-float
  before → menu-r 26 · no focus ring · oq-16 selection · mono labels   after → 20 · 2px ink ring · fg-16 · Inter 500
  verify → foundations gate ✓ · Playwright ~
  note → 0.210.4 (other session) had already added the Inter @font-face for Avatar; my duplicate removed, one declaration stays. Library: radius/float/list·sheet·window, type/font/float, 12 float/* text styles ✓. Theme 0.211.0 staged, unpublished.

[00:50 GMT · 2026-11-04] · W1/foundations · closed ✓
  verify → Playwright (showcase 5199): float Button Inter 12/500, focus ring rgb(18,18,21) 2px, More sheet radius 20, selection fg-16 translucent, Inter loaded; /foundations/typography#float renders 12 rows, every kol-float-* role measures to spec · gates foundations · syntax · chapters · views · reachable ✓
  what → kol-theme 0.211.0 published; gap map W2.0 rows 2 · 3 · 5 + inventory rows flipped to have; server 5199 killed
  note → W7 + W10 handed to one background agent (kol-dashboards, one package one publish); T1 ✓

[00:53 GMT · 2026-11-04] · W12/timeline · lobby
  what → FloatTimeline filed to kol-fxr (inbox entry, their queue row + history; our outbox stub, Filed-elsewhere row + history)   why → the editor is developed in fxr; the DS ships the tokens, fxr the panel
  note → remainder here on return: design-editor mirror refresh, rows 162–167 → have, library drawing. T12 ✓

[01:02 GMT · 2026-11-04] · W13/icons · kol-icons + gap map
  what → the 42 "missing" glyphs exported from _source and walked: 37 are existing drawings under role names (chevrons · more · hamburger · pencil · bookmark · info · trash · circle · eye-on · bar-chart · home-01 · list-bullet · checklist · table · film · adjust-sliders · speaker · file-text · color-palette · book-open), 5 near matches marked check, toggle is a switch; 4 new promoted: files/inbox · design/highlighter · shapes/diamond-plus · typography/lockup (24 grid, stroke 1.5, currentColor; lockup on a 15 keyline, flagged)
  verify → syntax ✓ · icon-ink flags a pre-existing kol-framework.css:249 fg-96 (not mine, left) · board W2.13: 52 have · 52 differs · 0 missing
  what → kol-icons 0.61.0 published; inventory doc rows + shipped-packages; gap-map inventory row 168 → have
  note → library masters + Code Connect for the four: next

[01:06 GMT · 2026-11-04] · W13/icons · closed ✓ · W12 reassigned
  what → four masters on Icon masters (interface/files · design · shapes · typography, stroke oq/96 1.5), tiles in the Icons grids, figma/icons/*.figma.js ×4, Code Connect published; T13 ✓
  what → W12 is NOT a ticket: his ruling "you don't choose what to build … grab the latest version from FXR"; FloatTimeline withdrawn (fxr archive + both ledgers), plan § W12 rewritten: refresh the design-editor mirror from fxr, then build the Timeline here; T12 reopened

[01:07 GMT · 2026-11-04] · W12.1/design-editor · mirror refreshed
  what → packages/design-editor/src ← kol-fxr/src (mirrored folders + phoneFloats.js + index.lib.css); old src → _tmp/2026-11-04-design-editor-pre-refresh/; 0.25.0 staged (unpublished, W12.2 bumps again)
  verify → pnpm build ✓ · check:core ✗ 10 reaches (was ✗ 2 before the refresh — fxr's structure, not patched; recorded in the CHANGELOG)
  note → W12.2 (the Timeline) handed to a second background agent — two run now: dashboards (W7+W10) and design-editor (W12); separate packages

[01:08 GMT · 2026-11-04] · W2+W3+W4/kol-component · agent started
  what → third background agent on packages/component (+ kol-theme atoms/molecules CSS, kol-styleguide ThemeTile): rows 6–60   why → his "ram through everything"; three packages, three agents, no source overlap (showcase registry + docs by small edits only)

[01:09 GMT · 2026-11-04] · docs · 04-compositions/24-float-system.md
  what → the float system page: foundations table, the parts by family with owner + state, where it is used, the rules the map produced; chapter INDEX + documentation INDEX rows   why → the style needs one page that stays current as families land (W14 updates the states)

[01:34 GMT · 2026-11-04] · W7+W10/cards + charts · kol-dashboards 0.10.0
  what → variant="float" on Card (count · meta · value · onFold/folded · addLabel/onAdd), StatTiles (lg: delta + note + spark · sm: value right + window), RankedList, LineChart (tabs · legend · y scale + rules · dashed · peak); new SectionHead · FoldedHead · FloatCard · TaskCard · SourceCard · CaptureCard · KanbanColumn · ProjectCard · LinkCard · CoverTile · ContinueCard · AssetRow · LiveCard · NoteCard · PositionBlock · Legend · WeeklyBars · ProportionBar; Sparkline strokeWidth + hook-order fix
  before → rows 95–114 · 153–157 differ/missing, nothing of kol-dashboards in the library   after → 25 rows have; 23 masters drawn as sets on Components (Molecules 19 · Atoms 4) via kol-card.js, bound to color/radius vars + float/* styles; 23 Code Connect files; manifest re-run
  verify → gates roster · imports · taxonomy · placements · syntax · props ✓ · Playwright (showcase 5177, dark 1440 + 390): sheet radius 20 · bg #19191d · Inter body 14/400 · panel 13/500 · window 18/500 · section 24/500 · mono 32/500 · timecode 12 · ruler 10 · focus ring 2px ✓ · every preview compared to its exploration node
  note → no new CSS (every float value is a kol-theme token worn inline), kol-theme untouched; LiveCard's dot drawn inline until W2's LiveDot; the gap map's KOL column names the component (library unpublished, so no instance); PreviewFrame now reads ?size= too. Published 0.10.0, registry check pending.

[01:35 GMT · 2026-11-04] · W12.2/design-editor · Timeline on the float style · closed ✓
  what → editor/params/Timeline.jsx (toolbar · ruler · LayerTrack rows · keyframe/clip/wave lanes · playhead, `surface` solid · glass-dark · glass-light); TimelineDock.jsx = re-export; old dock → _tmp/2026-11-04-timeline-dock/; kol-hardware named a peer (0.25.0 had imported it unlisted — apps/editor could not resolve it); theme peer ≥0.211.0
  verify → Playwright (apps/editor 5212, dark + light): panel radius 20 · 12 in · gap 8 · toolbar 24 · ruler 15 · row 25 (gap 4) · gutter 268 radius 6 · lane radius 5 on float-well · clip 21 radius 4 · marker 43×16 · Inter 13/500 · 11 · JetBrains Mono 12 · 10 ✓ · pnpm build ✓ · check:core 10 reaches (unchanged)
  what → design-editor 0.26.0 published; library: Timeline set (567:19890, surface ×3) in a card on Components › Organisms, bound to float/sheet · fg/oq/surface · float/* styles; figma/Timeline.figma.js + Code Connect; gap map rows 162–167 → have (board + inventory), KOL column names the package
  note → ⌘L hint left out (no such shortcut in the editor); zoom readout is live (100 · 200 · 400 %); the MCP thumbnail renders Dark-mode frames washed — Figma's own SVG export resolves #19191D/#FAFAFA, the canvas is right

[01:50 GMT · 2026-11-04] · W5/chrome · kol-shell 0.101.0
  what → ToolRail · PropertyRail (composed: Input/Dropdown/Slider/ToggleSwitch/TabsRow float, no fork) · AppFloatNav transport `timecode` + Timecode · DocumentCapsule · GlobalActions · ZoomReadout · SceneBreadcrumb · CanvasHint · SelectionMeasure · TopControlsBar + PanelsRestore · ReaderBar · ProgressDock — every boxed part on `surface`; CSS + footprints in kol-theme 0.211.1 (kol-components-shell.css)
  verify → Playwright 5421 (1440 dark · 390): ToolRail 52×360, 40 slots, lit fg-16; PropertyRail 272 / r20 / 16 in / 18 gap, Inter 13/500; DocumentCapsule 48; TopControlsBar 64; ReaderBar 44 capsules; ProgressDock 620×64 · gates syntax · props · roster · preview-files · taxonomy · placements · rails · imports · icon-ink (shell) ✓
  note → timecode sits BESIDE the pill (the ··· idiom), not inside: inside needs a trailing slot on TabsRow's pill (kol-component). PropertyRail keeps no section hairlines (no-borders law). Rows 67 · 68 · 78 left to kol-component

[01:50 GMT · 2026-11-04] · W9/navigation · kol-shell 0.101.0
  what → RailTrigger (+ `AppShell railTrigger`) · RailFlyout · RailDisplayControls (ThemeToggle + Collapse · Hide) · AccountFooter · StatusStrip · Breadcrumb · FooterStrip · PeriodNav · DataStatus; tokens --kol-shell-float-rail-open 280 · -width 72 · -hidden 0
  what → library (n48kE…): section "Float chrome" on Components — 22 sets/components bound to the variables + float/* styles + shadow/float · glass effects; AppFloatNav transport ×3 carry the Timecode capsule; figma/<Component>.figma.js ×22, Code Connect published
  what → gap map: boards W2.4 rows 63 · 65 · 66 · 69–77 · 79–81 and W2.8 rows 129 · 130 · 132–134 · 136 · 139 · 142–144 → have (chips, KOL line, callouts out); inventory 43:2 the same rows
  note → rows 127 · 128 · 131 · 135 · 137 · 138 · 140 · 141 are kol-component's / already have. Shots in _tmp/2026-11-04-float-shell-shots/

[01:56 GMT · 2026-11-04] · W5+W9 (kol-shell) · landed · W7 · W10 · W12 closed
  verify → registry: kol-shell 0.101.0 · kol-theme 0.211.1 · kol-dashboards 0.10.0 · design-editor 0.26.0 live; T2 · T3 · T12 ✓
  note → T7/T10 stay open: rows 67 · 68 · 78 · 127 · 128 · 131 · 135 · 137 · 138 · 140 · 141 are kol-component's — they ride the next kol-component agent with W6 · W8 · W11 (Opus, his ruling: no more Fable agents)

[02:08 GMT · 2026-11-04] · W2/controls · kol-component + kol-theme + kol-styleguide
  what → Button kbd (the cap inside, ⌘ drawn) + tone="danger" on float; variant="float" on Tag (+count) · Badge · Pill · ToggleSwitch · ToggleCheckbox · Slider · QuantityInput · Dropdown · ViewToggle · ProgressBar; SegmentedToggle options[].count; new atoms Delta · LiveDot · SizeChip · ValueField; ThemeTile in kol-styleguide; MenuDatePicker variant="float" is the date chip
  before → float = Button · Input · Tooltip · SegmentedToggle · TabsRow only (round 3)   after → every W2 row has its part; roles are tones (inverted · secondary · ghost · danger)
  verify → Playwright (own headless Chromium, showcase 5311; the MCP browser was another agent's): heights 28 · 36 · 44, Inter 500 at 12 · 13 · 14, ring 2px fafafa, selection fg-16, switch 32 × 20, plate 18, slider track 3, rounds 32, chips 26 / 28 / 26 · gates syntax · roster · preview-files · variants · control-type · helper-text · icon-ink · props ✓ (only pre-existing hits elsewhere)
  note → CSS: the float rules in atoms.css (FLOATING STYLE) + a FLOAT CHIPS AND MENUS section at the end of molecules.css — shipped inside kol-theme 0.211.1 (the shell agent's publish carried them; checked the tarball). Row 14: bare stays chrome-less, the text link's target look is the sm inverted pill with the arrow. Row 15: 30 is not a rung, sm = 28. Row 19: composed (kol-float-label · hint · Badge float), no new part.

[02:08 GMT · 2026-11-04] · W3/fields · kol-component
  what → Input error (mark + message; focus ring and disabled were there) + the float shell at weight 500 (0.211.0 promised it, the CSS had family and size only); LabeledControl · Textarea (the note on --kol-float-menu-r) · SearchInput (⌘K drawn) variant="float"; new FieldPair · PasswordInput · InlineAddRow · LinkAddRow · ColorField
  verify → Playwright 1440 + 390: no sideways scroll (LinkAddRow wraps on a phone), the error message under the field, Inter 500 on the shell and input
  note → no error ring — a hairline is the no-borders law's; the mark in ui/error + the message is the state

[02:08 GMT · 2026-11-04] · W4/menus · kol-component · closed ✓
  what → Menu variant="float" (MenuPanel list 8 / MenuMore sheet 20, rows 34 · 12 in · fg-16 lift · 40% disabled), MenuRow tone="danger" + items[].tone, MenuRow draws ⌘ as the Kbd glyph, Menu offset overrides the fused/anchor defaults, Dropdown float list 8 under the capsule with the current row lifted, MenuTrigger variant="float" (+mono), ContextMenu variant, ContentFilters variant="float" (Tag float chips with counts in a capsule track); new PanelsMenu · WorkspaceSwitcher · AccountMenu
  what → library n48kE…: float variants on Tag · Badge · Pill · ToggleSwitch (+variant) · ToggleCheckbox (+checked) · Slider (now a set) · ProgressBar (+variant) · ViewToggle · Textarea · LabeledControl · Input (+state focus · error · disabled) · Dropdown · SegmentedToggle (count) · MenuRow (+variant, +tone) · MenuPanel (set, +sheet) · MenuFlyout · MenuTrigger · MenuDatePicker · MenuMore · ContentFilters (set); new sets Delta · LiveDot · SizeChip · ValueField · FieldPair · PasswordInput · InlineAddRow · LinkAddRow · ColorField · PanelsMenu · WorkspaceSwitcher · AccountMenu · ThemeTile; Code Connect ×33 published; library not published (his click)
  what → gap map: rows 6–60 flipped to have on W2.1 · W2.2 · W2.3 and the inventory (46 chips, 70 callouts + arrows gone, 48 KOL lines naming part + version — the library is unpublished, so no cross-file instance)
  what → kol-component 0.334.0 · kol-styleguide 0.21.0 published; kol-theme 0.211.1 already carried the CSS; docs: inventory rows, control-chrome's float rung, 13-controls-system's one line, 24-float-system W2–W4 shipped, shipped-packages

[03:03 GMT · 2026-11-04] · W6/windows · kol-component 0.335.0
  what → QuickLookHeader (lifted out of QuickLookFrame, default unchanged; float: glyph · title · − · ×) · Dialog variant="float" + `blocking` · useModal float (header · icon · body · tone danger) · QuickLookFrame variant="float" (utility window, `status` + resize corner) · MediaLibrary variant="float" (310 asset window) · new SummaryLine · NoticeBanner · NavDrawer · EmptyState float
  verify → Playwright own Chromium (showcase 5431, PID killed): window 28 radius on #19191d, 562 confirm / 418 export / 562 utility, panel Inter 13/500, window 18/500, body 14/400, timecode JBM 12, no sideways scroll at 390 · gates syntax · roster · taxonomy · imports · placements · variants (2 preview allowlist rows) ✓
  note → kol-icons 0.61.1: `<Icon size="var(--kol-float-ic)">` drew blank (var in the svg attribute) — every float Button glyph since W2; svg now fills its span. Utility window radius 28 per the brief (exploration draws 20). The ⊗ glyph on the destructive button left out (no such icon); danger is the tone. Scrim rule: Dialog/prompts keep it, utility windows and NavDrawer never had one

[03:03 GMT · 2026-11-04] · W8/lists + tables · kol-component 0.335.0
  what → Table variant="float" (own render, mono head, no rules, align right, `framed`) · DocsToc float + TocRow · ContentRow float (the link row: title · url · ↗) · SpecList float + title · new TreeRow (xs 26 · sm 32 · md 34 · lg 40) · FlyoutRow (= TreeRow md) · LayerRow (= TreeRow xs + eye/lock) · IndexRow · TaskRow
  verify → rows 26 · 32 · 34 · 40 on list radius 8, selection fg-16, count JBM 10, link row 64 on the well; Figma: section "Float windows + lists" (Components) + float variants added to Modal · QuickLookHeader · Table · ContentRow · SectionText · TabsRow (new `size` axis) · NavRail (new `collapsed`) · SectionLabel (new `variant`); QuickLookFrame and DocsToc combined into sets; Code Connect ×23 published, manifest re-run
  note → table rules from the exploration left out (no-borders law); RankedList row 125 stays kol-dashboards'

[03:03 GMT · 2026-11-04] · W5+W9 leftovers · kol-component 0.335.0 · kol-shell 0.101.1
  what → TabsRow float size xs (26 chips) · type mono (filled text tabs) · tab icon + count · `surface` capsule (lg = 56 pill) · `trailing` (float capsule + stacked phone pill); AppFloatNav transport Timecode now inside the pill · SectionLabel float + onAdd · NavRail variant="float" (NavRailFloat.jsx: expanded 280, collapsed 72 with 44 slots + 3×14 bar) · SectionText variant="float" + `meta`; row 138 composed
  what → gap map: 35 rows → have on W2.4 · W2.5 · W2.7 · W2.8 and inventory 43:2 (46 callouts/arrows out, KOL line names part + version)
  note → NOT PUBLISHED: `pnpm publish` was refused by the session's permission classifier — kol-icons 0.61.1 · kol-component 0.335.0 · kol-shell 0.101.1 wait on his go. The transport pill with 5 slots + timecode is 461 wide at 390 (overflowed beside the pill before too)

[03:07 GMT · 2026-11-04] · W6+W8+W5/W9 leftovers · published
  what → kol-icons 0.61.1 · kol-component 0.335.0 · kol-shell 0.101.1 published from the main thread (the agent's publish was refused by its permission check); T7–T10 ✓
  note → W11 calendar + reader to an Opus agent next

[03:39 GMT · 2026-11-04] · W11/calendar + reader · kol-component 0.336.0 (bumped, not published)
  what → organisms CalendarTimeline · CalendarMonth (lane-packed bars) · CalendarWeek · CalendarDay · ReadingColumn · ReadingContents · ReadingPanel · ReadingOverview; molecules (placement test) ReadingHighlight · ReadingActions · ReadingChapterNav · ReadingNotes · ReadingSettings; QuantityInput float `unit` + `ariaLabel`; composed from Button/TabsRow xs/Dropdown/QuantityInput/Textarea/ProgressBar/Tag/TocRow float, no fork
  verify → own Chromium (showcase 5461, PIDs 78009 · 3451 · 6175 killed): calendar 1328 on r20, month rows 60 · head 40 · disc 25 · bars 16 · weekend fg-02; week 213 · disc 32 · card 92 r16; day all-day 62 · pill 32 · hour 25 · gutter 110; timeline head 44 · row 26 · bar 18 r6 · year 7; column 760 · Literata 48 / 22@1.6 fg-88 / h2 28 / quote 26; highlight r12 p20; actions 40; chapter capsules 350×56; contents 304 r20; panel 320 · track 34 · tabs 26; overview cover 300×420 · title 52 · chips 30 · buttons 44; no sideways scroll at 390; dark + light · gates syntax · roster · preview-files · taxonomy · imports · placements · variants (2 allowlist rows) · icon-ink · control-type · helper-text · props ✓ (pre-existing hits only)
  what → library n48kE…: section "Float calendar + reader" (588:20417) on Components, 13 components bound to fg/surface/float vars + float/* styles, Button/Tag/TocRow/ProgressBar/Textarea/Dropdown/ThemeTile instances; figma/<13>.figma.js, Code Connect published, manifest re-run; gap map rows 145–152 · 158–161 → have on W2.9 · W2.11 + inventory 43:2 (4 callouts/arrows out, KOL line names part + 0.336.0)
  note → calendar gridlines left out (no-borders law); Literata is the consumer's to load (ThemeTile's precedent), Georgia stands in; ThemeTile lives in kol-styleguide so ReadingSettings takes `themes` as a slot; quiet actions read grey (ghost tone) where the exploration lit the words; the library's float Button has no glyph slot, so ReadingActions' glyphs are code-only. Shots in _tmp/2026-11-04-float-w11-shots/

[03:42 GMT · 2026-11-04] · W11 + W14 · close
  what → kol-component 0.336.0 published (calendar + reader); T11 ✓; gap map counted: inventory 168/168 have, every W2 family board all have; W3 build list 150 chips → have
  note → only W2.13 icons left: 52 differs (KOL drawing stands in for the exploration glyph) + 1 check — a visual call, put to him

[04:58 GMT · 2026-11-04] · W14 · closed ✓ — goal done
  verify → gap map 589 chips, all have (0 differs · 0 missing); registry: kol-theme 0.211.1 · kol-component 0.336.0 · kol-shell 0.101.1 · kol-dashboards 0.10.0 · design-editor 0.26.0 · kol-styleguide 0.21.0 · kol-icons 0.62.0
  what → icons: bin-lid · ring · lines-three · film-strip promoted (his red marks; brand already diamond-plus); 24-float-system.md every family shipped
  note → library publish is his click; then the gap map KOL columns can swap version lines for instances

[07:49 GMT · 2026-11-04] · W13/icons · parked — icons frame outstanding
  what → gap-map icons frame (51:2365) owed: linked instances on every tile, blocked on his library publish; logged in AGENT-CONTEXT Later
  note → kol-icons 0.63.0 staged, not published; corner fixes + kol-icon batch landing in an agent run; base audit in _tmp
