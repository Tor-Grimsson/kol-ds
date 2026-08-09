---
component: InteractiveImage
source: kol-monorepo/apps/web/src/components/media/InteractiveImage.jsx#L1-L112
date: 2026-07-03
status: closed
deps: [Image]
staged: 2026-07-03
---

# InteractiveImage

# ⚠️ ORPHANED — 0 importers in apps/web/src (confirmed via grep). No live consumer. Lobby it, but flag for the DS to treat as a fresh effect, not a migration.

## Purpose
An image displayed through an organic **blob clip-path** SVG mask, sitting over a blurred, scaled-up copy of the same image (a soft backdrop). On mouse move the SVG **tilts in 3D** toward the pointer (GSAP `rotateX/rotateY` with perspective) and the clip-path blob **re-centers on the cursor** (the blob's SVG `<path>` transform tracks the pointer position). One prop: `imageUrl`.

## Anatomy
- Root `<div className="relative w-full h-full">` with `onMouseMove` / `onMouseLeave`.
- **Layer 1 — blurred backdrop:** `<div className="absolute inset-0">` with inline `backgroundImage: url(imageUrl)`, `backgroundSize: cover`, `backgroundPosition: center`, `filter: blur(10px)`, `transform: scale(1.1)`.
- **Layer 2 — interactive SVG:** `<svg ref className="relative w-full h-full z-10">`, `viewBox="0 0 {width} {height}"` (sized from a ResizeObserver).
  - `<defs>`:
    - `<clipPath id="final-clip-path">` containing a single normalized blob `<path>` (`d="M.96.217L.855.834...Z"`, unit-square coords) whose `transform` is `translate({xPos - width/2} {yPos - height/2}) scale({width} {height})` — i.e. scaled up to element size and offset so its center follows the cursor.
    - `<pattern id="image-pattern" patternUnits="userSpaceOnUse" width height>` holding an `<image href={imageUrl} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">`.
  - `<rect width="100%" height="100%" fill="url(#image-pattern)" clipPath="url(#final-clip-path)">` — the visible masked image.

## Variants
None. Single behavior, single prop.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| imageUrl | string (URL) | — (required) | Source used three times: backdrop `background-image`, SVG `<pattern>` `<image href>`. |

## Styling
- Tailwind: `relative w-full h-full` (root), `absolute inset-0` (backdrop), `relative w-full h-full z-10` (svg).
- Inline (backdrop): `backgroundSize: cover`, `backgroundPosition: center`, `filter: blur(10px)`, `transform: scale(1.1)`.
- GSAP inline transforms on the SVG: `rotateX`, `rotateY`, `transformPerspective: 500` (set once via `gsap.set`).
- **No KOL tokens / no hex colors** — the component is purely image-driven, so nothing to swap.
- **App-specific bits to DROP:** none of consequence — it's already self-contained (no context, no routes, no app tokens). The hardcoded SVG id strings (`final-clip-path`, `image-pattern`) are **module-global and will collide if two instances mount** — the DS version must namespace them per-instance (e.g. `useId()`), otherwise multiple InteractiveImages on one page share/clobber the same clip/pattern.

## States & interactions
- **Mount (`useLayoutEffect`):** a `ResizeObserver` on the SVG updates `size = {width, height}` (drives viewBox + pattern + blob scale); `gsap.set(svg, { rotateX:0, rotateY:0, transformPerspective:500 })`. Observer disconnected on unmount.
- **`onMouseMove`:** compute pointer relative to the element rect → set `mousePos {x,y}` (re-centers the blob path via its `transform`). Tilt: `rotateX = ((y - centerY)/centerY) * -10`, `rotateY = ((x - centerX)/centerX) * 10`; applied with `gsap.to(svg, { duration: 0.5, rotateX, rotateY, ease: 'power1.out' })`. Max tilt ±10°.
- **`onMouseLeave`:** `gsap.to(svg, { duration: 0.5, rotateX: 0, rotateY: 0, ease: 'power1.inOut' })`.
- **Idle default:** before first move, `xPos/yPos` fall back to `size.width/2` / `size.height/2` (blob centered).

## Dependencies
- `gsap` core only (no plugins).
- React `useState`, `useLayoutEffect`, `useRef`, and the browser `ResizeObserver`.
- Could optionally consume the DS **Image** for the `<image>`/backdrop source, but the effect needs raw `<image href>` inside SVG + a CSS `background-image`, so a plain URL prop is the honest API.

## Recreation notes
- **Tier:** molecule (single visual effect, one prop, self-contained).
- **Orphaned:** no importers — recreate as a clean effect component; there's no consumer contract to preserve.
- **Values that should become props:** max tilt angle (±10), perspective (500), tilt in/out durations (0.5s) + eases (`power1.out` / `power1.inOut`), backdrop blur (10px) + scale (1.1). Consider exposing the blob `d` path so the mask shape is swappable.
- **Animation library the DS must declare:** `gsap` (core, no plugins).
- **Critical fix on promotion:** namespace the two SVG ids (`final-clip-path`, `image-pattern`) per instance via `useId()` — the current module-global ids break multi-instance usage.
- **Tokens:** none to swap.
- Add a `prefers-reduced-motion` / coarse-pointer guard (no tilt on touch) — source has neither.

---

## Resolution — 2026-08-01

**Recreated as** `packages/component/src/atoms/InteractiveImage.jsx` (component **0.19.0**).

**Tier: atom, not molecule.** The spec proposed molecule; `pnpm validate` refused it
— `molecule-test: nests no KOL component`. TiltCard sits in atoms for exactly the
same reason. The gate ruled, not the spec.

**gsap was dropped entirely.** `hooks/useTilt.js` calls itself "the ONE tilt hook"
and is framer-motion springs; the source's `gsap.to(rotateX/rotateY)` tweens were a
fork of it by another name. Composing `useTilt` means this effect now shares a feel
with TiltCard and BentoCard instead of introducing a second one. The spec's
"animation library the DS must declare: gsap" is therefore **not** what shipped —
framer-motion, already a peer, carries it. No dependency was added.

**The critical fix landed.** Both SVG ids are per-instance via `useId()`
(`kol-ii-clip-…` / `kol-ii-pattern-…`). The module-global `final-clip-path` /
`image-pattern` in the source clobbered each other on a second mount — the reason
this was lobbied as a fresh effect rather than a migration.

**`useCoarsePointer` was promoted, not forked.** TiltCard held a local copy; this
became the second consumer, so it moved to
`packages/component/src/hooks/useCoarsePointer.js` and TiltCard now imports it.
Motion is gated twice — reduced-motion **and** coarse pointer — and no listeners
mount when either is true.

**Values that became props:** `shape` (the mask path, unit-square coords),
`magnitude`, `perspective`, `blur`, `backdropScale`. **No `--kol-*` token carries a
blur radius** — checked, zero hits across `packages/theme`. Stated rather than
improvised: the default stays a prop until the DS decides it wants a token.

**Where to see it:** `/components/interactive-image` (demo
`showcase/src/demos/InteractiveImage.jsx`, stage `lg`). Inventory row + hooks table:
`docs/documentation/03-components/01-inventory.md`.

14 gates clean at close.

---

## ✅ RESOLUTION — 2026-08-01

🟢 `closed`. **Shipped and published:** `@kolkrabbi/kol-component@0.19.0`
(registry, 2026-08-01) — `export { default as InteractiveImage } from
'./atoms/InteractiveImage.jsx'`.

```jsx
import { InteractiveImage } from '@kolkrabbi/kol-component'
```

**No receipt returned, and none is owed.** The header's ORPHANED flag held: the
named source `kol-monorepo/apps/web/src/components/media/InteractiveImage.jsx` no
longer exists anywhere — `kol-monorepo` is now `kol-apps/kol-labs-monorepo`, and a
sweep of every `apps/*/src` tree in kol-labs-monorepo and kol-website found **zero
hits** for `InteractiveImage` (2026-08-01). There is no fork to retire and no repo
to tell. It shipped as a fresh effect, exactly as the flag asked.
