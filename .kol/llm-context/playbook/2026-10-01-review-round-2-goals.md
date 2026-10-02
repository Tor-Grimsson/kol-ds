# Playbook — Review round 2, the approved goals

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** build what the user approved in the 2026-10-01 question round (22 items, `.active-goal-01aa05d0-….md`). Plan: `plan-2026-10-01-showcase-review-round-2.md`.

**Standing rules (non-negotiable):**
- Read before merging; a pair that turns out to be a different control goes back to the user (Icon Button did).
- No publish, no git. Never delete — quarantine to `_tmp/`.
- Names are the user's ruling: `MultiSelect`, `TabChips`, `BackgroundVideo`, `BrandAvatar` stand until he says otherwise.

---
## Entries

[23:22 GMT · 2026-10-01] · setup · playbook created
  what → initialised the live playbook   why → /kol-goal go after the question round
  rulings → rail icons on groups + docs/styles pages · knob bar = three named dropdowns, labels capitalised · plates off hardware previews · five atoms to molecule · control+label+value is a molecule · Knob/Fader drop ParamSheet · HlsVideo → utilities as BackgroundVideo · Button keeps default/accent/danger/nav · Set = the parts that make a thing · rack into kol-hardware · empty rail rows list # sections · Styles rail top layer = Foundations/Icons/Guides · graph gets files + orphans · expand-all shortcut · landing walls ×5 · atoms home checklist · demo → preview · TouchDeviceOverlay preview forced on · hardware twins merge (Icon Button does NOT — it has a lit state) · ProfileAvatar → BrandAvatar · foundations list docs under Related · gap scan runs
  already built before go (not browser-checked) → ResultRow icon + SearchPage kindIcons/rowMeta (1C) · PreviewCard ground sunken (3C) · Dropdown `{ heading }` row · PreviewCard AxisPicker = named dropdowns · kol-component MultiSelect + preview · DocSection own top margin · scripts/validate-gaps.mjs (not registered, not run) · cursor lookup row

[23:34 GMT · 2026-10-01] · T3 tier moves · packages/component/src/{atoms→molecules}/{ActionButton,ColorSwatch,RotaryDial}.jsx · showcase/src/nav/classification.js · 03-components/00-taxonomy.md
  what → three files moved to molecules/ with their importers and the barrel; TIERS: ChessBoard, RailSection, ClearspaceDiagram, Knob, Fader → molecules
  note → control + label + value = molecule is applied by retiering the three as shipped; a bare dial/track atom is not split out
  verify → taxonomy ✓ · roster ✓ (423) · imports ✓
  also → package.json: validate:gaps registered; first run crawling in the background (>10 min)

[23:35 GMT · 2026-10-01] · T4 ParamSheet · packages/hardware/src/value/{Knob,Fader,EnvelopeGenerator}.jsx · demos Knob/Fader/ParamSheet
  what → Knob and Fader no longer render ParamSheet; a 500ms touch hold calls `onHold(…)`, no `onHold` = a plain drag
  holder → EnvelopeGenerator (the one in-package holder) opens the sheet for its four ADSR knobs
  breaking → monitor · mirror · fxr lose the touch sheet on their next bump until they pass `onHold` — goes in the changelog

[23:35 GMT · 2026-10-01] · T9 hardware plates · showcase/src/demos (hardware)
  what → nothing to do: the plates were already stripped in the 22:15 session (every hardware demo carries the "no panel behind it" note)

[23:36 GMT · 2026-10-01] · T5 BackgroundVideo · packages/component/src/utilities/BackgroundVideo.jsx (was atoms/HlsVideo.jsx) · barrel · 4 importers · demo + story renamed
  what → HlsVideo renamed BackgroundVideo, moved atoms → utilities; `HlsVideo` exported as the alias; ledger row; inventory + registry rows
  verify → taxonomy ✓ · roster ✓ (425) · retirements ✓ · demos ✓ (284) · syntax ✓

