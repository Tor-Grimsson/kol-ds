/* A funnel: `steps` `{ label, visitors }` as columns, each a bar of its share of the first step, the drop-off to the
 * next on its chip, the conversion rate in the head. */
import { Icon } from '@kolkrabbi/kol-icons'
import { formatCount } from '../shared/formatSeries.js'

export default function FunnelChart({ title, steps = [], loading }) {
  const first = steps[0]?.visitors || 0
  const last = steps[steps.length - 1]?.visitors || 0
  const conv = first ? (last / first) * 100 : 0
  const p = (v) => `${Math.round(v * 100) / 100}%`
  return (
    <div className="pt-4">
      <div className="flex flex-wrap items-center gap-3 pb-6">
        <h3 className="kol-helper-14 text-fg-96 flex-1">{title}</h3>
        <span className="kol-helper-12 text-fg-48">{steps.length}-step funnel</span>
        <span className="text-fg-24">|</span>
        <span className="kol-helper-12 text-fg-48">Sequential</span>
        <span className="text-fg-24">|</span>
        <span className="kol-helper-12 text-fg-48">Conversion rate: <span className="text-fg-96">{p(conv)}</span></span>
      </div>
      {loading && <div className="py-16 text-center kol-helper-12 text-fg-48">Loading…</div>}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((s, i) => {
          const v = s.visitors || 0
          const share = first ? v / first : 0
          const next = steps[i + 1]?.visitors
          return (
            <div key={s.label} className="flex flex-col min-w-0">
              <div className="border-l border-fg-08 pl-3 pb-4">
                <div className="kol-helper-12 text-fg-80 truncate">{s.label}</div>
                <div className="kol-mono-16 text-fg-96 mt-1">{p(share * 100)}</div>
                <div className="kol-helper-12 text-fg-48">{formatCount(v)} visitors</div>
              </div>
              <div className="relative h-56 rounded bg-fg-04 overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 rounded" style={{ height: `${share * 100}%`, background: 'var(--kol-palette-blue)', opacity: 0.7 }} />
                <span className="absolute left-2 bottom-2 inline-flex items-center gap-1.5 rounded bg-surface-primary px-2 py-1 kol-helper-12 text-fg-88">
                  {next != null ? (
                    <><Icon name="arrow-right" size={12} />{p(v ? (next / v) * 100 : 0)}</>
                  ) : (
                    <><Icon name="check" size={12} />{p(conv)}<Icon name="arrow-down" size={12} className="ml-1" />{p(100 - conv)}</>
                  )}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

