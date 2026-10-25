# FlipCardFaceSwap

**Staged:** 2026-10-24 · from a kol-monitor session
**Change:** kol-hardware `FlipCard` shows nothing for ~110ms mid-turn and the back pops in late — swap faces by backface, not by a timed `visibility`

---

## The problem, in one case
Monitor's card flip (`/dev` → Card flip, a whole app card turning to its rack screenshot) on `FlipCard`. The user (2026-10-24): *"the card flipps, but the image snaps in once its landed. not believable."*

Measured on a 450ms turn, sampling the turner's transform and both faces' `visibility` every ~37ms: the `ease` curve crosses edge-on (rotateY 90°) at **~150ms**, but the faces swap `visibility` at a fixed **duration/2 = 225ms** (`transition: visibility 0s ${duration/2}ms`, `FlipCard.jsx`) and it lands in the computed style at ~260ms. From ~150 to ~260ms the front is turned away (backface hidden) and the back is still `visibility: hidden` — **a blank card** — then the back appears at ~150°, near the end of the turn. The images were loaded and decoded the whole time; it is the swap timing, not the asset.

## The fix
Drop the timed `visibility` swap: both faces `backface-visibility: hidden` (with `-webkit-`), the back pre-rotated 180°, inside the `preserve-3d` turner — the back shows exactly as the card passes edge-on, whatever the easing. If `visibility` was there to keep the hidden face out of tab order / scroll, use `inert` (or `aria-hidden` + `inert`) on the face that is away instead.

Monitor's local version (`src/pages/dev/CardFlipPage.jsx` `Flip`) does exactly this and turns continuously.

## Definition of done
- [ ] no blank frames through the turn at any `duration`; the back visible from edge-on
- [ ] the away face not focusable
- [ ] Published; kol-monitor's receipt names the version

## 🟢 CLOSED — 2026-10-24 · kol-hardware 0.7.0 live

Both faces `backface-visibility: hidden` (`-webkit-` too), the back pre-rotated in the preserve-3d turner, no timed visibility; the away face `inert` + aria-hidden. Walked on the showcase's FlipCard page: no face hidden at any sample through a 450 turn, the back hit from 142ms (edge-on), the front inert once landed. Registry live. Receipt returned to kol-monitor's outbox.
