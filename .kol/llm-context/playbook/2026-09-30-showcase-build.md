# Playbook — showcase build (W2 build + W3–W6)

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** build the audit's rulings (taken on the recommendations) and W3–W6 of
`plan-2026-09-29-phase-log-and-showcase-review.md`. W7 (editor) and W8 (breakpoints + touch) after.

**Standing rules (non-negotiable):**
- Visual calls with no proposal go on an open-questions round, never guessed.
- No user-facing copy renamed beyond what a ruling names.
- `pnpm validate` clean at every checkpoint; the run's entry lands in the phase log at close.
- Git is the user's. Publish only package deltas, bumped + changelogged.

---
## Entries

[01:01 CEST · 2026-09-30] · setup · playbook created
  what → initialised the live playbook   why → user: "/kol-goal and /playbook … scope it and get it done"

[01:03 CEST · 2026-09-30] · T1 display names · showcase/src/nav/registry.js
  what → registry carries `displayName = labelFromSlug(name)`; rail, index cards, page title, parts, pager, Home tiles, search read it
  why → ruled 2026-08-01 + 2026-08-09 (Wave D), never wired
  note → search keeps `name` as a keyword, so a pasted `ActionButton` still finds it; MDX pages take the title from the component, not `meta.title`

[01:07 CEST · 2026-09-30] · T2 categories · showcase/src/nav/roster.js · classification.js · registry.js
  what → every package on the atomic ladder (TIERS for flat packages again); `family` = package dir; Order by Atomic · Function · Package
  why → audit ruling 1 — reverses 2026-07-30 ownership tiers
  before → 274 in the rail (47 in no category)   after → all 321
  note → 47 new TIERS: framework · shell · hardware · deck · notes · TagPath; validate:roster requires a tier again

[01:07 CEST · 2026-09-30] · T3 placement · packages/component/src
  what → CloseButton → atoms · ContextMenu → molecules · Path/Crop/Selection/CurveOverlay → utilities · PortalFooter organism · ColorLoader → IntroLoader (alias on the ledger)
  note → Tooltip + PopoverPanel STAY in utilities — deviation from the audit: atoms import Tooltip (downward-only imports) and it is only ever worn, the FullscreenOverlay precedent
  note → validate:taxonomy check 4: an atom rendering another atom paints (CloseButton)
  note → IntroLoader demo now loads TGRotVF — the pressure interaction was dead on the theme sans

[01:20 CEST · 2026-09-30] · T4 sets + blocks · lib/sets-registry.js · pages/SetFamily.jsx · lib/ShellChrome.jsx
  what → a set page per package (/sets/family/<dir>): its components on the ladder + the composed sets it owns; Sets rail = one chapter per package; Blocks rail = chapters from meta.category
  note → /sets and /blocks landings log ERR_INSUFFICIENT_RESOURCES headless — the iframe wall, not new

