/* A TopStats chart's header: the title on the card rule, a chip row to switch `views` `{ id, label }`, and a ⋮ that
 * picks which `seriesOptions` `{ key, label, color }` the combined view draws (`picked` keys, `onPick(keys)`). */
import { TabsRow, MenuMore } from '@kolkrabbi/kol-component'
import Card from './Card.jsx'

export default function ChartHead({ title, view, views, onView, seriesOptions = [], picked = [], onPicked }) {
  const shown = views.find((v) => v.id === view)?.label ?? title
  return (
    /* the chips centred between the tile row's line and this header's rule: the card's 24 above, 24 under them (pb-6) */
    <div className="pb-4">
      <Card.Head title={shown} rightPad="pb-6" right={<div className="flex items-center gap-1">
        <TabsRow variant="chip" size="sm" value={view} onChange={onView} ariaLabel="Chart" tabs={views} />
        <MenuMore label="Series" minWidth={200}
          items={seriesOptions.map((c) => {
            const on = picked.includes(c.key)
            return { key: c.key, label: c.label, checked: on, icon: <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />, onClick: () => onPicked?.(on ? picked.filter((k) => k !== c.key) : [...picked, c.key]) }
          })} />
      </div>} />
    </div>
  )
}
