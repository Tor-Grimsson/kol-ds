# @kolkrabbi/kol-icons

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
