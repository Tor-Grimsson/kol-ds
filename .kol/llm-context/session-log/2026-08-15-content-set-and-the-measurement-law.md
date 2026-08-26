# Session: the Content Set, and the day guessing got banned

**Date:** 2026-08-15
**Agent:** Grim (Haiku 4.5)
**Summary:** Closed the `default` ContentCard variant, built the other five,
built the collection comparison and the `Content Set` surface — then spent the
back half on a filter/search row that took eleven rounds because I kept
approximating values I could have measured.

## What shipped

theme **0.44.0 → 0.48.0** · component **0.47.0 → 0.66.0** · content **0.7.1 →
0.8.1** · shell **0.5.0 → 0.6.1** · icons **0.18.0** · dashboards **0.2.3**

- **The five variants built** — catalog · print · article · work · typeface,
  each read off its shipped component and the live page it renders on.
- **`ContentCollection`** — both forms are grids, `list` is ONE full-width
  column, the count derives from the wall's own width (the card-wall law), gap
  defaults per form from `--kol-gap-wall-{grid,list}`, track minimums in PX.
- **The Content Set** — the review surface renamed for the whole composition:
  ContentFilters → ContentCollection → ContentCard/ContentRow, all six variants
  behind a picker, "As a page" by default with the shipped side behind a toggle.
- **The house curve is balanced**, not easeOutExpo, and seven hardcoded sites
  read the token. `.kol-expand` carries the expand motion as chrome.
- **The display rungs are 500 with 0.04em tracking** — all three sat a weight
  above the heading family they open.
- **`PageHeader` had NO TYPE**: `kol-heading-sm` has no rule anywhere in
  kol-theme, so every page title in every shell app rendered as a browser
  default h1. Now a `size` scale + an eyebrow slot.

## THE LAW THIS SESSION PRODUCED

**HIS INSTRUCTION BEATS THE SCREENSHOT. THE SCREENSHOT BEATS MY TABLE. A
MEASUREMENT BEATS MY EYE.**

Every expensive round came from inverting that:

1. He ruled the filter labels UPPERCASE. I saw a sentence-case label in a live
   screenshot and overrode him. Twice.
2. He said twice to use Tag chips in the work row. I read the live page, saw
   plain text, and reversed him.
3. I reported "delta empty" against numbers I had DERIVED — I read the search
   glyph size off the OPTION ICONS beside it (20) instead of off the search
   itself (16). **A measurement of the wrong element is still a guess.**

## The structural finding

**The square and the glyph are SEPARATE decisions.** They were welded to one
`size` prop, so reproducing any shipped surface forced a wrong number
somewhere: `/work` is 36/16, the filter row is 32/16, the media control is
32/20. None is a ladder rung pair and all three are correct. `iconSize` and
`fieldHeight` are the seams that make them expressible.

## Defects found by measuring, not looking

- **No card or row hover had EVER fired** — `background`/`borderColor` were set
  inline, and an inline style outranks any class.
- **A clipped icon never opened** — `style={{ width: 0 }}` beat
  `group-hover:w-[20px]`. Same cause.
- **`border-color: var(--undefined)` resolves to `unset`, which INHERITS** —
  that is how the `default` row's hairline divider rendered as a solid white
  rule.
- **The exit-snap**: a `delay` on a BASE class is inherited by the exit, so the
  glyph finished retracting 200ms after the fade had hidden it.
- **`SearchInput` ran two type systems and two glyph systems** in one file.
- **`Divider` vertical hardcoded `self-stretch`** ahead of `className`.
- **`ContentFilters` hand-rolled its own search field** instead of using
  `SearchInput`.

## Known issues

- ⚠️ **Nothing is retired.** All ten absorbed components still export, none
  deprecated, no consumer migrated. `GridCard` still names two unrelated DS
  components across ~70 call sites.
- ⚠️ The `TRACKS` minimums in the set are my derivation from each variant's box,
  not a ruling.
- ⚠️ The `['line']` render kind is gone but `RAMP.print.row` / `BOX.print` are
  now dead — print's row renders `variant="catalog"`.

## Next

1. The retirement wave — deprecation aliases + consumer migration.
2. The three open collection rows are answered; the `GridCard` name collision
   is not.
3. `06-content-card-system.md` carries the rulings through the third pass only.
