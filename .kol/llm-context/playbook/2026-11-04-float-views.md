# Playbook — Float views + FloatLayout in apps/float

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** W1 FloatLayout · W2 apps/float · W3 views (layout, not function) per `plan-2026-11-04-float-views.md`.

**Standing rules (non-negotiable):**
- shipped KOL parts only; a missing part goes into its package first
- float tokens + Inter; no borders; icons on oq; `variant` only; never delete; never git
- agents on Opus, check once at the end

---
## Entries

[10:14 GMT · 2026-11-04] · setup · playbook created
  what → user gave the go ("GET IT DONE … dont stop") — goal loop armed, wave 1 next   why → plan agreed, nothing built

[10:24 GMT · 2026-11-04] · W1.1 + W2.1 · FloatLayout + apps/float
  what → kol-shell 0.102.0 FloatLayout (NavRail float 280 · 72 · 0 + RailTrigger, RailFlyout on hover, TopControlsBar, content, one `inspector` slot, PanelsRestore while a Rail is hidden); kol-component 0.337.0 `NavRail float onItemHover` (the flyout seam); apps/float (5216, `pnpm float`, build list, vercel rewrite, apps-tier row) — Home + 6 routes, five view stubs, visual-editor bare (no layout)
  verify → Playwright 1600 dark + light: rail 280 / 72 / 0 (restored at last width 72), bar 64, inspector 272 r20, Panels count 0 → 1 on hide; 390 scrollWidth 390; 0 console errors on all 7 routes · pnpm --filter float build ✓ · gates roster · taxonomy · placements · imports · syntax · views ✓ (preview-files · props · icon-ink · variants: pre-existing hits only)
  note → NOT PUBLISHED (main thread); VisualEditor.jsx absent at build — loaded through import.meta.glob until it lands; hover flyout not exercised (the app nav has no sections). Shots in _tmp/2026-11-04-float-views-shots/

