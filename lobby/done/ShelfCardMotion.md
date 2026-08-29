---
component: ShelfCardMotion
source: kol-website/apps/web/src/routes/Work.jsx#L64-L106 (`ShelfEnter` + `WorkContentCard tilt`) + #L262-L278 (the shelf `renderCard`) + styles/ui.css#L81
staged: 2026-08-27
status: draft
deps: [ParallaxShelf, ContentCard, TiltCard, usePrefersReducedMotion, kol-theme]
---

# ShelfCardMotion — the shelf card enters and tilts; the site stops rendering its own

Ruled on kol-website `/work` (2026-08-27): the retired `WorkCard`'s motion came
back on the shelf. It lives in a local `renderCard` today. Ask: `ParallaxShelf`'s
**default** card carries both, so the site passes items + `titleClass` and
nothing else.

## Purpose

Two motions on the shelf card, shelf-only (the GRID card is a plain `ContentCard work`):

1. **Entrance** — a perspective settle, staggered by index, on the house curve.
2. **Tilt** — `TiltCard variant="grounded"` in the media slot, pointer-driven.

The caption is NOT an ask — `kol-content 0.11.0` already renders it as
`kol-eyebrow text-fg-64`, which equals the site's local rule (uppercase ·
0.06em · fg-64). It dies on the bump.

## Anatomy — what the site renders per shelf item today

```
div.flex-none w-[280px] md:w-[400px] {ladder[i % 3]}     ← the shelf's own ladder, unchanged
└─ ShelfEnter (index)                                      ← 1. entrance
   └─ div  style: perspective 800
      └─ div  style: transform-origin bottom center · opacity/transform transition
         └─ ContentCard variant="work" className="h-full"
            media = TiltCard src alt="" variant="grounded" className="w-full h-full"   ← 2. tilt
```

## 1. Entrance — values verbatim

| what | value |
|---|---|
| outer | `perspective: 800` |
| inner origin | `transform-origin: bottom center` |
| from | `opacity: 0` · `rotateX(${20 + (i % 3) * 8}deg) translateY(${30 + (i % 4) * 10}px)` |
| to | `opacity: 1` · `rotateX(0deg) translateY(0px)` |
| duration | `${0.7 + (i % 3) * 0.15}s` (0.7 · 0.85 · 1.0) |
| delay | `${i * 0.07}s` |
| ease | `var(--kol-ease-house)` |
| trigger | one `requestAnimationFrame` after mount flips `ready` — plain CSS transition, no library |

The site version has **no reduced-motion guard**. The DS one gates on
`usePrefersReducedMotion` (render settled).

## 2. Tilt

`TiltCard` is already a kol-component utility; the ask is only that the shelf's
default card puts it in the `media` slot: `<TiltCard src={item.thumbnail} alt=""
variant="grounded" className="w-full h-full" />`. Grid stays `<img>`. TiltCard
already falls back to a plain card on coarse pointer / reduced motion.

## Props — proposed on `ParallaxShelf`

| prop | type | default | controls |
|---|---|---|---|
| `enter` | boolean | `true` | entrance settle on the default card |
| `tilt` | boolean | `true` | grounded `TiltCard` in the default card's media slot |

Names and defaults are the DS's call — the user: *"gsap to animation css tilt
as what bento or tilt card? I dont care."* Whatever ships, the shelf must do
both with no `renderCard` from the site.

## App-specific bits to DROP

- `WorkContentCard` / `WORK_TITLE_FACE` — the site's face, passed as `titleClass` (already a seam)
- `useNavigate` / `onNavigate` wiring — already a seam
- `SHELF_HEIGHTS` — duplicate of the shelf's own ladder

## Recreation notes

kol-content (`ParallaxShelf.jsx`, the `card()` default branch). The entrance
wrapper is ~15 lines of CSS transition; keep it CSS (no gsap, no framer) unless
the DS already has an entrance primitive to reuse. Tilt = compose the existing
`TiltCard`. Text casing untouched.

## ✅ RESOLUTION — 2026-08-27 · kol-content 0.12.0

ParallaxShelf's default card carries both: enter (default true) — the site's ShelfEnter verbatim, settled under reduced motion; tilt (default true) — TiltCard grounded in the media slot. Grid untouched. Verified in source only (no server run, by your rule).

**Remainder here:** none — kol-website bump kol-content 0.12.0; drop ShelfEnter, WorkContentCard tilt, SHELF_HEIGHTS and the shelf renderCard in Work.jsx — pass items + titleClass (+ onNavigate).

