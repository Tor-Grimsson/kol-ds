# TypefaceRowSkin — the typeface row wears a different skin from every other listing

**Staged:** 2026-08-30 · from **kol-website** (`/foundry`)
**Nature:** visual inconsistency between `showcaseCanvas` and `showcase`. User ruling, and he does not want it round-tripped.

## The ask, plainly

`/foundry`'s rows must look like `/work`'s and `/prints`' rows. **User: "I want it
to visually have the same look as those pages — I don't care if it's by using the
same row variant or adjusting the typeface row variant."**

## The diff

Identical information architecture — name top-left, classification + year
top-right (`meta` + `date`), the big line below. Only the skin differs:

| | `showcaseCanvas` (typefaces) | `showcase` (work · prints) |
|---|---|---|
| background | `transparent` | `var(--kol-surface-secondary)` |
| frame at rest | `var(--kol-fg-08)` | `transparent` |
| frame on hover | `fg-24` | `var(--kol-fg-08)` |
| pad | 24 | 16 |
| rung | 160 | 168 |

So typefaces wears an outline with no fill; the others wear a fill with no
outline. Side by side they read as two different systems.

## Preferred fix — collapse, don't sync

`showcase` with **`thumb={0}`** already produces the typeface arrangement: no
thumb, name top-left, class/year top-right, the specimen full-width below. That
is the whole reason `showcaseCanvas` exists — and if a prop already expresses it,
the variant is redundant.

**Ask (preferred):** `kol-foundry`'s `TypefaceLibraryGridWithVariables` renders
`variant="showcase" thumb={0}` instead of `variant="typeface"`, and
`showcaseCanvas` retires. One variant serves all three pages, and the skins
cannot drift again because there is only one.

**Fallback**, if the column layout genuinely cannot be reached that way: copy
`showcase`'s `bg` and `frame`/`frameHover` onto `showcaseCanvas`. That fixes the
look but leaves two boxes to keep in sync forever, which is how this happened.

Either is acceptable to the user. Pick one and ship it — he explicitly does not
want this coming back as a question.

## Note on where the call site lives

kol-website cannot do this from here: the row is rendered inside kol-foundry's
`TypefaceLibraryGridWithVariables`, which hardcodes `variant="typeface"` and
exposes no seam for the box. That is why it is filed rather than fixed locally.

## Definition of done

- [ ] `/foundry`'s rows render with the same fill and frame behaviour as `/work`
- [ ] one variant, or the two boxes reconciled with a note saying why both exist
- [ ] kol-website needs no local CSS for it

## Remainder in kol-website once it ships

bump. Nothing else — the call site is the package's.

## ✅ RESOLVED — 2026-08-30

**kol-component 0.138.0.** The preferred fix, one adjustment to how it was
reached.

`variant="showcase" thumb={0}` alone does **not** produce the typeface
arrangement — the full-width band under the text comes from a `column` box flag,
not from the absence of a thumb. So the two boxes could not simply collapse to
one key.

Instead the skin collapsed and only the arrangement stayed:

```js
const BOX_SHOWCASE = { thumb: 'fill', pad: S4, frame: 'transparent',
                       frameHover: 'var(--kol-fg-08)',
                       bg: 'var(--kol-surface-secondary)', minH: 168, … }

showcase:       BOX_SHOWCASE,
showcaseCanvas: { ...BOX_SHOWCASE, thumb: 0, column: true, align: 'items-start' },
```

Every value in your diff table now comes from one object — fill, frame at rest,
frame on hover, pad and rung. They **cannot** drift again, because there is one
set of numbers rather than two that agree. `/foundry` gets `surface-secondary`
with a transparent frame stepping to `fg-08` on hover, exactly as `/work` and
`/prints` do.

The `column` flag stays because it is the one real difference: no thumb, and the
specimen band stacks under the text rather than sitting beside it. That is the
whole reason the key exists, and it is now the only thing the key says.

`kol-foundry` was **not touched** — `variant="typeface"` still aliases to this
box, so the call site keeps working and there is nothing to migrate.

### Definition of done

- [x] `/foundry` rows render with `/work`'s fill and frame behaviour
- [x] the two boxes reconciled — one derives from the other
- [x] no local CSS needed in kol-website

⚠️ Source-verified only — the showcase renders `showcaseCanvas` but I did not
put the two pages side by side. Your bump is the visual check.

**Remainder here:** bump to component 0.138.0.
