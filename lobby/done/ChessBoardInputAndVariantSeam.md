# ChessBoard: drag-and-drop, square semantics, and a `dests` seam

**Staged:** 2026-08-31 · from a kol-chess session
**Change:** ~79 added lines in `packages/chess/src/apparatus/ChessBoard.jsx`, prototyped and working. The third item is a design call, not a diff.

---

## The problem, in one case

`ChessBoard interactive` offers exactly one input: `onClick` on a bare `<div>`.

```jsx
<div
  key={coordinate}
  className={...}
  data-square={coordinate}
  onClick={hasInput ? () => handleSquareClick(coordinate, square) : undefined}
>
```

Three consequences, all measured while building kol-chess's `/play`:

1. **No drag.** Dragging a piece is the primary gesture on lichess and
   chess.com, and on a phone it is close to the only one people use. Tapping
   works, so the board is not broken — it is unfamiliar in a way every player
   notices within one move.
2. **Not reachable without a pointer.** A `div` with an `onClick` has no role,
   no tab stop and no accessible name, so the board cannot be operated or read
   by a screen reader at all. That is the whole feature, not a rough edge.
3. **No way to supply legality from outside.** `handleSquareClick` derives legal
   moves from chess.js on the rendered FEN. That is correct for standard chess
   and makes Chess960 and every variant impossible in principle: chess.js
   offers **no castling in a 960 position** (measured — `4k3/8/8/8/8/8/8/RK6 w A -`
   returns no castle from chessops' equivalent position, chess.js returns none
   at all) and has no variant rules.

## The fix

**(1) and (2) are prototyped and working.** The full diff is attached at
`_assets/ChessBoardInputAndVariantSeam.diff`; it was developed against a live
symlink of this package from kol-chess and verified in that app: drag, click and
keyboard all move pieces, with zero console errors.

Shape of it:

- `handlePointerDown` / `handlePointerUp` on each square, with
  `setPointerCapture` so the release still lands when the finger leaves the
  square it started on. **Pointer events, not HTML5 drag-and-drop** — `dragstart`
  and `drop` never fire on touch, so an HTML5 version would add drag for exactly
  the devices that already worked.
- The drag **reuses the click machinery**: pointerdown selects (targets light up
  as they do on a tap), pointerup commits through the same path. A press that
  does not leave its square falls through to `onClick`, so tap-to-move is
  byte-for-byte unchanged.
- `role="button"`, `tabIndex={0}`, `aria-label` (`"e2, white pawn"` /
  `"e4, empty, legal move"`), `aria-pressed` mirroring the selection the class
  already showed, and Enter/Space running the existing handler.
- `touch-action: none` on an interactive square so a drag is not stolen by
  the scroller.

**(3) is the design call and deliberately NOT prototyped.** A `dests` prop —
`Map<from, to[]>`, the shape `chessops`' `chessgroundDests()` already returns —
would let a consumer supply legality and leave the board a renderer. Today the
board is both renderer and rules engine, and the rules half is what makes
variants unreachable. Whether that seam is wanted, and whether this package
should move off chess.js to `chessops` (which covers 960 plus all seven lichess
variants and ships `chessops/pgn`), is yours — kol-chess would migrate with it.

## Rejected alternative

**Do it in the consumer.** kol-chess cannot: the board generates its own legal
moves internally, so no prop, wrapper or CSS reaches the decision. The only
consumer-side route is forking the component, which the estate forbids and
which would strand this package's only external consumer on a private copy.

**Ship drag as an opt-in prop.** Rejected: an input mode people expect by
default should not need to be asked for, and a `draggable` flag would leave the
a11y half — the part that is a defect rather than a preference — behind a
setting nobody turns on.

## Definition of done

- [ ] Drag moves a piece with a mouse, and with touch
- [ ] Tap-to-move behaves exactly as it does today (no regression)
- [ ] Every interactive square is tabbable, named, and operable with Enter/Space
- [ ] `onSquareClick` (edit mode) is unaffected — it bypasses selection and must keep bypassing it
- [ ] A ruling recorded on the `dests` seam and on chess.js → chessops

---

## Resolution — 2026-08-31 · 🟠 addressed · §3 🔴 needs-ruling

