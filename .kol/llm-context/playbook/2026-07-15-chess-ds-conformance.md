# Playbook — Chess DS conformance (consumer audit execution)

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`. Source brief: `_tmp/DESIGN-SYSTEM-AUDIT.md` (from the kol-chess consumer app).

**Goal:** Execute the 2026-07-15 kol-chess consumer audit in THIS repo — findings 1–7 + bonus rot. Three passes: **theme** (link token/rule · opaque table borders · kill `.kol-table-cell-title` uppercase) → **chess sweep** (button hierarchy/variants · type roles · Dropdown/Accordion adoption · playback dedup · GameSelector dead export · `charAt().toUpperCase()` casing · Accordion-collapsed archive + scroll-hack removal · raw `<a>`) → **component** (Button `danger` variant, user-gated). Verify every change at **`/demo`** (1:1 consumer mirror, `max-w-[1232px] px-4 py-8 md:px-6 md:py-12`).

**Standing rules (non-negotiable):**
- Verify at `/demo` (HMR) — it IS the consumer view; both themes via the floating ThemeToggle.
- Bump with the edit: theme → 0.7.5 · chess → 0.2.0 · component → 0.10.0 (staged, publish rides user push).
- No text-transform / no JS auto-casing — strings authored in-case at call sites.
- Audit finding 2 (theme toggle) is a CONSUMER fix (mount kol-framework's ThemeToggle) — not package work here.
- roster/imports/foundations gates must stay clean; new exports need classification.js entries.
- No git, no publish without explicit user OK.

---
## Entries

[14:35 GMT · 2026-07-15] · setup · playbook created
  what → initialised the chess-conformance journal   why → localise chess changes in their own arc (separate from the closed showcase-truth-rebuild playbook)
  note → /demo page created this session (replaced chrome-law review, dev-only); consumer wrapper values verbatim from the kol-chess repo printout

[14:43 GMT · 2026-07-15] · pass1/links · kol-color.css + kol-base-tokens.css (finding 3)
  what → NEW --kol-link/--kol-link-hover (light #2563EB/#1D4ED8 · dark #60A5FA/#93C5FD, --ui-info family) + base a{}/a:hover rule + dark values in BOTH the explicit dark block and the prefers-color-scheme auto block ✓
  why → no link token/rule existed; --kol-accent-primary = ink in the neutral theme (brand layer may remap accents — the showcase aliasRows yellow-300 claim is brand-layer, PARK verify)
  note → a{} sits in layer(components) → utilities + framework/brand sheets still win; .kol-table a → link tokens (kills the specificity fight the consumer lost)

[14:43 GMT · 2026-07-15] · pass1/borders · kol-components-organisms.css (finding 4)
  what → .kol-table-wrapper border + thead border-bottom + row border-bottom: fg-08 → oq-08 (opaque mirror, same weight) ✓   why → stacked translucent borders composited into dark seams over gradients
  note → thead bg fg-04 + scroll-affordance fg-16 gradients kept — single-layer washes, translucency intended

[14:43 GMT · 2026-07-15] · pass1/casing · kol-components-organisms.css + GameArchiveTable.jsx (bonus rot, coordinated)
  what → .kol-table-cell-title text-transform:uppercase DELETED; chess's 7 headers re-authored to their designed caps ('DATE'…'LINK') same pass ✓
  why → casing law — headers render as authored; caps is a call-site decision
  note → ripple accepted: workshop doc-tables + showcase Foundations headers now render authored-case ("Token" not TOKEN) — correct per law; external consumers see it at next theme bump (changelog note pending)

  bumps → theme 0.7.4→0.7.5 · chess 0.1.0→0.2.0 (staged) · verify → braces ✓ parse ✓ build ✓ 2.23s · docs: 01-tokens.md hyperlink section
  USER: eyeball /demo — links blue both themes, table seams gone, DATE headers still caps

[15:00 GMT · 2026-07-15] · pass2/archive · GameArchiveTable.jsx (findings 1,5,6,7 + rot)
  what → charAt().toUpperCase() ×4 → authored TIME_CLASS_LABELS/RESULT_LABELS maps; scrollTo hack DELETED; row 'Load here' primary→outline, 'Load full month' outline→primary (one CTA hierarchy); status eyebrow → kol-helper-12 'GAME ARCHIVE STATUS'; 'Browse Games' mono-16 → kol-sans-heading-05; count Tag → Pill subtle sm (one badge treatment); 'Chess.com →' → authored 'CHESS.COM →' ✓

[15:00 GMT · 2026-07-15] · pass2/layout · ChessAnalysisLayout.jsx (finding 6)
  what → archive folded behind DS Accordion (AccordionPanel 'GAME ARCHIVE' defaultOpen); lg:max-w-[1232px] cap REMOVED — page framing is the consumer's job ✓
  note → defaultOpen keeps the current look; collapse kills the load-scroll jump

[15:00 GMT · 2026-07-15] · pass2/controls · AlternativeControlsMock + PlaybackControls + NotationPanel + VariationTree (findings 1,5,7 + dedup)
  what → verbatim inline playback block + duplicate playbackButtons array → ONE <PlaybackControls/>; toolbar icon chrome ×6 + playback ×5 + ply buttons (Notation ×2, VariationTree ×2) primary/outline → ghost(+selected); remove-variation → ghost (red className stays until pass-3 danger); inlined GameSelector clone → DS Dropdown + opening caption; ALL eyebrow spans kol-mono-10/12+uppercase+tracking → kol-helper-10/12 with authored-caps statics ('PIECE SET'…'TERMINATION', WHITE/BLACK map) ✓
  note → REASONED KEEP (user to ruleD): GAME INFO + NOTATION disclosures stay hand-rolled — AccordionPanel can't do the rail's fill-height/inner-scroll contract and its title chrome auto-uppercases dynamic labels (its own parked casing bug); trigger rows conformed typographically

[15:00 GMT · 2026-07-15] · pass2/rot · GameSelector.jsx DELETED (finding: dead export)
  what → file + barrel line + classification entries removed; chess doc 08 apparatus row updated ✓   verify → roster gate 213→212 clean · imports ✓ foundations ✓ · build ✓ 2.77s
  USER: eyeball /demo — quiet toolbar, one playback unit, Dropdown game picker, folded archive

[15:11 GMT · 2026-07-15] · pass3/danger · kol-components-atoms.css + Button.jsx + VariationTree.jsx (finding 1 tail)
  what → NEW Button variant="danger" — --ui-error fill, absolute-white label, opaque stops (hover 80% / active 70% mix, accent's exact shape); chess remove-variation drops the red-className hack for it ✓
  bumps → component 0.9.0→0.10.0 (staged; theme chrome rides 0.7.5) · docs: 05-control-chrome.md danger row + component-docs.js Button api
  verify → parse ✓ · gates ✓ (212) · build ✓ 2.25s · USER gate: judge the red at /demo (Custom Variations remove) — veto reverts 3 files
  note → CONTRADICTION FLAGGED in 05-control-chrome.md: doc says two-variants + ghost retiring; code ships real .kol-btn-ghost and pass 2 leaned on it — ruling belongs to the announced button/dropdown inconsistency sweep (ghost un-retires OR chess re-lands on quiet+pressed)

[15:16 GMT · 2026-07-15] · sweep/button+dropdown · 05-control-chrome.md + Accordion.jsx + foundry ×3 + demos/Accordion.jsx
  what → GHOST UN-RETIRED (ruling: chess sweep + SplitToolButton contract = real usage; retirement rationale dead) — chrome doc rewritten: variant set = primary/outline structural + ghost/secondary/accent/danger roles; alias list drops ghost (control→ghost, Dropdown default/subtle/minimal, Input SHELL ghost→outline documented as non-contradiction) ✓
  what → tool-trigger TRIO ruled (Dropdown / ShapeDropdown / SplitToolButton = deliberate contracts, do-not-merge law in the doc) — parked SplitToolButton⇄ShapeDropdown thread CLOSED ✓
  what → AccordionPanel title/meta `uppercase tracking-widest` DELETED (helper-12 owns ls; casing law); demo titles authored to caps (OVERVIEW/MATERIALS/SHIPPING); GAME ARCHIVE already authored ✓
  what → 8 dead Slider variant="minimal" props stripped across foundry (documented no-op since 0.6.0) → foundry 0.4.1 ✓
  note → NEW parked item: ghost oq-48 resting-label AA contrast (live again post-un-retirement)
  verify → parse ×5 ✓ · gates ✓ (212) · build ✓ 2.30s · bumps now: theme 0.7.5 · chess 0.2.0 · component 0.10.0 · foundry 0.4.1
  ⚠ USER: "everything in the button+dropdown sweep was incorrect" — correction session pending, DO NOT build on those rulings (ghost un-retirement, trio law, accordion casing, slider props all provisional until he rules)

[15:22 GMT · 2026-07-15] · extract/expanding-search · SearchInput.jsx + WorkViewToggle.jsx (user-directed)
  what → SearchInput gains the `expanding` body plan (round trigger → width-animated field, controlled/uncontrolled `open`, focus-on-open, Escape→onOpenChange(false), clearing stays parent's) — lifted verbatim from WorkViewToggle's hand-rolled pill; WorkViewToggle rewires onto <SearchInput expanding> keeping the toggle + sibling space-trading choreography ✓
  note → WorkViewToggle tier atom→MOLECULE (now nests a KOL atom — mechanical test); classification + taxonomy-ok comment updated; demo gains an expanding row
  verify → parse ×3 ✓ · gates ✓ (212) · build ✓ 2.27s · rides staged component 0.10.0 + content 0.2.0
  USER: judge at /components/search-input (4th demo row) + work-portfolio set

[16:10 GMT · 2026-07-15] · visual-pass/user-driven · rapid-fire fixes from his /demo review (each user-approved)
  what → all chess Dropdowns + archive search → size="sm" (Dropdown auto-sizes lg ≥1024 — root of "large"); archive search width="100%" (shell hugged inside its 280px box); 'Load full month (N games)' → 'Load all (N)'; both load buttons → .analysis-control (200px, = dropdowns) ✓
  what → MenuDropdownItem +shrink-0 — 106-option month panel was flex-CRUSHING rows to 12px (h-8 lost to shrink:1 in the max-h scroll column; 3-option panels never overflowed → looked fine) ✓
  what → DROPDOWN LAW (user): no hover, no clicked state — scoped .kol-dd-trigger overrides pin rest fill on hover/active (primary + outline); states = rest + open ✓
  what → GAME INFO/NOTATION triggers → exact sm rung h-[26px] (was 36px off-scale); flex-1 → w-full (flex-basis-0 in the column collapsed pinned height to 16px content); NOTATION authored caps (was dynamic opening-name data — label vs data split) ✓
  what → playback transport = variant PRIMARY (user reverses my pass-2 ghost call) ✓
  note → dev-server restart needed for h-[26px] (Tailwind doesn't pick NEW arbitrary classes from symlinked package sources live; fresh build verified the rule exists)

[16:10 GMT · 2026-07-15] · icons/remap+promote · chess ×2 + kol-icons 0.5.0→0.6.0
  what → remapped to v1: search-16→search ×3 · rotate→refresh · component→component-01 ✓
  what → PROMOTED 6 playback glyphs → kol-icon-set-v1/playback/ {play, pause, skip-start, skip-back, skip-forward, skip-end} — stroke 2→1.5 (set norm), play-Play rot-name killed; PlaybackControls consumes set names ✓
  note → still legacy, no v1 twin: stat-cycle + pills (edit-mode toggle) + stat-chart-b/c — awaiting user call
  note → 02-icons/01-inventory.md not touched (scopes legacy stroke/solid trees only)

[16:57 GMT · 2026-07-15] · visual-pass-2/user-driven · grey variants + rail polish (each user-approved)
  what → Dropdown variant="grey" (dropdown-only chrome, no kol-btn-* leak) + Button variant="grey" (real states) — both settled on oq-12 rest (button 12/16/24) after an oq-16 first cut; all 3 rail dropdowns + playback transport wear grey ✓
  what → rail: DS Divider before MATERIAL · SETUP POSITION/MATERIAL/NOTATION labels helper-12 fg-80 · NOTATION px stripped · GAME INFO → PopoverPanel on a star-solid trigger (NEW v1 glyph) next to the game picker; disclosure + capitalize killed (labels.js shared module) ✓
  what → notation → 3-col grid (number/white/black), gap-y-1, autoscroll ref kept · 3 dead chart spans deleted · edit-mode → v1 'edit' · clear board → 'x' · ChessSidebar + ChessBoardWithSidebar playback names → v1 skip-*/play ✓ chess = ZERO legacy icon names
  what → ThemeToggle: BOTH slots = mode-toggle-01 (same-icon slide, per original design intent) → framework 0.4.1 (0.4.0 already live)
  note → MenuDropdownItem shrink-0 (flex-crush fix) · .kol-dd-trigger no-hover/active overrides · dropdowns+search sm · load buttons .analysis-control · 'Load all (N)' copy

[16:57 GMT · 2026-07-15] · 100dvh-stage · ChessAnalysisLayout (rewrite) + ChessBoardWithControls + chess.css + Demo.jsx
  what → the stage ruling: h-dvh column — Games trigger strip (ghost, v1 grid glyph) · board anchor · archive → FullscreenOverlay (85dvh internal scroll, game-load closes it) — Accordion GONE both breakpoints ✓
  what → .chess-board--fluid sizes by width AND height: min(100%, 100dvh−200px) desktop / −380px mobile budget, aspect-locked ✓
  what → mobile: column fills stage (board flex-shrink-0, rail flex-1 min-h-0 scroll-inside); setup toolbar + pickers fold behind a settings-01 ghost toggle (lg always-open) ✓
  what → /demo wrapper drops py (stage owns vertical) — consumer brief must note the same for the chess app ✓
  verify → parse ×3 ✓ gates ✓ build ✓ 3.05s · USER: restart dev (new arbitrary classes: h-dvh budgets, mt-[6dvh], max-h-[85dvh])

[17:34 GMT · 2026-07-15] · stage-polish/user-driven · overlay chrome + mobile pass (each user-approved live at /demo + phone via --host)
  what → FullscreenOverlay had NO CSS anywhere (classes shipped chrome-less — MediaViewer inherits the fix): theme now ships .kol-overlay (fixed dim, grid-center, scroll) / -sheet (hugs content → backdrop-dismiss actually fires) / -close (32px corner); NEW closeButton prop opts out ✓
  what → archive panel: rounded (4px LAW — rounded-lg slip corrected by user), close = the OPENER's anatomy (ghost/sm iconLeft x 'Close') inside the panel; overlayActions slot renders consumer chrome (demo passes ThemeToggle) beside it ✓
  what → mobile: board pinned + rail finger-scrolls (min-h-full grow below lg) · rail width married to board width (same 100dvh−380 cap, both centered) · piece palette hidden · settings-01 inline with picker row · playback order-first · stage pt-3 (was py-3) ✓
  what → notation autoscroll REMOVED (user ruling: playback must not steal scroll) · ThemeToggle both slots = mode-toggle-01 (same-icon slide, user's original intent) → framework 0.4.1 ✓
  note → content 0.2.0 SAME-VERSION TRAP caught at close (WorkViewToggle rewire landed after the 0.2.0 publish) → 0.3.0
  note → future (user): chess ENGINE for evaluation — new arc when he calls it

──────────── MILESTONE-ish: chess conformance + stage — user happy for now ──────────── [17:34]
  publish batch staged: chess 0.2.0 · component 0.10.0 · content 0.3.0 · foundry 0.4.1 · framework 0.4.1 · icons 0.6.0 · theme 0.7.5 (7 packages, one push)
  log: session-log/2026-07-15-chess-conformance-stage.md
