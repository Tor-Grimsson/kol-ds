# Session: four tickets, kol-shell born, the changelogs resumed

**Date:** 2026-08-14
**Agent:** Grim (Opus 5)
**Summary:** The day's four lobby filings closed in one wave — the font-path rename shipped BREAKING, four retired icons promoted back into v1, the dead changelog channel revived as a written publish law, and the app shell lifted out of kol-monitor/kol-mirror into the eleventh UI package.

## Changes Made

### Lobby tickets closed (4, all 🟢 with versions cited)

- **FontFolderNaming** — 98 `@font-face` srcs in `kol-typography.css` → `/fonts/right-grotesk/`; the `"Right Grotesk Text"` pair (727–740) deleted; the header's stale "Loaded cuts" list corrected to the 7 real families. This repo's consumer half in the same pass: `public/fonts/` renamed (`right-grotesk/` + `right-grotesk-ttf/`), showcase demos + theme README + foundry doc-comment synced, `Right-Grotesk-Text/` statics → `_tmp/2026-08-14-right-grotesk-text-statics/`. theme **0.41.0** (BREAKING) + foundry **0.5.5**.
- **DashboardIconCoverage** — user ruling **v1 grows**: 4 drawings promoted from the retired shelves under plain names (prefixes drop) — `crown` · `trophy` · `stopwatch` (misc) · `users` (nav); crown/trophy verbatim from the keyline `_tmp/icons-v1-export/` shelf, stopwatch/users redrawn to keyline from the filled legacy cuts. 3 names mapped NOT minted: `dashboard-bookmark`→`bookmark` · `dashboard-roadmap`→`roadmap` · `trending`→`trending-up`. icons **0.16.0**; inventory **198 · 27**.
- **PublishWaveChangelog** — the rule written into `docs/operations/01-release/INDEX.md` §0: the live direct-publish path with the changelog entry as a non-skippable step, BREAKING flags for token renames / default flips / bare-element rules / moved asset paths. All 13 stale-or-empty changelogs **resumed with a dated gap note, not truncated** — the old entries are a true record.
- **AppShellSet** — **`@kolkrabbi/kol-shell` 0.1.0** born as a sibling package (not a kol-framework variant): AppShell + NavRail + `useNavHidden`, PageShell/PageBleed, PageHeader, ContentFilters + TabStrip, GridCard, SettingsScaffold/SettingsSection/LabelRow, WalkthroughPanel, ShortcutsOverlay, Logomark. Router-agnostic (`currentPath`/`onNavigate`); icons via Button's `iconComponent` seam. Chrome in theme (`kol-components-shell.css`); framework **0.20.0** gained `./src/*` subpath exports so both consumers' pnpm patch dies.

### Shipped drift fixed while recreating the shell

Dead `ViewToggle` import (both repos) · GridCard's hardcoded `rgba(255,255,255,0.06)` borderTop → `border-fg-04` (live light-theme bug in two shipped apps) · `capitalize`/`uppercase` transforms dropped (no-auto-casing law) · rail `z-70` → `--kol-z-sticky` · mirror's `bg-container-secondary` (a class no theme defines) → `bg-fg-04`.

### Rulings carried, not invented

- The 2026-08-12 **active-wash ruling** is now native: `.kol-shell-rail .kol-btn-nav[aria-current="page"]` = the oq-04 wash held on + oq-96 ink. **Scoped to the rail** — the global `.kol-btn-nav[aria-current]` brightness-only rule (0.11.7, site navs) is untouched.
- Two deviations from the tickets' letter, both flagged in the resolutions: rail z-index went to `--kol-z-sticky`, not the ticket's `--kol-z-nav` (1000 would put the rail above modals — the same stacking bug mirrored); `public/fonts/Right-Grotesk-Mono/` left as found (zero references, not that ticket's call).

### Published (all registry-verified)

theme **0.41.0** · icons **0.16.0** · framework **0.20.0** · foundry **0.5.5** · kol-shell **0.1.0**.

**Plus chess 0.6.0** — caught at end of session by a full local-vs-registry sweep across all 15 packages: chess was the one mismatch (local 0.6.0, registry 0.5.3), bumped earlier the same day by a parallel session that moved `src/data/` out to `_tmp/2026-08-14-chess-data-moved-to-kol-chess/` and never published. Published on user instruction; SHIPPED-PACKAGES synced. **Repo and npm now agree on every package.** Note for the next chess touch: ARCHITECTURE §3 still describes a `./data` subpath that the package's `exports` map no longer carries — the data move left the doc ahead of the code.

### Docs + gates

`docs/documentation/04-compositions/11-shell-system.md` born (+ INDEX row) · ARCHITECTURE §3 eleventh package · SHIPPED-PACKAGES updated · icon inventory regenerated · `dashboard-icon-proposals.html` graduated to `docs/visual-reference/` · classification.js grew 8 FUNCTIONS rows + 6 EXEMPT rows (3 **namesake** twins — AppShell/ContentFilters/GridCard are different components sharing a name across tiers; both copies stay on the roster). All 19 gates clean.

## Current State

### Working

- Lobby queue **0**. Outbox holds only the dotfiles bulletin (🔵 since 08-01) — its second half (the dead theme CHANGELOG) closed here, stub corrected.
- Receipts synced 🟢: kol-website ×3, kol-monitor ×1. kol-mirror has no lobby — its remainder rides monitor's stub.
- **No version debt** — all 15 packages verified local == registry.

### Known Issues

- 📌 Adoption remainders are the consumers': kol-website (rename `public/fonts/Right-Grotesk/`, swap 9 icon call sites, bump), kol-monitor + kol-mirror (adopt kol-shell, retire local copies → `_tmp/`, drop the kol-framework pnpm patch; mirror also sweeps its dead Workshop* shell).
- kol-shell ships **unexercised by a live consumer** — recreated from two shipped sources and gate-clean, but no showcase demo and no adopting app yet. First adoption is the real test.

## Next Steps

1. Showcase surface for kol-shell — no demo, no `/components` rows, no visual-reference page yet.
2. `packages/chess` — reconcile ARCHITECTURE §3's `./data` subpath with the shipped `exports` map (the 08-14 data move retired the subpath; the doc still promises it), and give chess a real 0.6.0 changelog entry — it shipped under the gap note.
2. Waves A–D of `plan-2026-08-09-membership-and-preview-contract.md` still open (Card backfill ~170 + `validate:demos`, labelFromSlug, Badge box; A2 blocked on the wordmark typeface).
3. MediaLibrary + FoundryCTA demos still missing.
