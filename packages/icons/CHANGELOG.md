# @kolkrabbi/kol-icons

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
