import { SettingsRow } from '@kolkrabbi/kol-component'

/* Was kol-shell's own `LabelRow`, retired 2026-08-30 — it was a second
 * implementation of kol-component's `SettingsRow` (same 160px label column,
 * same value cell), and the DS does not ship two of one thing. `align="fill"`
 * keeps the combo left-aligned in its cell, which is what LabelRow's default
 * baseline row did. */

/**
 * SettingsShortcuts — the keyboard-shortcuts block of a settings page
 * (ShellHomeSystem, kol-fxr 2026-08-27): the same `[{ section, items: [{ id,
 * label, combo }] }]` array `ShortcutsOverlay` takes, laid out UP TO six columns ×
 * two sections per column, filled column-first (user, 2026-08-27) — each
 * section an eyebrow (`kol-eyebrow`, strong ink) over SettingsRows. The six
 * is a CEILING, not a command (SettingsShortcutsGridColumns, kol-mirror
 * 2026-09-01 — the fourth home of the cols-as-command defect, unswept when
 * CatalogPage was the third): `grid-cols-6` computed six 18px slivers in a
 * 350px row. Same idiom as CatalogPage / ContentCollection — no track under
 * the 150px floor (`GRAB AND PAN THE DESK` / `Space + drag`, the widest cells
 * in the estate), none wider than the container, and the count falls out of
 * the width: two at 390, six on the desk, where the sixth-share clears the
 * floor so nothing moves. Below `md` the grid flows by ROW — the two-row
 * column-first shape is a desk ruling and would overflow implicit columns
 * off the right edge on a phone. Gap is `gap-x-6 md:gap-x-12`, the rung
 * ContentFiltersMobileGaps set for this shape (48px was 17% of the row). A combo is one
 * token by nature — the value cell is `whitespace-nowrap` and the label yields
 * (SettingsShortcutsComboWrap, kol-monitor 2026-08-27: `⌘ K` broke as `⌘` over
 * `K` in the six-column grid — the cell was squeezed to min-content, not full).
 * `labelWidth="auto"` is what MAKES the label yield
 * (SettingsShortcutsComboOverflow, kol-monitor 2026-09-01): the row's default
 * is a fixed 160px label, which in this grid's ~176px columns left the combo
 * cell 4px — every combo was painting into the 48px column gap, and the first
 * one longer than the gap (`⌥ then 1–5`) reached the neighbour's labels. The
 * label truncates, the combo hugs, an over-long combo clips at the column edge.
 *
 * @param {Array}    sections    `[{ section, items: [{ id, label, combo }] }]`
 * @param {Function} comboLabel  (combo) => string (default: the combo as given)
 */
export default function SettingsShortcuts({ sections = [], comboLabel = (c) => c, className = '' }) {
  return (
    <div
      className={`grid md:grid-rows-2 md:grid-flow-col gap-x-6 md:gap-x-12 gap-y-6 ${className}`.trim()}
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, max(150px, calc((100% - 5 * 48px) / 6))), 1fr))' }}
    >
      {sections.map(({ section, items }) => (
        <div key={section} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="kol-eyebrow text-strong mb-2">{section}</span>
          {items.map((k) => (
            <SettingsRow key={k.id ?? k.label} label={k.label} align="fill" labelWidth="auto">
              <span className="text-fg-32 kol-helper-12 whitespace-nowrap">{comboLabel(k.combo)}</span>
            </SettingsRow>
          ))}
        </div>
      ))}
    </div>
  )
}
