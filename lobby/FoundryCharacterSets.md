---
component: FoundryCharacterSets
source: kol-monorepo/apps/web/src/routes/foundry/components/FoundryCharacterSets.jsx#L1-L66
date: 2026-07-03
status: draft
deps: [GlyphCategory, Button, FoundrySection]
---

# FoundryCharacterSets

## Purpose
The **character-set browser** section: the shared specimen header ("Character Set" + Roman/Italic dropdown) above a stack of `GlyphCategory` blocks rendered in the chosen family/style. Collapsed by default to the first two categories under a gradient-masked fade with a "Show All Glyphs" reveal; clicking expands to every category. Glyph data (`glyphSets`, `glyphCategories`) comes from `@kol/ui/data`.

## Anatomy
- `<section>` — `w-full py-12 lg:py-16`
  - inner — `max-w-[1400px] mx-auto flex flex-col gap-8`
    - `FoundrySection` header — `label="Character Set"`, `size="sm"`, Roman/Italic dropdown
    - categories container — `w-full flex flex-col gap-12 relative`
      - one `GlyphCategory` per visible category (`title`, `glyphs`, `fontFamily`, `fontStyle`)
      - when collapsed (`!showAll`):
        - gradient overlay — `absolute bottom-0 left-0 right-0 h-64 pointer-events-none`
        - reveal — `absolute bottom-0 … flex justify-center` → `Button variant="outline"` "Show All Glyphs"

## Variants
No named variants. Single structural fork: `showAll` — collapsed (first 2 categories + gradient fade + reveal button) vs expanded (all categories, no overlay).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| fontFamily | string | `'TGMalromur'` | family every glyph renders in (**drop brand default**) |
| showDropdown | bool | `true` | render the Roman/Italic style dropdown in the header |

## Styling
- Section: `w-full py-12 lg:py-16`; inner `max-w-[1400px] mx-auto flex flex-col gap-8`.
- Categories: `w-full flex flex-col gap-12 relative`; each `GlyphCategory` gets `fontStyle` = `italic|normal` and, at collapsed index 1, `className="relative"`.
- Reveal button: KOL `Button variant="outline"`, centered.
- **App-specific bits to DROP:**
  - **`fontFamily = 'TGMalromur'`** — hardcoded brand-font default. Make prop-driven / required; the browser must not assume a typeface.
  - **Hardcoded gradient color** — the fade uses `linear-gradient(to bottom, rgba(18,18,21,0) 13%, rgba(18,18,21,1) 86%)`, i.e. the app's literal dark background baked into the overlay. This **breaks in light theme**. Replace with a theme-aware KOL background token (e.g. gradient from `transparent` to `var(--kol-bg)` / the surface token) so the mask matches whatever surface it sits on. This is the priority drop for this component.
  - The collapsed count (`slice(0, 2)`) and overlay height (`h-64`) are reasonable defaults; consider exposing `collapsedCount` if the DS wants tuning.

## States & interactions
- `selectedStyle` — Roman/Italic (init `'italic'`); controlled by the header dropdown; sets every category's `fontStyle`.
- `showAll` — init `false`; `visibleCategories = showAll ? all : first 2`; "Show All Glyphs" sets it `true` (one-way expand; no collapse-back in source).
- Gradient overlay is `pointer-events-none` so it never blocks the button beneath it.

## Dependencies
`GlyphCategory` from `@kol/ui` (the `@kol/ui/foundry` primitive it composes), `Button` from `@kol/ui`. Data: `glyphSets`, `glyphCategories` from `@kol/ui/data`. `FoundrySection` (local sibling header).

## Recreation notes
- Tier: **organism / section**.
- Composes the **`GlyphCategory`** `@kol/ui/foundry` primitive (one per category) under the shared `FoundrySection`/`SpecimenSectionHeader`, fed by the shared `@kol/ui/data` glyph data.
- Part of the **Type Specimen sections** set — the glyph-browser member; keep the header idiom identical to the other sections.
- Two required fixes on promotion: (1) make `fontFamily` prop-driven (no `TGMalromur` default); (2) swap the hardcoded `rgba(18,18,21,…)` gradient for a KOL surface token so the fade is theme-aware.
- Text casing at call site: `label="Character Set"`, category titles, and the "Show All Glyphs" button string render verbatim — no `text-transform`.
