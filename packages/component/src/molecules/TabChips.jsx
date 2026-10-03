import Button from '../atoms/Button.jsx'

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
 * ON THE CONTROL SIZE RAMP (user 2026-10-02: *"can we make the tabtoggle align with the size ramp
 * controls use?"*). A chip was a bare button at its own 24px, beside a 26px dropdown in the same
 * bar. Each chip is a `Button variant="tab"` now, so `size` is the ramp's (22 · 26 · 32 · 40) and
 * the chip's look is a Button state anything else can wear.
 *
 * @param {Array}    tabs       `[{ id, label }]`
 * @param {string}   value      id of the active tab (controlled)
 * @param {Function} onChange   `(id) => void`
 * @param {'xs'|'sm'|'md'|'lg'} [size='sm'] the control ramp's rung
 * @param {string}   [ariaLabel] accessible name for the strip
 * @param {string}   [className] extra classes on the row
 */
export default function TabChips({ tabs = [], value, onChange, size = 'sm', ariaLabel, className = '' }) {
  return (
    <div className={`flex items-center gap-1 ${className}`.trim()} role="tablist" aria-label={ariaLabel}>
      {tabs.map((t) => {
        const active = t.id === value
        return (
          /* a tab is selected, not pressed — the role's own attribute replaces Button's aria-pressed */
          <Button
            key={t.id}
            variant="tab"
            size={size}
            pressed={active}
            role="tab"
            aria-selected={active}
            aria-pressed={undefined}
            onClick={() => onChange?.(t.id)}
          >
            {t.label}
          </Button>
        )
      })}
    </div>
  )
}
