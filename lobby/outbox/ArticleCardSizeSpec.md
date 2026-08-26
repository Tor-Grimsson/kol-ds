# ArticleCardSizeSpec — the consumer defines the card geometry

**Filed:** 2026-08-15 → **kol-website**
**Entry:** `~/dev/projects/kol-website/lobby/inbox/ArticleCardSizeSpec.md`
**Ledger:** `~/dev/projects/kol-website/lobby/INDEX.md` — **the truth about this ticket**
**Last known:** 🟢 answered — ListingCardSpec came back 2026-08-15, executed as kol-content 0.7.0

## Why it went there

`ArticleCard`'s four presets (`default`/`hero`/`mini`/`readmore`) are
archaeology: three reverse-engineered from kol-website's hand-built cards, the
fourth invented by the DS — twice; 0.6.0's geometry was caught by the user and
corrected in 0.6.1 the same day. The user's ruling: there **should** be a
standard shortlist, and the repo that renders the cards in every context is the
one that can define heights, thumbnail boxes, type, clamps and breakpoint
behaviour. The DS ruling geometry it has no context for is the failure this
ticket ends.

## What stays here

- **On the spec's return:** conform `ArticleCard` to the table — geometry,
  clamps, and whichever breakpoint behaviour the ruling puts in the card rather
  than the consumer. `readmore` especially: its current shape is mini's-row-in-
  a-border, a placeholder pending a real design ruling.

**Remainder here:** waiting on the spec. Appended 2026-08-15: the ticket now
also asks the scope + naming questions — is this THE listing card for any
content type, and is `ArticleCard`/`WorkCard` naming wide enough — so the
conform-work here may include a rename with aliases.

✅ **Spec returned 2026-08-15 — remainder superseded by `inbox/ListingCardSpec.md`**,
which carries the geometry table and all three rulings: wide scope (THE listing
card), rename `ListingCard` (aliases until next major), presets cut to three —
`readmore` dropped as a preset (a read-more band is a context rendering `mini` +
`label`, not a size).

## Answered — 2026-08-15

kol-website returned the spec as `ListingCardSpec` (this repo's inbox, now
`done/` with its resolution). Executed same-day: **kol-content 0.7.0** —
`ListingCard` rename with `ArticleCard` alias, `readmore` dropped, geometry
conformed (two clamp deltas). `WorkCard` not aliased — stated deviation, breaks
`/work` consumers; convergence recorded for the next major.

**Remainder here:** none.
