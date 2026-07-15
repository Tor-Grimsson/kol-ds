# Playbook — Showcase truth rebuild (deep-audit execution)

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`. Plan + findings: `backlog/2026-07-15-showcase-deep-audit.md`.

**Goal:** Execute the 4-phase showcase rebuild — roster from barrels + CI completeness gate → de-fork vendored copies → attribution/prose/tokens from source → provenance badges + wired search. End state: every showcase claim derived from package source or CI-gated; completeness mechanical, never audited again.

**Standing rules (non-negotiable):**
- Base categories fixed: Tier (atom/molecule/organism) + closed Function set — everything else questionable.
- Every component in every package gets a roster row + tier + function — absence is an ERROR, never a silent default.
- No vendored copies of package code in showcase — imports via `@kolkrabbi/*` only.
- Each phase gated on user sign-off before execution.
- No git, no publish without explicit user OK.

---
## Entries

[12:38 GMT · 2026-07-15] · setup · playbook created
  what → initialised the live playbook for the showcase-truth-rebuild arc   why → audit complete (3 parallel sweeps), execution pending sign-off
  note → audit doc relocated docs/ → backlog/ (user call: plans are agent state, .kol/ not docs/); vault links pruned (INDEX row + taxonomy related)

[12:59 GMT · 2026-07-15] · phase1/enumerator · scripts/lib/parse-barrel.mjs (new)
  what → shared barrel parser (default/named/star re-exports, follows sub-barrels) ✓   why → one enumeration for roster + gate + miner
  note → `**/` inside a block comment terminates it — bit once, fixed

[12:59 GMT · 2026-07-15] · phase1/classification · showcase/src/lib/classification.js (new)
  what → TIERS (flat pkgs) + FUNCTIONS_BY_NAME (all) + EXEMPT + DOCS_ONLY/DEPRECATED moved in ✓   why → single validated hand-authored layer
  note → 4-agent sweep (chess+dash / styleguide+content+store / foundry+framework+component-gaps / workshop+brand)
  note → SourcesReferences = ATOM by the mechanical test (nests nothing KOL) — my earlier "molecule" was Brad-Frost thinking; corrected
  note → Modal/Popover were never barrel exports (doc-page concepts over ModalProvider/PopoverPanel/hooks) — keys removed, PopoverPanel rostered; /components/modal+popover pages drop off; re-home as /docs pages in phase 4
  note → resolveCssVar/resolveCssColor/isLight (lowercase utils) off the roster — util docs are phase-4 material

[12:59 GMT · 2026-07-15] · phase1/roster+gate · showcase/src/lib/roster.js + scripts/validate-roster.mjs (new)
  what → roster derives from packages/*/src barrels (Vite raw glob); gate: classify-or-exempt, dead-key + collision checks ✓   why → completeness by construction
  verify → validate:roster clean (213 exports) · first run listed 190 violations → 0
  note → gate wired into `pnpm build` + release.yml step "Validate roster"

[12:59 GMT · 2026-07-15] · phase1/registry · showcase/src/lib/registry.js
  what → COMPONENTS built from ROSTER; USAGE demoted to enrichment; UNMINED + FUNCTION_MAP deleted; pkg = true barrel owner ✓   why → kills P0-2; P0-4 (wrong install cmds) fixed as a free side effect
  before → 113 browsable rows (frozen JSON)   after → 185 browsable (64 atoms · 57 molecules · 49 organisms · 8 hooks · 7 framework · misc 0)

[12:59 GMT · 2026-07-15] · phase1/miner · scripts/extract-usage.mjs
  what → ROOT_DEFS: 9 dead paths → kol-apps (group) + kol-website (app), missing root = process.exit(1); enumeration = shared parser over ALL barrels ✓   why → kills P0-1; re-mining safe now (roster no longer depends on the JSON)
  verify → re-mined: 6337 files, 203 indexed, 158 with real usage; ArticleCard→kol-content attribution correct

──────────── MILESTONE: phase 1 — enumerator + gate ──────────── [12:59]
  changed: 8 files (4 new) · roster 113→185 · misc 0 · gates: roster+taxonomy+groups clean · build ✓
  kills: P0-1, P0-2, P0-4, P0-5 · docs synced: 00-taxonomy.md roster-mechanics block
  next: phase 2 (de-fork vendored workshop/dashboards) on user go

[13:10 GMT · 2026-07-15] · phase2/repoint · showcase/src/demos/*.jsx ×15 + pages/Home.jsx + sets/metrics-dashboard.jsx
  what → '../workshop/dashboards/index.js' → '@kolkrabbi/kol-dashboards' (15 demos + Home); metrics adapter imports → '../data/metrics/' ✓   why → Home's "rendered live from the packages" banner becomes true
  verify → theme already ships kol-components-dashboards.css (superset of the vendored sheet, +.scrollbar-none) · package barrel = superset (adds MetricsDashboard + constants incl. timeAgo)

[13:10 GMT · 2026-07-15] · phase2/fixtures · showcase/src/workshop/metrics → showcase/src/data/metrics
  what → moved the demo-data adapter (useMetricsData + demo-data) out of the misleading workshop/ folder ✓   why → fixtures are showcase-local by design, just mis-filed

[13:10 GMT · 2026-07-15] · phase2/routes · App.jsx + SidebarNav.jsx + pages/WorkshopPreview.jsx (deleted)
  what → /workshop-preview (vendored shell, fake content) deleted; /workshop-docs (package dogfood) is THE workshop route; sidebar "Workshop shell ↗" repointed ✓   why → two routes claiming to be the shell, one drifted

[13:10 GMT · 2026-07-15] · phase2/delete · showcase/src/workshop/ (shell 9 files + vendor 5 + dashboards 21) + lib/LabeledSection.jsx
  what → vendored fork deleted wholesale; dead zero-importer lib file deleted ✓   why → P0-3: drifted shell fork + split-brain dashboards shadow copy
  note → residual sweep clean; one stale provenance comment in Home fixed

[13:10 GMT · 2026-07-15] · phase2/lock · scripts/validate-imports.mjs (new) + package.json build chain + release.yml step
  what → gate: no showcase/src/workshop dir + no relative imports through workshop|dashboards|shell|vendor dirs ✓   why → the fork stays deleted by CI, not by memory
  verify → build ✓ (roster clean · imports clean · vite 2.23s)
  note → doc-sync manifest has DEAD entries (04-layout-breakpoints.md, 09-dashboards-system.md don't exist) — hygiene item for the audit pile

──────────── MILESTONE: phase 2 — de-fork ──────────── [13:10]
  changed: 21 imports repointed · deleted: 36 vendored files + 1 dead · moved: 2 fixtures · new gate: validate:imports
  kills: P0-3 · P1-3 (workshop-route half) · P2-1 · P2-5 · build ✓ gates ✓
  next: phase 3 (attribution done in ph1 → prose + live token cells) on user go

[13:32 GMT · 2026-07-15] · interlude/backport · packages/content 0.1.0→0.2.0 (user-driven, not the showcase arc)
  what → /work backport brief executed: WorkCard.titleClassName + WorkListItem.previewClassName (replace-not-append display-face seams) + ParallaxShelf.plugins embla pass-through ✓
  note → AsciiClouds REJECTED (user: not DS material) · theme token slot deferred to a 2nd consumer · resolution appended to _tmp/03-work-surface-ds-backport.md for the website repo · user pushed → CI published 0.2.0

[13:32 GMT · 2026-07-15] · phase3/live-tokens · lib/resolve-css-var.jsx + FoundationsColor/Typography + data/{color,typography}.js
  what → resolveTokenThemed (CSSOM walk: light+dark columns from the LOADED theme CSS) + measureClass/LiveClassValue (class-probe) ✓; surface/state hex literals + mono/helper size-lh-weight-ls literals + sans weights DELETED from data files   why → P1-4: "resolves live" claim was false for those tables; now true by construction
  note → prose rows keep authored family/weight — descendant selectors ('.kol-prose h1') can't be probed by class; exempted in the gate

[13:32 GMT · 2026-07-15] · phase3/gate · scripts/validate-foundations.mjs (new)
  what → bans hex literals in data/color.js + size/lh literals & single-class-row weights in data/typography.js ✓ wired into build + release.yml   why → copied token values become a red build, not a review comment

[13:32 GMT · 2026-07-15] · phase3/prose · scripts/extract-descriptions.mjs (new) + registry precedence
  what → JSDoc `Name — sentence.` first-sentence extraction (camel-spaced/case-insensitive name match), 136/185 covered, regenerated EVERY build; registry: extracted ?? authored-fallback ✓   why → P1-5: one-liners rot (ThemeToggle's did same-day); source prose can't
  note → no-JSDoc components (ChessBoard, MetricsDashboard, …) fall back to authored map or '' — fix = add JSDoc headers upstream (package edits, future bumps), not map entries

──────────── MILESTONE: phase 3 — prose + token truth ──────────── [13:32]
  changed: 9 files (2 new scripts, 1 new gate) · descriptions 136 source-derived · foundations cells 100% live-read
  kills: P1-4 · P1-5 (+P0-4 landed in ph1) · gates: roster+imports+foundations clean · build ✓ 2.61s
  next: phase 4 (provenance badges · wire search · de-nav lobby+demo · composition fix) on user go

[13:40 GMT · 2026-07-15] · phase4/composition · scripts/extract-composition.mjs
  what → EXPORT_MAP + KOL_PKGS now derive from packages/ via parse-barrel (dead foundry path gone, workshop star-barrels walked, styleguide included) ✓ re-ran: blocks 22 · sets 8   why → P2-3: headline promise ("every package walked") is finally true

[13:40 GMT · 2026-07-15] · phase4/provenance · lib/CollectionLanding.jsx
  what → ProvenanceBadge (N KOL · M local · external deps, from composition.json) on every /blocks + /sets card AND stage header ✓   why → P1-2: product-vs-recipe signal was buried on the detail page

[13:40 GMT · 2026-07-15] · phase4/search · lib/TopBar.jsx
  what → dead stub → real ⌘K search: SearchInput trigger (readOnly, shortcutHint) + ShellSearchOverlay over COMPONENTS_AZ (name+description filter, 12 cap, grouped by tier) + navigate on select ✓   why → P1-1: the only dead control in real chrome; the DS already shipped the overlay
  note → ⌘K binding lives in TopBar per the overlay's own contract (binding-free component)

[13:40 GMT · 2026-07-15] · phase4/dev-flag · App.jsx + TopBar LINKS
  what → /lobby + /demo routes and the Lobby nav link behind import.meta.env.DEV — dev server keeps them, deployed site never ships them ✓   why → P1-3: maintainer tooling had equal billing with Components
  verify → build ✓ 2.58s · all 3 gates clean · docs synced: 02-shells.md (search row) + 03-slug-composition-gallery.md (walk + badges)

──────────── MILESTONE: phase 4 — provenance + search ──────────── [13:40]
  changed: 5 files · kills: P1-1 · P1-2 · P1-3 (nav half) · P2-3
  ═══ ARC COMPLETE: phases 1-4 all executed · P0 ×5 dead · P1 ×5 dead · P2-1/3/5 dead ═══
  residual (accepted): P2-2 dead fallback keys (harmless as fallbacks) · P2-4 Home hero copy (user-facing text — his call) · no-JSDoc packages ride fallbacks · CollectionLanding pre-existing uppercase classes (type-conform job, not this arc)
  log: session-log pending user /log-work
