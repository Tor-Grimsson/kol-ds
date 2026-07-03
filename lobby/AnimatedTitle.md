---
component: AnimatedTitle
source: kol-monorepo/apps/web/src/components/animation/AnimatedTitle.jsx#L1-L75
date: 2026-07-03
status: draft
deps: []
---

# AnimatedTitle

## Purpose
Scroll-triggered heading that animates its words in one-by-one as the title scrolls into view. Each word starts far off-screen right, rotated in 3D, and flies into place with a fast stagger. Uses GSAP + the **ScrollTrigger** plugin. Accepts an HTML-bearing `title` string (supports `<br />` line breaks and inline markup per word).

## Anatomy
- Root `<div ref>` — `className="animatedTitle {containerClass}"`, `style={style}`.
- For each line (split on the literal string `'<br />'`): a `<div className="flex-center flex-wrap gap-2 md:gap-3 {lineClass}">`.
- For each word (line split on `' '`): a `<span className="animatedWord" dangerouslySetInnerHTML={{ __html: word }} />`. The `.animatedWord` spans are the animation targets; `dangerouslySetInnerHTML` lets a word carry inline markup (e.g. `<b>`, `<span class>`).

## Variants
No enumerated variants — appearance is driven entirely by the caller-supplied `containerClass` / `lineClass` / `style` and the markup embedded in `title`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| title | string (HTML) | — (required) | Content; split on `'<br />'` → lines, on `' '` → words. Each word rendered via `dangerouslySetInnerHTML`. |
| containerClass | string | — | Extra classes on the root, appended after `animatedTitle`. |
| style | React.CSSProperties | — | Inline style on the root. |
| lineClass | string | — | Extra classes on each line `<div>`, appended after the flex defaults. |

## Styling
- Root: `animatedTitle` (app/consumer-defined class — not a Tailwind util) + caller `containerClass`.
- Line: `flex-center flex-wrap gap-2 md:gap-3` + caller `lineClass`. Note `flex-center` is a project utility (`display:flex; align-items:center; justify-content:center`), not stock Tailwind — the DS must provide it or swap to `flex items-center justify-center`.
- Word: `animatedWord` — no styling of its own; it exists only as the GSAP selector target. Word visual style comes from the inherited/`containerClass` typography.
- **App-specific bits to DROP / normalize:** `flex-center` and the bare `animatedTitle` classnames are app conventions — in the DS, replace `flex-center` with `flex items-center justify-center` and drop the `animatedTitle` marker class (use a ref instead of relying on the class name). No color/KOL tokens are set here; typography is inherited from the consumer.

## States & interactions
Scroll-only; no hover/click. GSAP setup runs in `useEffect` inside a `gsap.context(..., containerRef)` (auto-scoped, `ctx.revert()` on unmount / when `title` changes).
- **Initial state** (`gsap.set` on all `.animatedWord`): `opacity: 0, x: '150vw', y: 50, rotateY: -45, rotateX: 15`.
- **Timeline** with `scrollTrigger`: `trigger: containerRef.current`, `start: '100 bottom'`, `end: 'center bottom'`, `toggleActions: 'play none none reverse'` (plays entering the viewport, reverses scrolling back out).
- **Tween** (`.to`, at timeline position `0`): `opacity: 1, x: 0, y: 0, rotateY: 0, rotateX: 0`, `ease: 'power2.inOut'`, `stagger: 0.02` (per word). No explicit `duration` set (GSAP default 0.5s per word).
- Re-runs whenever `title` changes (effect dep `[title]`).

## Dependencies
- `gsap` core.
- `gsap/all` → `ScrollTrigger`, registered via `gsap.registerPlugin(ScrollTrigger)`. **This is a plugin dependency the DS must declare and register.**
- React `useEffect`, `useRef`.
- No DS component deps.

## Recreation notes
- **Tier:** molecule (single semantic block, one behavior, but non-trivial DOM splitting + scroll wiring).
- **Values that should become props** (currently hardcoded in the tween): stagger (0.02), ease (`power2.inOut`), the initial offsets (`x:'150vw'`, `y:50`, `rotateY:-45`, `rotateX:15`), and the ScrollTrigger `start`/`end`/`toggleActions`. Expose at least stagger + start/end so the reveal can be tuned per placement.
- **Animation library the DS must declare:** `gsap` **plus** the `ScrollTrigger` plugin (registered once). Flag: ScrollTrigger must be imported and `registerPlugin`-ed, otherwise the scroll wiring silently no-ops.
- **Tokens to swap:** none (no colors/tokens set). Just replace `flex-center` with standard Tailwind and drop the `animatedTitle` marker class in favor of the ref.
- Keep `dangerouslySetInnerHTML` per-word (it's the intended API for inline word markup) but document the XSS surface — DS consumers must pass trusted strings.
- Consider a `prefers-reduced-motion` guard via `gsap.matchMedia()` in the DS version (source has none).
