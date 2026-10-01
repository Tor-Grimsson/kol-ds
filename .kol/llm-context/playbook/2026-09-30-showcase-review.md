# Playbook — the showcase review (W1–W22)

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** build every W of `plan-2026-09-30-showcase-review.md`, in order; close each one before the next.

**Standing rules (non-negotiable):**
- Every category and subcategory, in every rail, gets its own page.
- A W closes on: gates green + the page opened in Playwright and checked against the acceptance line and the user's words.
- Nothing deleted — replaced files go to `_tmp/<date>-<what>/`.
- Publish only after the user's yes; git is his.

---
## Entries

[20:01 CEST · 2026-09-30] · setup · playbook created
  what → initialised the live playbook   why → /kol-goal over the whole review plan

[20:05 GMT · 2026-09-30] · W1 rail nests to any depth · packages/workshop/src/shell/ShellSidebar.jsx
  what → groups recurse: a chapter's child with children renders as a nested chapter (RailSection L2), leaves as RailRow
  why → Library › Composition › Components › Atoms › page needs more than two rungs
  after → follow/fold/fold-all/leaf-count walk the whole tree; pathless group no longer matches every URL
  css → .shell-nav-nest { padding-left: var(--kol-pad-rail-row-x) } (kol-components-workshop.css)
  verify → 32 gates ✓ · /components/button: Atoms opens, rest folded, Button active, C folds all, 0 console errors ✓
  note → depth ≥3 has no data until W2; W2's check covers the nested fold, link and indent

[20:08 GMT · 2026-09-30] · W2 Library is the root · showcase/src/nav/shell-nav.js · showcase/src/lib/ShellChrome.jsx
  what → header Styles · Library · Docs · Search · Development; one Library tree: Composition › Components · Blocks · Apps, Collection › Sets · Packages
  why → user: "make library be the shared root, with composition and collections inside as subcategories"
  before → tabs Composition + Collection, /library reachable only by prose links
  after → tab 'library' (icon layers) owns /library /composition /components /blocks /apps /app /collection /sets /cards /packages; search rows space 'library'
  docs → 05-names § Spaces, 02-shells space table, homes/library.md + search.md (in:library)
  verify → 32 gates ✓ · /components/button: Library › Composition › Components › Atoms open, indents 0/20/40, Button active · /packages/search: Collection › Packages › Engine open · /library: tab lit, 0 errors ✓
  note → W1 depth check closed here (nested fold, link, indent)

[22:07 GMT · 2026-09-30] · W3 every group gets a page · scripts/validate-rail-pages.mjs (new gate, 33rd)
  what → gate opens every rail in a browser, all folds open, both Group-by modes; fails a category/group with no link (P1), a link that is its child's (P2), a page with no heading / a throw / a redirect onto a child (P3)
  why → the law was said six times and no static gate could see a rendered rail
  first run → 13 gaps: Foundations=Tokens · 6 package tiers = first package · Documentation, Operations, Tools, Records linked nowhere · lobby Inbox/Done = first ticket
  fixes → /foundations = FoundationsHome, Tokens → /foundations/tokens (homes/tokens.md) · /packages/tier/:tier + 6 homes · Docs eyebrows → their INDEX.md · /development/tools + /development/records (homes) · /lobby/state/:state + 3 homes · icons: V1 and Signal are groups of their icon groups, /icons/:set/:group pages
  new → lib/ChapterHome.jsx (home + DS Table of children), pages/FoundationsHome.jsx, pages/DevChapters.jsx
  verify → 33 gates ✓ · rail-pages: 80 categories and groups, 79 pages, every one its own ✓ · looked at /icons/kol-icon-set-v1/chevron and /packages/tier/ui ✓
  note → icon group pages have no .md home — generated from the package, like the package pages
  note → found, not W3's: icon catalog renders ONE column at 1280 (set page too) → W8
  note → goal hook did not fire on my one stop: goal-loop.sh resolves the goal from the shell cwd (was showcase/src), no walk-up to repo root — shell kept at root since

