# Playbook — MDX content migration

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`. Predecessor: `playbook/2026-07-29-showcase-cleanup.md` (the shell-adoption arc that built the seam).

**Goal:** retire `showcase/src/lib/component-docs.js` — convert its 72 DOC_DATA entries + the 3 DocKit docs pages onto the MDX document pipeline, so the file deletes itself and the last hand-authored drift surface in the showcase is gone.

**Standing rules (non-negotiable):**
- git is the user's; publishes are the agent's (/upig)
- every named file gets its repo-relative path
- a converted page must be **≥** the generated page it replaces — conversion is never a regression
- reference, don't invent: the MDX template mirrors what `ComponentPage.jsx` already renders

---
## Entries

[05:22 GMT · 2026-07-30] · setup · playbook created
  what → new playbook for the parked MDX arc; user reopened it ("the arc is very much not done")   why → the shell-adoption playbook closed at a milestone; this is a distinct, named effort

[05:22 GMT · 2026-07-30] · scoping · coverage matrix measured before writing anything
  DOC_DATA → 72 entries · all 72 carry `usage` + `api` · only **1** carries `examples` (Badge)
  read → the backlog framed the remainder as "authoring, not a transform". Measured, that is WRONG: 71 of 72 entries hold a one-line usage snippet + an api table the extraction already supersedes. The bulk is mechanical; prose is the optional value-add.
  demos → `showcase/src/demos/*.jsx` = 179 files, filename-keyed. 68/72 have a demo; **4 do not** (MenuPopover · AppShell · Layout · ScrollToTop)
  api → `showcase/src/usage/api-tables.json` = 88 components, 0 empty. But **17 of the 72 have no extracted rows**
  clean (demo + extracted api) → **54 of 72** convert with zero prep

[05:22 GMT · 2026-07-30] · scoping · BLOCKER FOUND — the seam converts into a regression
  what → `<Api name="X" />` (mdx-components.jsx:41) reads `API_GEN` **only**; the generated page (ComponentPage.jsx:113) renders `mergeApi(authored, generated)`
  impact → converting any of the 17 uncovered components today renders "No extracted props" and **deletes a working props table**
  also lost on the MDX path → `MetaRows` (type styles · composes, source-mined D1/D2) · the `Parts` section (member components) · the prev/next `Pager`. `MdxDoc.jsx` renders header + body only.
  root cause → `scripts/extract-api.mjs:42-45` scans **two** roots (`packages/component`, `packages/framework`). Icon lives in kol-icons · HlsVideo/PriceDisplay in kol-store · TypeSample/TypeSpecCard in kol-foundry — never scanned. The rest miss on the export-regex / displayName pairing.
  ruling → Phase A (seam parity) lands BEFORE any batch conversion. Mechanical, not authoring.

[05:22 GMT · 2026-07-30] · scoping · doc-id scheme — decided agent-side, NOT a user ping
  found → `meta.id` is consumed by **nothing** (grep: only its own doc comment in MdxDoc.jsx:10). Decorative today, so the "never renumbered" law is not yet a one-way door.
  scheme → `2.<fn>.<n>` for components (2 = Components section, matching Button's existing `2.1.0`), `3.<n>` for docs pages (matching type-roles `3.1.0`). `<n>` is a **monotonic counter within the group, assigned in conversion order** — never an A→Z index, because an A→Z index renumbers every later component when one is inserted.
  note → Button.mdx's eyebrow reads "Components / Action" (FUNCTIONS taxonomy) while the generated page renders `CATEGORY_LABELS[c.category]` ("Components / Atoms"). Template follows the **generated** path so conversion doesn't silently change a page's eyebrow; Button gets corrected in the same sweep.

[05:22 GMT · 2026-07-30] · plan · scope set, 5 phases
  A → seam parity: broaden extract-api roots to every UI package + fix pairing misses · `<Api>` merges authored ∪ generated via ONE shared `mergeApi` · MdxDoc gains MetaRows + Pager · add `<Parts name="X" />`
  B → convert the 54 clean entries in category waves (~10/wave), each wave verified live; DOC_DATA entry deleted in the same edit
  C → the 4 demo-less (MenuPopover · AppShell · Layout · ScrollToTop) — demo file or an explicit no-demo page shape
  D → the 3 DocKit pages (DocsMenus · DocsLoaders · DocsShellLayout) → MDX; `component-docs.js` deletes itself
  E → gates 5/5 · production build · docs sync · publish only if package source moved

[05:27 GMT · 2026-07-30] · PHASE A · seam parity — DONE, conversion is no longer a regression
  A1 → scripts/extract-api.mjs:42 roots auto-discovered across every UI package (was a hardcoded component+framework pair); NON_UI skips the clients tier + theme
  result → api-tables.json **88 → 149 components**; DOC_DATA entries without a table **17 → 13**; clean (demo+api) **54 → 58 of 72**
  tail → the 13 are react-docgen "no suitable component definition": render-null utilities (ScrollToTop), class components (ErrorBoundary), aliased re-exports (MenuPopover), forwardRef shapes (ShellDrawer) — chasing them through docgen is not worth it, they carry rows in-document instead
  A2 → showcase/src/lib/component-page-parts.jsx NEW — mergeApi + MetaRows + Pager lifted out of ComponentPage.jsx so ONE definition serves both paths
  A3 → <Api name rows> now merges authored ∪ extracted (was extraction-only, which would have deleted 13 working props tables on conversion); <Parts name> added for compound members
  A4 → MdxDoc takes `component` → renders MetaRows (type styles · composes) + the A→Z Pager. Order note: meta rows sit under the header, not under the main preview — an MDX author places the preview, so the position can't be inferred
  A5 → MdxDoc derives eyebrow/title/lede from the registry; `meta` overrides only. Kills ~210 hand-typed strings across the remaining conversions and the drift they'd carry. Button.mdx's hand-typed eyebrow deleted — it read "Components / Action" (FUNCTIONS taxonomy) while the generated page renders "Components / Atoms" (CATEGORY_LABELS), so the one converted page had ALREADY drifted
  verify → production build green (2785 modules) ✓ · /components/button (MDX path): eyebrow "Components / Atoms" ✓ Type-styles meta row ✓ 9 api rows ✓ pager BrandHero←→ButtonGroup ✓ no "No extracted props" ✓ · /components/code-block (generated path, 0 extracted rows): authored 2-row table intact ✓ pager ✓
  port → vite preview 4319, PID 42003, killed at 05:27
  OPEN QUESTION (not blocking, user's call at leisure) → the eyebrow taxonomy is inconsistent repo-wide: the sidebar groups by FUNCTION by default, the component page eyebrow says CATEGORY (atomic tier). Followed the generated page so conversion stays invisible; flipping it is a one-line change in MdxDoc + ComponentPage if the function taxonomy should win.

[05:40 GMT · 2026-07-30] · PHASE B+C · all 72 DOC_DATA entries resolved
  scope correction → registry wiring re-scoped C: Icon/Graphic (DOCS_ONLY) + MenuPopover (DEPRECATED) are filtered from COMPONENTS — their DOC_DATA entries were DEAD weight (no page ever read them) → deleted, not converted. Layout/AppShell/ScrollToTop → consumed only by DocsShellLayout → folded into Phase D. Every convertible entry has a demo — "the 4 demo-less" never needed demos.
  prep → InstallBlock/CodeLine/Copy lifted ComponentPage → component-page-parts.jsx; mdx map gained <Install name> (pkg from registry, pm switcher) + markdown-link `a` → SPA <Link> for internal hrefs
  codemod → scratchpad/convert-doc-data.mjs (one-shot, NOT in repo scripts/): DOC_DATA + package barrels (name→pkg, extract-api's parse) + COMPONENT_GROUPS → 65 .mdx files, ids 2.2.0–2.66.0 A→Z. Emits Preview · Install · Usage (import line + snippet, jsx fence) · Parts (compounds) · Examples (Badge only) · <Api name rows> with authored rows in-document
  Button.mdx patched → hand-typed bash install fence → <Install>; authored rows added to its <Api> (they were being LOST on the MDX path — extraction-only rows have no curated descs)
  verify → build green with all 66 docs

[05:40 GMT · 2026-07-30] · PHASE D · DocKit pages → MDX, component-docs.js DELETED
  what → docs/{menus,loaders,shell-and-layout}.mdx (ids 3.2.0/3.3.0/3.4.0), content verbatim (JSX tables/diagram travel as JSX — no remark-gfm, checked); App.jsx routes → MdxDoc; DocsMenus/DocsLoaders/DocsShellLayout.jsx + lib/component-docs.js rm'd
  caught mid-write → I improvised AppShell api rows from memory in shell-and-layout.mdx; replaced with the REAL DOC_DATA rows before they shipped (don't improvise — reference)
  ComponentPage → fallback simplified: header + install + import + Parts + extracted API + pager; serves only .mdx-less components (workshop internals, hooks) so a new export still gets a page day one
  STALE COPY (travelled verbatim, flagged not fixed) → shell-and-layout.mdx "The docs shell (this site)" section still claims DocLayout/TopBar are app-local + workshop shell "queued for import" — false since the 07-30 shell adoption; content edit is the user's call

[05:40 GMT · 2026-07-30] · PHASE E · verified
  gates → roster ✓ imports ✓ foundations ✓ taxonomy ✓ groups ✓ (5/5) · production build green
  live sweep → vite preview :4319 (PID 82981, killed): **203 routes** via client-side nav, **0 console errors**. 11 short pages = .mdx-less minimal fallback (hooks/workshop internals) — pre-existing shape, not regression
  detail checks → /components/badge (examples 3×h3, 4 pm tabs, merged 5-row api, meta row, pager) · /docs/menus (4 anchors, 7-row family table, TOC 4) · /docs/loaders (5 anchors, 2 tables, live Icon/Graphic) · /docs/shell-and-layout (6 anchors, diagram, AppShell table, SideNav preview)
  docs sync → 04-compositions/02-shells.md §MDX rewritten (migration complete, component-docs.js deleted); backlog/2026-07-30-mdx-content-migration.md → DONE
  published → nothing; zero package source touched (showcase-app-only arc)

──────────── MILESTONE: component-docs.js retired — pages are documents ──────────── [05:40]
  changed: 66 .mdx (65 new + Button) + 3 docs .mdx · deleted: 4 files (3 DocKit pages + component-docs.js) · gates 5/5 · build ✓ · 203 routes 0 errors
  held for user: eyebrow taxonomy ruling · stale docs-shell copy in shell-and-layout.mdx
  log: pending /log-work (user-prompted)

[06:11 GMT · 2026-07-30] · post-arc rulings + shell-gutter fix · user screenshots review
  eyebrow ruling → CLOSED, user: "I use atoms" — tier stays in the eyebrow, GROUP BY toggle keeps governing the sidebar; zero change
  case question → answered, not a bug: sidebar label = shell-sidebar-label + kol-helper-10 (authored case, helper family); eyebrow = .kol-doc-eyebrow (same recipe + uppercase per the user's type-role ruling); matches the kolkrabbi workshop reference
  "content flush against sidebar" → could NOT reproduce: production build measures px-6 outer + 32px gutter at 1600 (screenshot scratchpad/shell-gap-check.png); verdict = stale dev-server state (files deleted under his live HMR) — hard reload
  REAL defect found while measuring → theme's `.shell-content-grid { gap: 48px }` @media ≥1600 (kol-components-workshop.css:253) was DEAD: `gap-8` on ShellLayout.jsx:183 (utilities layer) outranks the layered rule at every width. §5 disease, geometry edition.
  fix → gap-8 removed from the grid element (ShellLayout.jsx); base `gap: 32px` stated in `.shell-content-grid` (theme); user go: "well go with that" (kolkrabbi workshop = the reference)
  verify → preview :4319 (PID 52576, killed): gap 32px @1280/1400 ✓ **48px @1700** ✓ visual gutter 48 ✓ build green
  published → theme **0.12.2** · workshop **0.3.1**
  docs sync → 02-shells.md (+gutter law) · 04-workshop-system.md (shell row + updated:) · SHIPPED-PACKAGES (cells + entries + updated:)

[06:34 GMT · 2026-07-30] · BUG (user-surfaced, mine) · MDX pages caged at prose width — go received
  bug → MdxDoc wraps the WHOLE document (previews · tables · install blocks) in `.kol-prose` (720px blog cap, kol-typography.css:963) — introduced in the conversion; generated pages ran furniture at full main column. User law re-stated: prose is a DIFFERENT system; don't cross-mix class purposes.
  reference set → user's shadcn screenshots: docs text column max-w-160 (640) inside container 1536 — text narrow, surfaces wide. Chess-repo pattern: one outer frame + nested content caps. Both = the theme's own 07-28 one-frame law (--kol-content-shell 1800 · column 768 · measure 65ch).
  plan → (1) MdxDoc drops kol-prose (2) mdx map types markdown via kol-doc-* roles — p→kol-doc-body (self-caps 65ch); pre/code/lists/blockquote mapped from existing precedents (CodeLine chrome, doc roles); add missing doc roles to theme only if nothing exists (3) furniture (Preview/Api/Install/tables) runs full column (4) verify build + gates + live widths (5) docs sync + bumps as needed
  scope wall → showcase MdxDoc + mdx map (+ theme roles if truly missing). DocsArticle's kol-prose (workshop vault viewer) NOT in scope.

[06:38 GMT · 2026-07-30] · un-caging DONE · showcase-only, no publish
  what → MdxDoc body wrapper kol-prose → plain flex-col (comment cites the user law); mdx map types per-tag: p/ul/ol→kol-doc-body (+list layout from the DocsMenus precedent), code→kol-doc-code-inline, pre→kol-doc-code, a→MetaRows link treatment; NO theme additions needed — the doc set already carried body/code/code-inline
  found+fixed en route → `kol-doc-subsection-title` (h3 map + Parts) was a DEAD class, never existed in theme — h3s rendered untyped; → kol-sans-heading-05 text-emphasis (the generated-page precedent)
  verify @1600 (preview :4319, PID 10778, killed) → main col 976: preview card 976 ✓ api table 976 ✓ fence 976 w/ kol-doc-code ✓ inline code typed ✓ · text self-caps: body 527 (65ch of body-02) · lede 602 (65ch of body-01) · 0 errors · gates 5/5 · build green
  NOTE for user → body measure now computes 527px (65ch of the 14px doc-body role, YOUR 07-28 measure law) — narrower than the old 720 blog cap. If it reads too narrow the knob is ONE var: --kol-content-measure (kol-theme.css:81).
  docs sync → 02-shells.md MDX paragraph (+no-prose law)

[06:44 GMT · 2026-07-30] · layout-systems registry authored · docs/documentation/01-foundations/05-layout-systems.md (user ask: one lookup so class-purpose cross-mixing can't recur)
  what → one row per active system (one-frame law · container-max · shell grid · kol-prose · kol-doc-* · MDX map · padding ladder), each with purpose / values / rule home / never-use-for; rule of thumb (width is content); open contradictions table ← lobby/WidthSystemContradictions.md; history block
  honesty note → registry states plainly that --kol-content-shell/column have ZERO consumers (lobby audit) — the law is declared, not yet wired
  wiring → INDEX front-door row · related: both ways (04-layout-breakpoints · 08-breakpoints/04-kol-ds-rules)
  lobby read → 11 live entries; the website/apps:brand layout issue IS staged: WidthSystemContradictions (5 decisions listed, user's) + TableSeamTokenSplit (one-line fix, --fg-08→--oq-08 at kol-components-organisms.css:198)

[07:15 GMT · 2026-07-30] · EXECUTION RUN opens · user: stop presenting, WORK the queue end-to-end, wired to view
  queue → (1) theme-stamp cutover v3 (2) table seam oq-08 (3) Pill primary/secondary (4) width family: .kol-page ladder ends at shell 1800 · --kol-content-panel 960 · .kol-full-bleed promoted into framework · MDX furniture caps at panel · lobby entry gets its RESOLUTION (5) ownership notes chess + workshop-vendored (6) ThemeToggle motion redo via tmpl-proposal (7) TypeScaleSection recipe (8) lobby hygiene LAST
  rulings already in hand → theme root cause = pre-tri-state stamp, guard bump is the fix · pill: primary=grey/subtle default, secondary=outline · chess/paratype: archive w/ ownership+source pointers · previews stay full column, fences/tables/Api cap at panel

[07:30 GMT · 2026-07-30] · EXECUTION RUN closed · queue worked end-to-end
  1 → theme-stamp cutover v3 (showcase/index.html): one-time wipe of pre-tri-state stamps — nobody hand-deletes storage; comment records the 07-15→07-30 two-state-toggle window that minted them
  2 → table seam: organisms.css td divider fg-08→oq-08, comment cites chess-audit finding 4's fourth seam
  3 → Pill → Button vocabulary: primary(grey fill, default)/secondary(outline)/inverse + deprecated aliases; demo + Pill.mdx + api regen
  4 → WIDTH FAMILY UNIFIED (the kol-website answer): --kol-content-panel 960 · --kol-container-max = the shell's ladder w/ final rung var(--kol-content-shell) ≥1920 · .kol-full-bleed promoted (negative-margin, 50vw trap documented) · MDX fences/tables/Api/Install cap at panel · lobby entry rewritten with the RESOLUTION table incl. the consumer's migration list
  5 → ownership notes: chess row ⚠ in SHIPPED-PACKAGES ("active version lives in kol-chess repo"); WorkshopSystemVendored answered by events (showcase wears the shell → package stays published)
  6 → ThemeToggle roll REBUILT (rotation accumulates −180°/slot on the travel clock — wheel, not slide+flip; isDark-rotation was the desync) — workspace-only, HELD from npm; library glyph redesigned (3 books + one leaning, line-based per the files-group idiom); BOTH staged at _tmp/toggle-library-proposals/preview.html (tmpl-proposal shape, self-verified: motion cells cycle w/ synced transforms ✓ guides toggle flips computed visibility ✓; server PID 20658 killed, shots deleted)
  7 → TypeScaleSection → columns recipe documented live on Table.mdx (Recipes section); entry resolved
  8 → lobby hygiene: queue 11 → **2 live** (ThemeToggleButtonVariant awaiting approval · InteractiveImage parked); 6 → done/ w/ resolutions, 3 → archive/ w/ notes; INDEX rewritten
  published → theme **0.13.0** · framework **0.7.0** · component **0.14.0** (roll motion + library glyph NOT in them — approval-gated)
  verify → build ✓ gates 5/5 ✓ live @1600: fence/install/table 960 (panel) ✓ preview 976 (full column) ✓ toggle present ✓ · ports 4319+4321 opened+killed
  docs sync → 05-layout-systems registry (resolved-contradictions table + new rows) · 04-layout-breakpoints + 08-breakpoints ×4 (panel row, four-tokens law) · SHIPPED-PACKAGES (3 cells + entries + chess ⚠)

──────────── MILESTONE: lobby queue worked — width law is real ──────────── [07:30]
  lobby: 11 → 2 · published: 3 · staged for approval: 2 (roll motion · library glyph)
  awaiting user: open _tmp/toggle-library-proposals/preview.html · hard-reload dev server (theme cutover v3 clears the dark stamp)
  log: pending /log-work

[07:53 GMT · 2026-07-30] · GLANCE-LIST RUN opens · user filed 12 defects from one look; the MDX conversion shipped unreviewed — own miss
  list → install radius breaks 4px law · fences don't use THE CodeBlock (3 code idioms on one page) · pager sans in a mono nav · right TOC rail off-idiom vs left sidebar · cramped h2 rhythm + zero-gap before pager divider · giant empty preview stage · sidebar internal h-scroll + outer padding white-band · Atomic grouping must be DEFAULT · **the docs vault still not in the shell** (repeatedly ordered: full tree + frontmatter panel à la kolkrabbi workshop)

[08:06 GMT · 2026-07-30] · GLANCE-LIST RUN closed · all 12 + the vault, live-verified
  code idiom → ONE: mdx `pre` map, CodeLine, InstallBlock (pm tabs above), PreviewCard Code tab ALL render kol-component CodeBlock; bespoke pre/copy twins deleted; radius = CodeBlock chrome 4px ✓ (the install rounded-md violation dies with the bespoke chrome)
  found en route → `kol-mono-13` NEVER EXISTED — dead class in 4 files (ShellChrome TOC rows + brand, CollectionPreview/Page, Foundations) silently rendering SANS: that was the whole "right rail is sans" mystery + the eyebrow/spacing drift. → kol-mono-14; TOC conformed to the left-rail idiom (shell-sidebar-label kol-helper-10, authored case — dropped an `uppercase` transform violation; second one dropped from "Group by"; PreviewCard's `capitalize` tabs → authored labels)
  rhythm → h2 mt-6 first:mt-0, h3 mt-2 (heading opens a section = air ABOVE); CodeBlock's own margin-block restores block breathing; stage floor 20rem→10rem (the void around one-row demos)
  rails → overflow-x-hidden on Nav/Toc columns (long rows panned the whole grid sideways = the white-band bug)
  grouping → Atomic DEFAULT (grouping.jsx + registry.js + taxonomy doc synced)
  THE VAULT → showcase/src/lib/vault.js globs docs/**/*.md → buildInventory → grouped "Documentation" rail section + /docs/vault/:docId via DocumentationReader (frontmatter panel live) + ⌘K search items. Engine upgraded for it (workshop 0.3.2): collision-safe ids (dup basenames gain parent folder — the 07-29 dup-key finding SOLVED, not held), uppercase INDEX = index, reader resolves modules by doc.file (endsWith heuristic grabbed first basename match = wrong doc)
  verify → build ✓ gates 5/5 ✓ /docs/vault: frontmatter ✓ groups incl. usage(205) ✓ both colliding inventories resolve correctly ✓ 202-route sweep 0 errors ✓ ports 4319 opened+killed
  published → workshop **0.3.2** (framework NOT published — roll motion still approval-gated in its source)
  docs sync → 02-shells (+vault +code-idiom laws) · 05-layout-systems (MDX row) · SHIPPED-PACKAGES (0.3.2) · 03-components/00-taxonomy (atomic default)

