---
component: ButtonGroup
source: kol-monorepo/packages/ui/src/molecules/ButtonGroup.jsx#L1-L51
date: 2026-07-09
status: draft
deps: [Button]
---

# ButtonGroup

## Purpose
Layout wrapper that renders **N Buttons from a data array** with a responsive stack→row layout and left/center/right alignment. Lives in the monorepo `@kol/ui` molecules; used for grouped CTAs / action rows.

## Anatomy
```
div  (container — align-driven: flex|inline-flex · flex-col · width · mx-auto)
├─ h3.kol-heading-md            (optional — only when `title` is set)
└─ div  (flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-{start|center|end})
   └─ Button × N                (mapped from buttons[]; each forced w-full sm:w-auto)
```
Structure only — it holds no app logic, just maps configs to Buttons.

## Variants
Single form, one axis: **`align` = left / center / right.**
- `center` (default) is special-cased: `inline-flex` + `w-full sm:w-auto` + `sm:mx-auto` — the group **hugs its content and centers**.
- `left` / `right` stay full-width block (`flex w-full`) with `justify-start` / `justify-end`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `buttons` | array | `[]` | list of button configs — each = **Button props + `label`/`children`**; no length cap (2/3/4/N) |
| `title` | string | — | optional heading rendered as `h3.kol-heading-md` above the group |
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | horizontal alignment **and** container layout mode |
| `className` | string | `''` | extra container classes (appended) |

**Per-button config:** `label` OR `children` becomes the button content; `className` is merged (forced `w-full sm:w-auto` + yours); **every other key spreads straight onto `<Button>`** (`variant`, `onClick`, `disabled`, `size`, `href`, …).

## Styling
- **Container (center):** `flex sm:inline-flex flex-col w-full sm:w-auto sm:mx-auto`
- **Container (left/right):** `flex flex-col w-full`
- **Inner row:** `flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-{start|center|end}`
- **Title:** `kol-heading-md mb-6 text-auto`
- **Each Button:** forced `w-full sm:w-auto` + passthrough `className`
- **KOL tokens referenced:** `kol-heading-md` (type class), `text-auto` (auto-contrast color util) — confirm both exist in `kol-theme`, map to DS equivalents if not.
- **App-specific to DROP:** import `@kol/component` → `@kolkrabbi/kol-component`.

## States & interactions
**None of its own** — a pure layout wrapper. All hover / active / disabled / focus behavior lives in the composed `Button`.

## Dependencies
- `Button` (→ `@kolkrabbi/kol-component`). No consumer-only helpers.

## Recreation notes
- **Tier: molecule.**
- **Fix the dynamic-class bug (load-bearing):** source builds the alignment class by interpolation — `sm:${alignClass}` (line 37) — which Tailwind's scanner can't see as a literal, so `align="left"/"right"` may **silently no-op**. Recreate with a static lookup of full literal classes: `{ left:'sm:justify-start', center:'sm:justify-center', right:'sm:justify-end' }`.
- **API decision to flag:** the array-config API (`buttons={[{label,...}]}`) is un-KOL — KOL leans children composition. DS call: keep the array API, or switch to `<ButtonGroup align><Button/>…</ButtonGroup>`.
- No DS twin — `SegmentedToggle`/`TabsRow` are single-select toggles, not a multi-Button action layout. This is net-new.
- No auto text-transform — labels authored at the call site.
