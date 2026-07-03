---
component: TypeSpecCard
source: kol-monorepo/apps/brand/src/components/styleguide/TypeSpecCard.jsx#L1-L31
date: 2026-07-03
status: draft
deps: []
---

# TypeSpecCard

## Purpose
A two-column type-spec row: a left meta panel of key/value pairs (font metrics — family, weight, size, tracking, etc.) beside a live sample on the right, with an optional absolutely-positioned corner label. The "data-sheet" member of the type-specimen kit — pairs the numeric spec of a type style with a rendered example of it. Fully generic; `meta` is arbitrary tuples, sample is a slot.

## Anatomy
- `.kol-type-spec` wrapper — relative, top border, vertical padding
  - optional `.kol-type-spec-label` — mono uppercase caption, absolutely positioned top-left corner
  - `.kol-type-spec-row` — responsive grid: single column on mobile, `240px + fluid` two-column at `lg`
    - `.kol-type-spec-meta` — flex column of `.kol-type-spec-meta-row` items
      - each row: `[key | value]` grid; key left, value right-aligned; bottom hairline (removed on last)
    - `.kol-type-spec-sample` — the live sample slot (`children`)

## Variants
No discrete variants. Structural fork is presence/absence of `label`; the meta panel scales with however many tuples `meta` carries.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| label | string | — | corner caption; omit to hide |
| meta | Array<[string, node]> | `[]` | key/value rows in the left panel (tuple `[key, value]`) |
| children | node | — | the live type sample on the right (often a `TypeSample`) |

## Styling
- Wrapper: `kol-type-spec relative py-12 border-t border-fg-08`.
- Label: `kol-type-spec-label` + **`kol-helper-12`** + `uppercase tracking-widest text-meta absolute top-4 left-0`.
- Row grid: `kol-type-spec-row grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 items-start pt-6`.
- Meta panel: `kol-type-spec-meta flex flex-col`.
- Meta row: `kol-type-spec-meta-row grid grid-cols-[auto_minmax(0,1fr)] gap-4 items-baseline py-2 border-b border-[var(--kol-fg-04)] last:border-b-0`.
- Meta key: **`kol-helper-10`** (10px/500/0.10em mono label stop) + `text-meta`.
- Meta value: **`kol-helper-10`** + `text-strong text-right [overflow-wrap:anywhere]`.
- Sample: `kol-type-spec-sample min-w-0` (min-w-0 lets long samples shrink inside the grid track).
- Tokens: `border-fg-08`, `text-meta`, `text-strong`, `--kol-fg-04`.
- **App-specific bits to DROP:** none — all styling is Tailwind + KOL type classes + tokens. There is no `.kol-type-spec*` CSS rule in the framework sheet; every class here is either Tailwind or a KOL type class, so nothing extra travels with it.

## States & interactions
Static, presentational. No interaction or state.

## Dependencies
None (composes cleanly with `TypeSample` as the `children` sample, but does not import it).

## Recreation notes
- Tier: **molecule** (pure slot + tuple-driven layout; no logic).
- `meta` stays a prop as `[key, value]` tuples — do not bake in a fixed metric schema; the caller decides which rows to show.
- The `240px` meta-column width and `lg` breakpoint are reasonable defaults; consider exposing the meta-column width as a prop if the DS wants tuning, otherwise keep hard-coded.
- Part of the **type-specimen kit** — keep the `kol-helper-*` mono-label idiom identical to TypeSample so captions/keys read as one system.
- Text casing at call site: `uppercase` on the label is presentational; keep in CSS, author `label`/`meta` strings verbatim in their intended case.
