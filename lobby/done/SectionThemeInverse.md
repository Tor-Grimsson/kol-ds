---
component: SectionThemeInverse
source: kol-website/apps/web/src/routes/Studio.jsx#L31-L60
staged: 2026-08-27
status: draft
deps: [SectionHero, SectionSplit, SectionCards, kol-theme]
---

# SectionThemeInverse — `theme="inverse"` on the section organisms

## Purpose

User, 2026-08-27, on the Studio split hero: invert the card — **not** with
inverse classes on elements, but by setting the card to the **paired theme**
of whatever is live. Every token resolves to its counterpart (surface-primary
↔ the other theme's surface-primary, on-primary ↔ its ink, the fg ramp,
borders, everything), the card renders as if the other theme were active, and
it flips again when the user toggles. Done in other repos already; nothing in
the section set takes such a prop today (only `Divider` has an `inverse` flag).

## Ask

`theme` prop on **`SectionHero` · `SectionSplit` · `SectionCards`**:

| value | means |
|---|---|
| `undefined` | inherit (today) |
| `'inverse'` | the paired theme of the nearest live one — light page → the section is dark, dark page → light; follows the toggle |
| `'light'` / `'dark'` | pinned, if the theme layer already has both scopes (today only `.dark` is subtree-scopable; a `.light` scope would be needed) |

Mechanism is the DS's call — the theme is already a scope (the dark block is
a class/attr selector, not `:root`-bound), so `inverse` is a scoped remap of
the full token set, not a per-utility swap like `bg-surface-inverse`. Whatever
carries it should be one attribute on the section (`data-theme` or a scope
class the theme resolves relative to its parent), so children — Buttons,
Pills, ProfileCard, the glass panel — flip for free.

## Consumer state

Studio hero (`variant="split"`) is the first user: `theme="inverse"` and
nothing else.

## ✅ RESOLUTION — 2026-08-27 · kol-component@0.81.0

`theme` on `SectionHero` · `SectionSplit` · `SectionCards`: `inverse` = the paired theme of the nearest live one, following the toggle; `light` / `dark` pinned; omit to inherit. One attribute — `data-theme` stamped on the section root (plus the surface painted) — and every token inside resolves to the other theme's through kol-theme's subtree scopes (0.52.0), so Buttons, Pills, the glass panel flip for free; no inverse classes. Resolved in JS (`useSectionTheme`: an observer on `<html>` + the scheme query + the nearest stamped ancestor), so it follows the toggle and an inverse inside an inverse flips back. Measured on the showcase split hero: page light → section stamped dark, `#121215` ground, `#fafafa` ink; page toggled dark → section stamped light, `#fafafa` / `#121215`; toggled back → flips back.

**Remainder here:** none — kol-website bump kol-component 0.81.0; Studio hero: `theme="inverse"` and nothing else.

