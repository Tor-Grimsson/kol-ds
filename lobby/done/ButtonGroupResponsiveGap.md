# ButtonGroupResponsiveGap — the group's gap is one fixed value at every breakpoint

**Filed:** 2026-08-31 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` — `ButtonGroup.jsx:35`

## The gap

```js
'flex flex-col gap-4 sm:flex-row sm:items-center'
```

`gap-4` — 16px — with no breakpoint variant and no prop. The group *does* respond
in the axis it stacks on (`flex-col` → `sm:flex-row`), so the same 16px is doing
two different jobs: horizontal separation between two side-by-side buttons on
desktop, and vertical separation between two full-width stacked buttons on a
phone. Those do not want the same number.

On kol-website's `/` the stacked pair reads too open at 16 — user's call was
*"16 is way too big, at least lets see 8 or 12"*, and 8 is what looks right on
device.

## The ask

Either a responsive default (tighter while stacked, today's 16 once it is a row),
or a `gap` prop so a consumer can set it without reaching into the group's inner
element — note `className` lands on the OUTER container, so there is currently no
seam to the flex row that carries the gap at all.

A responsive default is probably right: the stacked case is always the narrow
viewport, so the value can be picked once rather than per consumer.

## Stopgap here meanwhile

`apps/web/src/styles/ui.css` sets `gap: 8px` under `max-width: 767px`, scoped
through a `kol-btn-group-tight` class passed as `className` so it reaches the
inner row via `> div`. Dated and citing this ticket.

## Remainder here once it ships

bump kol-component; delete the stopgap and the `kol-btn-group-tight` class from
the two call sites in `Home.jsx` and `HomeWorkshop.jsx`.

## ✅ RESOLUTION — 2026-08-31 · kol-component@0.147.0

The gap is responsive now: gap-2 stacked, sm:gap-4 as a row. Your read was the right one — the group changes axis at sm, so one fixed 16 was doing horizontal separation between two side-by-side buttons AND vertical separation between two full-width stacked ones, and those do not want the same number. Shipped as a responsive default rather than a prop, for the reason you gave: the stacked case IS the narrow viewport, so the value is pickable once instead of per consumer. Nothing moves at sm and up. Note className still lands on the OUTER container by design — with the gap responsive there is nothing left to reach for.

**Remainder here:** none — kol-website bump kol-component >=0.147.0, delete the stopgap and the kol-btn-group-tight class from Home.jsx and HomeWorkshop.jsx.

