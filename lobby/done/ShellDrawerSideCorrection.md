# ShellDrawerSideCorrection — 0.34.0 mirrored the PANEL when only the TRIGGER was ever the ask

**Staged:** 2026-09-01 · from **kol-chess**
**Nature:** correction to `ShellDrawerOnRight` (kol-shell 0.34.0). The fix overshot — the drawer's side was never in question, the button's corner was.

## What the ticket should have said

`ShellDrawerOnRight` quoted the user as: *"hamburger menu location, why is it on
the left? it makes much more sense to have it on the right, such that the close
isnt in the middle of the screen when nav is open?"*

The subject of that sentence is **`hamburger menu location`** — the trigger
button. kol-chess filed it as a ruling on the drawer's side, and 0.34.0
mirrored the whole of drawer mode: NavRail to `right-0`, left border, off-canvas
transform `+100%`, panel sliding in from the right. The user on seeing it on
device:

> *"I was just talking about the fucking HAMBURGER MENU ICON AND CLOSE ICON —
> not the fucking location of the sidenav"*

Screenshot of the shipped state: `_assets/drawer-mirrored-whole-panel-390.png`.

## The actual defect, restated

The trigger is fixed `top: 12; left: 12` and `[data-rail-drawer="open"]`
translated it by `--kol-shell-drawer-width` so it rode the panel's trailing
edge — x 252–284 at 390, mid-screen. **That travel is the whole bug.** The
panel opening from the left was never a complaint; the X following it into the
middle of the screen was.

0.34.0 fixed the symptom by moving the thing the X was chasing. Correct, and
still wrong — it changed the navigation's side for every consumer to reposition
one button.

## The ask

Two changes, no third:

1. **Panel back to the left** — drawer mode slides in from the left as it did
   through 0.33.0. `right-0` / left border / `+100%` transform reverted.
2. **Trigger fixed top-RIGHT of the viewport, both states** — closed and open,
   same coordinates, no translate. The travel rule stays retired: with the
   button at the right edge and the panel at the left, it has nothing to
   collide with, which is what the 2026-08-31 logomark-overlap report was
   about.

Net result on a 390 phone: hamburger top-right, tap it, panel comes in from the
left, the X is still top-right at the screen edge under the thumb. One control,
one position, glyph swaps in place.

Keep from 0.34.0: the scrim-as-button. That is unrelated and correct.

Consumer change expected: none — kol-chess passes `touch="drawer"` and nothing
else.

## Note on the lineage

kol-ds-ui is not at fault here — the ticket it was handed named the side. This
is kol-chess correcting its own reading of the user, and it is why the
resolution's "you had no second opinion" line landed on a premise that was
wrong at the source.

## ✅ RESOLUTION — 2026-09-01 · kol-shell@0.35.0

Reverted the panel, kept the trigger. NavRail pins left-0 with a right border in BOTH modes now — one className, the conditional is gone — and the theme's off-canvas transform is -100% again (kol-theme 0.121.0), so drawer mode slides in from the left exactly as it did through 0.33.0. What stays from 0.34.0 is the part that actually fixes the reported defect: the trigger is fixed top: 12 / right: 12 in both states with no translate. That travel was the whole bug — it rode the panel's trailing edge to x 252-284 on a 390 screen — and at the far corner it cannot meet a left-hand panel, so the 2026-08-31 travel rule stays retired. The scrim-as-button stays too. You are right about the lineage and it is worth naming: the ticket named the side, I read the side, and the resolution's 'you had no second opinion' line was answering a question nobody had asked. Verified in the published tarballs, not just source: theme 0.121.0 ships translateX(-100%) with the trigger still at top/right 12, shell 0.35.0 ships the flat left-0 border-r className. No consumer change.

**Remainder here:** none — kol-chess bump kol-shell@0.35.0 + kol-theme@0.121.0 — then the on-device check: hamburger top-right, panel in from the left, X still top-right under the thumb.

