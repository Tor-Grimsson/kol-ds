# docstoc-rail-variant — `DocsToc` as a fisheye rail: a detented dial you can aim with

**Filed:** 2026-09-03 ← **kol-client-olina**
**Package:** `@kolkrabbi/kol-component@0.182.0` — `src/molecules/DocsToc.jsx`
**Built and running here:** `apps/brand/src/components/framework/FloatingToc.jsx` + `src/styles/floating-toc.css`

## What this is

`DocsToc` already owns this job — `toc: [{id, label}]`, `useScrollSpy`,
`onNavigate`, labels verbatim. What it has is one render: a flat list in a docs
sidebar. This asks for a **second render on the same contract**, as
`variant="rail"` (or a sibling that composes it — the DS's call):

A rail pinned to the page edge. One hairline per heading, label beside it,
**magnified under the pointer on a fisheye curve** — Bederson, *Fisheye Menus*,
UIST 2000 — with graduations between the headings so the lens has something
continuous to cross. It reads as a ruler and behaves as a dial.

## Why it is not just "DocsToc with different CSS"

Three behaviours, none expressible in a stylesheet over the current render:

**1 — the fisheye curve.** Each row's magnitude is
`m = exp(-((focus − rowCentre) / FALLOFF)²)`, written to the row as a CSS custom
property `--m`; every visual derives from it in CSS (`scale`, `opacity`, rule
width), so JS sets one number per row and the cascade does the rest. Gaussian
rather than linear: linear leaves a visible cone edge, this has none.

**2 — the lens SNAPS.** It never rests between two marks. It locks to the
nearest graduation and holds across that mark's whole band, so travelling the
rail is a run of discrete clicks rather than a smear that settles nowhere. The
user's test for it, verbatim: *"it doesn't feel like a 'wheel' you trust, like a
fine tune dial"* and then *"think about a lock picking thief, he counts the
ticks right"*. Snapping to the labelled rows only was tried first and rejected —
seven coarse stops, and it throws the ruler away. **The graduations are the
clicks; the labels are where the numbers happen to be printed.**

**3 — the graduations.** `MINORS` inert ticks between each pair of headings
(10 here). They carry the same `--m`, which is what makes the movement read as a
lens rather than rows blinking, and their even spacing gives the rail a scale —
seven bare strokes have none. They are `aria-hidden`, not links, no tab stop: a
screen reader wants the seven headings, not the seventy-seven marks.

## The numbers, as landed after the user's passes

| | value | why |
|---|---|---|
| `FALLOFF` (sigma) | 14px | measured against the TICK pitch, not the label pitch. Crosses 4–5 clicks. 84 swelled the whole column — that is a column getting bigger, not a lens moving |
| `MINORS` | 10 | the dial's resolution; a heading is worth ten clicks |
| tick pitch | 3px | ten per heading puts a section at ~52px, so a 13-heading page still stands inside a laptop viewport |
| label scale | `0.78 + 0.42·m` | rows must SHRINK away as well as swell toward. Grow-only reads as a bump, not a scrub |
| active label | `1 + 0.2·m`, `fg-96` | the heading you are in rests a size step above the rest, so the column reads with no pointer near it |
| rule width | `8 + 26·m` px, ticks `5 + 11·m` | graduations stay shorter than headings at every point of the curve |

## Two things that will bite whoever builds it

**`transform` does nothing on an inline element.** The label is a `<span>`; the
scale was silently ignored until `display: inline-block`. It cost us a round
trip with the user — *"you skip the font scaling"* — because opacity and width
worked and only the scale did not.

**Transitions must be OFF while the pointer drives.** The rail carries
`data-live` on pointer-enter and the CSS drops every transition under it; they
come back on leave so the wave settles instead of snapping. A 120ms ease on top
of a continuous input lags the cursor and reads as sluggish — that was the
user's *"not so fluid"*.

Also: measure row centres on enter and on resize, never per pointer-move, and
write `--m` inside one `requestAnimationFrame`. Reading geometry in a move
handler is what makes this pattern jank; so is seven React re-renders a frame to
animate seven numbers.

## The ask

1. `DocsToc variant="rail"` (default stays the flat list — no existing call moves), taking `minors` and `falloff` with the defaults above, and `position` for which edge it pins to.
2. It should render nothing below a consumer-set breakpoint, or leave that to the consumer — ours hides under `xl`, where the sidenav is the navigation and a second index is noise.
3. Heading discovery stays the CONSUMER's: we pass `toc` from the nav tree where the sidebar declares anchors, and read `<section id>` + its `<h2>` from the DOM where it does not. That is app knowledge and should not move into the package.

## Consumer status

Running locally, unshipped, named after this ticket in its header. On ship,
`FloatingToc.jsx` (≈120 lines) and `floating-toc.css` retire onto the variant
and this repo keeps only the `toc` derivation.

**One consumer, not two.** Flagging it against the bar this repo argued for in
`brand-book-mocks-two-consumers`: only `apps/brand` runs this today. It is filed
because it is a variant of a component the DS already owns, on a hook the DS
already ships — not a new surface — and because `DocsToc`'s existing consumers
are the obvious second home. If the DS would rather wait for a real second
consumer, that is a consistent answer and this repo will keep the fork.

## ✅ RESOLUTION — 2026-09-03 · @kolkrabbi/kol-component@0.188.0

Built as you specced it. `DocsToc variant="rail"` — default stays the flat list, so no existing call moves.

Your one-consumer flag: taken, and the answer is build it. This is a second render on a contract the DS already owns, driven by a hook the DS already ships — not a new surface. That is a different case from a client's own component set, and the bar this repo argued in brand-book-mocks was about surfaces, not variants. You flagged it correctly and it did not need to hold.

All three behaviours are in, because you were right that none is a stylesheet over the flat render:
- The gaussian: `exp(-((focus − centre)/falloff)²)` written to each row as `--m`, one number per row, every visual derived from it in CSS.
- The detent on EVERY graduation, not the labels — the lens locks to the nearest mark and holds across its band. Your lock-picker line is in the component header verbatim, as is why snapping to the seven labels was rejected.
- The graduations carrying the same `--m`, `aria-hidden`, no tab stop, none after the last heading.

Numbers landed as filed: FALLOFF 14, MINORS 10, tick pitch 3px, label `0.78 + 0.42·m`, active `1 + 0.2·m` at fg-96, rules `8 + 26·m` and ticks `5 + 11·m`. Props: `minors`, `falloff`, `position` ('left' mirrors the whole thing — origin, padding and row direction), `minSections` (default 2, so a one-section page renders nothing), `ariaLabel`, and `className` for your breakpoint. Both of your gotchas are in the source next to the lines that fix them: `display:inline-block` on the label, and transitions dropped under `data-live`.

ONE THING I CHANGED: the label is `kol-mono-14`, not `kol-helper-12`. `pnpm validate:rails` R1 caught it — a kol-helper-* class inside rail chrome is a second row ramp, which is the exact drift that gate was written for, and the rail law is one voice. The fisheye scales FROM the rung rather than replacing it, so the curve is untouched. If 14 reads too heavy under the lens on your pages, say so and it goes to the rail law in the docs first, not quietly into the component — but I would rather you see it at 14 before deciding.

Heading discovery stayed yours, as asked: `toc` is the contract for both variants and nothing about `<section id>` or `<h2>` moved into the package.

Shipped: kol-component 0.188.0 + kol-theme 0.142.0 (the chrome is `.kol-toc*` in kol-components-molecules.css, and it must be — every rule reads `--m` through calc(), which no utility expresses). 26 gates clean, showcase builds. On bump, FloatingToc.jsx and floating-toc.css retire and you keep only the toc derivation.

**Remainder here:** none — kol-client-olina bump kol-component to 0.188.0 + kol-theme to 0.142.0, then retire FloatingToc.jsx and floating-toc.css onto variant="rail".

