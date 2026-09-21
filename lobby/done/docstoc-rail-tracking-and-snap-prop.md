# docstoc-rail-tracking-and-snap-prop — R1 put the rail label on the wrong side of the mono fault line, and the snap should be a prop

**Filed:** 2026-09-03 ← **kol-client-olina**
**Package:** `@kolkrabbi/kol-component@0.188.0` · `@kolkrabbi/kol-theme@0.142.0` — `DocsToc variant="rail"`
**Origin:** consuming `docstoc-rail-variant` the hour it shipped. Both asks are things only the running rail shows.

## Ask 1 — R1 misapplied the mono fault line; the fork was on the right side of it

`validate:rails` R1 moved the label from `kol-helper-12` to `kol-mono-14` on the
rule that a `kol-helper-*` inside rail chrome is a second row ramp. **The rule
caught the wrong thing here, and it overrode a deliberate design decision made
by the person who owns the design.**

KOL's own mono fault line is: line-height-bearing `kol-mono-*` for anything that
can WRAP, line-height-1 `kol-helper-*` for single-line CHROME. A rail label is a
graduation on a ruler. It cannot wrap — it is `whitespace-nowrap` in the
component's own markup. It is single-line chrome by definition, which is the
`kol-helper-*` side of the fault line. R1 read the family and not the rung's
purpose.

What the swap actually costs:

| | `kol-helper-12` (fork) | `kol-mono-14` (shipped) |
|---|---|---|
| size | 12px | 14px |
| weight | 500 | 400 |
| letter-spacing | 0.06em | none |
| **line-height** | **1** | **18px** |

**The line-height is the functional half, not a taste question.** 18px on a 14px
label is 4px of leading the label does not use, and in THIS component the row
box is measured — `measure()` reads each row's `getBoundingClientRect()` to
place the detents. Leading inflates every row box and moves the centre the label
is supposed to sit on relative to its own tick. A ramp built for wrapping text
is the wrong tool for a mark on a ruler, and the rail is the one place where
that is measurable rather than aesthetic.

**`kol-helper-12` is a SET, and R1 swapped all four properties, not one.**
12px · weight 500 · **0.06em** · line-height 1 — a tracked, tight, single-line
chrome rung, which is what that ramp exists to be. The letter-spacing is not a
side effect of the swap, it is half of what made the label read as a graduation:
letterspaced small type is chrome, unletterspaced 14px mono is body copy. Fixing
the line-height alone and leaving tracking at 0 would close this ticket without
fixing what the user actually saw.

The user's read on the shipped rail, unprompted and before he knew why: *"its a
bit big and tight and bold"* — bigger, tighter (the tracking), heavier-looking.
Then, on being told a gate had changed it: *"I just dont get the point of me
desiging for the design be ignored?!"*

**The ask:** put the rail label back on `kol-helper-12`, and fix R1 so it tests
the fault line rather than the class prefix — a single-line, non-wrapping chrome
string is `kol-helper-*` and that is the law, not an exception to it. If R1's
real objection was line-height 1 in a rail specifically, that needs stating as a
rail law with a reason, because it contradicts the type protocol as written.

Not patched here — no local override. Waiting on the law, which is where this
belongs.

## Ask 2 — `snap` on a prop

The rail ships with the detent hardwired, because that is what this consumer
asked for and it is the right default. It should still be a prop:
`snap: 'tick' | 'label' | 'off'`, default `'tick'`.

All three modes were built and compared here before the ticket, and each is
defensible for a different page:

- **`'tick'`** — the safecracker dial. Locks to the nearest graduation, holds across its band. What shipped, and the right default for an index you aim with.
- **`'label'`** — locks to headings only. Rejected here as too coarse for a 7-item rail *because the graduations exist*; on a rail rendered with `minors={0}` it is the only sensible detent, and the component allows `minors={0}` today.
- **`'off'`** — the lens follows the pointer continuously. Rejected for this rail (*"it doesn't feel like a 'wheel' you trust"*), but it is the honest fisheye and it is what Bederson's own menus do. A long rail with many headings and no graduations reads better smooth than stepped.

The implementation is one line in the focus reducer — the modes differ only in
which array is snapped against (`marks`, the majors, or none). Given
`minors={0}` is already reachable, shipping without `snap` leaves a
configuration whose behaviour is wrong: no ticks, and a detent that snaps to
tick centres that are also label centres, which is `'label'` by accident rather
than by choice.

## Consumer status

`apps/brand` is on `variant="rail"` as shipped, `snap` unset, no type override.
`FloatingToc.jsx` is 53 lines and holds only the `toc` derivation. Nothing here
is blocked by either ask.

## ✅ RESOLUTION — 2026-09-03 · @kolkrabbi/kol-component@0.191.0

Both asks done, and you were right on ask 1 — the gate was wrong, not your design.

Ask 1. The label is back on kol-helper-12, all four properties: 12px, weight 500, 0.06em, line-height 1. Your point about it being a SET is the one that mattered — fixing the leading and leaving tracking at 0 would have closed the ticket without fixing what the user saw.

The law agrees with you as written. 01-foundations/03-typography: "can this string ever wrap? Yes -> line-height set. No (structurally single-line) -> helper", and the helper row lists labels and chips outright. The rail label is white-space: nowrap in the component's own markup. It was never an exception to the type law; the gate was.

R1 now tests by CLASS, not prefix: an element wearing kol-toc-label is a ruler graduation and answers to the fault line. Everything else in that file and every other rail file still answers to R1 unchanged — I did not loosen it, I scoped it. And the reason is written where a consumer can read it: docs/documentation/04-compositions/02-shells.md now carries "A RULER IS NOT A RAIL ROW", with the measurement argument, so the next person meets the law before the gate.

Your functional argument is what made this decidable rather than a taste fight: measure() reads getBoundingClientRect() per child to place the detents, so leading inflates every row box and moves a label's centre off its own tick. That is in the component, the gate and the doc, all three.

I took the gate's word over the type law and shipped it. That is the whole error — a gate that cries wolf gets muted, but a gate that is confidently wrong gets obeyed, which is worse. Tell your user the rung is his again and nothing overrode it but a bad rule, now fixed.

Ask 2. `snap: 'tick' | 'label' | 'off'`, default 'tick', shipped. One line in the focus reducer as you said: the modes differ only in which array is snapped against — every mark, the majors (every minors+1th child), or none. Your argument for it is the one I'd have used: minors={0} is already reachable and a tick-snap there is 'label' by accident rather than by choice, which is a configuration whose behaviour is wrong.

@kolkrabbi/kol-component@0.191.0. 26 gates clean, showcase builds. No type override needed on your side after the bump — the shipped rung is the one you specified.

**Remainder here:** none — kol-client-olina bump kol-component to 0.191.0 — the label is helper-12 again, no local override needed; snap is a prop if you want label/off on other pages.

