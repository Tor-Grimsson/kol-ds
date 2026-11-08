# Playbook — Float in Figma, his review

> **Live work journal.** Append-only, newest at the bottom, real timestamps.

**Goal:** `plan-2026-11-04-float-figma-review.md` W1–W6.

---
## Entries

[15:34 GMT · 2026-11-04] · setup · go
  what → user: "everything do it now" + batch with agents (sonnet preferred) — goal armed

[15:40 GMT · 2026-11-04] · W6.1 · done
  what → diffed fxr src vs design-editor mirror: fxr-ahead 0, DS-ahead 3 (Timeline.jsx, core.jsx export, TimelineDock re-export); mirror untouched, no bump
  what → filed TimelineRailFromDS to kol-fxr (inbox + INDEX + history) with receipt in lobby/outbox; summary in _tmp/2026-11-04-float-figma-review/fxr-diff.md

[15:48 GMT · 2026-11-04] · W5.1 · done
  what → apps/metric demo7 draws no dashboard part: 16 parts moved into kol-dashboards 0.12.0 (TopStats incl. realtime, MetricTiles, ChartHead, ChangeBadge, DeltaBadge, Behaviours, GoalsTable, FunnelChart, JourneyExplorer, TrendChart, ChartWithLegend, SegmentBar, ColorKey, RecordsTable, WorldMap, CalendarIcon); formatters + REGION_NAMES exported; dead nine/ten branches and old Sections.jsx parts to _tmp/2026-11-04-metric-local-parts/
  what → registered: classification (2 maps), 16 previews, 09-dashboards-system.md, CHANGELOG, shipped-packages. Not published.
  what → before/after at 1600 dark identical (only the live dot pulse differs): _tmp/2026-11-04-float-figma-review/metric/

[15:48 GMT, 2026-11-04] W3 code, built
  what → apps/float views matched to the _source frames at 1600 × 1080 (dashboard at its 1440 frame): Workspace is the dashboard on FloatLayout (studio nav Rail at 72, tabs beside the capsule in the bar, Tasks on the float well 120 to 1212 by 128 to 952, Task index pill in the bottom Rail), Record float keeps the nav Rail hidden with its trigger and carries the dashboard tabs in the bar, Rails' filter capsule and Task index moved into the bottom Rail at the frame's size, the editor canvas on the float well, the status toggles at 278 and 276 with tabs filling them
  pkg  → kol-shell 0.104.0 (unpublished): GlobalActions redo glyph is redo (mirror of undo); SelectionMeasure draws its 1px oq-64 outline, eight 6 handles with a size cap, four 4 without
  open → part sizes stay on round 25 (TabsRow hug, filter capsule 640 vs 706, type roles); Panels shows only while a Rail is hidden (FloatLayout law) so Workspace search sits at 1389 not 1184 and Record float shows Panels; six tabs stay a TabsRow (AppFloatNav pill caps at five); TaskCard selected fill heavier than the frame's
  look → _tmp/2026-11-04-float-figma-review/side-*.png

[15:52 GMT · 2026-11-04] · W1 + W2 · kol-figma-agent
  W1.1 → Timeline: 33 unbound #fff frame fills dropped (the white fields); LineChart float area = gradient fg/08 → fg/02 (code: on-primary .08 → .02), default area = series colour .3 → 0; every fill resolved L/D = live computed (script)
  W1.2 → Input float ×4 + SearchInput ×3: stroke tone/border OUTSIDE, clipsContent off (error field got its rim)
  W1.3 → the stretched chevrons were loose VECTORs in SectionHead/FoldedHead/Card/LinkCard/AssetRow/Capture/Project/ContinueCard → 16 Icon-master instances; GlobalActions rotate-right → redo (code now undo + redo); 0 non-square icons on 13 Float pages + Apps float
  W1.4 → IndexRow/TaskRow/TaskCard/Card selectors = ToggleCheckbox float instances (10); ToggleCheckbox got a showLabel boolean
  W1.5 → Timeline: playhead in a lane-wide layer, keys + playhead pinned (move in proportion, never stretch), waveform stretches; tested at 1472/1166/900
  W2 → Float tile 653:23200: FloatLayout home (linked) + 13 families linking their pages; 12 samples → _trash with _ prefix
  vite 5311 PID 48619 killed · shots _tmp/2026-11-04-float-w1/figma/

[16:06 GMT · 2026-11-04] · W6.2 · W6.3 · W6.4 · W6.6 · built (kol-figma-agent)
  what → Components › new `Editor` section (699:26702): 19 masters measured off fxr :5301 + apps/editor :5302 — EditorShell (705:38101, chrome=editor|labs, 7 slots + showRight), MenuTop, ActionBar, ToolStrip, ToolPalette/tool, SwatchStack, DocTitle, CanvasView (rulers bool), Pane, PaneHeader, InspectorPane, ColourBody, LayerStack/row, LayerActions, TimelineDock, LabsParams, EditorFooter, TransportBar, CategoryScreen; Code Connect for all 19 published (scoped config — the full publish is blocked by SelectionMeasure.figma.js: 569:19857 is no longer top level)
  what → ↳ Apps › new `fxr` section (706:43715): Home, Library, Settings, Account(→Home), Sign in, Join, Dev (1266) on AppStudio; Editor, Labs, Morph on AppStudio+EditorShell; Randomiser on AppStudio phone; Output (bare black stage). Audit: 234 instances, 0 components, 0 unlinked, 119 icons 0 non-square
  gaps → existing masters can't take fxr content: ContentCard has no variant=app (cards), ContentRow no app row (Dev list), NavRail side has no item slots/expanded labels (Morph, Dev rows + FXR glyph missing; Morph rail live is expanded 380), HubSettingsRail has no sections slot (Display/Defaults/Canvas/Transport rows partial), Button has no default×tone=primary lg / tone=inverted iconOnly (fills overridden), LabeledControl has no label-left row, SegmentedToggle no icon cells
  6.6 → 0 shared parts with two masters in Figma; in code five pairs do one job twice: ToolRail(shell)↔ToolPalette, PropertyRail↔Pane/InspectorPane, AppFloatNav transport↔TransportBar, ColorPickerPopover↔ColourBody, kol-component LayerRow↔LayerStackView's local LayerRow — TALK. Board: _tmp/2026-11-04-fxr/figma/side-by-side-6.6.png
  note → fxr /settings loaded cold renders nothing (only the rail); Settings measured via the rail's Settings button

[16:22 GMT · 2026-11-04] · W3 · kol-figma-agent
  3.2 workspace → 706:47736 FloatLayout collapsed (studio nav in the new items slot, bar tabs after the capsule, dashboard on the well, PropertyRail, Task index pill); boxes ±4 of live
  3.6 rails → 707:40429 FloatLayout expanded 1600×1180 (TreeRow nav, sunken canvas, SelectionMeasure row, filter capsule + Task index in bottom)
  3.3 record-float → 708:23874 FloatLayout hidden (eyebrow slot, lg tabs + More, Task details inspector, index); 3.1 record-tabs → 710:24228 page 1440×1100; 3.5 visual-editor 651:17376: canvas document + Orbit field (code formula), mode pill = AppFloatNav mobile labels, Timeline rows real, SelectionMeasure 440×450
  3.7 Home/Parts/Views + old screens → _trash (_); Sets Float tile member = copy of the workspace screen (711:28146)
  masters → TabsRow float capsule p6 + trailing slot; KanbanColumn cards/count slots; NavRail collapsed items slot + NavRail/icon; Button float iconOnly (primary/secondary/ghost/grey/inverted) + tone=grey; inverted glyph ink; Card controls slot; IndexRow cells slot + title fills; TaskCard sm trailing slot; SelectionMeasure set (measure true/false, oq-64 outline, 0.104 handles)
  Code Connect SelectionMeasure → 706:52572, full publish passed; fxr Account copy → _trash; Morph Timeline overrides intact
  side-by-sides _tmp/2026-11-04-float-figma-review/figma/side-*.png · vite 5321 PID 11131 killed

[16:25 GMT · 2026-11-04] · W3 drift fixes · kol-figma-agent
  visual-editor canvas → float/well (live 11,11,13 · Figma 12,12,14); record-tabs status chip: TabsRow float chips full pills, labels Inter Medium 12 on-primary / oq-64 as measured live (dark + light), Open 5 restored; vite 5321 PID re-run and killed