[08:17 GMT · 2026-07-30] · corrections · Documentation = SYSTEM + port mea culpa
  placement → user: documentation is a SYSTEM, never a sub-page. Vault moved to its OWN top-level tab + URL space: /documentation/:docId (was /docs/vault under the Docs tab child list — wrong hierarchy, mine). TAB_PREFIX lights the tab across /documentation; Docs tab keeps only the 4 MDX guides; rail Documentation section stays.
  port → I told him his tab (5175) was stale and the server was 5173 — BACKWARDS: vite took 5175 because two OLDER instances squat 5173/5174; his tab was right, the HMR client hits the old ones. His processes — handed the kill command, didn't run it.
  verify → build ✓ · 7 header tabs incl. Documentation ✓ /documentation/docs-INDEX renders w/ frontmatter ✓
  still open from the interrupted defect wave → PreviewCard tab-bar border fg-12→oq-08 + doc-figure fg-12→oq-08 (the alpha-seam law, JSX edition) · CodeBlock `bare` for the Code tab double-frame · preview frame cap by stage · DashMetricCard w-full question

[08:20 GMT · 2026-07-30] · defect wave CLOSED · theme 0.13.1 · component 0.14.1 published
  seam law, JSX edition → .kol-doc-figure border fg-12→oq-08 (theme) · PreviewCard tab bar border → oq-08 inline — figure + bar now the SAME opaque seam at the table wrapper's 08 weight; law row added to the layout-systems registry ("border-fg-* on framed chrome" = never)
  double frame → CodeBlock gains `bare` (highlight/chip/copy, no chrome; .kol-codeblock--bare in theme); PreviewCard Code tab renders bare inside the figure w/ px-4 py-3 — one frame
  void → preview frame follows the stage: `full` keeps the column, everything else caps at --kol-content-panel (960). DashMetricCard answer: the CARD is w-full by design (dashboard grid cell) filling its 28rem `md` stage; the void was the FRAME, now 960
  verify → @1600: figure 960 ✓ figure+bar borders identical opaque ✓ Code tab bare (0 border, transparent bg) ✓ build ✓
  docs → registry (+seam-law row) · SHIPPED-PACKAGES (0.13.1/0.14.1)

