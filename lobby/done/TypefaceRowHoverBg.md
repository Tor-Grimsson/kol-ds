# TypefaceRowHoverBg — delete one key: the typeface row's hover background

**Staged:** 2026-08-30 · from **kol-website** (`/foundry`, LIST)
**Nature:** one key. Third and final pass on this row — see the note.

## The defect

`/work` and `/prints` rows change **only their border** on hover. The typeface
row changes its border *and* washes its background, so hovering it reads as a
different interaction from every other listing on the site.

`ContentRow.jsx`, `BOX.showcaseCanvas`:

```js
frameHover: 'var(--kol-fg-08)',
hover: 'color-mix(in srgb, var(--kol-surface-on-primary) 1%, transparent)',   ← this
```

`BOX.showcase` has `frameHover` and **no `hover` key at all**. That is the
difference.

## Ask

**Delete the `hover` key from `showcaseCanvas`.** Nothing else — `frameHover`
stays, the rest state stays exactly as `TypefaceRowSkinCorrection` left it.

## Why this is a third ticket

The user asked once for "background and border like work and prints". It has
taken three passes because each ticket named only what I had looked at:

1. `TypefaceRowSkin` — rest colours. Resolved by deriving the whole box, which
   moved `pad` and `rung` and missed `FILL`.
2. `TypefaceRowSkinCorrection` — undid the derive, fixed the rest state.
3. this — the hover background, which neither ticket mentioned.

**The lesson for the next one: when a user says "make X look like Y", diff every
state, not the one in the screenshot.** Rest, hover, selected, focus.

## Definition of done

- [ ] hovering a typeface row changes the border and nothing else
- [ ] its rest state is unchanged

## Remainder in kol-website once it ships

bump.

## ✅ RESOLVED — 2026-08-30

**kol-component 0.141.0.** The `hover` key is deleted. `frameHover` stays, the
rest state is untouched — `pad: S6`, `minH: 160`, `bg: surface-secondary`,
`frame: transparent` all verified unchanged.

A typeface row now answers a pointer with a border step alone, same as `/work`
and `/prints`.

### The lesson is taken, and written into the source

Your closing note is the useful part of this ticket, so it is now a comment on
the box itself rather than only in a lobby file: *when a user says "make X look
like Y", diff every state — rest, hover, selected, focus.*

Worth adding on my side: I flagged this exact key in
`TypefaceRowSkinCorrection`'s resolution — *"a typeface row answers a pointer
with a wash AND a frame step where a work row gives the frame step alone"* — and
then left it, because it was not in that ask. Flagging a known divergence and
shipping anyway is only marginally better than missing it. The right move was to
say "this is the same defect, one key, shall I take it now" in the same breath.

### Definition of done

- [x] hovering a typeface row changes the border and nothing else
- [x] rest state unchanged

**Remainder here:** bump to component 0.141.0.
