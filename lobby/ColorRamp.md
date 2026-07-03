---
component: ColorRamp
source: kol-monorepo/apps/brand/src/components/sections/ColorRamp.jsx#L1-L129
date: 2026-07-03
status: draft
deps: [ColorSwatch]
---

# ColorRamp

## Purpose
A single ramp row of **live token chips** — reads each `--{ramp}-{stop}` CSS var at
mount and renders it as a swatch with its resolved hex label. Name + optional note +
N chips. The file ALSO exports the genuinely reusable resolver helpers
(`resolveCssVar`, `resolveCssVarRaw`, `LiveValue`, `Chip`) — these are the real
reusable core, not just the row. Part of the color-specimen kit.

## Anatomy
```
div (flex-col gap-3, py-5, border-b border-fg-08 last:border-b-0)
├─ header (flex, items-baseline, justify-between)
│  ├─ span   (ramp label, mono)
│  └─ span   (note, italic — optional)
└─ div.grid  (grid-cols-5 | sm:grid-cols-10)
   └─ Chip × N
      ├─ swatch  (aspect-square, bg = var(--{ramp}-{stop}))
      └─ meta    (name + resolved hex, mono)
```

## Variants
- **5-stop** (default `[100,200,300,400,500]`) → `grid-cols-5`.
- **10-stop** → `grid-cols-5 sm:grid-cols-10`.
- Per-chip **anchor** ring when `anchor === stop`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| ramp | string | — | ramp key; each chip resolves `--{ramp}-{stop}` |
| anchor | number | — | stop that gets the canonical-anchor outline + ★ |
| stops | number[] | `[100,200,300,400,500]` | which stops to render |
| note | string | — | right-aligned italic caption |

## Styling
- Row: `flex flex-col gap-3 py-5 border-b border-fg-08 last:border-b-0`.
- Label: `text-[12px] uppercase tracking-widest font-mono text-emphasis`.
- Note: `text-[11px] text-meta italic max-w-[60ch] text-right`.
- Chip swatch: `aspect-square rounded-[3px] border border-fg-08`, anchor adds `outline outline-2 outline-offset-2 outline-fg-48`; `background-color: var(--{token})` inline.
- Chip meta: `font-mono leading-tight`, name `text-[10px] text-emphasis`, hex `text-[10px] text-meta`.
- **DROP:** `uppercase` on the label (author casing at call site). Prefer the defined mono type scale (`kol-helper-10` / `kol-helper-12`) over the raw `text-[10px]/[11px]/[12px]` arbitrary sizes at recreation.

## States & interactions
Static — chips resolve once on mount (`useEffect`).

## Dependencies
- Local `Chip` → recreate composing DS **`ColorSwatch`** (the chip primitive already exists).
- `resolveCssVar` / `resolveCssVarRaw` — the probe-based CSS-var resolvers (see below).

## Recreation notes
Tier: **molecule** (`ColorRamp`). Two headline moves:
1. **Extract `resolveCssVar` / `resolveCssVarRaw` into a shared DS util** (e.g. `packages/theme` util or a `useCssVar(token)` hook). `resolveCssVar` forces full `var()` chain resolution via a hidden probe node → `getComputedStyle().color` → uppercase hex; `resolveCssVarRaw` returns the literal declared value (sizes/families). `SpectrumGrid`, `Chip`, and any palette/generator should import this one resolver instead of re-declaring `getComputedStyle` reads.
2. **Reconcile the three color-doc widgets** onto one live-var swatch-chip primitive: `Ramp` (static hex input) · `ColorRamp` (live single ramp) · `SpectrumGrid` (live matrix). Compose DS `ColorSwatch` for the chip; label casing authored at the call site.
