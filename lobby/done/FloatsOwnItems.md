---
component: AppShell touch="floats" — the top float's rows
source: kol-fxr — plan 46 (Labs on a phone onto touch="floats"), kol-shell 0.97.0 AppShell.jsx#L417
staged: 2026-10-31
status: draft
deps: [AppShell, AppFloatNav]
---

# FloatsOwnItems (+ nested submenus)

## Purpose
Under `touch="floats"` the top float lists `barItems` — the app's nav. A page that uses the layout for its own tools (fxr's Labs: Home · Catalog · Params · Transport, More → Output · File) has to replace the app's nav to get them there. The `PhoneTwoFloatLayout` resolution offered a `floats.items` override for this. The user, 2026-10-31, asked whether Labs' toggles should stay apart from the app's nav: *"just keep it as flexible as possible, it will have to deal with a spectrum of use casees"*.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `floats.items` | AppFloatNav items | the app's nav (`barItems` / items) | the top float's rows, set by the page |
| `floats.actions` | `[{ label, icon?, onPress }]` | `barActions` | the top float's More rows |

## Recreation notes
- Unset, nothing changes — the app's nav, as 0.97.0.
- Set, the page's rows take the top float on that page only; the app's nav is still reachable (the page lists Home, or the More keeps the app's destinations — the DS's call, one rule for every app).
- Acceptance: studio-hub's Floats demo shows both — the app's nav, and a page passing its own rows.

## Added 2026-10-31 — nested submenus (every AppFloatNav variant)
Today a slot's `sub` opens one level of rows (`[{ label, icon?, onPress }]`, MoreRows); a row there cannot open its own. The user asked whether the float nav offers nested menus and said yes to asking for them. fxr's case: Home's dock Labs → Generative → its groups (Labs' catalog is section → group → category).

| prop | type | controls |
|------|------|----------|
| `items[].sub[].sub` (any depth) | the same row shape | a sub row that opens its own rows — the DS picks how a level opens (beside, or replacing with a back row) |

- Acceptance: studio-hub shows a three-level sub on the dock and on a phone pill; a leaf's `onPress` runs and closes every level; Escape / outside press closes all.

## ✅ RESOLUTION — 2026-10-31 · kol-shell@0.98.0

kol-shell 0.98.0. AppShell touch="floats" takes floats.items (AppFloatNav items for the top float's slots) and floats.actions ([{ label, icon?, onPress, sub? }], replacing barActions as More's actions); unset, it is exactly 0.97.0. The rule for every app: More always holds the app's whole nav, so a page's rows replace the slots, never the way back (phoneNav.sheetItems still overrides). Nested submenus on every AppFloatNav variant: items[].sub[].sub to any depth, the same row shape, a chevron on a row that opens a level. On the dock a level opens beside its parent (the + menu's card); on every phone variant it replaces the rows under a Back row. A leaf runs onPress (or routes its path) and closes every level; Escape and an outside press close all; ↑↓ move, → / Enter open, ← back. studio-hub shows Labs › Generative › Fields › Noise on the dock and the phone pill, and /chrome/labs* passing its own rows. Note: a page that rebuilds its rows while a level is open keeps the old rows until it is reopened.

**Remainder here:** none — kol-fxr bump kol-shell@0.98.0; Labs passes floats.items / floats.actions on its own route; Home's dock Labs → Generative → its groups as nested sub rows (leaves need onPress or path).

