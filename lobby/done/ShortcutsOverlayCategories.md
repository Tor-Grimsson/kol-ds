# ShortcutsOverlayCategories — `S` is the CommandOverlay modal: no search, categories that drill in

**Staged:** 2026-10-18 → kol-ds-ui · from kol-monitor · corrects `ShortcutsOverlayList` (kol-shell 0.68.0)

## The ask, in the user's words

> "I said no search, I didnt say DONT USE THE FUCKIN MODAL OVERLAY.. you just swapped it"
> "yes we are using the fucking command overlay WITHOUT THE SEARHC INPUT, we are using the CATEGORIES"
> "I want section header to say shortcuts, and those ARE CATEGORIES … those categories should either fold/unfold
> or enter/back"
> "tell DS to make a fucking demo of the modals in apps/ somewhere so I can fucking demo it WITHOUT … ANOTHER
> ROUNDTRIP"

## What went wrong

0.68.0 replaced the `S` sheet with a new narrow `ShortcutsOverlay` card (Settings-style rows, no title, keys jammed
against labels). My ticket only listed what to remove and never said to keep the modal. Undo the swap.

## The ask

1. `S` opens **`CommandOverlay`** — the same modal as ⌘K: same panel, width, row style, footer slot.
2. **No search field.**
3. The group header reads **Shortcuts** (where ⌘K shows "Spaces").
4. The rows are the **categories** — App · Rack · Cables · View · Pointer (the current page's, plus sections with
   no `routes`) — each with the → arrow, like ⌘K's page rows.
5. Picking a category **enters** it: its keys as rows (label left, combo right), the existing drill-in back arrow
   (`onBack`, CommandOverlayModes) / Backspace returns to the categories. (Enter/back is our pick; fold/unfold in
   place is the user's other acceptable shape.)
6. No Run, no Enter-to-run on a key row. `S` toggles, Esc closes, ⇧S ignored (as 0.68.0).
7. **A live demo in `apps/`** (the hub, or wherever the KOL showcases overlays): every CommandOverlay mode —
   search, go, add with drill-in, and this shortcuts mode — openable from one page, so the user can try it there
   before any consumer bumps.

## Acceptance

In the demo and on monitor's `/rack`: `S` → the ⌘K modal, no field, header "Shortcuts", five category rows with
arrows; Enter on Rack → its five keys with a back arrow; back → the categories; `S` again closes.

## ✅ RESOLUTION — 2026-10-18 · kol-shell@0.69.0

kol-component 0.272.0 + kol-shell 0.69.0: AppHub's `S` opens `CommandOverlay mode="shortcuts"` again — the ⌘K modal, no search field. Rows are this page's sections (plus sections with no `routes`) under the header "Shortcuts", each with the → arrow; Enter / → / click enters one — its keys as rows, label left, combo right, never run, no footer — and the back arrow / ← / Backspace returns to the categories. `S` toggles, Esc closes, ⇧S is ignored. The demo is `apps/overlays` (`pnpm overlays`, :5201): every overlay — CommandOverlay search · go · add (drill-in) · shortcuts (scoped to /rack), ShortcutsOverlay, useModal prompt · confirm · confirm + options · alert, SettingsPanel drawer · overlay, FullscreenOverlay — on apps/controls' Specimen frame. Verified there: five categories with arrows, Enter on Rack → its five keys with a back arrow, back → categories, `S` again closes.

**Remainder here:** none — kol-monitor bump kol-component@0.272.0 + kol-shell@0.69.0.
