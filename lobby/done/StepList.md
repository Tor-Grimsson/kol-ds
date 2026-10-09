---
component: StepList
source: kol-fxr/src/editor/morph/MorphTab.jsx#L184-L246
staged: 2026-10-09
status: draft
deps: [Button, Icon]
---

# StepList

## Purpose
A numbered list of slots the user orders by hand — the Morph rail's steps in kol-fxr (each row a generator preset; the morph tweens from row 1 to row N). One row is "editing" (highlighted), × removes a row, the empty last row adds one. Generic enough for any ordered-slots list (a playlist, a chain of stages); fxr keeps a local copy until this ships (plan 14 § 4, plan 19 § 7).

## Anatomy
```
StepList (ul, flex-col gap-1)
├─ StepListItem (li)  ×N
│  ├─ drop-mark (absolute 1px accent line, top or bottom, while a drag hovers)
│  ├─ grab handle (Icon drag-handle 12, text-meta, cursor-grab)        — variant: grab
│  │  — or — ↑ ↓ (two quiet icon Buttons)                               — variant: arrows
│  ├─ body (button, flex-1): index (kol-helper-10 text-meta tabular-nums w-4) · label (kol-mono-12 text-emphasis truncate)
│  └─ remove (Button tone="ghost" quiet iconOnly="x" size={cs})
└─ StepListAdd (li › button, dashed): index (next number) · Icon plus 12 · "Add a step" (kol-mono-12)
```

## Variants
- **grab** (what fxr runs): the handle starts an HTML drag (`draggable`, `dataTransfer` move); `dragover` on a row computes `above`/`below` from the pointer's half; drop reorders. The dragged row is `opacity-40`.
- **arrows**: no drag; ↑ ↓ quiet icon buttons move the row one slot (first row's ↑ and last row's ↓ disabled). Keyboard-reachable; the one to pick when a list is short or touch-first.
- `readOnly`: no handle/arrows, no ×, no add row, the body does not open.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `items` | `{ id, label }[]` | — | the rows |
| `activeIndex` | `number \| null` | `null` | the highlighted (editing) row — `bg-fg-08` |
| `reorder` | `'grab' \| 'arrows'` | `'grab'` | the variant |
| `readOnly` | `boolean` | `false` | strips every affordance |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'sm'` | the control rung the × and arrows ride |
| `onSelect` | `(index) => void` | — | body press |
| `onRemove` | `(index) => void` | — | × |
| `onMove` | `(from, to) => void` | — | after a drop or an arrow press |
| `onAdd` | `() => void` | — | the dashed row |
| `addLabel` | `ReactNode` | `'Add a step'` | the dashed row's text — the consumer's copy |

## Styling
- Row: `relative flex items-center gap-2 rounded px-2 py-1`; active `bg-fg-08`; dragged `opacity-40`.
- Drop mark: `absolute left-2 right-2 h-px bg-accent-primary` + `top-0` | `bottom-0`.
- Handle: `text-meta cursor-grab shrink-0 touch-none`, `Icon name="drag-handle" size={12}`.
- Index: `kol-helper-10 text-meta tabular-nums w-4 shrink-0` · label: `kol-mono-12 text-emphasis truncate`.
- Add row: `flex items-center gap-2 w-full rounded px-2 py-1 border border-dashed border-oq-16 text-meta hover:text-body hover:border-oq-24`; `Icon name="plus" size={12}`; label `kol-mono-12`.
- **Drop on recreation:** `stepLabel()` / `reorderStep()` / `removeStep()` (the morph store) — all become props above; `cs` from fxr's `useControlSize()` becomes `size`.

## States & interactions
- hover on the add row lifts text + border one step; hover on a row: none (the body is the click target, the row is not a button).
- active row: `bg-fg-08`; dragged: `opacity-40`; drop target: the 1px accent line above or below.
- disabled: `readOnly` only (no per-row disabled).
- focus: the body button and × take the DS focus ring; the handle is pointer-only (arrows variant is the keyboard path).

## Dependencies
`Button` (ghost quiet, iconOnly), `Icon` (`drag-handle`, `plus`, `x`, and `chevron-up`/`chevron-down` for arrows). The HTML-drag pattern is the one `LayerStack` already runs — reuse its hook if it has one, don't write a second.

## Recreation notes
Molecule, two files or one with a `reorder` prop: `StepList` (group) + `StepListItem`. Lives beside `LayerStack`. Labels are nodes, cased at the call site. When it ships, fxr swaps `MorphTab.jsx`'s local `StepList` for it and retires the copy to `_tmp/`.

---

## Resolution — 2026-10-09 · 🟢 closed

**Shipped `@kolkrabbi/kol-component@0.245.0`** — `StepList` (`molecules/StepList.jsx`), the spec's
props verbatim: `items` · `activeIndex` · `reorder` (`grab` | `arrows`) · `readOnly` · `size` ·
`onSelect` · `onRemove` · `onMove(from, to)` · `onAdd` · `addLabel`. Page: `/components/step-list`.

**One deliberate deviation from the brief:** `grab` is a POINTER sort, not `LayerStack`'s HTML drag.
HTML drag does nothing under a finger, and fxr runs on a phone; `RecordManager` already carried a
~50-line pointer sort, so it is lifted to `hooks/usePointerSort.js` and both consume it — one
implementation, as the brief asked ("don't write a second"). `RecordManager`'s reorder is the same
lines, moved. The handle is `touch-none`, the dragged row `opacity-40`, the drop mark a 1px accent
line above or below the row under the pointer. `arrows` is ↑ ↓ quiet buttons on `size`, the ends
disabled — the keyboard path.

Walked on the showcase page: mouse drag 1 → 3 and a touch-pointer drag 3 → 1 reorder; × removes;
the dashed row adds; the body selects; arrows move one slot with the ends disabled; no errors.

For fxr: bump to ^0.245.0, swap `MorphTab.jsx`'s local `StepList` for the import, retire the copy
to `_tmp/`; `stepLabel()` / `reorderStep()` / `removeStep()` become the props, `cs` becomes `size`.
