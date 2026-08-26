import { useEffect } from 'react'

/**
 * ShortcutsOverlay — the keyboard-shortcut sheet: blurred scrim, centred
 * panel, a 2-col grid (label · keys), Esc / backdrop-click close.
 * Ported from the shared cut (mirror's, "copied from kol-monitor").
 *
 * `shortcuts` is a prop — feed the SAME array your settings page renders
 * (both repos hand-maintained the list twice and both pairs drifted).
 * Stacks at `--kol-z-modal`, above the rail's sticky tier.
 *
 * TWO FORMS, DETECTED ON SHAPE (ShortcutsOverlaySections, kol-fxr 2026-08-15):
 *
 *   flat       `[{ label, keys }]`                  — one grid, as shipped
 *   sectioned  `[{ section, items: [{label,keys}] }]` — headings between groups
 *
 * The flat form renders EXACTLY as it did before, so no existing caller moves.
 * The sectioned form exists because a real keymap is grouped — kol-fxr's is
 * Edit · Selection · Layer · Tools · View, and its `shortcutsBySection()`
 * already emits this shape — and flattening it to adopt this component would
 * have lost the grouping. That consumer kept a 99-line local overlay instead,
 * which is the duplication this component exists to end.
 *
 * ONE GRID, NOT NESTED ONES. The headings span both columns
 * (`gridColumn: 1 / -1`) so every `keys` cell in the sheet stays on the same
 * axis — nesting a grid per section would let each group compute its own
 * column width and the keys would stagger down the panel.
 *
 * `keys` is a DISPLAY STRING and is never bound — this component shows a
 * keymap, it does not own one. Formatting a combo (⌘⇧Z) is the consumer's,
 * next to wherever the binding actually lives.
 *
 * @param {Array} props.shortcuts - `[{ label, keys }]` or `[{ section, items }]`
 * @param {Function} props.onClose
 */

const isSectioned = (list) => Array.isArray(list?.[0]?.items)

/* One row of the shared grid. `contents` keeps the pair on the parent grid
 * rather than making the wrapper a cell of its own. */
function Row({ label, keys }) {
  return (
    <span className="contents">
      <span>{label}</span><span className="text-fg-96">{keys}</span>
    </span>
  )
}

export default function ShortcutsOverlay({ shortcuts = [], onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const sectioned = isSectioned(shortcuts)

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 select-none bg-fg-inverse-08"
      style={{ display: 'grid', placeItems: 'center', backdropFilter: 'blur(2px)', zIndex: 'var(--kol-z-modal)' }}
    >
      <div className="text-fg-64 kol-helper-12 bg-surface-primary border border-fg-16" style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '10px 62px', padding: 24, borderRadius: 4 }}>
        {sectioned
          ? shortcuts.map(({ section, items = [] }, i) => (
            <span key={section} className="contents">
              <span
                className="text-fg-32"
                style={{ gridColumn: '1 / -1', marginTop: i === 0 ? 0 : 14 }}
              >
                {section}
              </span>
              {items.map(({ label, keys }) => (
                <Row key={`${section}:${label}`} label={label} keys={keys} />
              ))}
            </span>
          ))
          : shortcuts.map(({ label, keys }) => (
            <Row key={label} label={label} keys={keys} />
          ))}
      </div>
    </div>
  )
}
