# ShellDrawerOnRight — the drawer opens from the left, so its close lands mid-screen

**Staged:** 2026-09-01 · from **kol-chess**
**Nature:** placement ruling on `AppShell touch="drawer"` (kol-shell 0.32.0 + kol-theme 0.119.0) — the fold itself works; the side is wrong.

## Reported — live site, iPhone, 390

User, verbatim: *"hamburger menu location, why is it on the left? it makes much
more sense to have it on the right, such that the close isnt in the middle of
the screen when nav is open?"*

Screenshot: `_assets/2026-09-01-chess-mobile-round-2/drawer-open-trigger-midscreen-390.png`.

## Why the X ends up mid-screen

`kol-components-shell.css:112-136`: the trigger is fixed `top: 12; left: 12`,
and `[data-rail-drawer="open"]` translates it by `--kol-shell-drawer-width`
(240) so it rides the drawer's trailing edge. At 390 that puts the open X at
x 252–284 — 65% of the way across, visually the middle of the screen — and the
rule's own comment records why the travel exists: fixed at 12/12 the X was
drawn on top of the drawer's logomark row (the 2026-08-31 device report).

The travel was the cure for the left side. A right-side drawer doesn't need
either: trigger fixed top-right, drawer sliding in from the right — the same
corner in both states, no translate, and the open X sits in the drawer's own
top-right corner at the screen edge, which is also where the thumb is.

## The ask

Mirror drawer mode to the right: trigger top-right, drawer from the right,
travel rule dropped. Whether that's the one behaviour or a `side` seam is
yours — kol-chess has no second opinion to offer, the user has ruled the side.
Desktop rail untouched; this is drawer mode only.

Consumer change expected: none — kol-chess passes `touch="drawer"` and nothing
else.

## ✅ RESOLUTION — 2026-09-01 · kol-shell@0.34.0

Mirrored, one behaviour, no side seam — you had no second opinion and a prop nobody asked for is a variant to keep in step for nothing. NavRail pins right-0 with a left border in drawer mode (desktop rail untouched), the theme's off-canvas transform is +100%, the trigger is fixed top-right in BOTH states, and the 2026-08-31 travel rule is retired. Also in 0.34.0: the drawer scrim is a button — the OverlayScrimTapDismiss iOS line, third instance, and this scrim only exists on touch. ⚠️ One frame to eye on device: a long drawer title could reach under the top-right X — the trigger-vs-rail class of defect only a device caught last time.

**Remainder here:** none — kol-chess bump kol-shell@0.34.0 + kol-theme@0.120.0; re-check the drawer at 390 — opens from the right, X at top-right screen edge in both states, scrim tap closes.

