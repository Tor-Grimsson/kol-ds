---
component: TabsRow
source: kol-monorepo/apps/brand/src/editor/color/PanelTabs.jsx#L1-L74
date: 2026-07-03
status: draft
deps: [Icon]
---

# TabsRow

## Purpose
A labeled underline tab strip with optional close / minimise affordances. The active tab gets a 2px bottom border and emphasis color; inactive tabs are muted and brighten on hover. Reused 3× in the editor (color modal's Stroke/Colour/Swatches, the selection palette's Palette/Inspector). **The DS has no Tabs component** — `SegmentedToggle` and `ViewToggle` are button-group toggles, not a text underline tab bar — so this is a clean gap fill. `PanelTabs` (same file) is just `TabsRow` inside a standalone panel card.

## Anatomy
```
TabsRow  (flex items-stretch gap-4 px-3 h-10)
├─ [close button]     ← only if onClose; aria-label "Close"; Icon name="close" size 12; text-meta→emphasis
├─ tab button ×N      ← per label: kol-mono-12, border-b-2; active = text-emphasis border-fg,
│                       inactive = text-meta hover:text-emphasis border-transparent; aria-pressed
└─ [minimise button]  ← only if onMinimise; ml-auto pushes it right; Icon name="chevron-down" size 12
```
`PanelTabs` shell (optional wrapper):
```
div.bg-surface-primary.border.border-fg-08.rounded.overflow-hidden  (width 320)
└─ TabsRow {...props}
```

## Variants
- **Plain row** (`TabsRow`) — no outer chrome; consumer wraps it.
- **Carded** (`PanelTabs`) — `TabsRow` in a 320px `surface-primary` bordered/rounded panel.
- **Close affordance** — leading close button, rendered only when `onClose` is passed.
- **Minimise affordance** — trailing chevron (`ml-auto`), rendered only when `onMinimise` is passed.
- **Any label set** — `tabs` is any string array; defaults to the color tabs (`['Stroke','Colour','Swatches']`).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| tabs | string[] | `['Stroke','Colour','Swatches']` | tab labels |
| active | string | — | which label is the active tab |
| onChange | `(label) => void` | — | fires on tab click (`onChange?.(t)`) |
| onClose | `() => void` | — | show + wire the leading close button |
| onMinimise | `() => void` | — | show + wire the trailing minimise chevron |

## States & interactions
- **active** — `t === active` → `text-emphasis border-fg` (2px underline) + `aria-pressed`; inactive → `text-meta hover:text-emphasis border-transparent`.
- **hover** — inactive tabs and both affordance buttons transition `text-meta` → `text-emphasis`/`hover:text-emphasis`.
- **Conditional affordances** — close/minimise render only when their handler exists; absent handlers render nothing (no disabled placeholder).
- **Click** — tab calls `onChange?.(label)`; buttons are `type="button"` (no form submit).
- Accessibility: tabs use `aria-pressed`; icon buttons carry `aria-label` (`"Close"`, `"Minimise"`).

## Styling
- **Row**: `flex items-stretch gap-4 px-3 h-10` — 40px tall, stretch so the `border-b-2` underline meets the bottom edge.
- **Tab**: `kol-mono-12 flex items-center cursor-pointer border-b-2` + active/inactive color set. Underline is the button's own bottom border (`border-fg` active / `border-transparent` idle) — no separate track.
- **Affordance buttons**: `text-meta hover:text-emphasis self-center`, inline `lineHeight:0` (kills icon baseline gap). Minimise adds `ml-auto` to right-align.
- **Card** (`PanelTabs`): `bg-surface-primary border border-fg-08 rounded overflow-hidden`, inline `width:320`.
- Text-color utilities `text-meta` / `text-emphasis` / `border-fg` / `border-fg-08` are KOL semantic classes; `kol-mono-12` is the KOL mono type class.
- **App-specific bits to DROP:**
  - **`import EditorIcon from '../icons/EditorIcon'`** and both `<EditorIcon name="close"/close chevron-down>` calls → DS **`Icon`** (`EditorIcon` is a deliberate editor fork of DS `Icon`; use the real one).
  - **`COLOR_TABS` default** (`['Stroke','Colour','Swatches']`) is color-tool copy — either drop the default entirely (require `tabs`) or keep it as a neutral example; don't ship color-editor labels as the DS default.

## Dependencies
- **Icon** (DS) — the `close` and `chevron-down` glyphs (replacing `EditorIcon`).
- KOL type/color classes: `kol-mono-12`, `text-meta`, `text-emphasis`, `border-fg`, `border-fg-08`, `bg-surface-primary` — all DS theme.

## Recreation notes
- Tier: **molecule** — fills the DS Tabs gap (a labeled underline tab bar, distinct from the toggle-button `SegmentedToggle`/`ViewToggle`).
- The **prop/slot seam replacing editor state**: already clean — `{ tabs, active, onChange, onClose, onMinimise }`, no store. Keep `TabsRow` (bare) and `PanelTabs` (carded) as two exports; the card is a thin composition.
- Swap `EditorIcon` → DS `Icon` for the two glyphs. Drop the color-specific default label set.
- Consider `role="tab"`/`role="tablist"` + `aria-selected` for the DS version (source uses `aria-pressed`, which reads as toggle-y for a tab); optional but more correct.
- Text casing: tab labels come from the `tabs` array authored at the call site — no `text-transform` in the component. Keep it that way (labels arrive already cased, e.g. `'Colour'`).
