# @kolkrabbi/kol-loader

## 0.2.0

### Minor Changes

- de4c33f: Icon inventory now derived from the on-disk stroke set. Adds `ICON_ENTRIES` (flat `{ name, folder }` list) and `ICON_INDEX` (grouped by folder), globbed from the 862 canonical stroke SVGs. `ICONS` is now an alias of `ICON_INDEX` — the hand-maintained 341-name registry that had drifted is removed. `ALL_ICONS`, `hasIcon`, and `getCategory` now reflect the full set.

## 0.1.1

### Patch Changes

- fcfa14c: Fix `repository.url` to `github.com/Tor-Grimsson/kol-ds` (and the component README usage link). Corrects the npm "Repository" link that pointed at a nonexistent repo in 0.1.0.
