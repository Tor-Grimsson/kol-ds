
---

## ✅ RESOLUTION — 2026-08-15

Shipped in **`@kolkrabbi/kol-theme@0.42.2`**. Every package now gets **two** `@source` lines, one per layout — the flat `../kol-x/src` and a pnpm-shaped `../../../../../@kolkrabbi/kol-x/src` that walks out of the `.pnpm` store to the consumer's own `node_modules/@kolkrabbi/`, where the symlinks glob through. A path that matches nothing is inert, so on any given layout one line of each pair simply does not apply. The docstring's sibling claim is corrected and now cites this ticket.

**Verified by running it** in kol-mirror (pnpm, ARCHITECTURE §6):

- Bumped kol-theme 0.42.1 → 0.42.2 and **deleted** the consumer's local `@source` override from `src/index.css`.
- `ShortcutsOverlay` renders as one flat two-column grid with its 62px gap — `contents` is emitted. Previously the labels were glued to their keys with the override removed.
- Built CSS **266.65 → 275.53 kB (+8.9 kB)**: not a kol-shell-sized delta, which is the point — utilities for all twelve sourced packages are now being generated in a pnpm consumer for the first time.
- Build green, lint unchanged (120 errors / 41 warnings).

**Remainder in kol-mirror: none.** The local override is gone.
