# ListingCardSpec — the spec ArticleCardSizeSpec asked for

**Staged:** 2026-08-15 · from a kol-website session
**Change:** conform the card to this spec — geometry, presets, scope, name
**Answers:** kol-ds-ui's `ArticleCardSizeSpec` ticket (its outbox receipt syncs 🟢 on this filing)

---

## The rulings (user, 2026-08-15)

1. **Scope — WIDE.** The anatomy (thumbnail · kicker · title · excerpt · meta ·
   link) is generic listing anatomy; nothing in it is article-specific. This is
   THE listing card for any content type — articles, projects, prints,
   typefaces, tools. Article-only breeds a fork per domain, which is the rebirth
   pattern the anatomy arc exists to kill.
2. **Name — `ListingCard`.** Names the role, not the content, per the naming law
   (`kol-website docs/operations/01-workflow/04-component-naming.md`).
   `ArticleCard`/`WorkCard` stay as aliases until the next major so nothing
   breaks mid-migration; the family converges on the neutral name.
3. **Presets — THREE, not four. `readmore` is dropped.** It never rendered
   anywhere, the DS invented its geometry twice (0.6.0 → corrected 0.6.1), and
   its current shape is literally mini's. "Read more" is a **context, not a
   size**: an end-of-article band renders `mini` cards with a `label` lead-in.
   No fourth geometry exists.

## The geometry table

| Preset | Thumbnail | Title type | Excerpt clamp | Renders in |
|---|---|---|---|---|
| `hero` | 16/9, fluid | `kol-sans-heading-03` | 2 lines | top rows, lg+ side of dual-context bands |
| `default` | 16/9 fluid (3/4 opt-in) | `kol-mono-20` | 3 lines | filtered grids, all widths |
| `mini` | **120×120 fixed** | `kol-mono-14` | 2 lines | row lists, below-lg side of dual-context bands |

- **120×120 is confirmed as the ruling** for the fixed row thumbnail, not an
  accident of the first mini.
- **Clamps 2/3/2 confirmed** — grid cards carry 3 lines, row/band cards 2.
- **Breakpoint behaviour lives in the CONSUMER.** The context decides which
  preset renders at which width (today's StackLatest mini↔hero swap at `lg` is
  the correct pattern); the card stays presentational and does no internal
  preset-swapping. Baking swaps into the card couples it to one context's
  layout.
- **Type seams (`titleClassName` etc.) stay REPLACE-only overrides** — the
  table above is the default contract; seams are never load-bearing.

## Definition of done

- [ ] Card conforms to the table; `readmore` preset removed
- [ ] `ListingCard` export exists; `ArticleCard`/`WorkCard` alias it until next major
- [ ] Receipt back to kol-website with shipped versions

---

## Resolution — 🟢 closed 2026-08-15

Shipped in **`@kolkrabbi/kol-content@0.7.0`** (registry-verified).

All three rulings executed:

1. **Scope WIDE + renamed `ListingCard`** — the component is
   `src/ListingCard.jsx`, header rewritten to the role-not-content framing;
   `ArticleCard` is a barrel alias until the next major, so every current
   import keeps working.
2. **`readmore` removed** — one day after it shipped, per the ruling: "read
   more" is a context, not a size. Its dead `Icon` import went with it. Three
   presets remain.
3. **Geometry conformed to the table** — two real deltas found and fixed: hero
   excerpt clamped 3 → **2**, default excerpt gained **clamp 3** (it had
   none). 120×120 mini, 16/9 + 3/4 opt-in, type roles, REPLACE-only seams and
   consumer-owned breakpoint behaviour all confirmed already correct.

**One deviation from the definition-of-done, stated plainly: `WorkCard` is NOT
an alias.** Aliasing it today would break every `/work` consumer — its prop
contract (type/year/description, the row anatomy) is not this component's.
The spec's own framing is that the family converges on the neutral *name*;
folding WorkCard's anatomy in is a design pass this ticket's table doesn't
cover. The barrel comment records the intent so the next major picks it up.

19 gates clean.

**Remainder here:** none.
