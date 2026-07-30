# Playbook — showcase cleanup run

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** the /kol-goal run of 2026-07-29 night — (1) link-color per-repo hook (kill placeholder blue), (2) breakpoints lookup folder in docs/documentation, (3) arc-2 fixes (ghost-divs · preview responsiveness · breakpoint buttons), (4) spec/IA arc start (sets→filtered collection · blocks→compositions · Table spec page).

**Standing rules (non-negotiable):**
- git is the user's; publishes are the agent's (/upig)
- proposals with visual surface go through /tmpl-proposal staging
- every named file gets its repo-relative path
- link color law (user, tonight): the DS ships NO link color — `--kol-link` is a per-repo hook

---
## Entries

[23:15 GMT · 2026-07-29] · setup · playbook created
  what → initialised the live playbook   why → /kol-goal run spanning 4 workstreams; journal as we go

[23:21 GMT · 2026-07-29] · link-color · packages/theme/{kol-color.css:44,kol-base-tokens.css}
  what → --kol-link/--kol-link-hover default currentColor; dark + mirror blue overrides removed   why → user law: DS ships no link color, per-repo hook
  before → #2563EB/#1D4ED8 light · #60A5FA/#93C5FD dark   after → currentColor everywhere until repo binds
  verify → theme 0.12.0 published ✓ · tokens doc + LLM_RULES bulletin + SHIPPED-PACKAGES synced ✓
  note → .kol-table a keeps underline (affordance survives colorlessness)

[23:29 GMT · 2026-07-29] · breakpoints-docs · docs/documentation/08-breakpoints/ (5 files)
  what → lookup folder: INDEX + 01-values + 02-best-practices + 03-methods + 04-kol-ds-rules   why → user ask (a)
  note → found+fixed STALE tier table in 01-foundations/04-layout-breakpoints.md (page/wide tiers died 0.11.22, doc still listed them); front-door INDEX row added

[23:25 GMT · 2026-07-29] · arc-2 · showcase/src/pages/Home.jsx:101 + lib/BlockViewer.jsx
  what → ghost-divs root-caused + fixed: GhostFlank width hardcoded 1600 while wall re-capped to shell 1800 (07-28) → flanks 0-width/buried; now var(--kol-content-shell)   why → the "disappeared ghost-divs" regression
  verify → 2560 viewport: both flanks 372px, 10 cards each ✓ shot _tmp/showcase-theme-check/ghosts-restored.png
  note → BlockViewer breakpoint buttons MEASURED HEALTHY (desktop 1280-scaled/tablet 768/mobile 390, inner MQs fire true, drag works, chip clears); fixed 8px scale-math drift (handleW 24→w-4=16); earlier "dead drag" was my off-screen test artifact
  note → REAL previews issue = architectural: inline DemoStage (component pages, Home tiles) responds to VIEWPORT not stage width — needs user ruling on approach; reported, not improvised
  note → timestamps in the two entries above drifted (+4/+9 min) — pre-written; two-step ritual from here

[00:02 GMT · 2026-07-30] · embed-flag · showcase/src/lib/{useEmbed.js,TopBar.jsx,DocLayout.jsx}
  what → ?embed=1 renders main content only (no topbar/sidebar/TOC) for iframing showcase pages into other repos   why → user ask: show /components in the website with no navigation
  note → LAYOUT-level not page-level: read by the 2 chrome hosts, so every page through them is embeddable, zero page edits
  note → rails UNMOUNTED not CSS-hidden (a class still reserves rail width + sticky containers); content padding kept; latched per document so in-frame nav can't pop chrome
  verify → /components?embed=1 → main left 48px (was 272), width 1304 (was 856), rails 2→0, no topbar wordmark/nav ✓ · /docs/type-roles?embed=1 clean ✓ · in-frame nav to /components/:slug stayed chrome-less ✓ · no h-overflow ✓ · shot _tmp/showcase-theme-check/embed-docs.png
  note → nav rework can't break it: embed is defined by ABSENCE of chrome

