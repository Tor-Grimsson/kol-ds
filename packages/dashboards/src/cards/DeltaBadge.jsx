/* A tile's change as the canvas wrote it: % for counts, seconds for `kind="duration"`, points for `kind="rate"`
 * (a bounce rate, lower is better). `variant="canvas"` is the 12px line with an arrow glyph instead of an icon. */
import { IconLoader } from '@kolkrabbi/kol-icons'
import { formatDuration } from '../shared/formatSeries.js'

export default function DeltaBadge({ kind = 'count', now, then, variant }) {
  if (then == null || now == null) return null
  let up, text, good
  if (kind === 'duration') { const d = Math.round(now - then); up = d >= 0; text = formatDuration(Math.abs(d)); good = up }
  else if (kind === 'rate') { const d = Math.round((now - then) * 10) / 10; up = d >= 0; text = `${Math.abs(d)} pts`; good = !up }
  else { const d = then ? Math.round(((now - then) / then) * 1000) / 10 : 100; up = d >= 0; text = `${Math.abs(d)}%`; good = up }
  if (variant === 'canvas') return <span style={{ fontSize: 12, color: good ? 'var(--ui-success)' : 'var(--ui-error)' }}>{up ? '↗' : '↘'} {text}</span>
  return (
    <span className="inline-flex items-center gap-0.5 kol-helper-12" style={{ color: good ? 'var(--ui-success)' : 'var(--ui-error)' }}>
      <IconLoader name={up ? 'arrow-upright' : 'arrow-downright'} size={12} />{text}
    </span>
  )
}
