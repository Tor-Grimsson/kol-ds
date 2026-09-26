# Session: Media D1 (tags · documents · favourites), apps/media-shell, and the app anatomy

**Date:** 2026-09-26 (ran 2026-09-25 → 26)
**Agent:** kol-ds-ui (Claude Opus 5.5)
**Summary:** Lobby tickets to 🟠, the pending-work list cleared, D1 built against an imagined olina setup in two new apps, and the vocabulary Shell · Catalog · Hub · Tool ruled — shipped as component 0.221 → 0.224 · theme 0.149 → 0.150 · controls 0.3.1 · dashboards 0.4.2.

## Changes Made

### Lobby (all 🟠, receipts written where one existed)
- `column-view-drops-the-picked-file` — `ColumnBrowser picked` (controlled), fed by the media pages
- `column-preview-crops-wide-images` — `ImageFrame` contains SVGs and off-ladder images
- `apps-tier-media-first` — DoD met but for the ruled-deferred showcase/workbench move
- `editor-panels-the-held-specs` — A3 `ToolPalette` + `SplitToolButton onTrigger`; B1 + A2 stay in design-editor (user ruling)

### Pending-work list
- Showcase coverage audit (artifact https://claude.ai/artifact/4zxYSGi1yfqXSr6P3Ef6Dq); six stale inventory rows removed, seven media rows added
- Touch: 38×60 disclosure hit area; Quick Look phone width meets the overlay's padding
- File dropped onto a file no longer renames it (bubbles to the folder)
- controls / dashboards unpublished source published; FoundryCTA stripped from generated usage; miners read `homedir()` not the iMac's path

### Media D1 (plan v2 — `playbook/2026-09-25-d1-scope-and-plan.md`)
- `apps/media-fixture` (new, private) — fake bucket (`bucket.js`, permanent file ids) + fake D1 (`d1.js`: tags · favourites · folder rows · events · smart folders · settings) + client + `useFixtureMedia` wiring both apps share
- `apps/media-shell` (new) — Shell + Home + Browse + Settings + first-run tour; `pnpm media-shell` (5175), `/apps/media-shell`
- DS: `DocumentEditor` (new document, markdown fields form, Write/Split/Preview, Attach, SVG, 1 MB cap); drafts in browser memory (`utilities/localDrafts`, `saveDraft` out of the contract — BREAKING for 0.223 clients); `splitFrontmatter` / `joinFrontmatter`; tags + favourites on files and folders; tag suggestions; frontmatter tags merge on save; smart folders; event log; settings through the client
- theme 0.150.0 drops the four `kol-display-*` aliases (R3 — decided on the MBP's partial estate; user let it stand)

### Docs
- `docs/documentation/04-compositions/16-app-anatomy.md` (new, draft) — Shell · Catalog · Hub · Tool
- `07-apps-tier/INDEX` (the three apps) · `02-media-app-plan` § D1 · component inventory · retirements history

## Current State

### Working
- Both apps build and run; every D1 feature clicked through live; 27 gates clean

### Known Issues — from the user's review of media-shell (not yet acted on)
- Walkthrough opens by itself and its X sits outside the card — make it opt-in (a Walkthrough button) and give `WalkthroughPanel` an `onClose` inside the card
- Smart folders are not wanted — remove them (page chips, Home shelf, client verbs, fake-D1 table)
- Recent / Favourites should be the Catalog's view toggle (RECENT · FAVOURITES), not stacked shelves
- Home should BE a Catalog (monitor's layout), not hand-built shelves — which is what the Hub will fix
- Consumer scans (retirements, miners) are only honest on the iMac until the other repos are cloned here (memory `consumer-scans-run-on-imac`)

## Next Steps
1. User clones monitor, mirror, fxr, kol-website into `~/dev/projects/` and restarts the session
2. Read the three apps' code; find the overlap; refine the anatomy table (`16-app-anatomy.md`)
3. Define the **Hub** in `kol-shell`; build `apps/shell` (Shell + Hub + placeholder tool) → user review
4. Rebuild `apps/media-shell` on the Hub, with the review items above
5. Sort the tool roster: media · brand · presentation editor · note editor · the fxr editor · labs + generator (editor chrome alts) · rack · mirror
