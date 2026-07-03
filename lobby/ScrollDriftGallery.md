---
component: ScrollDriftGallery
source: kol-monorepo/apps/web/src/routes/prints/PrintsExperimental.jsx#L30-L269
date: 2026-07-03
status: draft
deps: []
---

# ScrollDriftGallery

## Purpose
A **pinned** hero where vertical scroll scrubs a **horizontal track** ("The Drift"): the section pins, and page-scroll drives (1) the track sideways, (2) each floating card at its **own parallax speed**, (3) a keyframed **background-color journey** (black → cream → acid yellow → chartreuse → black), (4) a **slow-parallax vertical title**, and (5) a **bottom progress bar**. Cards float at varied y-positions, scales, and rotations like pieces pinned to a studio wall. Data-agnostic — card content is a `renderCard` slot.

## Anatomy
- **bg wrapper** `<div ref={bgRef} style={{ backgroundColor: '#000000' }} className="transition-colors duration-0">` — the element whose `backgroundColor` GSAP keyframes.
  - **pinned section** `<section ref={containerRef} className="relative h-screen overflow-hidden">` — the ScrollTrigger `trigger` + `pin` target.
    - **vertical title** `<div ref={titleRef} className="absolute left-8 top-0 h-full flex items-center z-10 pointer-events-none select-none" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>` → `<span className="text-[20vw] font-bold tracking-[-0.04em] leading-none opacity-[0.06] mix-blend-difference">PRINTS</span>`. **`PRINTS` is content → make it a `title` prop/slot.**
    - **horizontal track** `<div ref={horizontalRef} className="absolute top-0 left-0 h-full flex items-start" style={{ width: `${totalWidth}px` }}>`
      - **opening breathing space** `<div className="flex-shrink-0 w-[50vw] h-full flex items-center justify-center">` (intro copy — a slot).
      - **floating cards** — for each layout entry, an `absolute` positioned `[data-drift-card]` div (`left`, `top%`, `width`, `transform: rotate() scale()`), whose inner is `renderCard(item, meta)`. Source's inner is an `<img>` + hover-gradient name/year label.
      - **end CTA** — absolute card near `totalWidth - 500px` (count + "continue scrolling" — a slot).
    - **progress bar** `<div className="absolute bottom-0 left-0 right-0 h-px bg-fg-08">` with inner `<div className="h-full bg-accent-primary">` scrubbed 0→100% width.

### Layout math (source L30-52 — deterministic from index, keep it)
```js
const seed = (i * 7 + 3) % 24
const row = i % 3
const baseY = [8, 35, 62][row]                              // top / middle / bottom (vh %)
const y = baseY + ((seed % 7) - 3) * 3                      // ± jitter
const scale = [0.7,1,0.85,1.15,0.75,0.95,1.1,0.8][i % 8]
const rotation = ((seed % 5) - 2) * 1.5                     // -3..+3 deg
const parallaxSpeed = [0.6,0.8,1,1.2,0.7,0.9,1.1,0.85][i % 8]
const x = i * 520 + (seed % 3) * 60                         // horizontal slot + jitter
const width = scale > 1 ? 400 : scale > 0.85 ? 340 : 280
// cards render at left: x + 600 (offset past the opening space)
const totalWidth = items.length * 520 + 800
```
This depends only on **index + count**, so it survives the print-doc removal untouched — derive from `items.length`.

## Variants
No discrete variants; the "look" is the layout tables + bg keyframes above, all exposable as props.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| items | `any[]` | — | cards; drives layout count + `totalWidth` |
| renderCard | `(item, meta) => node` | — | card slot (`meta` = `{ scale, rotation, width, index }`) |
| totalWidth | number | `items.length*520 + 800` | scrollable width / scrub distance |
| title | node | — | the giant vertical wordmark (`PRINTS`) |
| intro / outro | node | — | opening breathing-space + end-CTA slots |
| bgKeyframes | `{color, duration}[]` | see below | background-color journey |
| cardSpacing | number | `520` | horizontal slot pitch |

