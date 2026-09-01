# TypefaceCardRestSkinFix — I matched the card to the wrong reference

**Staged:** 2026-08-30 · from **kol-website** (`/foundry`, GRID)
**Nature:** correcting my own `TypefaceCardRestSkin` (0.140.0). Two values again — the right two this time.

## What I got wrong

The user's ask was: give the typeface **card** the same colour treatment just
approved on the typeface **row** — *filled, no border*. Rest state only.

`TypefaceCardRestSkin` instead copied `ContentCard`'s `BOX.showcase` values
(`border: fg-04`, `bg: null`), because that is the card entry sitting next to it
in the same map. But `showcase`'s CARD is a `drawer` — outlined, unfilled — and
looks nothing like `showcase`'s ROW, which is what the user was pointing at.

Result on `/foundry` GRID: every card is an outlined empty box, the exact
opposite of the rows beside them. 0.140.0 made it worse, not better.

## The correct two values

`ContentCard.jsx`, `BOX.showcaseCanvas` — take the **row's** rest skin:

| | now (0.140.0) | should be |
|---|---|---|
| `bg` | `null` | `var(--kol-surface-secondary)` |
| `border` | `var(--kol-fg-04)` | `transparent` |

That is `ContentRow`'s `BOX.showcase` / `showcaseCanvas` pair — filled surface,
no outline at rest.

## Unchanged, again

`layout: 'canvas'`, `pad: --kol-pad-card-lg`, `height: 500`, `RATIO`
(`1 / 1.41421`), `REVEAL_BG` (`surface-inverse`), `MEDIA`, and **every hover
treatment**. Do not derive — `RATIO`, `REVEAL_BG` and `MEDIA` are separate
name-keyed maps.

## The lesson, stated so it stops repeating

"Make the card look like the row" means **read the ROW's box**. Reaching for the
same-named entry in the card map is how this went out wrong: the two maps share
variant names but not treatments, and `showcase` means a filled row and an
outlined drawer card.

## Definition of done

- [ ] `/foundry` GRID cards are filled with no outline at rest, matching the rows
- [ ] hover, layout, pad, height, ratio, reveal bg unchanged from 0.140.0

## Remainder in kol-website once it ships

bump.

## ✅ RESOLVED — 2026-08-30

**kol-component 0.143.0.**

```js
showcaseCanvas: { layout: 'canvas', border: 'transparent',
                  bg: 'var(--kol-surface-secondary)',
                  pad: 'var(--kol-pad-card-lg)', height: 500 },
```

`bg` null → **surface-secondary**, `border` fg-04 → **transparent**. Verified
against `ContentRow`'s box directly, not by eye: the card's `bg` and the row's
`bg` are the same token, and the card's `border` and the row's `frame` are both
`transparent`.

Unchanged and checked: `layout: canvas`, `pad-card-lg`, `height: 500`, `RATIO
1 / 1.41421`, `REVEAL_BG surface-inverse`, `MEDIA` absent, every hover.

### Your lesson is now the comment on that line

*"Make the card look like the row" means READ THE ROW'S BOX. The two maps share
variant names and not treatments.*

That is the whole failure: 0.140.0 reached for `BOX.showcase` in the **card**
map because it was the entry next to the one being edited, and `showcase`'s card
is a `drawer` — outlined, unfilled — the opposite of `showcase`'s row. Same name,
inverted treatment. The ticket even said "same change just made to the row" and I
still read the neighbouring line instead of the row it named.

Worth stating plainly: 0.140.0 made `/foundry` worse than before it shipped.

### Definition of done

- [x] `/foundry` GRID cards filled, no outline at rest, matching the rows
- [x] hover, layout, pad, height, ratio, reveal bg unchanged from 0.140.0

**Remainder here:** bump to component 0.143.0.
