# Session: Preview-truth audit + website ledger + brief 2.0

**Date:** 2026-07-15 (late evening)
**Agent:** Grim (Opus 4.8)
**Summary:** User caught the showcase previews lying (the truth-rebuild gates checked plumbing, never looked at renders). Full 152-demo semantic audit → 25 stale fixed + component-side law violations; then the website DS-CHANGES ledger executed; then DESIGN-SYSTEM-AUDIT-2.0 (chess engine seams) executed under /kol-goal with all acceptance verified live.

## Changes Made

### Preview-truth arc
- 7-agent audit of all 152 demos: 25 stale, 0 wrong-component. Fixed all: canonical variants shown (Dropdown primary/grey/outline, Button ×7, ToggleSwitch bare/primary/outline, ViewToggle +single), v1 icon names across 10 demos, 4 chess demos wired to the `/data` adapter (were data-dead), dead comments killed. MenuPopover demo (deprecated, unreachable) → `_tmp/`.
- Component-side law fixes: uppercase stripped from 9 approved sites (AssetPlaceholder, LabeledControl, Input `uppercase` prop REMOVED, Section, ToggleBracket, ToggleCheckbox, ChessBoard coords via authored `FILE_LABELS`, SideNav, SubPageHero) + repo call-sites re-authored caps to preserve looks; legacy icons remapped (TabsRow close→x, Tag cross→x, ViewToggle defaults, ShellHeader menu→hamburger/dock-left→panel-left, WorkViewToggle defaults, foundry foundation→book-open ×4).
- **Repo-wide casing remainder parked** (user's call): ~40 theme-CSS text-transform rules + unflagged JSX → `backlog/2026-07-15-casing-arc-and-icon-gaps.md`.
- TextPressure demo LIVE: `TGRotVF.ttf` shipped to showcase fonts, hover deformation verified.
- `Card` export mechanism (index prefers slim single-specimen card over full demo) + 10 cards authored; 28 new demos via 4-agent fanout (chess 6 · foundry 8 · store/dash 9 · component/content 5) — demo-less roster gap closed; providers/contexts → DOCS_ONLY.
- Chess preview truth: BlockViewer presets now render TRUE device widths scaled-to-fit (desktop=1280 when card < lg) at 800px frame height (620 starved every dvh budget — this alone broke the board/controls width marriage); chess set uses /demo's consumer wrapper verbatim; ChessAnalysisLayout demo = scaled iframe onto the standalone set preview.

### Website ledger (DS-CHANGES.md — 7 of 12 executed, 5 are user rulings)
- kol-content: WorkListItem `tagsSeparator`, WorkCard `metaClassName`.
- kol-framework: `useTheme`/`applyTheme`/`getInitialTheme`/`THEME_STORAGE_KEY` exported; ThemeToggle rewired onto the hook (attribute-observer sync).
- kol-component: `GRAPHIC_RAW` re-export; CodeBlock portable-text shape + `filename` chip (+ fixed dormant chip-padding adjacency).
- kol-theme: `kol-sources.css` @source manifest for all 11 raw-JSX packages — verified missing paths no-op; showcase dogfoods it.
- kol-icons: mode-toggle SVGs cleaned to viewBox-only — which exposed a REAL loader bug: `applySizeToMarkup`'s unanchored regex rewrote the first `width=` anywhere (i.e. a path's `stroke-width`) → solid blob; loader now sizes the root tag only.
- Held for user: #4 light-first block, #5 specimen≈foundry dedupe, #7 kol-segment-title, #10 sidebar rhythm (+#1 user ships).

### Brief 2.0 (DESIGN-SYSTEM-AUDIT-2.0.md — /kol-goal run, resolution appended to the brief)
- Seams (chess): `panel` prop inside the provider (shared width cap budgets 90px, board↔rail marriage kept), controlled `externalGame` (merges with archive loads), context activation fix (injected game selects on the board).
- Defect 1 REDIAGNOSED: theme layered since 0.4.0; real culprit = inline style in Button's iconOnly branch → `.kol-btn-icon` chrome class. `lg:hidden` verified winning.
- Defect 2: Dropdown list/caret → `.kol-dd-list`/`.kol-dd-caret` (data-state flip), zero inline/utility chrome left.
- Defect 3: icons README `optimizeDeps.exclude` section; `arrow-downright` stroke-normalized into v1.
- Defect 4: ThemeToggle already shipped (framework 0.4.0) — consumer note.
- **Two latent bugs found by the acceptance run:** popovers stacked UNDER `.kol-overlay` (→ `.kol-popover-float` z-110) and FullscreenOverlay dismissed on portalled-child clicks (→ backdrop-only `e.target === e.currentTarget`).
- Acceptance ×5 verified live (panel strip live · no scroll at 100dvh · archive load switches board · gear hidden lg+ · dropdown styled without @source).

### Staged versions (semver-corrected: additive API = minor)
component **0.11.0** · chess **0.3.0** · framework **0.5.0** · content **0.4.0** · theme **0.8.0** · icons **0.7.0** · foundry **0.4.2** — one push publishes. Gates green (roster 212 / imports / foundations).

## Current State

### Working
- Showcase previews truthful: 25 stale fixed, coverage gap closed (~170 live previews), cards de-crammed, chess renders true desktop/tablet/mobile at every preset.
- Brief 2.0 complete — consumer can delete its `/analyse` fork on bump.

### Known Issues
- Casing-arc remainder + icon-set gaps parked at `backlog/2026-07-15-casing-arc-and-icon-gaps.md` (incl. 6 legacy icons firing live: dashboards internals ×4, showcase chrome ×2).
- Website-ledger rulings #4/#5/#7/#10 waiting on user.
- MetricsDashboard demo's range/host toggles re-label but don't re-slice (static fixture, by design).

## Next Steps
1. **Fresh website blockers doc arrived:** `_tmp/DS-CHANGES-2.0.md` — read + execute next session.
2. User pushes → CI publishes the 7-package batch; chess app + website bump and apply their consumer notes (brief 2.0 resolution section + ledger).
3. User rulings: casing-arc go/no-go, ledger #4/#5/#7/#10.
