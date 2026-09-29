# Playbook — apps review (plan-2026-09-29-apps-review)

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** execute `plan-2026-09-29-apps-review.md` phases 1–5 (items 1–25); gates + validate:render clean; bumped + changelogged, not published.

**Standing rules (non-negotiable):**
- never delete — quarantine to `_tmp/<date>-<what>/`
- no git; no publish
- a complaint made twice gets a check, not only a fix
- tool in `-hub` is the same tool as alone

---
## Entries

[17:29 GMT · 2026-09-29] · setup · playbook created
  what → initialised the live playbook   why → user go on all phases (/kol-goal + /playbook)

[17:32 GMT · 2026-09-29] · P1/T1 · packages/component/src/atoms/Button.jsx:84
  what → unknown variant stamps nothing (inherits tone → primary) + dev warn   why → a typo shipped inverted
  before → unknown → kol-btn-secondary     after → unknown → '' 
  note → unset-variant = inherit tone is the 2026-09-03 ruling, kept (plan T1 corrected)

[17:32 GMT · 2026-09-29] · P1/T2 · 7 Button sites + 6 showcase demos
  what → variant="secondary" dropped (Modal, ErrorBoundary, MediaLibraryPages edit, MediaLibrary copy, DocumentEditor save, DeckEditor save, PrintBuyButton; demos command-palette, ViewToggle, DocumentEditor, useModal×3)
  note → allowlisted with reason: 5 site-hero/section second CTAs

[17:32 GMT · 2026-09-29] · P1/T3 · SettingsPanel.jsx:200 SettingsMulti
  what → variant passed through like SettingsChoice   before → hard-coded primary   after → inherits kol-tone-sunken

[17:32 GMT · 2026-09-29] · P1/T4 · scripts/validate-variants.mjs · scripts/validate-control-type.mjs (new)
  what → V1 covers Button (KNOWN list) · V2 no inverted Button outside allowlist · C1 no type class on DS controls
  also → SearchInput square {sm:28,lg:36} → ladder {xs:22,sm:26,md:32,lg:40} · DocumentEditor Textarea md+kol-mono-12 → sm
  verify → validate ✓ 30/30

[17:38 GMT · 2026-09-29] · P1/T5 · scripts/validate-render.mjs (new) · pnpm validate:render
  what → playwright (root devDep) serves each app on 5290+, 1440 + 390: R1 row height · R2 overlap (box intersection) · R3 tone siblings
  found → media-shell phone: hamburger on the gear + on Assets (→ T16) · curves phone: X/Y sliders' 44px touch boxes overlapped
  fixed → EnvelopeGenerator ZoomRow className="h-6" dropped (it pinned the coarse-pointer 44px row back to 24)
  note → ALLOWED (printed each run): editor SwatchStack pair · editor @phone (no phone layout, parked)

[17:47 GMT · 2026-09-29] · P2/T7 · ShortcutsOverlay.jsx · LabeledControl.jsx
  what → sheet capped to the window width · labelWidth="auto" rows stack below sm (label, value under it)
  why → combos are sentences; nowrap pushed the sheet past both phone edges, labels showed as "C"
  verify → 390 screenshot ✓ (all four auto-label users get it: overlay, SettingsShortcuts, workshop keys + drawer)

[17:47 GMT · 2026-09-29] · P2/T8 · utilities/mediaSearch.js (new) · MediaLibraryPages ×3 · MediaLibrary ×1
  what → four .includes(q) → filterMedia / rankMedia on kol-search (component now depends on kol-search)
  verify → palette: logo ✓ · kind:image ✓ · md -readme ✓ · "brand" (tag) ✓

[17:47 GMT · 2026-09-29] · P2/T9 · tool.jsx · MediaLibraryExplorer · MediaLibraryPages
  what → phoneTabs off in the fixture (prop + MobileTabBar kept, use case in JSDoc) · File formats (K) in the phone ··· menu

[17:47 GMT · 2026-09-29] · P2/T11 · MenuItem.jsx size prop · MenuTop.jsx
  what → MenuItem trigger on the ladder (size, default md = the old h-8) · media ··· → sm (26 = the search box) · editor frame name Input sm → md (26 among 32s)
  found → R1 now covers .kol-menu-btn; the editor bar was the second hit
  note → touch type floor (16px in a 26 box) is a design ruling → plan D5, open

