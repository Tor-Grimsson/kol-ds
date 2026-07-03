---
component: AlignmentGrid
source: kol-monorepo/apps/brand/src/editor/compose/AlignmentPanel.jsx#L1-L35
date: 2026-07-03
status: draft
deps: [Icon, Button]
---

# AlignmentGrid

## Purpose
A six-button alignment grid — horizontal start/center/end on the top row, vertical start/center/end on the bottom — driven off a static config array. Each cell is an icon button that emits an `(axis, mode)` alignment intent. In the editor it aligns the common bounding box of a multi-layer selection; the presentational grid is the reusable part (the "align selected" wiring is the app's).

## Anatomy
```
div.grid.grid-cols-6.gap-1
└─ button ×6   (per ALIGN_BUTTONS entry)
   ├─ kol-btn-quiet inline-flex items-center justify-center rounded text-emphasis
   ├─ style: width 100%, height 28, padding 6
   ├─ title + aria-label = human label ("Align left", …)
   └─ Icon name={entry.icon} size 16
```
Config array (order = render order, single 6-col row):
```
{ axis:'h', mode:'start',  icon:'align-h-start',  title:'Align left' }
{ axis:'h', mode:'center', icon:'align-h-center', title:'Align horizontal center' }
{ axis:'h', mode:'end',    icon:'align-h-end',    title:'Align right' }
{ axis:'v', mode:'start',  icon:'align-v-start',  title:'Align top' }
{ axis:'v', mode:'center', icon:'align-v-center', title:'Align vertical center' }
{ axis:'v', mode:'end',    icon:'align-v-end',    title:'Align bottom' }
```

## Variants
- Single fixed variant — one `grid-cols-6` row of 6 quiet icon buttons. No size/tone variants in source (config-driven, so a consumer could extend the array).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| onAlign | `(axis, mode) => void` | — | fired on button click with the cell's axis + mode (replaces `alignSelected`) |

`axis` ∈ `h | v`; `mode` ∈ `start | center | end`.

## States & interactions
- **Click** — `onClick={() => onAlign(b.axis, b.mode)}`; every button `type="button"`.
- **hover** — via `kol-btn-quiet` (dimmed at rest, brightens on hover).
- No active/pressed/toggle state — alignment is a fire-once action, not a selected mode.
- Accessibility: each button has both `title` (tooltip) and `aria-label` set to the human label.

## Styling
- **Grid**: `grid grid-cols-6 gap-1` — six equal cells, 4px gap.
- **Button**: `kol-btn-quiet inline-flex items-center justify-center rounded text-emphasis`, inline `{ width:'100%', height:28, padding:6 }`.
- **Icon**: 16px.
- `kol-btn-quiet` is the KOL quiet-button atom class; `text-emphasis` a KOL semantic color.
- **App-specific bits to DROP:**
  - **`import { useComposeState } from './state'`** and **`const { alignSelected } = useComposeState()`** — the compose store coupling. Replace with an **`onAlign(axis, mode)`** callback prop; the component becomes pure presentation.
  - **`import EditorIcon from '../icons/EditorIcon'`** and `<EditorIcon .../>` → DS **`Icon`** (`EditorIcon` is the editor fork of DS `Icon`; use the real one). The six `align-*` glyph names must exist in the DS icon set (or be added).

## Dependencies
- **Icon** (DS) — the six `align-h-*` / `align-v-*` glyphs (replacing `EditorIcon`).
- **Button** (DS) — the cells are quiet icon buttons; recreate them as `Button` (`quiet`, `iconOnly`) rather than raw `<button className="kol-btn-quiet">`, so the DS owns the button atom.

## Recreation notes
- Tier: **molecule** — a presentational icon-button grid.
- The **prop/slot seam replacing editor state**: drop `useComposeState().alignSelected`; take an `onAlign(axis, mode)` prop. The consumer wires it to whatever "align these" means in its context (multi-layer bbox in the editor, any other alignment target elsewhere).
- Keep the config array as the source of truth; consider exposing it (or an `items` prop) so a consumer can subset/reorder, but the default 6 is the standard set.
- Rebuild each cell with DS `Button` (`quiet` + `iconOnly` + `iconComponent`/`Icon`), not a hand-rolled `kol-btn-quiet` button, to avoid re-forking the button atom.
- Text casing: `title`/`aria-label` strings ("Align left", …) are authored in the config — no `text-transform`; keep them as-authored.
