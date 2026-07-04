---
"@kolkrabbi/kol-component": patch
---

MenuPopover cleanup — remove dead duplicate code. `MenuPopover.jsx` had shadowed a second `MenuItem` (a row) and a `MenuDivider` that were never barrel-exported (dead: no consumer could import them, and the barrel's `MenuItem` comes from `MenuItem.jsx`). Deleted both. `MenuPopover` remains a deprecated alias of `MenuItem` — compose its rows with the exported `MenuDropdownItem` / `MenuDropdownDivider` / `MenuDropdownNest`. No public API change; the alias is removed at the next major.
