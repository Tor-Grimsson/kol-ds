# 🗄️ COLLECTION — DO NOT WORK · ListGridCards — list grid cards in active repos

> **Agents: skip this file.** It is not a task and has no close bar. Do not
> report it as open, do not propose work on it, do not mention it in a queue
> summary. Touch it only when the user explicitly names ListGridCards — either
> to append a new entry, or when a card-family consolidation is finally ruled.

**Staged:** 2026-08-15 · from **kol-monitor**
**Nature:** OPEN COLLECTION — not an action ticket (user ruling at filing). No
close bar, nothing to ship; it accrues. The DS gets the real renders side by
side when a card-family consolidation is eventually ruled on (the ListingCard
arc is the precedent — this collects the evidence before any brief).

**Scope (widened 2026-08-15, user ruling + estate-wide bulletin):** ANY card
rendered under a content-filter setup (filter bar + card listing) qualifies —
cms, typefaces, stack, works, etc. A grid + list pair is NOT a requirement;
one render of a card used this way is enough.

## The collection

Each entry: repo · what renders the card · screenshots in
`_assets/2026-08-15-list-grid-cards/`.

### kol-monitor — preset cards (2026-08-15)

- **Grid:** `@kolkrabbi/kol-shell` 0.1.0 `GridCard` — preview image, title
  (`Empty 7U`), mono meta line (`7U — power, perf, patch`).
  `monitor-grid-card.png`
- **List:** the list-view row of the same preset picker — title + mono meta,
  single bordered row. `monitor-list-card.png`
- Captured dark, vite preview, after theme 0.42.2 restored the shell's
  Tailwind utilities (KolSourcesPnpmResolution).

---

## Full sweep — 2026-08-15

Two exhaustive sweeps (every card-like component in the 15 packages; every call
site in this repo + the consumer repos) run on the user's instruction. **Scope
applied as the ticket defines it**: a card rendered under a content-filter setup.
The ~68 other card-shaped components found (dashboard cards, glyph cells, colour
swatches, styleguide tiles) are NOT filter-listing cards and are deliberately
excluded — noting the number only so nobody re-runs the sweep looking for them.

**Screenshots exist for kol-monitor only.** Every entry below is read from source;
none has been seen rendering. That gap is the collection's remaining work.

### The nine cards that render under a content filter

| # | Card | Package | Grid form | List form | Consumers |
|---|---|---|---|---|---|
| 1 | `MediaCard` + `MediaRow` | kol-component | `aspect-square` thumb, `p-3` body, name + `kol-mono-12` meta + actions | `py-2` row, `w-12 h-12` thumb, date `w-24` / size `w-20` cols | **3** — DS MediaLibrary · kol-r2b2 FileList · kol-website apps/brand SlideDeckManager (list only) |
| 2 | `GridCard` | kol-shell | A4 `1 / 1.41421`, clipped preview + label plate (`kol-helper-14` / `kol-helper-8`), `expanded` = 2×2 span | `height: 36`, title `kol-helper-12` ←→ detail `kol-helper-10` | **6 clusters, 2 repos** — kol-monitor (Home/Library×2/Create) · kol-mirror (Home/Library) |
| 3 | `ListingCard` (alias `ArticleCard`) | kol-content | 3 sizes: `hero` 16/9 + `kol-sans-heading-03` · `default` 16/9-or-3/4 + `kol-mono-20` + Pills · `mini` 120×120 side thumb | — (`mini` IS the row form) | **3 live** in kol-website Stack + StackLatest |
| 4 | `WorkCard` + `WorkListItem` | kol-content | `w-[280px] md:w-[400px]`, 3-height ladder by `index % 3`, grounded TiltCard, hover drawer | `min-h-24 md:min-h-40`, square thumb, big display description line | **2** — kol-website Work (shelf⇄list) + WorkDetail carousel |
| 5 | `TypefaceLibraryItem` | kol-foundry | `h-[500px]`, `Ðð` at 140/160px, hover pangram overlay | `min-h-40`, 48px alphabet clipped by binary-search + ResizeObserver | **1 real** (showcase demo) — kol-website runs a **local fork** |
| 6 | `PrintGridCard` | kol-store | A4 `1/1.41421`, 3D `rotateY` flip, random artwork-or-mockup on mount | — | **1 real** (kol-website Prints, via its own fork of the grid) |
| 7 | `PrintGridCardGsap` | kol-store | same A4 box, no flip, `forwardRef` for a GSAP timeline | — | river only |
| 8 | icon tiles / `ShopGrid` / gallery tiles | *(none — consumer-local)* | consumer markup | consumer markup | **4 client repos** running **forked** ContentFilters copies |
| 9 | `Table` | kol-component | — | showcase References renders a table through `renderItem` | 1 |

