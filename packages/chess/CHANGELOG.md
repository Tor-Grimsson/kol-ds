# @kolkrabbi/kol-chess

> Started 2026-08-14 at 0.6.0 — earlier versions shipped without entries (that history
> lives in the repo's session logs). From here every publish adds an entry, and
> breaking or global-surface changes are flagged **BREAKING**.

## 0.10.0 — 2026-08-31

- **`ChessBoard dests` — legality from outside.** `Map<from, to[]>` (a plain
  object works too), the shape chessops' `chessgroundDests()` already returns.
  Supply it and the board stops asking chess.js anything: these squares can be
  picked up, those are their targets. Omit it and nothing changes.
- This is what made Chess960 and the variants unreachable in PRINCIPLE rather
  than merely unimplemented — the board was renderer AND rules engine, so no
  prop, wrapper or CSS could reach the decision, and chess.js has no castling in
  a 960 position and no variant rules to offer.
- **Supplied legality wins outright** — not merged with chess.js, not checked
  against it. A variant's rules are not a superset of standard chess, so a board
  consulting both would emit moves neither engine agreed to.
- `canPick` follows it: with `dests` the authority is "does this square have
  targets", because a variant may allow a piece the side-to-move test would
  refuse and chess.js's own turn is not a safe proxy in a 960 position.
- **The engine is NOT swapped.** chess.js stays the default so every current
  consumer is untouched; a consumer that wants chessops supplies dests FROM
  chessops rather than this package taking the dependency for everyone. That
  makes the engine swap a later choice instead of a precondition.
  (ChessBoardInputAndVariantSeam §3, kol-chess)

## 0.9.0 — 2026-08-31

- **`ChessBoard interactive` takes three gestures, not one.** It had a single
  input — `onClick` on a bare `<div>` — so there was no drag (the primary
  gesture on lichess and chess.com, and near-only on a phone) and no keyboard
  or screen-reader access at all.
  - **Drag** on pointer events, not HTML5 drag-and-drop: `dragstart`/`drop`
    never fire on touch, so an HTML5 version would have added drag for exactly
    the devices that already worked. One path for mouse, touch and pen, with
    `setPointerCapture` so the release still lands when the finger leaves the
    square it started on, and `touch-action: none` so the scroller cannot
    steal the gesture.
  - **A square is a control**: `role="button"`, a tab stop, `aria-label`
    ("e2, white pawn" / "e4, empty, legal move"), `aria-pressed` carrying the
    selection the class already showed, and Enter/Space running the move.
  - Tap-to-move is unchanged, and all three gestures commit through the same
    `legalTargets` map — one legality lookup on the component, not two.
- ⚠️ **The click after a selecting press does not fire**, which is why a press
  on your own piece is authoritative here. Measured in Chromium: the press
  re-renders the square, React replaces the node the mousedown landed on, and
  a browser with no common ancestor for mousedown and mouseup drops the click
  entirely. Nothing on this board may depend on that click arriving.
- Not changed: `onSquareClick` (edit mode) still bypasses selection, and now
  the drag too — `interactive` is false there, so no press ever arms.
- Still open: the board is its own rules engine, so legality cannot be supplied
  from outside and Chess960 and the variants remain unreachable. That is the
  `dests` seam, and it is a design call, not a bug.

## 0.7.0 — 2026-08-26

- **BREAKING — the DS tier is a peer, not a dependency.** kol-component · kol-icons · kol-theme move from
  `dependencies` to `peerDependencies` with a `>=` floor (>=0.68.1 · >=0.18.0 · >=0.51.0).
  A 0.x caret in `dependencies` had pnpm nesting a private, stale copy of the tier
  under this package — a consumer bumped to kol-component 0.68.1 was still rendering
  this package's imports from the pinned line, so no DS fix since could reach those
  surfaces. The consumer now supplies ONE copy; the floor is the version this
  package's named imports were walked against. Same shape as kol-dashboards and
  kol-shell. Consumers: install the tier yourself and drop any `pnpm.overrides`
  forcing one copy.
