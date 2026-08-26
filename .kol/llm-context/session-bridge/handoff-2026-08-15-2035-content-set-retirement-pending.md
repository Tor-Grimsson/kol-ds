# Handoff — 2026-08-15 20:35

## Goal of the current arc

The ContentCard/ContentRow family is BUILT and published across all six
variants, with the collection and the `Content Set` review surface. The arc is
not finished: **nothing has been retired.** The family exists to remove
duplication and so far it has only added a replacement beside it.

## Last actions taken (causal trail, newest first)

- `Divider` vertical centred and sized to what it separates — it hardcoded
  `self-stretch` ahead of `className`, so any `self-*` from a call site lost.
- `ContentFilters` header settled by measurement: 16 glyph in a 32 box (the
  `.kol-copy-btn` pairing), title `kol-helper-14` uppercase, strip rest `oq-48`,
  count beside LIST/GRID at gap-6, `layoutPlacement` for the two arrangements.
- `SearchInput` unified — one type ramp, both glyph ladders correctly split
  (SOLO for the collapsed trigger, ADJACENT for the in-field glyph), `iconSize`
  and `fieldHeight` seams added, glyph held until the collapse finishes.
- `/work` reproduced and MEASURED against the live page: delta empty.
- Published: theme 0.48.0 · component 0.66.0 · content 0.8.1 · shell 0.6.1 ·
  icons 0.18.0 · dashboards 0.2.3.

## Current state / open decision points

- **THE RETIREMENT WAVE IS THE WHOLE REMAINING POINT.** Ten absorbed components
  still export, none carries `@deprecated`, no consumer imports the new family:
  MediaCard · MediaRow · GridCard · PrintGridCard · ListingCard · ArticleCard ·
  WorkCard · WorkListItem · TypefaceLibraryItem · BentoCard.
- **`GridCard` names TWO unrelated DS components** — kol-shell's A4 catalog card
  and kol-dashboards' grid-span wrapper — across ~70 call sites. A rename is a
  breaking change in two packages and needs his ruling before anything moves.
- **`ContentFilters` has four more forks** in client repos; only kol-shell's was
  retired.
- `TRACKS` in the set (per-variant grid minimums) is MY derivation from each
  variant's box, not a ruling. It is the one set of numbers on that surface he
  has not seen and approved.
- `RAMP.print.row` / `BOX.print` are dead — print's row renders
  `variant="catalog"` by his ruling. Left in place rather than removed.

## Next intended action

Ask which offender to start the retirement wave on, then: deprecation alias →
consumer migration → drop the export at the next major. Do NOT start it
unasked; it is a multi-package breaking change.

## Working memory not yet in AGENT-CONTEXT

- The measurement law is in AGENT-CONTEXT, but the mechanism worth remembering
  is narrower: **an inline style outranks every class.** Three separate defects
  this session were that one fact — hover that never fired, a clip that never
  opened, a border that inherited white.
- He renders; I do not. Every visual claim I made without Playwright this
  session was wrong at least once. The browser check is not optional on this
  surface.
- The showcase set is `Content Set` at `/sets/preview/content-card-comparison` —
  the route still carries the old slug deliberately, so his link keeps working.