### Per-repo instances

**kol-ds-ui (DS internal)**
- `MediaLibrary.jsx:602` → `MediaRow` (list) / `MediaCard` (grid), switched off ContentFilters' `viewMode` arg. `.kol-media-grid` = `repeat(auto-fill, minmax(10rem, 1fr))`.
- `store/PrintsGrid.jsx:74` → `PrintGridCard`, **grid only**, `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`.
- `foundry/TypefaceLibraryGrid.jsx:66` and `TypefaceLibraryGridWithVariables.jsx:224` → `TypefaceLibraryItem`, both forms, same 4-col grid, `defaultViewMode="list"`.
- `showcase/pages/References.jsx:188` → a `Table`, no card.

**kol-monitor** — 4 pages, all `GridCard`: `HomePage:119` (presets + a static "Empty 7U"), `LibraryPage:94` (modules, neighbour-hiding on expand), `LibraryPage:160` (patches, `previewFit="compact"`), `CreatePage:198` (3-way: rack viewport / grid / list-with-`action`). Container law from the file header: grid `repeat(6,1fr)` gap 24 · list `repeat(4,1fr)` gap 8.

**kol-mirror** — 2 pages, `GridCard`: `HomePage:154` (memory slots + static "Empty Studio", `previewFit="cover"`), `LibraryPage:63` (variants / memory).

**kol-website** — `Stack.jsx:162` → `ListingCard size="hero" showHeader={false}`, grid only · `Work.jsx:112` → `WorkListItem` (list half; the grid half is a sibling `ParallaxShelf` **outside** ContentFilters) · `routes/prints/PrintsGrid.jsx:59` → `PrintGridCard` via a local fork of the DS organism · `sections/foundry/TypefaceLibraryGridWithVariables.jsx:227` → local fork.

**Client repos on forked ContentFilters copies** — kol-client-kolkrabbi (`Icons.jsx:235`, `IconsVariants.jsx:204`) · kol-client-ac (`Shop.jsx:69` → `ShopGrid`) · kol-client-acyr-website (`Gallery.jsx:107`) · kol-labs-monorepo apps/monitor ×4 (the pre-extraction ancestors of kol-monitor's).

### What the sweep establishes

1. **`renderItem` is not a card seam.** Only 8 of 26 call sites render a card at all — the rest are tables, icon tiles and rack viewports. Any unified card must NOT be wired into ContentFilters; it stays a thing the consumer passes.
2. **Every real grid⇄list pair is the same switch**: one `layout`/`viewMode` arg, two branches, two column counts. `GridCard` is the only card that expresses it as `variant="list"` on ONE component; every other pair is two components.
3. **`GridCard` names two unrelated DS components** — kol-shell's A4 catalog card and kol-dashboards' `span="2x2"` layout wrapper (~70 call sites across 3 repos). Neither renames cheaply.
4. **Three DS components were extracted from kol-website and never adopted back** — `PrintsGrid`, `TypefaceLibraryGridWithVariables`, `BentoCard`. Each has a live divergent fork in `apps/web`; that, not lack of need, is why they read as single-consumer. DS `BentoCard` has **zero** production consumers because the real one needs HLS video.
5. **`ContentFilters` has four more forked copies** in client repos beyond the kol-shell one retired 2026-08-15.
6. ⚠️ **kol-mirror breaks on the next kol-shell bump** — pinned to `@kolkrabbi/kol-shell@0.1.0` and importing `ContentFilters` from it, an export removed in 0.3.0. Two pages.
7. **Three near-identical A4 print cards** — `PrintGridCard` and `PrintGridCardGsap` differ only by the flip and `forwardRef`.

### The shape a unification would take

Not a proposal — the constraint list any proposal has to satisfy:

- ONE component, `variant="card" | "row"`, since that is already `GridCard`'s proven form and the only form with 6 consumer clusters.
- Slots, not fields: `thumb` · `title` · `meta` · `actions` — the contract `MediaCard`/`MediaRow` already share and the one the kol-website brand app proved generic by passing `"12 slides"` into `size`.
- Geometry as a **prop**, not baked: the live set spans A4 `1/1.41421`, `16/9`, `3/4`, `aspect-square`, `h-[500px]` and `height: 36`. A single hardcoded ratio kills five consumers.
- Domain behaviour stays OUT and rides a slot: live-font rendering (foundry), 3D flip (prints), tilt + index-staggered entrance (work), HLS video (bento), expand-to-2×2 (monitor). None of these generalise; all of them fit behind `preview`/`thumb`.