[17:00 GMT · 2026-11-04] · W5.2–5.4 · built
  what → 25 masters in a new Metric section on Components (706:50170): TopStats, MetricTiles, ChartHead, ChartWithLegend, TrendChart, DeltaBadge (trend), ChangeBadge, Behaviours, GoalsTable, FunnelChart, JourneyExplorer, SegmentBar, ColorKey, RecordsTable (table slot), WorldMap, CalendarIcon, CalendarHeatmap, CalendarScale (color), Heatmap, DetailsOverlay, ResizeHandle (state rest/near/dragging), SettingsChoice, SettingsMulti, SettingsPanel (body + foot slots), ShortcutsOverlay; measured live (apps/metric; MetricTiles, ChangeBadge, FunnelChart, SettingsPanel, ShortcutsOverlay from their showcase previews: the page never renders them); Code Connect published, imports vs figma/*.figma.js 0 missing
  what → metric section on ↳ Apps (726:38866): page screen 726:38867 = PageShell instance 1600 × 6369 (= live scrollHeight), sections in its slot ±1 px of the live boxes; overlay screens settings Rail, search modal, shortcuts, details overlay, filters (1600 × 1080) and edit layout (full height, a ResizeHandle on every card foot); all dark
  what → W5.4 board 735:35685 in the same section: exploration 9:1550 crop beside the metric screen crop per section, shared masters listed
  open → card shells, ranked lists, search / shortcuts panels drawn as frames: Card (default), RankedList and CommandOverlay masters have no slot for real rows (change list in the report); ui-success / ui-error have no variable (DeltaBadge, live dot raw); favicons without an icon master are placeholders
  audit → 512 instances, 0 unlinked, 0 masters on the view page, 0 stretched icons
  look → _tmp/2026-11-04-metric/figma/

[17:45 GMT · 2026-11-04] · W5 open items · built (variables blocked)
  what → Card (default) gets tabs · controls (shares controls#706:96) · body · foot slots; new CardTab (active × menu); RankedList (default) gets column / valueLabel text props + a rows slot of the new RankedListRow (bar slot, icon swap); CommandOverlay gets body + footer slots and the new CommandOverlayRow (row · active · eyebrow, combo); StatTiles (default) gets a tiles slot of the new StatTile (sm · lg · selected), TopStats now uses StatTiles lg
  what → Favicon master (17 site variants, the app's favicon images as fills; kol-icons ships none — brand marks stay Icon masters)
  what → metric page screen rebuilt: every card a Card instance, every list a RankedList with RankedListRow rows, tiles StatTiles/StatTile, search + shortcuts CommandOverlay instances; overlay frames re-cloned; section heights still = live (6369); Code Connect published (5 new)
  blocked → creating ui/success · ui/error · ui/warning · ui/info in the color collection was refused by the permission system (shared library variables); DeltaBadge / ChangeBadge / live dot stay raw until he allows it
  open → W3.4 float metrics frames not started; Button has no iconOnly tone=ghost default variant (Card expand uses IconFrame ghost meanwhile — fxr agent's master); RecordsTable rows are frames (needs TableRow/TableCell)
  audit → 1102 instances, 0 unlinked, 0 masters on the view page, 0 stretched icons, 0 filled stand-in frames
  look → _tmp/2026-11-04-metric/figma/side-live-vs-figma.png

[18:00 GMT · 2026-11-04] · W5 RecordsTable rows · built; W3.4 · not started
  what → RecordsTable master's table slot rebuilt from TableRow (kind head/body, simple) + TableCell (th/td × first/middle/last) instances, cell widths + paddings from the live table; the uploads table on the metric screens the same; 0 table frames left; section heights unchanged (6369)
  open → W3.4 float metrics frames (13:6898, 9:1550 + _source siblings) not started — this agent's context is spent; needs a fresh run, input = the W5.4 board 735:35685

[17:15 GMT · 2026-11-04] · W6 finish · masters to the code + fxr screens swapped (kol-figma-agent)
  masters → ContentCard variant=app (729:22760: cover 1:1, mark/download plates, title·date·size, cog over trash; props title/date/size/mark/markIcon/download/settings/trash/noCover) · ContentRow variant=app (729:22898, 72 thumb) · NavRail side rebuilt: logomark slot + title, items/bottomItems slots, NavRail/item set (729:40574), collapsed=true 48 (14:46) + collapsed=false 380 (729:40912), width hugs so a swap resizes; AppStudio rail HUG · HubSettingsRail sections slot · Button lg tone=primary (730:23313) + iconOnly lg radius=full tone=inverted (730:23317) on the tone modes · LabeledControl inline=true, labelWidth=160|74 (730:23016 · 739:57210) · SegmentedToggle iconOnly=true (730:23301) + SegmentedToggle/cell set; TransportBar uses it · ColorPickerPopover now a set: inline=true (93:741) + inline=false 196 popover (730:40160, footer slot) · Dropdown trigger fills its root (filled/outline)
  screens → Home/Library/Settings/Dev/Labs: real rail (fxr glyph, 6 items + Settings, route lit); 5+10+5 app cards with live covers; Dev 4 cards (236) + 4 app rows; Actions disc = inverted variant; Settings rail 4 sections on LabeledControl inline (Display, Defaults, Canvas, Transport); Labs + Randomiser lists = tone=primary (fill overrides gone); Morph rail expanded 380, EditorShell 1220, 7 inspector rows LabeledControl labelWidth=74; Timeline overrides intact
  audit → fxr 440 instances, 0 unlinked, 0 components, 0 stand-in frames, 0 non-square icons; changed masters 0 unbound fills except ColorPickerPopover sv/alpha gradients (as the inline master); Code Connect full publish passed (8 files edited)
  open → Morph RESOLUTION slider thumb stretches (Slider master thumb on SCALE); light values only from fxr forced to light (the app runs dark); side-by-sides _tmp/2026-11-04-fxr/figma/w6-*.png; fxr :5391 PIDs 23424/23437 killed

[17:22 GMT · 2026-11-04] · float search modal, float Menu panel, FloatActionMenu (kol-figma-agent)
  masters → CommandOverlay now a set (744:24387): surface=unset (10:39, untouched) · solid (744:24126) · glass-dark (744:24213, Dark mode pinned) · glass-light (744:24300); 512, 6 in, float/sheet 20, float SearchInput md, rows Pages/Dashboard·Tasks·Notes/Other/Settings · CommandOverlayRow variant=float (744:23595 · 744:23603 · eyebrow 744:23611: 40 tall, 12 in + tone border, Inter 14/500 oq-80 · lit fg-16, hint float/hint oq-64) · FloatActionMenu set (744:24483, Float chrome: icon=plus|more × open, sheet exposed) · FloatLayout panels=true|false (744:25525), FloatActionMenu in every desktop bar's end slot
  fixes → MenuPanel float row glyphs oq-96 → oq-88 (measured); MoreSheet float radius 26 → float/sheet 20, row labels mono → Inter 14/500, tone border
  open → field focus ring (2px fg on open) not drawn; Panels ⌄ shows in expanded/collapsed FloatLayout bars too (code shows it only with a Rail hidden); Code Connect not touched; measured on :5293, PID 88150 killed; numbers _tmp/2026-11-04-float-figma/m.json

[17:34 GMT · 2026-11-04] · FloatActionMenu states (kol-figma-agent)
  masters → FloatActionMenu (744:24483) open → state rest|hover|pressed|open × icon plus|more; button in a 40 trigger, shadow/float on every state; hover opacity bound to new float/hover-opacity (748:55180, opacity collection, 88); pressed rescaled 0.96; open keeps × (⋯ stays ⋯); FloatLayout bars still linked to state=rest
  open → Button set has no hover axis — the six float inverted variants carry the rule in their description; press-scale and motion tokens not added (no Figma property binds scale)

[17:45 GMT · 2026-11-04] · W3.4 float metrics frames · built (kol-figma-agent)
  masters → Card float: tabs + foot slots (rows = body); StatTile gains variant=float (sm, lg) + note boolean, StatTiles float tiles slots of StatTile; RankedListRow is now a set (default|float, 745:24118), RankedList float rows slot; TableCell/TableRow gain variant=float, Table float rows slot of TableRow; ProportionBar segments slot; MenuFlyout float draws its icon prop (Segment row = star); Slider thumb fixed 12 round (MIN, no SCALE), Input text single line
  what → ↳ Apps › float: /views/metrics 749:37529 (9:1550) and · color hierarchy 751:37823 (9:1140, accents bound to ui/* + palette/*), record-tabs · metrics 753:38730 (9:14154); every section ±4 of its frame; old screen → _trash as _float — /views/metrics (pre-W3.4); Morph RESOLUTION slider + Auto field fixed
  audit → 470 instances on the three screens, 0 unlinked, 0 masters on Apps, 0 stretched icons/thumbs, 0 master sample text; Code Connect full publish passes (RankedListRow url → set; CommandOverlay url → 744:24387)
  open → code drift vs 9:1550: live is 2143 tall (cards pad 20 vs 16, no row dividers in Table float); LineChart has no height (record-tabs metrics x-labels clipped at the 258 card); sparklines are the master's sample shape; strokes #756927/#28513e have no variable
  look → _tmp/2026-11-04-float-figma-review/figma/side-metrics-{overview,color,tabs}.png; vite :5291 PID 9257 killed

[17:52 GMT · 2026-11-04] · W3.4 last round · built (kol-figma-agent)
  masters → LineChart float takes an instance height (row, axis, plot fill; plot children scale); Sparkline gets a `shape` slot; Button gains variant=default iconOnly tone=ghost (sm/md/lg × radius sm/full, 758:24190…); Card default's expand is that Button (maximize); DeltaBadge + ChangeBadge raw #16a34a/#dc2626 → ui/success / ui/error (ui/error exists); lost property refs restored on cloned float TableCell, RankedListRow and Button variants
  what → every float StatTile sparkline draws its own series from the code (Metrics.jsx TRAFFIC, RecordTabs SPARK_A/B) — 10 tiles on the three float screens + the StatTiles float master; 28 Card expand stand-ins swapped on the metric screens; 7 raw greens on the metric section bound to ui/success; record-tabs metrics chart at 180, labels show; color-screen area fill at 7%
  open → #756927 / #28513e appear nowhere in code (exploration-only, unbound); the metric page draws no Sparkline (code renders none there); the LineChart line is still the master's sample series (no series slot); no variable created
  audit → metric 1492 · float 221 + 221 + 28 · Morph 70 instances, 0 unlinked, 0 masters on Apps, 0 stretched icons/thumbs; Code Connect full publish passes
  look → _tmp/2026-11-04-float-figma-review/figma/side-metrics-{overview,color,tabs}.png

[17:56 GMT · 2026-11-04] · W3.4 chart series · built (kol-figma-agent)
  masters → LineChart float plot gets a `series` slot (area · this period · previous period · peak guide · peak); TrendChart svg gets a `series` slot (area · line)
  what → every chart draws its own series, read from the live SVG paths: float Metrics TRAFFIC (this + previous + peak at 18 Oct) on 749:37529 and 751:37823, record-tabs TREND on 753:38730, metric Visitors on all 7 metric screens (14 vectors); vite :5291/:5292 PIDs 27673/27672 killed
  audit → metric 1492 · float 221 + 221 + 28 · Morph 70 instances, 0 unlinked, 0 masters on Apps, 0 stretched; Code Connect full publish passes
  look → _tmp/2026-11-04-float-figma-review/figma/side-metrics-{overview,color,tabs}.png

──────────── MILESTONE: float Figma review W1–W6 ──────────── [18:07]
  W1 masters fixed · W2 Float tile · W3 views 1:1 code + Figma (metrics ×3) · W4 skill rules · W5 apps/metric in Figma (25 masters, full-height page + 6 states) · W6 fxr app in Figma (19 editor masters, 11 screens)
  open → W7 Float document waits on his library publish; 6.5 editor states TALK; 6.6 code pairs that do one job twice TALK

[18:42 GMT · 2026-11-04] · W7 Float document · built, paused for his views paste (kol-figma-agent)
  what → new file ❖ float--kol-ds-ui (879P1yBsBPqpdGI5a5v2Y5, team drafts): Cover (thumbnail 16:88), ---, ➤　Float, 13 family pages (Foundations…Icons, 3:4–3:16) rebuilt as library instances in the library's card/members/cell layout, wide families wrap inside the card; ↳ Views (3:17, Dark pinned) with section float 9:2 holding workspace 12:1822
  library → 　　↳　Float (780:4845) under Collection: Float tile clone 780:4846 + link card 780:4962; 647:87–647:101 emptied (0 masters), renamed _…, moved after _trash for his GUI delete
  learnt → MCP runtime skips invisible instance children by default: override/slot paths drift unless figma.skipInvisibleInstanceChildren=false on both sides; library ↳ Apps pins Dark at page level
  open → views: he pastes the library float section himself; then audit + grid; Foundations specimens are style-bound frames (no master exists); file sits in team drafts, move to the library's project is a GUI drag

[18:52 GMT · 2026-11-04] · W7 Views page · closed (kol-figma-agent)
  what → his paste (section 13:1603) kept as is: record-float, rails, workspace are FloatLayout instances; visual-editor, record-tabs, record-tabs · metrics, metrics, metrics · color hierarchy stay frames of part instances because apps/float renders them bare (VisualEditor bare in VIEWS, RecordTabs.jsx + Metrics.jsx export bare = true); my workspace copy 12:1822 is gone (his paste replaced it); grid 4 columns × 2 rows, one 160 gap, top-aligned, section hugs with 200
  audit → clean: 0 errors; warnings raw-strokes 64 (chart vectors), raw-fills 7 + text-unstyled 1 (visual-editor scene text); 96 instances, 0 components, 0 local mains
  look → _tmp/2026-11-04-float-doc/figma/*.png (8 screens)

- 2026-11-04 19:47 — W10 editor + editor-hub: 13 editor frames (358:9118) and 8 hub frames (358:9142) on ↳ Apps. They are AppShell or AppStudio instances, or bare phone frames, measured live on :5295 and :5296. New masters are in `editor masters` (795:57925): MenuEditor (row, divider, panel), InputAffix and PaintPopover. Audit is clean.

- 2026-11-04 20:01 — W10 labs + randomiser: 14 labs frames (358:9130, moved to 53000,2400) and 10 randomiser frames (358:9136, 60680,2400) on ↳ Apps, measured live on :5291/:5292. Labs = AppShell (desktop page slot added, 8 instances unchanged) › EditorShell labs; phone = AppShell phone; randomiser bare + MobileOverlay. New masters in `labs + randomiser masters` (803:65120): LabsSourceCard, ColorModesWindow, MediaLibrary/browse, MobileOverlay; ShortcutsOverlay got a `sections` slot. fxr Labs/Morph/Randomiser/Output + placeholders → _trash with `_`. Audit clean (raw-fills 32 = scrims + bg-black stage). Slider thumbs sit at master rest (Slider has no value; master edit refused).

- 2026-11-04 20:58 — W10 gaps: Slider `value` (0–100 step 4, 52 variants, added per variant; the old bulk edit was refused across variants) and the 19 labs sliders set to live (≤2.3 px); LayerStack/row is a set with `active` (new var editor/accent-primary #458488 at 26%, eye + lock) and the 4 hand-tinted editor rows use it; MoreSheet `rows` slot (6 instances byte-identical); editor-hub 09 phone more menu built; 02 cropped to 3240 with 60 live cards; labs 08 checkbox + Textarea; Start over = Button sm ghost (new variant) at 50%; editor-hub + fxr re-flowed. Audit clean on Apps; Components has one false positive (MenuTop's real "Text" menu).

- 2026-11-04 22:11 — /kol-goal on W11 + W12 (plan-2026-11-04-float-figma-review): W11 page split running (agent); W12.0 notes → note rename next, then 12.1–12.4 as four parallel Figma agents once W11 lands, then 12.5 family pages.

- 2026-11-04 22:37 — W12 stopped at the Figma MCP tool-call limit (Full seat, Professional plan). 12.0 built; 12.1–12.4 frame lists written, captures in _tmp/2026-11-04-w12-*; brand-lab got 13–27 and brand 01 before the cut. Goal set blocked.

[00:47 GMT · 2026-11-05] · W12.1 Shell, Hub, Catalog · built (kol-figma-agent)
  what → ↳ Other apps: shell 358:9034 (10: AppShell / SiteLayout instances, phones, More sheet, drawer), hub 358:9044 (17: AppShell + hub pages, overlays as wrapper frames), catalog 358:9054 (12: PageShell) moved under the hub row with its layer label (y 5011); every name `<app> — NN · <state>`, 0 placeholders
  masters → `12.1 masters` 867:24589: VariantsControl (open, axes slot) + /axis + /cell, WalkthroughPanel, AppItemRail + /row; ContentCard gains variant=catalog|file|slide + detail/count props; ContentRow gains variant=catalog|slide + count
  audit → 0 errors on both pages; warnings raw-fills 8 (6 scrims, 2 placeholder media #6b7280); 1785 instances, 0 unlinked
  open → PageHeader master draws a larger title than the app header (60px), so headers sit ~16px low; no star glyph in Icon masters (favourite shows the settings glyph); shelf/slide title stays heading-05; AppShell rail can't widen, so shell 02 lays a NavRail over it
  look → _tmp/2026-11-04-w12-1/figma/side-*.png (live | Figma per frame); vite :5311–5313 PIDs 13818/13820/13823 killed

[01:11 GMT · 2026-11-05] · W12.4 Audio · built (kol-figma-agent)
  what → ↳ Other apps, one row at x 100000 y 5793: rack 358:9166 (8), rack-hub 358:9178 (18), mixer 358:9184 (10), mixer-hub 358:9190 (16); every name `<app> — NN · <state>`, 0 placeholders; sections set to Light (the captures are light)
  how → hubs = AppStudio instances (NavRail/item rail at 48, settingsRail filled from the live settings data, ContentCard/ContentRow with real titles, dates, sizes); covers and canvas routes (Patch, Module, Create, Rack, Stage, Studio) are live captures as image fills in the page slot; rack/mixer are bare canvas tools = capture frames, ⌘K and S as CommandOverlay / ShortcutsOverlay instances with the real lists
  audit → 0 errors; raw-fills 4 (scrims)
  open → frames are 1440×900 (the captures' viewport), not full scrollHeight; PageHeader still draws its larger title, so lede sits ~38px low; AppFloatNav has no active state; ShortcutsOverlay title centred vs live left; image uploads into slot content need hash-copy (slot node ids change after append)
  look → per-frame screenshots of 20 of 52 frames (all frame types); no vite started (captures reused from _tmp/2026-11-04-w124-audio/x)

[01:22 GMT · 2026-11-05] · W12.2 Brand (part 2) · built in part (kol-figma-agent, 25 Figma calls)
  what → brand 358:9100: 02–08 (888:27194, 888:51316, 888:51434, 888:27639, 888:27711, 888:27761, 888:28117); document 315:3499: 03 890:28363, 09 890:28752, 10 890:29620, 11 890:30271; site-hub 315:6786: 02 891:56246, 12 891:56289; tmp-upload rects removed
  masters → `12.2 masters` 887:24695 on Components: NavRail/site-collapsed (60, items + bottomItems slots), NavRail/site-drawer (scrim ab-black 48%, site rail 280, close button), SiteLayout/tablet (collapsed rail + page slot) — a nested instance swap can't resize the desktop variant's 264 rail, so tablet needed its own layout
  audit → 0 errors on brand, document, site-hub, 12.2 masters; 0 warnings; 22 instances checked, 0 unlinked
  open → document 04–08, 12–15 and site-hub 03–11 not built (DocumentIndex needs a cards slot, MarkdownPage has fixed tables); SiteLayout/tablet belongs in the SiteLayout set
  look → inline screenshots: brand 03 tablet (h1 108,207 vs live 108,206), brand 08 drawer, document 03 + 11 (h1 within 1 px), site-hub 02 + 12; vite :5321/:5324 PIDs 97498/97500 killed

[01:41 GMT · 2026-11-05] · W12.3 Studio, media, note, presentation · built (kol-figma-agent)
  what → ↳ Other apps, 42 frames in 7 sections, two rows from x 36960: studio 358:9172 (3) · media 358:9064 (14) · media-hub 358:9070 (4) at y 5793; note 358:9076 (6) · note-hub 358:9082 (4) · presentation 358:9088 (7) · presentation-hub 358:9094 (4) at y 12830; notes/notes-hub sections renamed note/note-hub; 0 placeholders
  how → studio/media = PageShell instances, hubs = AppShell instances (rail items set, phone tab bar per app), note/presentation bare frames; content drawn from the live DOM on :5341–5347 (dark + light colours bound to variables, icons are Icon-master instances, text on text styles); scripts _tmp/2026-11-04-w12-3/{m2.mjs,pack.py,unscale.py,gen.mjs,js/draw.js}
  audit → 0 errors; warnings text-unstyled 12, text-clipped 4, raw-fills 2; no section overlaps (12.4 row at x≥100000 untouched)
  open → no 12.3 masters made: tool content is measured drawing, not part instances (Notes, Decks, studio canvas modules have no masters); images and slide/layout thumbnails are blank tiles; slide display font falls back to Schibsted; note attach list rows overlap in the live code too
  look → _tmp/2026-11-04-w12-3/figma/*.png · vite PIDs 97329–97373 killed

[01:57 GMT · 2026-11-05] · W12.2 site-hub frames 03–11 · built (kol-figma-agent)
  what → site-hub 315:6786: 03 /brand 903:7965 · 04 /assets 903:8636 · 05 /research 903:9810 · 06 /research/compare 903:10030 · 08 /research/boards 903:10440 · 09 /log 903:10763 · 10 /log/crew 903:10925 · 11 /log/flight-plan 903:11088; grid re-flowed: desk row 01, 03–06, 08–11, 12 at y 200 (gap 200), 02 phone under 01; section 16600 × 6948
  how → each a clone of 12's SiteLayout desktop instance (rail rows from the live DOM, category row lit); page slot = BrandBook / BrandAssets / PageHero / PageSection / ContentCard / BlockSwatch / AssetCard instances; 18 boards + 3 card covers are live element captures (img/*.png) uploaded once; type swapped to Schibsted per screen for edits, cleared after; scripts m7.mjs, m8.mjs, sh-build.js
  audit → 0 errors, 0 warnings; 386 instances in the new screens, 0 unlinked
  open → 07 /research/sheet not built (no kol-sheet master, SiteLayout has no TOC slot); no PageControls or CategoryPage masters (compare/boards keep an empty 117/89 controls band, /log has no TOC list); BlockSwatch chip won't go below 96 tall, so compare is 2740 vs live 2307 and stop hex labels overlap; BrandAssets master 5504 vs live 4948; research cards keep a blank row where the hidden tag pill sat
  look → _tmp/2026-11-04-w12-brand/figma/sh-*.png · vite :5331 PID 25711 killed

[02:02 GMT · 2026-11-05] · W12.5 Where they live · built (kol-figma-agent)
  what → six pages under ➤ Apps before Other apps (#1E1E1E): ↳ Brand 908:27755 (brand · brand-lab · brand-hub · brand-sections), ↳ Studio 908:27756 (studio · studio-hub), ↳ Media 908:27757 (media · media-hub), ↳ Presentation 908:27758 (presentation · presentation-hub), ↳ Audio 908:27759 (rack · rack-hub · mixer · mixer-hub), ↳ Foundations of the shell 908:27760 (shell · hub · catalog); each one row at y 0, gap 400, node ids kept
  also → note/note-hub → _trash as _note/_note-hub; Shell/Hub/Catalog layer labels → _trash (_-prefixed); growth → ↳ Sets under Loaders; Layouts + hubs = workshop · site-hub; Other apps re-flowed to label rows (Engine · Tool · Fixture · Other repos)
  how → moves under the Schibsted type-mode swap on every touched page (fallback fonts preloaded), modes cleared after; 7 Figma calls
  audit → 0 errors on all 10 touched pages; warnings raw-strokes 64, raw-fills 19, text-unstyled 10, text-clipped 4 (all pre-existing content)
  open → document (315:3499) and float (651:17375) are drawn but still on Other apps — no family named for them, so 12.5 acceptance not met; not marked ✅

[02:16 GMT · 2026-11-05] · W12.5 ruling: document → Sites, float → Float page · built (kol-figma-agent)
  what → document 315:3499 moved to ↳ Sites 844:51874 (x 21436, y 0, gap 400 after article); new page ↳ Float 911:608 (#1E1E1E) before Other apps, float 651:17375 at 0,0; Other apps re-flowed (rows y 0 / 831 / 1662 / 2493, x from 2000, gap 400, labels at x 0)
  how → ids kept; Schibsted mode swap on the three pages during the move, cleared; 4 Figma calls + 1 retry
  audit → 0 errors on Sites, Float, Other apps; 118 instances, 0 unlinked

[02:24 GMT · 2026-11-05] · W12.7 prep: live measurements, no Figma calls · measured (kol-figma-agent)
  what → 8 master specs (SheetArticle, SiteLayout TOC slot, PageControls ×2, CategoryPage TOC, BlockSwatch 40/120/200, MarkdownTable table+kv, DocumentIndex ×2, LinkPreview) + frames.json for site-hub 06/07/09, document 04–08, 12–15 → _tmp/2026-11-05-w12-7/
  how → site-hub :5291, document :5292 (PIDs 34808/34809, killed); spec.py light+dark; 11 unmapped colours are content hexes + sheet ink 70%

[03:39 GMT · 2026-11-05] · Dark first + W12.7 masters (partial) · built (kol-figma-agent)
  dark → `color` explicit Dark on every section/top frame of the 12 ➤ Apps pages (45 switched); light kept on brand 02/04/06/08, brand-lab 05–08; three false "light" name hits (site-hub 11 /log/flight-plan, two labels) cleared; 18 Audio rack/mixer image stand-ins can't switch → 12.8
  what → `12.7 masters` frame 917:24842 on Components: SheetArticle 917:24843, SiteLayoutTocSlot 917:24980, LinkPreview 917:25001, BlockSwatch 917:25040, CategoryPageToc 917:25041, PageControls 918:24897, MarkdownTable 918:24994; SiteLayout/tablet 888:51292 → variant=tablet in 385:12042
  how → spec JSON through build.js under the Schibsted type-mode swap (cleared); sheet 70% ink = surface/on-primary at paint opacity .7 (the color-mix rule), no new variable; JetBrains 600 → Bold (no SemiBold in Figma); table rows / legend grid / sheet rows set horizontal (spec.py records table/grid rows as vertical)
  audit → 0 errors on the 7 masters + SiteLayout set; raw-fills 8 (swatch/legend content hexes), no-description 1, info 4
  open → DocumentIndex, MarkdownTable Row master, SiteLayout toc variant, SheetArticle height (1965 vs 1647), all 12 frames; 14 Figma calls, stopped for the allowance

[04:54 GMT · 2026-11-05] · W12.7 masters + 12 frames · built, not closed (kol-figma-agent)
  what → masters: MarkdownTable/row 922:24865, IndexCard 922:25881, DocumentIndex/group 922:25886, DocumentIndex 922:25904, SiteLayout variant=wide 922:25927 (+ showToc); frames site-hub 06/07/09 (942:4032/4942/5417), document 04–08, 12–15 (926:6673 … 938:10045); both sections re-flowed to one route-ordered row
  how → full-depth DOM capture (m-full.mjs → full.json → conv.py → build.json); prose as measured text with runs, tables as row instances (cells hug text, width via right padding — instance children can't be resized), sheet numbers split into the gutter; vite :5291/:5292 PIDs 90322/90323 killed
  audit → 0 errors on all three pages; 844 + 119 instances in the frames, 0 unlinked; raw-fills only swatch/content hexes
  look → _tmp/2026-11-05-w12-7/figma/*.png beside live/*.png: 04/05/06/07/09/12 match; 06 swatches on BlockSwatch heights; 13 last table +11 px; 08 image tiles blank
  open → SheetArticle 1611 vs 1647; App-frame rail icons; Site · App toggle; document rail active row; 1440-wide older frames sit beside 1600 ones

[05:16 GMT · 2026-11-05] · W12.7 closed · open items fixed (kol-figma-agent)
  what → document 08 172 image tiles + 15 LinkPreview image (fills from live crops); 14 App rail items slot → 8 NavRail/item, logomark/rule/bottomItems hidden; Site · App toggle (TabsRow text, 953:10650 …10721) on 04–08, 12–15; 11 Library row active; SheetArticle 917:24843 lede 724 max-width + row paddings (1611 → 1652, live 1647); doc-13 table rows lose the text-height rounding (≤2 px of live); site-hub 315:6786 + document 315:3499 on 1600 columns, gap 200, top-aligned
  how → /media re-captured at 2× with every image loaded (vite :5292 PIDs 23547/23577, killed); upload_assets rejects instance-sublayer ids → upload unplaced, copy imageHash onto the tiles, remove the placed frames
  audit → 0 errors on Components (917:24842), Layouts + hubs, Sites; warnings 8 (content hexes, table row stroke)
  look → figma/fix-*.png beside live/: 08 images match; 14 rail + toggle match; 15 image matches; 13 tables match
  open → toggle is TabsRow md (14 px) vs live 12 px tracked (88 vs 81 wide); 15 preview body shows 4 lines (live clamps 3); 14 TOC labels wrap; 04 tables wider than live; 06/12 TabsRow shows Overview underlined (live none); 1440 frames have no toggle

[06:28 GMT · 2026-11-05] · icon refile mirrored to ↳ Icon masters (kol-figma-agent)
  what → 21 masters re-filed (ids kept), new communication frame 988:44421 after people; flask-round → lab-flask, flask-conical → lab-conical, beaker → lab-beaker; 7 dupes swapped (1 instance each, all on ↳ Icons) then moved to _trash with _ prefix; interface section 29:3 re-stacked (gap 40, was overlapping), touched frames sorted by name
  audit → 0 errors on 29:3; 6 no-description warnings (align-* sets)
  look → _tmp/2026-11-05-icon-refile/figma/*.png, 11 groups, grids clean
  open → barrel-solid was already in shapes (barrel set); devices robot set has an outline variant with no robot.svg; identity frames hold one glyph each vs 8–11 files per folder, workshop missing; ↳ Icons view cells still named after the 7 dropped icons and not re-filed
[06:31 GMT · 2026-11-05] · ↳ Icons view re-filed to match (kol-figma-agent) → 7 dropped-name cells to _trash with _ prefix; 3 lab-* cells renamed; 22 cells re-filed, communication group 991:45022 after people; touched grids sorted, counts and header (925 icons in 19 groups) updated, section 310:6563 hugs; audit 0 errors; view-*.png ×12; open: typography view has no bold cell (42 vs 43)

[06:42 GMT · 2026-11-05] · W12.7 nits + W12.8 Audio · built (kol-figma-agent)
  nits → TabsRow 9:123 gets variant=text size=sm (helper/12, hugs; 961:25109, 961:25116); 15 Site · App toggles swapped to sm, 79 wide (live 81), right edge 12 px; toggle added to document 01/02/03/09/10/11 + phone (page slot); LinkPreview 917:25001 body clamps 3 lines, card 278.9 (live 279); 14 TOC labels no wrap; 06/12 header shows no active tab; 04 tables already equal live (960; 503/197/260)
  masters → 12.8 masters 959:25061: Knob 959:25314, JackSocket 959:25327, 37 RackModule/*, RackCase/rail, 5 RackOverlay/*, 12 Mixer parts, 4 MixerOverlay/*, TapeMachine (62 nodes); Channel masters' range inputs drawn as track + thumb
  frames → rack 01–08, mixer 01–10 rebuilt in place from instances (dark, 1600 × 1080); hub routes rh04–08, rh13–17, mh04–07, mh12–14 rebuilt as AppStudio slot content; rendered outputs as image fills only
  how → cap.mjs (DOM → flat prims, modules/overlays as parts, knob/jack atoms) → conv.py → pack.py/spack.py call files; long calls run by a sonnet runner; vite :5291–:5295 PIDs 68161/68163/68166/68168/68170 killed
  audit → 0 errors on Components, Audio, Sites; warnings raw fills/strokes (content colours, svg icons), 11 text-unstyled
  look → _tmp/2026-11-05-w12-8/figma/*-cmp.png: rack and mixer frames match live; TV chassis and tape VU gradients flat; hub titles wider; mh04 patch lines heavier
  open → mixer-hub 15 phone · Studio (call interrupted); stage-size masters not needed (instances rescaled)

[06:55 GMT · 2026-11-05] · W3 3.1 Icon masters · built (kol-figma-agent)
  robot → outline variant 296:3409 had 0 instances; moved to _trash as `_robot/variant=outline`; robot set 299:115 keeps solid only (devices 42 = folder)
  identity → 81 masters added from the folder SVGs (createNodeFromSvg, named as the file): brand 9, fxr 8, kol-ds 9, kolkrabbi 11, metric 9, mirror 10, monitor 9, r2b2 8, record 9, studio 9; new workshop frame 1000:1073 (1); app-icon/tile/og/favicon keep their own hex, plain currentColor glyphs bound to the existing ink variable 5:74
  layout → identity frames 1232 wide wrap, stacked gap 40, section 38:102 hugs (1312 × 11060); KeylineGuide + 2 loose wordmark masters moved to x 3360
  counts → every interface, signal, external and identity frame = its folder count
  audit → 0 errors on 29:2; warnings 706 raw-fills, 76 raw-strokes (identity colours + svg paths), 6 no-description
  look → _tmp/2026-11-05-icons-w3/*.png ×12, all marks render as source
  open → loose page-root masters wordmark/kolkrabbi 156:2706 and wordmark/voyager 156:2707 sit outside any frame (kolkrabbi one now duplicates kolkrabbi-wordmark); library not published

[07:07 GMT · 2026-11-05] · W1 1.3 + W2 2.1 Icons · built, 2.1 close blocked by Figma rate limit (kol-figma-agent)
  games → frame 1011:87 in interface 29:3 after people: 6 outline chess masters moved (ids kept), 12 -black/-white built from the SVGs, fills bound oq/96 (5:74); 18 = folder; people 48 masters (60 files); section re-flowed
  sheet → ↳ Icons section 1012:4924: blocks interface 1012:4925, signal 1013:2638, identity 1013:3607, external 1013:4740; Dark mode, surface/primary; column per folder (heading helper/16 "Label (n)"), rows = instance + accent/primary rule + mono/14 name, 4 across; generated from the folders (bold now present)
  check → rows per category = files per folder for all 53 folders; 0 rows not instances; 0 name mismatches
  trash → old Icons by set 310:6563 → _trash as `_Icons by set (cell grids, retired 2026-11-05)`, frames `_`-prefixed
  audit → 29:2 0 errors (6 no-description); Icons 21 glyph-stretched false positives (identity wordmarks/og, uniform scale) → audit.js now compares aspect to master; re-run refused (MCP call limit)
  open → re-run audit on 1012:4924; per-category screenshots to _tmp/2026-11-05-icons-w2/ (only icon-masters-games.png saved); 2.1 not marked ✅

[07:14 GMT · 2026-11-05] · W12.8 Audio finished, Studio/Media started · stopped at the Figma call limit (kol-figma-agent)
  audio → mh15 (883:33581) rebuilt from instances; Channel masters' Speed/Opacity → Slider instances, Slider set 577:20000 gains readout=input|value (26 new variants, thumb at value, SCALE); MixerScreen chassis 965:25909 + TapeMachine lip/VU 969:25978/969:25980 gradients from the code; mh04/mh12 non-scaling strokes set 2/1
  titles → PageHeader 456:11783 combined into set 1007:134240 (size default/app/app-phone, eyebrow + showEyebrow; app 60/60, phone 46/46, tight-medium bound, lede 19/26 light 0.3); 12 hub titles + 3 Studio titles swapped to it under the Schibsted mode swap (cleared after); Code Connect PageHeader/Slider files updated, publish blocked by Rail (14:9 missing) and LayerStackRow (variant) mappings
  12.8b → section 1013:31860 on Components: CanvasStudio ×2, ColumnBrowser/row ×11, ColumnBrowser/preview ×2 lifted from the measured frames by live part boxes (parts.mjs on vite :5301–:5305, PIDs 49576/49578/49580/49582/49584 killed), text/icon overrides by position, live-text guard
  audit → 0 errors Audio page; 0 errors Slider, PageHeader, 12.8 masters
  look → _tmp/2026-11-05-w12-8/figma/fix-{mh04,m01,mh15p,mh12p}.png: titles narrow like live, strokes match, VU/chassis gradients show, sliders at value
  open → media 08/09 overlay labels under their panel (repair script ready); media 02 offset; media 04/10–14, media-hub, presentation(-hub), sets/layout/audit of 12.8b, SiteHero; _tmp/2026-11-05-w12-8b/NEXT.md

[00:24 · 2026-11-06] · W12.8b resumed · masters set, media/studio/site-hub done, presentation partial (kol-figma-agent)
  media → 08/09 overlay labels moved above the scrim; 3 VIEW labels (Files view, Folder rows, Folder columns) re-cloned in 09; media-02 column strip +118 to live, 18 rows instances; media-11/14, media-hub-01/04 rows + preview swapped (34)
  12.8b → 1013:31860 on Components: ColumnBrowser/row set 1023:26566 (layout × state × type, `label` TEXT, 4 duplicate masters merged with texts/icons kept, 5 retired to _trash `_`-prefixed), ColumnBrowser/preview 1023:26567, CanvasStudio 1023:26568, SlideThumb 1022:854 (`index`), SlideInspector 1022:754, SiteHero 1024:5827; section stacked + hugged; 122 row labels set from the live row texts
  studio → 21 module tiles carry the code's own preview PNGs (CanvasStudio renders <img>), studio 01–03
  site-hub → 01/02 SiteHero instances; wash bound fg-inverse/96, 80 % on the dark screens
  presentation → SlideThumb/SlideInspector instances on 01/03/hub-01/hub-03; 04/05/07 sheets and 06 template grid still loose; thumbs blank (no miniatures)
  audit → 0 errors on Components 1013:31860, Media, Studio, Presentation, Layouts + hubs site-hub; warnings: 9 text-unstyled + 2 raw-fills on Presentation, 1 text-clipped + 1 raw-fills on Components
  look → _tmp/2026-11-05-w12-8/figma/w12-8b-{m02,m08,m09,m11,mh04,s01,sh01,sh02,ph03}.png
  open → media 04/10/12/13, media-hub 02/03 have no measured parts (grid tiles, library, viewer, settings) and stay loose; media-08 format thumbnails flat; presentation slide canvas type and thumbs; Studio title smaller than live

[00:27 · 2026-11-06] · W2 2.1 Icons closed + wordmark cleanup (kol-figma-agent)
  2.1 → audit 1012:4924 clean (1208 instances, 0 unlinked, 0 stretched); look → _tmp/2026-11-05-icons-w2/icons-list-{interface,signal,identity,external}.png at 1:1, rows legible
  retire → wordmark/kolkrabbi 156:2706 → _trash as _wordmark/kolkrabbi; its 2 instances on Components (433:11560, 433:11544, wordmark link) swapped to kolkrabbi-wordmark 1007:26290
  voyager → no voyager identity frame; wordmark/voyager 156:2707 now in the kolkrabbi frame 297:134 after kolkrabbi-wordmark; identity section 38:102 re-flowed (40 gap), grew to 11256
  audit → Icon masters 29:2 0 errors; warnings 706 raw-fills, 76 raw-strokes, 6 no-description

[01:27 GMT · 2026-11-06] · W6 6.1 float-editor masters · built (kol-figma-agent)
  stale CC → Rail.figma.js → 54:301 (the Rail set), LayerStackRow.figma.js → 824:68319 (its set)
  measure → task Vite :5291 (PID 78375, killed); dark-only DOM boxes of 9 editor states + /parts/windows; spec → builder binds colours by Dark value, text styles by metrics, icons as Icon-master instances
  new → section 1032:26011: MenuBar 1032:26160, FloatTextToolbar 1032:26012, CardInspector 1040:26166, Settings* ×15 (1035:26021–26232)
  extended → Card +radius=window; ToolRail +orientation/more (dock with ▾ and ⌘K); PropertyRail +density=compact; CommandOverlay +tabs/anchor; Dialog → set 1043:26465 (float · settings); grown sets moved to free space, Molecules section +538
  CC → 21 new figma/*.figma.js, Card/ToolRail/PropertyRail/CommandOverlay/Dialog updated; publish exit 0
  audit → 0 errors on the section, the 5 sets and their sections; warnings 14 text-clipped, 7 raw-fills (layer swatches)
  look → _tmp/2026-11-06-float-masters/sbs-*.png (27, live | figma): boxes match; open: inner controls drawn not instanced, inspector corner-radius slider + align dividers missing

[01:55 GMT · 2026-11-06] · plan-2026-11-05-float-editor 6.2 · Float editor screens
  new masters → FloatEditorShell 1055:26466 (breakpoint desktop · phone × timeline; slots cards + stage; menu bar, document, breadcrumb, transport, actions, tools, modes, zoom as instances) · CardTypography 1051:26229 · GeneratorWindow 1055:26279 (Repeat · Paratype letter × dialog · rail) · MenuBar +variant=capsule 1051:26341
  screens → section ↳ Float editor 1056:45186 on ↳ Float (dark): 01–06 + Generate/Repeat/Paratype × dialog/Rail, 12 shell instances, slots hold only instances
  audit → section 0 errors, 0 loose, 0 unlinked; masters section 0 errors after MenuBar went horizontal
  look → _tmp/2026-11-06-float-screens/sbs-*.png (his | live | figma); vite 5293 PID 86424 killed
[02:13 GMT · 2026-11-06] · plan-2026-11-05-float-editor 6.3 · Dock, search, Labs A/B
  masters → FloatEditorShell +tools rail · dock (1063:26952, horizontal ToolRail) · new FloatLabsShell 1065:27997 (variant editor · float, slot stage), Code Connect → FloatLabsView, publish exit 0
  screens → section ↳ Float search + Labs 1066:13484 on ↳ Float (dark): dock, anchored, centred, Labs A, Labs B; 5 layout instances, 0 loose
  audit → both pages 0 errors, 0 unlinked; boxes within 2 px of live except A's breadcrumb (+10, mono master)
  look → _tmp/2026-11-06-float-labs-ab/sbs-*.png (live | figma); vite 5294 PID 37646 killed
[03:00 GMT · 2026-11-06] · W12.8 rest · media, media-hub, presentation, Studio title
  masters → 12.8b masters 1013:31860: SlideRenderer 1078:27943 (15 layouts from the live slide docs, RG via font/sans + new font-style vars fine · black · *-italic), SlideThumb set 1079:27891 (nested slide, state active|default, index), DeckEditor/layout-tile 1079:27892, DeckEditor/present 1079:27925, DeckFile, DeckSettings, Overlay, MediaLibrary/header · pathbar · browser · stats · toolbar · sort · file-row · modal · filters · settings · tags, MediaTile, AppHub/header-actions; Button tone=grey 1076:27815; SectionText page headline → Tight Medium
  screens → media 04/10/12/13, media-hub 02/03, presentation 04–07 all instances (0 loose); p03 thumbs show their slides; Studio 01–03 titles are SectionText page (96 / 56 phone, as live); viewer tiles + pdf thumb image fills from live crops
  audit → 0 errors Components, Media, Presentation, Studio; Code Connect +20 files, published
  look → _tmp/2026-11-06-w12-8-rest/side/*.png (live | figma); vite 5311–5314 PIDs 74687 74689 74691 74693 killed

[17:02 GMT · 2026-11-06] · FloatLabsShell on FloatLayout (A · B retired)
  master → FloatLabsShell 1065:27997 now `rail=expanded` 1065:27165 · `rail=collapsed` 1065:27745, each a FloatLayout instance 1600×1000: nav NavRail float (Labs + globe, Color · Effects · Generative · Morph open / 72 glyphs, Effects lit), bar TopControlsBar (DocumentCapsule Dither ▾ Labs · transport · GlobalActions), content stage card (surface/secondary, float/window), inspector PropertyRail compact 352 (Parameters, LabsParams, EditorFooter foot), bottom AppFloatNav in the code's 418×66 wrapper (−16); `variant` + `stage` props dropped
  masters fixed → TopControlsBar gains `center` slot 1095:39593 (code's center region); PropertyRail compact content now in its `body` slot 1095:40110; FloatLayout bottom slot min-height dropped
  screens → 04 · Labs expanded 1066:14893, 05 · Labs collapsed 1066:15292; section 1066:13484 re-flowed to 2480
  measured → live :5216 #/views/float-labs, every chrome box ±1 px; audit 0 errors (1 raw-fill warning, PropertyRail compact label); Code Connect FloatLabsShell drops `variant`, published

[17:28 GMT · 2026-11-06] · Library split into tier pages (move only)
  pages → ↳ Components 309:88 renamed ↳ Atoms (Index frame 1104:144333 at 0,0, 48 links); new ↳ Molecules 1103:28123 · ↳ Organisms 1103:28124 · ↳ Modules 1103:28125 · ↳ Not yet drawn 1103:28126 (after last divider); #1E1E1E, color Dark
  moved → every master by node reparent (keys kept), one section per family, one column, 200 gap; code tier wins; *Shell/*Screen with slots + phone frames → Modules; 286 placeholders → Not yet drawn; 21 emptied containers removed
  counts → 1380 comps / 175 sets before and after (454/30 · 524/79 · 370/55 · 32/11); audit 0 layout errors, 0 unlinked; held: pre-existing sample-text + variant-stacked inside masters

[22:18 GMT · 2026-11-06] · ❖ 01 Buttons: tone is the instance's mode (plan-2026-11-06-buttons-page 1.1–1.4)
  sets → Button 8:32 = role × size × content × state(rest·quiet·pressed·disabled) + shape=round lg·icon·rest/pressed = 66; Button float 1143:1260 = size × content × state(rest·pressed·disabled) = 18, + `count`/`countValue`; no tone property; every paint binds `tone/*` except nav ink (oq/80, the code's :where(.kol-btn-nav) bundle) and the count (fg/64)
  migration → 154 former instances: 139 to their tone mode, 15 nav to role=nav; 0 left on retired cells; masters kept 48 + 6, created 18 + 12, retired 114 to _trash 1162:1958 with "_"
  nested → DocumentCapsule (back + check icon · Saved), GlobalActions, TopControlsBar, TabsRow float md/bare/lg/sm, Modal float footer = Button float instances; Modal bordered/lift footers = Button instances; In use: Button = Modal bordered confirm, float = TopControlsBar + GlobalActions
  checks → audit 0 errors on 1138:88, Organisms, Molecules; Code Connect Button · ButtonFloat · DocumentCapsule rewritten, published; shots _tmp/2026-11-06-figma-library-layout/figma/buttons-final-*.png

[00:10 GMT · 2026-11-07] · ❖ 01 Buttons round 2 (plan-2026-11-06-buttons-page 2.1–2.6, 2.8)
  border → cause: a colour variable's alpha never drives the paint, the 0-alpha tone/border stroke rendered black; now every Button/Button float master keeps a transparent bound 1px stroke (box = code) + a `border` layer whose opacity binds new tone/border-opacity (1 outline, 0 rest); role × tone stroke alpha 0 except outline, nav no box
  float → text styles float/button-sm·md·lg (font/float, 12·13·14, 500, 100%) on 9/9 labels; padding bound spacing/3·4·5, 0 fractions
  capsule → name ▾ = MenuTrigger float instance (transparent, padding spacing/2); MenuTrigger float variants rebuilt as Button float instances; status text + check rebound oq/64
  family → CloseButton = 1 Button (nav, icon, x) per size, Stickers dropped; SplitToolButton 1179:1577 (8, Button + fold icon) + frame 1179:1603; Button/bare → _trash "_"; ButtonGroup 21:174 = SegmentedToggle renamed in place + layout row·stack·joined + `buttons` slot (46 instances kept, overrides intact), joined cells from .kol-seg*; Split button frame 1181:989; Atoms SegmentedToggle doc → _trash
  checks → audit 0 errors on 6 frames; 0 unlinked of 8,340 instances file-wide; Code Connect ButtonGroup published, SegmentedToggle + ButtonBare files → _tmp/2026-11-06-buttongroup/

[00:59 GMT · 2026-11-07] · plan-2026-11-07-figma-library-tiers 1.1 + 1.2 + 2.1 · Buttons fold back, Atoms › Controls
  fold → ❖ 01 Buttons emptied (0 nodes): Button · Button float · CloseButton → section Buttons 1194:892 on ↳ Atoms (91 masters before = after); ButtonGroup · SplitToolButton · Split button → section Buttons 1194:893 on ↳ Molecules (31 = 31); breadcrumbs = tier; both pages one column from x 0, 200 apart
  sets → Input 9:20 variant default·property × size xs·sm·md (4) + Input float 1196:3062 sm·md; Textarea 21:42 sm·md + Textarea float 577:20015; ToggleSwitch 9:88 bare·outline·primary × sm·md × checked (12, labelled boolean) + float 1196:3106; ToggleCheckbox 20:20 default·media × checked + float 1196:3163; ViewToggle 21:65 text·icon + float 577:20005; IconToggle sm·md × pressed; SortHeader 3; OriginPicker 9 values at sm
  rule → every float look is its own geometry in kol-theme CSS, so all five are sibling sets; filled/outline are tone aliases → the tone mode; Input/Textarea borders on the tone/border-opacity layer; checkbox glyph now the check Icon instance
  counts → kept 35 variants, created 13 (+3 float sets, 2 float components split out), trashed 45 to _trash 1196:2132 "_", 49 instances swapped, 11 old doc frames to _trash; 0 unlinked of 5,062 file-wide; audit 0 errors Atoms (Buttons + Controls) and Molecules Buttons
  frames → 8 doc frames 1197:2127…4468 from _Header/_Section label/_Annotation/_Footer; In use: ColorPickerPopover + LabeledControl, ReadingNotes, SettingsSections, ContentCard + TaskCard, Brand (crop); none in the library for IconToggle, SortHeader, OriginPicker; Code Connect rewritten + 5 float files, published
  look → _tmp/2026-11-06-figma-library-layout/figma/c-*.png, w1-*.png; gotcha: older sets carry auto-layout — set layoutMode NONE before gridding variants

[01:03 GMT · 2026-11-07] · tiers 2.1 follow-up · disabled state where the code disables
  states → Input 8 · Input float 4 · Textarea 4 · ToggleSwitch 16 (bare only) · ToggleSwitch float 4; +14 masters (Controls 48 → 62), opacity 0.5 bound opacity/disabled, float 0.4 raw (no token)
  not drawn → ToggleCheckbox (disabled spreads onto the label, no rule paints it), ViewToggle · IconToggle · OriginPicker (0 uses)
  checks → audit 0 errors Atoms; 0 unlinked of 5,079; Code Connect emits disabled, published exit 0

[02:03 GMT · 2026-11-07] · plan-2026-11-07-figma-library-tiers 2.2–2.9 · Atoms ready, Utilities page
  sets → Tag primary·secondary·tertiary × xs·sm·md × active (18) + Tag float sm·md × active (4); Pill primary·inverse × sm·md + Pill float; Badge default·secondary·outline × xs·sm·md + icon swap + Badge float; Avatar xs–lg; SectionLabel md; ProgressBar default·success + float; Delta up·down; LiveDot live; ValueField sm·md; Sparkline no fill; IconFrame role default·nav × sm·md·lg + round md, colour = tone mode (unset = inverted, pinned), 30 instances moded; IconPlate + guide (KeylineGuide)
  moves → Legend · WeeklyBars · ProportionBar → Molecules › Charts, ColorSwatch → Molecules › Colour + type; logomark/kolkrabbi → Icon masters › identity › kolkrabbi row; Tooltip · ProsePreview → new ↳ Utilities 1218:87 (after Modules, #1E1E1E, Dark); _Utility → _Doc parts
  new → Tooltip 1218:95 default·float (+ shortcut chip); PopoverPanel 1218:116 default·float with a content slot; 12 menu/sheet masters nest it as their panel (overrides carry their class); ProsePreview 1218:136 prose·doc, every text a style
  counts → kept 70, created 22, trashed 54 masters + 30 old doc frames to _trash "_"; 53 instances swapped; 30 template frames; 0 unlinked of 8,632; audit 0 errors on Atoms, Utilities, Menus · Charts · Colour + type
  measured → probe-w2t.js on :5297 (PID 7166 killed); Code Connect 18 files rewritten/new, published

[03:54 GMT · 2026-11-07] · plan-2026-11-07-figma-library-tiers W2R 2.10–2.14 · In use from call sites, IconLoader, Slider base, Identity page
  in use → 36 Atoms frames: Used in 36/36 (files + outside count); 13 In use from a master that matches a call site (caption names the file), 23 name the call-site files; 0 hidden/clipped (script); ThemeTile fixed at the source — ReadingSettings 590:20462 had two clipping rows cutting the selected tile's outside stroke
  IconLoader → 1234:22012 size 10·12·14·16·18·20·24·40·48 × outline·solid, glyph swap; new variable collection icon (mode per size) + icon/stroke bound on 2,511 1.5-weight glyph strokes, so a glyph's line scales with its size (the Kbd sm "stroke" was this); 174 glyph slots in 17 Atoms masters swapped in place to IconLoader (node ids kept), master swap props (Button icon/iconLeftName/iconRightName, Button float, IconToggle, Badge, ValueField, IconFrame) replaced by exposed IconLoader slots; 169 instance icon overrides recorded before and restored after, 2 raw slots converted
  new → FileIcon 1234:22036 ext true·false nesting IconLoader 40; frames IconLoader 1236:3960 · FileIcon 1236:4043 in Icon frames; IconFrame header states its role
  slider → _Slider base 1238:4586 (minimal·float·scrub·panel·dual, + vertical) private in the Slider frame; Slider 577:20000 rebuilt to 10 variants variant × readout × direction, nests base + Input; 75 opacity-value variants removed (0 instances); range = variant dual — it is in code, so no "not in code yet" frame; ProgressBar keeps its own track (code does not share it), SizeChip stays (fixed 32×28 tile, not a Pill/Tag) — both stated on their headers
  pages → ↳ Identity 1232:89 after Utilities holds the identity set (incl. logomark/kolkrabbi duplicate); Icon masters keeps the 10 app glyphs (section 1232:90) + header 1242:87 naming IconLoader and VectorLoader; KeylineGuide → _Doc parts; Utilities header 1242:26605
  checks → audit 0 errors Atoms; Slider 10/10 nest base, 0 drawn tracks; 0 loose glyphs in Atoms masters; 0 unlinked on every page; Code Connect IconLoader · FileIcon · Slider · Button · ButtonFloat · ValueField written, published

[04:40 GMT · 2026-11-07] · plan-2026-11-07-figma-library-tiers W3 3.1–3.3 · Molecules Inputs, Navigation, Content (kol-figma-agent)
  inputs → Input + Input float gain placeholder · iconLeft (IconLoader) · prefix · slotRight (slot); Kbd gains showLabel; QuantityInput float hugs (4·32·value·32·4, float/panel) + default chevron/split; SearchInput default · float × sm/md/lg (float type float/button-*, centred); PasswordInput, FieldPair 1256:4770, InlineAddRow 1256:4816, LinkAddRow 1256:4930, AccountForm (+ column) nest Input / Button / Kbd / IconLoader
  nav → new RailRow 1258:4880, RailSection 1258:4988 (level × collapsed, children slot); RightRail 370:10169 and ShellSidebar 1269:5710 (mode open · icons) built from them; Rail nests CloseButton + Divider, body = slot; DocsToc list · rail · float (TocRow 583:20277); 108:254 → _kol-toc-row; List kind × level 1–3
  content → new ContentMedia 1264:5161, ContentText 1264:5245 (10 ramps lifted from the measured cards), ActionButton 1265:5297, CopyButton 1265:5298 (Atoms), AssetPlaceholder 1259:12516 (Utilities); ContentCard/Row rebuilt from them; CodeBlock nests CopyButton; PageHeader = SectionText (level × breakpoint); QuickLookHeader default · float (eyebrow retired); FoldedHead/ShareButtons/LinkPreview headers
  frames → 29 template doc frames with Used in + In use (instances, call-site captions); 22 old frames + 3 retired variants to _trash bins with "_"; sections re-flowed, page restacked
  checks → nesting diff missing 0 except FoldedHead's Button bare (no master); 0 loose glyphs in scope; 0 unlinked (Molecules 1,999 · Atoms 781 · Sets 1,056 · _trash 2,444); audit Molecules 2 errors = pre-existing props-table cells "label" (LabeledControl, LiveCard); Utilities clean
  measured → probe-w3.js on :5291 (PIDs 69290/69326 killed); shots _tmp/2026-11-06-figma-library-layout/figma/m-*.png (30)
  open → Code Connect not written for the new masters; Dropdown master still holds a direct glyph (3.4); List nested markers are Figma's (a./i.), code keeps decimal
[04:52 GMT · 2026-11-07] · W3 closing items (kol-figma-agent) → Code Connect: 7 new files (RailRow, RailSection, ContentMedia, ContentText, ActionButton, CopyButton, AssetPlaceholder) + 15 rewritten to the new sets/props, publish exit 0; props-table cells 340:4969 · 566:19976 → `label`, Molecules audit 0 errors; file card select = compact ToggleCheckbox at the 12,12 frame control (was the 256×160 media tile), mark yields that corner; m-contentcard.png re-shot

[05:33 GMT · 2026-11-07] · plan-2026-11-07-figma-library-tiers W3 3.4 · remaining Molecules families (kol-figma-agent)
  glyphs → 238 owned glyphs on Molecules swapped in place to IconLoader (ids kept); swap props MenuRow icon/trailing, MenuFlyout, SectionCardItem, RankedListRow, ButtonGroup/cell, CommandOverlayRow → exposed IconLoader slots, overrides restored; 7 Organisms masters shown in In use (DocumentCapsule, CommandOverlay(+Row), Contents/row, TableRow, AppFloatNav, NavDrawer) 134 owned + 44 stale nested swaps → IconLoader; Dropdown's direct glyph gone; 0 loose on ↳ Molecules
  nesting → drawn rows → MenuRow / MenuDivider (MenuItem, MenuPanel float, MenuMore, AccountMenu), MoreSheet rows = Button nav lg, AccountMenu trigger = MenuTrigger float; Dropdown open=true nests MenuPanel; cards: Button float (Source/Capture/Project/Continue), Badge + Divider (LiveCard), Badge (DataStatus), SectionHead + TaskCard in Card, Button float in SectionHead, Legend in LineChart, QuickLookHeader in Dialog + Modal, Input in Modal prompt; FlyoutRow/LayerRow = TreeRow; Settings* nest Slider/Dropdown/ButtonGroup/ToggleSwitch/Input/Button, SettingsRow = LabeledControl slot + ToggleSwitch; colour chips = ColorSwatch (ColorRamp, ColorAnatomy, BlockSwatch ×2, ColorField); PageControls = Tag/ButtonGroup/TabsRow
  new → ProgressLine 1288:8692 (Cards), ClearspaceDiagram 1290:8880 (logo slot; CardLogo nests it), RowMenuButton 1292:9084 (Buttons; MediaTile `coarse`), TransparentX 1289:382 (Utilities); ColorSwatch one chip per state (12); DeltaBadge set 716:56435 was off-document — reattached to Charts
  frames → 131 template frames (Used in + In use) across 17 sections; 66 old doc frames → _trash "_"; Split button frame says not in code yet; page restacked one column 200 apart
  checks → audit 0 errors Molecules, Utilities, touched Organisms (CommandOverlayRow "Label" default → "Color tokens"); 0 null-main instances file-wide; 596 nested sublayers on Catalog (592) and _trash (4) point at off-document copies — pre-existing; Code Connect 4 new + MenuRow, MenuFlyout, ColorSwatch, MediaTile, Dropdown, published exit 0
  open → conditional/unmastered renders: Avatar (AccountMenu, MoreSheet), CloseButton (TabsRow closable), ToggleCheckbox (Modal), Menu (Card tab), Button bare wrapper (StatTiles, RankedList, Card tabs — no master), LineChart tabs + DashTooltip (hover), DeltaBadge default arrow; BlockSwatch drawn twice; Dialog settings variant + MediaLibrary/stats slider still drawn; shots _tmp/2026-11-06-figma-library-layout/figma/n-*.png
[05:51 GMT · 2026-11-07] · W3 3.4 round 2 (coordinator: missing 0, drawn 0) → Menu 1311:11714 (MenuTrigger + MenuPanel, open; search/tooltip booleans), DashTooltip 1311:11723, Button/bare 273:11932 restored from _trash (key kept, Atoms › Buttons) wrapping StatTile / RankedListRow / CardTab, Button role=tab-filled (3) from TabsRow's drawn chip tabs; conditionals as booleans/variants: AccountMenu trigger=avatar, MoreSheet avatar row, TabsRow closable, Modal checkbox, LineChart tabs + hover, RankedListRow trend, DeltaBadge variant=default, Card menuOpen; Dialog settings + MediaLibrary/stats + MenuFlyout/QuickLookFrame/LabeledControl/SettingsRamp/BlockSwatch/Card drawn parts → instances; BlockSwatch one set (site variants moved, anchor folded into its boolean); diff 115 masters missing 0, drawn 0 (remaining names are the code's own raw elements); audit 0 errors Molecules · Organisms (11 props-table "label/placeholder" cells → backticked) · Atoms Buttons; 0 unlinked; Code Connect Menu · DashTooltip · BlockSwatch · ButtonBare · DeltaBadge · Button published

[08:25 GMT · 2026-11-07] · plan-2026-11-07-figma-library-tiers W4 4.1 + 4.2 · shared bases, wrong-tier moves (kol-figma-agent)
  modal shell → ModalShell 1332:11693 (Molecules › Content) default · float, stacked bands per his Move-file model: header slot (QuickLookHeader) · toolbar slot · body slot · footer slot, Divider rules on `rules`; values from code (.kol-quicklook oq-04/oq-12/radius sm, body oq-02, footer 8; float = settings window 18·24 / 24 / 12·24, float/window radius, shadow/float); QuickLookFrame (both), Dialog float, Modal float nest it with rules off and the code's paddings — sizes unchanged (640×420, 562×300, 418×362, 562×234); QuickLookHeader float title now wired to `name`; Modal bordered/lift and Dialog settings draw no QuickLookHeader in code, left as they are; no Code Connect (no code component)
  rail → RailRow/RailSection confirmed as the workshop rail base; NavRail/row · item · icon NOT merged: three different code rows (NavRailSite sidenav row, NavRail's Button-nav row, NavRailFloat's 44 item) — none renders RailRow
  confirmed → PopoverPanel float 1218:116 is the panel base (surface + radius + shadow/float bound); LabeledControl = label + `control` slot (any control); Slider: ProgressDock/ReaderBar render Slider float, not a bare track — _Slider base stays private; SectionText gained `actions` slot + showActions; Menu 1311:11714 exists
  merge → MediaLibrary 1337:18468 = variant float · modal · page (3 masters combined, keys kept, 0 instances); figma/MediaLibrary.figma.js rewritten, Browser/Modal files → _tmp/2026-11-07-medialibrary-codeconnect/, published
  new → CalendarHead 1333:11949 (month · timeline, `label`), CalendarEvent 1333:11999 (month · week · allDay · day, `label`/`time`), lifted from the calendar masters, section Calendar parts 1333:11904
  moves → Molecules: SectionText, SpecList (Content), Reading* ×5 (new section Reading 1334:11970), VariantsControl (Variants control parts); Overlay → Utilities (FullscreenOverlay scrim, 1440×900); nav-studio → Icon masters › identity/apps; SiteLayoutTocSlot + ShellNavColumn → Modules › Layouts; 12 template frames + 3 new; old frames 340:4765, 371:10558 → _trash "_"; Organisms + Molecules sections re-flowed and restacked 200 apart
  checks → audit 0 errors on Molecules, Organisms, Modules, Utilities, Icon masters; 0 unlinked (Sets 1,271 · _trash 3,032 · every audited page); shots _tmp/2026-11-06-figma-library-layout/figma/b-*.png

[09:21 GMT · 2026-11-07] · plan-2026-11-07-figma-library-tiers W4 4.3–4.5 · Organisms pass 1: Rails + nav, Content, Tables, Documents, Shell, Sections, Website (kol-figma-agent)
  nesting → 45 masters, code-rendered parts as instances: NavRail/item = Button nav (active = rest, aria-current), NavRail logomark = identity (VectorLoader), NavRail float Kbd, top rail filled with NavRail/item (was empty); AppFloatNav bars → new sibling set TabsRow stacked 1356:7698 (16, Molecules › Navigation), inline transport = Button float + Timecode; CommandOverlay = SearchInput float lg + TabsRow float + CommandOverlayRow; HubSettingsRail = Rail settings + TabsRow text + SettingsSections + ThemeToggle + IconFrame; SettingsSections rows = LabeledControl, sections slot; ContentFilters Divider/IconFrame/Tag float (Tag float gains count); ContentCollection items ContentCard; ColorPickerPopover ColorSwatch/Input; PageHero/PageSection/Section*/DocumentIndex = SectionText; MenuBar items = Menu float, open File = PopoverPanel float of MenuRow/MenuFlyout/MenuDivider; DocumentLibrary = PageSection; DocumentHeader Menus; MarkdownPage Notes; StackHero = SectionHero route=panel (FullBleedHero is SectionHero's alias); Image on ArticleHeader/SectionHero; ParallaxShelf = ContentCard work (new variant); 266 loose glyphs → IconLoader
  new → ThemeToggle 1349:3579 (Atoms › Buttons), Image 1349:3581 (Atoms › Display), TabsRow stacked 1356:7698, Notes 1363:10461, ContentCard variant=work 1359:21583, SectionHero route=panel 1363:10488
  breakages → NavRail top/float near-empty fixed, DocumentLibrary empty cell hidden, DocumentIndex merged (922:25904 = cards variant; old 198:634 → _trash "_", 1 instance swapped), Timeline 15 zero-width key/playhead frames sized
  frames → 40 Organisms + 2 Atoms + 1 Molecules template frames (_Header Used in + outside count, Component + _Annotation, In use, _Footer); 36 old doc frames → _trash "_"; sections re-gridded, page restacked
  checks → audit 0 errors Organisms (0 duplicate master names), Atoms Buttons/Display, Molecules Navigation/Content; 0 unlinked file-wide; Code Connect ThemeToggle, Image, TabsRowStacked, Notes new + TagFloat, ContentCard, SectionHero, published exit 0
  look → _tmp/2026-11-06-figma-library-layout/figma/p-*.png (48); rail glyph overrides reset by the swap were restored from site-hub's nav data and the float rail order

[10:03 GMT · 2026-11-07] · plan-2026-11-07-figma-library-tiers W4 4.3–4.5 · Organisms pass 2: Editing tools, Float chrome, Float windows, Float calendar + reader, Metric, Labs + walkthrough, Decks + media; MenuBar File (kol-figma-agent)
  nesting → 43 masters to code-rendered parts: Button float for every float button (ToolRail, PeriodNav, PanelsRestore, RailDisplayControls, RailTrigger, RailFlyout, ReaderBar, ProgressDock, Reading*), StatusStrip = Badge outline xs, AccountFooter Avatar, PropertyRail = TabsRow float xs + Input float + Dropdown float + Slider float (dual in compact) + ToggleSwitch float (tab1/tab2 props dropped), TopControlsBar end = PanelsRestore + inverted Button + FloatActionMenu, FloatActionMenu trigger = Button lg round inverted with its glyph inked, rows left; calendars on CalendarHead/CalendarEvent; SettingsPanel → set rail (Rail settings + LabeledControl rows + SettingsFooter IconFrame) · overlay; ShortcutsOverlay + AppItemRail nest SettingsPanel; DeckFile/DeckSettings/DeckEditor present = FullscreenOverlay's CloseButton + Button/Input/LabeledControl/ColorSwatch; SlideInspector new set 1386:12377 (layer text · image; old drawn one → _trash "_"); MediaLibrary float/page/modal on SearchInput, ContentFilters, MediaTile, ViewToggle; AppHub/header-actions = ThemeToggle + Button nav
  new → ToolPalette 1381:11025, LayerStack 1381:11269 (multi), ColorInputRow 1384:12933 (Molecules › Colour + type), LabeledControl stacked variant (inline=false, labelWidth=48, real control slot) 1385:23386; TimelineDock body drawn from code (ruler, tracks, key editor with Input + Dropdown)
  fixes → MenuBar File keys from the editor keymap (Files… ⌘O, Save… ⌘S, Save as… ⌘⇧S, New/Clear none), flyouts no glyph; Button float pressed glyphs take pressed-fg (Atoms); SlideRenderer re-gridded 5×3; MoreSheet master rows left
  frames → 42 template frames (Used in + outside count, In use instance or call-site caption); Organisms 81/81 frames on the template; sections packed, page restacked 200 apart; Molecules restacked
  checks → nesting diff 43/43 missing 0 (named remaining are the code's raw elements: TimelineDock track rows + Close button, PropertyRail select wrapper, SlideInspector layers toggle); loose glyphs 0 page-wide; 0 duplicate master names; audit 0 errors Organisms + Molecules; 0 unlinked on every page scanned; Code Connect 7 new + PropertyRail, ToolPalette, SettingsPanel, LabeledControl rewritten, publish exit 0
  look → _tmp/2026-11-06-figma-library-layout/figma/q-*.png (43 + q-MenuBar)
  fix → PropertyRail tab=2 lights Animate (3 variants); ToolPalette/tool's 11 instances sit in an off-document tree (ActionBar 699:45118, no parent) — no screen shows them; IconLoader exposed as `glyph` on every variant [10:05 GMT]
