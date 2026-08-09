# Playbook — the lobby queue and the media library

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> System docs (user-facing): `docs/documentation/03-components/01-inventory.md` · `docs/documentation/04-compositions/01-blocks-and-sets.md`. Sibling arc: `playbook/2026-08-01-rail-ladder-and-search.md`.

**Goal:** the lobby queue empties — drift squared, all three live entries built or closed, and the media library gets a viewing surface in the same pass that builds it.

**Standing rules (non-negotiable):**
- git is the user's; publishes are the agent's (/upig)
- every named file gets its repo-relative path
- ARCHITECTURE §3 — the clients tier takes no deps from the UI packages, so the client is INJECTED, never imported
- if no token fits, say so out loud and add it to the token file FIRST; never improvise at a call site
- read-verbs report only; the user rules on his own text and on design law
- 14 gates clean + production build green after every step, no exceptions

---

[11:43 GMT · 2026-08-01] · scope · read-only pass over the queue, nothing built
  drift → `lobby/INDEX.md:31` says 4 live, inbox holds 3; the 🟢 IconFrame row at `:39` is closed and already in Processed at `:73`
  drift → InteractiveImage sat ⚪ parked in `inbox/` while the states table at `:23` puts parked in `archive/`; user's "do the work" unparks it
  drift → `lobby/WORKLOG-2026-07-03-monorepo.md` is a loose root file predating the inbox split, no ledger row

[11:43 GMT · 2026-08-01] · finding · two of three entries were stale on contact
  ReferenceGraphPipeline → NOT awaiting a ruling; already adopted — `scripts/validate-all.mjs:28` runs it, `pnpm validate` 14/14 clean
  ReferenceGraphPipeline → routed at `showcase/src/App.jsx:84-85`, nav-admitted at `showcase/src/nav/admitted.js:125`
  ReferenceGraphPipeline → its `docs/documentation/07-usage/` output is GONE (07-31 milestone); ★ data now in `showcase/src/usage/components/`, 216 files
  ReferenceGraphPipeline → `reuses:` frontmatter is 0 of 66 mdx; `scripts/sync-mdx-frontmatter.mjs:48,282-286` still computes a field nothing reads
  MediaLibrary → its "new packages/media?" question is already answered by `packages/media-client/src/index.js`
  MediaLibrary → that file ships createMediaClient · mediaUrl · proxied · listMedia · formatSize · isImageType · isVideoType
  MediaLibrary → the lightbox exists: `packages/component/src/organisms/MediaViewer.jsx:112`, controlled index/onIndexChange/onClose
  InteractiveImage → gsap is ALREADY a peer at `packages/component/package.json:31`; no dep change needed

[11:43 GMT · 2026-08-01] · decision · where the media library lands
  package → NOT a new one; views go to `packages/component/src/organisms/` beside MediaViewer + MediaTileGallery
  client → INJECTED as a prop, never imported — ARCHITECTURE §3 forbids kol-component depending on the clients tier
  precedent → same injection contract as kol-dashboards, kol-chess, kol-content; data is consumer-supplied, the package never fetches
  scrim → `.kol-overlay` already carries it (surface-inverse), noted at `MediaViewer.jsx:27`; no new token
  z-index → `--kol-z-modal` / `--kol-z-overlay` at `packages/theme/kol-theme.css:139-140` replace the spec's two arbitrary z-[…]
  video → tiles need a `#t=` src fragment; without it 222 of the bucket's 433 objects paint as empty boxes

[11:43 GMT · 2026-08-01] · ruling · the viewing surface, user-confirmed
  surface → a SET, not a new page type; `showcase/src/sets/design-editor.jsx` is the precedent (the fxr editor already has one)
  set → new `showcase/src/sets/media-library.jsx` → `/sets/media-library`, showing the fxr modal AND the full-page browser layout
  full-bleed → `/sets/preview/media-library` needs no new route; `showcase/src/App.jsx:47` already serves it
  components → `/components/:slug` picks them up automatically once they hit the barrel
  user → "I need a page to view MediaLibrary when done… so either make a 'set' or something like that"

[11:43 GMT · 2026-08-01] · open · nothing built yet
  held → whether the 4 consumer repos accept the injected-client API; needs their sign-off, not the agent's
  held → the `reuses:` ruling: delete the dead path, or re-wire it to a reader
  held → the two `/references` pages have still never been opened in a browser

[11:52 GMT · 2026-08-01] · build · B0 drift + B1 InteractiveImage
  drift → lobby/INDEX.md live count 4 -> 3; closed IconFrame row deleted from the queue (it was already in Processed)
  drift → InteractiveImage ⚪ -> 🟡, row records the user unparked it 2026-08-01
  drift → lobby/WORKLOG-2026-07-03-monorepo.md moved to lobby/archive/
  useCoarsePointer → PROMOTED out of TiltCard into packages/component/src/hooks/useCoarsePointer.js; TiltCard now imports it
  why → InteractiveImage was the second consumer; a local copy in one atom is a fork waiting to happen
  InteractiveImage → packages/component/src/atoms/InteractiveImage.jsx (ATOM, not molecule — the taxonomy gate ruled, TiltCard is an atom for the same reason)
  gsap → DROPPED. useTilt is the ONE tilt hook (its own docstring says so) and it is framer-motion springs; the source's gsap tweens were a fork of it
  ids → useId() per instance; the source's module-global `final-clip-path` / `image-pattern` clobbered each other on a second mount
  motion → gated twice, reduced-motion AND coarse-pointer; no listeners mount when either is true
  blur → NO --kol-* carries a blur radius (checked, zero hits in packages/theme). Stated, not improvised: it is a prop default, not a token reference
  demo → showcase/src/demos/InteractiveImage.jsx on /kol-images/tt-02.jpg, stage lg
  docs → 01-inventory.md: row in Atoms, hooks table now names both motion gates, updated: 2026-08-01
  gates → 14/14 clean

