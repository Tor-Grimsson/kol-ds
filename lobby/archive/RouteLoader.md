---
component: RouteLoader
source: kol-monorepo/apps/web/src/components/layout/RouteLoader.jsx#L1-L12
date: 2026-07-03
status: archived
deps: [LoaderOverlay]
---

> **Archived 2026-07-09** — source is a no-op stub (`() => null`); LoaderOverlay + Suspense fallback covers the intent.

# RouteLoader

## Purpose
The route-transition loader: shows the branded loader while a route/lazy chunk is resolving, then clears it once the destination is ready. **Note the current source is an intentional no-op** (`const RouteLoader = () => null`) — the app removed the blind 500ms per-navigation spinner because data-dependent routes handle their own loading. This spec captures the *intended* reusable component (historical behavior + DS target), not the empty stub.

## Anatomy
- **Current source:** `const RouteLoader = () => null` — renders nothing (kept as a no-op export so `App.jsx` needs no diff).
- **Historically / intended:** a gate that, while a route transition is pending, renders `LoaderOverlay` (→ `ColorLoader`) over the app, and renders nothing once resolved.

## Variants
None. Two states: pending (overlay shown) vs. resolved (null).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| loading *(new)* | boolean | `false` | **Add** — when true, render the overlay; when false, render `null`. Replaces the react-router / blind-timer trigger. |
| onEnter *(new)* | () => void | — | **Add** — forwarded to `LoaderOverlay` / `ColorLoader` exit. |
| children *(new)* | ReactNode | default loader | **Add** — overlay content override (pass-through to `LoaderOverlay`). |

## Styling
- No styles of its own — visual is entirely `LoaderOverlay` → `ColorLoader`.
- **The animation:** none here; inherited from `ColorLoader` (framer-motion reveal/slide-up).
- **App-specific bits to DROP:**
  - The historical **500ms blind timer** on every route change — drop; don't reintroduce a timer-based spinner.
  - **react-router coupling** (the trigger source) → replace with a plain **`loading` boolean** the parent flips, so it's **Suspense-friendly** (e.g. render it as a `<Suspense fallback={<RouteLoader loading />}>` fallback, or gate on a router-agnostic pending flag).

## States & interactions
- **enter / loading:** `loading` true → mount `LoaderOverlay` (loader runs its timed reveal).
- **exit-fade:** `loading` flips false (route/chunk resolved) → parent unmounts, or the loader's own slide-up + `onEnter` runs first; then `RouteLoader` returns `null`.

## Dependencies
- **LoaderOverlay** (staged — `lobby/LoaderOverlay.md`) — what it renders while pending.
- Transitively: `ColorLoader`, DS `FullscreenOverlay`, framer-motion.

## Recreation notes
- **Tier:** wrapper/controller (routing glue; no markup of its own).
- **Relationship:** RouteLoader **wraps `LoaderOverlay`** — it is the "when to show it" layer; `LoaderOverlay` is the "how to mount it" layer; `ColorLoader` is the "what shows" layer.
- **Becomes props:** the trigger. **Drop react-router / the 500ms timer**; expose a router-agnostic `loading` boolean (Suspense fallback friendly). Pass `onEnter` / `children` through to `LoaderOverlay`. No brand values here (all in `ColorLoader`).
- **Animation dep:** none directly (inherited via `LoaderOverlay` → `ColorLoader` → framer-motion).
- **Honesty flag:** ship this only if the DS actually wants a route/Suspense loading gate; the source app deliberately reduced it to `() => null`.
