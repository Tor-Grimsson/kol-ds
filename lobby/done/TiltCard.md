---
component: TiltCard
source: kol-monorepo/apps/web/src/components/animation/TiltCard.jsx#L1-L62
date: 2026-07-03
status: draft
deps: []
---

# TiltCard

## Purpose
Self-contained image card with a subtle spring-based **3D tilt** that follows the pointer. On coarse-pointer (touch) devices it renders a plain, tilt-free card (no springs, no listeners). Two tilt modes via `variant`: `default` (free tilt tracking the cursor) and `grounded` (a "planted at the bottom" feel — tilt is snapped to 3 zones, quantized, damped by a slow lazy spring, and rotation is pinned to `transform-origin: center bottom`). Motion comes from `framer-motion` springs driven by the local hook **`useBentoTiltMotion`**.

## Anatomy
- **Coarse-pointer branch** (`window.matchMedia('(pointer: coarse)').matches`, evaluated once at module load): `<div className="relative {className}">` → inner `<div className="absolute inset-0 overflow-hidden rounded-[inherit]">` → `<img className="w-full h-full object-cover">` → then `{children}`. No motion.
- **Fine-pointer branch (`TiltCardInner`):** `<motion.div className="relative {className}" {...tiltProps} style={style}>` → same inner image wrapper (`absolute inset-0 overflow-hidden rounded-[inherit]`, `<img w-full h-full object-cover>`) → `{children}`. `{...tiltProps}` spreads the hook's `ref`, `onMouseMove`, `onMouseLeave`.

## Variants
| variant | behavior |
|---------|----------|
| `default` | Free tilt: `style` is the raw hook style (`rotateX`/`rotateY` springs from pointer, ±4°). |
| `grounded` | "Planted" tilt: targets are snapped to 3 zones and re-scaled, then run through a slower **lazy spring**; `transform-origin: center bottom`. `targetX = min(0, snap(-rotateX/4)*2.5)` (only ever tilts back, never forward), `targetY = snap(rotateY/4)*2.5`, where `snap(v)=round(v*3)/3`. Lazy spring: `{ stiffness: 250, damping: 25, mass: 0.6 }`. |
| (coarse pointer) | No tilt at all — plain div, regardless of `variant`. |

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| src | string | — | Image source (`object-cover`). |
| alt | string | `''` | Image alt text. |
| className | string | `''` | Classes on the root; note `rounded-[inherit]` on the image wrapper means the card's corner radius is inherited from `className`. |
| variant | `'default'` \| `'grounded'` | `'default'` | Tilt mode (see Variants). |
| children | ReactNode | — | Overlaid content rendered above the image (e.g. labels, gradients). |

## Styling
- Root (both branches): `relative {className}`.
- Image wrapper: `absolute inset-0 overflow-hidden rounded-[inherit]` — inherits border-radius from the root's `className`.
- Image: `w-full h-full object-cover`.
- Motion style (from hook, spread on `motion.div`): `{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 700 }`; `grounded` overrides `rotateX`/`rotateY` with the lazy springs and adds `transformOrigin: 'center bottom'`.
- **No KOL tokens, no colors, no hex** — purely structural. Corner radius, size, and any surface color are all supplied by the consumer via `className` + `children`.
- **App-specific bits to DROP:** none — fully self-contained. The only coupling is the **local hook import** `../../hooks/useBentoTiltMotion`, which must promote alongside the component (see Dependencies / Recreation).

## States & interactions
Driven by `useBentoTiltMotion` (see below). Fine-pointer only:
- **mousemove (on the card):** compute pointer as fractions `relativeX/Y = (clientX-left)/width, (clientY-top)/height`; `mouseX.set(relativeX)`, `mouseY.set(relativeY)`.
- **mouseleave:** `mouseX.set(0.5)`, `mouseY.set(0.5)` (returns to flat/center).
- **Hook springs:** `rotateX = spring(mapRange(mouseY, [0,1] → [4,-4]), { stiffness: 350, damping: 35 })`; `rotateY = spring(mapRange(mouseX, [0,1] → [-4,4]), { stiffness: 350, damping: 35 })`. So base tilt is **±4°**, perspective **700**, `preserve-3d`.
- **grounded** feeds those spring outputs through `useTransform` (snap/zone/clamp) into a **second, slower** spring (`stiffness 250, damping 25, mass 0.6`) so the card lags and settles into quantized angles, pivoting about its bottom edge.
- **Coarse pointer:** no listeners, no motion values, static card.

## Dependencies
- `framer-motion`: `motion`, `useTransform`, `useSpring` (in component) + `useSpring`, `useMotionValue`, `useTransform` (in hook).
- **Local hook `useBentoTiltMotion`** (`apps/web/src/hooks/useBentoTiltMotion.js#L1-L59`) — returns `{ ref, style: { rotateX, rotateY, transformStyle, transformPerspective:700 }, onMouseMove, onMouseLeave }`. Two sibling hooks exist (`useBentoTilt.js`, `useStoryTiltMotion.js`) — TiltCard uses only the `Motion` one.
- No DS component deps.

## Recreation notes
- **Tier:** molecule (image + one interaction behavior + a variant).
- **The hook promotes alongside the component.** `useBentoTiltMotion` is a private, TiltCard-specific hook — promote it as a co-located internal (not a separately exported DS hook, unless the DS wants a public `useTilt`). Its motion params are the real spec: base tilt **±4°**, primary spring **{ stiffness: 350, damping: 35 }**, perspective **700**, rest position **0.5/0.5** (center). Do NOT pull in `useBentoTilt`/`useStoryTiltMotion` — leave them behind.
- **Values that should become props** (currently hardcoded): tilt magnitude (±4°), spring stiffness/damping (350/35), perspective (700), and for `grounded` the zone count (3), scale factor (2.5), lazy-spring params (250/25/0.6). At minimum expose tilt magnitude + perspective.
- **Animation library the DS must declare:** `framer-motion`.
- **Coarse-pointer guard** is evaluated once at module load (`isCoarse` const) — acceptable, but the DS may prefer a `useMediaQuery` so it re-evaluates on device/orientation change. Also fold in `prefers-reduced-motion` (source only checks pointer coarseness).
- **Tokens:** none to swap. Radius/size/overlays stay consumer-driven via `className`/`children`; `rounded-[inherit]` on the image wrapper is the key mechanic to preserve.
- Used 5× in-app (CardResp, InteractivePreview, ShelfCard, WorkDetail, FoundryFeatureSection) — a real consumer contract; keep the `src/alt/className/variant/children` API stable.
