import { useState } from 'react'
import { StatTiles } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

/* sm: inside a card's body, static · lg: a card section's head, selectable */
export const sizes = ['sm', 'lg']
/* default: metric's tiles · float: each tile its own sheet — lg the stat tile with delta + sparkline, sm the small
 * metric tile with its window */
export const variants = ['default', 'float']

// Inline fixture — a studio's month.
const items = [
  { key: 'tasks', label: 'Open tasks', value: '32', note: '8 due this week', color: 'var(--kol-palette-blue)' },
  { key: 'captures', label: 'Captures', value: '118', note: 'capture board', color: 'var(--kol-palette-green)' },
  { key: 'projects', label: 'Projects', value: '6', note: '2 in review', color: 'var(--kol-palette-purple)' },
  { key: 'hours', label: 'Hours', value: '146h', note: 'this month', color: 'var(--kol-palette-orange)' },
  { key: 'invoices', label: 'Invoiced', value: '4', note: 'of 5 sent', color: 'var(--kol-palette-teal)' },
  { key: 'links', label: 'Links', value: '931', note: 'clicks', color: 'var(--kol-palette-red)' },
]
const up = (t) => <span style={{ fontSize: 12, color: 'var(--ui-success)' }}>↗ {t}</span>

// the float tiles — a site's traffic, 30 days of pageviews behind each
const spark = [320, 340, 310, 360, 420, 380, 400, 470, 430, 520, 480, 510, 600, 560, 620, 700, 650, 680, 720, 690, 760, 740, 800, 780, 860, 820, 900, 940, 880, 1036]
const traffic = [
  { key: 'visitors', label: 'Unique visitors', value: '12,864', delta: '↗ 19.8%', note: 'from 10,740', spark },
  { key: 'pageviews', label: 'Pageviews', value: '1,036', note: 'Last 30 days', spark: spark.map((v, i) => v * (1 + Math.sin(i) * 0.3)) },
]
const small = [
  { key: 'repo', label: 'Repository views', value: '6,180', note: '15–28 Oct · 14 days' },
  { key: 'clones', label: 'Clones', value: '212', note: '15–28 Oct · 14 days' },
]

export default function StatTilesPreview({ size = 'sm', variant = 'default' }) {
  const [selected, setSelected] = useState('tasks')
  if (variant === 'float') {
    return (
      <div className="w-full max-w-[880px]">
        {size === 'lg'
          ? <StatTiles variant="float" size="lg" items={traffic} />
          : <StatTiles variant="float" size="sm" items={small} />}
      </div>
    )
  }
  if (size === 'lg') {
    return (
      <section className="w-full bg-surface-secondary rounded overflow-hidden">
        <StatTiles size="lg" items={items.map(({ note, ...t }) => ({ ...t, delta: up('12%') }))} selected={selected} onSelect={setSelected} />
      </section>
    )
  }
  return (
    <section className="w-full bg-surface-secondary rounded" style={{ padding: 'var(--kol-pad-card-lg)' }}>
      <StatTiles items={items} />
    </section>
  )
}
