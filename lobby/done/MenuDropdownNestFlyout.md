# `MenuDropdownNest` opens beside its row — a flyout, the way every desktop menu bar does

**Staged:** 2026-10-13 · from a kol-fxr session (plans 28–29, the editor's menu bar)
**Change:** a flyout mode for `MenuDropdownNest` (`molecules/MenuItem.jsx`), kol-component 0.251.0

---

## The problem, in one case

kol-fxr's editor menu bar follows Affinity / macOS (`File Edit Layer Text Vector Tools View Window Help`).
Its submenus — Tools › Generative › Loops › Field › *preset*, File › Starters ▸, Window › Left rail ▸ —
must open **beside** their row. The user, with Affinity screenshots: *"instead of collapsing items in
the window menus use something like"* the side panels.

`MenuDropdownNest` (`MenuItem.jsx:167-195`) is an **accordion**: a click expands its children inline,
indented under a hairline (`:189` `ml-3 border-l border-oq-08`). Three levels deep that is a long
indented column inside one panel, not a menu.

## What kol-fxr built meanwhile

`src/editor/shell/menus/MenuFlyout.jsx` (kol-fxr) — read it before building:
- **Hover opens, leaving the row closes, a click toggles** (touch).
- **The panel is a DOM child of the row, not a portal.** `MenuItem` closes on a click that bubbles from
  `[data-menu-item]` and dismisses on an outside press; a portalled child panel reads as "outside" and the
  menu closes under the pointer. As a DOM child, both keep working with no extra wiring.
- **One measure on open** keeps it on screen: lift it to end above the window's foot (never past its head),
  flip to `right-full` when it would cross the right edge.
- **`scroll`** — leaf lists (60+ presets) cap at `max-h-[60vh] overflow-y-auto`. A scrolling panel clips its
  own flyouts, so only a panel with no flyouts inside scrolls.
- Panel: `flex flex-col w-max min-w-[180px] max-w-[320px] py-1 bg-surface-secondary rounded border border-oq-08 shadow-lg`, `top: -5px` so the first row lines up with the trigger row. Trigger: the nest's row with `chevron-right` (10) instead of the rotating `chevron-down`.

## Ask

`MenuDropdownNest` gets a flyout mode — `flyout` prop, or a sibling `MenuDropdownFlyout` — with the
behaviour above. The accordion stays the default (no consumer breaks). kol-fxr's `MenuFlyout` retires
on the bump (plan 17 #16 there).

## Verify

A three-deep flyout from a `MenuItem` panel: hover walks in, the leaf click fires and closes the whole
menu; a flyout near the right edge flips; a 60-row leaf scrolls inside the window.

---

## Resolution — 2026-10-13 · 🟢 closed

**Shipped `@kolkrabbi/kol-component@0.252.0`.** `MenuDropdownNest flyout` — a prop, not a sibling, so the
accordion stays the default and nothing breaks. Your `MenuFlyout.jsx` carried over: hover opens, leaving
closes, a click toggles; the panel is a DOM child of the row; one measure on open lifts it above the
window's foot and flips it to `right-full` at the right edge; `scroll` caps a leaf list at 60vh; the
`top: -5` alignment and the chevron-right trigger. Added: → opens (focus to the first row), ← closes back
to the row; `disabled` on both modes.

Verified on the showcase (`/components/menu-dropdown-nest`, variant Flyout — Insert › Layout › Presets,
40 rows): three deep by hover; the 40-row leaf 432px tall = 60vh, scrolling (1288 inside); its foot at
712 of 720; a leaf click closed the whole menu (no `[role=menu]` left, trigger `aria-expanded=false`);
at 900 wide the third panel flipped left. 0 console errors. Shot: `_tmp/2026-10-13-fxr-menus/flyout.png`.

For fxr: `<MenuDropdownNest flyout label=… iconLeft=…>` (and `scroll` on the preset lists) in place of
`MenuFlyout`; `MenuEyebrow` is yours to keep.
