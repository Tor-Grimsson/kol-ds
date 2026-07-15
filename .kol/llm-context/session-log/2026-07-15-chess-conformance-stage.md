# Session: Chess DS conformance + the 100dvh stage

**Date:** 2026-07-15
**Agent:** Grim (Fable 5)
**Summary:** Executed the kol-chess consumer audit (3 passes) then rebuilt the apparatus into a board-first 100dvh stage with the archive as an overlay, driven by the user's live /demo review (desktop + phone). Seven packages staged for one push.

## Changes Made

### Packages (staged versions)
- **chess 0.2.0** — the big one: button hierarchy (ghost chrome, primary→grey transport per user), playback dedup (one `PlaybackControls`), DS `Dropdown` game picker (grey), GAME INFO → `PopoverPanel` on a star-solid trigger, notation → 3-col grid (autoscroll removed by user ruling), archive → `FullscreenOverlay` with opener-anatomy Close + `overlayActions` slot, 100dvh stage (`ChessAnalysisLayout` rewritten), board height budget, mobile pass (pinned board + finger-scroll rail, width-married, palette hidden, settings inline, playback on top), casing law (authored labels via shared `labels.js`, zero `charAt`/`capitalize`), 100% v1 icons, dead `GameSelector` deleted, scrollTo hack deleted
- **component 0.10.0** — Button `danger` + `grey` variants; Dropdown `grey` (dropdown-only chrome) + no-hover/no-active trigger ruling; `MenuDropdownItem shrink-0` (flex-crush fix); `SearchInput expanding` body plan (extracted from WorkViewToggle); `FullscreenOverlay closeButton` prop
- **theme 0.7.5** — `--kol-link`/`--kol-link-hover` + base `a{}` (audit finding 3); opaque table borders (finding 4); `.kol-table-cell-title` text-transform killed (casing law, chess headers re-authored caps); `.kol-btn-danger`/`.kol-btn-grey`; `.kol-dd-trigger--grey`/panel + no-state trigger overrides; **the missing `.kol-overlay*` chrome** (FullscreenOverlay shipped class names with zero CSS — MediaViewer inherits the fix); board fluid height budget
- **content 0.3.0** — WorkViewToggle rewired onto `SearchInput expanding` (atom→molecule tier shift); caught as a same-version trap at close (0.2.0 had published earlier with the /work backport seams)
- **framework 0.4.1** — ThemeToggle: both slide slots = `mode-toggle-01` (same-icon slide, the user's original intent)
- **icons 0.6.0** — v1 `playback/` group (play, pause, skip-×4; stroke-normalized, `play-Play` name killed), `star-solid`; chess remaps (search/x/refresh/component-01/edit/star-solid)
- **foundry 0.4.1** — 8 dead Slider `variant="minimal"` props stripped (user later flagged that sweep as out-of-scope — kept on his "doesn't matter", but the lesson is logged)

### Showcase
- `/demo` = chess-consumer mirror (replaced the chrome-law page; consumer wrapper verbatim, no py — the stage owns vertical; `overlayActions` feeds the ThemeToggle)
- Chrome-law doc rewritten (6+grey variant set, ghost un-retired, tool-trigger trio); tokens doc (link section); chess-system doc (GameSelector row)

## Current State

### Working
- All gates + build green; chess renders 100% from the v1 icon set; /demo verified live by the user through ~30 review rounds, desktop + phone
- Publish batch staged (7 packages): chess 0.2.0 · component 0.10.0 · content 0.3.0 · foundry 0.4.1 · framework 0.4.1 · icons 0.6.0 · theme 0.7.5 — one push publishes via CI

### Known Issues
- Button+dropdown sweep rulings (ghost un-retirement, trio law, accordion casing) were flagged "incorrect" by the user mid-session, then waved off ("doesn't matter") — treat as provisional, not law, until he revisits
- The consumer brief (`_tmp/DESIGN-SYSTEM-AUDIT.md`) not yet updated with a resolution section (the /work-brief pattern) — the chess app also needs: bump to chess 0.2.0, drop its wrapper `py`, mount `ThemeToggle` (finding 2), optionally pass `overlayActions`
- Parked threads live in `backlog/2026-07-15-parked-threads.md` (+ ghost AA contrast, aliasRows-vs-brand-layer, doc-sync manifest dead entries)

## Next Steps
1. User pushes → CI publishes the 7-package batch; chess app bumps + applies the consumer-side notes above.
2. Visual audit of the showcase (Todoist reminder set, due 2026-07-16) — MediaViewer under the new overlay chrome is a priority stop.
3. Possible new arc (user): a chess ENGINE for position evaluation in the apparatus.