[09:02 GMT · 2026-07-30] · REVIEW WAVE 3 opens (user, 15 items) · rulings received
  BUILD NOW → (1) atomic taxonomy broken: flat-package components hand-mapped into atoms/molecules (ShellSidebar "atom", DashTableCard "molecule") → tier = PACKAGE for non-core packages, own groups (2) hooks are NOT components — out of the roster/nav (3) rails: right TOC rows = the LEFT tree's shell-nav-item idiom, ONE system (4) every sidebar section label = the kol-doc-eyebrow voice (image 33), both rails + reader sidebar (5) Kolkrabbi logo + KOL-DS wordmark restored in the header (I replaced it with a text span — scope violation, mine) (6) styleguide figcaption italic-sans = unsanctioned → mono normal (never asked; Right Grotesk italic is a placeholder face, user law: classes or ask) (7) kol-doc-figure coherence: frame ALWAYS panel-capped (stage full filled the shell and diverged), Code-tab bare KEEPS the codeblock bg (8) provenance: every component page prints its SOURCE path (extract-api emits name→src map, MetaRows renders it) — "a component without an origin is a puzzle piece in a pile" (9) MDX pages get a frontmatter panel (meta was invisible — hidden metadata is rejected-markdown disease) (10) vault group labels Title-Case
  LOGGED, next wave (too big for tonight, named honestly) → DocsArticle/vault-reader retype from kol-prose to the doc voice (one layout, one style system) · vault parity: tag colors, working docs search, cross-refs in right rail, node graph view · per-component imported-from-repo history (needs research per component)

