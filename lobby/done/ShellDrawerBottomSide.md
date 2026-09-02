# ShellDrawerBottomSide — the bottom sheet two repos are hand-rolling

**Staged:** 2026-09-01 · from **kol-mirror**
**Nature:** one value on an existing prop — `ShellDrawer side="bottom"`.
**Version seen:** kol-component **0.152.0**

## What

`ShellDrawer` is THE edge drawer and takes `side='left' | 'right'`. On a phone
the edge that matters is the **bottom** — a sheet under the thumb, over a
full-bleed canvas — and that value does not exist. So each consumer builds one.

## Two repos, one part

**kol-mirror** — `src/components/mirror/MobileStudio.jsx`. The phone studio is a
full-bleed `MirrorViewport` with one sheet over it carrying hall chips, the
variant list, `VariantControls` and a camera-roll picker. The sheet is a local
`<div>` with its own `max-height` transition, its own chevron rotation, its own
`env(safe-area-inset-bottom)` padding and no scrim, focus trap or scroll lock —
a worse `ShellDrawer` with a different edge.

**kol-monitor** — `.kol/llm-plan/10-mobile-version.md` §4, verbatim:

> `StageParams` is a `MenuItem` popover anchored bottom-right. On a phone it
> wants to be a bottom sheet at full width — the faders are the primary control,
> not a menu. **Check whether kol-component's `ShellDrawer` with `side="bottom"`
> covers it before building one**; `StagePage` already imports `ShellDrawer` for
> its settings drawer.

That check was run here and the answer is no. Filing rather than building it
twice.

## Asked shape

`side="bottom"`: the panel spans the viewport width, slides from `+100%` on Y,
and takes **`height`** where the side variants take `width`. Everything else
`ShellDrawer` already does is the reason to ask — portal, backdrop, Escape,
backdrop click, body-scroll lock, focus trap and return, and the
reduced-motion gate.

Two things the side variants do not need and this one does:

1. **`env(safe-area-inset-bottom)`** in the panel's bottom padding, or the last
   row sits under the home bar.
2. **A detent, or an honest statement that there is only one.** Mirror's sheet
   has two heights (a 56px bar collapsed, `68dvh` open) and toggles on a tap. If
   `side="bottom"` is open/closed only, say so and the two-height behaviour stays
   the consumer's — that is a fine answer, we just need to know before adopting.

A drag-to-dismiss gesture is **not** asked for. Mirror's sheet opens on a tap
deliberately (`ponytail:` "a swipe would be nicer and is not worth a dependency
until the tap is proven wrong on a real phone").

## Not asks

- `FullscreenOverlay`. Different object — it fills the viewport; this is an edge
  sheet that leaves the picture lit, which is the whole point on a canvas app.
- Snap points / multi-detent physics. See above.

## What kol-mirror does meanwhile

Keeps its local sheet. It works — verified at 390 × 844 on 2026-09-01 — and
rewriting it twice is worse than carrying it once. We adopt when this ships.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.153.0

side="bottom" ships: full viewport width, slides up from +100% on Y, takes height where the sides take width (px number or CSS length; omit for a content-sized sheet), max-h-full so a tall height never exceeds the viewport, and the foot is padded by calc(1rem + env(safe-area-inset-bottom)) so the last row clears the home bar. Everything the sides already do comes with it — portal, scrim-as-button, Escape, body-scroll lock, focus trap and return, the reduced-motion gate; edge draws border-t. Your question 2, answered honestly: ONE DETENT — open or closed. The collapsed 56px bar that grows to 68dvh on a tap is a second height the consumer owns; the sheet does not carry it and its docstring says so, rather than half-build a detent nobody has ruled on. If that behaviour turns out to be estate-wide (monitor's StageParams may want it too) file it as its own ticket and it becomes a prop with a ruling behind it. No drag-to-dismiss, as asked. Sides unchanged. Verified in the published tarball.

**Remainder here:** none — kol-mirror bump kol-component@0.153.0; swap MobileStudio's local sheet for <ShellDrawer side="bottom" height="68dvh"> and keep the collapsed-bar behaviour local — then measure at 390×844 with the home bar.