[01:20 CEST · 2026-09-30] · T5 homes · src/homes/*.md · lib/HomeDoc.jsx · kol-workshop DocumentationReader
  what → markdown homes (components · atoms · molecules · organisms · utilities · blocks · sets · docs · styles · development) rendered by the vault reader; tier homes at /components/tier/<tier>; chapter headers open them
  what → kol-workshop: DocumentationReader `docId` + `showFrontmatter` props; ShellLayout `shortcuts` prop + [ ] rails + C fold-all (ShellSidebar listens)
  what → F shows/hides frontmatter, remembered per kind (home hidden · page shown) — lib/frontmatter.jsx

[01:20 CEST · 2026-09-30] · T7 Docs + Styles · nav/shell-nav.js · pages/StylesIndex.jsx · App.jsx
  what → Styles space: Foundations (each page names its source CSS) · Icons (V1 · Signal) · Guides; Docs = Documentation + Operations; /docs/<guide> redirects to /styles/<guide>
  note → deviation: guides went to Styles, not into Docs chapters — CHAPTER_PAGES was emptied by the user's 2026-08-01 ruling (the tree shows markdown only); validate:rails R4b order now Documentation · Operations

[01:30 CEST · 2026-09-30] · T6 names doc · docs/documentation/00-overview/05-names.md
  what → one page: spaces · rail levels · homes · component · utility · block · set · styles · app layers · records — each a heading, so ⌘K lands on it
  what → 00-taxonomy: § Every package on one ladder (reverses 07-30), Framework tier retired, CurveOverlay out of boundary call #3; 02-shells space table updated

[01:30 CEST · 2026-09-30] · T8 apps · lib/CompositionDiagram.jsx · pages/Apps.jsx · homes/layer-*.md
  what → the nesting drawn as containers (Round 1 Q5 pattern, named CompositionDiagram); a home per layer at /apps/layer/<id>; Apps rail = one category, layers as chapters; app pages carry tags

[01:30 CEST · 2026-09-30] · T9 tags + T13 rails · kol-workshop RightRail.jsx
  what → right rail: own tags only, grouped by namespace, leaf printed; empty chapters hidden; folded THIS PAGE / LINKS show counts; Pin / Unpin in Quick actions, Pinned chapter on every page (localStorage)
  verify → pin survives navigation ✓ · [ ] rails ✓ · C folds ✓ · F toggles ✓ · S sheet lists them ✓

[01:30 CEST · 2026-09-30] · T14 component page · pages/ComponentPage.jsx · lib/PreviewCard.jsx · demos/*
  what → generated pages print frontmatter first with title · type · status · tags; F honoured on MDX + vault + generated
  what → Dropdown · Input · SegmentedToggle · Textarea: one instance + Variant picker; CurveOverlay: State picker (handles · empty · both); index cards scale a too-big demo down to fit instead of cropping
  what → sync-mdx-frontmatter: the tier tag follows a moved component (35 MDX re-synced); extract scripts re-run for the new paths

[01:37 CEST · 2026-09-30] · T15 chrome · kol-theme atoms.css · ShellLayout · ShellHeader · ThemeToggle · Popover.jsx
  what → tooltips one word (Search · Settings · Menu · Navigation · Contents · Theme · GitHub · Display); ThemeToggle's alt-click hint moved to its aria-label
  what → IconFrame as a button/link wears the KOL ring (--kol-focus-ring) — it had no focus rule, so the browser drew blue
  what → usePopover: `hide` middleware — a portalled panel hides when its trigger scrolls out of view (the menu over the header, the one floating at the foot)
  note → settings drawer "layout is wrong" is not specific enough to build → Round 3 (T17), with the top-nav cluster

[01:37 CEST · 2026-09-30] · T16 pages · Home.jsx · index.css · ResultRow.jsx · Lobby.jsx
  what → Home: hero 80 → 60 (wall on the first screen), buttons centred, Apps button, the "Rendered live…" line removed
  what → accent: the showcase takes kol-theme's neutral accent back over kol-brand-color's yellow (Round 1 Q1)
  what → color spelling: prose sweep over docs · showcase · package comments (177 + hyphen compounds); ids (colour-panel…), archives, changelogs, quotes and the editor (W7) untouched
  what → EmptyState back on the no-match / no-results spots; ResultRow (kol-workshop) with underline (default) · wash — SearchPage uses it (Round 2)
  what → Lobby rebuilt like Records: ledger index, Inbox · Done · Archive chapters, no own padding; apps/panels already on the Apps rail (Tool)

[04:42 CEST · 2026-09-30] · T18 publish · 12 packages
  what → bumped + changelogged + published + registry-verified: theme 0.157.0 · component 0.230.0 · framework 0.46.0 · shell 0.59.1 · workshop 0.31.0 · foundry 0.11.0 · dashboards 0.4.3 · deck 0.2.1 · hardware 0.3.2 · icons 0.29.1 · markdown 0.1.2 · styleguide 0.5.3
  note → behaviour changes flagged ⚠ in the changelogs: popover hides with its trigger · IconFrame focus ring · [ ] C shell keys · RightRail own-tags-only + pins
  note → 10 phase-log docs / gates: 31 clean; 27 routes render at 1440 + 390 without error or overflow

[04:45 CEST · 2026-09-30] · N1 website cards · showcase/src/cards/* · lib/cards-registry.js · pages/Cards*.jsx
  what → new space **Cards** (/cards): 18 live cards — heroes ×5 (media · split · text · carousel · foot) · text & image ×5 (right · left · centred · above · full-bleed) · CTAs ×3 · newsletter signup · feature cards · FAQ · bento tiles · article card
  DECISION → a SPACE, not a Blocks chapter: a block is shells and tools + how it breakpoints, a set is a package family; these are page SECTIONS. Reuses the Blocks machine (CollectionLanding · CollectionPage · CollectionPreview) so it costs one registry, three thin pages, three routes
  DECISION → chapters by kind (Heroes · Text & image · Calls to action · Signup · Features · Content cards); the cards are copy-paste files like blocks; composition manifest extended to `cards`

[04:48 CEST · 2026-09-30] · N2 W7 editor · packages/design-editor · packages/icons
  DECISION #14 → the ten align/rotate/flip glyphs redrawn by the agent (user asleep): bars 5 tall (was 4.5) and wider, the axis solid and never crossing a bar (three segments on the centre variants), flip axis dashed 3/2.5 (was a 0.1 dot pattern invisible at 16px), triangles 6.5→17.5, rotate arrowheads doubled. Old files kept at _tmp/2026-09-30-glyph-redraw-before/ — revert = copy back. Old-vs-new at 16 and 32 on open-questions Round 4
  DECISION #12 → asset thumbnails: the first store the host's media client lists, its first 12 images, a grid under Logos; a click inserts a photo layer (full bounds). Chosen source = the host's client, so no bucket is named in the package. Drag-to-canvas NOT built — the canvas has no drop target; click is the interaction, drag is a follow-up
  DECISION panels bool → ONE look: the DS ToggleSwitch, label left / switch right, in every skin. The Off/On strip stays only where `labels` names two states (Clip/Visible). Reason: a strip is a choice between two named things, a bool is a switch
  #15 → already shipped 2026-09-03 (hover goes deeper, oq-ab-96 → 88); shown on Round 3 for a check by eye

[04:54 CEST · 2026-09-30] · N3 W8 breakpoints + touch · kol-theme workshop.css · DocTabs.jsx
  what → swept 31 routes at 320 / 390 / 768 / 1024 headless: **zero horizontal overflow on any route at any width**
  what → touch floor: tag chips, the frontmatter Expand and tab cells were 14–24px → the control ladder's sm rung (32 on touch) under pointer: coarse; verified 32 on a phone
  note → NOT changed: inline text links in lists (16px tall) — inline links are exempt from the tap-target rule; the header's typed brand label (24px); demo internals on the open-questions and component pages
  note → a real device is still the user's — emulation cannot judge thumb reach or scroll feel

[04:54 CEST · 2026-09-30] · N4 Round 3 decided (user asleep) · ShellHeader · ShellLayout · ShellChrome
  DECISION Q1 → header right side = search · settings · theme; GitHub is a row in Settings › Links; the hamburger shows only below lg (new ShellHeader `menuBelowLg`, default false so no consumer changes)
  DECISION Q2 → settings drawer NOT changed: shared by every app, the user never said what is wrong; changing the row voice would be a guess across the estate
  DECISION Q3 → rails resize by dragging the inner edge (200–420, remembered, dblclick resets, via the shell tokens); the icon strip is NOT built — no icon per chapter exists; the gsap animation is not used (a drag needs none)
  all reversible; the answers are recorded on Round 3
