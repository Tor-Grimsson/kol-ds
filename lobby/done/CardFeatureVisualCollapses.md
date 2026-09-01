# CardFeatureVisualCollapses — the feature card's media has flex-basis 0, so it can render at zero

**Filed:** 2026-08-31 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` — `SectionCards` / `.kol-card-feature-visual`

## The defect

The card's media box computes `flex: 1 1 0%`. Basis **zero** means its own content
contributes nothing to its size — the height is donated entirely by the parent's
free space. Where an ancestor supplies a definite height it renders correctly;
where one does not, the box resolves to **0** and the card silently drops to just
its title and subtitle.

The failure is invisible as a failure. The image does not appear broken and no
request errors — the card just looks short, and a reader has no idea a visual was
meant to be there.

## How it showed up

A real iPhone renders `/` on kol-website with all four feature cards **missing
their images**, cards ~205px instead of ~309px. Confirmed not to be a loading
problem: the URL is correct, a cold `curl` returns 200 / 31KB / image-jpeg, and
Chromium, WebKit **and** Gecko all render the images at 390×844 against the same
server. Blocking the CDN outright does not reproduce it either — that produces a
*larger* card (414px) with an empty 316px box, which is the opposite symptom.

So the collapse is real on a device but not reproducible on this machine, and the
one structural thing that makes it possible at all is the zero basis.

## The ask

Give the media box a basis it owns, so zero is unreachable regardless of what the
parent donates. An `aspect-ratio` is the natural fit — the box is already
`w-full`, so a ratio fully determines its height:

```css
.kol-card-feature-visual { flex: 1 1 auto; aspect-ratio: 3 / 2; }
```

3:2 reproduces today's rendered geometry exactly at 390 (316 wide → 211 tall), so
nothing moves where it currently works. The DS owns the ratio; the constraint is
only that the media box must not be able to resolve to zero height.

Worth considering the same audit for any other `flex-1` media box in the set —
this is a class of defect, not one card.

## Stopgap here meanwhile

`apps/web/src/styles/ui.css` carries a `max-width: 767px` rule doing exactly the
above, dated and citing this ticket. It comes out on the bump.

## Remainder here once it ships

bump kol-component (+ kol-theme if the rule lands there); delete the stopgap block
from `apps/web/src/styles/ui.css`; re-check `/` feature cards on a real phone.

---

## Resolution — 2026-08-31 · 🟢 closed

**Shipped: `@kolkrabbi/kol-component` 0.145.0.**

`flex-1` → `flex-auto`, and the ratio defaults to `3/2` instead of `''`:

```js
const aspectClass = aspectClasses[imageAspectRatio] || 'aspect-[3/2]'
```

The zero basis was only half of it — `flex: 1 1 auto` still leaves the box with
nothing of its own to be sized from when no ratio is set. The ratio is what makes
zero unreachable; the basis is what stops the parent overriding it.

### Measured on `/components/section-cards`
| | |
|---|---|
| computed `flex` | `1 1 auto` (was `1 1 0%`) |
| any zero-height box | **no** |
| at 1280×900 | 123×110 · 123×126 · 123×126 |
| at 390×700 (the reported shape) | 136 · 136 · 136 — **no collapse** |

3:2 is the geometry those cards already rendered at, so nothing moved where it
already worked.

**On the wider audit you flagged:** `SectionSplit`'s media box was the same class
of defect and is fixed in the same release — see `SectionSplitVisualWidth`. No
other `flex-1` media box in the set resolves without a ratio.

### Definition of done
- [x] The media box cannot resolve to zero height
- [x] Nothing moves where it currently works
