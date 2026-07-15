---
component: ErrorBoundary
source: kol-monorepo/apps/web/src/components/errors/ErrorBoundary.jsx#L1-L102
date: 2026-07-03
status: draft
deps: [Button]
---

# ErrorBoundary

## Purpose
A React class error boundary. Catches render errors in its subtree and swaps in a token-styled, centered full-screen fallback ("Something went wrong") with a dev-only error/stack panel and two recovery actions (reset in place, go home). Wraps app regions to prevent a single crash from blanking the whole app.

## Anatomy
```
(class component — must be a class, error boundaries can't be hooks)
render():
  hasError === false → this.props.children   (pass-through)
  hasError === true  → fallback:
    div  min-h-screen w-full flex items-center justify-center px-8  (surface-primary bg)
    └── div  max-w-[600px] space-y-8 text-center
        ├── div  space-y-4
        │   ├── h1  "Something went wrong"           (kol-heading-display)
        │   └── p   reassurance copy                 (kol-mono-text text-lg, opacity .7)
        ├── (dev only) div  error panel              (surface-secondary bg, rounded, max-h-300 overflow-auto)
        │   ├── p    "Error Details (dev only):"     (kol-mono-xs font-bold)
        │   └── pre  error.toString() + componentStack (kol-mono-xs, whitespace-pre-wrap break-all)
        └── div  flex gap-4 justify-center flex-wrap
            ├── button  "Try again"  → handleReset
            └── a href="/"  "Go home"
```

## Variants
- **Pass-through** (`hasError: false`): renders `children` untouched.
- **Fallback** (`hasError: true`): the error screen above.
- **Dev sub-variant:** the error-details panel renders only when `process.env.NODE_ENV === 'development'` AND `state.error` is set.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| children | node | — | the guarded subtree |

(No other props. State: `{ hasError, error, errorInfo }`.)

## Styling
- Outer: `min-h-screen w-full flex items-center justify-center px-8`; inline bg `var(--kol-surface-primary)`.
- Inner: `max-w-[600px] space-y-8 text-center`.
- Heading `h1`: class `kol-heading-display`; inline color `var(--kol-surface-on-primary)`.
- Body `p`: class `kol-mono-text text-lg`; inline color `var(--kol-surface-on-primary)` + `opacity: 0.7`.
- Dev panel: `text-left p-6 rounded overflow-auto max-h-[300px]`; inline bg `var(--kol-surface-secondary)`, color `var(--kol-surface-on-primary)`.
- Dev panel label: `kol-mono-xs font-bold mb-2`. Pre: `kol-mono-xs whitespace-pre-wrap break-all`.
- Action row: `flex gap-4 justify-center flex-wrap`.
- "Try again" button: `px-6 py-3 rounded transition-opacity kol-mono-text`; inline bg `var(--kol-surface-on-primary)`, color `var(--kol-surface-primary)` (inverted/primary emphasis).
- "Go home" anchor: `px-6 py-3 rounded transition-opacity kol-mono-text inline-block`; inline bg `var(--kol-surface-secondary)`, color `var(--kol-surface-on-primary)` (secondary emphasis).
- KOL tokens: `var(--kol-surface-primary)`, `var(--kol-surface-on-primary)`, `var(--kol-surface-secondary)`; type classes `kol-heading-display`, `kol-mono-text`, `kol-mono-xs`.
- **App-specific bits to DROP / rework:**
  - `href="/"` hard link on "Go home" — app-routing assumption; make it an `onHome`/`homeHref` prop (default `/`) so the DS doesn't bake in a route.
  - `process.env.NODE_ENV` gate — replace with a `showDetails` prop (or a build-time DS convention) rather than reading app env directly.
  - Inline `onMouseOver`/`onMouseOut` opacity hacks (see States) — replace with CSS hover.
  - `console.error` in `componentDidCatch` — keep, but consider an `onError` callback prop so the app can wire its own logger.

## States & interactions
- **hover** on both actions: currently done imperatively — `onMouseOver` sets `currentTarget.style.opacity = '0.8'`, `onMouseOut` resets to `'1'`, riding the `transition-opacity` class. Recreate as a real CSS `:hover { opacity: .8 }` (or use DS Button hover) instead of inline JS handlers.
- **Try again** (`handleReset`): resets state to `{ hasError:false, error:null, errorInfo:null }`, re-rendering children (retry in place).
- **Go home**: plain anchor navigation to `/`.
- No focus/active/disabled/selected states in source. Both actions should get real focus-visible styling in the DS version.

## Dependencies
- No DS components in source — hand-rolled `<button>` / `<a>`. On recreation, compose **Button** for both actions (Button primary for "Try again", Button secondary/variant for "Go home", rendered `as="a"` with `href`). That also removes the inline hover hack.
- Must remain a **class component** (React error boundaries require `getDerivedStateFromError` + `componentDidCatch`; no hook equivalent). Optionally expose a functional wrapper that renders the class.

## Recreation notes
- Tier: **organism** (full-screen fallback layout composing text + actions), though the boundary mechanics are the real payload.
- Keep class-component shape: `getDerivedStateFromError` → `{ hasError:true }`; `componentDidCatch` stores `error`/`errorInfo` and logs.
- Turn hardcoded behaviors into props: `homeHref` (default `/`), `showDetails` (default off / dev), optional `onError`, optional `title`/`description`/`fallback` render override.
- Tokens port 1:1 (`surface-primary`, `surface-on-primary`, `surface-secondary`) — no hex present, nothing to swap.
- Replace imperative mouseover opacity with CSS/Button hover; add focus-visible.
- Text casing: strings ("Something went wrong", "Try again", "Go home", "Error Details (dev only):") are authored as-is at call site — no auto text-transform; keep verbatim (they are user-facing copy — do not reword on port).
- The dev panel's `error.toString()` + `componentStack` should stay gated so prod users never see a stack.
