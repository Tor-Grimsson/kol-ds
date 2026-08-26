---
component: FeaturedCarouselReconcile
source: kol-website — components/sections/shared/FeaturedCarousel.jsx (231L) vs kol-component organism (259L)
staged: 2026-08-15
status: draft
deps: [kol-component]
---

# FeaturedCarouselReconcile — 458-line divergence, one survivor

## The ask

Local FeaturedCarousel (231L, consumers: `routes/Studio.jsx` +
`routes/foundry/FoundryTypefaces.jsx`) vs the kol-component organism (259L):
458 diff lines — a true diverged twin, not adoptable blind. Reconcile: read
both, decide which behaviors are canon (drag mechanics, nav, card contract),
ship the superset in kol-component, kol-website adopts and retires its copy.

The local one composes local `CarouselNavigation` (`components/ui/`) — fold or
supersede it in the same pass.

## What stays with kol-website

On ship: both consumers adopt, local pair (FeaturedCarousel +
CarouselNavigation) retires.

---

## Resolution — 🟢 closed 2026-08-15

Shipped in **`@kolkrabbi/kol-component@0.41.0`** + **`@kolkrabbi/kol-framework@0.20.1`**
(both registry-verified).

**They were never a fork — two different engines.** The 458 diff lines are not
drift; kol-website's runs framer-motion `AnimatePresence` over an index while
the package runs embla. That decides the brief's first question outright: the
motion version has **no drag at all**, so canon is the engine here, and with it
the `{ media }` descriptor, `OverlayGlassPanel`, and the autoplay progress ring.

**Five capabilities crossed the other way**, all real, all absent here:
`children` (a static overlay pinned over the stage that does not travel with the
slides), `fullWidth`, `rounded`, the `showTitle`/`showDescription`/`showCta`
toggles (global with per-item override), and `subtitle`. Plus the brief's second
question — nav placement — answered as `navPosition='header'`, since putting the
pair beside the counter is a layout the consumer actually ships.

**`CarouselNavigation` superseded, not folded.** Reading it explained the fork:
it existed because it wanted **real chevron icons**, and the package's buttons
carried the literal text characters `‹` and `›` — in a design system that ships
a chevron icon set. Worse, that markup was hand-typed at **three** sites
(`Carousel`, `FeaturedCarousel`, and near-miss in `MediaViewer`). So instead of
importing one more copy, the markup became **`EmblaNav`** — one exported
component owning the class string, the aria labels, the disabled state and the
icons, now used by both carousels. Same failure `RailSection` fixed for rails: a
class is vocabulary, not grammar. `MediaViewer` keeps its own chips deliberately
— absolutely positioned over an inverse-tier scrim, a different control.
kol-framework 0.20.1 carries the two CSS halves (`.kol-embla-btn` centring, the
`.is-inline` controls variant), in the file where that family lives.

**Deliberately not carried:** the foundry title coupling (a size ramp keyed on
the literal strings `'Málrómur'`/`'Tröllatunga'` plus a per-typeface inline
`fontFamily` — the package header already recorded dropping it), the deleted
`kol-label-mono-xs` family, and the hidden block that eagerly preloaded every
slide image, which is a performance defect rather than a feature.

19 gates clean before each publish.

**Remainder here:** none.
