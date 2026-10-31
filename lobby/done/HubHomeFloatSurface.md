---
component: HubHome (signed-out dock and +)
source: kol-fxr — Home signed out, kol-shell 0.92.0 HubHome.jsx#L309
staged: 2026-10-31
status: draft
deps: [HubHome, AppFloatNav]
---

# HubHomeFloatSurface

## Purpose
kol-shell 0.92.0 gave AppFloatNav `surface` (solid · glass-dark · glass-light), but HubHome renders the signed-out dock and the + without one, so an app cannot pick the material for the floats over its stage. The user, 2026-10-31: *"we can see it first, but I think probably solid"* — fxr wants to try the glasses over its growing line.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `home.surface` (or a HubHome prop) | `'solid' \| 'glass-dark' \| 'glass-light'` | `'solid'` | the dock, its ··· circle and menus, and the + |

## Recreation notes
- Pass it through to `AppFloatNav variant="dock"` and the + button's float.
- Acceptance: fxr passes each surface and the dock and + match the showcase's AppFloatNav for that surface, light and dark.

## ✅ RESOLUTION — 2026-10-31 · kol-shell@0.93.0

HubHome surface="solid|glass-dark|glass-light" (AppHub: home.surface, default solid = unchanged) reaches the signed-out dock (AppFloatNav variant=dock — pill, ··· circle, sheets), the + and its menu; on a glass the + wears the float material instead of the inverted round button. Verified in studio-hub, all three surfaces, light and dark.

**Remainder here:** none — kol-fxr bump kol-shell@0.93.0.