## Styling
- Tailwind for structure; inline `style` for the dynamic geometry (`width: totalWidth`, per-card `left/top/transform`) and the seed-driven values.
- KOL tokens: `bg-fg-08` (progress track), `bg-accent-primary` (progress fill), type `kol-display-lg` / `kol-helper-uc-xs` / `kol-mono-xs` in the intro/labels. `mix-blend-difference` on title + intro so they invert against the shifting bg.
- **Requires `gsap.registerPlugin(ScrollTrigger)`. All tweens live inside `gsap.context(...)`, cleanup `ctx.revert()`.**
- **(1) Pin + horizontal scrub (exact):**
  ```js
  gsap.to(horizontalRef.current, {
    x: () => -(totalWidth - window.innerWidth), ease: 'none',
    scrollTrigger: {
      trigger: containerRef.current, start: 'top top', end: () => `+=${totalWidth}`,
      scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
    },
  })
  ```
  The pin holds the section while `+=totalWidth` of scroll translates the track from `x:0` to `x: -(totalWidth - innerWidth)`. `scrub: 1` = 1s catch-up smoothing.
- **(2) Background journey (exact)** — on `bgRef`, `scrub: true`, same trigger/end, `keyframes` with fractional `duration` (share of the scrub, summing to 1):
  ```js
  keyframes: [
    { backgroundColor: '#000000', duration: 0 },
    { backgroundColor: '#0a0a08', duration: 0.15 },
    { backgroundColor: '#1a1812', duration: 0.3 },
    { backgroundColor: '#f5f0e8', duration: 0.5 },  // warm cream
    { backgroundColor: '#e8df00', duration: 0.7 },  // acid yellow
    { backgroundColor: '#c8ff00', duration: 0.85 }, // electric chartreuse
    { backgroundColor: '#0a0a0a', duration: 1 },    // back to black
  ]
  ```
- **(3) Title slow-parallax (exact):** `gsap.to(titleRef, { x: () => -(totalWidth - innerWidth) * 0.3, ease:'none', scrollTrigger:{ …, scrub: 1 } })` — moves at **0.3×** the track, so the wordmark drifts slower than the cards.
- **(4) Per-card parallax (exact):** for each `[data-drift-card]`, `const speed = (parallaxSpeed - 1) * 300`, then `gsap.to(card, { x: speed, ease:'none', scrollTrigger:{ …, scrub: 1 } })`. Cards with `parallaxSpeed > 1` push forward, `< 1` lag back — layered depth on top of the base track translate.
- **(5) Progress bar (exact):** `gsap.to(el, { width: '100%', ease:'none', scrollTrigger:{ …, scrub: true } })` on the accent fill.
- **App-specific bits to DROP:**
  - `prints` / `getPrintBySlug` imports; the LAYOUT `.map(prints…)` → derive from `items`.
  - Inline `item.print.images?.[2] || item.print.image`, `.name`, `.year`, `.slug` reads and the `<img>`/hover-label markup → all move into `renderCard`.
  - `useParams`/`useNavigate`, `handleCardClick`→route, and the `PrintDetailOverlay` + `AnimatePresence` wiring — routing is the consumer's job; expose an `onCardClick(item, index)` callback instead.
  - Everything below the pinned section in the source file (breather, editorial masonry, catalog grid, `SEO`) is **not** part of this component.

## States & interactions
- **Scroll (the whole interaction):** vertical scroll while pinned scrubs track + cards + bg + title + progress; releasing the pin resumes normal vertical flow.
- **Card hover:** source scales the inner `group-hover:scale-[1.03]` and fades in a name/year gradient label — leave that to `renderCard`.
- **Card click:** source navigates; DS surfaces an `onCardClick(item, index)`.
- **Reduced motion:** source ignores it — a DS version should fall back to a plain horizontal-scroll (or vertical grid) when `prefers-reduced-motion`.
- **Resize:** `invalidateOnRefresh: true` + function-based `end`/`x` recompute against `innerWidth` on `ScrollTrigger.refresh`.

## Dependencies
- `gsap` + **ScrollTrigger** (`gsap/all`), registered once.
- Card content via `renderCard` — composes the staged store cards, but imports none directly.

## Recreation notes
- **Tier:** organism — a pinned ScrollTrigger rig (pin + scrub + 5 linked tweens) plus a deterministic layout generator; cards are slotted.
- **The prop/slot seam replacing the Sanity doc:** `items` + `renderCard(item, meta)` + `onCardClick`. The layout tables (y-rows, scale/parallax arrays, `x = i*520`, `totalWidth`) are index-driven and stay as internal (optionally prop-overridable) constants — they never read the doc.
- **Keep the mechanics verbatim:** the pin+scrub, the fractional-duration bg keyframes, the `0.3×` title parallax, the `(parallaxSpeed-1)*300` per-card offset, and the scrubbed progress bar are the whole identity of the piece — reproduce the numbers, not an approximation.
- **Text casing at call site:** the `PRINTS` wordmark and intro/outro copy are content — pass them as `title`/`intro`/`outro` nodes authored in their intended case; no JS `text-transform`.
