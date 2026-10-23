# MenuRowSidePadding — menu rows carry 12px side padding; it should be 8px

**Staged:** 2026-10-22 · from a kol-fxr session
**Change:** `MenuDropdownItem` row padding — `packages/component/src/molecules/MenuItem.jsx:130`

---

## The problem, in one case

The user, on a `ContextMenu` opened over a file card in kol-fxr's Dev page (kol-component 0.287.0): *"row item left and right has too much padding 12px, it should be 8px"*.

`ROW_BY_SIZE` gives every `MenuDropdownItem` row `px-3` (12px) at `sm` · `md` · `lg`:

```
const ROW_BY_SIZE = { xs: 'kol-mono-8 px-2 h-5', sm: 'kol-helper-12 px-3 h-8', md: 'kol-helper-12 px-3 h-8', lg: 'kol-helper-12 px-3 h-8' }
```

## The fix

Left and right padding on the row: 12px → 8px (`px-3` → `px-2`).

## Definition of done

- [x] `MenuDropdownItem` rows at 8px side padding
- [x] Seen in a `ContextMenu` and a `MenuItem` dropdown

## Resolution — 2026-10-22 · kol-component 0.288.0

- `MenuItem.jsx` `ROW_BY_SIZE`: sm · md · lg rows `px-2` (8px); xs was already `px-2`. Every MenuItem dropdown and ContextMenu reads the same map.