[09:12 GMT · 2026-07-30] · WAVE 3 CLOSED · workshop 0.3.3 · theme 0.13.2 published
  taxonomy → tier = PACKAGE for flat packages (roster.js; validator updated — TIERS no longer required): Atoms 63→39 · Molecules 66→28 · Organisms 52→20 · new groups Workshop(10)/Dashboards(19)/Chess(17)/Foundry(21)/Styleguide(8)/Content(12)/Store(7). Hooks OUT of the roster (scripts, not components).
  rails → right TOC rows = shell-nav-item kol-mono-14 (the left idiom, verbatim); ALL section labels = kol-doc-eyebrow (ShellSidebar · reader SidebarSection · DocsFrontmatter · WorkshopDefaultSidebar · Group by · On this page)
  brand → KOLKRABBI wordmark restored (Asset kol-wordmark, logo slot) + "KOL DS" typed mark (no drawn asset yet — flagged as placeholder); the text-span I'd put there was a scope violation, owned
  figcaption → styleguide italic-sans → mono upright (theme; the one other italic — feature-split-pull em — is an elder deliberate accent, left + noted)
  figure → ALWAYS panel-capped (stage-conditional cap = geometry disagreement between sibling pages); Code tab bare keeps the code surface (transparent bare was a third bg)
  provenance → component-sources.json (extract-api) → "Source packages/…/X.jsx" row on EVERY component page (MetaRows, both paths)
  frontmatter → MDX pages render a Frontmatter panel from meta (id/slug/aliases…) — metadata is content, never hidden
  vault labels → Title-Case ('Root' for the docs-root group)
  caught in sweep → my MetaRows guard crashed foundry-cta (null meta + source) — fixed before ship; final sweep 194 routes, 0 errors
  docs → 00-taxonomy (ownership tiers + hooks ruling) · 02-shells (rail/label/brand/frontmatter laws) · SHIPPED-PACKAGES (0.3.3/0.13.2)

