---
component: ToolButton
source: kol-monorepo/apps/brand/src/editor/shell/panels/ToolPalette.jsx#L34-L124
date: 2026-07-03
status: draft
deps: [Icon, Popover, ControlButton]
---

# ToolButton

## Purpose
A 28×28 icon toggle for a tool bar: quiet (dimmed) at rest, fully lit when active, `aria-pressed` for state. Plus a companion **variant-popover** pattern (`ShapeDropdown`) — a split-button whose trigger reflects the last-picked variant and carries a fold indicator, opening a menu to switch variants. This is the tool-palette idiom (Select · Text · [Shape ▾] · Pattern). It is a **near-duplicate of existing DS atoms** — spec it as a reconciliation, not a fresh atom (see notes).

## Anatomy
**ToolButton**
```
<button type="button" aria-label={label} aria-pressed={active} title={`${label} (${shortcut})`}
        class="inline-flex items-center justify-center rounded text-emphasis {active ? '' : 'kol-btn-quiet'}"
        style={width:28, height:28, padding:6}
        onClick={→ onClick(); e.currentTarget.blur()}>
  <Icon name={icon} size={14}/>
</button>
```
**ShapeDropdown** (variant-popover / split button)
```
<button ref={popover.ref} {...getReferenceProps({onClick})}
        aria-label={`Shape: ${triggerVariant.label}`} aria-pressed={active}
        title={`Shape: ${triggerVariant.label} (${triggerVariant.shortcut})`}
        class="relative inline-flex items-center justify-center rounded text-emphasis {active ? '' : 'kol-btn-quiet'}"
        style={28×28, padding:6}>
  <Icon name={triggerVariant.icon} size={14}/>
  <Icon name="tool-fold-indicator" size={4} class="absolute opacity-70" style={right:2, bottom:2}/>  ← corner ▾ marker
</button>
<PopoverPanel panel={false} focus={false} class="bg-surface-secondary border border-fg-08 rounded shadow-lg">
  {variants.map → <button class="w-full kol-helper-12 px-3 h-8 inline-flex items-center gap-2 text-body hover:text-emphasis text-left">
                    <span class="shrink-0 w-4 …"><Icon name={v.icon} size={14}/></span>
                    <span class="flex-1 truncate">{v.label}</span>
                    <span class="kol-helper-10 text-emphasis shrink-0">{isActive ? '✓' : v.shortcut}</span>
                  </button>}
</PopoverPanel>
```

## Variants
- **ToolButton** — the base toggle. States: at-rest (`kol-btn-quiet`) vs active (no quiet, `aria-pressed`).
- **ShapeDropdown** — the split-button variant: same 28×28 quiet/lit trigger + a `tool-fold-indicator` corner glyph, backed by a `Popover` menu. Trigger icon = the current variant when the group is active, else the `lastPicked` variant. Clicking the trigger *arms* the last-picked variant (if not already active) AND toggles the menu on the same click.

## Props
_(after dropping the `TOOL_META` / `useTool` store coupling)_

**ToolButton**
| prop | type | default | controls |
|------|------|---------|----------|
| icon | string | — | glyph name |
| label | string | — | `aria-label` + `title` |
| shortcut | string | — | `title` suffix `(${shortcut})` |
| active | bool | — | drops `kol-btn-quiet`, sets `aria-pressed` |
| onClick | ()=>void | — | activate (component also `blur()`s after) |

**ShapeDropdown** (variant-popover)
| prop | type | default | controls |
|------|------|---------|----------|
| variants | `{id,label,icon,shortcut}[]` | — | menu items + trigger glyphs |
| value | string (id) | — | active variant id |
| onChange | (id:string)=>void | — | pick/arm a variant |
| lastPicked | string (id) | — | trigger glyph when group inactive (internal state today) |

## States & interactions
- **Toggle** — `active` removes `kol-btn-quiet` (full opacity) and sets `aria-pressed={true}`; inactive buttons stay dimmed until hover.
- **blur-on-click** — after `onClick`, the source calls `e.currentTarget.blur()` so the canvas can reclaim focus and refresh its cursor (some browsers keep the button's `cursor:pointer` while it holds focus). Canvas-specific but harmless; keep as an optional behavior, not baked-in.
- **ShapeDropdown click semantics** — one click both arms the last-picked variant (`if (!active) onChange(triggerVariant.id)`) and toggles the popover (floating-ui's own click handler), so the user can immediately re-pick.
- **Menu row** — shows `✓` when that row is the active variant, else its `shortcut`.
- **Popover** — `usePopover({ placement:'bottom-start', offset:4, role:'menu' })`, `PopoverPanel panel={false} focus={false}`.

## Styling
- **Tailwind:** `inline-flex items-center justify-center rounded text-emphasis`, fixed `28×28` + `padding:6` via inline style; fold indicator `absolute opacity-70` at `right:2 bottom:2`; menu rows `w-full kol-helper-12 px-3 h-8 inline-flex items-center gap-2 text-body hover:text-emphasis text-left`.
- **KOL tokens:** `kol-btn-quiet` (dimmed-at-rest / brightens-on-hover atom class) is the whole visual mechanism; `text-emphasis` / `text-body`; panel `bg-surface-secondary border border-fg-08 rounded shadow-lg`; type `kol-helper-12`/`kol-helper-10`.
- **Color math / drag:** none.
- **App-specific bits to DROP:**
  - **`TOOL_META` lookup + `useTool()` store** — the component reads tool metadata and global tool state from `../../state/tools`. Replace with the explicit props above (`{icon,label,shortcut,active,onClick}`).
  - **`EditorIcon`** (`tool-rect`, `tool-fold-indicator`, …) → DS `Icon`/injected icon component (same seam as the other editor components).
  - **`SHAPE_VARIANTS`/`SHAPE_IDS`** hardcoded shape list + `lastPicked` local state → the `variants` prop + lifted `value`/`onChange`.

## Dependencies
- **Popover** (DS) — `usePopover` + `PopoverPanel` for the variant menu.
- **Icon** (DS) — glyphs (replacing `EditorIcon`).
- **ControlButton** (DS) — the atom this should reconcile *into* (see notes).

## Recreation notes
- **Tier:** atom (the toggle) — but **do not add it blindly.** It overlaps two existing DS atoms:
  - **`@kol/ui ControlButton`** — already a quiet/icon control button.
  - **`EditorButton` `iconOnly`** (itself a fork slated to collapse into DS `Button`).
  `ToolButton` is essentially `ControlButton` + `aria-pressed` toggle + fixed 28px + `kol-btn-quiet`-at-rest. **Reconcile:** verify whether `ControlButton` (or DS `Button` with `selected`/`aria-pressed`) already exposes a quiet variant + pressed state + a 28px size; if so, this is a preset/size of that atom, not a new component. If a gap exists, close it on `ControlButton` (add `pressed`/`aria-pressed` + `quiet` + `size` covering 28px) rather than shipping a parallel `ToolButton`.
  - **What IS genuinely new:** the **`ShapeDropdown` split-button-with-variant-menu** (trigger reflecting last-picked variant + fold-indicator corner glyph + arms-and-opens-on-one-click). That pattern isn't in the DS. Promote *it* as a small molecule (name e.g. `SplitToolButton` / `VariantButton`) built on `Popover` + the reconciled toggle atom — not as another button atom.
- **Controlled prop seam:** lift `value`/`onChange`/`lastPicked` out of the tool store; pass tool metadata as props. Keep `blur-on-click` opt-in.
- **Text casing:** `label`/variant labels/shortcuts are authored at the call site — no auto-casing. Keep the `✓`/shortcut trailing marker literal.
