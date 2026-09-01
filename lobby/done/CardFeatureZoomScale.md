# CardFeatureZoomScale — the feature card's zoom is one hardcoded scale for every visual

**Filed:** 2026-08-31 ← **kol-website**
**Package:** `@kolkrabbi/kol-theme` — `kol-animation.css:275`

## The gap

```css
.kol-card-feature:hover .kol-card-feature-visual { transform: scale(1.03); }
```

`1.03` is fixed in CSS with no prop and no token. That is a good number for a
dense photographic visual and effectively invisible on a sparse one — on
kol-website's `/` the four feature cards carry line-art specimens on a white
ground, and at 3% the motion cannot be seen at all, while the four workshop cards
in the same set carry dark UI screenshots where 3% reads correctly.

Same component, same set, same page — two kinds of artwork that need two amounts.

## The ask

A seam for the scale. A prop on `SectionCards` (or per-feature, alongside
`backgroundColor` and `imageAspectRatio`, which are already per-feature) is the
natural shape, or a CSS custom property on the card that the class reads, so a
consumer can raise it without redefining the rule.

Whatever the shape, `1.03` stays the default — nothing should move for existing
consumers.

## Related, same page

`TiltBento`'s coarse reveal (`TiltBentoCoarseRevealInView`, shipped 0.145.0) gave
touch devices an in-view "attention" state inside that component. The feature card
has no equivalent: its zoom is `:hover` only, and a touch device cannot hold hover
because the card is an anchor — a tap navigates. So on mobile the zoom never fires
at all today.

kol-website currently supplies that state with its own IntersectionObserver adding
`.is-viewing` to `.kol-card-feature`. **Worth considering whether the in-view
attention state should be a shared behaviour across the card set rather than
per-component**, since two components in the same set now need it.

## Stopgap here meanwhile

`apps/web/src/styles/ui.css` raises the scale to `1.08` on coarse pointers for
cards marked `kol-card-lineart` (passed via `SectionCards`' `itemClassName`), and
`hooks/useMobileActiveCard.js` supplies the `.is-viewing` state. Both dated and
citing this ticket.

## Remainder here once it ships

bump kol-theme (+ kol-component if the state moves into the set); delete the
stopgap block, the `kol-card-lineart` marker and the local hook.

## ✅ RESOLUTION — 2026-08-31 · kol-theme@0.114.0

The card publishes --kol-card-feature-zoom from a per-feature zoom prop (feature.zoom through SectionCards, alongside backgroundColor and imageAspectRatio as you suggested) and kol-animation.css reads it with 1.03 as the fallback, so nothing moves for anyone who does not set it. Per-feature rather than per-set, because your own evidence is that one set holds both kinds: line-art on white needing more and dark UI screenshots correct at 3%. Requires kol-component >=0.147.0 for the prop. NOT SHIPPED, and deliberately: the shared in-view attention state. You are right that two components now need it and that a card cannot hold hover on touch, but making .is-viewing a DS-wide behaviour across the card set is an architecture call that binds every card kind, not a fix to this rule — it wants its own ticket and the user's ruling. Keep your local hook until then.

**Remainder here:** none — kol-website bump kol-theme >=0.114.0 and kol-component >=0.147.0, pass zoom per feature, delete the stopgap block and the kol-card-lineart marker; KEEP hooks/useMobileActiveCard.js — the shared attention state was not shipped.

