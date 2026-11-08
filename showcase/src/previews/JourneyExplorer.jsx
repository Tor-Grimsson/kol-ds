import { JourneyExplorer } from '@kolkrabbi/kol-dashboards'

export const stage = 'lg'

// Inline fixture — journeys of up to three pages.
const journeys = [
  { items: ['/', '/work', '/work/mirror'], count: 140 },
  { items: ['/', '/work', '/contact'], count: 38 },
  { items: ['/', '/about'], count: 96 },
  { items: ['/work', '/work/float'], count: 51 },
]

export default function JourneyExplorerPreview() {
  return <div className="w-full max-w-[1000px]"><JourneyExplorer journeys={journeys} /></div>
}
