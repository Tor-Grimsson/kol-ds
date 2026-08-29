---
component: SideNav · NavRail
source: kol-shell src/NavRail.jsx (0.13.0, logomark → footer) · kol-framework src/SideNav.jsx (no header slot)
staged: 2026-08-27
status: draft
deps: [SideNav, NavRail, Logomark]
---

# RailLogomarkAtTop

## The ask

**The logomark goes back to the TOP of the rail — in both states.** User,
2026-08-27, on seeing the raven in the footer for the first time: *"why did you
move the logo from top to bottom?"* … *"I've never seen that before so you are
the first."*

## What happened

`RailSideNavPixelParity` ruled *one component, both states*. The return (shell
0.13.0) folded `NavRail` into `SideNav` — correct — and, because `SideNav` has
no slot above the tree, moved the logomark into the `footer` (→ `/`). That
second move was not in the ruling. Every rail in the estate has carried the
raven at the top: fxr's shell rail, kol-monitor's rack rail, the brand app's
own SideNav opens on its first row. The footer is where brand keeps its
*wordmark* ("Kolkrabbi Vinnustofa · year" / "K"), which is a different mark
with a different job.

kol-fxr adopted it as shipped and matched labs to it, so fxr is where the user
saw it — the consumer is reporting a design change it did not make and did
not flag. That is on the consumer too.

## Asks

1. **`SideNav` gains a header slot** — `header` (a node) rendered above the
   tree, inside the rail's own geometry so the first tree glyph sits at the
   same y in every consumer. Collapsed: the mark, centred on the icon column
   (the 20 px logomark on the 16 px glyph column, as the old `NavRail` did).
   Expanded: the same mark, left-aligned to the icon column; wordmark beside
   it optional.
2. **`NavRail` passes its `logomark` there**, not to `footer`. The footer
   returns to `SideNav`'s default (the wordmark link) or `false` — the shell's
   call, but the raven is not a footer.
3. **The tree-head rule updates**: "the head must be the shell's items" holds,
   with the header block above it counted into the first-glyph y on both
   rails — that is the parity contract now.

## What this repo does on the return

Bump; labs' `SideNav` passes the same `header` node the shell rail does and
drops its `footer` logomark; re-measure `/library` ⇄ `/labs` — the first tree
glyph moves DOWN by the header's height on both, identically.

## Origin

Filed from **kol-fxr**, where the user saw it. Not shimmable: `SideNav` has no
slot above the tree, and `NavRail` hardcodes the footer placement.

---

## ✅ RESOLUTION — 2026-08-28

The footer move was mine and not in the ruling; owned. Shipped:

1. **kol-framework 0.33.0** — `SideNav header`: a node above the tree, outside the scroll region, in `.kol-sidenav-header` — the hop's horizontal geometry (1rem above; the scroll region's own top pad is the gap to the first row). A `.kol-sidenav-hop-icon` inside it centres on the icon column collapsed and left-aligns expanded; a `.kol-sidenav-hop-label` beside it hides with the labels — both existing classes, so every collapse/narrow/drawer rule applies for free.
2. **kol-shell 0.13.1** — `NavRail` passes the logomark as `header` (20px mark on the icon column, `title` as the label in the open rail, → `/`), `footer={false}` — an app rail never carried the site's wordmark link, and adding it was not ruled either.
3. The tree-head rule in 11-shell-system.md: the head is the shell's items with the same `header` node above them; the header's height is counted into the first-glyph y on every rail.

Verified in source + showcase build only. Remainder in kol-fxr: bump both; labs' `SideNav` passes the same `header` node the shell rail does (a button with `.kol-sidenav-hop-icon` + `Logomark`) and drops its `footer` logomark; re-measure `/library` ⇄ `/labs` — the first tree glyph moves DOWN by the header's height on both, identically.
