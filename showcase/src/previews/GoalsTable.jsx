import { GoalsTable } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — a studio site's goals against 4,200 visitors.
const goals = [
  { key: 'contact', label: 'Contact', uniques: 84, total: 96 },
  { key: 'download', label: 'File Download', uniques: 212, total: 340 },
  { key: 'outbound', label: 'Outbound Link: Click', uniques: 468, total: 702 },
]

export default function GoalsTablePreview() {
  return <div className="w-full max-w-[720px]"><GoalsTable goals={goals} visitors={4200} onPick={() => {}} /></div>
}
