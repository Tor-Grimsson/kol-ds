import { IconLoader } from '@kolkrabbi/kol-icons'

/**
 * Delta — A change against a previous value. `↗ 19.8% from 10,740` (float-everything W2 row 29, 2026-11-04 — the
 * exploration's period comparison under a metric). The change in the float timecode role (mono 12) at the emphasis
 * ink, the arrow a drawn glyph (`arrow-upright` · `arrow-downright`, oq-96 — never a typed ↗), the previous value in
 * the float hint role at fg-64.
 *
 * @param {string|number} value     the change, as the caller words it (`19.8%`, `+320`)
 * @param {'up'|'down'|'flat'} direction  the arrow (default `up`; `flat` draws none)
 * @param {string|number} [from]    the previous value, after "from"
 * @param {string} [fromLabel]      the word before the previous value (default `from`)
 * @param {string} [className]
 */
const ARROW = { up: 'arrow-upright', down: 'arrow-downright' }

export default function Delta({ value, direction = 'up', from, fromLabel = 'from', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <span className="inline-flex items-center gap-1 kol-float-timecode text-fg-emphasis">
        {ARROW[direction] && <IconLoader name={ARROW[direction]} size={12} className="text-oq-96" />}
        {value}
      </span>
      {from != null && <span className="kol-float-hint text-fg-64">{fromLabel} {from}</span>}
    </span>
  )
}
