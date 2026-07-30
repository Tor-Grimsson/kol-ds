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
