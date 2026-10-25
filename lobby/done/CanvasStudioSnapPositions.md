# CanvasStudioSnapPositions

**Staged:** 2026-10-25 · from a kol-mirror session (plan 13 § 1.2)
**Change:** `CanvasStudio` gains monitor's nine snap positions on `1–9` — the view pans to the content's corners, edges and centre, numpad-laid

---

## The problem, in one case
kol-mirror's desk now sits on `CanvasStudio` (kol-component 0.301.0). Its digits used to flip channel cards; the user ruled that wrong (*"why does 1 flip 1? thats not right."*) and that mirror reuse monitor's keys (*"read monitor and see what shortcuts they have set as convention and reuse those shortcuts instead of trying to reinvent everything, that just causes drift"*). On monitor's rack `1–9` snap the view (`kol-monitor/src/rack/RackViewport.jsx:189–215`, listed as "Snap positions · 1–9"): 7/8/9 top, 4/5/6 middle, 1/2/3 bottom, each left/centre/right, `snapPadding` 48, pan only, never zoom, skipped while typing or with ⌘/Ctrl. `CANVAS_KEYS` has no snap, so mirror leaves `1–9` unbound rather than build a fourth local copy.

## The fix
`useCanvasViewport` / `CanvasStudio` bind `1–9` to the nine snap positions against the layer's content box (monitor's math), an opt-out prop for a canvas that needs its digits, and a `CANVAS_KEYS` row `{ id: 'snap', label: 'Snap positions', combo: '1–9', surface: 'studio' }`.

## Definition of done
- [x] `1–9` snap on CanvasStudio; the row is in `CANVAS_KEYS`
- [x] Published; kol-mirror's receipt names the version

## 🟡 Built — 2026-10-25, unpublished

`useCanvasViewport` takes `snapKeys` · `content` · `snapPadding`; `CanvasStudio` binds `1–9` by default (`snapKeys={false}` opts out, `snapRef` names the box — else the union of the layer's children), monitor's math on the view's screen-space translate; `CANVAS_KEYS` carries `{ id: 'snap', label: 'Snap positions', combo: '1–9', surface: 'studio' }`; `SNAP_PADDING` 48 exported. Walk `_tmp/2026-10-25-rail-roles/snap.mjs` on studio-hub's `/studio`. Publish waits on his review of the rail wave in the same package.

## 🟢 CLOSED — 2026-10-25 · kol-component 0.302.0 live

Shipped as built: `1–9` on `CanvasStudio` (`snapKeys`, `snapRef`), `useCanvasViewport` `snapKeys` · `content` · `snapPadding`, the `snap` row in `CANVAS_KEYS`, `SNAP_PADDING`. Registry live. Receipt returned to kol-mirror's outbox.
