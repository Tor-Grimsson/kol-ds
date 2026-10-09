# @kolkrabbi/kol-icons

## 0.35.0 — 2026-10-09

- **Redrawn** (the user's review of the Styles › Icons page): `cable-unlock` (an open shackle — it drew as `cable-lock`) · `cable-trans` (two clear gaps) · `clr-anl` (dots on the ring) · `clr-mono` (the circle keyline) · `curve-exp` / `curve-log` (exact mirrors) · `dith-cross` (a gap to its frame) · `dith-diamond` · `dith-flower` (fill the box; petals clear of the centre) · `logic-or` · `logic-nor` · `logic-not` · `logic-nand` (no overlapping strokes) · `grad-lin` · `gen-wave` (meet or clear the frame) · `tr-inf` (one round line) · `rotate-left` / `rotate-right` (one arc, the head on the curve) · `rack` (rails meet the frame) · `globe` (equal thirds).
- **New:** `rack-h`.
- **Changed:** `kol-ds` and `kolkrabbi` scaled onto the 18 keyline square (they ran edge to edge).
- **Renamed:** `customize` → `nav-settings` (one sliders mark, not two) `user-interface` → `metrics` and `rack` → `rack-v` (beside `rack-h`). The old names still resolve (`RENAMED_ICONS`); `hasIcon` answers for them.
- **Changed:** the `kolkrabbi` group is `identity` (`kol-ds`, `kolkrabbi`, `metrics`) — group names only; icon names are unchanged.

## 0.33.1 — 2026-10-05

- **Fixed:** an `<Icon>` that rendered before the icon chunk landed could stay blank for good. The chunk arriving between the render and the effect that subscribes to it reached nobody — under a Suspense boundary that gap is as long as the lazy route takes. Found on kol-fxr's rail at `/editor` and `/randomiser`, rehearsed in `apps/editor-hub`.

## 0.33.0 — 2026-10-02

- **New:** `text-justify-left` · `-center` · `-right` · `-all`, `text-align-toward-spine` · `text-align-away-spine`, `space-evenly-horizontal` · `space-evenly-vertical`.
- **Redrawn:** `rotate-left` · `rotate-right` (an open arc, a clear gap before the arrowhead) and `corner-down-left` (a smaller head).

## 0.32.0 — 2026-10-01

- **Renamed:** `kol-icon-set-v1` is `kol-icon-set-interface` (user: "icons v1 is a terrible icon set name"). `KOL_ICON_SET_INTERFACE`, `KOL_ICON_SET_INTERFACE_NAMES` and `KOL_ICON_SET_INTERFACE_META` replace the V1 exports, which stay as deprecated aliases on the retirement ledger. Icon names are unchanged, so `<Icon name="…">` needs nothing. `getSet(name)` returns `'interface'` where it returned `'v1'`.

## 0.31.0 — 2026-09-30

- **New:** `corner-down-left` (arrow) and `command` (code) — the key-cap glyphs the palette footer and the ⌘K hint typed as characters. 1.5 stroke, 24 grid.

## 0.30.0 — 2026-09-30

**The align / rotate / flip glyphs, redrawn** (the names audit built — plan-2026-09-29-phase-log-and-showcase-review, second goal).

- `align-horizontal-{left,center,right}` · `align-vertical-{top,center,bottom}` · `flip-horizontal` · `flip-vertical` · `rotate-left` · `rotate-right` (editor-chrome-review #14): bars 5 tall and wider, a solid axis that never crosses a bar, a dashed flip axis visible at 16px (was a 0.1 dot pattern), triangles enlarged, rotate arrowheads doubled. Same names, same 24 grid, same 1.5 stroke. The previous drawings are kept at `_tmp/2026-09-30-glyph-redraw-before/` in the repo.

## 0.29.1 — 2026-09-30

- Comments only: one spelling, `color`.

## 0.29.0 — 2026-09-27

- **New in v1:** `typography/text-valign-top|middle|bottom` — a text box's vertical alignment (the
  frame edge and two text lines). The design editor's text row borrowed the OBJECT-align glyphs.

## 0.28.0 — 2026-09-27

- **`Icon` is never the click target** (`pointer-events: none` on the glyph). The markup is injected
  as HTML; when an icon re-rendered between press and release, the `<path>` under the press was
  replaced and the browser dropped the click — the design editor's settings drawer would not close
  on its X. Presses now land on the button around the glyph.
- **New in v1** (the design editor's own set, folded in): `tools/crop` · `tools/flip-horizontal` ·
  `tools/flip-vertical` (the mirror line's dots now land on both ends) · `tools/rotate-left` ·
  `tools/rotate-right` · `shape-primitives/line` · `typography/text-align-left|center|right`.



## 0.18.0 — 2026-08-15

- **`filter.svg` corrected to the set keyline.** It was drawn 17.0 × 15.5 with
  a 4.5 top inset while the set sits on ~3 (`search.svg` is 17.8 × 17.8 at 3.3)
  — so at the same nominal size it rendered visibly smaller than the glyph
  beside it. Scaled 1.047 about its own centre and recentred: 17.8 × 16.2,
  symmetric insets. Same path, same 1.5 keyline, no shape change.

## 0.17.0 — 2026-08-15

### Minor Changes

- **The kol-shell rail batch — `rack` minted, the other two names map.** kol-shell
  adopters carried a local Icon component just to feed the rail, because three of
  its glyph names didn't resolve. Taken from kol-monitor's local shelf (the source
  of the report), prefixes dropped per the set convention:

  - **`rack`** minted into `device/` — kol-monitor's drawing verbatim (bordered
    box + two dividers; already currentColor, 1.5 stroke). Inventory **199 · 27**.
  - **`nav-library` → `library`** — NOT minted: the shipped `files/library`
    drawing is the same glyph (three spines + one leaning).
  - **`nav-settings` → `settings-01`** — NOT minted: the set's settings glyph.
    Consumers swap the names in their nav data and delete the local Icon shelf.

## 0.16.0 — 2026-08-14

- Four glyphs promoted from the retired shelves under plain names (DashboardIconCoverage,
  approved frame-by-frame): `crown` · `trophy` · `stopwatch` (misc) + `users` (nav).
  Inventory 198 icons · 27 groups.
- Three dashboard names deliberately NOT minted — shipped drawings cover them; consumers
  swap the name: `dashboard-bookmark`→`bookmark` · `dashboard-roadmap`→`roadmap` ·
  `trending`→`trending-up`.

## 0.5.0

### Minor Changes

- 8b4c850: Add `resize-grip` to kol-icon-set-v1 (misc) — the native-resizer look (three 45° strokes into the corner), set-conform: 24-grid, stroke 1.5, currentColor. Consumed by Textarea's resize affordance. The legacy `resize-corner` (svg/00-kol, off-norm stroke 2.5) is now consumer-less — cull candidate for the tier-2 pass.

## 0.4.0

### Minor Changes

- 8448e47: Stroke inventory normalized to a single 1.5 weight on the 24-grid: `stroke-width` 2 / 1.12497 / 1.125 / 0.99997 → 1.5 across 293 SVGs (525 attributes) in `src/stroke/`. Geometry untouched — attribute-only rewrite. Deliberate exceptions kept: the stroke-cap diagram glyphs' thick elements (`6`) and `hash-italic-bold` (`2.5`). Kills the visible weight fork where 28% of icons rendered chunky (2.0) and 32 machine-scaled imports rendered anemic (1.125) next to the 1.5 majority.
- 8448e47: Icon inventory Tier-1 cull: removed 361 legacy `src/svg/` files that could never render (name-shadowed by `stroke/`/`solid/`, which resolve first) and 8 byte-identical same-name duplicates. Every icon name resolves exactly as before — zero render change; the inventory drops from 2,104 SVGs to 1,735 (stroke 880 · solid 849 · svg 6). Ledger: `.kol/llm-context/backlog/2026-07-08-icon-cull-ledger.md`.
- 8448e47: Add `registerIcons()` — bring-your-own-icons. A consumer app can register its own SVG folder so `<Icon name>` resolves app-specific icons that never ship in the package:

  ```js
  import { registerIcons } from "@kolkrabbi/kol-icons";
  registerIcons(
    import.meta.glob("./icons/**/*.svg", {
      eager: true,
      query: "?raw",
      import: "default",
    })
  );
  ```

  Registered icons win over the packaged set (so a repo can add _or_ override), resolve synchronously (no wait on the packaged chunk), and let each repo carry only the icons it needs instead of pulling the whole set. `import.meta.glob` is a compile-time, path-relative macro, so the glob must run in the consumer's own source. Non-breaking: the packaged set is unchanged when nothing is registered.

- 8448e47: kol-icon-set-v1 now ships in the package. The curated set (107 icons, single stroke cut, `currentColor`) lives at `src/kol-icon-set-v1/` and **resolves first** — `<Icon name>` returns the v1 version when a name is in the set, falling back to the legacy stroke/solid/svg trees otherwise.

  Falling through to the legacy set now emits a one-time `console.warn` naming the icon — it isn't in v1, so `registerIcons()` it locally or migrate to a v1 name before the legacy set is dropped (a future major).

  New exports: `KOL_ICON_SET_V1` (grouped `{ group: names[] }`) and `KOL_ICON_SET_V1_NAMES` (flat, sorted) — so consumers and audits can tell curated names from legacy. Non-breaking: legacy still ships alongside; every existing name still resolves.

  Migration tooling: **`npx kol-icons audit`** scans a repo's `<Icon name>` usage and reports in-v1 / legacy-only / not-in-package, so you can see exactly which icons to migrate or `registerIcons` before the legacy set is dropped.

- 8448e47: Renamed the icon package `@kolkrabbi/kol-loader` → `@kolkrabbi/kol-icons`. The name now describes the domain (icons) rather than the load mechanism, matching the `theme`/`component`/`framework` convention. The public API is unchanged (`Icon`, `ICONS`, `ICON_ENTRIES`, `SOLID_ICON_ENTRIES`, `ICON_INDEX`, `ALL_ICONS`, `hasIcon`, `getCategory`).

  Consumers must update the import specifier and the Tailwind `@source` glob to `@kolkrabbi/kol-icons`. `component` and `framework` retarget their internal dependency to the new name (patch).

## 0.3.0

### Minor Changes

- c750436: Add device icons `tablet` and `smartphone` (system category, stroke + solid) — the set had `monitor`/`desktop` and a telephone-handset `phone`, but nothing for viewport/breakpoint UI. Also add `refresh-cw` (actions, stroke): a clean single-flow circular refresh; the existing `refresh` double-arc reads muddy at small sizes.
- c750436: Move the ~2,000 raw SVG strings off the critical path (port of kol-labs-single's 2026-06-19 entry-chunk fix). `Icon` now pulls its maps from `iconData.js` via one dynamic `import()` — the SVG text becomes its own async chunk that streams in parallel with boot instead of bloating the consumer's entry chunk (measured −66% entry gzip in the origin app). API unchanged; on a cold first paint an icon may render as a same-sized empty box for a frame before the chunk lands. Also removes the dead `SVG_ENTRIES` export (zero consumers) — it eager-inlined the entire legacy `svg/` tree into every barrel import; use `ICON_ENTRIES` (keys-only) for galleries.
- fa8ce05: Add `social-github` and `social-instagram` to the social icon set (user category, stroke + solid). GitHub ships the canonical fill-native mark in both cuts.
- c750436: Add `SOLID_ICON_ENTRIES` — keys-only inventory of the solid cut (parallel to `ICON_ENTRIES`), so gallery pages can diff the two cuts and surface mirror gaps (stroke-only / solid-only) without loading any SVG content.

## 0.2.0

### Minor Changes

- de4c33f: Icon inventory now derived from the on-disk stroke set. Adds `ICON_ENTRIES` (flat `{ name, folder }` list) and `ICON_INDEX` (grouped by folder), globbed from the 862 canonical stroke SVGs. `ICONS` is now an alias of `ICON_INDEX` — the hand-maintained 341-name registry that had drifted is removed. `ALL_ICONS`, `hasIcon`, and `getCategory` now reflect the full set.

## 0.1.1

### Patch Changes

- fcfa14c: Fix `repository.url` to `github.com/Tor-Grimsson/kol-ds` (and the component README usage link). Corrects the npm "Repository" link that pointed at a nonexistent repo in 0.1.0.