[17:56 GMT · 2026-09-29] · P2/T10 · MediaLibraryPages SETTINGS_BASE.countLine
  what → count line 'auto' | 'on' | 'off' (Layout → Count line); auto = on at a desk, off on phone or touch
  verify → 1440 mouse shown ✓ · 390 touch hidden ✓ · 390 mouse hidden ✓

[17:56 GMT · 2026-09-29] · P3/T13 · apps/media-shell → apps/media-hub · apps/shell → apps/hub · new apps/shell (5186)
  what → every live ref renamed (39 files incl. docs), vercel rewrites + 301 /apps/media-shell → /apps/media-hub, pnpm hub + pnpm shell, build list
  note → hub tab title "KOL shell" → "KOL hub", app name Shell → Hub (the ruled rename)

[17:56 GMT · 2026-09-29] · P3/T14 · T15 · AppHub.jsx · apps/media-hub
  what → home + settings opt-in on AppHub (no prop → no page/row/key) · media-hub rail = Browse + Settings
  what → MediaLibraryBrowse onOpenSettings: the tool's gear hands over; HubSettings drawer dropped (theme → masthead, reset → a Data row)
  ▣ → apps/media-hub/src/Library.jsx + the old App → _tmp/2026-09-29-media-hub-library/

[17:56 GMT · 2026-09-29] · P3/T16 · PhoneNav.jsx (new) · AppShell touch="bar" · kol-components-shell.css
  what → below 768 the rail is MobileTabBar: ≤5 in the bar, else 4 + More (sheet: the rest + Settings); --kol-shell-bar-h pads the column, PageShell subtracts it
  verify → apps/shell @390: More → Nine navigates ✓ · render 12 apps clean, allowed 11 → 3 (R2 now measures the clipped box)

[18:00 GMT · 2026-09-29] · P3/T17 · utilities/masthead.js (new) · PageHeader · LibraryHeader · AppShell · AppHub · CatalogPage
  what → AppShell masthead ('display' default | 'mono') → MastheadContext; PageHeader + media's title read it; display = sans display-03, UPPERCASE role, no subtitle
  also → AppHub default touch drawer → bar (render R2: hamburger over the Hub masthead gear)
  also → PhoneNav demo + classification (roster/demos gates caught the three new exports)
  verify → validate 30/30 · render 13 apps clean, 3 allowed

[18:08 GMT · 2026-09-29] · P4/T18 · kol-notes NEW_NOTE · kol-deck NEW_DECK · apps/notes · apps/presentation · apps/notes-hub (5187) · apps/presentation-hub (5188)
  what → open on a blank editor, no name asked; first Save names + files it; New in the list opens the same; lists at #list / /notes /decks
  also → DocumentEditor savedAt null = "Not saved yet" (was "Saved" on a blank note) · DeckEditor unsaved → Save live · deck header flex-wrap (R2 at 390)
  also → render R2 learns two patterns: contained corner actions, content that can scroll clear of the floating bar
  verify → notes: type → Save → #hello-from-a-blank-page-… ✓ in list ✓ · render 15 apps / 48 views clean
[18:08 GMT · 2026-09-29] · P4/T19 · kol-notes → dependency @kolkrabbi/kol-markdown; notes.js frontmatter from the engine

[18:16 GMT · 2026-09-29] · P4/T20 · utilities/searchItems.js (new) · ContentFilters · apps/catalog (5189)
  what → ContentFilters' substring match → filterItems on kol-search (order kept) · CatalogPage alone, masthead DISPLAY | MONO switch in its header
[18:16 GMT · 2026-09-29] · P4/T21 · apps/search
  what → ⌘K ShellSearchOverlay on the same index (Enter commits to the page) · RESULTS | GRAPH · suggestions → Tag tertiary + kol-tag--data (queries render verbatim)
[18:16 GMT · 2026-09-29] · P4/T22 · kol-search tagGraph (new, selftest ✓) · kol-markdown buildTagCooccurrence → deprecated adapter · TagGraph reads kol-search
  what → graph view in apps/search (MemoryRouter: TagGraph calls useNavigate), tag click → tag:x results; graph capped to the window
  also → render R1 rows = what the eye sees (centres ±4px, gaps ≤32px) — caught the search header toggle 32 beside a 26 dropdown; fixed
  verify → render 50 views clean, 45 rows measured

