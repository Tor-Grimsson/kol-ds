---
component: SpecList
source: kol-monorepo/apps/web/src/routes/prints/PrintDetail.jsx#L226-L236
date: 2026-07-03
status: draft
deps: [Divider]
---

# SpecList

## Purpose
A compact `[{label, value}]` → definition list: each spec is a `[label | value]` row with the label left/muted and the value right-aligned, `Divider`-separated between rows. The reusable "key facts" strip shared across both PDPs (Edition / Year / Category / Sizes on the detail page). Data-agnostic — feed it any label/value tuples.

## Anatomy
- `<dl className="py-3">` wrapper.
  - per item `<div>` keyed by label:
    - `<div className="flex items-center justify-between gap-6 py-3">`
      - `<dt className="kol-helper-uc-xs text-fg-48 whitespace-nowrap">{label}</dt>` — muted mono-uppercase caption, never wraps.
      - `<dd className="kol-mono-sm text-right text-fg-64">{value}</dd>` — value, right-aligned, one tone brighter.
    - inter-row separator `{index < items.length - 1 && <Divider />}` — Divider **between** rows only, not after the last.

Note: at the PDP call site this `<dl>` is itself framed by a leading and trailing `<Divider />` (source L225 / L237) — those enclosing rules live at the **call site**, not in SpecList. Optionally expose a `framed` bool to pull them inside.

## Variants
No discrete variants; the list scales with however many tuples `items` carries.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| items | `Array<{ label, value }>` | `[]` | the rows; `value` may be a node |
| framed | boolean | `false` | (optional) wrap the `<dl>` in leading + trailing `<Divider />` as the PDP does |

## Styling
- Tailwind only.
- Wrapper: `py-3`. Row: `flex items-center justify-between gap-6 py-3` (source aligns rows `items-center`, not baseline — keep it, though a `items-baseline` variant would read cleaner for mixed type sizes).
- Label `dt`: `kol-helper-uc-xs text-fg-48 whitespace-nowrap`.
- Value `dd`: `kol-mono-sm text-right text-fg-64`.
- Tokens: `text-fg-48`, `text-fg-64`, type `kol-helper-uc-xs`, `kol-mono-sm`.
- Separator: DS **`Divider`** between rows.
- No animation.
- **App-specific bits to DROP:** the `specs` array is built from `print.edition/year/category/sizes` via `formatEdition(...)` in the route — that construction stays at the call site; SpecList only receives the finished tuples.

## States & interactions
Static, presentational. No state.

## Dependencies
- **Divider** (DS) — inter-row separator.

## Recreation notes
- **Tier:** atom. Small, reused across `PrintDetail` and `PrintDetailOverlay` (the overlay renders the same key facts as `<dl>` grids in its tab panels — SpecList can back those too).
- **The prop/slot seam replacing the Sanity doc:** plain `[{label, value}]` tuples — no `print` object, no `formatEdition`. The caller formats values (e.g. `Limited (30)`, `A3, A2, A1`) before passing them.
- **Text casing at call site:** `kol-helper-uc-xs` renders the label uppercase presentationally (a KOL type class, not `text-transform` in JS) — keep it; author `label`/`value` strings verbatim in their intended case.
