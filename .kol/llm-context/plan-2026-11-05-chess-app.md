# Plan — consume kol-chess into apps/chess

**Raised:** 2026-11-05, the user: *"I want to consume my chess app, its been stuck on the imac for a while"*. Source downloaded to `/Users/kolkrabbi/dev/projects/kol-chess` (reference only until the port).
**Status:** PARKED — 2026-11-05, his word: *"park it for later"*.
**Shape:** W › phase › list.
**Laws carried:** carry-through means verbatim; a local copy of what the DS ships is a defect; dev servers listen on the network; never rm (old repo archived by him).
**How a phase closes:** measurable acceptance line first, gates green, Playwright on all eight routes, desk and 390, both themes.

## W1 — The port — PARKED: his word, 2026-11-05

### 1.1 — Copy in, current packages
- Copy src verbatim to `apps/chess` (`pnpm chess`, `server.host: true`). Swap its two-month-old KOL pins (kol-component 0.152, kol-shell 0.35, kol-theme 0.121 …) for `workspace:^` and fix every break against current.
- Acceptance: the eight routes (`/`, analysis, play, database, stats, insights, bot, settings) render with 0 console errors.

### 1.2 — Artifacts to the B2 CDN
- `public/` is 40 MB (books 19 MB, model 9.4 MB, engine, master portraits). They go to the B2 CDN, not this repo. Note its `onnxruntime-web` warning: no `wasmPaths` override pointing at `public/`.
- Acceptance: `apps/chess/public` under 1 MB; the bot loads its model and the book from the CDN (Playwright).

### 1.3 — Local parts to the package
- Its local `Clock` and `PlayerBar` move into `@kolkrabbi/kol-chess`.
- Acceptance: a grep finds no local copy of a DS part in apps/chess.

### 1.4 — train/
- The Python training code moves to `apps/chess/train/`, outside the build.
- Acceptance: `vite build` output holds no train/ file.

### 1.5 — Close
- Playwright: eight routes, desk and 390, light and dark; the bot replies in a game; engine analysis runs.
