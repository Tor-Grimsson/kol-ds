---
component: EditorShell
source: kol-monorepo/apps/brand/src/editor/EditorShell.jsx#L1-L67
date: 2026-07-03
status: draft
deps: [Divider]
---

# EditorShell

## Purpose
The two-rail editor layout template: a topbar over a three-column grid — left rail, canvas column, right rail — where every rail/header/canvas region is filled from a **panel registry** rather than hardwired children. A registry is `{ canvas: Component, panels: [{ slot, order, Component }] }`; `panelsForSlot` filters+sorts entries into their slot. This is the layout + panel-registry pattern worth promoting; the specific menus/overlays the app drops into it are not part of the primitive.

## Anatomy
```
kol-editor-shell            (flex column, 100dvh, surface-primary)
├─ [topbar slot]            ← app passes <MenuTop/>; promote to a `topbar` prop/slot
├─ kol-editor-grid          (grid: 320px | 1fr | 320px, areas "left canvas right")
│  ├─ Rail side="left"
│  │  ├─ rail-header  (border-bottom; :empty collapses)   ← panelsForSlot 'left.header'
│  │  └─ rail-body    (flex col, overflow-y auto)         ← panelsForSlot 'left.body'
│  ├─ kol-editor-canvas-column
│  │  ├─ kol-editor-canvas-header  (:empty collapses)     ← panelsForSlot 'canvas.header'
│  │  └─ kol-editor-canvas  (main, flex 1, dark bg)       ← registry.canvas
│  └─ Rail side="right"
│     ├─ rail-header                                      ← panelsForSlot 'right.header'
│     └─ rail-body                                        ← panelsForSlot 'right.body'
└─ [overlay slot]           ← app passes <ShortcutsOverlay/>; promote to an `overlays` slot
```
`Rail` is an internal sub-component: `<aside class="kol-editor-{side}">` with an optional `rail-header` (rendered only when the slot has panels) + a `rail-body`. Each panel entry renders as `<Component key={i} />`.

## Variants
- **Slots**: five registry slots — `left.header`, `left.body`, `right.header`, `right.body`, `canvas.header` (`SLOTS` in `state/panels`). `canvas.header` renders as a sub-bar spanning only the canvas column (e.g. a tool palette).
- **Empty collapse** — `rail-header` and `canvas-header` set `:empty { display:none }`, so a slot with no panels contributes no border/gap.
- **Canvas optional** — `registry.canvas` may be null → the `<main>` renders empty.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| registry | `{ canvas: Component, panels: PanelEntry[] }` | — | canvas component + panel entries |
| registry.panels[] | `{ slot, order, Component }` | `[]` | one panel; `slot` places it, `order` sorts within slot |
| topbar | node/Component | — | **(promote)** the top bar — was hardwired `<MenuTop/>` |
| overlays | node | — | **(promote)** floating overlays — was hardwired `<ShortcutsOverlay/>` |

`PanelEntry.slot` ∈ `left.header | left.body | right.header | right.body | canvas.header`.

## States & interactions
- **No internal state** — pure layout; all content comes from `registry`. `panelsForSlot(panels, slot)` filters by `slot` and sorts by `order ?? 0`.
- **`data-editor-keep-selection`** on the shell root — a single marker a document-level click-away handler checks: clicks inside the shell keep selection, clicks outside deselect. New rails/panels need no wiring — being inside the shell suffices. (App convention; keep as an opt-in `data-*` hook, don't bake the behavior into the DS.)
- **Rails scroll independently** — `rail-body` is `overflow-y:auto`; the grid rows are `minmax(0,1fr)` so columns never overflow the viewport.

## Styling
- **Grid**: `.kol-editor-grid { grid-template-columns: 320px minmax(0,1fr) 320px; grid-template-areas:"left canvas right"; }`. Rails 320px fixed, canvas fluid.
- **Shell**: `.kol-editor-shell { display:flex; flex-direction:column; height:100dvh; background: var(--kol-surface-primary); user-select:none }` — with an override re-enabling text selection inside `input/textarea/[contenteditable]`.
- **Rails**: `.kol-editor-left` border-right / `.kol-editor-right` border-left, both `1px solid var(--kol-fg-08)`, flex-column, `min-height:0`.
- **Canvas column**: flex-column; `.kol-editor-canvas-header` `border-bottom: var(--kol-fg-08)`, `background: var(--kol-surface-primary)`; `.kol-editor-canvas` `flex:1`, `background:#0E0E11` (dark stage).
- **Empty-collapse**: `.kol-editor-rail-header:empty`, `.kol-editor-canvas-header:empty { display:none }`; first-child rail panel suppresses its `border-top` so it doesn't stack on the header's border-bottom.
- **App-specific bits to DROP:**
  - **`import MenuTop`** and its render `<MenuTop/>` — the file/canvas/templates menus are app content. Promote to a **`topbar`** slot/prop.
  - **`import ShortcutsOverlay`** and `<ShortcutsOverlay/>` — app keyboard-help overlay. Promote to an **`overlays`** slot.
  - **`import './styles/kol-editor.css'`** — the editor-scoped stylesheet. In the DS these layout rules become part of the shell's own styles/tokens, not an app import.
  - **`#0E0E11`** dark canvas bg — brand editor surface; token it in the DS.
  - **`data-editor-keep-selection`** — app click-away convention; keep as an optional escape hatch, not shell behavior.

## Dependencies
- **Divider** (DS) — the rail/header/canvas hairlines are `1px solid var(--kol-fg-08)` borders; where a standalone separator is wanted, compose `Divider`.
- `panelsForSlot` + `SLOTS` (`state/panels`) — a ~5-line pure filter/sort helper; port it alongside the shell (no editor coupling).
- App-only (stay behind slots): `MenuTop`, `ShortcutsOverlay`, `kol-editor.css`.

## Recreation notes
- Tier: **organism / template** — the frame other editor panels dock into. Promote the layout + panel-registry pattern; leave the specific panels in the app.
- The **prop/slot seam replacing editor state**: the registry already decouples content from layout — keep it. The two remaining hardwired imports (`MenuTop`, `ShortcutsOverlay`) become a `topbar` slot and an `overlays` slot. Then the DS shell knows nothing about menus or shortcuts.
- Port `panelsForSlot`/`SLOTS` verbatim — it's pure and reusable; the five-slot taxonomy is the public contract.
- Keep the `:empty` collapse rules and the first-child `border-top` suppression — they're what makes optional slots not leave phantom borders.
- Text casing: the shell renders no copy of its own — all labels come from panel components authored at the call site.
