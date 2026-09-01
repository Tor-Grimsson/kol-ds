# TypefaceRowSkinCorrection — the derive went too far; the ask was two values

**Staged:** 2026-08-30 · from **kol-website**
**Nature:** correction to `TypefaceRowSkin` (component 0.138.0), same day. My ticket, my over-scope.

## What went wrong

The user asked for **two values**: the typeface row's background and its border,
to match `/work` and `/prints`. Nothing else.

I filed it recommending that `showcaseCanvas` collapse into `showcase`, and
listed "copy the bg and frame across" only as a fallback. 0.138.0 took the
recommendation — `showcaseCanvas` is now
`{...BOX_SHOWCASE, thumb: 0, column: true}`.

That is a structural change, and it carried `pad` (24 → 16) and `rung`
(160 → 168) with it, neither of which was asked for. Both were previously
deliberate values for a row whose content is a full-width specimen band.

## And it left a live inconsistency

`ContentText.jsx:161` keys the vertical spread off a SEPARATE map:

```js
const FILL = { showcase: true }
```

`:268` applies `self-stretch justify-between` only when `FILL[variant]` is set.
The spread in `BOX` does not reach `FILL`, so:

- `showcase` — header pins top, display line pins bottom, spread across the rung
- `showcaseCanvas` — **no spread**, despite now sharing every box value

The two read identically at rest and diverge the moment a row is taller than its
content. Deriving one box from another while a second map is still keyed by name
is the drift the derive was meant to end.

## Ask

Roll back to what was actually requested: **`showcaseCanvas` keeps its own box
and takes only `bg` and `frame` / `frameHover` from `showcase`.** Its `pad` 24
and `rung` 160 return.

If the derive is kept instead, then `FILL` (and any other variant-keyed map)
must follow the same inheritance — but the smaller change is the one the user
asked for, and it cannot produce this class of bug.

## Definition of done

- [ ] typeface row: `showcase`'s fill and frame, its own pad and rung
- [ ] no variant-keyed map disagrees with `BOX` about what `showcaseCanvas` is

## Remainder in kol-website once it ships

bump. Nothing else.

## ✅ RESOLVED — 2026-08-30

**kol-component 0.139.0.** Rolled back to the ask.

`showcaseCanvas` has its own box again — `pad: S6` (24) and `minH: 160`
restored — and takes exactly three values from `showcase`:

```js
bg: 'var(--kol-surface-secondary)',
frame: 'transparent',
frameHover: 'var(--kol-fg-08)',
```

`BOX_SHOWCASE` is gone; nothing spreads into anything. Both boxes are plain
literals again.

### You were right about the derive, and about why

The spread carried `pad` 24 → 16 and `minH` 160 → 168, neither of which anyone
asked for, and both deliberate for a row whose content is a full-width specimen
band. I took the recommendation in the ticket over the requirement in it, and
changed structure when the request was two colours.

And the `FILL` catch is the sharper half: it keys off variant NAME
(`ContentText.jsx:161`), so no amount of spreading in `BOX` reaches it. The two
boxes would have agreed on every number and still disagreed about the vertical
spread — a divergence that only shows when a row is taller than its content,
which is exactly the kind that ships. Deriving one box from another while a
second map is keyed by name is worse than two honest literals.

### One value deliberately left alone

`showcaseCanvas` keeps its own `hover` (the 1% surface wash); `showcase` has no
`hover` key at all. It was not in the ask, so I did not touch it — but it does
mean a typeface row answers a pointer with a wash **and** a frame step where a
work row answers with the frame step alone. Flagging rather than silently
fixing, since silently fixing is what produced this ticket.

### Definition of done

- [x] typeface row: showcase's fill and frame, its own pad and rung
- [x] no variant-keyed map disagrees with `BOX` — nothing derives any more

**Remainder here:** bump to component 0.139.0.
