# @kolkrabbi/kol-content


## 0.9.0 — 2026-08-26

- **BREAKING — the DS tier is a peer, not a dependency.** kol-component · kol-icons · kol-theme move from
  `dependencies` to `peerDependencies` with a `>=` floor (>=0.68.1 · >=0.18.0 · >=0.51.0).
  A 0.x caret in `dependencies` had pnpm nesting a private, stale copy of the tier
  under this package — a consumer bumped to kol-component 0.68.1 was still rendering
  this package's imports from the pinned line, so no DS fix since could reach those
  surfaces. The consumer now supplies ONE copy; the floor is the version this
  package's named imports were walked against. Same shape as kol-dashboards and
  kol-shell. Consumers: install the tier yourself and drop any `pnpm.overrides`
  forcing one copy.

## 0.8.1 — 2026-08-15

- `WorkViewToggle`'s search glyph is **16**, measured off the live
  kolkrabbi.io/work — not 20. 0.8.0 took the glyph size from the 20px OPTION
  icons instead of from the search itself. The live pairing is a 36 square with
  a 16 glyph: the search is deliberately a quieter affordance than the view
  toggle beside it.

## 0.8.0 — 2026-08-15

- `WorkViewToggle` pins its search to the chrome it actually sits in:
  `size="lg"` (the 36px square every sibling is) with `iconSize={20}` (the glyph
  every sibling carries). It had been relying on `SearchInput`'s hardcoded 36,
  which stopped being 36 when that component was moved onto the size ladder.

## 0.7.1 — 2026-08-15

- `WorkCard` and `WorkViewToggle` read `var(--kol-ease-house)` instead of
  hardcoding `cubic-bezier(0.16, 1, 0.3, 1)`. The token changed in kol-theme
  0.44.0 (expo → balanced), so these two now move with the house instead of
  holding the old curve.

> Started 2026-08-14 at 0.4.1 — earlier versions shipped without entries (that history
> lives in the repo's session logs). From here every publish adds an entry, and
> breaking or global-surface changes are flagged **BREAKING**.

## 0.7.0

### Minor Changes

- **`ArticleCard` → `ListingCard`** (ListingCardSpec, the consumer's geometry +
  scope + naming ruling, 2026-08-15). **BREAKING** flags inside, though every
  current import keeps working:

  - **Scope ruled WIDE** — this is THE listing card for any content type
    (articles, projects, prints, typefaces, tools); the name follows the role,
    not the content. `ArticleCard` remains as an alias **until the next major**.
    `WorkCard`/`WorkListItem` keep their own implementations for now — the spec
    converges the family on the neutral *name*, but folding WorkCard's distinct
    prop contract (type/year/description) into this one is a separate design
    pass, and aliasing it today would break every `/work` consumer.
  - **`size="readmore"` removed** (**BREAKING**, one day after it shipped) — the
    spec's ruling: it never rendered anywhere, and "read more" is a *context*,
    not a size. An end-of-article band renders `mini` cards with a `label`
    lead-in. Three presets remain: `hero` / `default` / `mini`.
  - **Geometry conformed to the spec's table** — hero excerpt clamp 3 → **2**;
    default excerpt gains **clamp 3** (it had none). 120×120 mini thumbnail and
    the rest confirmed as already correct. Breakpoint behaviour stays in the
    consumer by ruling — the card does no internal preset-swapping.

## 0.6.1

### Patch Changes

- **`ArticleCard size="readmore"` corrected — it had invented geometry.** Caught
  by the user the same day it shipped, and all three faults were mine:

  - A literal `→` **text character** as the affordance. Hours earlier this repo
    shipped `EmblaNav` (kol-component 0.41.0) specifically to end literal `‹`/`›`
    glyphs used as arrows in a system that ships an arrow set — and then this
    rendered one. It was the only rendered `→` in the package tree. Now
    `<Icon name="arrow-right" />`.
  - `w-[88px]` — a new magic number for a thumbnail, when `mini` already
    establishes 120×120 for the same role. Now mini's block verbatim.
  - A bespoke row. `readmore` is the same CMS card arriving in a third place, so
    it is **`mini`'s row in a bordered box** — same thumbnail, same text stack,
    same type — plus the `label` lead-in and the affordance. Not a third
    geometry, which is the entire point of a card family.

## 0.6.0

### Minor Changes

- **`ArticleCard` — the brief's variants, answered mostly by what already
  shipped.** The ask was one article card with `hero` / `mini` / `readmore`
  variants beside WorkCard/WorkListItem. `ArticleCard` already shipped here with
  `default` / `hero` / `mini` — the three contexts the consumer hand-builds — so
  only one variant was actually missing:

  - **`size="readmore"`** — the end-of-article suggestion: a full-width bordered
    row with `label` as lead-in, title, summary, meta and a trailing arrow that
    travels on hover. **It had no reference implementation**: nothing in the
    estate had built this shape, so unlike the other three it is the family's own
    idiom (mini's row, hero's hover language, one 300ms clock) rather than a port.
  - **`titleClassName` / `excerptClassName` / `kickerClassName`** — the type
    seams the brief named. They **REPLACE** the element's type class rather than
    stacking beside it, which is WorkListItem's established seam and the
    2026-07-30 law; colour, clamping and hover stay component-owned.

  Also fixed: `key={i}` on the tag Pills and the hero meta row — the same
  index-key defect the ArticleHeader audit raised, keyed by value now.

  Note for adopters: the grid context is `size="hero"` with
  `showHeader={false}` — that is what the consumer's `variant="grid"` did — and
  the brief's `category` field is this component's `kicker`.

## 0.5.0

### Minor Changes

- **`ArticleHeader` reconciled with kol-website's diverged twin** (167L local vs
  87L here, a 220-line diff). The verdict: **this package was already canon.**
  Almost the whole diff was app coupling deliberately removed when the component
  was de-Sanitized — four Sanity image-URL builders, the `reveal` entrance
  utility with its inline `--reveal-delay`, `kol-helper-14 uppercase` on the meta
  line (against the no-`text-transform` rule) and `kol-display-lg` where the
  prose role class belongs. None of that came back.

  Three real capabilities were genuinely missing here, and only those crossed:

  - **`authorImage`** — an author photo. The twin hand-rolled an `<img>` because
    `Avatar` did initials only; that is fixed in the atom (kol-component 0.40.0)
    and threaded through `AuthorLine`'s new `image` prop, so bylines, cards and
    work credits all gain it, not just this masthead.
  - **`heroImageSrcSet` / `heroImageSizes`** — responsive candidates passed
    straight to DS `Image`. The consumer builds the string; this package still
    resolves no URLs.
  - **`tagSize`** (default `md`) — the smaller Pill on narrow viewports. The
    twin achieved it by rendering the entire tag row **twice** behind
    `lg:hidden` / `hidden lg:flex`; one row with a size prop replaces both DOM
    copies.

  Also fixed: the tag row keyed by index. The audit raised it against the twin,
  and it was true here too — an index key re-uses a Pill's state across a list
  that reorders. Keyed by label now.

- **`AuthorLine`** gains **`image`** — a resolved author-photo src, forwarded to
  `Avatar`; falls back to the initial when absent or broken.