[23:36 GMT · 2026-10-01] · T6 BrandAvatar · packages/styleguide/src/SocialMocks.jsx · BrandAssets.jsx · index.js · showcase set + demo
  what → ProfileAvatar renamed BrandAvatar; `ProfileAvatar` kept as a deprecated const alias; ledger row; classification rows + DEPRECATED
  verify → same gates ✓

[23:39 GMT · 2026-10-01] · T7 Button variants · packages/component/src/atoms/Button.jsx · utilities/tone.js (VARIANT_TONE) · scripts/validate-variants.mjs (V3) · 04-retirements.md § Props
  what → primary · secondary · outline · ghost · grey · control deprecated as aliases of tones; they render unchanged and warn once in dev; variant keeps accent · danger · nav
  swept → 268 literal <Button variant> call sites → tone (codemod, _tmp/2026-10-01-button-variant-codemod.py) across packages · showcase · workbench · apps; 6 ternaries + AppControls + the workbench story by hand; RowMenuButton forwards its variant as tone; SectionNewsletter maps submitVariant
  gate → V2 follows tone="inverted"; V3 fails any of the six on Button
  verify → variants ✓ (57 literal) · syntax ✓ · taxonomy ✓
  note → the swept call sites now stamp `kol-tone-*` instead of `kol-btn-*` — same bundle in the theme (the variant classes are `:where()` aliases of the tones); not yet seen in a browser

[23:42 GMT · 2026-10-01] · T8 hardware twins · packages/component/src/molecules/{Slider,SliderPanel,RotaryDial,RotaryDialPanel,LabeledControl}.jsx · utilities/armLongPress.js · packages/hardware/src/{value/Fader,value/Knob,panel/PanelLabel}.jsx · ARCHITECTURE §3
  read → Fader/Slider: same job, drawn track + vertical vs native range · Knob/RotaryDial: same job, cap in hardware colors + placements + bipolar vs ring-and-disc · PanelLabel/LabeledControl: same job, four positions at helper-8 · PanelDropdown: already retired in kol-controls 0.3.0 — none is a different control
  what → each kol-component control gains `variant="panel"` carrying the hardware drawing class for class (internal SliderPanel / RotaryDialPanel, not exported); the three kol-hardware files are @deprecated wrappers; armLongPress moved to kol-component, re-exported from hardware
  renamed → Knob's `variant` (label placement) is RotaryDial's `labelPlacement`; PanelLabel `horizontal` is `labelPosition="right"`
  showcase → Slider / RotaryDial / LabeledControl previews gain a panel variant; Fader · Knob · PanelLabel pages retired (DEPRECATED), demos → _tmp/2026-10-01-hardware-twins-merged/; originals of the three sources kept there too
  left → apps/controls still imports the aliases (it is the hardware app; they work)
  verify → syntax ✓ (810) · taxonomy ✓ · roster ✓ · demos ✓ (281) · retirements ✓ · variants ✓ — not seen in a browser
  publish note → kol-hardware must peer on the kol-component that ships the panel variants

[23:46 GMT · 2026-10-01] · BREAK + fix · showcase/src/demos/ExhibitCard.jsx:9 · scripts/validate-syntax.mjs
  what → the Button codemod rewrote `variant='primary'` inside a double-quoted `code="…"` string to `tone="primary"`; the string stopped parsing and the whole showcase served a 500 (blank page) from T7 until now — the user's own dev server included
  found by → the gap scan reading 7 pages instead of ~700; a browser probe named the file
  fix → the one string; and validate:syntax now transforms showcase · workbench · apps too (it read packages only, so it said clean throughout)
  verify → syntax ✓ (810 package + 620 showcase/workbench/app files) · 19 pages probed in a browser, no console errors

