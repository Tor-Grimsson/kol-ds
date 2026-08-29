---
component: SettingsPanel
source: kol-r2b2/src/SettingsPanel.jsx#L1-L220
staged: 2026-08-26
status: draft
deps: [Button, Divider, Icon]
---

# SettingsPanel

## Purpose
A settings surface for the thing you're looking at — a slide-over so you change how a list looks *while looking at it*. Used in kol-r2b2 as the per-bucket display settings (kinds allow-list, structure toggles, loading, layout, sort). The user wants it as a DS component with **two presentations — a side drawer and an overlay — as one component (variant prop) or a related pair**, because the same settings shape will be reused in other apps.

## Anatomy
```
Scrim (fixed inset-0, click = close)
└─ Panel (aside, right-anchored, 380px, scrolls)
   ├─ Header — title + subtitle stack · close (Icon x)
   ├─ Intro line (kol-mono-10, fg-32)
   ├─ Divider
   ├─ Section — heading (kol-mono-12 fg-64) + body
   │    body is one of:
   │    · ChipRow  — wrap of toggle chips, each with an optional count
   │    · Row      — label + hint stack (left) · control (right)
   │         control is Switch (on/off word-button) or Choice (segmented word-buttons)
   ├─ Divider … (sections repeat)
   └─ Footer — state word (defaults / customised) · ghost Button "Reset to defaults"
```

## Variants
- **drawer** (current) — right-anchored full-height aside over a 60 % scrim, 380px wide, `border-left: 1px var(--kol-fg-08)`.
- **overlay** (wanted) — same content centred as a modal panel. Not built anywhere yet; the user's ask is that both come from the same anatomy.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `title` | string | — | header line 1 |
| `subtitle` | string | — | header line 2 (context, e.g. the bucket label) |
| `intro` | string | — | the fg-32 line under the header |
| `onClose` | fn | — | close control + scrim click |
| `children` | sections | — | `Section` / `Row` / `ChipRow` composition |
| `footer` | node | — | the state word + reset slot |
| `variant` | `'drawer' \| 'overlay'` | `'drawer'` | presentation |
| `width` | number | 380 | drawer width |

Sub-parts the consumer composes (today they're private functions in the file):
- `Row({ label, hint, children })`
- `Switch({ on, onChange, disabled, disabledHint })` — a word toggle, `on`/`off`
- `Choice({ options, value, onChange })` — segmented word toggle; options are values or `{ value, label }`
- chip — `{ label, count, on, onToggle }`

## Styling
- Scrim: `fixed inset-0 z-40 flex justify-end` + inner `absolute inset-0` with `background: rgba(0,0,0,0.6)`.
- Panel: `relative w-[380px] max-w-full h-full overflow-y-auto p-6 flex flex-col gap-4`; `background: var(--kol-surface-primary)`; `borderLeft: 1px solid var(--kol-fg-08)`.
- Header: `flex items-center justify-between`; title `kol-mono-12 text-fg-default`; subtitle `kol-mono-10 text-fg-32`; close `text-fg-48 hover:text-fg-default transition-colors`, `Icon name="x" size={16}`.
- Section heading: `kol-mono-12 text-fg-64`.
- Row: `flex items-start justify-between gap-6 py-2`; label `kol-mono-12 text-fg-default`; hint `kol-mono-10 text-fg-32`; control wrapper `shrink-0`.
- Switch / Choice buttons: `kol-mono-12 px-2 py-1 rounded transition-colors`; active `bg-fg-absolute-24 text-fg-default`; inactive `text-fg-32 hover:text-fg-64`; disabled `text-fg-16 cursor-not-allowed`. Choice group `flex items-center gap-1`.
- Chips: `kol-mono-10 px-2 py-1 rounded transition-colors`, same active/inactive pair; count `text-fg-32` after the label. Row `flex flex-wrap gap-1`.
- Footer: `flex items-center justify-between`; state word `kol-mono-10 text-fg-32`; `Button variant="ghost" size="sm"`.
- **Drop on recreation:** the inline `rgba(0,0,0,0.6)` scrim (use the DS overlay token); the hard 380px (prop); the `kinds`/`profile`/`bucket` wiring — all consumer state.

## States & interactions
- Chip / Switch / Choice: active = filled `bg-fg-absolute-24`; inactive = fg-32 with hover to fg-64; disabled = fg-16, `cursor-not-allowed`, `title` carries the reason.
- Scrim click closes; click inside the panel does not (stopPropagation). No Escape handling, no focus trap, no scroll lock — all wanted in the DS version.
- Footer state word flips `defaults` ↔ `customised`; reset restores defaults.

## Dependencies
DS: `Button` (ghost sm), `Divider`, `Icon` (`x`). Consumer-only, to drop: `ALL_KINDS`, `isDefault`, `KIND_LABEL`, the `bucket` / `profile` / `settings` objects.

## Recreation notes
- Tier: **organism** (`SettingsPanel`) composing three molecules — `SettingsRow`, `SettingsChoice` (the segmented word toggle), `SettingsSwitch` — or reuse the DS `SegmentedToggle` / `ToggleSwitch` where they fit; the user flagged the **segmented-toggle variant** here as one of the things to fix in the DS, not something to copy.
- Two presentations from one anatomy: `variant="drawer" | "overlay"`; scrim + panel geometry are the only things that differ. If the DS prefers a pair, keep the body a shared inner component.
- Known defects at the source, **to fix in the DS, not carried over** (user's words): inconsistent case across labels/options (`Show kinds` vs `on`/`off` vs `grid`/`list`), some alignment (row controls sit to the right of a two-line hint; long hints wrap under the control), and the segmented-toggle variant itself.
- Text casing at the call site — no `text-transform`.
- Reference screenshot: kol-r2b2 `media.kolkrabbi.io`, gear → panel, 2026-08-26.

## ✅ RESOLUTION — 2026-08-26 · kol-component@0.69.0 · kol-theme@0.53.0

`SettingsPanel` is a kol-component organism — one anatomy (title · subtitle · intro · `Section divided` stack · footer), two presentations: `variant="drawer"` rides the DS `ShellDrawer` (right-anchored, `width` 380 default; scrim, Escape, focus trap, scroll lock, focus return, the × control) and `variant="overlay"` rides `FullscreenOverlay` (centred; it now traps focus too — Tab cycles in the sheet, focus returns to the opener). Parts: `SettingsRow` (a grid, so a long hint wraps in its own column and the control centres on the row — the alignment defect), `SettingsSwitch` = `ToggleSwitch` sm (disabled state added to the theme, it had none), `SettingsChoice` = `SegmentedToggle` sm (the source's word-button segments were the thing to fix, not copy), `SettingsChipRow` (toggle chips with counts, the `.kol-control` pattern), `SettingsFooter` (state word + ghost reset). No `text-transform`; the hand-typed `rgba(0,0,0,0.6)` scrim, the hard 380 and the bucket/profile wiring are gone. Rendered headless in the showcase: drawer flush right at 380, overlay centred at 380, focus inside on open, Tab stays inside, Escape closes both.

**Remainder here:** none — kol-r2b2 bump kol-component to 0.69.0 (+ kol-theme 0.53.0), replace `src/SettingsPanel.jsx` with `<SettingsPanel>` + `Section divided` + `SettingsRow`/`SettingsSwitch`/`SettingsChoice`/`SettingsChipRow`/`SettingsFooter`, author the labels' casing at the call site (`Show kinds` / `On` / `Grid` — one register).

