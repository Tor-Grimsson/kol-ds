import { RankedList } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

/* rows · a trend against `prev` · the empty and loading states · float: the rows in Inter on the float sheet */
export const variants = ['rows', 'trend', 'empty', 'loading', 'float']

// Inline fixture — links by clicks, last month's in `prev`.
const rows = [
  { label: 'kolkrabbi.io/work', value: 412, prev: 380 },
  { label: 'kolkrabbi.io/foundry/typefaces/malromur', value: 268, prev: 301 },
  { label: 'ui.kolkrabbi.io', value: 143, prev: 143 },
  { label: 'Instagram profile', value: 96, prev: 40 },
  { label: 'Newsletter archive', value: 12, prev: 18 },
]

export default function RankedListPreview({ variant = 'rows' }) {
  const shown = variant === 'trend' ? rows : rows.map(({ prev, ...r }) => r)
  const list = (
    <RankedList
      rows={variant === 'empty' ? [] : variant === 'loading' ? undefined : shown}
      loading={variant === 'loading'}
      total={931}
      column="Link"
      valueLabel="Clicks"
      empty="No clicks this month"
      onPick={() => {}}
      variant={variant === 'float' ? 'float' : undefined}
    />
  )
  if (variant === 'float') return <div className="w-full max-w-[560px] bg-surface-secondary rounded-[var(--kol-float-menu-r)] px-5 pb-5 pt-1 flex flex-col">{list}</div>
  return <div className="w-full max-w-[560px] flex flex-col">{list}</div>
}
