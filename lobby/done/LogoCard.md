---
component: LogoCard
source: kol-monorepo/apps/brand/src/components/styleguide/LogoCard.jsx#L1-L49
date: 2026-07-10
status: recreated
target: packages/styleguide/src/LogoCard.jsx
deps: [ToggleSwitch, ClearspaceDiagram]
---

# LogoCard

## Purpose
A brand-manual logo plate — the mark centered in a padded frame, an optional
caption, and (when construction overlays are supplied) a `Clearspace` toggle that
reveals the grid + x-height keyline over the mark. Head of the LOGO specimen
family (Bucket A).

## Anatomy
```
figure.kol-logo-card                       (flex flex-col; style aspectRatio)
├─ div.kol-logo-card-frame                 (flex-1 min-h-0 flex-center + frame chrome)
│  └─ <ClearspaceDiagram logo grid keyline framework/>
└─ div (caption row)                       (flex items-center justify-between mt-2)
   ├─ figcaption  | span (spacer)          (kol-helper-12 tracking-wider text-meta)
   └─ <ToggleSwitch variant="bare"/>       ← only when canFramework
```

## Variants
- **framed** (default, `frame`) — `rounded-[4px] overflow-hidden p-8` + `bg-fg-02
  border border-fg-04` (or a custom `backdrop` background, which drops the
  bg/border).
- **frameless** (`frame={false}`) — no chrome; `figureSizing` becomes `h-full`
  when no `aspect`.
- **with / without toggle** — the toggle + caption row only mounts when a caption
  or both overlay nodes exist.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| logo | ReactNode | — | the mark (base layer) |
| grid | ReactNode | `null` | construction-grid overlay (feeds ClearspaceDiagram) |
| keyline | ReactNode | `null` | x-height / clearspace overlay |
| caption | string | — | figcaption text (authored casing) |
| backdrop | string | — | custom frame background (CSS color) |
| aspect | string | `'2 / 1'` | figure `aspect-ratio`; falsy → `h-full` |
| frame | bool | `true` | frame chrome on/off |
| toggleLabel | string | `'Clearspace'` | the toggle's label |
| defaultFramework | bool | `true` | initial toggle state |
| className | string | `''` | extra classes on the figure |

## Styling
All Tailwind inline + DS opacity classes — no CSS block needed:
- Figure: `flex flex-col` (+ `h-full` when no aspect); `style={{ aspectRatio }}`.
- Frame: `flex-1 min-h-0 flex items-center justify-center` + chrome
  `rounded-[4px] overflow-hidden p-8` (radius ≤4px). Fill = `bg-fg-02 border
  border-fg-04` (DS opacity ramp) unless `backdrop` supplies `style.background`.
- Caption: `kol-helper-12 tracking-wider text-meta` (mono label + 48% ink).
- Marker classes `.kol-logo-card` / `.kol-logo-card-frame` are bare hooks.
- **DROPPED** `uppercase` from the caption — casing authored at the call site.

## States & interactions
- Toggle (`ToggleSwitch variant="bare"`) flips `showFramework`, which passes
  `framework` into ClearspaceDiagram → grid + keyline fade in/out over the mark.
- `canFramework = hasFramework({ grid, keyline })` — no overlays → no toggle, mark
  renders bare.

## Dependencies
- `ToggleSwitch` from `@kolkrabbi/kol-component` (variant `bare`; was `plain`).
- `ClearspaceDiagram` (sibling in `@kolkrabbi/kol-styleguide`) does the layering.

## Asset-coupling replaced
- **DROPPED** `import KolLogo from '../../brand/logos/KolLogo'` and the two
  branches (`clearspace ? <ClearspaceDiagram variant/> : <KolLogo variant/>`)
  that resolved a mark from a hardcoded variant string.
- **DROPPED** the `variant` and `clearspace` props (the variant-registry + boolean
  gate are meaningless once nodes are injected).
- **REPLACED WITH** injected `logo` / `grid` / `keyline` nodes fed straight into a
  single `<ClearspaceDiagram>`; the presence of overlay nodes is the gate. The
  two source render branches collapse into one path.
- **RETUNED** `ToggleSwitch variant="plain"` → `"bare"` (DS canonical name; the
  legacy alias still maps, but the DS spelling is used).

## Recreation notes
Tier: **styleguide molecule**. Built, not staged. Frame chrome + caption + toggle
copied verbatim minus `uppercase`. `hasFramework` re-exported from ClearspaceDiagram
via the barrel. Caption + toggle-label text pass through untouched (no
text-transform).
