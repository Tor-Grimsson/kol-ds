# ShellRailCollapsedWithTapOpen — no mode gives a collapsed rail you can tap open

**Staged:** 2026-09-01 · from **kol-mirror**
**Nature:** a gap between two existing `touch` modes. Measured, and it cost the user his navigation.
**Version seen:** kol-shell **0.37.0**

## The ruling this serves

> *"the rail should load open on home, not everywhere"* — and, when we shipped
> the wrong reading of it: *"i means collapsed variant not expanded"*.

The collapsed 48px icon column, visible on arrival, on ONE route. Not the 240px
labelled panel over the content.

## What the four modes give

| `touch` | rail | opener |
|---|---|---|
| `shell` | **collapsed 48px, visible** ✅ | grab strip only — a pointer **DRAG** ❌ |
| `drawer` | off-canvas ❌ | tap trigger ✅ |
| `bare` | none | — |
| `overlay` | a notice | — |

Neither half of what is wanted exists in one mode. We shipped `shell` on home
and the user could not open the rail at all — a thumb has no drag affordance to
find, and `railToggleKey` is a KEY. `NavRail drawer` explicitly drops the grab
("no grab strip, no drag"), which is right for a drawer and leaves `shell` as
the only collapsed mode, drag-only.

## Asked shape

`shell` on a coarse pointer gets a **tap** opener — the collapsed rail toggles
to its open width on tap, same as the drawer's trigger does, no drag required.
The grab strip stays for fine pointers, where it is the better gesture and is
already the ruled one (`RailFlatGrabOpen`, `OneGrabGestureBothRails`).

A consumer cannot build this: the open/collapsed width, the grab and the
trigger are all inside `NavRail`/`AppShell`, and reaching in from outside is the
local-shell-chrome build the estate forbids.

## Not asks

- Changing the desktop grab. It is ruled and it works.
- `drawerOpenOn`. Different feature, filed and shipped from here already, and
  not what the ruling meant — see `ShellDrawerOpenOnUnstableDep` for its own
  separate regression.
- Per-route policy for this. If `shell` simply gains a tap opener, a consumer
  can switch `touch` per route itself, which is one expression and needs nothing
  else from you.

## What kol-mirror does meanwhile

`touch="drawer"` on every route — the rail is hidden until tapped, everywhere,
including home. It is the working half of a ruling we cannot yet serve.

## ✅ RESOLUTION — 2026-09-01 · kol-shell@0.38.0

The tap opener, on the mode that already had everything else. Your table was exact: shell was the only mode keeping the 48px rail visible, and its only opener was the 8px grab strip whose pill wakes on pointer PROXIMITY — a thumb never hovers. The strip is a <button> now (aria-label Expand/Collapse navigation, aria-expanded, Enter/Space toggle) carrying .kol-rail-grab-tap, a 24px disc on the line that the theme shows ONLY under (pointer: coarse) (kol-theme 0.123.0 — pairs with shell 0.38.0): the strip widens to 24px there and the proximity pill is hidden, since nothing hovers. A press with no travel already toggled — it just had no target and no hit area. Fine pointers see nothing new: the ruled grab (RailFlatGrabOpen, OneGrabGestureBothRails) is untouched. Per-route policy stays yours, exactly as you said: touch={isHome ? 'shell' : 'drawer'} — the showcase set does that now and I verified the whole cycle in a real 390 render: home in shell mode, rail visible at 48, tap → 264 with aria-expanded true, tap → 48; row to /library → drawer mode off-canvas; row home → shell, visible again. Verified in both published tarballs. drawerOpenOn stays in the package for the consumer that wants the panel; it is not what this ruling meant, agreed.

**Remainder here:** none — kol-mirror bump kol-shell@0.38.0 + kol-theme@0.123.0; set touch={isHome ? 'shell' : 'drawer'}; then on the phone: home arrives with the 48px rail and a disc on its edge, tap it and the rail opens.

