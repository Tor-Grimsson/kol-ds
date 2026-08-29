---
component: Dropdown · MenuDropdownItem · Popover (matchReferenceWidth)
source: kol-component/src/molecules/Dropdown.jsx#L120-L150 · src/molecules/MenuItem.jsx#L48,L100 · src/utilities/Popover.jsx#L67-L95 — hit in kol-mirror/src/components/hall-of-mirrors/LoadUnit.jsx#L104
staged: 2026-08-28
status: draft
deps: [Dropdown, MenuDropdownItem, Popover, kol-theme kol-components-molecules.css]
---

# DropdownGhostWidthAndListHeight

## The ask

Four defects, all found swapping kol-mirror's hand-built dropdown for the DS one across 29 call sites (user: *"it's stupid, just replace it with DS"*). The studio's LOAD-tab **Source** picker — ~30 options labelled `Displacement: Animated Turbulence`, in a **24px row inside a ~300px shelf** — hits every one of them. User, seeing it: *"this one is broken"* · *"1 it's way too tall, 2 it's not fitting."*

### 1. The ghost stack makes the trigger as wide as the widest option

`.kol-dd-ghost` stacks every option's label in the trigger's grid cell to reserve the one shared width (`kol-components-molecules.css:70`, the 2026-08-09 one-piece ruling). With 30 long labels the trigger computes to ~640px, overflows its container, and is clipped by the shelf — so the visible trigger is ~340px while the panel, sized `width: rects.reference.width` and portaled out, renders at the true 640px. It reads as a panel wider than and detached from its trigger.

The ruling assumed a trigger free to take the width it reserves. **Ask: the reservation must yield to the available width** — cap the ghost stack at the trigger's own max-width and let the label truncate, rather than growing a trigger past its container. A dropdown in a narrow chrome is not an edge case; it is where dropdowns live.

### 2. No height ceiling that a consumer can reach

The viewport clamp (`Popover.jsx`, `maxHeight: availableHeight`) only stops the panel leaving the viewport. Open near the top of a tall page and 30 rows render as a 700px slab over the whole instrument. `.kol-dd-list` has `overflow-y: auto` and is ready to scroll — nothing tells it when. **Ask: a rows-visible ceiling** — a `maxRows` prop (or a `--kol-dd-max-h` the theme reads), defaulting to something like 10, clamping `.kol-dd-list`. The inline `maxHeight` the middleware writes cannot be overridden from a consumer stylesheet, so this cannot be solved outside the DS.

### 3. `rowHeight` — no seam for the row pitch

Rows are a fixed `h-8` (`MenuItem.jsx:100`). Mirror's controls sit in 24px rows and its local dropdown took `rowHeight={24}` at six call sites; the DS rows are a third taller than the row they sit in. **Ask: a row-height seam** (prop or token). Mirror carries `.kol-dd-panel button { height: 1.5rem }` meanwhile.

### 4. Hover on the panel row

Already told to you separately, listed here so this ticket is the whole picture: `hover:text-emphasis` on `MenuItem.jsx:48` and `:100` is the last live hover on a dropdown — the trigger's is already pinned to rest for `primary`/`outline`, and `--grey` declares none. Mirror carries `.kol-dd-panel button:hover { color: var(--kol-fg-body) }`.

## Also missing, from the same swap

Props mirror's local component had and the DS has no equivalent for. Not asks unless you want them — recorded because dropping them was the cost of adopting:

| prop | sites | what it did |
|---|---|---|
| `onOptionHover` | 1 | hover an option → **preview it live** (FxUnit's blend mode applies on hover, reverts on leave). Real feature, now gone. |
| `placeholder` | 1 | trigger text when nothing matches; the DS renders blank |
| `defaultValue` | 1 | value to fall back to |
| `renderOption` · `keepOpen` | 0 | unused |

## Recreation notes

- 1 and 2 are the ones that make it unusable in an instrument chrome; 3 and 4 are pitch and polish.
- The 2026-08-09 one-piece ruling stands — the panel should keep matching the trigger. This asks that the TRIGGER stop sizing itself off content it cannot fit.
- Verified in kol-mirror on component 0.122.0 · theme 0.85.0, in the browser, at `/studio` → channel → LOAD → Source.

---

## ✅ RESOLUTION — 2026-08-28

**kol-component 0.124.0** + **kol-theme 0.87.0** (defect 4 shipped separately as component 0.123.0, on the same ruling relayed by message):

1. **The reservation yields.** `.kol-dd-root` (new class on the wrapper) and `.kol-dd-trigger` cap at `max-width: 100%`; `.kol-dd-label` and its spans clip with an ellipsis. The ghost stack still reserves the widest option — it just can no longer grow the trigger past its box, so `rects.reference.width` is the real width and the fusion holds. The 2026-08-09 one-piece ruling stands untouched.
2. **`maxRows`** (default 10) → `--kol-dd-max-rows` on the panel; `.kol-dd-list` takes `max-height: calc(rows × row-height + padding)` and scrolls. The middleware's viewport clamp is unchanged — this is the ceiling it could not give, and it had to be ours because that inline `maxHeight` is unreachable from a consumer sheet.
3. **`rowHeight`** (number = px, or any CSS length) → `--kol-dd-row-h` on the panel and an inline `height` on each row via `MenuDropdownItem height`. Inline because `h-8` is a utility and no rule in `layer(components)` out-ranks it.
4. **No hover** — component 0.123.0: `MenuDropdownItem hover={false}` from `Dropdown`; the trigger was already pinned in all three variants.

**Not built**, as the entry marks them not-asks: `onOptionHover` (a real feature mirror lost — file it and it ships), `placeholder`, `defaultValue`, `renderOption`, `keepOpen`.

Verified in source + showcase build only. Remainder in kol-mirror: bump both; pass `maxRows`/`rowHeight` at the studio call sites; delete `.kol-dd-panel button { height }` and `.kol-dd-panel button:hover { color }`.
