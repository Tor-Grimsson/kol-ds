# OverlayScrimBlur — drop the backdrop blur from the overlay scrim

**Filed:** 2026-09-01 ← **kol-website**
**Package:** `@kolkrabbi/kol-theme` — `kol-components-molecules.css:856`
**Origin:** user's mobile review of `/workshop` search. His call, not a defect report.

## The problem

```css
.kol-overlay-scrim {
  background-color: color-mix(in srgb, #000 60%, transparent);
  backdrop-filter: blur(1px);
}
```

The user does not want the blur. Worth noting on the cost side: 1px is doing very
little visually for the price of a compositing layer on every overlay open, on a
phone. The 60% tint is already the separation — the class's own comment argues
exactly that when it explains why the panel has no border or shadow.

## The ask

Remove `backdrop-filter: blur(1px)`. Keep the tint.

If the blur is load-bearing somewhere else — the class is shared across three
scrims by its own comment — say so and it becomes a per-scrim value instead.

## Remainder here once it ships

bump; nothing local to remove.

## ✅ RESOLUTION — 2026-09-01 · kol-theme@0.117.0

Removed backdrop-filter: blur(1px) from .kol-overlay-scrim; the 60% tint stays. The class is shared by three call sites (search overlay, drawer backdrop, FieldRow's close disc) and the blur was load-bearing in none of them — all three lose it together. Panel comment updated to match.

**Remainder here:** none — kol-website bump kol-theme@0.117.0; nothing local to remove.