──────────── MILESTONE: wave 3 — ownership taxonomy + one rail voice ──────────── [09:12]
  built: 10/10 ruled items · published: 2 · routes: 194/194 clean
  next wave (logged): vault-reader retype to doc voice · tag/search/graph parity · imported-from history
  log: pending /log-work

──────────── MILESTONE: the glance-list + the vault ──────────── [08:06]
  defects: 12/12 closed · vault: in the shell, frontmatter and all · published: 1
  still awaiting user: _tmp/toggle-library-proposals/preview.html (roll motion + library glyph)
  log: pending /log-work

[09:28 GMT · 2026-07-30] · WAVE 4 opens · proposal verdict in
  verdict → library glyph APPROVED (→ icons 0.8.11) · ThemeToggle proposal REJECTED as shown: system-state computer icon wrong + page failed to show all variants and all sizes — redo, full matrix
  rig → dev port is 5176, agent hands off rig entirely (surfacing his rig state was out of scope, owned)
  queue → glyph landing → toggle-proposal redo → vault-reader retype → vault parity → imported-from history → MDX prose → smalls

[09:52 GMT · 2026-07-30] · WAVE 4.0 · toggle-proposal redo staged + library shipped · icons 0.8.11
  glyph → approved library (3 books + one leaning) landed at files/library.svg in house style, published 0.8.11, SHIPPED-PACKAGES synced
  redo → _tmp/toggle-library-proposals/preview.html rebuilt: TWO IFRAMES (each its own :root stamped data-theme — a .dark class mid-tree can't recompute :root-derived fg/oq tokens, single-doc dual-theme was a lie), REAL kol-theme.css chrome, full matrix icon/button/hop/hop-bare × sm/md/lg, all clickable, one shared mode via postMessage relay (= useTheme cross-instance sync)
  system slot → 4 in-set candidates clickable page-wide: desktop (current·rejected) · dashed-circle (proposed) · mode-toggle-02 · brightness; ramp 16-48 + mode-toggle-01 family ref
  verify → cross-pane cycle ✓ (click light pane → both read mode·dark) · UA button preflight shimmed · rig killed (8931 + browser)

[09:52 GMT · 2026-07-30] · WAVE 4.1 · vault-reader retype → doc voice · workshop 0.3.4 published
  what → DocsArticle drops kol-prose (prose = blog only, THE law) → docs-article + flex col gap-6 (MdxDoc rhythm); reader blocks typed through the mdx-components dialect verbatim: h1 kol-doc-heading · sections via packaged DocSection (rule + section-title) · p/lists kol-doc-body · h3 sans-heading-05 / h4 same at font-normal (prose-h4 precedent) · code panel-capped CodeBlock · md tables via kol-component Table variant=simple className=kol-doc-table (dynamic-column DocTable sibling, no parallel table markup) · render-tokens: docs-link killed → colorless emphasis-underline idiom, inline code → kol-doc-code-inline · DocsHeader → doc-heading/-lede
  dedupe → the two ~80-line intro/section switches (already drifted) folded into ONE renderBlock
  verify → gates + build ✓ · live preview 4189: /documentation/05-layout-systems renders full doc voice (frontmatter panel · doc-table th helpers · code chips · section rules) ✓ · rig killed
  note → docs-list/docs-link had NO css rules (kol-prose was carrying them) — deletions lose nothing; TagModeOverlay keeps docs-article wrapper (one child, unaffected); kol-components-workshop.css line ~268 comment still says "wrapped in .kol-prose" — sync it with the NEXT theme bump (no theme change this pass)

[10:04 GMT · 2026-07-30] · WAVE 4.2 · vault parity 4/5 · theme 0.13.3 + workshop 0.3.5 published
  tag colors → root cause: .tag/.tag-naked/.tag--{color} classes shipped in Tag.jsx since the port, RULES never left the monorepo (same dangling trap as the palette tokens, kol-color 07-16). Authored in molecules css over the palette pair: light = -light fill + dark ink · dark = saturated + light ink (yellow keeps dark) · naked = saturated text · dark-mode block scoped .tag.tag--{c} so naked text rules survive · system-follow mirror
  search → matchSearchItems always took headings; nothing extracted them. buildInventory now emits fence-aware ## /### headings; shell-nav adapter forwarded them (it was silently dropping the field). "rule of thumb" → lands 05-layout-systems ✓
  related rail → frontmatter related: wikilinks resolved path-first (../INDEX hops) then basename, rendered in the ONE rail voice (shell-nav-item); dead targets dropped not rendered
  tag mode/graph → TagModeGate was NEVER mounted (whole apparatus a silent no-op). Mounted as nested route; provider moved UP around ShellChrome — the reader portals its rail through ShellTocContext, a route-scoped provider left the rail on the noop fallback. Hashtag pills: new onTagClick seam → openTagMode (the /docs?tag Link was dead). Graph verified: 27 nodes, filter chip colored ✓
  view-components action → NOT built: "goes to /components generally" is ambiguous (deep-link the doc's component? different target?) — flagged for user ruling
  verify → build ✓ · one screenshot carries graph + colored chips + Related rail + eyebrow voice · rig killed
  docs → SHIPPED-PACKAGES (0.13.3/0.3.5) · 04-workshop-system (doc-voice retype line)

[10:16 GMT · 2026-07-30] · WAVE 4.3 · imported-from history + INDEX rescue · workshop 0.3.6 published
  provenance → scripts/extract-origins.mjs mines lobby/done frontmatter (component/source/date) → component-origins.json (96 components, 7 origin repos: kol-monorepo 84 · kol-website 4 · kol-ds-fxr 3 · others 5); wired into extract:docs; MetaRows prints "Imported from <source> · <date>" under the Source row. Verified: article-card shows the pair
  INDEX thinness → BUG, not content. Two compounding defects: (1) table cells split on every pipe incl. the \| escape — Obsidian wikilinks-in-tables exploded across cells with literal backslashes (2) resolveDocLink only tried bare basenames — INDEX/collision ids carry the parent folder, so hub links rendered dead plain text. Fixed: unescaped-pipe split + parentDir-basename fallback. documentation-INDEX: 0 → 34 live links, click lands 00-overview-INDEX
  sweep → all 36 vault routes, 0 console errors · build ✓
  docs → SHIPPED-PACKAGES (0.3.6)

[10:26 GMT · 2026-07-30] · WAVE 4.4 · MDX prose authored · 66/66
  what → every mechanical .mdx gains its prose section (Variants/Behavior/When-to-use), distilled from the component's OWN header canon — laws, family taxonomy, composition contracts — cross-linked between siblings (chip family Pill/Tag/Badge · value-control Slider/RotaryDial · popover family · hero pair · toggle trio)
  headerless 9 → written from read source (Avatar initials-only — first draft guessed an image fallback, caught + corrected against the source)
  ledes → NOT added: meta.lede falls back to the registry description already; restating it is churn
  verify → all 66 carry a section ✓ · build ✓ · spot-check 6 pages render sections in TOC flow ✓ · full sweep 188 component routes 0 errors ✓
  backlog → 2026-07-30-mdx-content-migration.md stamped CONTENT AUTHORED (deepening stays open-ended)

──────────── MILESTONE: wave 4 — the vault speaks doc ──────────── [10:26]
  built: retype + parity 4/5 + provenance + INDEX rescue + 66 prose docs
  published: icons 0.8.11 · workshop 0.3.4→0.3.6 · theme 0.13.3
  awaiting user: toggle-proposal redo (preview.html, iframe rebuild) · view-components target ruling · feature-split-pull em italic ruling
  log: pending /log-work

[10:32 GMT · 2026-07-30] · framework 0.8.0 cleanup (website-agent publish) · deprecated
  what → npm deprecate @kolkrabbi/kol-framework@0.8.0 "Broken publish: workspace:* shipped raw…" — verified live on the registry. 0.8.1 confirmed good (deps resolved 0.14.1/0.8.11), local package.json already 0.8.1, .kol-full-bleed-inset rule present + documented at the rule
  context → website agent published 0.8.0 (npm publish → workspace leak, the 0.5.11/0.5.12 trap) + 0.8.1 (clean) from this workspace; his note lobby/NOTE-2026-07-30-framework-0.8.x… asked the DS side to deprecate — done
  rides along → ThemeToggle roll rework is LIVE in 0.8.1, user-approved verbally ("approve, I'll change it back later"), visual review still pending via _tmp/toggle-library-proposals/preview.html; the desktop system glyph it ships is already rejected — fix lands with the proposal verdict (→0.8.2)
  docs → SHIPPED-PACKAGES (framework 0.8.1 + broken-0.8.0 warning)

[10:55 GMT · 2026-07-30] · toggle review ROUND 2 (user, with screenshots) · rulings received
  guides chip → color relationship SWAPPED vs the approved round-1 page (mine matched its pane; original was INVERSE — dark chip on light pane) + must align LEFT with the content column, not center
  system glyph → NO third glyph, ever: "only 2 instances of the split circle." The dashed-circle candidate (and any distinct system icon) is out — system wears mode-toggle-01 too, the mode is told by label/tooltip
  roll → looks correct but unverdicted until both travel directions are visible without the odd glyph
  variant Qs → user read button as chrome-less (surface-secondary fill invisible on surface-primary pane — presentation failure, needs guides outlines); asked for the "normal button" which IS the button variant (brand sidebar runs it today)
  taxonomy → discussion opened: variants labeled by host context, each must EARN its spot with a logical justification

[10:57 GMT · 2026-07-30] · toggle ROUND 3 staged · pane.html rebuilt
  glyph → ONE identity: strip = 3 copies of mode-toggle-01, ALL roll (−180°/slot on the travel clock); dashed-circle + candidate picker deleted from page + DOM verified clean. One lap shows both directions: light→dark rolls one way, dark→system rolls back two half-turns, system→light forward again
  guides chip → inverse per pane (surface-inverse/on-inverse: dark chip on light pane, mirror on dark) + left:40px = the content column edge. Verified computed: L(40, #0e0e11/#fcfbf8) D(40, #fcfbf8/#0e0e11)
  guides outlines → body.guides-on .demo-toggle gets a dashed key-color outline — the button variant's ladder box (padding/rung height) reads even though surface-secondary fill is subtle on surface-primary (the round-2 "no container" misread)
  labels → variant rows named by HOST CONTEXT: icon=toolbars/nav bars · button=THE ladder button, standalone surfaces (brand sidebar today) · hop=sidenav filled · hop-bare=sidenav quiet
  verify → cross-pane sync ✓ · system mode = split circle everywhere, 0 dashed paths in DOM ✓ · console clean (fonts only) · rig killed (8931 + browser + screenshots)
  note → ThemeToggle.jsx untouched — the no-third-glyph change lands as 0.8.2 on approval
