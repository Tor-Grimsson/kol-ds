/* The change between two numbers as a percent with an arrow, green when it is the good way (`lowerIsBetter` flips it).
 * Renders nothing without `then`. */
import { Icon } from '@kolkrabbi/kol-icons'

export default function ChangeBadge({ now, then, lowerIsBetter }) {
  if (then == null) return null
  if (!then && !now) return <span className="kol-helper-12 text-fg-48">0%</span>
  const pct = then ? Math.round(((now - then) / then) * 100) : 100
  const up = pct >= 0
  const good = lowerIsBetter ? !up : up
  return (
    <span className="inline-flex items-center gap-0.5 kol-helper-12" style={{ color: pct === 0 ? undefined : good ? 'var(--ui-success)' : 'var(--ui-error)' }}>
      {pct !== 0 && <Icon name={up ? 'arrow-upright' : 'arrow-downright'} size={12} />}
      {Math.abs(pct)}%
    </span>
  )
}
