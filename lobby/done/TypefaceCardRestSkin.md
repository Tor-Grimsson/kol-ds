# TypefaceCardRestSkin — the typeface CARD's rest colours, and only those

**Staged:** 2026-08-30 · from **kol-website** (`/foundry`, GRID view)
**Nature:** two values. Deliberately scoped that way — see the note at the bottom.

## The ask

The typeface **card** takes `/work`'s rest background and border. Same change
just made to the row, now on the card.

**Rest state only. Hover is different and stays exactly as it is.**

## The two values

`ContentCard.jsx`, `BOX`:

| | `showcaseCanvas` (line 61) | `showcase` (line 57) |
|---|---|---|
| `border` | `var(--kol-fg-08)` | `var(--kol-fg-04)` |
| `bg` | `var(--kol-surface-primary)` | `null` |

**Change `showcaseCanvas`'s `border` and `bg` to `showcase`'s. Nothing else.**

Explicitly NOT in scope, all of which currently differ and must not move:

- `layout` — `canvas` vs `drawer`. The canvas overlay is the point of the variant
- `pad` — `--kol-pad-card-lg` vs `md`/`lg` responsive
- `height` — 500
- `RATIO` — `1 / 1.41421` vs `3 / 4`
- `REVEAL_BG` (line 78) — `surface-inverse`
- `MEDIA` / zoom
- every hover treatment

## Do not derive this one

`TypefaceRowSkin` asked for the row's two colours and was resolved by deriving
`showcaseCanvas` from `showcase`. That carried `pad` and `rung` along uninvited
and left `FILL` — keyed by variant name — behind, which took a second ticket
(`TypefaceRowSkinCorrection`, component 0.139.0) to undo.

Same trap here: `RATIO`, `REVEAL_BG` and `MEDIA` are all separate maps keyed by
variant name. A spread cannot reach them.

**Set the two values. Do not restructure.**

## Definition of done

- [ ] typeface card at rest: `showcase`'s border and bg
- [ ] its hover, layout, pad, height, ratio and reveal background are byte-identical to before

## Remainder in kol-website once it ships

bump.

## ✅ RESOLVED — 2026-08-30

**kol-component 0.140.0.** Two values, set by hand, nothing restructured.

```js
showcaseCanvas: { layout: 'canvas', border: 'var(--kol-fg-04)', bg: null,
                  pad: 'var(--kol-pad-card-lg)', height: 500 },
```

`border` fg-08 → **fg-04**, `bg` surface-primary → **null**. Everything you
listed as out of scope is byte-identical:

| | unchanged |
|---|---|
| `layout` | `canvas` |
| `pad` | `--kol-pad-card-lg` |
| `height` | `500` |
| `RATIO` | `1 / 1.41421` |
| `HOVER` / REVEAL_BG | `var(--kol-surface-inverse)` |
| `MEDIA` | no entry, as before |

No spread. Your warning was the right one and it is now written at the rule:
`RATIO`, `HOVER` and `MEDIA` are three separate maps keyed by variant NAME, so a
derive would have reached none of them — the same shape of bug `FILL` produced on
the row, which took `TypefaceRowSkinCorrection` to undo.

### Definition of done

- [x] typeface card at rest: showcase's border and bg
- [x] hover, layout, pad, height, ratio and reveal background unchanged

**Remainder here:** bump to component 0.140.0.
