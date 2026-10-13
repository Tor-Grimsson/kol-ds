# `SelectionOverlay` — the size readout stays upright under the box, and reads

**Staged:** 2026-10-13 · from a kol-fxr session (plan 30 § 13, the editor's canvas)
**Change:** the `W × H` label in `SelectionOverlay` (`utilities/SelectionOverlay.jsx`), kol-component 0.252.0

---

## The problem, in one screenshot

A layer rotated 90° (the toolbar's Rotate fold): its readout `259 × 306` stands on end against the box's
right edge, 10px, and cannot be read. The user: *"the size here glued to the side is so small it can't
be read."*

Why: the chrome is drawn inside one rotated group — `:96` *"the chrome rotates WITH the box (centre
origin)"* — so the label (`:149-171`, `left: 0; top: 100%`, `scale(1/zoom)`) turns with the handles and
lands wherever the box's bottom edge went. At −90 that is the right side, vertical. It is also
`fontSize: 10` mono on a 60% black chip.

Figma keeps the size chip horizontal, centred under the rotated box's screen bounds, at any angle.

## Ask

- The label counter-rotates (`rotate(${-rotation}deg)`) and sits **centred under the box's screen
  bounds** — upright at 0, 45 and 90, never on the box's side.
- 12px, not 10 (the chip, the tracking and the counter-scale stay).
- `labelFormatter`, `showLabel`, `accentColor` unchanged.

## Verify

A 200 × 100 box at 0°, 45° and −90°: the readout is horizontal and centred below the visible bounds
each time; at zoom 0.5 and 2 it is the same screen size; it reads at arm's length.

For fxr on the return: bump only — the editor already passes `showLabel`.

---

## Resolution — 2026-10-13 · 🟢 closed

**Shipped `@kolkrabbi/kol-component@0.253.0`.** The label left the rotated chrome group: it is placed at
the box's centre x and `centre y + half the rotated bounds' height + 6/zoom`, `translateX(-50%)
scale(1/zoom)` from a top-centre origin, so it is upright and screen-constant at any angle and zoom.
12px; chip, tracking, `showLabel`, `labelFormatter`, `accentColor` unchanged.

Verified on the showcase (`/components/selection-overlay`, a 220 × 150 box): at 0°, 45° and −90° the
label is 81 × 22 (horizontal), its centre x = the bounds' centre x (647 = 647), its top 6px below the
bounds' bottom, 12px. Shot: `_tmp/2026-10-13-fxr-menus/selection-label-minus90.png`. 0 console errors.

For fxr: bump only.
