/**
 * DocTabs — THE tab strip. One control row, every doc surface.
 *
 * Three copies of this existed, and two of them were byte-identical:
 *   PreviewCard.jsx:69           Preview / Code        chip look
 *   component-page-parts.jsx:158 pnpm / npm / yarn/bun chip look — SAME 9 utilities
 *   CollectionLanding.jsx:150    category nav          sans look
 * None was a component, so none could be changed once. The DS ships
 * SegmentedToggle and TabsRow, and all three ignored both — but neither fits
 * here: SegmentedToggle is a JOINED strip with radiogroup semantics, TabsRow
 * is an underline strip. This is the third idiom the docs actually use, so it
 * becomes one named thing rather than a fourth copy.
 *
 * `variant` is look ONLY — the ThemeToggle law. Selection, keyboard and
 * markup are identical across variants.
 *
 * @param {Array}    tabs     [{ key, label }]
 * @param {string}   value    active key (parent-owned)
 * @param {Function} onChange (key) => void
 * @param {string}   variant  'chip' (mono, filled active) | 'plain' (sans, ink-weight active)
 * @param {string}   ariaLabel accessible name for the strip
 */
const LOOK = {
  chip: {
    row: 'flex items-center gap-1',
    cell: 'kol-mono-12 rounded-[var(--kol-radius-sm)] px-3 py-1 transition-colors',
    on: 'bg-fg-08 text-emphasis',
    off: 'text-meta hover:text-emphasis',
  },
  plain: {
    row: 'flex flex-wrap items-center gap-5 kol-sans-body-02',
    cell: 'transition-colors',
    on: 'text-emphasis',
    off: 'text-meta hover:text-emphasis',
  },
}

export default function DocTabs({ tabs = [], value, onChange, variant = 'chip', ariaLabel }) {
  const look = LOOK[variant] ?? LOOK.chip
  return (
    <div className={look.row} role="tablist" aria-label={ariaLabel}>
      {tabs.map((t) => {
        const active = t.key === value
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(t.key)}
            className={`${look.cell} ${active ? look.on : look.off}`}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
