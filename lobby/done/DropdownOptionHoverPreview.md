---
component: Dropdown · MenuDropdownItem
source: kol-mirror/src/components/hall-of-mirrors/FxUnit.jsx#L152-L170 (the consumer that needs it) · the retired local dropdown at kol-mirror/_tmp/2026-08-28-dropdown-ds/Dropdown-local.jsx#L300-L312
staged: 2026-08-28
status: draft
deps: [Dropdown, MenuDropdownItem]
---

# DropdownOptionHoverPreview

## The ask

`onOptionHover(value | null)` on Dropdown — fired when the pointer enters a panel row (its value) and when it leaves (`null`).

Invited by kol-ds-ui-6f while closing [[DropdownGhostWidthAndListHeight]]: *"`onOptionHover` is a real feature you lost — file it and it ships."*

## Why it is not a nice-to-have

A dropdown that picks a **visual** setting is a different control from one that picks a value. kol-mirror's blend-mode picker (`FxUnit.jsx`) applies the hovered mode to the live composite and reverts on leave, so you scrub 16 blend modes against the actual image and stop on the one that works. Choosing each in turn and looking is not the same interaction — it is 16 commits instead of one glance, and the thing you are judging is a picture, not a label.

This is the general case for any picker over blend modes, easing curves, palettes, filters or fonts. The DS has the panel; only the consumer knows what to preview.

## Contract

| | |
|---|---|
| signature | `onOptionHover(value)` on row enter · `onOptionHover(null)` on row leave |
| on close | `null` once, so a consumer never has to guess whether to revert |
| while closed | **never fires** — a closed dropdown has no rows to hover |
| keyboard | fire on the focused row as arrow keys move, if that is cheap; not required |
| absent | no listeners bound, no behaviour change |

The revert is the consumer's: mirror stashes the committed value on the first hover, restores it on `null`, and clears the stash on select. The DS only reports.

## Recreation notes

- `MenuDropdownItem` already takes the row's `value`; this is `onPointerEnter` / `onPointerLeave` beside the existing `onClick`.
- The `null` on close is the load-bearing half — without it a panel dismissed while a row is hovered leaves the consumer previewing forever. The retired local component fired leave before close for exactly this reason.
- Prior art, working for months before the DS swap: `kol-mirror/_tmp/2026-08-28-dropdown-ds/Dropdown-local.jsx#L300-L312`.

---

## ✅ RESOLUTION — 2026-08-28

Shipped as **kol-component 0.125.0**, the contract as written:

| | |
|---|---|
| enter / leave | `onOptionHover(option.value)` / `onOptionHover(null)` — `MenuDropdownItem` takes `onPointerEnter`/`onPointerLeave` |
| on close | `null` once, from an effect on `isOpen` — the load-bearing half |
| while closed | never: the rows are not rendered, and the close effect only fires when something was hovered |
| absent | no listeners bound at all (the handlers are `undefined` without the prop) |
| keyboard | **not done** — the optional half of the contract; arrow keys move focus, not hover |

The hovered value is a ref, not state: the preview is the consumer's, and re-rendering the panel on every row crossed would be a render per pointermove for nothing. Re-entering the same row does not re-fire.

Verified in source + showcase build only. Remainder in kol-mirror: bump ≥0.125.0 and re-wire FxUnit's blend-mode preview — stash on first hover, restore on `null`, clear the stash on select, as the local component did.