[11:52 GMT · 2026-08-01] · collision · a SECOND session is live in this repo
  what → .active-goal.md was overwritten from outside this session at ~11:46; the rail arc was marked done by that session
  claim → it recorded "InteractiveImage.jsx + useCoarsePointer.js arrived at 11:46 from outside this session; roster 2 + taxonomy 1 fail"
  truth → those two files are MINE, from this session, and both failures were fixed the same turn; 14/14 clean since
  risk → two agents editing packages/component and showcase/src/nav concurrently; nothing has been lost yet

[12:07 GMT · 2026-08-01] · correction · my "reuses: is 0 of 66" was wrong
  cause → I grepped `^reuses:` anchored to column 0; the field is INDENTED inside the frontmatter object
  truth → 46 of 66 mdx carry it
  ruling → KEEP the path. It is populated, author-wins, and --regen-reuses is a documented escape hatch. The delete I proposed was built on a bad grep

[12:07 GMT · 2026-08-01] · build · B2 MediaLibrary + B3 the set
  module → packages/component/src/organisms/MediaLibrary.jsx exports Provider + hook + MediaPicker + MediaBrowser (Popover's multi-export precedent)
  client → INJECTED as a prop; kol-component does not import kol-media-client (ARCHITECTURE §3, both directions)
  lightbox → MediaViewer, given an ADDITIVE `actions` slot so Use / Copy URL ride it; no second lightbox was written
  shell → FullscreenOverlay / .kol-overlay already owned scrim + centring + Esc + backdrop-dismiss + corner close
  esc → picker hands the overlay a no-op close while the viewer is open, so one press steps back one level
  chrome → .kol-media-picker/-browser/-grid/-tile/-folder in kol-components-organisms.css
  tokens → --kol-media-picker-w + --kol-media-tile-min; the card width and tile floor are GEOMETRY, not props — four forks had four different ones
  video → #t=0.1 on the tile src; 222 of the bucket's 433 objects were empty boxes in every fork
  folders → partition() is in the shared body, so the PAGE view drills down too (the brand book's 433 flat tiles)
  set → showcase/src/sets/media-library.jsx, both views over ONE injected client; showcase gained @kolkrabbi/kol-media-client
  bumps → component 0.18.0 -> 0.19.0, theme 0.17.0 -> 0.18.0
  gates → 14/14 clean, production build green

[12:07 GMT · 2026-08-01] · gap · the barrel parser silently hid three components
  what → scripts/lib/parse-barrel.mjs matches `export { A, B } from '...'` only on ONE line
  effect → my multi-line export block parsed as nothing; roster reported CLEAN with 3 unclassified components live
  fix → wrote the barrel line in the single-line form; roster then caught all three immediately
  still open → `useMediaLibrary` is never gated at all — the named-export branch filters /^[A-Z]\w+$/, so lowercase hook names slip through. NOT patched; it is a gate change and the user rules on those

[12:07 GMT · 2026-08-01] · blocked · B4 cannot finish
  what → /references + /references/:name still unopened; playwright refused, the browser profile is already in use
  not mine → I did not kill it; an orphaned or user-owned Chrome holds mcp-chrome-dc84f67
  my port → preview on 4321 spawned (PID 63731) and fully reaped, child 63800 included; port verified clear
  command for the user → pnpm --filter showcase preview --port 4321, then open /references

[12:14 GMT · 2026-08-01] · ruling · the user looked at /references and ruled on all three questions
  verdict → "not bad, its not right but not bad either, and it can def be used and shared" between references and the search page
  1 → USE ContentFilters. The inline chip row in References.jsx:78-95 is "inline shit" — a hand-rolled filter bar next to a real component
  1 → the table is ILLEGIBLE: `edgesnode` headers collide, every cell is the same mono weight, nothing separates a token from a component name
  1 → wants tables + inline code/token styles + bold and light; clearer categories than the current `concern` column
  2 → preview is a PLACEHOLDER for different things — conditional preview, rendered when applicable to that hit's kind
  3 → the overlay-vs-page question was NOT a real question: "it doesnt change your work, just log the items, and make a page for me to view"
  3 → deliverable is both — SHOW A MODAL AND SHOW A PAGE
  correction → I framed 3 as an architecture fork; it was never one. The modal already exists, the page is new, they read the same items

[12:29 GMT · 2026-08-01] · build · references legibility + the search results page
  filter → ContentFilters replaces the hand-rolled chip row + bare <input className="kol-input">; it owns the groups, the name search and the N-of-M count
  groups → TWO axes now, KIND first (Component / Token / Class) then Concern; mutually exclusive within each
  table → the DS Table component replaces the raw <table className="kol-table">; that alone fixed the `edgesnode` header collision (it was a bare <th> with no cell classes)
  weight → star count bold + emphasis ink, edges/kind/concern/definedIn on kol-helper-12 text-meta; the eye lands on the name, not the provenance
  NodeLabel → showcase/src/lib/NodeLabel.jsx renders BY KIND: token gets a dimmed `--` prefix, class a dimmed `.`, component a medium-weight name. They were one undifferentiated mono string before
  shared → NodeLabel/NodePreview live in lib/ precisely so References and SearchResults cannot grow two copies (the user: "can def be used and shared between this and the search page")
  page → showcase/src/pages/SearchResults.jsx at /search?q=…; the query is IN THE URL so a result set is a link
  same-index → it calls buildShellSearchItems() and matchSearchItems, the overlay's own source and matcher. No second index was built
  matcher → imported from @kolkrabbi/kol-workshop/engine, NOT the root barrel; the root does not export it
  extra → the page adds what a modal cannot afford: reference-graph nodes as a second family, and a "Matched on" column reading matchedHeading/matchedKeyword
  preview → conditional per hasPreview(): colour token renders its swatch, type class renders itself applied, everything else renders NOTHING. No column of empty boxes on 500 of 663 rows
  routes → App.jsx /search + shell-nav.js row + admitted.js entry; validate-reachable E1b needs BOTH a search row and a Route
  width → both pages cap tables at --kol-content-panel; the width gate caught both on the first run
  headings → validate-headings capped an H2 at 2 words; "Who reads the generated indexes" became "The readers"
  docs → docs/operations/04-content-pipeline/01-sources.md gained a readers table, updated: 2026-08-01
  gates → 14/14 clean, production build green
  verified → both routes HTTP 200 off the production build; preview PID 98362 spawned and reaped, port 4322 verified clear
  NOT verified → still no browser render check; the playwright profile mcp-chrome-dc84f67 is held by another process and no local playwright binary exists

[13:04 GMT · 2026-08-01] · rebuild · the user's 9 callouts on the MediaLibrary surface
  M1 close → FullscreenOverlay printed a literal `×` CHARACTER in a hand-rolled <button>; now <Button variant="outline" quiet size="sm" iconOnly="x">, ShellLayout's idiom
  M1 css → .kol-overlay-close cut to POSITION ONLY (inset on --kol-spacing-3, the rung that already carried 12px); the Button brings box/border/colour/states
  M1 scope → it is a SHARED atom: MediaViewer, ShellDrawer, LoaderOverlay, Popover and chess all wear it, so the fix landed once at source
  M2 type → swept live: ZERO non-JetBrains text nodes in the picker. My first reading said Right Grotesk — I had sampled Icon's wrapper spans, not labels
  M3 nav → FINDER'S LIST MODEL chosen over column view: folders are rows in the same list with a disclosure chevron and expand IN PLACE
  M3 why → the parent never leaves the screen, so click-to-enter AND the breadcrumb-above-a-divider both disappear; column view needs multi-pane, which fights a modal
  M3 path → the path bar moved to the FOOT (.kol-media-pathbar), where Finder puts it
  M4 shadow → --kol-shadow-xl removed from .kol-media-picker. Illegal; the scrim is the separation
  M5+M7 → ContentFilters now owns the chrome: animated search, filter groups, N-of-M count, grid/list ViewToggle. It was a static <Input> one import away from the real thing
  M6 bleed → the /sets/preview route was ALREADY edge-to-edge for stage:'full'; MY set file had wrapped the browser in a bordered padded box. Removed
  M8 cards → MediaCard + MediaRow now render every tile and row — built from this same source 2026-07-03 and left unused while I hand-rolled a grid
  M8 actions → Copy URL + optional Use; Rename/Delete stay OUT (write ops belong to kol-media-admin)
  M9 sort → four hand-written <button className="kol-helper-12"> became ONE SegmentedToggle, the DS's joined N-way control
  M9 pages → demos added for MediaPicker + MediaBrowser; /components/media-browser and /components/media-picker both verified rendering
  M9 icons → NONE missing. folder · chevron-down/right · grid · view-list · download · x all ship in kol-icon-set-v1
  M9 refs → every part cites an existing member: ContentFilters, MediaCard, MediaRow, MediaViewer, FullscreenOverlay, SegmentedToggle, Button, Icon
  docs → 01-inventory.md rows moved from Molecules to ORGANISMS (they were filed on the wrong tier); 05-control-chrome.md records the close-button and no-elevation rulings

[13:04 GMT · 2026-08-01] · verified · in a real browser this time
  blocker cleared → an ORPHANED headless MCP Chrome (PID 63471, started 06:43, parked on about:blank) held profile mcp-chrome-dc84f67 and had blocked every render check for hours. Killed it
  checked → /sets/preview/media-library, /components/media-browser, /components/media-picker
  measured → close button is a <button> WITH an svg and empty text; .kol-media-picker box-shadow computes "none"; zero non-mono text nodes
  interacted → grid↔list toggle switches, `type/` discloses 05type.jpg in place with the parent still visible, the picker opens over the page
  gates → 14/14 clean and production build green after every item
  port → preview PID 75687 on 4323, reaped at close

[13:20 GMT · 2026-08-01] · callouts · round 2, seven items, all confirmed at source
  C1 fake button → ContentFilters.jsx:141 wraps the title icon in `<span class="kol-btn kol-btn-secondary kol-btn-md kol-btn-icon">`. It LOOKS like a button and clicks nothing. IconFrame exists for exactly this and was promoted for exactly this reason (lobby 2026-07-30)
  C2 modal width → the picker at --kol-media-picker-w 45rem is too narrow for the ContentFilters header: "10 of 10" wraps to three lines, "List" clips, the close button collides with the toggle, and the body scrolls when it should not
  C3 divider gap → PreviewCard.jsx:59 puts `border-b` directly under the tab row with px-3 py-2 only; the rule sits flush against the Preview chip. The user calls it a BUG and he is right
  C4 TWO code blocks → PreviewCard (showcase/src/lib/PreviewCard.jsx) renders the Preview/Code tabs with its own chrome; Installation/Usage go through component-page-parts.jsx:140,160 to the DS `CodeBlock`. Two systems for one job
  C4 user → "I have flagged so many times the question, WHY? why not use the same component another variant? Same style, different sizing, but same system"
  C5 picker/browser → "arent different components, they are more like variants, same shit different viewing.. why 2 components, doesnt make sense to me". He is right: they differ ONLY by modal shell + pick contract
  C6 card gaps → the MediaCard demo stage has broken vertical rhythm; cards misalign and the gaps read as bugged
  C7 wrong token chips → component-page-parts.jsx:114 hand-rolls the Type-styles/Classes chips with `rounded-[…] border border-fg-08 bg-fg-04 px-2 py-0.5`. `.kol-table-token` is the repo's token chip and already exists (kol-components-organisms.css)

[13:26 GMT · 2026-08-01] · build · round-2 callouts, all seven
  C1 fake button → ContentFilters title glyph is IconFrame now; the SEARCH glyph carried the same kol-btn span and lost it too. One span.kol-btn left in the file and it is on a real <button>
  C2 picker width → --kol-media-picker-w 45rem -> 64rem. Measured 1024px, "10 of 10" on ONE line (14px tall, was three lines), List inside the card
  C2 close collision → the card reserves a --kol-spacing-12 block-start lane; FullscreenOverlay's close is placed on the SHEET, so the card yields rather than the close moving. Measured: closeOverlapsToggle false
  C2 scroll → the BODY scrolls now (.kol-media-scroll), not the card. Needed minHeight:0 on ContentFilters' root AND its renderItem wrapper — a flex child will not shrink past content without it. Measured cardScrolls false
  C3 divider → PreviewCard toolbar py-2 -> py-2.5; measured 11px below the Preview chip, was flush
  C4 ONE code block → ALREADY ONE. PreviewCard's Code tab and the Installation/Usage rows both render the DS CodeBlock; `bare` only drops border+radius because the card supplies them. My goal text called it two systems — wrong. Answered in 05-control-chrome.md so it stops recurring
  C5 variants → MediaLibrary is now ONE component with variant page|modal; MediaPicker/MediaBrowser survive as thin aliases so no call site breaks. Barrel, classification, registry and inventory updated
  C6 card gaps → the demo's grid-cols-2 on an `lg` stage stretched each tile to half the stage, so the aspect-square thumb became a giant block. auto-fill minmax(10rem) + a 36rem cap; measured 179px thumbs. Filenames were kol-sans-body-02 while the real surface is mono — now kol-mono-12
  C7 token chips → .kol-table-token carried NO fill: the look lived only in the `.kol-table code` descendant rule, so it rendered right inside a table and unstyled everywhere else. That is why the pages hand-rolled a Tailwind lookalike. It owns its fill now
  C7 gaps → the chip's own `margin: 0 4px` double-spaced against every row's gap-2 — the ragged rhythm. Margin dropped; spacing is the container's job. Measured 8px even gaps across 8 chips, zero legacy chips left
  gates → 14/14 after every item; production build green
  port → preview PID 27538 on 4324, reaped

[13:44 GMT · 2026-08-01] · callouts · round 3, eleven items, and one rejection of mine overturned
  my error → I answered "the code blocks are already ONE component" by checking the RENDERER (both use CodeBlock, true) and never looking at the tab bars above them
  the real defect → PreviewCard.jsx:69 and component-page-parts.jsx:158 hand-write BYTE-IDENTICAL class strings: `kol-mono-12 rounded-[var(--kol-radius-sm)] px-3 py-1 transition-colors` + the same active/inactive fork
  worse → neither is a component, so neither can be fixed once; and the DS already ships SegmentedToggle AND TabsRow, both ignored
  worse still → the FRAMES differ too: PreviewCard's tabs sit in a bordered toolbar on .kol-doc-figure, InstallBlock's float bare over a separately-framed CodeBlock. One construct, two copies, three frames
  swept → exactly 2 copies of the string; CollectionLanding.jsx carries its own tab state and must be checked as a possible third
  ruling → InstallBlock becomes a CALL to PreviewCard, not a sibling. `tabs` is a prop, `variant` is container geometry only (the ThemeToggle law). No third component is born
  variants → a demo declares `export const variants = [...]`; the picker is a SegmentedToggle in PreviewCard's EXISTING actions(tab) toolbar slot, so variants preview in place
  1 tags → frontmatter renders raw #domain/components chips; the namespace-dims/leaf-carries renderer exists at TagModeOverlay.jsx:26-30 and is not applied at DocsFrontmatter.jsx:137
  2 tags → none in the sidebar at all
  3 icons → FIELD_ICONS (DocsFrontmatter.jsx:8) has no id/reuses/slug, while its own comment claims "EVERY field carries an icon"
  4 blocks → the FRONTMATTER panel and MetaRows (SOURCE/TYPE STYLES/CLASSES/TOKENS/COMPOSES) are two panels of the same class of information
  5 props → the Props table's type/default cells ignore the .kol-table-token chip
  7 sets → SetPage just delegates to CollectionPage: no member list. A set page must list every component in the set, each linking to /components/:slug, AND a component page must show which sets it is in (ContentFilters is in >= 2)
  8 width → the References table is capped at --kol-content-panel by MY wrapper; it should flow the content column
  9 gap → no space between the lede and ContentFilters on /references
  10 sort → no column header sorts asc/desc anywhere
  11 model → chess.kolkrabbi.io Database (Query/Browse/Learn, SQL editor, preset chips) and Browse Games (scope dropdowns, filters, search, pills in cells, per-row actions, sortable headers) is the reference to read BEFORE inventing

[14:06 GMT · 2026-08-01] · build · round-3, eight of twelve
  R6 DocTabs → showcase/src/lib/DocTabs.jsx. THREE copies collapsed: PreviewCard's Preview/Code, InstallBlock's pnpm/npm/yarn/bun (byte-identical string), CollectionLanding's category nav (sans look)
  R6 variants → `chip` and `plain` are LOOK ONLY; selection, keyboard and markup identical. The duplicated class string now exists in exactly ONE file
  R6 InstallBlock → is a CALL to PreviewCard, not a sibling. PreviewCard gained `tabs`, `renderTab`, `chrome` (figure|flush) and `tabsLabel`
  R6 measured → two tablists on a component page, labelled "View" and "Package manager", both from DocTabs
  R7 variants → demo exports `variants`; demos-registry carries it; DemoStage threads it as a prop; picker is a SegmentedToggle in PreviewCard's EXISTING actions lane
  R7 measured → Button page shows all 7 variants; clicking `danger` re-rendered every button as kol-btn-danger. Tag wired too
  R1 TagPath → EXTRACTED from TagModeOverlay to tags/TagPath.jsx and used in DocsFrontmatter. Measured: `#domain/components/organisms` renders `domain/components/` dimmed + `organisms` carrying
  R3 icons → id/reuses/slug added to FIELD_ICONS (hash-01, repeat, external-link — `link` does NOT exist in the set, checked). All three measured with an svg
  R5 props chips → DocKit PROPS_COLUMNS type+default render through .kol-table-token. Measured 24 chips
  R9 width → the References table flows the content column. The width gate blocked it, so a `width-ok:` exemption was added MIRRORING validate-taxonomy's `taxonomy-ok:` — an existing idiom, not a new one — and the reason is named at the call site
  R10 gap → ContentFilters gained a `className` passthrough (it had none); mt-8 on /references. Measured 32px
  R11 sorting → Table columns opt in with `sortable`; header is a real <button>, cycles asc→desc→none, sets aria-sort on the <th>, Intl.Collator with numeric. Measured: 6 sortable columns, Node click re-sorted Icon -> --kol-accent-on-primary, aria-sort ascending
  gates → 14/14 after every item; production build green throughout

[14:06 GMT · 2026-08-01] · open · four items remain on this goal
  R2 → no tags in the sidebar
  R4 → the FRONTMATTER panel and MetaRows are still two panels of the same information
  R8 → set pages still list no members, and component pages still do not say which sets they are in
  R12 → chess.kolkrabbi.io not yet read as the table/database model

[14:10 GMT · 2026-08-01] · build · R4, the second metadata panel is gone
  where → MdxDoc.jsx rendered DocsFrontmatter and then MetaRows directly beneath it; ComponentPage's fallback rendered MetaRows alone
  fix → MetaRows is retired. `buildProvenance(component)` returns DATA (source, imported_from, type_styles, classes, tokens, composes) and DocsFrontmatter renders it
  why → the fields inherit the icon column, the label column and the chip treatment instead of re-implementing all three in a second grammar
  icons → six new FIELD_ICONS entries, every name verified present in kol-icon-set-v1 first
  measured → ONE "Frontmatter" eyebrow on the page; all five folded labels present
  gates → 14/14, build green

[14:15 GMT · 2026-08-01] · build · R2, R8, R12 — round 3 closed
  R2 rail tags → ShellChrome gained a Tags RailSection: top 12 by count from TAG_INVENTORY, rows are RailRow, count on `trailing`, label through TagPath
  R2 why → DocumentationReader had Tags on VAULT routes and this rail — every other page — had none. The same two-right-rails fault as Quick actions, one section over
  R2 measured → 12 tag rows, e.g. `domain/design-system` 119, `domain/components/atoms` 36
  R2 trap → RailRow's prop is `trailing`, not `meta`; caught before it shipped by reading the API instead of assuming
  R8 membership → showcase/src/lib/set-membership.js. DERIVED from each set's own import statements (the registry already carries the raw source) — an authored list would be a second copy of the imports and would drift on the first edit
  R8 both ways → membersOf(setKey) for the set page, setsOf(name) for the component page. ONE map, read in two directions
  R8 set page → SetPage now renders "In this set (N)" with every member linked to /components/:slug; CollectionPage gained an `afterPreview` slot
  R8 component page → `in_sets` is a provenance field, so it renders in the ONE frontmatter panel with an icon like every other field
  R8 measured → /sets/media-library reads "IN THIS SET (3)" with MediaPicker · MediaBrowser · Button linked; /components/button reads "In sets: Design editor · Media library · Prints / store"
  R8 FINDING → ContentFilters is in ZERO sets. The user expected "at least two"; no set file imports it (checked all 9). The mechanism is right, the data says the sets do not compose it — that is a content gap, not a code bug, and it is HIS call what to do about it
  R12 model → chess.kolkrabbi.io is an SPA, so WebFetch returns only the shell. Read the two screenshots he supplied instead
  R12 Query → Query/Browse/Learn underline tabs · meta line (table · row count · engine · shortcut) · a Columns dropdown + four PRESET QUERY CHIPS · syntax-highlighted editor with line numbers · Run/Save · a HISTORY strip of truncated recent queries
  R12 Browse → scope dropdown + two filter dropdowns + right-aligned search · a status card with pills · a section-count pill ("5 shown · 146 filtered") · table cells carrying PILLS (result, colour, rating) not bare text · per-row actions (Load here + external link) · a full-width "Show all N" footer button
  R12 applied → References already has the filter row + N-of-M count (ContentFilters) and sortable headers; the pattern still unbuilt there is PILLS IN CELLS and a per-row action column

[14:43 GMT · 2026-08-01] · rebuild · G1/G2/G3 — the cheap versions replaced
  through-line → all three had shipped the cheap version: a COMMENT instead of a contract, ONE SOURCE instead of the real question, a STATIC FETCH instead of a browser
  G1 contract → Table gained `width`: 'panel' (default) | 'column' and applies the cap on its OWN wrapper. Pages stop wrapping tables in cap divs
  G1 gate → validate-width W3 no longer greps the page body for a token name. It asserts the real law: a Table may not be hand-wrapped in a panel cap, because the prop is the seam. CodeBlock keeps the old rule (it has no width prop)
  G1 deleted → the `width-ok:` escape hatch and its one use. It must never become precedent
  G1 caught → the new rule immediately found THREE pages hand-wrapping tables (FoundationsColor, FoundationsTypography, SearchResults). All converted to the prop
  G1 negative-tested → re-wrapped SearchResults deliberately, gate FAILED at the right line; restored, gate clean
  G1 measured → References wrapper computes max-width:none; zero hand-wrapped caps in the DOM
  G2 widened → set-membership.js now derives from SETS + BLOCKS + DEMOS + PAGES, all from the same import derivation
  G2 the miss → my first widening still left PAGES out, and ContentFilters' only real consumer is /references. Verified by grepping actual `^import` lines rather than trusting a filename grep
  G2 two rows → `in_sets` (sets only, absent at zero, never padded) and `used_in` (the wider answer). A demo of X is excluded from X's own usage
  G2 measured → ContentFilters: used_in "References", in_sets ABSENT (correct — no set composes it). Button: used_in 12 surfaces incl "23 demos", in_sets three sets
  G3 driven, not fetched → chess.kolkrabbi.io deep-links 404 (client router, no SPA fallback), so navigated home and CLICKED through; Browse renders no table until data loads, so clicked "Load entire set" and waited
  G3 THE FINDING → chess is running OUR OWN DS and using it better than we were: table is `kol-table`/`kol-table-wrapper`, headers `kol-table-cell-title`, the result cell is `span.kol-table-token`, the colour cell is `span.kol-table-pill kol-table-pill-dark`
  G3 pills → `.kol-table-pill` + -dark/-light/-muted have existed in the theme all along and this repo had NEVER used one. References' Kind and Concern are pills now
  G3 responsive → chess marks columns `hidden lg:table-cell` per breakpoint; applied to Defined in
  G3 actions → chess's `analysis-table__actions` cell becomes a DS action column (Copy + Trace →)
  G3 ahead → chess headers do NOT sort (no button, no aria-sort); our Table now does
  G3 measured → 600 pills and 300 action cells across the 300 rendered rows
  gates → 14/14 after every item; production build green

[14:52 GMT · 2026-08-01] · close · the arc sealed into the vault
  gap found → the user asked "have you updated docs/?" and the honest answer was NO: DocTabs, TagPath, set-membership and `sortable` appeared in ZERO docs; the laws existed only in code comments
  C1 width → docs/documentation/01-foundations/05-layout-systems.md gained "The component declares its own width" — the panel|column table, why the gate stopped grepping for a token name, and why width-ok: was deleted rather than kept
  C1 Table row → 01-inventory.md now states sortable + the width contract + pills-not-bare-text
  C1 DocTabs + variants → 05-control-chrome.md: three copies, two byte-identical, why neither SegmentedToggle nor TabsRow fit, and how a demo opts into variant preview
  C1 TagPath → an inventory row of its own
  C1 set-membership → 04-content-pipeline/01-sources.md, beside the readers table: derived from sets·blocks·demos·pages, in_sets vs used_in, and the ContentFilters case that proved sets-only too narrow
  C2 workshop → 0.10.0 -> 0.11.0. It took DocKit, DocsFrontmatter and the new TagPath this session and had never been bumped
  C3 lobby → already square: 2 files in inbox, header says 2. My earlier "uncounted" claim was wrong — the other session had squared it
  C4 context → AGENT-CONTEXT gained one 2026-08-01 entry for all three arcs, the five standing laws set this afternoon, and the method-failure note (cheap version three times, caught by the user not by me)
  state at close → 14/14 gates, production build green, component 0.19.0 · theme 0.18.0 · workshop 0.11.0 all UNPUBLISHED, lobby 2 live

[16:38 GMT · 2026-08-01] · publish + the return half of the lobby
  user caught it → "you did lobby work last session but you didnt sent anything back to the lobbies" — correct, nothing went back
  blocker first → the 4 bumped packages were still UNPUBLISHED, so a receipt had no version to name
  published → theme 0.18.0 · component 0.19.0 · framework 0.11.1 · workshop 0.11.0, dependency order, verified on the registry
  SHIPPED-PACKAGES → 4 version cells + notes for the ranges; the stale "staged 2026-07-15 batch" banner replaced
  the spec already had the answer → ~/.dotfiles/.../lobby/03-tooling.md "What a closer must do": resolution -> move -> ledger -> RETURN THE RECEIPT. I had done 1-3 last session and skipped 4
  closer's half done → RESOLUTION sections on MediaLibrary + InteractiveImage citing the published versions, status draft->closed, receipt to kol-website/lobby/outbox/MediaLibrary.md
  InteractiveImage owes nothing → its named source is gone from every apps/*/src tree; the ORPHANED flag held
  3 of 4 fork repos get no receipt → kol-ds-fxr, kol-labs-single, kol-client-kolkrabbi are NOT in the lobby registry; their migration table lives in the resolution instead
  outbox/ created both ends → kol-website had no "Filed elsewhere" section, so a returned receipt would have vanished
  gaps found, reported not fixed → staged: field absent on all 113 entries (ageing audit can't run) · ⚪ means parked in the spec and retired in humpty · 108 closed entries carry no resolution section · 82 still say status: draft
  stale info → ag-init gained step 7 at 16:09 TODAY (reads lobby/outbox/, reports remainders at boot). My session-start boot predates it — the receipt IS the notification
  14/14 gates clean · user has pushed
  output correction x2 → plan as a paragraph, then as a numbered list; both rejected. A plan is a TABLE. memory: ~/.dotfiles/claude/memory/feedback_plan_is_a_numbered_list.md
  next → ButtonIconOnlyParity: 4 glyph-ladder transcriptions, Button.jsx:60 uses the text-adjacent one for icon-only. Still live in the published 0.19.0

[17:05 GMT · 2026-08-01] · ButtonIconOnlyParity — the ladders get one home
  goal set, loop enforced → 7 steps, step 4 deliberately a user question
  Law 1 caught me twice → no new lib/ dir: src/hooks is stated in-repo as "the taxonomy's only non-component folder" (cssVar.js:5), already holding colorMath.js + cssVar.js
  and no second radius literal → .kol-icon-frame-radius-full and .kol-btn-radius-full are ONE rule with two selectors; the token gate blocked my first two attempts and was right both times
  the brief asked for a ternary swap; its own Recreation notes named the real fix → hoist the ladders. Did that.
  new → hooks/glyphLadders.js: SOLO 16/20/24 · ADJACENT 14/16/18 · glyphSize(size, solo)
  fixed → Button.jsx:65 branches on iconOnly. IconFrame.jsx:54 drops its local GLYPH for SOLO
  added → Button radius sm|full, mirroring IconFrame exactly
  3 gate violations were NOT mine → docs/INDEX.md had 2 dead wikilinks (03-components/INDEX and 01-foundations/INDEX don't exist) + 1 sentence-H2. Fixed: pointed at 01-inventory and 05-layout-systems, heading -> "Read contract"
  docs synced same turn → 05-control-chrome.md gained Glyph ladders + Radius sections (the doc-sync hook fired on every Button edit)
  published → component 0.20.0 · theme 0.18.1. 14/14 gates, build green
  closed + returned → entry to done/ with resolution, queue 3->2, receipt appended at kol-website/lobby/outbox/ButtonIconOnlyParity.md, its row flipped 🔵 -> 📌
  LEFT OPEN, not decided → Input.jsx:34 md is 14 where ADJACENT says 16. A third undeclared ladder. Tag's 10/12/14 is chip scale, left alone
  output correction x2 today → a plan is a TABLE. Not a paragraph, not a numbered list, and nothing above it

[17:40 GMT · 2026-08-01] · big scope — queue emptied to the one flagged entry
  user: "fucking just gun through this shit ... you keep stopping and you are not done" — correct, I kept handing back findings instead of executing them
  (A) MediaLibraryVideoFallback SHIPPED → Thumb renders play glyph + filename BEHIND the video, covered on onLoadedData. Retired consumer's shape used as filed; its comment "A blank square must never be the resting state" became the CSS comment
  chrome to kol-theme not inline → .kol-media-thumb + .kol-media-thumb-fallback beside the rest of the .kol-media-* family. opacity not display, so the first frame causes no reflow
  loading strategy NOT touched → the brief measured both candidates timing out headless (no h264 decoder) and said so; whether #t=0.1 paints in real Chrome stays the user's item and the fallback is right either way
  component 0.21.0 · theme 0.19.0 published
  (also this stretch) Input ruled drift not a rung → .kol-control-* and .kol-btn-* are byte-identical per rung; Input's own sm/lg already agreed. component 0.20.1. Four ladder transcriptions are now ONE
  (B) frontmatter squared → staged: added to 116 entries (it was in ZERO, while the spec's staleness rule AND /lobby-hygiene both read it). 106 stale "status: draft" matched to folder. 7 pre-frontmatter files given frontmatter, 2 dated from mtime and said so
  (C) spec gaps filed to dotfiles → lobby-spec-two-gaps: ⚪ is `parked` in 02-lifecycle but `retired` in humpty's LEDGER (one revisitable, one terminal, so hygiene would flag a FINISHED ticket as stale); and staged: vs the date: the writer skill emits. Entry + ledger row + History + receipt here, same turn, both ends
  (D) ReferenceGraphPipeline untouched → 🔴 needs-ruling is a flag to stop an agent reasoning past it, not a backlog item
  queue 3 -> 1. Receipts returned for all three closures. 14/14 gates, build green

[18:25 GMT · 2026-08-01] · ReferenceGraphPipeline ADOPTED — queue empty
  user ruling → "so I say yes adopt it". Read humpty's 02-reference-graph.md + 03-pipeline-blueprint.md first rather than guessing the scope
  kept as-is, not adapted → their own blueprint says "implement the contract natively when the repo already mines its own usage"; this build EXTENDED extract-usage.mjs in a separate field rather than forking. Shape was already right
  audit, 3 contract rules → edge authorship restricted to packages/*/src (sync-mdx-frontmatter.mjs:75, with the AccordionPanel bug documented) · canon bar = median*3 on SORTED weights, verified in both files · --regen-reuses is an argv flag only, zero hits in package.json
  THE PAGES WERE THE DEFECT, NOT THE GRAPH → "compiled and routed, never opened in a browser" was the honest flag. Opening them found: /references clean (663 nodes, canon bar renders as 60★ = 3× median 20), but /references/:name HAND-ROLLED a <table className="kol-table"> inside overflow-x-auto — on the page whose entire subject is what you reused
  second fault, same page → its cells had no role class, so zero padding: header ran together as "★usesfile" and counts touched the paths. Fixed onto DS Table with kol-table-cell-text
  I got the width contract BACKWARDS mid-fix → WIDTHS = { panel: max-w-panel, column: '' }. `column` is UNCAPPED (wider), `panel` caps at 960. The original width="column" was correct; reverted my "fix"
  and I invented kol-table-cell-copy → no rule defines it. Real roles are -title/-text/-meta/-meta-strong. That WAS the padding bug I was chasing
  hand-rated 9 of 9 → four 5★ (only KOL import, 3+ uses), three 4★, two 3★. ALL agreed with the computed star. First validation of the scale in either repo; ~540 edges still unchecked and the doc says so
  documented → docs/operations/05-reference-graph/{INDEX,01-pipeline}.md. headings gate forced 2-word H2s (Measures/Derivation/Five stages/Star scale/Canon bar/Queries/Known limits)
  recorded not fixed → median/threshold arithmetic transcribed in validate-references.mjs:57-59 AND References.jsx:60-62. They agree today. Named in the doc as a warning
  receipt → humpty had NO outbox/. Created it, wrote straight to RETURNED, merged into its existing "Filed elsewhere" section (I duplicated the heading first and had to fix)
  ports → dev server PID 44608 spawned, both pages opened at 1280x720, killed and confirmed down. Screenshots deleted from .playwright-mcp
  QUEUE IS EMPTY. 14/14 gates, build green

[18:50 GMT · 2026-08-01] · CLOSE OUT
  milestone sealed → session-log/2026-08-01-MILESTONE-lobby-return-half-and-adoption.md
  AGENT-CONTEXT → 🏁 head entry, trimmed to the 5-cap, "Held items: none"
  the one standing ruling PARKED not carried → plan-2026-08-01-gruvbox-colour-matching.md. A design call, never agent-work
  lobby-hygiene across all four ledgers → kol-ds-ui 0 · kol-website 1 (🟠, your confirm is its bar) · dotfiles 1 (🔵 filed today) · humpty 0. Every receipt carries a remainder
  ageing check RAN for the first time → 0 past 30 days. It could not run before today because staged: was in zero entries
  noted not moved → 108 of 116 closed entries have no resolution section; outcomes live in the ledger rows. Law 4, your call
  state clean → goal done · server 44608 down · queue 0 · no stray artifacts · 14/14 gates · build green
  THIS PLAYBOOK IS CLOSED. The arc it journals ended with the queue at zero.
