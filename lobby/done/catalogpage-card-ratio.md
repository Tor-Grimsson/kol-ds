# catalogpage-card-ratio — `toCard` carries `fit` but not `ratio`, so every catalog is A4

**Filed:** 2026-09-03 ← **kol-client-olina**
**Package:** `@kolkrabbi/kol-shell@0.41.0` — `src/CatalogPage.jsx`
**Origin:** rebuilding olina's `/slide-deck` onto `CatalogPage`. A deck is a 1920×1080 stage and its cards render A4.

## The problem

`CatalogPage` renders the grid inline:

```jsx
<ContentCard variant="catalog" fit={c.fit ?? 'cover'} title={c.title} detail={c.detail}
             media={c.media} actions={c.actions} onClick={c.onClick} href={c.href}
             onNavigate={c.onNavigate} expanded={c.expanded} expandedContent={c.expandedContent} />
```

`ContentCard` takes a `ratio` prop and it is documented as overridable — `RATIOS`
supplies `catalog: '1 / 1.41421'` only as the variant's default. But `toCard`'s return
has no `ratio` key and `CatalogPage` never forwards one, so **every catalog page in the
estate is locked to A4** with no seam at any level: not per card, not per page, and not
through `filtersProps` (which reaches `ContentFilters`, not the cards).

Consumers that need another shape must abandon `CatalogPage` and hand-roll the grid,
which is the duplication it was shipped to end.

## Why per card, not per page

**`fit` already made this exact argument and won.** From `CatalogPage`'s own docstring:

> `fit` (`cover` default | `natural` | `compact`) is the card's media fit, PER CARD
> because one catalog mixes photographs (cover) and diagrams (natural) —
> CatalogPageCardFit, kol-monitor: a rack preview wider than the card lost its left
> rail to `cover`.

Same shape of need, same page. One catalogue mixes aspect ratios: olina's brand app has
a page rendering the same artwork at 1:1, 4:5 and 9:16 side by side, and a deck shelf
where every item is 16:9. A page-level prop would not cover the first case.

## The ask

Add `ratio` to `toCard`'s contract and forward it, exactly as `fit` is:

```jsx
<ContentCard variant="catalog" fit={c.fit ?? 'cover'} ratio={c.ratio} … />
```

Unset falls through to `RATIOS[variant]`, so every existing consumer renders
byte-identical. `ContentRow` takes no ratio, so the `list` branch is untouched.

The `toCard` contract line in the docstring gains one key:
`{ key, title, detail, media, actions, onClick, href, onNavigate, expanded, expandedContent, fit, ratio }`.

## Consumer status

kol-client-olina's `/slide-deck` is on `CatalogPage` as of 2026-09-03 and renders A4
cards for 16:9 decks. No workaround — the previous hand-rolled `ContentCollection` grid
could pass `ratio` directly and was retired to get onto the shipped page, so the only
alternative is going back to the duplication. The comment naming this ticket is in
`apps/brand/src/pages/SlideDeckManager.jsx`.

## ✅ RESOLUTION — 2026-09-03 · kol-shell@0.42.0

kol-shell 0.42.0 — `CatalogPage` forwards `ratio={c.ratio}` beside the `fit` that was already there; the `toCard` contract line names it. Unset falls through to the variant's A4, so nothing existing moves. Per card, not per page — `fit`'s own argument.

**Remainder here:** none — kol-client-olina bump kol-shell@0.42.0 (pin the number); return ratio from toCard on /slide-deck and retire the SlideDeckManager.jsx comment.

