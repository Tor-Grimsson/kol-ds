---
"@kolkrabbi/kol-loader": minor
---

Icon inventory now derived from the on-disk stroke set. Adds `ICON_ENTRIES` (flat `{ name, folder }` list) and `ICON_INDEX` (grouped by folder), globbed from the 862 canonical stroke SVGs. `ICONS` is now an alias of `ICON_INDEX` — the hand-maintained 341-name registry that had drifted is removed. `ALL_ICONS`, `hasIcon`, and `getCategory` now reflect the full set.
