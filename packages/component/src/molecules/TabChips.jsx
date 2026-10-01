/**
 * TabChips — Tabs as a row of chips. the active tab is a filled chip, the rest are quiet text.
 *
 * WHY IT EXISTS (user, 2026-10-01, on the showcase's Preview / Code and pnpm / npm / yarn / bun rows:
 * *"what is this button? its not DS?"* → *"we can just make a tab chip for this purpose exactly
 * like this"*). It was `DocTabs`, a strip local to the showcase, built there because neither
 * shipped tab control fits a toolbar: `SegmentedToggle` is a joined strip with radiogroup
 * semantics, `TabsRow` is an underline strip that wants a rule beneath it. This is the third tab
 * idiom — small, unframed, sits inside a bar — promoted as it was, class for class.
 *
 * Labels render as authored. Selection is the parent's.
 *
 * @param {Array}    tabs       `[{ id, label }]`
 * @param {string}   value      id of the active tab (controlled)
 * @param {Function} onChange   `(id) => void`
 * @param {string}   [ariaLabel] accessible name for the strip
 * @param {string}   [className] extra classes on the row
 */
export default function TabChips({ tabs = [], value, onChange, ariaLabel, className = '' }) {
  return (
    <div className={`flex items-center gap-1 ${className}`.trim()} role="tablist" aria-label={ariaLabel}>
      {tabs.map((t) => {
        const active = t.id === value
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(t.id)}
            className={`kol-mono-12 rounded-[var(--kol-radius-sm)] px-3 py-1 transition-colors [@media(pointer:coarse)]:min-h-8 ${active ? 'bg-fg-08 text-emphasis' : 'text-meta hover:text-emphasis'}`}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
