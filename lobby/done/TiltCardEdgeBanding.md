# TiltCardEdgeBanding — kol-component's TiltCard lost kolkrabbi.io's 2026-08-27 anti-alias fix

**Staged:** 2026-10-29 · from kol-website (user: *"banding on the type foundry card — didn't we fix this already?"*)
**Files:** `lobby/_assets/TiltCardEdgeBanding/home-foundry-tiltcard-banding.png`

## The problem
On kolkrabbi.io's home, the foundry section's `TiltCard` (`SectionSplit media={<TiltCard …/>}`) renders a stair-stepped, banded edge while tilted. The image's text shimmers too.

The site fixed exactly this on 2026-08-27 in its own `components/ui/TiltCard.jsx`: `backface-hidden will-change-transform outline-1 outline-transparent` on the tilted element. The transparent outline makes the browser anti-alias the rotated edge, and backface + will-change keep it on its own layer. The site has since moved onto kol-component's `TiltCard` (`utilities/TiltCard.jsx`), which has none of these. Its tilted wrapper (line 76) carries only `relative ${className}` and `tilt.style`. This is the same pattern as the ASCII cursor: a consumer's fixed copy was replaced by the package's unfixed one.

## The fix
On the element that takes `tilt.style`, and on the static branch's wrapper:
- `backface-visibility: hidden`
- `will-change: transform`
- a 1px transparent outline (Tailwind: `backface-hidden will-change-transform outline-1 outline-transparent`)

Check every other tilting component (TiltBento's tiles, the shelf cards) for the same edge.

## Definition of done
- [ ] TiltCard's tilted edge renders smooth at rest and mid-tilt, in both themes
- [ ] other tilting components checked
- [ ] published

**Remainder at kol-website:** bump; hover the home foundry card.


---

## ✅ RESOLVED — 2026-10-29

Shipped **kol-component 0.313.1**. The site's 2026-08-27 fix is in `useTilt`'s style: `backface-visibility: hidden`, `will-change: transform` and `outline: 1px solid transparent`. Every tilting card goes through that hook, so TiltCard, TiltBento's tiles and ParallaxShelf's cards all get it, and TiltCard's static branch carries the same three as classes. The other rotators were checked: FlipCard and ContentCard's flip already hide their backfaces, and AnimatedTitle only rotates while its text animates in. Checked mid-tilt in the showcase: on both TiltCard and a TiltBento tile the computed styles are on the rotated element and the edge renders smooth. They don't depend on theme.
