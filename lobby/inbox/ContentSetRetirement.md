# ContentSetRetirement — the old cards go, one repo at a time

**Staged:** 2026-08-26 · user instruction: "I dont want to have to ask again in 2 weeks and this is still unresolved"
**Nature:** tracking ticket for the whole wave. Stays 🔵 until step 3 lands. Every init reports it.

> **2026-08-26 — the system exists now:** `docs/operations/01-release/04-retirements.md` is the ledger of every alias, `pnpm retirements` prints who still imports each one, and `pnpm validate:retirements` fails on a drop-ready alias (30 days, no importers). The checklist below is the human view; the sweep is the truth.

## The three steps

1. **DS deprecates** — ✅ 2026-08-26. `@deprecated` on the eight absorbed cards, published:
   component 0.69.1 · shell 0.6.2 · store 0.2.1 · content 0.9.1 · foundry 0.6.2.
2. **Each consumer swaps** — on its bump. Tick a repo when its old-card imports are gone.
   - [x] **kol-website — CLEAR, full scan 2026-08-28.** Zero imports and zero call sites of all eight across `apps/web` + `apps/brand`. `GridCard` still appears in `routes/workshop/DashboardComponents.jsx` — that is kol-dashboards' layout span component, a different thing, not in this wave
     - [x] Stack's filter — on `ContentCollection` + `ContentCard`/`ContentRow article` (measured 2026-08-27)
     - [x] Stack's featured hero — **done, measured 2026-08-28** (`routes/Stack.jsx:161` is `ContentCard variant="article" hero` inside the SectionHero `foot`). The box was stale, not open
     - [x] Foundry — `TypefaceLibraryItem` gone from kol-website (measured 2026-08-27): the site renders the package grid (kol-foundry 0.7.3) on `ContentCard` / `ContentRow typeface`; only the showcase's comparison page still imports the alias
     - [x] Work · Prints — **clean, measured 2026-08-28.** The last one was `WorkCard` in `routes/WorkDetail.jsx` (the "More Work" carousel at the page foot) — every earlier sweep swept the `/work` LISTING and called the repo complete on its evidence, so the detail route was never looked at. Now on `ContentCard variant="work"`, with `WORK_TITLE_FACE` + `TYPE_LABELS` exported from `Work.jsx` so the face has one home. `WorkListItem` and `PrintGridCard` had already gone. Full scan of both apps: **zero imports and zero call sites of all eight**
   - [x] kol-monitor — kol-shell `GridCard` (HomePage · CreatePage · LibraryPage) — **swapped** 2026-08-27 on component 0.105.0 / shell 0.8.0: no `GridCard` import left; HomePage on `CatalogPage`, LibraryPage + CreatePage on `ContentCard` / `ContentRow catalog` directly (the 2×2 expand + `expandedContent`, the INSERT row `actions`); build green
   - [x] kol-mirror — kol-shell `GridCard` (HomePage · LibraryPage) — **swapped**, measured 2026-08-27: no import; both pages on kol-shell's `CatalogPage` (ShellHomeSystemAdoption, same day); on component 0.105.0 · theme 0.71.0 · shell 0.8.0
   - [ ] kol-fxr — kol-shell `GridCard` (HomePage · LibraryPage)
   - [x] kol-r2b2 — `MediaCard` / `MediaRow` (FileList) — **swapped**, measured 2026-08-27: no import of either; on theme 0.62.0 · component 0.93.1 (`SortControls`, `SizeOrDownload`, `ToggleCheckbox variant="media"`)
   - [x] kol-ds-ui itself — `MediaLibrary` on `ContentCard` / `ContentRow` `default` — **swapped** 2026-08-27, component **0.109.0**: kol-r2b2 FileList's shape (frame-corner download + `SizeOrDownload` on the card, inline copy / download / the picker's Use); verified in source, no server run. The aliases still export — the showcase demos + workbench stories keep them on the R2 count
   - [ ] `ContentFilters` forks — four hand-rolled copies still live in client repos (only kol-shell's was retired 2026-08-15); name them as they are found
3. **DS drops the exports** — next major of each package, only after every box above is ticked.

## Open rulings (yours, not the agent's)
- ~~`GridCard` names two unrelated components (kol-shell's catalog card, kol-dashboards' grid-span wrapper). The shell one is deprecated; whether the dashboards one is renamed is your call.~~ **Ruled 2026-08-27: keep** — the dashboards wrapper is not renamed (user: "I don't really care").
- ~~`BentoCard` — no variant absorbs it. Keep, or rule a variant.~~ **Ruled 2026-08-27: the Tilt family** — renamed `TiltBento` (component 0.110.0), `BentoCard` an alias on the ledger; kol-website's local TiltCard / BentoCard / useTilt forks ticketed there.
- The `text left / image right (+ reverse)` card from kol-website's studio + home pages does not exist in the DS. Its own ticket when you want it.

## Definition of done
- [ ] every step-2 box ticked
- [ ] step 3 published, changelogs BREAKING-flagged
