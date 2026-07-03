---
"@kolkrabbi/kol-component": minor
---

New molecules `MediaCard` + `MediaRow` — the grid tile and list row for one media object (recreated from kol-media-admin's lobby specs, same slot contract: thumb / name / actions + select mode with shift-range `onSelect`). Both share a passive `SelectIndicator` (deliberately not ToggleCheckbox — the card/row is the click target; a nested real checkbox double-fires). MediaRow column widths exposed as `dateWidth` / `sizeWidth` props.
