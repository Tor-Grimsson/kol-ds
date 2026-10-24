# Playbook — The canvas family and the studio hub

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** W2, W3 and W4 of `plan-2026-10-23-canvas-family-and-studio-hub.md` — CanvasStudio and CanvasEditor on one engine; apps/studio (the canvas alone) and apps/studio-hub (the full Studio shape, his review surface); his eleven review points. No publish; stop for his review.

**Standing rules (non-negotiable):**
- no bullets outside a list — no middle-dot strings in UI text or messages
- reference monitor, not mirror
- the review surface is apps/studio-hub only; apps/hub stays as it is
- nothing published; nothing to fxr, mirror, monitor before his sign-off

---
## Entries

[16:52 CEST · 2026-10-23] · setup · playbook created
  what → initialised the live playbook   why → his go on W1–W3 + W4 (/kol-goal), the review follows

[17:06 · W3/W4 · setup
  what → three forks spawned: W2 canvas family (Canvas.jsx, CanvasStudio, apps/rack + apps/mixer), W4 card contract + info rail (ContentText, AppItem, HubHome, consumers), W4 ⌘K + S expanded + Media/Sign in rows (CommandOverlay, AppHub, AppStudio)
  what → kol-component 0.296.0, kol-shell 0.77.0 headings; apps/studio → apps/studio-hub (scripts --host, build list, vercel, render ROUTES, /apps entry); new apps/studio scaffold on 5204; lockfile re-linked offline
  what → studio-hub: manifest + Apple meta + dark default when nothing is stored; media-fixture dependency
  note → from here delegations go to Opus as fresh agents (his ask: cost); the two running forks finish on this model

[17:06 · 3.4 · packages/shell/src/StudioCreate.jsx
  what → StudioCreate: monitor's CreatePage made once — fixed page on CASE, scrolling on PARTS; editable masthead; the parts catalog; CanvasStudio under the whole-page grid (gridRef); zoom readout; caseControls, caseActions, caseLink, onPlace, onPartPointerDown; `canvas` render prop for a consumer with its own viewport (RackViewport)
  what → AppStudio pages take `sub` (a section) and resolve nested paths; CatalogPage `mode="fixed"` (the catalog scrolls, the action row is the foot)
  verify → pending the canvas fork (CanvasStudio import)

[17:06 · 3.2 · apps/studio-hub/src/App.jsx
  what → the full shape on dummy data: Home (contract, real rack previews, tags, details), Library FILES ⇄ PARTS, Create (StudioCreate, dummy case, add rows, insert), Studio (CanvasStudio full-bleed), the Chrome section (enter, Labs folds), Home B (fixed Home), Media (fixture), Sign in (dummy), Settings; touch doors on Home
  verify → pending: HubHome `fixed` + `touch` (after the card fork), CanvasStudio API (after the canvas fork)

[17:08 · 3.4 · classification + previews/StudioCreate.jsx · 11-shell-system · 16-app-anatomy · shell CHANGELOG
  what → StudioCreate (organism) + StudioCreateAction (member-of) registered; preview on module images; docs rows; 0.77.0 bullets
  verify → roster + preview-files clean for shell; open violations are the canvas fork's (CanvasEditor, CanvasStudio, useCanvasViewport)
  note → model switched to Opus mid-run on his ask

[17:08 · 3.3 · apps/rack-hub/src/pages/HomePage.jsx
  what → rack-hub Home on HubHome: presets as files (real patch previews, tags, counts as details), Type exclusive + Tags groups, New Rack the action; no verbs (read-only presets); no EMPTY_CASE card, no no-card-hover CSS, no fit compact
  note → rack-hub keeps its AppShell layout; AppStudio for its shell waits on CanvasStudio (RackViewport is the canvas fork's)

[17:22 · W2 · canvas fork landed
  what → CanvasStudio + useCanvasViewport + CANVAS_KEYS; Canvas → CanvasEditor, three aliases on the ledger; 07-canvas-family doc; apps/rack and apps/mixer on CanvasStudio
  verify → rack and mixer at 1440 + 390: Space-drag, wheel, ⌘-wheel, ⌘0, L, G, F identical numbers; 0 console errors ✓
  note → apps/mixer's InfiniteCanvas.jsx (mixer-hub Create, FloatingFrame) is a third hand copy, still its own

[17:22 · W4 · card fork landed
  what → app meta line out (0.292.0 reversed), template + summary out, three-column list, file info rail (name, tags, details, verbs), derived Tags group
  verify → apps/hub: 12 cards, rows 72 with 72 thumbs, 3 per line, tag edited in the rail filters at once ✓

[17:22 · 4.10 / 4.12 · packages/shell/src/HubHome.jsx
  what → HubHome `fixed` (CatalogPage mode fixed) and `touch` (doors, recent rows, All files) for his ruling

[17:22 · T9 · gates + Playwright on studio-hub
  verify → pnpm validate 31/32 (standing pair); render clean on studio-hub, studio, rack-hub, mixer-hub, editor-hub, hub ✓
  verify → dark default, manifest served, 12 cards with real images, list 3 per line at 72, rail opens, ⌘K Kraftwerk → /studio, S Collapse all, Create canvas + INSERT lands, Home B no page scroll with New at the foot, Chrome enters and Labs folds, Media modal opens, touch Home at 390, no sideways scroll, 0 errors ✓
  note → plate heights 77 and 93 at 1440: date and size wrap in a 144px text column with the 24px group gap (0.295.0's rule); a design call left for him
  note → the info rail locks page scroll while open (Rail's over mode)

──────────── MILESTONE: canvas family and studio hub, W2 W3 W4 ──────────── [17:22]
  built: everything in W2–W4 · nothing published · review surface: pnpm studio-hub

[19:03 · 0.1 · packages/shell/src/AppHub.jsx · 11-shell-system · shell CHANGELOG
  what → AppHub wraps its tree in ModalProvider (HubFrame inside); consumer providers above still work
  verify → studio-hub 1440: trash on a card opens the DS dialog (Delete “70s”?, Cancel, Delete), 0 console warnings ✓

[19:03 · 1.1 · apps/studio-hub/src/App.jsx
  what → cover(seed): SVG data URI, dark ground + gradient wash, triangles, line grid, neon strokes or rings, hue and layout from the seed; files and walkthrough off the rack previews; parts keep module fronts
  verify → Home SAVED, Library FILES, Home B at 1440: 13 covers, 13 distinct, 0 /previews/ srcs, 1 placeholder ✓

[19:06 · 2.1 · packages/component/src/organisms/AppItemMenuProvider.jsx (new) · molecules/AppItem.jsx · index.js · 06-content-card-system · 01-inventory · 16-app-anatomy · component CHANGELOG
  what → file rail on SettingsPanel rail + SettingsSections divided (Name, Tags, Details) + SettingsFooter of three IconFrames; provider moved to organisms (taxonomy), MenuCtx/useAsk stay in the molecule
  verify → file rail and Display settings drawer: both 380 wide, pad 24, no border, no shadow, title helper-14 at y 30, × 26 at y 24, foot controls 26, scrim 0.48 black; tag add, rename, Delete → DS confirm; taxonomy clean ✓

[19:09 · 3.1 · packages/shell/src/CatalogGrid.jsx (new) · CatalogPage.jsx · StudioCreate.jsx · index.js · classification · 11-shell-system · shell CHANGELOG · apps/studio-hub
  what → CatalogGrid (measured tracks, .kol-catalog-grid, list grid); CatalogPage + StudioCreate draw on it; parts = catalog card/row, Insert in actions, partCard zoom false
  verify → apps/catalog before/after JSON identical at 1440 and 390 (grid 6x204, list 4x330); Create vs Library PARTS: 1440 grid 6/row 196x277 both, list 4/row 318x38 both, 0 kol-media-zoom, Insert in plate, no INSERT strip; 390 Create list 1/row 350x38 ✓

[19:10 · 4.1 · packages/component/src/organisms/NavRail.jsx · packages/shell/src/AppStudio.jsx · apps/studio-hub · 11-shell-system · 16-app-anatomy · both CHANGELOGs
  what → entered = path stack; a row whose rows carry sub enters, a leaf section folds as L2; Back pops one level; AppStudio railRow recursive; Effects carries Blur, Glow
  verify → 1440 rail open: Chrome → Editor, Labs, Randomiser, Morph; Labs → Effects, Generate, Vector, Composition at L1 (20px glyph at x14, 32 tall, oq-96); Effects folds Blur, Glow at L2 (12px at x30, 20 tall, oq-64); Back Labs → Chrome → root ✓

[19:13 · 5.1 + 5.2 · packages/shell/src/AppHub.jsx · apps/studio-hub · 11-shell-system · shell CHANGELOG
  what → Media row → MediaLibrary variant picker; Sign in → useModal prompt (fxr copy) → onPress(password), signed in → confirm → onPress(null)
  verify → 1440: Media opens the column browser over the fixture with Cancel and Use; Cancel closes; README.md + Use closes through onSelect; Sign in → DS prompt → password → row reads Signed in with cloud; press → DS confirm → Sign out → Sign in ✓

[19:18 · 6.1 + 6.2 + 6.3 · AppHub.jsx · HubSettings.jsx · SettingsScaffold.jsx · SettingsShortcuts.jsx · SettingsLinks.jsx · LabeledControl.jsx · apps/studio-hub + 5 hub apps opted into page+filters · 11-shell-system · 16-app-anatomy · both CHANGELOGs
  what → ⌘K Shortcuts folds open:true; labels 2–3 words, inline label nowrap truncate; settings tiers: drawer default (sentinel row + , key + SettingsPanel), page (two columns, no bar), filters (as was); studio-hub Review section flips page and filters live
  verify → ⌘K: Navigate, Canvas, Help keys all on open, footer Collapse all; 0 wrapping helper labels in drawer, page and filters tiers at 1440 and 390; drawer tier: row and , open the drawer, /settings has no page; page tier at 1440x900 docScroll 0, no inner scroller; filters tier shows PREFERENCES bar ✓

[19:27 · 7.1 · packages/component/src/hooks/railRow.js (new) · NavRail.jsx · TabsRow.jsx · packages/shell/src/AppShell.jsx · apps/studio-hub
  what → RAIL_ROW constant read by NavRail and the phone tab; AppShell barHiddenOn; studio-hub Phone nav row (localStorage) feeds shell.touch, bar hidden on /studio and /chrome
  verify → 390: bar labels kol-helper-12 uppercase, 20px glyph, oq-96 active, oq-64 rest; switched to drawer → hamburger, no bar, stored; /studio no bar, bar-h 0, canvas 844 of 844 ✓

[19:27 · 7.2 · packages/shell/src/CatalogPage.jsx · HubHome.jsx · apps/studio-hub
  what → CatalogPage phoneLayout (list below md, no strip) + lead slot; HubHome touch = doors only, 2x2 Button lg above the rows; old touch page gone; Quick links row
  verify → 390: Home and Library rows only, no grid, no LIST/GRID strip, filter header two lines (ALL FILES row, RECENT SAVED row); quick links on → Editor, Labs, Randomiser, Morph above the rows ✓

[19:27 · 7.3 · packages/shell/src/StudioCreate.jsx
  what → masthead fields on SECTION_TEXT_LEVELS.app title + lede, height 1lh, text-inherit
  verify → Create = Library: 1440 title 60/60 at y48, lede 19/26 at y120; 390 title 46/46 at y20, lede 19/26 at y78 ✓

[19:27 · 7.4 · packages/theme/kol-components-shell.css
  what → 100dvh after the 100vh fallback on .kol-shell-page and --fixed
  verify → 390 isMobile Home B: docScroll 0 with 14 files and with 1 (search), rows scroll 976/401, New bottom 768 above bar top 788 both ✓

[19:27 · 7.5 · scripts/validate-helper-text.mjs (new) · validate-all.mjs · package.json · 44 sentences helper→mono across packages, apps, showcase · 5 package CHANGELOGs Unreleased · 03-typography · 11-shell-system
  what → H1/H2 gate with --self-test (9 cases, the old placeholder line among them); studio-hub Placeholder and the Case's empty line on kol-mono-12
  verify → self-test 9/9; gate fired 44 before the sweep, clean after (1086 files) ✓

──────────── MILESTONE: studio-hub review 2, W0 to W7 ──────────── [19:34]
  built: every phase · gates 32/33 (standing pair) · render clean · nothing published

[20:01] · review 3 · NavRail.jsx · CatalogPage.jsx · HubHome.jsx · StudioCreate.jsx · studio-hub
  what → rail: fold rows are full rows, 38px per level (child glyph on the parent's label column); enter enters every section, entered list full rows; L2 row retired
  what → app and catalog presets default mode fixed (capped and shelf scroll); HubHome fixed prop out; Home B page retired; parts on the app card, Insert the plate action; studio-hub rail-sections switch
  what → settings rail: footer and close at oq-80 to oq-96 (.kol-ink-step, dd triggers excluded); CloseButton hover and frame
  verify → enter: Labs, Effects, Blur all 20px glyph at x14, label x52 (fxr image 6) ✓; fold: Chrome 14/52, Labs 52, Effects 90, Blur 128 ✓; Home, Library, Create no page scroll at 1440 and 390 ✓; parts 160×209 plate 49 in Library and Create, 6 per row, plus not cog ✓; validate 32/33 (standing pair), render clean ✓

[20:10] · review 4, phone · TabsRow.jsx · PhoneNav.jsx · AppShell.jsx · AppHub.jsx · HubHome.jsx · CatalogPage.jsx · StudioCreate.jsx · MediaLibraryPages.jsx · studio-hub
  what → bar icons only at 24 (labels as aria); bar stays on Studio; Create parts rows only below md; Home's New and Walkthrough head the More sheet, foot row hidden below md with the bar; MediaLibrary default thumbs and folder counts
  verify → 390: bar 5 icons 24px no text; More = New, Walkthrough, then the rest; Walkthrough opens the tour; bar on /studio; Create 48 rows, no GRID; media counts per folder, 4 thumbs in reykjavik; 0 errors ✓; validate 32/33, render clean on 7 apps ✓

[20:47] · review 5, phone · TabsRow.jsx · PhoneNav.jsx · AppShell.jsx · AppHub.jsx · AppItemMenuProvider.jsx · SettingsPanel.jsx · AppItem.jsx · ContentCard/Row.jsx · HubHome.jsx · StudioCreate.jsx · canvasViewport.js · CanvasStudio.jsx · MediaLibrary.jsx · MediaLibraryPages.jsx · studio-hub
  what → bar pill shape (touch="pill", studio-hub default); Sentence case on the review dropdowns; file rail read mode + header pencil → edit, one row per field, a note (HubHome note/onNote); Create's pencil bare (IconFrame nav); CanvasStudio fit (height, ⌘0 → fit) on the phone in Studio only (Create reverted on his word); picker title display voice + opens at the title root with bucket rows; Create's fixed bottom bar lifted above the phone bar (was under it)
  verify → 390: pill 294×56 centred 16 off the edge, 28px glyphs, active oq-08, last row clears it, More at 80; rail read NAME/TAGS/NOTE/DETAILS, edit = Name input, add-tag input, Note textarea, note commits on blur; dropdowns Enter/Fold, Bar/Pill/Drawer; Studio fit zoom 2 (clamped) with the bar; Create pencil = the filter's class, case fit; picker h1 display, root = All files › R2 · kol-media, B2 · website, counts inside ✓ · 1440: foot row New + Walkthrough, rail pencil beside ×, Studio zoom 1 ✓ · 0 errors
  parked → his round action button idea (apps/catalog VariantsButton = Button inverted/full/lg) → plan § 7.6 TALK

[21:06] · the fold · TabsRow.jsx · PhoneNav.jsx
  what → his call: on More the whole bar folds into a round × at its right end (pill → 56 circle, bar → × in More's slot), the sheet hugs its words (220 floor) right-aligned over the ×; the ×, the scrim or a pick unfolds. Pill shadow off (his word), pill floats over the page (no pad; scroll regions and Create's foot clear it by --kol-shell-bar-clear), Create's case fit reverted (Studio only)
  verify → 390 pill: closed 48–342, open 286–342 with the × at 293–335, sheet 122–342 × 220 ending 8 above; bar: × in the last slot, sheet right 12; close and pick both unfold, 0 errors ✓

[21:19] · the sheet beside the ×, the phone picker · PhoneNav.jsx · TabsRow.jsx · kol-components-shell.css · MediaLibrary.jsx · MediaLibraryPages.jsx
  what → sheet to the LEFT of the folded ×, bottoms on one line (his reference), pill's ground + hairline, 24px rounding, 44px rows, 22px glyphs, mono-16; × without the inner ring. Picker on a phone: no foot row, × on the title row (onHeaderClose), a tap selects, the row menu leads with Insert (onInsert / canInsert); desktop keeps Cancel and Use
  verify → 390: sheet 54–274 beside the × at 286–342, bottoms 828; picker foot [], header Close, row selected, menu = Insert, Quick Look, Copy URL, Download; Insert closes the picker; 0 errors ✓

[21:25] · phone picker scroll · MediaLibrary.jsx
  what → the browse page inside the phone card takes the remaining height and scrolls (min-h-0 flex-1 overflow-y-auto); the stack hugs its rows, so the clipping card had no scroller
  verify → 390×500 at the bucket root: scroller 464/661, wheel → scrollTop 197 ✓

[21:41] · the masthead button · HubHome.jsx · MoreSheet.jsx (new) · PhoneNav.jsx · CatalogPage.jsx · kol-components-shell.css · TabsRow.jsx
  what → New and Walkthrough in the catalog's round Button (PageHeader actions slot) opening MoreRows in .kol-more-sheet — one rows list for the phone More and this; foot row retired; fixed catalog region bleeds to the page's edge (both widths); fold 300ms; phone picker no bottom pad
  then → button on the title's row (SectionText actionsPlacement head, centred), sheet to its left (left-start, 12 gap); 1440: title 48–108, button 58–98, sheet 1120–1340 × 58–166 ✓

[21:48] · the fold fades · CatalogPage.jsx (ScrollRegion)
  what → fixed-mode scroll region in a relative box with two 24px fades from --kol-shell-page-wash; top on once scrollTop > 0, bottom on while more below; 150ms opacity; ResizeObserver re-reads
  verify → 1440 Library: rest top 0 / bottom 1, scrolled top 1 / bottom 0 at the end ✓

[21:59] · the hub pass · editor-hub · mixer-hub · rack-hub
  found → rack-hub did not boot: its stage's usePanZoom imported apps/rack's retired useTouchGestures (quarantined with the canvas family); fixed with the stage's own copy (apps/rack-hub/src/stage/useTouchGestures.js) until the stage moves to the engine (parked W). editor-hub at 390: the Home button sat under the drawer trigger (variants gate); stepped left (max-md:mr-11)
  verify → editor-hub 1440: Home button, sheet New File + Walkthrough, grid to the edge; 390: button 286–326 clear of the trigger 342–378. mixer-hub 390: bar, fold, sheet rows ✓. rack-hub 1440: Monitor Home 12 cards, New Rack + Walkthrough, /stage renders ✓. 0 page errors

[22:21] · the three hubs carry studio-hub · editor-hub · mixer-hub · rack-hub · studio-hub/src/covers.js (new)
  his words → "missing elements on all: editor hub has no cards, every one has missing login and media, shortcuts are missing, command k is missing, mirror has way too many tabs (solved in kol-mirror since), labs has wrong rail behaviour"
  editor-hub → twelve seed presets when the library is empty (studio-hub's covers, shared from covers.js); Media (fixture) + Sign in rows; Labs' categories as its `sub` so the rail enters Labs with full rows (was a flat second list)
  mixer-hub → kol-mirror's current rail: Library (Modules · Patches, module pages under it), Create, Studio (float), Dev (Tape, Fronts, Icons), Settings — Studio B, Expression, the Mixer sheet and the three sketchbook rows gone; Media + Sign in; twelve seed patches when none saved; touch drawer (mirror's ruling)
  rack-hub → rebuilt on AppStudio (the old AppShell layout in _tmp/2026-10-23-rack-hub-appstudio/): Home (useHome), Library with module and patch pages, Create, Rack, Stage on its own RackProvider, Settings (content + About/Repo from APP), Media + Sign in, the Hub's S / ⌘K / ⌥-digits; RackRail kept as railComponent
  verify → 1440 on all three: 12 cards, rail … MEDIA, SIGN IN, SETTINGS; Actions sheet; S sheet; ⌘K with Files/Pages/Shortcuts; Media opens the picker; Sign in prompts; Settings; every rail page renders, no overlay. 390: drawer on editor-hub, mixer-hub, rack-hub (trigger, Home button clear of it); editor-hub /labs → pick Effects → Labs enters: Effects, Generative, Vector, Composition, Modulation as full rows. 0 page errors

[23:25] · hubs parity (plan-2026-10-23-hubs-parity) · AppStudio.jsx · editor-hub · mixer-hub · rack-hub · apps/rack VideoModulo · docs/operations/07-apps-tier/05-studio-parity.md · parity.mjs
  his words → "3 purple? same dev favicon as the repos" · "new file in library in fxr, wrong card type" · "monitor new file in library, wrong card type" · "not hall of mirrors, mirror" · "WRONG card preset button" · "none but studio-hub uses the agreed siderail" · "mirror: different user login icon, the only one with a dev page" · "still no chrome tab in FXR" · "the rail, do you make a preset?" · "MULTIPLE INSTANCES of CATALOG and CONTENTCARDS" · "SETTINGS: tabs"
  siblings → read live + their agents asked (kol-fxr-20, kol-mirror-af, kol-monitor-c7 answered with file:line); the per-hub column is in the checklist doc
  AppStudio → the rail preset: touch pill, railSections enter, barHiddenOn = Use + create/pages with bar:false; no hub configures the rail
  editor-hub → onto AppStudio: FXR, X on #F2D24B, fxr's favicon; rail Library · Chrome (Editor, Labs, Randomiser; Labs' categories under Labs on /labs — Chrome enters → Labs enters → categories, verified); Library = the Hub's CatalogPage preset app over Home's files, no foot; fxr's LibraryPage to _tmp/2026-10-23-editor-hub-appstudio/
  mixer-hub → Mirror, W on #49A0A2, mirror's favicon; no Dev row; the Hub's foot glyphs (mirror's user/image/settings/cloud svgs not registered); Library PATCHES (Home's files) · MODULES (desk modules as part cards), no Import; MixerPage/CatalogLibrary/LibraryPage to _tmp/2026-10-23-mixer-hub-library/ (PatchThumb kept in components/)
  rack-hub → Monitor, M on #CE4646, monitor's favicon; the DS rail slot (RailSlotProvider/useRailSlot from kol-shell, as kol-monitor) — RackRail fork and the rack's own useRailSlot to _tmp/2026-10-23-rack-hub-appstudio/; Library PATCHES (the presets as files) · MODULES (part cards), no New Rack, the old LibraryPage to _tmp; Settings page tier with tabs and the OPTIONS/SHORTCUTS split; Create and Stage own the phone's bottom edge (bar: false)
  verify → parity.mjs: studio-hub 30/30 (title set to Studio; drawer tier counted), editor-hub 28/28, mixer-hub 29/29, rack-hub 30/30 at 1440 and 390; screenshot pairs compared (Home, Library FILES/PARTS, Settings, phone More); gates 32/33, render clean

[00:38] · plan-2026-10-24-rail-presets-and-settings · NavRail.jsx · AppShell.jsx · AppHub.jsx · AppStudio.jsx · TabsRow.jsx · PhoneNav.jsx · AppItem.jsx · ContentCard/Row · HubHome.jsx · AppItemMenuProvider.jsx · kol-workshop shell/index.js · FXR · Mirror · Monitor · showcase previews/NavRail.jsx · sets/settings.jsx · docs 17-settings.md · 05-studio-parity.md
  his rulings → the rail has presets (app = studio, site = brand, workshop = workshop); settings is THE RAIL, tabs inside it when big; FXR's files are the chrome they were made with, a MARK on the card not a filter; Labs: Chrome enters, Labs enters, Effects EXPANDS; the words are ENTER/EXIT and EXPAND/COLLAPSE; FXR, Mirror, Monitor by name
  built → NavRail preset + RAIL_PRESETS + registerRailPreset (kol-workshop registers ShellSidebar); one rule: rows that hold sections enter, leaf rows expand; sections="expand" (fold aliased); AppShell rail prop, AppHub rail="app" + the preset's phone; AppStudio keeps barHiddenOn only; TabsRow collapsed/onExpand; the settings rail draws content + tabs; FXR/Mirror/Monitor settings on the rail (Monitor: Settings, Shortcuts, About, Repo; Mirror: Performance); HubHome `mark` → the cover's other corner + the rail (FXR: Editor, Labs, Randomiser, Morph); NavRail preview shows the three presets; a Settings set + composition doc; checklist and parity.mjs corrected; Mirror's Create bar: false
  verify → parity: studio-hub 30/30, FXR 29/29 (rail.labs: Chrome → Labs entered, Effects expanded to Halftone…Pattern), Mirror 30/30 (rail tabs Settings · Performance), Monitor 31/31 (rail tabs Settings · Shortcuts · About · Repo); render clean on the seven apps; 0 page errors
