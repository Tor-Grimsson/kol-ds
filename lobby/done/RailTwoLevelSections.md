---
component: NavRail (kol-shell) · AppShell · GRAB (kol-component/utilities/motion)
source: kol-fxr/src/shell/AppRail.jsx#L1-L240 · kol-fxr/src/shell/AppShellLocal.jsx · kol-fxr/src/editor/labs/LabsNav.jsx (the publish effect)
staged: 2026-08-28
status: draft
deps: [NavRail, AppShell, Button, Icon, Logomark, gsap, GRAB]
---

# RailTwoLevelSections

## Purpose

**The flat rail needs a second level, and a section row to hold it.** Built and
measured in kol-fxr first — `src/shell/AppRail.jsx` is a working fork of
`NavRail` with the level in it. **Take the diff, not this description.**

kol-shell 0.16.0 made the rail flat (`RailFlatGrabOpen`) and gave it exactly one
level: `items` with an optional `sub`, where a sub row is `pl-11` + a bare label
`<span>` and **no icon slot at all** (`NavRail.jsx:188`). There is also no
section-anchor row — a row that groups the rows beneath it.

fxr's labs chrome has ~44 nav rows across four method sections (Effects ·
Generative · Composition · Modulation). On a one-level rail those 44 flatten into
an undifferentiated icon column on a rail built for five destinations, and the
section names vanish entirely — they have nowhere to render. Adopting 0.16.0 in
fxr this morning is what surfaced it: the swap onto the shipped rail was correct
and it still cost the four section headers.

User ruling, 2026-08-28: *"the NAV has 20px icons in 32px containers, maybe level
below has 12px icons in 20px container aligned to right? so when you hit labs you
can see the main components [effects generate modulate blabla] 5 or something
total — and then you expand you see that they have main 56 items each, which you
won't be aware of until you actually open labs. which should not happen
automatically."*

## Anatomy

