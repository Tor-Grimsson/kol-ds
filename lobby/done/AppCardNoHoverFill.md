---
component: AppCardNoHoverFill
source: kol-ds-ui/packages/component/src/molecules/AppItem.jsx#L79-L86 · kol-ds-ui/packages/component/src/molecules/ContentCard.jsx#L482-L494
staged: 2026-10-23
status: draft
deps: [ContentCard, ContentRow, useAppItem]
---

# AppCardNoHoverFill — a clickable `app` card takes no surface hover fill

## Purpose
The user ruled 2026-10-22 *"remove the card background color change on hover"* for the file card. `file`
honours it (`HOVER.file` has no fill). `app` does not: `useAppItem` forces `tone: 'secondary'`, and a toned,
clickable card takes `--kol-tone-hover-bg` (`.kol-tone-secondary` → `var(--kol-oq-08)`). The catalog
reference app never shows it because its `app` cards get no `onClick` — so they are not interactive and
`kol-content-hover` is never applied. Every real consumer opens the file on click, so every real consumer
gets the fill.

## Evidence
kol-fxr `/library`, kol-component 0.292.0 · kol-theme 0.183.0, one preset card:
- rest `rgb(18, 18, 21)` → hover `color(srgb 0.143 0.143 0.154)` (≈ `rgb(37, 37, 39)`).
- class list: `kol-card … kol-tone-secondary … cursor-pointer select-none kol-content-hover`, inline `--kol-content-hover-bg: var(--kol-tone-hover-bg)`.
- same card with `kol-content-hover` stripped: hover stays `rgb(18, 18, 21)` — what the reference shows.

## Ask
A clickable `app` card **and row** take no surface hover fill — the cover zoom and the corner controls
stay its hover, same as `file`. The rest ground (`tone` secondary) is unchanged. The consumer passes
nothing; fxr changes no code, it takes the fix by a bump.

## States & interactions
- rest: tone secondary ground (unchanged).
- hover (clickable): **no bg change**. Cursor pointer stays.

## Recreation notes
Probably one line: for `app`, don't hand the tone's hover step to `--kol-content-hover-bg` (or have
`useAppItem` return a `hover: false`/`hoverBg: null` the card honours). Check ContentRow for the same path.
Add `onClick` to the catalog reference app's `app` cards so the reference shows what consumers see.

## Resolution — 2026-10-22 · kol-component 0.293.0

- `ContentCard` `hoverBg` and `ContentRow` `hover` take the tone hover step only when not `app`, so an `app` item keeps file’s no-fill hover; rest ground (`secondary`) unchanged.
- apps/catalog `APP_SLOTS` now pass `onClick`, so the reference is clickable like consumers.
- Verified in apps/catalog, App preset: a clickable card has no `kol-content-hover` class and no `--kol-content-hover-bg`, cursor pointer, tone secondary.