[23:46 GMT · 2026-10-01] · T2 browser check · _tmp/2026-10-01-gap-scan/shots/
  seen → Button page: knob bar is three named dropdowns, capitalised; stage on the sunken surface, the default button reads · search results: wash row, kind glyph, path as line two · MultiSelect page renders · Slider / RotaryDial / LabeledControl / BackgroundVideo / BrandAvatar / ParamSheet pages render
  note → component URLs are kebab slugs: /components/multi-select (I gave the user /components/MultiSelect earlier — wrong)

[23:54 GMT · 2026-10-01] · T10 rails · scripts/extract-sections.mjs → showcase/src/nav/page-sections.json · showcase/src/lib/ShellChrome.jsx · packages/workshop/src/shell/{ShellSidebar,RailRow}.jsx
  what → a row with no children lists its page's sections as `#` links (Styles · Search · Development); sections are read off the rendered pages into a manifest (`pnpm extract:sections`, 45 pages), not hand-listed
  styles → no "Styles" level: Foundations · Icons · Guides are the rail's top layer
  search → no "Search" level: Results · Tags · Graph · A–Z are the rail (`ShellSidebar label={null}`)
  package → RailRow: a `to` with a `#` is a Link whose active state is the hash, not the router's; ShellSidebar: `section: true` children are not leaves, `label={null}` draws no L1
  seen → /foundations/color, /search/tags, /references in a browser: sections list and unfold on the open page
  left → Library and Docs rows do not list sections (325 component rows would quadruple the rail); a plain row still sits 4px right of a group label beside it — the shipped ladder, not changed

[23:59 GMT · 2026-10-01] · T11 rail icons · packages/workshop/src/shell/{RailSection,ShellSidebar}.jsx · showcase/src/lib/ShellChrome.jsx (RAIL_ICONS, withIcons)
  what → a route may carry `icon`; RailSection takes a `glyph`, RailRow already took `icon`. Every group wears one (named, else the folder); Docs, Styles, Start and Lookup pages wear one (named, else the file; icon-group pages the grid). Component rows stay text
  fix → a glyphed group steps its children in 22px so they hang under its label, not left of it
  seen → Library, Styles, Docs rails in a browser
  mine → the glyph choices (RAIL_ICONS) are my picks from the interface set

[23:59 GMT · 2026-10-01] · T12 expand-all shortcut · packages/workshop/src/shell/ShellLayout.jsx:284
  what → it already existed: `C` folds every group in both rails and, pressed again, expands every one at any depth. It was listed as "Fold all", which is why it read as missing — relabelled "Fold / expand all". Nothing built

[23:59 GMT · 2026-10-01] · T13 foundations → docs · showcase/src/nav/vault.js (relatedDocs) · lib/HomeDoc.jsx (`related`) · pages/Foundations{,Color,Typography,Tones}.jsx
  what → each foundation page lists the vault docs behind it under Related in the right rail (tokens: tokens · opacity · sizes; color: color · color lookup · opacity; typography: typography · typography lookup; tones: tone lookup · color)
  verify → syntax ✓ — not yet seen in a browser

