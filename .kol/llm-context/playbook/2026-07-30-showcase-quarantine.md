# Playbook — showcase audit + the quarantine arc

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Roadmap (user-facing): `docs/operations/03-showcase-recovery-roadmap.md`. Execution plan: `../plan-2026-07-30-quarantine-reimport.md`.
> Predecessor: `playbook/2026-07-30-mdx-content-migration.md` (the arc whose output this review found broken).

**Goal:** empty the showcase sidebar into a quarantine zone, write the four missing rules, then readmit one category at a time — each behind a user check.

**Standing rules (non-negotiable):**
- git is the user's; publishes are the agent's (/upig)
- every named file gets its repo-relative path
- NOTHING is restyled before its rule is written — that loop is the thing being escaped
- readmission is gated on a user check, never on the agent's own verdict
- reference, don't invent: every rule cites the doc/token/class that already exists

---
## Entries

[13:29 GMT · 2026-07-30] · setup · playbook created
  what → new playbook for the review the user filed with 30 screenshots   why → this is a distinct arc from the MDX migration; that one closed at a milestone, this one audits its output

[13:29 GMT · 2026-07-30] · audit · 22 complaints traced to source, 3 parallel read-only sweeps
  method → shell/sidebar · frontmatter/vault · width/preview; no edits, findings only

[13:29 GMT · 2026-07-30] · finding · the WORKSHOP wordmark was never deleted
  ShellLayout.jsx:127 still renders <Asset name="wordmark-workshop"> as the package DEFAULT
  asset present: packages/brand/src/svg/wordmark-workshop.svg, globbed by AssetLoader.jsx:17
  showcase overrides it — ShellChrome.jsx:150 brand={<ShowcaseBrand/>} → :95 typed span "KOL DS"
  the comment at :84-87 claims no drawn asset exists; one did