[18:27 GMT · 2026-09-29] · P2/T12 · public/apps/ (icons 180·192·512 from the KDS mark + 8 manifests) · 8 tool apps' index.html
  what → display: standalone manifests + Apple meta for media · media-hub · notes · notes-hub · presentation · presentation-hub · brand · curves
[18:27 GMT · 2026-09-29] · P5/T23 · T24 · showcase/src/pages/Apps.jsx (LAYERS + APPS spec) · AppHome.jsx (new, /app/:name) · ShellChrome rail by layer
  what → /apps grouped Engine · Shell · Hub · Catalog · Tool · Fixture with the layer table on top; each app (fixtures too) has a spec home
[18:27 GMT · 2026-09-29] · P5/T25 · docs + versions
  what → 16-app-anatomy (six layers, naming, masthead, phone bar, blank editors) · 07-apps-tier INDEX · shipped-packages (+ kol-notes, kol-deck rows that were missing) · ARCHITECTURE §3 engine→engine
  bumps → component 0.229.0 · theme 0.156.0 · shell 0.59.0 · search 0.2.0 · markdown 0.1.1 · notes 0.2.0 · deck 0.2.0 · hardware 0.3.1 · workshop 0.30.1 · design-editor 0.16.1 · store 0.3.1 — changelogged, NOT published
  verify → validate 30/30 · render 16 apps / 50 views clean (3 allowed) · pnpm build ✓ (17 builds)

──────────── MILESTONE: apps review, phases 1–5 ──────────── [18:27 GMT · 2026-09-29]
  changed: ~70 files · quarantined: 2 (_tmp/2026-09-29-media-hub-library/) · build ✓ · gates 30/30 · render ✓
  open: D5 (touch type floor) · brand.<domain> sites · workshop + showcase review (next)

[18:42 GMT · 2026-09-29] · D5 · kol-base-tokens.css --kol-ctl-* · atoms + molecules pinned heights · MenuItem · SearchInput · Input
  what → touch rung: 22·26·32·40 → 32·32·36·40 on pointer: coarse; every text control 16/22 on touch; pinned heights read the tokens
  found → SearchInput/Input h-4 (utilities layer) out-ranked the theme's coarse input rule — pointer-coarse:h-[22px]
  verify → media @390 touch: search 32 · dropdown 32 · ··· 32, all 16px ✓ · render 16 apps clean · gates 30/30 · 09-sizes § Touch rung

──────────── §6c — the build list, all six phases (/kol-goal force) ──────────── [20:25 GMT · 2026-09-29]

