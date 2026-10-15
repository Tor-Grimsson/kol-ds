---
component: IconToggle
source: kol-mirror/src/components/hall-of-mirrors/SymphonyMixer.jsx#L1037-L1079
staged: 2026-10-15
status: draft
deps: [Icon]
---

# IconToggle

## Purpose
An icon-only toggle button: the icon is the control, the state is its ink, the name is the tooltip. kol-mirror's studio chrome (Frame · Grid · Lock) — user ruling 2026-10-15: *"why is everything in brackets icon AND TEXT? all of this is also listed in shortcuts so? Icontoggle or just iconframe? because we want to minimise noise"*. `IconFrame` is static by design (no states) and `ToggleBracket` is text, so neither fits.

## Anatomy
- button (24×24, centred)
  - Icon (16)

## Variants
- `tone="default"` — on = full ink, off = faint ink.
- `tone="danger"` — on = red ink (the Lock: a locked view reads as a warning), off = faint.
- An icon swap on state (Lock uses `unlock` → `lock`): `icon` + optional `iconOn`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `pressed` | bool | false | state; sets `aria-pressed` |
| `onChange` | (next) => void | — | toggle |
| `icon` | string | — | Icon name when off (and on, without `iconOn`) |
| `iconOn` | string | — | Icon name when on |
| `label` | string | — | `aria-label`, required (there is no visible text) |
| `title` | string | label | tooltip — mirror passes name + key, e.g. "Lock the view (L)" |
| `tone` | `'default' \| 'danger'` | default | on-state ink |
| `size` | `'sm' \| 'md'` | sm | 24 / 32 box |

## Styling
- Box `flex items-center justify-center`, 24×24, no background, no border.
- Ink: on `var(--kol-fg-96)`, off `var(--kol-fg-32)`, danger-on `rgba(231,76,60,0.9)` — **drop** that raw red for the DS's danger token.
- Group spacing at the call site (`gap-3`); mirror gives the group `md:pr-4`.

## States & interactions
on / off by ink; hover nudges off-ink to `--kol-fg-64` (mirror has none — add it); focus-visible ring per kol-btn; disabled at fg-12.

## Dependencies
Icon. Nothing consumer-side.

## Recreation notes
Atom, beside `IconFrame` and `ToggleBracket` — the interactive twin of `IconFrame`. Mirror replaces its three plain `<button>`s on the bump.

## ✅ RESOLUTION — 2026-10-15 · kol-component@0.261.0

IconToggle ships (with kol-theme@0.174.0 .kol-icon-toggle): pressed/onChange, icon + iconOn, label (required, aria-label), title (DS Tooltip, default label), tone default|danger, size xs|sm|md. Ink on the oq ladder — off 32, off-hover 64, on 96, disabled 12; danger-on is --ui-error, not the raw red. Squares on the size ladder 22/26/32 — the spec's 24 is not a rung, so sm is 26. Verified: aria-pressed flips, danger-on renders the error red, focus ring is the KOL ring.

**Remainder here:** none — kol-mirror bump kol-component@0.261.0 + kol-theme@0.174.0; swap the three studio buttons (Frame · Grid · Lock).

