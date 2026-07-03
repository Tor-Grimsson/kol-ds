---
component: TypeScaleSection
source: kol-monorepo/apps/brand/src/components/styleguide/TypeScaleSection.jsx#L1-L34
date: 2026-07-03
status: draft
deps: [Table]
---

# TypeScaleSection

## Purpose
A documentation section that renders a type scale as a table: token / weight / size-over-lineHeight columns plus a live **Preview** column that renders "The quick brown fox" in each row's actual family/weight/size. Wraps the rows in a `PageSection` (heading + lede + body) and appends optional extra content below. The "scale table" member of the type-specimen kit. The weakest/thinnest of the four — mostly a composition of `PageSection` + DS `Table` with one custom render column.

## Anatomy
- `PageSection` (id/label/title/body header + children region)
  - `Table` (`kol-table--simple`) with columns:
    - **Token** — `r.token` (`kol-table-cell-title`)
    - **Weight** — `r.weight`
    - **Size / LH** — rendered `${r.size} / ${r.lh}`
    - **Preview** — inline-styled `<span>` rendering `The quick brown fox` at the row's family/weight/size (`kol-table-cell-text`, `white-space: normal`)
  - optional `children` region below the table (`mt-12`)

## Variants
No discrete variants. Behavioral fork: pass `columns` to fully override the default column set, or omit it to use `defaultColumns(family)`. Optional `children` appends extra content.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| id | string | — | section anchor id (passed to PageSection) |
| label | string | — | PageSection eyebrow label |
| title | string | — | PageSection heading |
| body | string | — | PageSection lede/intro |
| family | string | — | font-family used by the default Preview column |
| rows | Array<{token, weight, size, lh}> | — | table data (one row per scale stop) |
| columns | Array<ColumnDef> | `defaultColumns(family)` | override the column set entirely |
| children | node | — | extra content rendered under the table (`mt-12`) |

## Styling
- Table: **`kol-table--simple`** (DS Table variant class).
- Token cell: **`kol-table-cell-title`**; Preview cell: **`kol-table-cell-text`** + inline `whiteSpace: 'normal'`.
- Preview span: inline style only — `fontFamily: "${family}", sans-serif`, `fontWeight: r.weight`, `fontSize: Math.min(r.size, 20)px` (capped at 20px so large stops stay in-row), `lineHeight: 1.2`.
- Extra-content region: `mt-12`.
- Header styling comes from `PageSection` (`kol-prose-label` / `kol-prose-title` / `kol-prose-lede`).
- **App-specific bits to DROP:** the `Math.min(r.size, 20)` preview cap and `"The quick brown fox"` pangram are baked into `defaultColumns` — fine as defaults, but the whole default-columns helper is app-flavored; the DS may prefer to require `columns` or make the sample string/cap configurable. `family` hard-wiring a brand font into the preview should default to a neutral token.

## States & interactions
Static, presentational. All interaction/sorting behavior (if any) belongs to the DS `Table`, not this wrapper.

## Dependencies
- **`Table`** (`@kol/component`) → DS `Table`.
- **`PageSection`** (`apps/brand/src/components/framework/PageSection.jsx`) — being staged separately in the lobby; TypeScaleSection is a thin wrapper over it, so recreate PageSection first. PageSection itself composes DS `Divider` and uses `kol-prose-label/title/lede`.

## Recreation notes
- Tier: **organism-lite / composition** — it owns almost no styling of its own; it wires `PageSection` + `Table` and supplies one custom render column. Weakest of the kit; if PageSection and Table both exist in the DS, this may reduce to a documented usage pattern (a `columns` recipe) rather than a standalone component.
- Props that stay props: `family`, `rows`, `columns` (full override escape hatch), plus the PageSection passthrough (`id/label/title/body/children`).
- `defaultColumns(family)` is the interesting bit — port it as an exported helper/recipe so consumers get the Token/Weight/Size-LH/Preview shape for free but can still override.
- Part of the **type-specimen kit** — the Preview column is a mini-`TypeSample` (inline-styled sample text); keep the two visually coherent.
- Text casing at call site: no auto-casing here; author `label`/`title`/token strings verbatim.