[13:29 GMT · 2026-07-30] · finding · tag colours are a string hash
  doc-helpers.js:86-94 — getTagColor hashes the tag name, indexes TAG_COLORS[8]
  a closed taxonomy of 10 namespaces exists at .kol/docs-framework/03-tag-taxonomy.md:23-37, unconsulted
  TagGraph.jsx:123-133 re-implements the palette as 8 RAW HEXES (#3740D3 #66a44c #ffe32e …), none KOL values
  kol-components-molecules.css:284-290 hardcodes #121215 as chip ink, 7×

[13:29 GMT · 2026-07-30] · finding · frontmatter panel filters for a FOREIGN dialect
  DocsFrontmatter.jsx:17 FIELD_ORDER = ['title','category','date','tags','modified']
  category/date/modified = the workshop-SAMPLE dialect; zero kol-docs vault docs carry them
  → filter admits title + tags only → the 2 rows the user saw
  parser is innocent: frontmatter.js:6-41 keeps every key; build-inventory.js:49 attaches whole
  dropped at render despite being present on all 46 docs: type status updated description related aliases sources verified

[13:29 GMT · 2026-07-30] · finding · THREE metadata dialects live at once
  vault .md → kol-docs YAML (46 docs) · component .mdx → {id, slug} only (66) · sets+blocks → .jsx {title,description,category,featured} (30)
  sets/blocks are NOT markdown — that is why they show no frontmatter; there is none
  the MDX generator was a one-shot scratchpad codemod, never landed in scripts/ — not re-runnable

[13:29 GMT · 2026-07-30] · finding · the ONE-rail law is written and broken 3 ways
  law: docs/documentation/04-compositions/02-shells.md:78
  DocsToc.jsx:39-41 kol-mono-12, 0 indent · DocumentationReader.jsx:53 shell-nav-item kol-mono-14, 20px indent · :70-86 shell-sidebar-action, 0 indent
  the violation sits directly under DocumentationReader.jsx:50 `{/* ONE rail voice (user law) */}`
  left rail splits too: ShellSidebar.jsx:106 kol-helper-14 (headers) vs :131 kol-mono-14 (items)
  :78 third branch gives "Documentation" kol-helper-10 text-meta — only because ShellChrome.jsx:118 passes no labelTo

[13:29 GMT · 2026-07-30] · finding · nothing was deleted; the sidebar just does not navigate
  Icons.jsx (107 lines) + Components.jsx (111 lines) intact; routes wired App.jsx:61-62
  icons page still has the 16→128 ramp, keyline overlay, light/dark toggle
  cause: shell-nav.js:34-35 declares icons/components with NO children array
  ShellSidebar.jsx:104-108 makes a childless header toggle-only — chevron (:110-114, unconditional) over an empty body (:122), no count (:117-119)

[13:29 GMT · 2026-07-30] · finding · the width law is in the THEME and the hand-written pages ignore it
  kol-theme.css:75-88 — ONE frame, three caps; shell 1800 · panel 960 · column 768 · measure 65ch
  the law names its own failure: "a hardcoded max-w-[Npx] at a call site means this scale failed"
  obeying: mdx-components.jsx:60 · PreviewCard.jsx:28
  breaking: Foundations.jsx:57 (.kol-grid) · FoundationsColor.jsx:109 (bare Table) · FoundationsTypography.jsx:132 (bare Table) · BlockViewer.jsx:125 (no max-w)
  the generated pipeline obeys; the hand-written pages do not

[13:29 GMT · 2026-07-30] · finding · two preview cards for one job
  PreviewCard.jsx 57 lines — panel-capped :28, oq-08 seam :30, Preview/Code only
  BlockViewer.jsx 219 lines — uncapped :125, border-fg-12, + description + 3 device sizes + fullscreen + reload + source chip
  PreviewCard's own header comment says "one card, everywhere"
  the user's read is correct: the ONE capped instance is the one that read the law

[13:29 GMT · 2026-07-30] · finding · ExitPreview is correctly placed by a rule that asks the wrong question
  02-placement.md:27 atom = nests no KOL component; :60 records the 2026-07-02 call explicitly
  so placement is RIGHT; there is simply no MEMBERSHIP test asking whether a CMS escape hatch belongs in a published package
  the empty demo card: kol-framework.css:486-490 position:fixed bottom:24 left:24 z-index:9999 — it escapes the card into the viewport corner (the floating black × in the screenshots)
  same rule carries text-transform:uppercase :502 — against the standing no-auto-casing law

[13:29 GMT · 2026-07-30] · finding · the node graph exists and is unreachable
  TagGraph.jsx ← TagModeOverlay.jsx:126-135 ← TagModeGate.jsx:12 ← App.jsx:78
  path: /documentation/<id> → click a tag pill → click the polygon icon top-left
  buried because: gate wraps ONLY /documentation/:docId · button gated on hasFilters (:33,:39) so absent from the DOM until a tag is active · any route change closes tag mode (TagModeContext.jsx:63-67)
  no route, no nav entry, no shortcut

[13:29 GMT · 2026-07-30] · synthesis · 5 root causes, not 22 bugs
  1 override instead of read · 2 dangling classes + foreign dialects · 3 improvised values where a scale exists · 4 affordances that promise nothing · 5 no membership test
  common shape: the rule EXISTED in every case. wordmark, width, rail, taxonomy, placement — all written, all walked past

[13:29 GMT · 2026-07-30] · ruling-needed · quarantine is an ADMISSION GATE, not a file move
  roster.js:34-58 derives the sidebar from package barrels at build time — there is no hand-list to empty
  so: roster gains an explicit `admitted` set; absent → /quarantine holding page
  classification.js is already the hand-authored layer validate-roster checks — same seam

[13:41 GMT · 2026-07-30] · CORRECTION · the "empty pages" cause was wrong on first pass
  NOT the sidebar header — /icons renders 165 icons/26 groups, /components renders 188 components/16 sections, roster parses 207 rows (all verified live)
  REAL cause → ShellLayout.jsx:87 declares the TOC column at xl, :48 renders TocColumn at `hidden lg:block`
  1024–1279px → 3 children in a 2-col grid → TOC wraps to row 2 → h-full splits the height
  measured 1100×900 on /components: grid-template-rows 373px 373px; main gets 373 of a 900px window
  compounding: :78 hasToc = Boolean(effectiveTocContent) — defaultTocContent is the <AutoToc/> ELEMENT, truthy even when AutoToc returns null
  the childless-header bug is REAL but SEPARATE — it is not why the page looked blank

[13:41 GMT · 2026-07-30] · CORRECTION · the width root cause is ONE line, not N pages
  ShellLayout.jsx:186 → `h-full w-full px-4 md:px-5 lg:px-6` — no max-w, no mx-auto, Tailwind steps not the ramp
  measured @2200 viewport: grid 2152 · main 1576 · inset 24 (token says 48) — 352px past the 1800 law, unbounded
  only capped paths in the whole app: ShellChrome.jsx:137 (embed only) + Home.jsx:360
  .kol-page EXISTS (kol-framework.css:140-144) and zero showcase pages use it
  dead hardcodes to remove: DocumentationReader.jsx:379 max-w-[1400px] (tier killed at theme 0.11.22) · TagModeOverlay.jsx:37 max-w-[864px]
  → phase 2 gains a row 0: fix the frame BEFORE judging any page

[13:41 GMT · 2026-07-30] · detail · the two preview cards diverge on 7 axes, not 4
  measured: PreviewCard 960px / radius 4 / oq-08 seam / authored "Preview"+"Code" / CodeBlock
  BlockViewer 1574px / radius 8 (breaks the 4px radius law) / border-fg-12 / lowercase strings + capitalize / bespoke <pre> (breaks the one-code-idiom ruling)
  plus 3 MORE framed chromes: CollectionPage.jsx:38-55 · Components.jsx:44-58 · component-page-parts.jsx:112-119 (a third tab-button idiom)
  PreviewCard puts .kol-doc-figure on a bare div instead of the packaged DocFigure (DocKit.jsx:61-68) → its caption slot is unreachable

[13:41 GMT · 2026-07-30] · note · icon MODE toggle cannot be restored as-was
  stroke/solid/svg/svg-web sets deleted + Icon's `variant` prop removed at kol-icons 0.8.0
  session-log/2026-07-28-v1-only-icons-wave-0-8-0.md:5 · 1,898 legacy SVGs parked at _tmp/legacy-icons/ (gitignored, this machine only)
  → if he wants it back it is a decision, not a restore

[13:41 GMT · 2026-07-30] · note · live environment conditions
  FOUR dev servers running concurrently: 5323 (02:53) · 5324 (04:38) · 5325 · 5326 (04:46) — an old tab is a stale module graph
  console error on /components: "Encountered two children with the same key, 'atoms'"
  silent-drop path: registry.js:322-327 filters by CATEGORY_ORDER — an uncategorised package vanishes with no error (harmless today, a route to a blank page)

[13:41 GMT · 2026-07-30] · pause · docs written, no code touched, waiting on the user
  roadmap → docs/operations/03-showcase-recovery-roadmap.md
  plan → .kol/llm-context/plan-2026-07-30-quarantine-reimport.md
  open question for him: the sidebar paste-JSX-name ask has two readings — a search that accepts a pasted JSX name, or the tree rows dropping PascalCase for spaced labels. not guessing.

[13:45 GMT · 2026-07-30] · ruling · user approved gates-before-styling ("sounds good")
  his framing: he will not read reviews; a report he must read is worth nothing, a command he runs is worth something
  → the deliverable is a NUMBER he reproduces himself, not a paragraph

[13:45 GMT · 2026-07-30] · built · scripts/validate-width.mjs — 14 violations
  W1 shell frame carries a --kol-content-* cap → FAILS (ShellLayout.jsx, the root cause)
  W2 no hardcoded max-w-[Npx] → 10 hits, incl. PageSection.jsx:15 hardcoding 960px = the panel token's own value typed by hand
  W3 a page rendering Table/CodeBlock references --kol-content-panel → 3 hits (DocsTypeRoles, FoundationsColor, FoundationsTypography)
  W3 is file-scoped not element-scoped, stated in the header — it cannot false-positive on a page that already caps

[13:45 GMT · 2026-07-30] · built · scripts/validate-rails.mjs — 16 violations
  first pass scoped by FILE → 19, of which 3 were FALSE POSITIVES (kol-sans-heading-05 on <h3> in the article body, kol-mono-12 on the not-found page)
  fixed → scope by rail COMPONENT (Sidebar|Toc|Rail|Nav), top-level declarations only
  second bug caught in the same pass: inner helper arrows (`const handleSectionClick = …`) were stealing the scope → require zero indent
  16 real: ShellSidebar 3 · WorkshopSidebar 3 · DocumentationReader 4 · WorkshopDefaultSidebar 5 · DocsToc 1

[13:45 GMT · 2026-07-30] · built · scripts/validate-all.mjs + `pnpm validate` — the scoreboard
  runs all 7 to COMPLETION (not fail-fast) — the point is which laws hold and by how much
  roster · imports · taxonomy · groups · foundations = clean · width 14 · rails 16
  → 2 of 7 gates failing · 30 violations total
  deliberately NOT wired into `pnpm build` — a red gate in the deploy path breaks Vercel; joins in phase 3 when the count is 0

[13:45 GMT · 2026-07-30] · state · the 5 pre-existing gates are all clean, the 2 new ones are not
  that IS the thesis, measured in his own repo: rules with a script held, rules in prose drifted

[13:59 GMT · 2026-07-30] · ruling · user handed full autonomy ("dont ask me, just do whatever")
  → stopped writing plans, started fixing. gates went 30 → 0 in one pass

[13:59 GMT · 2026-07-30] · fixed · THE frame — ShellLayout.jsx content wrapper
  was `h-full w-full px-4 md:px-5 lg:px-6` → `mx-auto max-w-[var(--kol-content-shell)]` + paddingInline var(--kol-pad-section-x)
  this ONE line was the parent of every full-width complaint in the review

[13:59 GMT · 2026-07-30] · fixed · TocColumn lg → xl (matches gridCols' own xl declaration)
  kills the 1024–1279px half-height main column — the reason /icons and /components read as empty

[13:59 GMT · 2026-07-30] · NOT fixed, deliberately · hasToc = Boolean(element) is still always true
  wrote a MutationObserver probe, then reverted it: once the column unmounts the probe is gone and can never report content again → deadlock
  real fix is a consumer-side signal (render-prop returning null, or an explicit hasToc prop) = an API change
  filed in the code, not improvised. the bug it was blamed for was the lg/xl mismatch, and that IS fixed

[13:59 GMT · 2026-07-30] · fixed · wordmark — <Asset name="wordmark-workshop"> replaces the typed "KOL DS" span

[13:59 GMT · 2026-07-30] · fixed · DocsFrontmatter FIELD_ORDER → the real kol-docs contract
  title type status updated created verified description audience aliases tags, sample-dialect keys kept at the tail
  + DATE_FIELDS set (updated/created/verified formatted, not printed raw) + arrays joined
  2 rows → the actual frontmatter

[13:59 GMT · 2026-07-30] · fixed · tag colour by NAMESPACE not hash
  doc-helpers.js getTagColor → NAMESPACE_COLORS from the closed taxonomy; hash kept only as fallback for tags outside it
  domain/* is now one colour, so the eye can group by prefix and a rename no longer recolours a tag

[13:59 GMT · 2026-07-30] · CORRECTION to my own audit · the graph hexes WERE palette values
  I wrote "none of those are KOL palette values" — wrong. #3740D3 IS --kol-palette-blue, #66a44c green, #ffe32e yellow
  they were hand-typed COPIES, frozen against a retune. wrong diagnosis, real defect. corrected in the roadmap
  also caught: no --kol-palette-dark exists → my first fix would have emitted an invalid var(); `dark` now falls to surface-on-primary

[13:59 GMT · 2026-07-30] · fixed · rails 16 → 0
  ShellSidebar label branch kol-helper-10 → kol-doc-eyebrow (the fork existed only because that mount passed no labelTo)
  group headers kol-helper-14 → kol-mono-14, counts kol-helper-12 → kol-mono-14
  DocsToc kol-mono-12/py-1 → shell-nav-item kol-mono-14 (the 0-vs-20px indent in the screenshots)
  quick actions + WorkshopDefaultSidebar shell-sidebar-action/-link → shell-nav-item
  WorkshopSidebar's three ramps unified

[13:59 GMT · 2026-07-30] · fixed · childless sidebar groups are Links now, not toggles
  chevron + count render only when there IS something to expand; a childless row navigates to its own path
  "Icons" and "Components" in the tree now go somewhere

[13:59 GMT · 2026-07-30] · fixed · dead width hardcodes
  DocumentationReader max-w-[1400px] (tier killed at theme 0.11.22) → panel · TagModeOverlay max-w-[864px] → panel
  PageSection max-w-[960px]/[720px] → panel/column tokens (they were transcriptions of those exact tokens)
  FoundationsColor + FoundationsTypography tables and DocsTypeRoles CodeBlock wrapped at panel

[13:59 GMT · 2026-07-30] · CAUGHT BY BUILDING, not by the gates · two JSX comments in EXPRESSION position
  `{hasHead && ( {/* … */} <header> )` and `return ( {/* … */} <div> )` are syntax errors, not comments
  the gates were green while the app would not compile — a validator is not a build
  → both moved to block comments; `pnpm --filter showcase build` green in 4.02s
  lesson: run the build after a comment-heavy pass, gates prove RULES not SYNTAX

[13:59 GMT · 2026-07-30] · narrowed · validate-width W2 now skips demos/ blocks/ sets/
  a 420px glass panel is that component's own size, not a content frame
  forcing specimens onto the content scale would be this gate's own disease pointed the other way

[13:59 GMT · 2026-07-30] · state · pnpm validate → all 7 gates clean · showcase build green
  NOT done: preview-card unification (2 cards, 7 divergences) · metadata converge (3 dialects) · node-graph entry point · quarantine phases
  NOT published: kol-workshop, kol-component, kol-framework all edited — bumps + publish still owed

[14:07 GMT · 2026-07-30] · published · component 0.14.2 · framework 0.9.1 · workshop 0.4.0
  order component → framework → workshop (dep order); pnpm publish --no-git-checks, OTP-free
  workspace:* rewrite VERIFIED on the registry — workshop deps read icons 0.8.11 / framework 0.9.1 / theme 0.13.3 / component 0.14.2
  (the framework-0.8.0 trap was an npm publish leaking raw workspace:* — pnpm rewrites, npm does not)
  npm view version lagged on cache; dist-tags latest = 0.4.0 confirms
  SHIPPED-PACKAGES.md synced same turn

[14:07 GMT · 2026-07-30] · CORRECTION caught at bump time · my own comment was false
  wrote "same values, now read from it" on PageSection — but 720px → --kol-content-column is 768px
  a real 48px widening of every non-fullbleed section head. comment corrected before publish