[00:06 GMT · 2026-10-02] · T15 the rack · packages/hardware/src/frames/{Rack.jsx,eurorack.js} · barrel · classification · demos RackCase / RackRow / RackSlot
  read → kol-monitor (clone, read-only): `modules/utility/Case.jsx` + `eurorack.js` are presentational — cheeks, the case ground, a rail of mounting holes per row, 1U 138.67 / 3U 416, 16px per HP
  what → lifted class for class as `RackCase` · `RackRow` · `RackSlot` plus the grid constants; the case takes `hp` (default 104) and its rows read it. Monitor's edit arrows, registry and move logic stay there
  mine → the names (monitor's `Case` is too bare for a barrel)
  verify → syntax ✓ · taxonomy ✓ · roster ✓ (428) · demos ✓ · seen in a browser, dark

[00:06 GMT · 2026-10-02] · T14 sets · showcase/src/sets/{rack,mixer}.jsx · lib/sets-registry.js · homes/sets.md · 05-names.md § Set
  found → set pages already lead with "The set" — their parts by tier — since W9 (2026-09-30); nothing to build there
  what → the definition is the user's now: the parts that make a thing. Rack and Mixer added as sets (category Hardware), each a working assembly of the hardware parts; composition manifest regenerated (17 sets)
  seen → /sets/preview/rack and /sets/preview/mixer in a browser, dark

[00:09 GMT · 2026-10-02] · T16 landing walls · showcase/src/lib/LandingWall.jsx (new) · CollectionLanding.jsx · pages/{Home,Blocks,Sets,Apps,Packages}.jsx
  what → the landing's wall is one component now (`LandingWall` + the shared `Tile`, which Home imports): masonry columns sized by the wall's own width, a batch of 12, Load more, one column block per batch
  where → Modules and Sets homes open on it (every item as a live card; the category tabs and list view still show the full stages) · Apps: "Every app" after the table, which stays first · Packages: "Every package" before the tier tables · Components already had this wall
  seen → /, /modules, /sets, /apps, /packages in a browser
  note → app and package cards are text (name, what it is, packages / tier) — neither has a live preview to draw

[00:11 GMT · 2026-10-02] · T17 atoms home filter · showcase/src/pages/Components.jsx
  what → a tier's home (/components/tier/*) drops ContentFilters for an "All components" bar with a checklist dropdown on the right (`SettingsMulti`, "11 of 11 packages") that shows or hides each package's components; /components itself keeps ContentFilters
  seen → /components/tier/atoms in a browser

[00:14 GMT · 2026-10-02] · T18 graph · packages/search/src/graph.js (indexGraph) + selftest · packages/workshop/src/tags/TagGraph.jsx · showcase/src/pages/DevTools.jsx
  what → kol-search `indexGraph(items, { files, orphans, filter })`: a node per tagged doc joined to its tags, a node per untagged doc, a text filter; with nothing on it is `tagGraph`
  drawing → TagGraph takes `files · orphans · filter · labels (auto|all|none) · nodeScale · linkScale · onFileClick`; a doc is a small neutral dot named by its title and opens its page. No force controls (ruled out)
  page → /search/graph: Filter input, Show chips (Files · Orphans), Labels toggle, Node size and Link width sliders
  verify → kol-search self-check ✓ (4 new assertions) · syntax ✓ · seen in a browser with files + orphans on (282 nodes, 682 edges), no page errors

[00:19 GMT · 2026-10-02] · T19 demo → preview · showcase/src/previews/ (was demos/, 309 files) · lib/previews-registry.js · lib/PreviewStage.jsx · pages/PreviewFrame.jsx · scripts/validate-preview-files.mjs · package.json · 7 docs
  what → one sweep (_tmp/2026-10-01-demo-to-preview.py), 592 lines in 353 files: `DEMOS` → `PREVIEWS`, `NO_DEMO` → `NO_PREVIEW`, `DemoStage` → `PreviewStage`, `DemoPreview` → `PreviewFrame`, every `XDemo` function → `XPreview`, `validate:demos` → `validate:preview-files` (`validate:previews` was already the browser gate), and the word in comments and strings
  kept → lines quoting the user keep his words · `showcase/src/data/` and `demo-data/` (demo DATA, another sense) · the dev-only `/demo` chess page · package source (their "demo" is not the preview)
  also → kol-theme `.bg-surface-sunken` (the token had no class; the consumption gate failed the arbitrary value) · HlsVideo.mdx → BackgroundVideo.mdx · two MDX frontmatters synced to their new tier · `pnpm extract:docs` regenerated
  verify → all 32 gates ✓ · 7 pages probed in a browser

[00:20 GMT · 2026-10-02] · T21 audio · backlog/2026-10-01-component-audit.md § 5
  read → AudioPlayer · AudioPreview (+ AudioTile · VideoTile) · AudioSheet · PlaybackBar · usePlayback, and every importer here
  found → AudioPlayer (native strip) and AudioPreview's own transport are rendered by nothing in this repo; the live path is AudioTile → AudioSheet → PlaybackBar
  recommendation → one transport, PlaybackBar; retire the two, keep the tile, the sheet and the bar. Not done — his to rule, and the drop needs the iMac's estate scan

[00:23 GMT · 2026-10-02] · T1 gap scan · scripts/validate-gaps.mjs · showcase/src/lib/CollectionPage.jsx · packages/workshop/src/docs/DocKit.jsx
  ran → the full crawl: 1,114 pages, 46 flush rules in 6 patterns (_tmp/2026-10-01-gap-scan/run-5.txt)
  the tokens-page bug → gone on every page: DocSection now keeps its own distance where the page supplies no gap (it was the cause on ~10 pages that stack sections in a fragment)
  real, fixed → the prev/next row on all 38 module pages sat 0px under the composition table — `mt-10` on CollectionPage's pager
  not bugs → four patterns were the scan reading previews and components' own rules (a card's plate, a header tab, wall thumbnails) and one was clipped table rows measuring past a scroller; the scan now skips `data-toc-skip` specimens and `kol-*` component rules, ignores screen-reader-only text, and clips to what is visible
  gate → `pnpm validate:gaps` (browser, ~35 min for the full crawl, not in default validate); `node scripts/validate-gaps.mjs /a /b` re-reads named pages
  verify → the 9 flagged pages re-read ✓ clean; a second full crawl is queued behind the previews gate

