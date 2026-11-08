import { Behaviours, GoalsTable, RankedList, FunnelChart, JourneyExplorer } from '@kolkrabbi/kol-dashboards'

export const stage = 'lg'

// Inline fixture — a studio site's goals, one property, one funnel and a few journeys.
const goals = [
  { key: 'contact', label: 'Contact', uniques: 84, total: 96 },
  { key: 'download', label: 'File Download', uniques: 212, total: 340 },
  { key: 'outbound', label: 'Outbound Link: Click', uniques: 468, total: 702 },
]
const funnels = [{ key: 'work', label: 'Home to Work' }]
const journeys = [
  { items: ['/', '/work', '/work/mirror'], count: 140 },
  { items: ['/', '/about'], count: 96 },
  { items: ['/work', '/work/float'], count: 51 },
]

export default function BehavioursPreview() {
  return (
    <div className="w-full max-w-[1200px]">
      <Behaviours className="" propertyOptions={[{ key: 'plan', label: 'plan' }]} funnels={funnels}>
        {({ tab, property }) => (
          <>
            {tab === 'goals' && <GoalsTable goals={goals} visitors={4200} />}
            {tab === 'properties' && <RankedList rows={[{ label: 'studio', value: 31 }, { label: 'solo', value: 12 }]} total={43} column={property} valueLabel="Events" />}
            {tab === 'funnels' && <FunnelChart title="Home to Work" steps={[{ label: 'Visit /', visitors: 4200 }, { label: 'Visit /work', visitors: 1650 }]} />}
            {tab === 'explore' && <JourneyExplorer journeys={journeys} />}
          </>
        )}
      </Behaviours>
    </div>
  )
}
