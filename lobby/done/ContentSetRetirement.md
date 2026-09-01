# ContentSetRetirement — the old cards go, one repo at a time

**Staged:** 2026-08-26 · user instruction: "I dont want to have to ask again in 2 weeks and this is still unresolved"
**Nature:** tracking ticket for the whole wave. Stays 🔵 until step 3 lands. Every init reports it.

> **2026-08-26 — the system exists now:** `docs/operations/01-release/04-retirements.md` is the ledger of every alias, `pnpm retirements` prints who still imports each one, and `pnpm validate:retirements` fails on a drop-ready alias (30 days, no importers). The checklist below is the human view; the sweep is the truth.

> ⚠️ **2026-08-29 — the sweep was blind to two thirds of the estate.**
> `validate-retirements.mjs` walked `~/dev/projects/kol-*` looking for
> `src` / `app/src` / `apps`. `kol-apps/` and `kol-client/` are **containers** —
> they hold repos one level down and carry no `src`, so every repo inside was
> invisible to R2. Widened to descend one level into a container: estate
> **9 roots / 1401 files → 36 roots / 4424 files**. Three aliases that read
> `imports: nobody` immediately gained real hits (`kol-display-lg` ×9,
> `kol-display-section-sm` ×2, `kol-display-subsection` +2) — under R3 they
> were on a 30-day clock to be force-dropped on false evidence.
> `kol-client/kol-client-hrafn` is a **live `@kolkrabbi` consumer**
> (component 0.109.0 · framework 0.28.0 · icons 0.22.0 · theme 0.72.0) that the
> gate had never once looked at; it is clean of every retired alias, so nothing
> broke — this time.
> **Caveat:** the CSS-alias half of the check is a bare string match, and none
> of the newly-visible `kol-apps` repos installs `@kolkrabbi/*` — those hits are
> local class names, not theme consumers. Whether they should hold an alias
> open is 🔴 **your call.**

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
   - [x] **kol-fxr — CLEAR, full scan 2026-08-29.** Zero hits on all ten retired
     card names across the whole repo (not just `src`). `HomePage.jsx:3` and
     `LibraryPage.jsx:3` both import kol-shell's `CatalogPage` — the swap had
     already happened and the box was stale. Confirmed twice: repo-wide grep,
     and the sweep (`GridCard` imports: kol-ds-ui showcase/workbench only).
     Its two live retired imports are `Section` → `InspectorSection`, a
     different wave
   - [x] kol-r2b2 — `MediaCard` / `MediaRow` (FileList) — **swapped**, measured 2026-08-27: no import of either; on theme 0.62.0 · component 0.93.1 (`SortControls`, `SizeOrDownload`, `ToggleCheckbox variant="media"`)
   - [x] kol-ds-ui itself — `MediaLibrary` on `ContentCard` / `ContentRow` `default` — **swapped** 2026-08-27, component **0.109.0**: kol-r2b2 FileList's shape (frame-corner download + `SizeOrDownload` on the card, inline copy / download / the picker's Use); verified in source, no server run. The aliases still export — the showcase demos + workbench stories keep them on the R2 count
   - [x] **`ContentFilters` forks — named 2026-08-29. SIX copies, not four.**
     Live client repos: `kol-apps/kol-client-ac/src/components/molecules/`
     (Shop) · `kol-apps/kol-client-acyr-website/apps/website/src/components/molecules/`
     (styleguide Gallery) · `kol-apps/kol-client-kolkrabbi/src/components/molecules/`
     (Icons · IconsVariants · Components). Pre-extraction ancestors, not
     consumers: `kol-apps/kol-labs-monorepo/packages/component/src/molecules/`
     (apps/monitor ×3) · `kol-apps/kol-labs-single/src/components/molecules/` ·
     `kol-apps/kol-lightroom/src/components/molecules/`.
     **None of the six installs `@kolkrabbi/*`** — they are copies of the
     source, not stale imports, so no DS drop can break them. Naming was the
     box; adopting the package is each repo's own ticket, not this wave's
3. **DS drops the exports** — next major of each package, only after every box above is ticked.
   **Step 2 is now complete (2026-08-29).** Every consumer box is ticked and
   measured. Step 3 is the only thing left, and it is a major on five packages
   — 🔴 **your call, not mine.**

## Open rulings (yours, not the agent's)
- ~~`GridCard` names two unrelated components (kol-shell's catalog card, kol-dashboards' grid-span wrapper). The shell one is deprecated; whether the dashboards one is renamed is your call.~~ **Ruled 2026-08-27: keep** — the dashboards wrapper is not renamed (user: "I don't really care").
- ~~`BentoCard` — no variant absorbs it. Keep, or rule a variant.~~ **Ruled 2026-08-27: the Tilt family** — renamed `TiltBento` (component 0.110.0), `BentoCard` an alias on the ledger; kol-website's local TiltCard / BentoCard / useTilt forks ticketed there.
- The `text left / image right (+ reverse)` card from kol-website's studio + home pages does not exist in the DS. Its own ticket when you want it.

## Definition of done
- [x] every step-2 box ticked — **2026-08-29**, kol-fxr and the fork census were the last two
- [ ] step 3 published, changelogs BREAKING-flagged — 🔴 held for your ruling

## ✅ RESOLVED — 2026-08-30 · step 3 landed, the wave is closed

Shipped: **component 0.132.0 · shell 0.20.0 · store 0.3.0 · content 0.14.0 ·
foundry 0.9.0**.

### The nine exports are gone

`MediaCard` · `MediaRow` · `GridCard` (shell) · `PrintGridCard` · `ListingCard`
· its `ArticleCard` alias · `WorkCard` · `WorkListItem` · `TypefaceLibraryItem`
— removed from five barrels, their nine ledger rows deleted, sources
**quarantined to `_tmp/2026-08-30-content-set-exports/`, never deleted**.

Dropped early rather than aged out: R3's 30-day clock never fired, because the
estate sweep showed no consumer outside this repo imported any of them. The user
ruled the drop on that evidence.

kol-dashboards' `GridCard` is a **different component** and stays — ruled
2026-08-27, and the roster gate agrees (it never flagged it as dead).

### Six surfaces migrated in the same pass

Everything that still imported the nine was moved onto ContentCard/ContentRow,
not stubbed:

| surface | now |
|---|---|
| `kol-store/PrintsGrid.jsx` | `catalog` + the new `flip` / `fade` props; the artwork-or-mockup roll moved out of the dead card into the grid, keyed by slug so a re-render cannot re-deal the wall |
| `blocks/article-grid` · `sets/stack-blog` | `article` — hero/default on the card, `mini` on the row |
| `blocks/work-grid` · `sets/work-portfolio` | `showcase` card + row |
| `demos/TypefaceLibraryGrid` | `showcase layout="canvas"` / `layout="column"` — reusing the shape kol-foundry's own `TypefaceLibraryGridWithVariables` already shipped |

`PrintGridCardGsap` was **not** in the wave and still ships.

Quarantined whole, their subject having retired: the eight per-component demos,
two workbench stories, and the `content-card-comparison` set — the last of which
was also the thing the earlier receipt named as blocking this step.

### Definition of done

- [x] every step-2 box ticked — 2026-08-29
- [x] step 3 published — five packages, this entry is the changelog

### Remainder here

**None.** One thing carried out and recorded on the retirements ledger instead:
the four VARIANT renames of 2026-08-29 alias by prop value, and this gate only
watches barrel exports — nothing will age those out.