[10:28 GMT · 2026-11-04] · W3.1 · visual editor
  what → apps/float/src/views/VisualEditor.jsx — DocumentCapsule · AppFloatNav mobile pill (labels, ···) · GlobalActions · ToolRail · SceneBreadcrumb · ZoomReadout · SelectionMeasure · CanvasHint · AppFloatNav transport + Timecode · PropertyRail · TimelineSheet; the pills sit in transformed boxes (showcase's AppFloatNav board trick); artwork on ab-black with `.dark` for the selection ink
  what → design-editor 0.27.0: `TimelineSheet` + `timelineView` (the float Timeline's sheet from data, no engine) on root + core; `Timeline` renders through it; row `layer.icon`, clip `label`; changelog · 24-float-system row 12 · shipped-packages
  verify → own Chromium via a _tmp harness (PID 27507 killed), 1600 × 1080 dark + light, 0 console errors: capsule 24·32 232×48 (frame 243) · nav 591·24 418×66 ✓ · actions right 1565 ✓ · tools 24·300 52×360 ✓ · inspector 1304·128 272×675 (frame 692) · canvas 128·152 1120×630 ✓ · selection 638·76 440×450 ✓ · timeline 104·848 1472×220 ✓ · transport 503·781 461×66 (frame 374×48) · Inter 11/13, JBM 10/12 · gates syntax · imports ✓ · check:core 10 reaches (unchanged)
  note → apps/float needs design-editor wired before the route renders: dep `@kolkrabbi/design-editor: workspace:*`, apps/editor's `/core` src alias, `@source "../../../packages/design-editor/src"`. kol-shell gaps: transport has no desktop 48 size; PropertyRail's tabs are md 36, not xs 26. design-editor src now differs from kol-fxr's (Timeline.jsx, core.jsx). NOT PUBLISHED

[10:29 GMT · 2026-11-04] · W3.1 · main thread
  what → TimelineSheet → TimelineRail (Rail law) in design-editor src · changelog · 24-float-system · shipped-packages; apps/float wired to design-editor (dep, /core alias as apps/editor, @source); App imports VisualEditor plainly; views may export `bare` + `inspector`
  verify → pnpm install ✓

[10:33 GMT · 2026-11-04] · W3.7 · Metrics (13:6898, dark frame 9:1550)
  what → apps/float/src/views/Metrics.jsx, `bare` (the frame is the whole screen with its own 216 workspace Rail): NavRail float in a 216 column (switcher = Avatar + Dropdown float, footer = StatusStrip + AccountFooter) · Breadcrumb · DataStatus · SectionText float (page + section heads with meta) · TabsRow float mono · Dropdown float · MenuDatePicker float · Badge · StatTiles float lg (Delta + spark) and sm · LineChart float (tabs · legend · scale · dashed · peak) · LiveCard · Card float + Table float · ProportionBar · WeeklyBars · Table framed · FooterStrip; no package part added
  verify → Playwright 1600×1080 light + dark: header 248·32·1320×255 = frame; trend 1020×310 (314) · live 284 · acquisition 652×370 (366) · audience 429×326 (324) · repo tiles 321×86 (83) · repo table 952×244 (241) · rhythm 352×244 — ±4 ✓; traffic tiles 321×143 vs 132 ✗ (StatTiles float lg's own px-6 py-5 + 26 spark); page 2131 vs 2115; title Inter 38 (frame 40, nearest float role); zero hex
  note → App.jsx was mid-rewrite by the main thread (no default export) during the check — the view was mounted directly for the shots; nav rows are TreeRow Inter (frame mono); counts 04 · 08 as TreeRow counts. Shots: _tmp/2026-11-04-float-views-shots/metrics-*

[10:35 GMT · 2026-11-04] · W3.4 · Rails (9:14486)
  what → views/Rails.jsx, `bare`: its own FloatLayout with the frame's nav (Studio · WORKSPACE · STUDIO & LIBRARY, Dashboard open on Tasks), bar = DocumentCapsule + SearchInput float + inverted New task, canvas on surface-sunken (SectionText float · SelectionMeasure > TaskCard lg · 3 Card float + SizeChip + TaskCard sm · Card float), TabsRow float capsule with counts, Task index as the bottom Rail (Card float + IndexRow); collapsed 72 + flyout + hidden + trigger reached by the Rail's Collapse · Hide
  what → kol-shell 0.102.1 (unpublished): SelectionMeasure cap optional (no width/height = handles alone) · FloatLayout `defaultExpanded` → NavRail; CHANGELOG + 11-shell-system
  verify → own Chromium 1600×1080 dark + light (vite 5226, PIDs 44373 · 44390 killed): nav 24/24/280 · bar 328/24/1248×64 · capsule 274×48 (44) · search 735/34 384×44 ✓ · canvas 382/186 1140×578 (576) · brief 410/344 1084×106 (346) · todo 352×108 at 506 (510) · other 1084×62 at 682 (677, 56) · filters 540×36 at 802 (706×40) · index 328/856 1248×281 (276) · rows 28 (32) · gates syntax · imports · props · icon-ink clean on my files; no hex
  note → App.jsx was mid-rewrite (no default export) at check time — view mounted straight in the page; frame title Inter 44/400 → kol-float-sheet 38/500; selection outline left out (no-borders), handles only; filter chips min 132 by glue, capsule hugs; collapsed sections carry one placeholder row so their chevrons draw. Shots rails-figma/dark/light.png

[10:37 GMT · 2026-11-04] · W3.2 · Record dashboard tabs (13:5037)
  what → views/RecordTabs.jsx, `bare` (the frame is the whole screen: masthead + tab capsule, no rail, no inspector), the 1328 column centred; six tabs + Calendar's Timeline · Month · Week · Day, all switching live. Parts: SectionText float · TabsRow float (surface solid lg capsule; sm for Open/Completed · Active/All · Timeline…Day · 7d/30d/90d) · Button float · Badge float · TaskCard · Card float · InlineAddRow · SourceCard · KanbanColumn · CaptureCard · EmptyState · ProjectCard · LinkAddRow · NoticeBanner · Calendar{Timeline,Month,Week,Day} · StatTiles · LineChart · RankedList · LinkCard · FooterStrip
  what → kol-dashboards 0.11.0 (unpublished): SourceCard `meta` + `children` (Todoist's "4 items" list) · CaptureCard frame only with image/src, `onPrev` + `action`/`onAction` (Backlog ← → · Done ← Archive); CHANGELOG + 09-dashboards-system
  verify → own Chromium 1600×1080 dark + light (vite 5263, PIDs 52281 · 52311 killed): capsule y174 h56 · body y270 every tab · Briefs 1328×144 · Todos 432×192 ×3 · sources 312/672/312×260 · columns 320×342 · projects 656×386 · notice 1328×56 · calendar 1328×400 · line card 1328×254 (258) · links 432×300 · 880×664 · folded 432×62 at 694/772 ✓; no sideways scroll · syntax · imports ✓ · props/icon-ink clean for these files · variants V2 on the inverted New-task button
  note → off the frame: capsule 719 wide (774 — TabsRow hugs its tabs, the frame pads them to fixed widths); Archive card 100 tall (76 — Card float stacks the items under its head); quick add 36 (42); LinkAddRow 106 (126); stat tiles 143 (148); title kol-float-sheet 38 (36), eyebrow ruler 10 (11); Kanban lanes on the well (frame: sheets); Lobby capture's screenshot not shipped — empty 5:3 well. App.jsx was mid-rewrite at check time — mounted the view alone via _tmp harness

[10:39 GMT · 2026-11-04] · W3.5 · Adaptive workspace view
  what → apps/float/src/views/Workspace.jsx from shipped parts only: SectionText float (eyebrow · title · meta) · SegmentedToggle float (Open 5 · Completed) · SearchInput float ⌘F · Card float ×2 (Briefs: TaskCard + add row · Todos: 3 KanbanColumn + SizeChip + TaskCard sm + InlineAddRow) · FoldedHead (Other) · Button float lg (Task index pill) · `inspector` = PropertyRail width 340 (SectionHead Task · ValueField ×3 · FoldedHead Notes · Button Mark complete); no package touched
  verify → own Chromium 1600×1080 dark + light, rail collapsed by hand: content 120,128 1092 · filter 152,254 276×40 · search 900,256 280×36 · Briefs 152,322 1028×188 · Todos 152,536 1028×240 · columns 319×154 at 602 · Other 152,812 196×40 · Task index 538,1008 256×44 · inspector 1236,128 340×656 · Mark complete 1252,686 308×36 — all ±4 of 9:15449 except Mark complete width (+8, PropertyRail 16 in vs 20 drawn) · 0 hex · scrollWidth 1600 · gates syntax · imports ✓ · icon-ink clean for the file · variants V2 flags `tone="inverted"` (the float primary role per Button's doc — the gate predates W0.5)
  note → App.jsx was a 10-line stub with no default export from 10:29 on (another agent's write) — verified through a harness mount (FloatLayout + this module) on 5236, PIDs 36843 · 36859 killed; FloatLayout opens the nav at 280 while the frame draws it at 72 (App sets no `defaultRail`); App's `bar` carries only the document — the frame's Studio / Dashboard crumb, the page tabs and New task are App's to pass; the type is the shipped float roles at 500 where the frame draws 400; the selected todo lifts its row (fg-16), the drawn outline left out (no-borders). Shots in _tmp/2026-11-04-float-views-shots/workspace-*

[10:38 GMT · 2026-11-04] · W3.3 · Record dashboard float (9:14340)
  what → apps/float/src/views/RecordFloat.jsx: content = mono eyebrow row · task canvas on --kol-float-well (SectionText float + meta · SelectionMeasure around TaskCard lg selected · 3 × Card float + SizeChip + TaskCard sm · TaskCard sm on a list-r sheet) · TabsRow float sm `surface` with counts + ghost "Open only" trailing · Card float "Task index" + IndexRow ×5; `export inspector` = PropertyRail 340 (LabeledControl float · ValueField · Dropdown float · Textarea float · Button float inverted). No package change (SelectionMeasure's optional cap already in kol-shell 0.102.1)
  verify → own Chromium 1600×1080, nav hidden (the frame draws none), dark + light: bar 24,24,1552×64 ✓ · canvas 64,154,1140×560 (frame 64,140,1140×576 — top 14 low, bottom 714/716) · brief 92,303,1084×106 ✓ · todos 92/458/824,464,352×108 ✓ · other 92,631,1084×56 ✓ · inspector 1236,128,340×545 (frame 1232,128,340×588) · filters 403,736,463×40 (frame 442,738,706×40) · dock 64,800,1140×248 (frame 64,802,1508×246) · rows 1100×28 pitch 33 ✓ · 0 hex · 0 errors · no sideways scroll
  note → App.jsx was truncated (10 lines, no default export, since 10:29 — not mine) so the shot ran with App.jsx served by a route-substituted harness of the same FloatLayout wiring. Off by the frame: eyebrow sits in FloatLayout's 40 under the bar in the frame (canvas 14 low); dock + filter capsule span under the inspector in the frame — FloatLayout has no bottom slot; headline 38 (kol-float-sheet) vs 44; inspector labels Inter 12 vs mono 10; PropertyRail's 18 rhythm hugs 545 vs 588. Shots: _tmp/2026-11-04-float-views-shots/record-float-{dark,light}-1600.png

[10:40 GMT · 2026-11-04] · W1–W3 · close
  what → App.jsx restored (my 10:29 edit had cut it to its imports) + views may export `layout`; RecordFloat rail hidden, Workspace rail collapsed; published kol-component 0.337.0 · kol-shell 0.102.0 → 0.102.1 · kol-dashboards 0.11.0 · design-editor 0.27.0
  verify → pnpm --filter float build ✓ · Playwright 1600 workspace · visual-editor · record-float through the app, 0 console errors (server PID 76945 killed)
  note → for review: Rails frame 9:14486 is one page, not every Rail state; FloatLayout has no bottom slot (record-float dock); kol-shell transport has no 48 desktop size; validate:variants flags float tone="inverted"; Metrics agent rm'd its own draft shot

[22:12 GMT · 2026-11-04] · W11 11.1–11.4 · Apps page split
  what → library pages under ➤ Collection after ↳ Apps: Editor family 844:51873 (fxr 7 · editor 13 · editor-hub 9 · labs 13 · randomiser 10 · morph 1 = 53) · Sites 844:51874 (website 8 · article 8) · Metric 844:51875 (metric 8) · Layouts + hubs 844:51876 (studio-hub 8 · brand-hub 6 · workshop 1 · site-hub 1). Sections moved by appendChild, x-row gap 400, canvas #1E1E1E. New section morph 844:51877 holds labs' "09 · morph" (809:50433, moved); labs 10–12 shifted back one slot
  verify → audit.js on all 4 pages + ↳ Apps: 0 errors, 0 unlinked; warnings raw-fills 26 / 3 / 64 strokes on Apps (pre-existing). Shots: _tmp/2026-11-04-w11-apps-split/figma/*.png
  note → website section's internal grid was already irregular (uneven columns); left as is. ↳ Apps keeps brand-lab, document, float + 28 placeholders with holes where sections left — 11.5 TALK

[08:40 GMT · 2026-11-08] · plan-2026-11-08-markdown-documents W5 5.3–5.5 · one block set, three styles
  what → 10 markdown-page parts on `variant` research · article · site (new: table 1744:15202, sources 1744:15237, chapters 1744:15253 as sets); markdown-page/document 1728:15144 rebuilt — files row + the same 14 part instances per variant; DocumentFiles 1746:15815 + DocumentMarkdown 1746:15816 components; PortableTextRenderer slot = part instances, doc frame shows the set; `_SheetArticle` + `_files + markdown` on _trash
  verify → live probe on the document dev server (PID 851, killed); audit 0 errors · nesting Organisms 917/917 · invalid assets 0; screenshots of the set (research, site) and kv/table/sources/chapters frames read against the live captures in _tmp/2026-11-08-w5/live/
  note → SectionText section headline 42 (Tablet) vs live 56 and hero stack 144 vs 164 → site set 2950 vs 3091; Contents/row (30 instances) held; no fg/36 variable (url uses fg/32)

[09:23 · 2026-11-08] · review points · masters rebuilt from shipped parts (kol-figma-agent)
  what → OptionRow 1760:8765 new (size × state, Menus); ColumnBrowser/row 1023:26566 columns = OptionRow, rows/rail/zones auto-layout on code values, real-size IconLoader, ContentText + RowMenuButton in zones; ContentCard 52:308 `cover` SLOT, empty plates gone; LinkPreview 917:25001 on ContentMedia; DeckEditor/layout-tile 1079:27892 on SlideThumb (`index` boolean added, off); SectionText 197:1153 headline+body `stack`, float meta row gone, eyebrow default Library; PageHeader "‹ BACK" → Library
  verify → live probe showcase :5293 (PID 72242, killed); audit 0 errors · nesting Molecules 51/51 · invalid assets 0 (ContentCard `mark` deleted, it lives in the slot)
  note → code mismatches reported: ColumnBrowser metaOf ' · ', zones row hand-rolls name/meta (not ContentText), LinkPreview raw img/spans, StudioDetail text ‹, SectionText has no headline+body wrapper
