---
component: LoaderOverlay
source: kol-monorepo/apps/web/src/components/layout/LoaderOverlay.jsx#L1-L12
date: 2026-07-03
status: draft
deps: [ColorLoader, FullscreenOverlay, CursorProvider]
---

# LoaderOverlay

## Purpose
The fullscreen mount for the loader: a fixed, top-layer backdrop that centers the `ColorLoader` (or arbitrary children) and provides the app cursor context it needs. Thin wrapper — its whole job is "put the loader over everything, dead center."

## Anatomy
- `CursorProvider` (app cursor context — **DROP**, see Styling) wrapping:
  - `<div className="fixed inset-0 flex flex-col items-center justify-center z-[100]">` — the full-viewport centered backdrop.
    - `{children || <ColorLoader onEnter={onEnter} />}` — render passed children, else default to `ColorLoader`.

## Variants
None. Default content vs. custom `children`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| children | ReactNode | `<ColorLoader onEnter={onEnter} />` | Overlay content; falls back to the default loader. |
| onEnter | () => void | — | Passed straight to the default `ColorLoader`'s exit callback. |

## Styling
- **Tailwind only:** `fixed inset-0` (full viewport), `flex flex-col items-center justify-center` (center), `z-[100]` (above app chrome). No colors of its own — the backdrop color comes from the child `ColorLoader`.
- **KOL tokens:** none here; layer/z-index should map to a KOL overlay z-token.
- **The animation:** none in this file — all motion lives in the child `ColorLoader`.
- **App-specific bits to DROP:**
  - **`CursorProvider`** — app cursor context (tracks `window` mousemove, exposes `position` for `CursorTrail`). Only present to feed the loader's cursor trail; drop it with the trail.
  - The bare `<div fixed inset-0 … z-[100]>` → **compose DS `FullscreenOverlay`** for the backdrop/portal/z-layer instead of hand-rolling it.

## States & interactions
- **enter / loading:** mounted = overlay visible, loader running.
- **exit-fade:** owns no exit of its own; the child `ColorLoader` runs the slide-up and calls `onEnter` — the parent unmounts this overlay in response.

## Dependencies
- **ColorLoader** (staged — `lobby/ColorLoader.md`) — default content.
- **FullscreenOverlay** (DS) — target for the backdrop/portal/centering.
- App-only (drop): `CursorProvider` / `CursorContext`.

## Recreation notes
- **Tier:** template/wrapper (composition only).
- **Recreation:** compose DS **`FullscreenOverlay`** for the fixed full-viewport, top-`z` backdrop, and mount the loader as `children` (default `ColorLoader`). That replaces the hand-rolled `fixed inset-0 … z-[100]` div and hardcoded z-index (→ KOL overlay z-token).
- **Becomes props:** keep `children` + `onEnter` pass-through; no brand values live here (they're all in `ColorLoader`).
- **Drop the `CursorProvider`** coupling entirely — it exists only to power the app cursor trail. If a custom cursor is desired in the DS, make it an opt-in slot, not a mandatory context wrapper.
- **Animation dep:** none directly (inherited from `ColorLoader` → framer-motion).
