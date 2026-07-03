---
component: PageSection
source: kol-monorepo/apps/brand/src/components/framework/PageSection.jsx#L1-L24
date: 2026-07-03
status: draft
deps: [Divider]
---

# PageSection

## Purpose
A page-level `<section>` wrapper with an optional header block (label / title / body lede) and slotted body content. It is the standard chapter/section scaffold for the brand marketing + styleguide pages — one per content block, stacked down the page. Not to be confused with the DS's existing `Section` (a small inspector control-group); this is a full-width page region. See Recreation notes for the naming reconciliation.

## Anatomy
```
<section id className="kol-page kol-page-section [kol-page--fullbleed] [className]">
  [Divider]                     ← optional, className="kol-page-section-divider" (renders first)
  <header class="max-w-[720px] | max-w-[960px]">   ← only when label|title|body present
    <p  class="kol-prose-label"> label
    <h2 class="kol-prose-title"> title
    <p  class="kol-prose-lede">  body
  </header>
  {children}                    ← body content slot
</section>
```
Header is rendered only if any of `label`/`title`/`body` is set (`hasHead`). `header` max-width is `960px` when `fullbleed`, else `720px`.

## Variants
- **default** — centered content column (`kol-page` caps width at `--kol-container-max` / responsive `--kol-pad-section-x`).
- **fullbleed** (`fullbleed`) — adds `kol-page--fullbleed`: `max-width:none`, `min-height:100vh`, flex column, `64px 0` padding; header widens to `960px`.
- **with divider** (`divider`) — prepends a `Divider` with `kol-page-section-divider` (pulls up `-64px`, hidden on the first section via `:first-of-type`).
- Header-optional — pass only `children` for a bare section.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| id | string | — | anchor id on the `<section>` (jump-link target) |
| label | node | — | eyebrow line → `kol-prose-label` |
| title | node | — | section heading → `<h2 class="kol-prose-title">` |
| body | node | — | lede paragraph → `kol-prose-lede` |
| children | node | — | body content slot below the header |
| className | string | `''` | extra classes appended to the section |
| fullbleed | bool | `false` | edge-to-edge layout + wider header |
| divider | bool | `false` | render a top `Divider` separator |

## Styling
- Tailwind utilities: header width `max-w-[720px]` / `max-w-[960px]` (inline, chosen by `fullbleed`).
- KOL theme atoms (DS-tier, `packages/theme`): `kol-prose-label` (mono 12px uppercase, `--kol-fg-48`), `kol-prose-title` (narrow 56/60, `--kol-surface-on-primary`), `kol-prose-lede` (compact 24/28), `kol-page-section-divider` (`margin-top:-64px; margin-bottom:64px`, hidden on first-of-type). These travel with the DS — keep.
- No inline styles, transitions, or pseudo-elements of its own (the divider's `:first-of-type` hide rule lives in the atom CSS).
- **App-specific bits to DROP / re-tier:** `.kol-page` and `.kol-page--fullbleed` scaffold live in `apps/brand/src/components/framework/kol-framework.css` and lean on app-defined layout tokens `--kol-container-max`, `--kol-pad-section-x`, `--kol-pad-page-*` (declared per-breakpoint in that same app file, NOT in `packages/theme`). Do not import the app CSS; the DS must define its own page-container width/padding scale (or take them as props) before this ships. The `kol-page-section` class is only a marker hook for the divider's `:first-of-type` selector — keep the pairing or re-scope it.

## States & interactions
Static structural wrapper — no hover/focus/selected/disabled. Only conditional rendering: header shows when any header prop is set; divider and fullbleed are boolean toggles. `id` makes it an in-page scroll anchor.

## Dependencies
- **Divider** (DS) — `import { Divider } from '@kol/component'`, rendered when `divider` is true.
- No other DS components; no app context, router, or brand data.

## Recreation notes
- Tier: **layout / structural** (page-region scaffold, an organism-level container).
- **Name reconciliation:** the DS already exports `Section` (a compact inspector control-group). Do NOT reuse that name — ship this as **`PageSection`** (or `ContentSection`) so the two never collide. Document both in the DS index with a one-line "page region vs. control group" disambiguation.
- Props that stay props: `label`/`title`/`body`/`children` slots, `fullbleed`, `divider`, `id`, `className`.
- Tokens to swap: replace the app layout tokens (`--kol-container-max`, `--kol-pad-section-x`, `--kol-pad-page-*`) with DS-owned container/padding tokens or explicit props. The `kol-prose-*` and `kol-page-section-divider` atoms are already DS-tier — reuse as-is.
- Text casing: `kol-prose-label` applies `text-transform:uppercase` in the atom CSS. Flag for review — per KOL rules components shouldn't auto-uppercase; author the eyebrow string in its final case at the call site and drop the transform from the DS atom, or make it opt-in.
- Keep `hasHead` gating so a section with only `children` emits no empty `<header>`.
