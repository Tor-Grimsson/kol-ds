# ContentTextTagsSlotRendersRawArray — the tags slot prints a joined string, not tags

**Filed:** 2026-09-01 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` — `src/molecules/ContentText.jsx:226`
**Origin:** user's own phone shot of `/` at 23:17, reported as "tags are broken and in the wrong font". Two symptoms, one cause.

## The problem

`line()` renders every slot the same way:

```js
const line = (slot) =>
  values[slot] == null ? null : (
    <div key={slot} className={`${overrides[slot] ?? ramp[slot] ?? ''}…`}>{values[slot]}</div>
  )
```

For every other slot `values[slot]` is a string. For `tags` it is an **array of
strings** — and React renders an array of strings as adjacent text nodes with no
separator. So `['vcap','plugin','chrome','recorder','headless']` renders as:

```
vcappluginchromerecorderheadless
```

The ramp for the slot is `tags: 'flex flex-wrap gap-2'` (`:64`, `:65`, `:72`, `:83`,
`:92`). That is correct markup for a row of tag ELEMENTS — but text nodes are not
flex items, so `gap-2` spaces nothing, and the class carries no type class, so the
bare text inherits from the section and lands in **system sans** beside correctly
typed siblings.

Both reported symptoms — the run-on string and the wrong font — are this one line.

## Where it shows

`ContentCard variant="article"`, whose order puts tags first
(`ORDER.article.card = ['tags', 'eyebrow', ['stack','title','body'], …]`, `:136`) —
so it is the first thing under the thumbnail and reads as a headline. Seen on
kol-website `/` (StackLatest) on three cards. Every variant whose order includes
`tags` has the same defect; `showcase`'s row (`:149`) carries tags too.

## The ask

Render the `tags` slot as one element per tag inside the existing flex container,
so `gap-2` applies and each tag carries a type class. `Tag` is the DS's own atom
and the obvious candidate, but the choice of element and its voice is the DS's
call — the guarantee wanted is: **an array-valued slot never renders as
concatenated text.**

Worth a glance at whether any other slot can receive an array (`meta` takes an
array at some call sites — kol-website passes `meta={[publishDate, readingTime]}`).

## Remainder here once it ships

bump; no consumer change — kol-website already passes `tags={article.tags}` as an
array of strings, which is the documented shape.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.150.0

An array-valued slot never renders as concatenated text: strings in the tags slot render as the tertiary Tag chip (kol-tag--tertiary kol-tag--sm — the voice the estate's correct tag rows already wear; pre-built elements pass through untouched), and any other slot's array (meta=[date, readingTime]) gets one span per item on a flex-wrap gap-2 seam. Root cause was React writing adjacent strings as text nodes and CSS folding contiguous text into ONE anonymous flex item — gap spaced nothing, type inherited the section's sans.

**Remainder here:** none — kol-website bump kol-component@0.150.0; no consumer change — tags={array of strings} is the documented shape.

