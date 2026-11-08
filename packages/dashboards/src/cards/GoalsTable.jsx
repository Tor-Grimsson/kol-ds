/* Goals as a table: `goals` `{ key, label, uniques, total }` with a bar behind each label, then Uniques, Total and CR
 * (uniques over the page's `visitors`); `onPick(goal)` on a row. */
import { Button } from '@kolkrabbi/kol-component'
import { formatCount } from '../shared/formatSeries.js'

export default function GoalsTable({ goals = [], visitors, loading, onPick }) {
  const max = Math.max(1, ...goals.map((g) => g.uniques))
  return (
    <div className="pt-4">
      <div className="grid grid-cols-[minmax(0,1fr)_8ch_6ch_6ch] sm:grid-cols-[minmax(0,1fr)_repeat(3,8ch)] gap-2 sm:gap-4 kol-helper-12 text-fg-48 pb-2">
        <span>Goal</span><span className="text-right">Uniques</span><span className="text-right">Total</span><span className="text-right">CR</span>
      </div>
      {loading && <div className="py-10 text-center kol-helper-12 text-fg-48">Loading…</div>}
      <div className="flex flex-col" style={{ gap: 'var(--kol-gap-wall-list)' }}>
        {goals.map((g) => (
          <div key={g.key} className="group grid grid-cols-[minmax(0,1fr)_8ch_6ch_6ch] sm:grid-cols-[minmax(0,1fr)_repeat(3,8ch)] gap-2 sm:gap-4 items-center kol-helper-12">
            <Button variant="bare" onClick={() => onPick?.(g)} className="relative min-h-8 sm:h-8 text-left">
              <span className="absolute inset-y-0 left-0 rounded bg-fg-08 group-hover:bg-fg-12" style={{ width: `${Math.max(1.5, (g.uniques / max) * 100)}%` }} />
              <span className="relative block px-2 py-1.5 sm:py-0 text-fg-88 sm:truncate">{g.label}</span>
            </Button>
            <span className="text-right text-fg-96 tabular-nums">{formatCount(g.uniques)}</span>
            <span className="text-right text-fg-96 tabular-nums">{formatCount(g.total)}</span>
            <span className="text-right text-fg-96 tabular-nums">{visitors ? `${Math.round((g.uniques / visitors) * 1000) / 10}%` : '0%'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

