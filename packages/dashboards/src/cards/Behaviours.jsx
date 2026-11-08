/* The behaviours card: Goals, Properties, Funnels and Explore as tabs (Properties and Funnels hold a menu of
 * `propertyOptions` `{ key, label }` and `funnels` `{ key, label }`). It owns which tab is up; `children` is a function
 * of `{ tab, property, funnel }` that returns that tab's body (GoalsTable, RankedList, FunnelChart, JourneyExplorer). */
import { useState } from 'react'
import Card from './Card.jsx'

export default function Behaviours({ propertyOptions = [], funnels = [], className = 'lg:col-span-2', children }) {
  const [tab, setTab] = useState('goals')
  const [prop, setProp] = useState(null)
  const [funnel, setFunnel] = useState(funnels[0]?.key)
  const active = tab.startsWith('prop') ? 'properties' : tab.startsWith('funnel') ? 'funnels' : tab
  const pick = (k) => {
    if (k.startsWith('prop:')) { setProp(k.slice(5)); setTab(k) }
    else if (k.startsWith('funnel:')) { setFunnel(k.slice(7)); setTab(k) }
    else setTab(k)
  }
  return (
    <Card
      className={className}
      tabs={[
        { key: 'goals', label: 'Goals' },
        { key: 'properties', label: 'Properties', search: true, empty: 'No properties recorded yet', options: propertyOptions.map((o) => ({ key: `prop:${o.key}`, label: o.label })) },
        { key: 'funnels', label: 'Funnels', search: true, options: funnels.map((f) => ({ key: `funnel:${f.key}`, label: f.label })) },
        { key: 'explore', label: 'Explore' },
      ]}
      tab={active === 'properties' ? `prop:${prop}` : active === 'funnels' ? `funnel:${funnel}` : tab}
      onTab={pick}
    >
      {children({ tab: active, property: prop, funnel })}
    </Card>
  )
}