[22:15 GMT · 2026-09-30] · W4 sets on one level · showcase/src/lib/ShellChrome.jsx · packages/workshop/src/shell/{ShellSidebar,RailSection}.jsx
  what → every set is a group of its members (composition.json kol list → component pages); Cards holds its cards — one kind of thing, one level
  why → user: "sets is wrong in the sidebar" — Cards folded, the rest were bare rows
  decision → the plan line said "only Cards folds"; that keeps the mixed level, so every set folds instead
  rail → follow opens ONE chain, the first place in tree order, deepest match (Button no longer unfolds every set that uses it)
  chrome → chapter label truncates, count keeps a gap (.shell-nav-group-header gap: --kol-spacing-2); set labels cleanTitle'd
  verify → 33 gates ✓ · /sets/app-shell: Library › Collection › Sets open, 16 sets at one indent, weight 500, no wraps · /components/button: only Composition › Components › Atoms opens ✓

[22:34 GMT · 2026-09-30] · W5 descriptions · scripts/validate-metadata.mjs (M2 widened, M6 new)
  what → every description is a summary of <= 8 words, no list marks (· ; — – ( ) and <= 1 comma
  why → user: "a description is a SHORT summary … not an opportunity to list arrays"; example kept verbatim for kol-search
  rewrote → 139 authored (20 vault · 6 homes · 42 component MDX · 23 package.json · 15 sets · 18 blocks · 15 cards) + 167 component header comments (summary put FIRST, the old text kept after it)
  gate → M2 + M6 now hold the vault, homes, component MDX, every package.json, set/block/card meta, and the generated descriptions.json — 124 + 516 descriptions
  drift → component MDX descriptions equal their header's first sentence (validate:drift D2), so the fix went into the source, then extract-descriptions
  verify → 33 gates ✓ · /packages/tier/ui reads one line per package ✓
  note → package.json descriptions reach npm only on the next publish (his yes); one-off script quarantined to _tmp/2026-09-30-w5-description-scripts/

[01:42 GMT · 2026-10-01] · W6 tags · scripts/lib/topic-tags.mjs (new) · scripts/validate-tags.mjs (T1–T4 widened, T5 new)
  what → pages tagged by what they are about: domain/ topics from a page's own name, title, description (search · filtering · media · files · navigation · forms · editor · chess · …)
  why → user: "never seen any other tags than maybe 8", "hashtag consumer?! … how about search query index"
  before → 208 showcase pages, 35 tags, domain/design-system on 137, audience/consumer on 57 (+67 vault)
  after → noise tags gone everywhere; 63 tags in use, 46 subjects; atoms home tags domain/components/atoms; a topic only where 2+ pages share it
  gate → validate:tags now holds homes + component MDX + sets/blocks/cards (T1 >= 2 tags, T2 closed set, T3 no domain tag on > half, T5 no noise) and T4/T5 on the vault; sync-mdx and generated package pages tag new pages the same way
  fix → "shell" removed from the app-shell topic (".kol-control shell" tripped it), 4 false tags stripped; 37 thin vault docs given a second real subject (+ domain/research, domain/breakpoints)
  verify → 33 gates ✓ · /components/search-input tags: search · forms · input · molecules · /search/tags: no #consumer ✓
  note → one-off retag quarantined to _tmp/2026-09-30-w6-retag/

[01:56 GMT · 2026-10-01] · W7 package pages · showcase/src/pages/Packages.jsx · showcase/src/package-about/*.md (23 new)
  what → a package page opens on what the package IS in plain English, then Install (pm tabs, copyable), Used by (apps · packages · what it needs), its family and sets, and a Changelog line linking the full log
  why → user: "you think a version log is documentation, NO its WHAT IS THIS THING and CAN I READ IT IN ENGLISH"; "kol-search doesnt say anything about the search engine nor list apps … no npm syntax to copy"
  after → changelog is its own page /packages/:dir/changelog; apps read off apps/*/package.json (cannot drift); kol-search's page explains what you can type and how it ranks
  gate → validate:rail-pages hardened: load retry, P0 line when the gate itself fails (was a silent 0-violation failure)
  verify → 33 gates ✓ · rail-pages 95 groups/94 pages ✓ · /packages/search: about, install, used by (search · workshop-fixture · kol-component …), changelog link · /packages/search/changelog renders ✓

[02:10 GMT · 2026-10-01] · W8 icons · packages/icons · showcase/src/pages/IconsGallery.jsx · homes/icons.md
  rename → kol-icon-set-v1 is kol-icon-set-interface ("Interface · Signal"); folder moved, KOL_ICON_SET_INTERFACE(_NAMES/_META) new, the V1 exports kept as @deprecated aliases with ledger rows; icon names unchanged; old /icons/kol-icon-set-v1/* URLs redirect; live docs + loader/bin/scripts updated, records left as written
  decision → the name is mine (naming call), one rename away from another
  gate → validate:retirements now detects a @deprecated const declared in a barrel (it saw only re-exports and files)
  home → Icons home rewritten: what the two sets are, use one, size (solo 12/16/20/24 · adjacent 10/14/16/18), color (oq never fg), bring your own (registerIcons), npx kol-icons audit
  layout → one header (the home, or a DocHeader on a group page); size · ground · guide all in the filter row; the SET picker and the second theme toggle gone (rail + shell header carry them)
  grid → ContentCollection's 320px default floor gave ONE column at 1280; minCol 160 (the catalog's) → 3+
  reader → markdown table cells pick a role per column: token (<= 3 words, <= 24 chars, single line) or copy (wraps); every wide table had clipped behind a hidden scrollbar (kol-workshop)
  verify → 33 gates ✓ · /icons/kol-icon-set-v1/chevron redirects, 3 columns, one heading · /icons table fits · /documentation/02-shells: 16 of 16 tables fit ✓

[02:20 GMT · 2026-10-01] · W9 a set view · showcase/src/pages/SetPage.jsx (rewritten)
  what → a set page shows the SET: its members by tier (a column per tier, every chip a component page) and the parts built for it, then the set working at the page's width, then its source
  why → user: "why do both sets and blocks use the same responsive component … set needs something that visualises A SET"
  before → CollectionPage over BlockViewer, the blocks' device frame; blocks keep it
  slip → overwrote SetPage.jsx instead of moving it to _tmp first; reconstruction at _tmp/2026-09-30-w9-set-page/ (comment lines missing), exact file in git HEAD
  verify → 33 gates ✓ · /sets/metrics-dashboard: 21 members in 4 tiers, In use renders the live dashboard, Source capped at panel, 0 errors ✓

[02:24 GMT · 2026-10-01] · W10 guide tables · showcase/vite.config.js · showcase/src/lib/mdx-components.jsx
  what → remark-gfm in the MDX pipeline (installed, showcase devDependency) + MDX "table" mapped to .kol-doc-table, capped at the panel
  why → user pasted the type-roles table printed as one line of pipes; MDX is CommonMark, it has no tables
  verify → 33 gates ✓ · /styles/type-roles: 0 pipe paragraphs, the 8-row Role/Job table renders and fits · /styles/menus: its table renders ✓
  note → dev server restarted for the config (my port 5391, new pid in scratchpad)

[02:28 GMT · 2026-10-01] · W11 results page · packages/workshop/src/search/{SearchPage,ResultRow}.jsx
  what → input md (was lg); scope, read-as and facet chips are all THE Tag at sm (were ghost Buttons and md Pills); kind · category · tags fold into one TabsRow with one chip row; results follow directly
  why → user: "humongo search input", "not tags buttons, and different sizes", "press enter … scroll million kilometers", "could kind category and tags be folded into tabs", "Results item is so low opacity"
  rows → ResultRow drops opacity-80; the roles carry it: title emphasis, meta text-meta (was subtle, 24%), description text-body
  verify → 33 gates ✓ · /search?q=button at 1280×720: results begin inside the first screen, one chip size, 0 errors ✓

[02:32 GMT · 2026-10-01] · W12 search page frame · showcase/src/pages/Search.jsx · packages/workshop/src/shell/ShellSidebar.jsx
  frontmatter → the page draws its own panel (page rule: shown, F hides) with or without a query; the home under it passes frontmatter={false}; HomeDoc gained the prop
  spacing → loose rows share one list: each childless entry was its own nav and took the stack's 16px gap (Search rail rows 46px apart); every rail with loose rows had it
  verify → 33 gates ✓ · /search?q=tag: frontmatter panel, rail rows 26/26/26 ✓
  note → the panel pushes the results ~280px down when shown; F hides it

[02:35 GMT · 2026-10-01] · W13 search home · showcase/src/homes/search.md
  what → the home documents the engine: every form you can type (words, "phrase", -word, #tag/tag:, is:/kind:, in:/space:, cat:/category:, -tag:, after:/before:, bare-word filters) and how it ranks (the weight table, ties, reasons, counts)
  why → user: "things LIKE SEARCH HOME COULD TALK ABOUT the engine in question — what it inputs, how it works"
  verify → 33 gates ✓ · every documented form run live: atom 68 · "color swatch" 2 · button -icon 17 · #domain/search 3 · is:block 22 · in:docs 110 · cat:atoms 68 · after:2026-09-29 25 · /search: 3 tables fit ✓

[02:42 GMT · 2026-10-01] · W14 tag graph · packages/workshop/src/tags/TagGraph.jsx (rewritten; before → _tmp/2026-09-30-w14-tag-graph/)
  why → user: "the node graph is fucked, it needs better gsap and physics. asap."
  physics → one simulation per data/size (hover and active-tag used to wipe + restart it); charge by node size capped in range, link length/pull by shared pages, gentle x/y gravity, collision from the drawn radius; seeded on a phyllotaxis spiral and settled 260 ticks before the first frame
  motion → gsap on the house curve (kol-component motion constants): edges fade in, nodes grow centre-out, view eases to fit; hover lifts the tag + neighbours and dims the rest; reduced motion skips tweens; stroke is set, not tweened (color-mix strings do not interpolate)
  labels → the eight biggest tags at rest, the rest on focus
  deps → gsap ^3.13.0 added as a kol-workshop peer (as kol-component and kol-content declare it); pnpm install
  verify → 33 gates ✓ · /search/graph: 63 nodes inside the frame, clusters read (components vs workflow), hover: 45 lit / 18 dimmed, tooltip, layout stable, 0 errors ✓

[02:51 GMT · 2026-10-01] · W15 right rail · packages/workshop/src/shell/RightRail.jsx · showcase/src/lib/{ChapterHome,CollectionLanding}.jsx + 5 pages
  tags → TAGS is its own L1 section: Tag graph (the callers' graph action, moved out of Quick actions by id), All tags (tagsHref, /search/tags), then the page's tags as one L2 group per namespace; every RightRail caller gets it unchanged
  this page → a home's content had no heading for the rail to list; ChapterHome tables sit in a titled DocSection (Pages · Sets · Tickets · Packages), the block/set/card stage titles are real h2s, guides/group-by lists and the three Library diagrams sit in titled sections, a layer page's table too
  verify → 33 gates ✓ · 25 homes walked: every one lists Contents (was 10 EMPTY) and shows This page / Links / Tags · /components/tag rail screenshot ✓
  note → console shows ERR_INSUFFICIENT_RESOURCES on module loads in dev mode (thousands of separate modules from the eager globs — Chrome's in-flight cap); pages render; pre-existing, not W15's; one real error found and fixed (Tags group keys)

[02:55 GMT · 2026-10-01] · W16 shell · packages/workshop/src/shell/ShellLayout.jsx · showcase ShellChrome · SearchPage
  keys → backslash hides both rails when either shows, shows both when both are hidden (persisted like [ and ])
  words → shortcut labels: Search · All results · Shortcuts · Settings · Left/Right/Both rails · Fold all · Close · Frontmatter (were "Search everything", "All results, on the search page", "This sheet", "Fold or open every chapter", "Close what is open", "Show or hide frontmatter"); settings: "This space only" (was "Quick search in this space only"), "Group by" (was "Group the rail by"); search lede "Every page on the site."
  why → user: "shortcut to hide both rails at once?", "shortcuts overlay, too wordy", "Search QUICK SEARCH IN THIS SPACE ONLY … taking 2 lines … why does everything have to be so wordy"
  verify → 33 gates ✓ · backslash: both rails gone, again: both back · S sheet: one-to-two-word labels ✓

[03:03 GMT · 2026-10-01] · W17 color · component Tag.jsx + molecules.css · workshop DocsFrontmatter, SearchPage, RightRail · showcase DevTools, Tag.mdx
  tags → Tag gains `color` (a palette key, what getTagColor returns); .kol-tag--primary.kol-tag--hue mixes fill, hover and active from --kol-tag-hue, so a colored chip keeps its states (the 2026-08-01 reason color was pulled). Wired: frontmatter tags, search tag facets, the tags page, the right rail's tag hashes — the same namespace hue the graph nodes wear
  status → frontmatter status renders as Badge on its tones: active success · canonical info · draft warning · archived/superseded/deprecated error; Badge owns status, Tag does not
  why → user: "do we hate color? there is no tag colors, no active error warning nothing"
  verify → 33 gates ✓ · /components/button: Active green badge, domain tags blue, pattern purple, rail hashes blue ✓

[03:20 GMT · 2026-10-01] · W18 atoms · showcase nav/classification.js · pages/Components.jsx · lib/ShellChrome.jsx · 8 new demos
  tiers → DashMetricCard, DashStackedBarCard, DashSlotCard, DashTooltip → molecules (beside the other Dash cards); DashboardGrid, GridCard → utilities (layout wrappers); ShellSidebar, WorkshopDefaultSidebar → molecules (compose RailSection/RailRow, the RightRail precedent); ExhibitLinkCard → molecules (renders Tag). Atoms 68 → 60. Sparkline stays the dashboards' one atom
  previews → new demos: AudioPlayer (a tone built in code, no audio fixture exists), ExhibitCard, GlyphItem, Logomark, ProfileAvatar, RailRow, RailSection, TagPath — 0 of 60 atoms show the name placeholder (was 11)
  overlap → the card's Fit wrapper was shrink-to-fit, so a fluid demo collapsed to nothing (FileIcon drew a blank card); it is now at least the box wide and centres. Text-overlap sweep: AnimatedTitle and RockerSwitch overlaps are their design
  toc → demo previews carry data-toc-skip and useHeadings keeps one row per anchor — ExhibitCard's heading had put a duplicate "atoms" key in This page
  why → user: "atoms are a fucking mess, no preview, or overlapping things … not atoms, like dash* these are built using nested element, how are they atoms?"
  verify → 33 gates ✓ · /components/tier/atoms: 60 cards, 0 placeholder, 0 blank, 0 console errors ✓
  seen for W20 → the full wall: 81 non-atom cards without a demo, duplicate key "#" from a demo, font fetch errors
  correction → the first close ran the gates after the tick and `demos` failed (8 stale NO_DEMO exemptions); unticked, dropped the 8 from classification.js NO_DEMO (ProfileAvatar's was the 2026-09-03 brand-mock ruling — its demo wears the KOL mark, so it invents no brand; noted at the list), re-ran: 33 gates ✓, re-ticked

[06:37 GMT · 2026-10-01] · W19 knobs · showcase lib/{PreviewCard,DemoStage,demos-registry} · 48 demos · nav/{registry,classification} · scripts/lib/parse-barrel.mjs
  axis → `tones` joins variants · sizes · states: a demo exports it, PreviewCard draws a Tone picker, DemoStage passes `tone`. Tone is the ground axis (default + kol-tone-*), not status
  demos → every demo whose component takes a named variant, tone or size now exports it and renders from it — Button (variant · tone · size, was variant only), Badge (variant, was size only), Dropdown, IconFrame, Input, SegmentedToggle, ViewToggle, ThemeToggle, SearchInput … 48 files. Stacked one-per-size specimens became the picker. Left out on purpose: numeric sizes (Icon, DonutChart, RotaryDial, TypeSample, ChessPiece, Logomark, PaletteHarmonyWheel, Slider px), ContentText's `size` (a content slot), ProfileCard's `variant` (an alias of size)
  LED → had no page, row or tier: the barrel parser and the registry read any all-caps name as a data export. parse-barrel exports ACRONYM_COMPONENTS ('LED'), used by both; LED: 'atoms' in TIERS. Atoms 60 → 61
  why → user: "atom button had dropdown for variant, to atom ne and size, now its back to only variant?"
  verify → 33 gates ✓ · 48 pages walked, every picker clicked through every value (≈330 renders): 0 "live demo unavailable", 0 console errors · /components/led renders with its Size picker ✓
  open → ContentFilters has no page: classification EXEMPT 'namesake' skips BOTH the component and shell copies though its comment says both stay — a naming ruling, not taken here

[06:49 GMT · 2026-10-01] · W20 landing · showcase pages/Home.jsx · lib/Fit.jsx (moved out of pages/Components.jsx)
  load more → after the curated wall, every other live component demo that fits a tile (a slim Card, or a hug/sm/md stage), most used first, 12 per click; the button (DS Button, inherited tone) goes when the library is shown
  batches → each batch is its own columns block: CSS columns fill top-down, so pouring a batch into the curated wall reshuffled every tile on each click
  fit → loaded tiles scale a too-wide demo to the tile's width (Fit, now lib/Fit.jsx, shared with the component wall); Fit scales from the top and hands back the height it no longer draws; `height={false}` for auto-height boxes, since a handed-back height there fed the scale down to 0
  why → user: "landing page needs load more"
  verify → 33 gates ✓ (variants V2 caught a secondary Load more — dropped) · 12 clicks: 42 → 181 tiles, 0 "live demo unavailable", 0 overflow, 0 console errors, earlier tiles stay put ✓
  open → DropdownTagFilter's demo is defaultOpen; its absolute panel is clipped by any tile (here and on /components)

[06:53 GMT · 2026-10-01] · W21 apps · showcase pages/Apps.jsx
  table first → /apps opens on "All apps": one table of all 23 apps — App (opens /app/<name>) · Layer (opens its layer page) · What it is · Local — then the nesting diagram, then the per-layer tables as before
  why → user: "apps: show a table first"
  verify → 33 gates ✓ · /apps: first section All apps, 23 rows, This page lists All apps + the six layers, no duplicate ids ✓

[07:00 GMT · 2026-10-01] · W22 record · docs/operations/09-phase-log/2026-09-30-showcase-review.md (new) + INDEX row + _files/plan copy · 05-names · 02-shells · 3 CHANGELOGs
  log → the run's phase-log entry: one row per W, the decisions (user's and mine, marked), what stays open; the plan copied unchanged into _files/
  docs → 02-shells: the right rail's three L1 sections (W15), Tag color supersedes "no color" (W17), the space table's right-rail column; 05-names: package page contents, chapters nest, Atoms (61)
  changelogs → Unreleased in kol-workshop (rail nesting, RightRail Tags, DocsFrontmatter color/status, reader tables, search page, TagGraph, ShellLayout keys; gsap peer), kol-theme (.shell-nav-nest, .kol-tag--hue), kol-component (Tag color); kol-icons had W8's
  homes → checked against what shipped; none stale
  verify → 33 gates ✓ · /development/log/2026-09-30-showcase-review renders, 22 W rows ✓

[17:10 GMT · 2026-10-01] · follow-ups · classification.js · DropdownTagFilter · validate-all.mjs · publish
  what → ContentFilters' stale exemption dropped (page back) · DropdownTagFilter deprecated → SettingsMulti, ledger row, demo+MDX → _tmp/2026-10-01-dropdown-tag-filter-retired/ · rail-pages out of default validate (5s now)
  published → theme 0.161.0 · icons 0.32.0 · component 0.234.0 · workshop 0.35.0 (workshop peers component ≥0.234.0, theme ≥0.161.0)

──────────── MILESTONE: showcase review W1–W22 ──────────── [17:10]
  changed: 4 packages published · quarantined: 4 · gates 32 ✓
  log: session-log/2026-10-01-showcase-review-w1-w22-published.md
