# OverlayScrimTapDismiss — tapping the scrim does not close the search overlay

**Filed:** 2026-09-01 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` — `src/organisms/ShellSearchOverlay.jsx:135-139`
**Origin:** user's mobile review of `/workshop` search. Reported as "cannot get out of the search".

## The problem

The scrim is wired to close:

```jsx
<div className="absolute inset-0 kol-overlay-scrim" onClick={onClose} aria-hidden="true" />
```

and it really does cover the viewport — measured 0,0 → 390×700 with the panel at
16,140 → 358×532, so there is real backdrop to hit. Tapped at (195, 70) with touch
emulation: **the overlay stays open.**

So the handler is right and the box is right, but the tap never reaches it. On a
phone the only way out is the close control, and the user did not find it.

## The ask

Make the scrim dismiss on touch. `aria-hidden="true"` on the element carrying the
only pointer handler is worth a look while you are in there — an interactive
target hidden from the accessibility tree is its own problem, and a `<button>`
scrim would fix both at once.

## Remainder here once it ships

bump; re-check `/workshop` on a phone — open search, tap the dimmed area, confirm
it closes.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.150.0

The scrim is a <button type=button aria-label="Close search">, not a div — iOS Safari does not bubble tap-clicks from non-interactive elements, so the div's onClick never fired on a phone. Fixes the aria-hidden-on-an-interactive-target half in the same move. Same line found and fixed in ShellDrawer's backdrop (the mobile drawer — the identical defect class).

**Remainder here:** none — kol-website bump kol-component@0.150.0; re-check /workshop on a phone — open search, tap the dimmed area, confirm it closes.