[20:25 GMT · 2026-09-29] · 6c-1/T1 · apps/editor/src/App.jsx · design-editor core.jsx · mode.js · mobile/MobileView · MobileOverlay
  what → one rail over / · /labs · /randomiser · /core (+ /output bare); path router under the Vite base, setNavigator → pushState; /core a full load (packs register globally); phone at / → /randomiser (fxr's gate)
  found → LabsView/MobileView never saw DesignEditor's mediaClient → CDN behind a /media/ proxy nobody stood up → picked image EMPTY. setMediaClient · setMediaProxyBase · setSettingsStore now exported
  found → labs loop: a fresh <Page/> per render re-ran labs' railExtras publish → useMemo'd page element
  what → randomiser opens on Generate · Effects everywhere; Effects = media first, then the effect sheet opens itself; media kept
  also → currentView() reads the last path segment (base-mounted hosts); NavRail fold chevron sm→md (R1)
  verify → render editor clean (4 routes × 2 vp; allowances narrowed to the compositor on phone)
[20:28 GMT · 2026-09-29] · 6c-2/T2 · scripts/validate-views.mjs (new, in validate-all + validate:views) · 11-shell-system § The app tier on the shell · 07-apps-tier INDEX
  what → V1: a View/Page/Screen/Layout/Editor/Library/Explorer/Dashboard/Book/Hub/Shell/Studio export is rendered by an app or showcase file importing the package — or through a parent (fixpoint over package files; <X, m.X, ternary swaps)
  found → framework PageLayout mounted nowhere → becomes apps/brand's frame in 6c-6 (gate red until then, by order)
  doc → phone (touch bar · drawer), masthead (no default), Hub opt-ins page by page; packages without an app → the showcase review
[20:31 GMT · 2026-09-29] · 6c-3/T3 · kol-shell AppStudio.jsx (new, exported) · apps/studio (5190, new) · Apps.jsx · 16-app-anatomy § The Studio · 07-apps-tier · vercel.json · root scripts
  what → AppStudio = AppHub + Library (CatalogPage) · Create (PageHeader + editor) · Use (full-bleed, no wash) · pages · Settings; slots rename by { path, label, icon }, order fixed, mono default
  what → apps/studio: a patch workstation of placeholders (monitor the reference), hash routes
  verify → render studio clean (6 routes × 2 vp); views gate sees AppStudio mounted
[20:34 GMT · 2026-09-29] · 6c-4/T4 · apps/panels (5191, new) · Apps.jsx · 07-apps-tier · 14-design-editor-system · vercel · root scripts
  what → the editor's real AutoControls + BindDot over its real schemas (FILTERS via flatCategories · GENERATIVE_TREE presets · photo/shape/text/pattern), rail sections Effects · Generators · Inspector, leaf dropdown, tabs from paramTab, modulation-dots switch; rail form + inspector form side by side
  decision → read design-editor internals through a named 'design-editor-src/' alias (a dev app, not a consumer) rather than grow the package's public API for a lab
  seen → bool renders ToggleSwitch inline but Off/On strip label-above — the app's job is to show exactly this; left for the editor review
  verify → render panels clean (4 routes × 2 vp, 16 rows)
[20:47 GMT · 2026-09-29] · 6c-5/T5 · apps/voyager-fixture (new) · apps/fixtures (5192, new) · Apps.jsx · 07-apps-tier · vercel · root scripts
  what → VOYAGER carried from _tmp/kol-client: marks 7 · stationery 7 · deck 7 (docs/brand-assets — public had 4) · diagrams 10 · graphics 41 · mood 4 · Playfair VF ×2 (not the 86 statics); >2 MB → 1600px JPEG (rsvg-convert; resvg where libxml's 10 MB attribute cap bit) — 190 MB → 9.7 MB
  what → brand.js = kol-brand manifest shape (+ book copy, logoSources raw) · business.js = kol-client's business-data shape, invented, every link .example · fixture.test.mjs ✓
  what → apps/fixtures: dropdown media · workshop · voyager, 3 views each, hash-routed
  seen → the template deck is "Casedoc" placeholder art — noted in VOYAGER's OPEN_QUESTIONS, not repainted
  verify → render fixtures clean (7 routes × 2 vp)
[20:54 GMT · 2026-09-29] · 6c-6/T6 · apps/brand (rewritten: catalogue) · apps/brand-hub (5193, new) · media-fixture (useBrandTool quarantined) · Apps.jsx · 07-apps-tier · 16-app-anatomy · plan §5/§6c
  what → apps/brand = the building blocks on VOYAGER, 14 routes (colour · type · logo · stationery · assets) in kol-framework PageLayout (+ react-router, basename = Vite base) — clears V1's last red (PageLayout)
  what → apps/brand-hub = Brand (book /, assets /assets) on AppHub + opt-in Notes · Decks · Media tools and the Editor app, toggled in Settings (localStorage)
  quarantined → apps/media-fixture/src/brandTool.jsx → _tmp/2026-09-29-media-fixture-brand-tool/ (no consumer left); kol-brand dep dropped from media-fixture
  verify → render brand clean (12 routes × 2) · brand-hub clean (7 × 2) · views clean (25/25)
[20:59 GMT · 2026-09-29] · 6c/T7 · final pass
  fixed → roster + demos: AppStudio classified structure + NO_DEMO (AppHub's reason) · headings: 11-shell-system H2 → "App tier" (date + length rules)
  docs → shipped-packages kol-shell row + shell README piece row for AppStudio; plan §6c marked BUILT, §5 brand.<domain> answered by brand-hub
  verify → validate 31/31 · render 20 apps / 124 views clean (6 allowed, all the compositor's) · pnpm build ✓ (21 builds)
  bumps → design-editor 0.17.0 (new) · kol-shell 0.59.0 (entries added) — NOT published

──────────── MILESTONE: apps review §6c, all six phases ──────────── [20:59 GMT · 2026-09-29]
