import { useState } from 'react'
import { SectionHead } from '@kolkrabbi/kol-dashboards'
import { MenuMore } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* title · count · fold — a group's head · chart: title, meta and the value at the right · open: with a description */
export const variants = ['group', 'chart', 'open']

export default function SectionHeadPreview({ variant = 'group' }) {
  const [folded, setFolded] = useState(false)
  const head = variant === 'chart'
    ? <SectionHead title="Pageviews" meta="Last 30 days" value="1,036" />
    : variant === 'open'
      ? <SectionHead title="Briefs" count={1} description="What the studio owes this week." controls={<MenuMore label="Options" items={[{ key: 'rename', label: 'Rename' }, { key: 'archive', label: 'Archive' }]} />} folded={folded} onFold={() => setFolded((f) => !f)} />
      : <SectionHead title="Briefs" count={1} folded={folded} onFold={() => setFolded((f) => !f)} />
  return <div className="w-full max-w-[608px] bg-surface-secondary rounded-[var(--kol-float-menu-r)] p-5">{head}</div>
}
