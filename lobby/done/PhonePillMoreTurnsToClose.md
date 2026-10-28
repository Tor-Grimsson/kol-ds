---
component: PhonePillMoreTurnsToClose
source: kol-fxr plan 44 W3.1, walked on kol-shell 0.86.0
staged: 2026-10-28
status: draft
---

# PhonePillMoreTurnsToClose

**Raised:** user, 2026-10-28 (frame A2): *"4 buttons 1 for each chrome + [...] that makes a list and nav turns to (X)"*. `HubHomeSignedOut`'s ask carried it: *"••• opens the whole list … and turns to ×"*.

## Seen
fxr `/` signed out at 390 (Chromium): press ••• → the list opens (Library, Editor, Labs, Randomiser, Morph, New File, Walkthrough, Sign in, Settings — right order), the slot lights, but its glyph stays ••• (the pill's own `Close` button exists in the DOM, aria-hidden). Signed-in Home's pill, before `moreKeepsOpen`, collapsed to a lone ×.

## The ask
While the sheet is open the More slot draws × (`x` glyph) in place; a press closes. The pill keeps its slots (no collapse).

## Done when
fxr signed out at 390: ••• → × with the list open, × → ••• closed.


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-shell 0.87.0**: with `moreKeepsOpen` the More slot draws × (label Close) while the sheet is open and a press closes it; the pill keeps its slots. Walked on studio-hub's signed-out Home at iPhone 13: ••• → × with the list open, × → ••• closed.
