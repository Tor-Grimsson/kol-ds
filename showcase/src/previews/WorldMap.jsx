import { WorldMap } from '@kolkrabbi/kol-dashboards'

export const stage = 'lg'

// Inline fixture — visitors by country (ISO codes), the filter a click hands back.
const rows = [
  { key: 'IS', label: 'Iceland', value: 1840, filter: { key: 'country', op: 'eq', value: 'IS' } },
  { key: 'US', label: 'United States', value: 960, filter: { key: 'country', op: 'eq', value: 'US' } },
  { key: 'GB', label: 'United Kingdom', value: 520, filter: { key: 'country', op: 'eq', value: 'GB' } },
  { key: 'DE', label: 'Germany', value: 310, filter: { key: 'country', op: 'eq', value: 'DE' } },
  { key: 'JP', label: 'Japan', value: 90, filter: { key: 'country', op: 'eq', value: 'JP' } },
]

export default function WorldMapPreview() {
  return <div className="w-full max-w-[900px] flex"><WorldMap rows={rows} onFilter={() => {}} /></div>
}