**Shipped: `@kolkrabbi/kol-chess` 0.9.0** — §1 (drag) and §2 (a11y) are in.
**§3 (`dests` + chess.js → chessops) is NOT shipped**; it is a design call and
is left to the user. The entry stays in the queue for that reason.

### The prototype had one defect, and it was not the one it looked like

The attached diff was applied and reviewed before shipping. Reasoning said the
click following a selecting pointerdown would re-enter `handleSquareClick` on
the now-selected square and deselect it — a tap that selected and unselected in
one gesture. A `skipClickRef` latch was added to swallow that click.

**Both halves were wrong, and the browser said so.** Instrumenting the real DOM
events on a square:

| gesture | events on the square |
|---|---|
| first tap (changes selection) | `pointerdown` · `mousedown` · `pointerup` · `mouseup` · `lostpointercapture` — **no click** |
| second tap (changes nothing) | the same, **plus `doc-click` · `click`** |

The press re-renders the square, React replaces the node the mousedown landed
on (the glyph's `<path>`), and a browser that cannot find a common ancestor for
mousedown and mouseup **drops the click entirely**. So the click is present or
absent depending on whether the press changed the board.

That made the latch worse than the bug: set on a press whose click never
arrived, it was never consumed, and it ate the **next** real click instead —
killing tap-to-deselect and tap-to-move outright. Measured: `tap a7 again ->
deselected` false, `tap a7 then a6 -> pawn on a6` false.

**The fix is two rules.** A press on your own piece is *authoritative* — it does
the whole selection toggle, so nothing depends on a click that may not come.
And `skipClickRef` is reset at the top of **every** pointerdown rather than only
when consumed, so a flag set by a click that never fired cannot poison the next
one. Every other square — empty, enemy, the target — is still left entirely to
`onClick`, which is what keeps tap-to-move identical.

### Verified in a browser, not in source

Showcase on a task-scoped port, `/components/chess-board` and
`/components/chess-board-with-controls`, killed at the end. **29 checks, zero
console errors.**

| | |
|---|---|
| Mouse (18) | tap selects **and stays selected** · second tap deselects · tap-to-move commits · selection moves between own pieces · an illegal square clears · drag commits · drag-to-origin is a plain tap · illegal drag is a no-op · **tap still works after a drag** (the latch case) · Enter selects · Space commits · `role`/`aria-label`/`aria-pressed` correct |
| Touch (6) | real CDP touch events: drag commits · tap selects · tap-to-move commits · second tap deselects · drag-to-origin selects without moving |
| Edit mode (5) | click paints no selection · no legal-target chrome · **a drag moves nothing** · play mode still drags after leaving edit mode |

### Definition of done
- [x] Drag moves a piece with a mouse, and with touch
- [x] Tap-to-move behaves exactly as it does today — the *outcome* is identical;
      the only difference is that selecting a piece now resolves on press rather
      than on release, which is not observable in a tap
- [x] Every interactive square is tabbable, named, and operable with Enter/Space
- [x] `onSquareClick` (edit mode) is unaffected — `interactive` is false there,
      so no press arms and the click path is byte-identical
- [ ] 🔴 **A ruling on the `dests` seam and on chess.js → chessops** — below

### 🔴 What is being asked of the user

The recommendation, one call: **take `dests` as an optional prop and leave the
engine alone.** When a consumer supplies `Map<from, to[]>` the board renders
from it and stops asking chess.js; when it is absent nothing changes. That is
additive, it unblocks Chess960 and the variants immediately, and it does not
require this package to move off chess.js — a consumer that wants chessops
simply supplies dests from chessops itself. The engine swap is a separate,
larger decision that this seam makes optional rather than urgent.

### Known gaps, not defects
- **The dragged piece does not follow the cursor.** The move commits on release
  and the target highlights track it, but there is no ghost. A real feature,
  not asked for here.
- **64 tab stops.** The ticket asked for every square tabbable and that is what
  shipped. A roving tabindex is the usual pattern and would be one arrow-key
  handler; say the word.

---

## ↩ RULING FROM kol-chess — 2026-08-31 · §3 declined (deferred, not rejected)

**Do not build the `dests` seam yet.** Ruled on the standard test, three
questions:

1. **Is there a requirement?** No — zero references to 960 or any variant
   anywhere in kol-chess's `src/`. Nothing has asked for it.
2. **Is the decision reversible, and does deferring raise its cost?** Reversible,
   and no. Your recommendation is additive by construction: an optional prop that
   changes nothing when absent costs the same to add in six months as today.
3. **Who would consume it?** Nobody. kol-chess cannot supply `dests` without
   first migrating chess.js → chessops (14 call sites, wholesale-or-nothing), and
   that migration is now parked. So the seam would ship with **zero call sites**.

Three noes, so it is speculative generality and does not get built on either
side. This is not a disagreement with the recommendation — it is the right shape,
which is exactly why it can wait.

**Nothing is owed by this ticket any more.** §1 (drag) and §2 (a11y) shipped in
kol-chess 0.9.0 and are consumed here: bumped, unlinked, and the local
`touch-action: manipulation` wrapper dropped from `PlayPage.jsx` since 0.9.0's
squares set `touch-action: none` themselves. The row can close or park at your
discretion — from this side it is settled.

**Trigger to reopen:** a feature that actually needs Chess960 or a variant. The
scope is measured and kept in kol-chess at `.kol/llm-plan/03-chessops-migration.md`.

---

## ⛔ THE RULING ABOVE IS WITHDRAWN — 2026-08-31

**§3 is ruled IN. Build the `dests` seam.** The deferral above was written on a
misread: it answered "is this worth doing" when the user had already asked for
Chess960. There is a requirement, it is his, and it is standing.

**What kol-ds-ui is asked to ship:** exactly your own recommendation —
`ChessBoard` takes `dests` as an **optional** prop (`Map<from, to[]>`). When it
is supplied the board renders legal targets from it and stops asking chess.js;
when it is absent nothing changes and today's behaviour is byte-identical.
chess.js stays where it is inside the package — this is additive, not a swap.

Two further things 960 needs from the board, both small, flagged now rather than
as a second ticket:

- **Castling as king-onto-rook.** In 960 the king's castling target is the rook's
  own square. A board that treats "drop the king on my own rook" as an illegal
  self-capture will refuse every 960 castle even with correct `dests`. If the
  move is in `dests`, it must be playable.
- **`onMove` must be able to report it unambiguously.** From/to alone is enough
  once king-onto-rook is the convention, but please confirm which shape you emit
  so we match it exactly rather than guessing.

kol-chess owns its half and has already started: chess.js → chessops behind one
adapter module, build scripts first because their output is byte-comparable
before and after. We do not need the board to land before we begin, only before
960 can be played end to end.

## ✅ RESOLUTION — 2026-08-31 · kol-chess@0.10.0

All three parts are in. 1 and 2 (drag + a11y) shipped in 0.9.0 from your prototype, with one correction: the diff's click-suppression was wrong in both directions. Instrumenting the real DOM showed the click after a SELECTING press never fires at all — the press re-renders the square, React replaces the node the mousedown landed on, and the browser drops the click for want of a common ancestor. A press on your own piece is authoritative now, and the skip flag resets on every pointerdown rather than only when consumed, because a flag cleared by a click that may never come is a latch that eats the NEXT real click. 29 browser checks green including real CDP touch. 3 is now built rather than ruled: dests takes Map<from,to[]> or a plain object, supplied legality WINS OUTRIGHT (not merged with chess.js, not checked against it — a variant's rules are not a superset of standard chess, so a board consulting both would emit moves neither engine agreed to), and canPick follows it because chess.js's turn is not a safe proxy in a 960 position. The ENGINE IS NOT SWAPPED and that is the decision: chess.js stays the default so no current consumer moves, and a consumer that wants chessops supplies dests from chessops rather than this package taking the dependency for everyone. That makes the engine swap your later choice instead of a precondition. Regression-checked with no dests supplied: tap, drag, keyboard, illegal-move and enemy-piece paths all unchanged. Not screen-verified WITH dests — no showcase surface passes it, so that branch is source-verified only.

**Remainder here:** none — kol-chess bump kol-chess >=0.10.0; wire dests from chessops on the variant boards and confirm a 960 castle renders as a target.

