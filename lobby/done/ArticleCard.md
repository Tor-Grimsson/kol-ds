---
component: ArticleCard
source: kol-website — components/prose/cards/ArticleCardHero.jsx + ArticleCardMini.jsx + the Studystack band
staged: 2026-08-15
status: draft
deps: [kol-content]
---

# ArticleCard — one article listing card, three contexts

## The ask (user ruling 2026-08-15, kol-website session)

kol-website lists Stack articles in three places with two-and-a-half hand-built
cards: `ArticleCardHero` (the top row: thumbnail, category kicker, display-caps
title, mono excerpt), `ArticleCardMini` (compact list item), and the
"Studystack — latest writing" band (`CmsGlobal.jsx`, being renamed StackLatest)
composing both. Same card, same fields, different arrival dates:

> "article can be listed in the hero, in the main content with the filters, in
> the cms read-more card, right? its all same type of card"

Ship ONE `ArticleCard` in kol-content beside WorkCard/WorkListItem:

- Fields: `thumbnail` · `category` (mono kicker) · `title` · `excerpt` ·
  `date/meta` · `href`.
- **Variants**: `hero` (large, display title over/beside media) · `mini`
  (compact row) · `readmore` (the end-of-article suggestion shape).
- Casing authored at the call site; type classes threaded via the same
  `titleClassName`-style seams WorkListItem already ships.

## Reference implementations

`apps/web/src/components/prose/cards/ArticleCardHero.jsx` (× hero row + band),
`ArticleCardMini.jsx` (band), plus the filtered list on `routes/Stack.jsx` for
the third context. Screenshots of the band are in the site's Studystack section.

## What stays with kol-website

On ship: both local cards retire, StackLatest + Stack index re-declare on the
variants. Nothing else — the card is fully generic.

---

## Resolution — 🟢 closed 2026-08-15

Shipped in **`@kolkrabbi/kol-content@0.6.0`** (registry-verified).

**Most of this brief was already built.** `ArticleCard` already shipped in
kol-content with `default` / `hero` / `mini` — it collapsed three duplicate
components when the package was extracted, which is the same consolidation this
brief asks for. Reading the consumer confirmed the mapping rather than a gap:
`ArticleCardHero` with `variant="grid"` is `size="hero"` + `showHeader={false}`,
and the brief's `category` field is this component's `kicker`.

**Two things were genuinely missing:**

- **`size="readmore"`** — the end-of-article suggestion. Worth saying plainly:
  **it had no reference implementation.** The brief lists it beside two shapes
  that exist, but nothing in the estate had built it — there was nothing to
  recreate. So it is the family's own idiom rather than a port: mini's row, a
  `label` lead-in, and a trailing arrow that travels on hover using the same
  300ms clock hero's zoom already uses. **First real use should be reviewed
  against a design, since nothing validated this shape.**
- **The type seams the brief named** — `titleClassName`, `excerptClassName`,
  `kickerClassName`. They **REPLACE** the element's type class rather than
  stacking beside it, which is exactly what WorkListItem's `titleClassName` /
  `previewClassName` already do, and what the 2026-07-30 law requires: two
  equal-specificity type rules on one element let sheet load order decide.
  Colour, clamping and hover stay component-owned.

**Also fixed:** `key={i}` on the tag Pills and the hero meta row — the same
index-key defect the ArticleHeader audit raised against the consumer. It was
true here too. Keyed by value now.

19 gates clean.

**Remainder here:** none.
