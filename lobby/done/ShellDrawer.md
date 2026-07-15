---
component: ShellDrawer
source: kol-monorepo/apps/web/src/components/shell/ShellDrawer.jsx#L1-L59
date: 2026-07-03
status: draft
deps: [KolWordmark]
---

# ShellDrawer

## Purpose
A portalled slide-in off-canvas panel: a full-width sheet anchored left or right, over a dimming backdrop, with body-scroll lock while open. Used by `ShellLayout` for the mobile navigation drawer, but it is a general primitive — any children go in the scrollable body. Distinct from `FullscreenOverlay` (which fills the whole viewport, not an edge sheet).

## Anatomy
```
createPortal(
  <div class={breakpointClass}>                                  ← e.g. "lg:hidden" gate
    <div class="fixed inset-0 z-[100] bg-black/50" onClick={onClose}/>   ← backdrop
    <div class="fixed inset-y-0 {left-0|right-0} z-[200] flex w-full flex-col
                border-r border-fg-08 bg-surface-primary px-4 md:px-5 lg:px-6 py-4 shadow-2xl">
      {showHeader &&
        <div class="mb-6 flex items-center justify-between">
          <KolWordmark class="h-6 w-auto"/>                       ← baked-in brand → make slot
          <button onClick={onClose} aria-label="Close navigation menu">
            <svg>✕ (12×12 path)</svg>
      <div class="flex-1 overflow-y-auto pr-1" overflowAnchor:none>
        {children}
, document.body)
```
Renders `null` when `!isOpen` (unmount, not hidden).

## Variants
- **anchor** — `left` (`left-0`, default) or `right` (`right-0`).
- **showHeader** — on (default): wordmark + close button; off: bare body only.
- **breakpointClass** — responsive gate wrapper (default `lg:hidden` → mobile-only). Set `''` to show at all sizes.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| isOpen | bool | — | mount/unmount the portal |
| onClose | fn | — | backdrop click + close button |
| anchor | `'left'`\|`'right'` | `'left'` | which edge the panel slides from |
| showHeader | bool | `true` | render the default header (brand + close) |
| breakpointClass | string | `'lg:hidden'` | responsive visibility gate on the portal root |
| children | node | — | scrollable panel body |

## States & interactions
- **Open/close:** conditional-render (`if (!isOpen) return null`). Backdrop and close button both call `onClose`.
- **Body-scroll lock:** `useEffect` sets `document.body.style.overflow = 'hidden'` while open, restores the previous value on cleanup (L13-L18).
- **Portal:** rendered into `document.body` so it escapes any transformed/overflow ancestor.
- **Z-order:** backdrop `z-[100]`, panel `z-[200]`.
- **Missing (flag for DS):** no Escape-to-close, no focus-trap, no focus restore, and no enter/exit transition (the panel just mounts). The DS primitive should add Esc, focus-trap, and a slide transition.

## Styling
- Tailwind utilities; KOL tokens `border-fg-08`, `bg-surface-primary`; backdrop `bg-black/50`; `shadow-2xl`. Panel padding matches the shell content gutters (`px-4 md:px-5 lg:px-6 py-4`). Body uses `overflowAnchor: 'none'` to stop scroll-anchoring jumps.
- No transitions today (see States — add one).
- **App-specific bits to DROP / convert:**
  - **`KolWordmark` is baked into the default header → make it a `brand` slot.** Default the slot to `KolWordmark` for continuity, but let consumers pass any node (or a full custom header).
  - `border-r` is hardcoded even for `anchor="right"` (should be `border-l` on the right anchor) — fix on recreation.
  - Inline close `<svg>` — swap for `Icon name="close"`/equivalent.

## Dependencies
- **@kol/ui:** `KolWordmark` (→ becomes the default `brand` slot; on recreation, close glyph via `Icon`).
- **react-dom:** `createPortal`.
- React `useEffect`.
- No react-router, no app data — clean.

## Recreation notes
- Tier: **molecule** (overlay/drawer primitive). New DS primitive — there is no edge-anchored drawer today; keep it separate from `FullscreenOverlay`.
- Prop seams to keep: `isOpen`/`onClose`, `anchor`, `showHeader`, `breakpointClass`, `children`. Add **`brand`** slot (default `KolWordmark`) and optionally a `header` slot to fully override.
- Add the missing overlay hygiene the DS expects: **Escape-to-close, focus-trap + focus restore, and a slide-in/out transition** (respecting `prefers-reduced-motion`). Fix the `border-r`/`border-l` side to match `anchor`.
- Compose **Icon** for the close button instead of the inline SVG.
- Keep the portal + body-scroll-lock pattern verbatim — that is the primitive's core.