[01:04 GMT · 2026-07-30] · workshop-nav phase 1 · packages/{framework/src/ShellHeader.jsx,workshop/src/**}
  what → converged the website's evolved workshop-system INTO the package + fixed the 5 carried defects   why → website is the truth (user); it aliases @kolkrabbi/kol-workshop → its own src, so both copies carried the same bugs
  note → diff was only 5 files + 1 fork, NOT a wholesale copy: website added Tooltips on every icon-only control, aria-label on nav/toc asides, id=main, brand link split (KOLKRABBI→/, WORKSHOP→basePath); ours had DocKit + docs-list tight classes (kept)
  note → WorkshopHeader fork (158 lines) NOT imported — its only deltas (tooltips, <header>, kol-mono-14 tabs, lg ThemeToggle) folded into framework ShellHeader instead, so the fork dies rather than moves in
  fixed → ShellDrawer isOpen→open (mobile nav was dead) · ShellSearchOverlay old API → query/results/onSelect + engine matchSearchItems (⌘K was dead, searchItems was dead code) · hamburger rail desync (independent !p flips → one target state) · groupDocsByMajor regex (plain NN-slug ids + hyphenated folder names now group — the vault-lists-only-INDEX bug) · DocumentationReader null-context guard (crashed outside a shell, e.g. /lobby)
  verify → engine self-check OK · /workshop-docs 1440: header landmark ✓ aria asides ✓ id=main ✓ mono tabs ✓ rail toggle nav→none ✓ ⌘K "theming"→1 result ✓ zero console errors · 500px: drawer opens, 2 nav items reachable ✓ shot _tmp/showcase-theme-check/workshop-drawer.png
  published → kol-framework 0.6.2 · kol-workshop 0.2.0
  next → showcase nav rebuilt on ShellLayout (needs the 3-tree IA ruling), then website drops its alias

[01:09 GMT · 2026-07-30] · workshop-nav phase 2 · showcase/src/{lib/shell-nav.js,pages/ShellPreview.jsx} + App.jsx
  what → shell driving the REAL showcase nav at /shell (DEV-only, ADDITIVE — live TopBar/DocLayout untouched)   why → converting 14 pages needs the tree-order ruling; this is the decision surface
  what → shell-nav.js adapter: registry/blocks/sets → shell routes shape · isShellTabActive (prefix map) · buildShellSearchItems (roster + surfaces) · componentTreeRoutes(mode) keeping the Atomic⇄Function toggle
  what → FIRST glob of this repo's own docs vault — 244 md files through buildInventory + DocumentationReader
  pkg → ShellLayout gained an `isActive` prop (consumer override; prefix-only couldn't express "Docs tab targets a child page, lights across /docs") → kol-workshop 0.2.1
  verify → /shell 1600: 6 tabs ✓ two rails ✓ Showcase tree with counts + Components tree with grouping toggle ✓ 244 docs in 11 numbered groups + Unnumbered(212) ✓ /shell/docs/01-breakpoints renders h1 + 5 tables + 7 TOC links + tags ✓ zero errors · shot _tmp/showcase-theme-check/shell-preview-doc.png
  FOUND (reported, NOT patched — id scheme is URL-bearing, user's call) → (1) ids are filename-only so 02-icons/01-inventory.md and 03-components/01-inventory.md collide on `01-inventory` (was a React dup-key error) (2) grouping is numeric-only, so the 212 unnumbered 07-usage/*.md docs would vanish silently — surfaced in a catch-all group instead
  HELD for user → the 3-tree IA ruling (components vs surfaces vs markdown, order + which carries the toggle) before converting the 14 DocLayout/TopBar pages

[02:35 GMT · 2026-07-30] · rogue-type + cascade law · packages/framework/{kol-framework.css:826,src/ShellHeader.jsx} + showcase/src/index.css:24
  what → header tabs stated 14/18 in the RULE, kol-mono-14 class deleted, 1600px type bump removed (spacing bump kept)   why → user: tabs too large
  root cause → NOT the class: .kol-shell-header-tab (13px, 16px@1600) and .kol-mono-14 are equal specificity, so load order decided. showcase imported kol-framework.css UNLAYERED (unlayered outranks every layered rule regardless of specificity) while kol-website imported it layer(components) → SAME package CSS rendered 16px here, 14px there
  what → showcase import now layer(components); law written into ARCHITECTURE §5 + framework README + root README + 00-overview/01-package-topology (order alone was documented, the LAYER never was)
  what → lobby/DocTableAndChipAudit.md task 2 gained "instance #3" — same disease as the doc-table value role; general law recorded: component type lives in its own rule at the right tier, never a utility class racing it
  what → /shell right rail built (my omission — shipped a review surface with the panel empty): On this page · Quick actions · Vault counts, via defaultTocContent
  verify → computed tab type 14px/18px at BOTH 1400 and 1700 (was 13/16) ✓ no kol-mono class on the tab ✓ right rail + its toggle icon present, layout=nav-toc ✓ zero console errors
  published → kol-framework 0.6.3

[02:55 GMT · 2026-07-30] · lobby audit CLEARED · lobby/DocTableAndChipAudit.md (9/9)
  1 → th vertical-align:top (kol-type-roles.css) — label no longer centres against a 4-line value
  2-4 → cell roles split on the mono fault line: .kol-doc-table-token (12px/lh-1/nowrap) + .kol-doc-table-copy (12/18/wraps); -value + --wrap kept as deprecated aliases with corrected leading; named by role+tier not slot
  5-6 → Pill defaults subtle/sm (were outline/md — against the never-outline + chip-sm laws); Tag audited in the same pass, md→sm
  7 → Pill/Tag/Badge taxonomy written into BOTH component headers (static label · interactive/filterable · status-count)
  8 → framework's duplicate .kol-prose-indented/-pullout/pre/code DELETED (the pre copy also hardcoded 'Right Grotesk Mono' over the token, so when framework won the cascade prose code rendered in the wrong family); elder hardcoded .kol-spectrum-grid family deleted from framework — theme's inline-var contract survives. Caught mid-move: I first MOVED the elder block into theme, then found theme's var-based contract already there and would have stacked two implementations — reverted to deletion
  9 → .kol-fs-tile ruled DEAD (styling is AssetFigure + Tailwind cursor-zoom-in); strip consumer-side at apps/brand/.../FullscreenGallery.jsx:12
  verify → /docs/type-roles: th vertical-align top ✓ token 12/12 nowrap ✓ copy 12/18 normal ✓ legacy alias 12/12 nowrap ✓ · /components/pill + home: pill-subtle pill-sm ✓ · both CSS files brace-balanced ✓ zero console errors
  note → framework CSS now self-wraps in @layer components (user edit mid-session) — makes the layer contract package-side, not consumer-dependent
  published → theme 0.12.1 · component 0.13.0 · framework 0.6.4

[04:49 GMT · 2026-07-30] · showcase → MDX pipeline · steps 1-4 DONE, 5 partial
  1 → chrome mounted ONCE: showcase/src/lib/ShellChrome.jsx as a route-level layout in App.jsx; DocLayout/TopBar/NavDrawer/SidebarNav DELETED (4 files) + ShellPreview retired (the showcase IS the shell now, /shell was only a decision surface). All 14 pages content-only; block/set previews stay outside the layout by contract (iframe sources)
  2 → TOC auto-derived from rendered headings (MutationObserver on main#main, anchors on heading id OR wrapping section id — DocKit puts it on the section). Every hand-written TOC array deleted from 9 pages
  3 → @mdx-js/rollup + @mdx-js/react; vite plugin enforce:pre with include:/\.mdx$/ — WITHOUT that include the plugin also claims .md and every ?raw markdown import (docs vault, lobby queue) returns a compiled module ("raw.split is not a function"); mdx-components.jsx supplies <Preview> (demos registry) + <Api> (react-docgen extraction) + auto-anchored h2/h3
  4 → showcase/src/docs/type-roles.mdx proves it: live previews, generated prop table, 4 anchored headings, TOC populated, zero errors
  5 → PARTIAL: ComponentPage gained the MDX override seam (a component with docs/components/<Name>.mdx renders it, else the generated page — so DOC_DATA dies entry by entry, not in one 72-entry rewrite). Button.mdx converted as proof: 9 live buttons + 9 generated prop rows. 71 DOC_DATA entries + 3 DocKit docs pages NOT converted — that is content authoring per component, not mechanical
  pkg → ShellLayout gained brand (node) + actions + isActive seams → kol-workshop 0.3.0; CodeBlock taxonomy-ok exemption → component 0.13.1
  verify → all 16 routes render, 1 header each, no h-overflow, no page errors · TOC populates on 8 pages (0 on index/landing pages by design) · raw-markdown pipelines (/workshop-docs, /lobby) intact · gates 5/5 after fixing a PRE-EXISTING validate-taxonomy failure (CodeBlock nests Icon from a sibling package; the gate only counts kol-component nesting) · production build green
  note → /lobby logs a nested-<a> warning from its own inline component preview — dev-only page, pre-existing content shape, not from this refactor

──────────── MILESTONE: shell adoption + MDX pipeline ──────────── [04:57]
  published: 5 packages · gates 5/5 · build green · chrome files deleted: 4
  threads closed: 13 · parked: 2 (mdx-content-migration · device-testing) · superseded: 1 (sidenav epic)
  log: session-log/2026-07-30-MILESTONE-shell-adoption-mdx-pipeline.md
