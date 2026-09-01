# RailSectionPressOpensRail — a section row is a dead press on the closed rail

**Staged:** 2026-08-30 · from **kol-fxr**
**Nature:** missing behaviour + no seam to add it in the consumer. The old
`SideNav` had this and `NavRail` did not carry it over.

## The report

User, 2026-08-30: *"if I press effects from collapsed nav it should maybe open?
currently pressing it does nothing."*

He is right, and it is worse than a no-op by accident — **on the closed rail a
section row cannot do anything at all**:

- The row's icon `Button` calls `onNavigate(path)`. A section is not a
  destination, so there is nothing to navigate to.
- The disclosure caret is a **separate** button in the same flex row, and closed
  the row clips to 48px — the caret is outside the clip. Unreachable.
- So the only reachable control on a closed section row is the one that does
  nothing.

Open, it is fine: the caret is visible and toggles. The defect is closed-state
only, which is the state the rail is in by default.

## Why fxr cannot fix it locally

`railOpen` is `NavRail`'s own `useState(false)` and is set **only** by
`useRailDrag`'s `snapTo`, which fires only on pointer events on the grab strip.
There is no prop, no callback, no imperative handle.

Setting `--kol-shell-rail-width` from outside is not a workaround: the width
animates open but `railOpen` stays `false`, and the L2 rows render behind
`railOpen && open && sub.map(...)`. The result is a **wide, empty rail** —
strictly worse than the dead press.

`openWidth()` also reads `--kol-sidenav-w`, so a consumer reimplementing the
snap would be duplicating the ladder as well.

## The ask

**Pressing a section row on the closed rail opens the rail and expands that
section.** That is the behaviour `SideNav` had before the flat-rail reversal —
fxr's own `LabsNav` docstring still records it: *"collapsed rail — icon rows get
a DS Tooltip and any icon press expands (the 0.17.0 behaviour)."*

Cheapest shape: when `!railOpen` and the row has `sub`, the icon button snaps
the rail open and sets that row's `open` instead of calling `onNavigate`. It
stays inside the component, needs no new prop, and cannot conflict with
`nothing auto-expands` — this is an explicit press, not arrival on a route.

If you would rather it stayed a consumer decision, the alternative is an
imperative seam (`onRequestOpen`, or `railOpen` / `onRailOpenChange` as a
controlled pair). The in-component version is the one we would rather have —
every consumer wants the same thing here.

## Context

fxr's labs rail publishes four sections (Effects · Generative · Composition ·
Modulation) into `AppShell items` via its `railExtras` store, each with `sub`
groups. Section paths are `#rail/sec:*` sentinels with no dispatch entry,
because a section has no action — which is exactly why the press should be the
rail's own behaviour and not something every consumer wires by hand.

Reported after the rows were reordered to sit directly under Labs rather than
after the whole nav (fxr-local, 2026-08-30).

## ✅ RESOLVED — 2026-08-30

**kol-shell 0.29.0.** The in-component version, as you asked — no new prop, no
consumer wiring.

Pressing a section row on the closed rail now snaps the rail open and expands
that section. Open, nothing changes: the caret is visible and still toggles.

```js
const isSection = sub?.length > 0
const press = () => {
  if (isSection && !railOpen) { onOpenRail?.(); setOpen(true); return }
  onNavigate?.(path)
}
```

Both the icon and the label run through it, so either half of the row works.

### The one structural change

`snapTo` was trapped inside `useRailDrag`'s effect — it closes over the tween
and the CLOSED/`openWidth()` ladder. `useRailDrag` now takes a ref and hands out
`() => snapTo(openWidth())`, which is why the press reuses the real snap rather
than reimplementing it. Your read was right that a consumer could not do this:
setting `--kol-shell-rail-width` widens the rail while `railOpen` stays false,
and the L2 rows render behind that flag — a wide, empty rail, worse than the
dead press.

Not in conflict with *nothing auto-expands*: that rule governs arriving on a
route, this is an explicit press.

⚠️ **Source-verified only** — the showcase renders no `NavRail` with sections,
so the snap and the expand have not been driven. You are the check.

**Remainder here:** bump to kol-shell 0.29.0.