**L1 — section / destination row.** Icon + label + disclosure caret. 20px glyph
in a 32px container. This is `NavRail`'s existing row, unchanged: `Button
size="md" iconSize={20}` → `.kol-btn-icon.kol-btn-md` (32px). Destinations
(no `sub`) and sections (with `sub`) are the same row; the caret is what differs.

**L2 — group row.** 12px glyph in a 20px container, indented so its glyph column
sits to the RIGHT of L1's. Measured: L1 glyph x 14, L2 glyph x 30.

**Not a `Button`.** The icon-button ladder is sm 28 / md 32 / lg 36 and this rung
is 20 — there is nothing between "sm" and nothing. fxr's fork writes the row
directly (a 20px box + a 12px `Icon`) and keys active state off `aria-current`,
so kol-theme's `.kol-shell-rail .kol-btn-nav` rules still reach it. If the DS
would rather add an `xs` (20px) rung to `.kol-btn-icon`, that is the cleaner
home and this row becomes a `Button` again.

**Rest / active ink.** L2 rests at `--kol-oq-64` and goes `--kol-oq-96` active —
a rung quieter than L1, which is `oq-96` throughout per the rail's own ruling.

## Nothing auto-expands

An L2 row is behind **both** the rail's clipped width and its section's own
disclosure, so arriving on a route reveals nothing. In the fork this is held by
construction — `open` starts `false` and there is no `defaultOpen` prop to get
it wrong — not by a flag a consumer has to remember to pass.

## Proof — measured live, kol-shell 0.16.1 / kol-component 0.126.0

| | measured |
|---|---|
| rail collapsed | 48 |
| L1 container · glyph | 32×32 · 20 |
| L2 container · glyph | 20×20 · 12 |
| L1 glyph x · L2 glyph x | 14 · 30 (indented right) |
| sub rows on arriving at `/labs` | 0 — all four sections `aria-expanded="false"` |
| after drag-open + expanding Effects | 6 groups: Halftone · Scanline · CRT · Refraction · FX rack · Pattern |
| rows at L1 | 9 — 4 destinations, 4 sections, Settings pinned |

## Consumer shape

fxr builds the tree as a flat stream (a section marker, then the groups that
belong to it) and folds it into the nesting at publish time. The rail only ever
sees the finished shape:

```js
items: [
  { icon, path, label },                                  // destination
  { icon, path, label, sub: [{ icon, path, label }, …] }, // section + groups
]
```

A row whose action is not a route (labs swaps a layer, it never navigates) rides
a sentinel path and is dispatched by the consumer — that already works with
`onNavigate` and needs nothing new.

## ⚠ A SEPARATE DEFECT — please fix regardless of the above

`NavRail.jsx` (kol-shell 0.16.1):

```js
const mark = GRAB.marks.reduce((a, b) => (Math.abs(b - frac) < Math.abs(a - frac) ? b : a))
if (h.dataset.grabSeeded && Math.abs(frac - mark) > GRAB.stick) return
```

`GRAB` in **kol-component 0.126.0** is
`{ near: 20, sleep: 40, stick: 90, travel, snap, slop: 3 }` — **there is no
`marks` key.** `GRAB.marks.reduce` therefore throws a `TypeError` on *every*
`pointermove` within `near` of the rail edge. Reproduced in a browser: a single
drag emitted 13 identical errors. The grab pill never travels to a mark.

Second, smaller: `stick` is `90` (pixels) and is compared against
`Math.abs(frac - mark)` where `frac` is a 0–1 fraction — that guard cannot be
true even once `marks` exists.

**This affects every consumer on 0.16.1, kol-mirror included.** Either
kol-component needs to ship `GRAB.marks` (and a fractional `stick`), or NavRail
needs to stop reaching for them. fxr's fork carries local `MARKS`/`STICK`
constants as a fallback, flagged in-file, and deletes them on the return.

## What the filer owes on return

Bump; delete `src/shell/AppRail.jsx` and `src/shell/AppShellLocal.jsx` outright;
point `AppLayout.jsx` back at `AppShell` from `@kolkrabbi/kol-shell`; drop the
direct `gsap` dependency the fork needed; re-measure both levels on `/labs`.

## Note for the DS

`AppShell` renders its rail directly with **no component seam**, which is why
fxr had to fork `AppShell` as well as `NavRail` to prove this at all. A
`railComponent` prop (or shipping the level) removes the need for either fork.

---

## ✅ RESOLUTION — 2026-08-28

**kol-shell 0.17.0.**

**The level**, to your measurements: an item with `sub` is a section (the L1 row it already was, plus its caret); its rows are L2 — 12px glyph in a 20px box, `paddingLeft: 18` so the box lands at x 26 and the glyph at 30, one step right of L1's 20-in-32 at 14. Rest `oq-64`, `oq-96` when it is the route (prefix match, `/` exact), `aria-current` on the row. A sub row with no `icon` renders label-only, so kol-mirror's `{ path, label }` subs are untouched.

**Not a `Button`, and no `xs` rung minted.** You offered both; the ladder (sm 28 / md 32 / lg 36) is a 2026-07-28 user law and adding a rung to it is his call, not a side effect of this ticket. The row is written directly and keys `aria-current`, so `.kol-shell-rail .kol-btn-nav` still reaches it — if he rules an `xs` rung later, this row becomes a `Button` again with no API change.

**Nothing auto-expands** — unchanged and now documented as load-bearing: `open` starts `false`, there is no `defaultOpen`, and an L2 row is behind both the clipped width and the disclosure.

**`AppShell railComponent`** — shipped. You should not have had to fork `AppShell` to prove a rail change.

### The ⚠ defect — not in 0.16.1

`NavRail.jsx` in kol-shell **0.16.1** does not reference `GRAB.marks`; it was rewritten to dwell in the same release that removed `marks` from `GRAB` (kol-component 0.126.0), on a user ruling relayed from kol-mirror ("make it come to the cursor but have some sticky time where it lands"). The code you quoted is **0.16.0's**, which your `AppRail.jsx` forked — so the TypeError is your fork's, and it goes when the fork does.

Your report was still right about the hazard, and it is the more useful half: **shell 0.16.0 + component ≥0.126.0 throws, and 0.16.0's peer range (`>=0.125.0`) permits it.** `0.16.0` is now **deprecated on npm** with that message. Nothing else can be done to a published range.

Verified in source + showcase build only. Remainder in kol-fxr: bump to 0.17.0, delete `AppRail.jsx` and `AppShellLocal.jsx`, point `AppLayout` at `AppShell`, drop the direct `gsap` dep and the local `MARKS`/`STICK`, re-measure both levels.
