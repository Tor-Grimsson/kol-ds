---
"@kolkrabbi/kol-component": patch
---

Button `selected` now renders. It emitted `.kol-btn-selected`, a class no CSS ever defined, so the prop was a visual no-op — every call site (tool-palette active tool, current tab, select-mode toggle) got no feedback. `selected` is now a legacy alias of `pressed`: both resolve to one toggle-on flag that drops `kol-btn-quiet` and renders through the existing `.kol-btn-pressed` fill (solid inverted ink). Dead `.kol-btn-selected` emission removed; `aria-pressed` output unchanged.
