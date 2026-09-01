import { SettingsRow } from '@kolkrabbi/kol-component'

/* Was kol-shell's own `LabelRow`, retired 2026-08-30 — it was a second
 * implementation of kol-component's `SettingsRow` (same 160px label column,
 * same value cell), and the DS does not ship two of one thing. `align="fill"`
 * keeps the combo left-aligned in its cell, which is what LabelRow's default
 * baseline row did. */

/**
 * SettingsShortcuts — the keyboard-shortcuts block of a settings page
 * (ShellHomeSystem, kol-fxr 2026-08-27): the same `[{ section, items: [{ id,
 * label, combo }] }]` array `ShortcutsOverlay` takes, laid out six columns ×
 * two sections per column, filled column-first (user, 2026-08-27) — each
 * section an eyebrow (`kol-eyebrow`, strong ink) over SettingsRows. A combo is one
 * token by nature — the value cell is `whitespace-nowrap` and the label yields
 * (SettingsShortcutsComboWrap, kol-monitor 2026-08-27: `⌘ K` broke as `⌘` over
 * `K` in the six-column grid — the cell was squeezed to min-content, not full).
 *
 * @param {Array}    sections    `[{ section, items: [{ id, label, combo }] }]`
 * @param {Function} comboLabel  (combo) => string (default: the combo as given)
 */
export default function SettingsShortcuts({ sections = [], comboLabel = (c) => c, className = '' }) {
  return (
    <div className={`grid grid-cols-6 grid-rows-2 grid-flow-col gap-x-12 gap-y-6 ${className}`.trim()}>
      {sections.map(({ section, items }) => (
        <div key={section} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="kol-eyebrow text-strong mb-2">{section}</span>
          {items.map((k) => (
            <SettingsRow key={k.id ?? k.label} label={k.label} align="fill">
              <span className="text-fg-32 kol-helper-12 whitespace-nowrap">{comboLabel(k.combo)}</span>
            </SettingsRow>
          ))}
        </div>
      ))}
    </div>
  )
}
