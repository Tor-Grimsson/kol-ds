import { useState } from 'react'
import { TabsRow, Button } from '@kolkrabbi/kol-component'

/* one tab component, four looks — the picker on the toolbar flips it */
export const stage = 'md'
export const variants = ['underline', 'chip', 'text', 'stacked', 'float']

/* float (W5 rows 67 · 78, W9 row 137): the inspector's 26 chips · the tab navigation pill with glyphs and counts (lg in a
 * solid capsule, the trailing slot holding search and the primary action) · the mono text tabs, the selected one filled */
const NAV = [
  { id: 'tasks', label: 'Tasks', icon: 'checklist', count: 5 },
  { id: 'capture', label: 'Capture', icon: 'inbox', count: 3 },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'metrics', label: 'Metrics', icon: 'bar-chart' },
  { id: 'links', label: 'Links', icon: 'link' },
]
function FloatRows() {
  const [ins, setIns] = useState('design')
  const [nav, setNav] = useState('tasks')
  const [view, setView] = useState('overview')
  return (
    <div className="flex w-full max-w-[1000px] flex-col gap-8">
      <TabsRow variant="float" size="xs" tabs={[{ id: 'design', label: 'Design' }, { id: 'animate', label: 'Animate' }]} value={ins} onChange={setIns} ariaLabel="Inspector" />
      <TabsRow variant="float" size="lg" surface="solid" tabs={NAV} value={nav} onChange={setNav} ariaLabel="Dashboard"
        trailing={<><Button variant="float" tone="ghost" size="lg" iconOnly="search" aria-label="Search tasks" /><Button variant="float" tone="inverted" size="lg" iconLeft="plus">New task</Button></>} />
      <TabsRow variant="float" type="mono" tabs={['Overview', 'Website', 'Repositories', 'Audience'].map((l) => ({ id: l.toLowerCase(), label: l }))} value={view} onChange={setView} ariaLabel="View" />
    </div>
  )
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'home-01' },
  { id: 'specimens', label: 'Specimens', icon: 'grid' },
  { id: 'downloads', label: 'Downloads', icon: 'download' },
]
/* record's dashboard: six tabs, 394px of underline — wider than a phone column */
const SIX = ['Tasks', 'Capture', 'Projects', 'Calendar', 'Metrics', 'Links'].map((l) => ({ id: l.toLowerCase(), label: l }))

export default function TabsRowPreview({ variant = 'underline' }) {
  if (variant === 'float') return <FloatRows />
  return <Rows variant={variant} />
}

function Rows({ variant }) {
  const [a, setA] = useState('overview')
  const [b, setB] = useState('specimens')
  const [c, setC] = useState('links')
  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <TabsRow variant={variant} tabs={TABS} value={a} onChange={setA} />
      {variant === 'chip' && (
        /* `filled` — every chip shows at rest, so the row reads as choices (the lab rail's tabs) */
        <div className="flex flex-col gap-2">
          <span className="kol-helper-10 text-meta">filled</span>
          <TabsRow variant="chip" filled tabs={TABS} value={a} onChange={setA} />
        </div>
      )}
      {variant === 'underline' && (
        /* the underline row's `type` (2026-10-30): mono (the default), sans (Public Sans at 300, the lab window's), mono-light (the same row on JetBrains Mono) */
        <div className="flex flex-col gap-2">
          <span className="kol-helper-10 text-meta">type sans</span>
          <TabsRow type="sans" tabs={TABS} value={a} onChange={setA} />
          <span className="kol-helper-10 text-meta">type mono-light</span>
          <TabsRow type="mono-light" tabs={TABS} value={a} onChange={setA} />
        </div>
      )}
      {variant === 'underline' && (
        <div className="bg-surface-primary border border-fg-08 rounded overflow-hidden">
          <TabsRow tabs={TABS} value={b} onChange={setB} onClose={() => {}} onMinimise={() => {}} />
        </div>
      )}
      {variant !== 'stacked' && (
        /* A ROW WIDER THAN ITS COLUMN (TabsRowOverflow): `scroll` (the default) — one line, a fade at the clipped edge,
         * the active tab kept in view; `wrap` beside it */
        <div className="flex flex-col gap-4" style={{ maxWidth: 280 }}>
          <span className="kol-helper-10 text-meta">overflow="scroll"</span>
          <TabsRow variant={variant} tabs={SIX} value={c} onChange={setC} ariaLabel="Dashboard" />
          <span className="kol-helper-10 text-meta">overflow="wrap"</span>
          <TabsRow variant={variant} tabs={SIX} value={c} onChange={setC} overflow="wrap" ariaLabel="Dashboard, wrapped" />
        </div>
      )}
    </div>
  )
}
