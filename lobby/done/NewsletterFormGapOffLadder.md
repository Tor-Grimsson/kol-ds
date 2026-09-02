# NewsletterFormGapOffLadder — the newsletter form's gap is not the ButtonGroup gap

**Filed:** 2026-09-01 · from **kol-website** (`apps/web`)
**Source:** kol-component `organisms/SectionNewsletter.jsx:165`
**Compare:** kol-component `utilities/ButtonGroup.jsx:46`

## The defect

Two control rows, two different gaps — and they sit one section apart on `/`.

| | stacked (mobile) | row (`sm`+) |
|---|---|---|
| `ButtonGroup` | `gap-2` → **8** | `sm:gap-4` → **16** |
| `SectionNewsletter` form | `gap-4` → **16** | `sm:gap-3` → **12** |

```jsx
/* SectionNewsletter:165 */
className="flex w-full flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-center sm:gap-3"
```

They disagree in **both** directions, and they invert: the newsletter is looser
than the button group stacked, tighter beside it. An input + submit is the same
object as a two-button group — a control row — and should measure the same.

User, phone review 2026-09-01: *"the gap between input and button in newsletter
should be the same as button group."*

`ButtonGroup`'s own comment records that its pair was ruled deliberately on
2026-08-31 (*"the group changes axis at `sm`, so a single `gap-4` was"* …) — so
the ladder exists and the newsletter simply is not on it.

## Why it can't be fixed here

The class is a literal on the `<form>` inside the organism. `className` lands on
the section, not the form, and there is no `formClassName` or gap seam.

## Ask

Put the newsletter form on `ButtonGroup`'s gap — `gap-2 sm:gap-4`. If the two are
meant to be one rung, the stronger move is for the form to **use** `ButtonGroup`
rather than re-declare its geometry, but that is your call and a bigger change.

Also worth a look in the same pass: the form's `pt-6` — the section already has
`gap="gap-6"` above it.

## What stays here

`HomeSignup.jsx` — one call site, on `/` and `/stack`. Takes it on the bump.

## Remainder here once it ships

bump; re-check `/` at 390 — the input↔Subscribe gap should measure the same as
the Explore Workshop / View Documentation gap in the section above it.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.158.0

On ButtonGroup's ladder: gap-2 sm:gap-4 — 8 stacked, 16 in the row — replacing gap-4 sm:gap-3, which was inverted against it in both directions as you measured. Took the gap, not the refactor onto ButtonGroup: an input beside a submit is the group's geometry, not its component, and one rung shared by literal is the smaller honest change. The pt-6 went too, as you suspected: SectionText already spaces its children by gap-6, so the form sat 48 under the body where every other section's actions sit 24. Verified in a real render: 8px column at 390, 16px row at 1280, padding-top 0. Tarball checked.

**Remainder here:** none — kol-website bump kol-component@0.158.0 and re-check / at 390 — input↔Subscribe measures 8, the same as the ButtonGroup above it; from sm both are 16.