[00:44 GMT · 2026-10-02] · T20 previews · showcase/src/previews/{Notes,Decks,MediaLibrary,AppHub,AppStudio,Brand,TouchDeviceOverlay}.jsx · classification NO_PREVIEW / SHOWN_IN · showcase/src/index.css · packages/shell/src/TouchDeviceOverlay.jsx
  what → the six tools preview in a frame by mounting the APPS' OWN ENTRY FILES (apps/notes · presentation · media · hub · studio · brand-hub) on their fixtures — no second mock, and a preview cannot drift from its app; fifteen parts show their tool's preview (SHOWN_IN)
  touch → `TouchDeviceOverlay force` shows the note on a desk and after a dismissal; `useTouchPrimary` is a hook and draws nothing
  css → the showcase scans kol-notes, kol-deck and the six app folders for classes (they are not showcase imports)
  verify → `validate:previews` (browser): 31 → 9 pages without a working preview, then Media Inspector mapped onto MediaLibrary → 8: Video Sheet (no video here), FontViewerComponent · FontViewerSection (the deferred engine), ShellLayout · TagModeGate (this site's own shell), RowMenuButton (touch only), CropOverlay · PathNodeOverlay (ruled out)
  seen → all seven frames render their tool in a browser, no page errors

[00:44 GMT · 2026-10-02] · T22 record · 7 CHANGELOGs (Unreleased) · docs/operations/09-phase-log/2026-10-02-question-round.md + INDEX row · plan status · 05-names § Set · homes/sets.md · 00-taxonomy.md · 04-retirements.md (+ § Props) · ARCHITECTURE §3 amendment
  verify → all 32 gates ✓ · retirements ✓ · metadata ✓ · vault-links ✓ (712)

[01:16 GMT · 2026-10-02] · close · final checks
  verify → `validate:gaps` full crawl ✓ clean (1,115 pages) · `validate:rail-pages` ✓ (106 groups, 105 pages) · `validate:previews` 8 without a preview, each with its reason · all 32 default gates ✓ · kol-search self-check ✓
  state → nothing published; seven packages carry Unreleased changelog entries; no server left running
  waiting on the user → the audio recommendation (audit § 5); his eye on the rails, walls, graph settings, MultiSelect and the panel variants
