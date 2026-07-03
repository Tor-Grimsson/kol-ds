---
component: DiagonalMarqueeRiver
source: kol-monorepo/apps/web/src/routes/prints/PrintsGridGsap.jsx#L25-L116
date: 2026-07-03
status: draft
deps: [PrintGridCardGsap]
---

# DiagonalMarqueeRiver

## Purpose
An auto-scrolling multi-column marquee "river": `items[]` are dealt round-robin into N vertical columns, each column runs an **infinite GSAP `y`-tween at its own speed**, and the whole block is **rotated `-15deg` and scaled `1.3`** so the columns stream diagonally across a tall viewport. An `IntersectionObserver` **pauses every tween when the block scrolls off-screen**. Fully data-agnostic engine — the card is a `renderItem` slot.

## Anatomy
- **Outer viewport** `<div ref={containerRef} className="w-full overflow-hidden" style={{ height: '300vh' }}>` — the tall stage; also the IntersectionObserver target.
- **Rotated block** `<div className="flex gap-6" style={{ transform: 'rotate(-15deg) scale(1.3)', transformOrigin: 'center center', height: '140%', marginTop: '-20%' }}>` — tilts + oversizes the whole river so tilted columns still bleed past the edges.
  - **per column** `<div className="flex-1 overflow-hidden">`
    - **track** `<div ref={el => columnRefs.current[i] = el} className="flex flex-col" style={{ gap: `${GAP}px` }}>`
      - items rendered **twice** — `[...col, ...col].map(...)` — so the tween can loop seamlessly (scroll one set's height, repeat). Each entry goes through `renderItem(item, i)`; source renders `<PrintGridCardGsap print={...} onCardClick={...} />`. **Reference `PrintGridCardGsap`, don't re-spec it.**

Module consts: `COL_COUNT = 4`, `GAP = 24`, `COLUMN_SPEEDS = [28, 38, 22, 34]` (px/s, "varied but intentional").

Column split: `columns[i % COL_COUNT].push(item)` (round-robin).

## Variants
No visual variants; the knobs are `colCount`, `columnSpeeds`, `gap`, and the rotation/scale. Speeds array indexes by column (`COLUMN_SPEEDS[i] || 30` fallback).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| items | `any[]` | — | pool dealt round-robin into columns |
| renderItem | `(item, i) => node` | — | card slot per item (source: `PrintGridCardGsap`) |
| colCount | number | `4` | number of columns |
| columnSpeeds | `number[]` | `[28,38,22,34]` | px/s per column (fallback `30`) |
| gap | number | `24` | vertical gap between cards **and** the `gap-6` between columns |
| height | string | `'300vh'` | stage height |
| rotate / scale | number | `-15` / `1.3` | tilt + oversize of the block |

## Styling
- Tailwind for layout (`flex`, `flex-col`, `flex-1`, `overflow-hidden`, `gap-6`); the tilt/scale/height/marginTop are inline `style` (dynamic, not Tailwind-expressible cleanly).
- KOL tokens: none of its own — surface/tone come from the surrounding page and the rendered cards.
- **The GSAP engine (exact), in a `useEffect` keyed on the item list:**
  ```js
  const colEls = columnRefs.current.filter(Boolean)
  tweensRef.current.forEach(tw => tw.kill()); tweensRef.current = []

  colEls.forEach((colEl, i) => {
    colEl.style.willChange = 'transform'
    const singleSetHeight = colEl.scrollHeight / 2          // one copy of the doubled list
    const speed = columnSpeeds[i] || 30
    const initialOffset = -(singleSetHeight * ((i * 0.15) % 1))   // staggered per-column start
    gsap.set(colEl, { y: initialOffset })
    const tween = gsap.to(colEl, {
      y: initialOffset - singleSetHeight,                   // travel exactly one set → seamless
      duration: singleSetHeight / speed,                    // time = distance / speed (constant px/s)
      ease: 'none',
      repeat: -1,
    })
    tweensRef.current.push(tween)
  })
  ```
  - **Seamless loop:** the list is doubled in markup; each tween travels exactly `singleSetHeight` then repeats, so the wrap is invisible.
  - **Constant velocity:** `ease: 'none'` + `duration = singleSetHeight / speed` gives true px/s regardless of column length; taller columns take proportionally longer.
  - **Stagger:** `initialOffset = -(singleSetHeight * ((i * 0.15) % 1))` offsets each column's phase by 15% steps so they don't march in lockstep.
- **IntersectionObserver pause (exact):**
  ```js
  const observer = new IntersectionObserver(([entry]) => {
    tweensRef.current.forEach(tw => entry.isIntersecting ? tw.resume() : tw.pause())
  }, { threshold: 0 })
  observer.observe(containerRef.current)
  ```
  Cleanup: `observer.disconnect()` + kill all tweens.
- **App-specific bits to DROP:**
  - The one-time shuffle `[...prints].sort(() => Math.random() - 0.5)` and the `prints` import — pass `items` already ordered (expose an optional `shuffle` bool if wanted).
  - `PrintGridCardGsap` import + `print`/`onCardClick` props — route through `renderItem`.
  - The surrounding page chrome in the source file (breather, "Behind the Print" strip, about, static grid, `SEO`) is **not** part of this component.

## States & interactions
- **Auto-scroll:** each column streams upward at its own constant speed, infinitely.
- **Off-screen pause:** IntersectionObserver pauses/resumes all tweens as the stage enters/leaves the viewport (perf + battery).
- No hover/click on the river itself; interactions belong to the rendered cards.
- `willChange: 'transform'` set per column for compositor promotion.

## Dependencies
- **PrintGridCardGsap** (staged molecule, `@kol/ui`) — the default `renderItem` card; reference only.
- `gsap` core (`gsap.to`, `gsap.set`, tween `pause/resume/kill`).

## Recreation notes
- **Tier:** organism — a self-contained animation engine (column split + N infinite tweens + IO pause + tilt) that composes card molecules through a slot.
- **The prop/slot seam replacing the Sanity doc:** `items` + `renderItem` — the engine never touches `print.*`; it only measures `scrollHeight` and tweens `y`. Column count/speeds/gap/tilt are numeric props.
- **Re-measure on resize:** source keys the effect on the item list only; a DS version should also re-run on container resize (`scrollHeight` changes) — add a `ResizeObserver` or `ScrollTrigger.refresh`-style remeasure.
- **Reduced motion:** honor `prefers-reduced-motion` — skip the tweens (leave columns static) — source does not; add it.
- **Text casing at call site:** n/a — no text of its own; all copy lives in the rendered cards.
