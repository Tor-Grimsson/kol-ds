import { CompareGrid } from '@kolkrabbi/kol-component'
import { HubDev } from '@kolkrabbi/kol-shell'
import { Icon } from '@kolkrabbi/kol-icons'

export const stage = 'full'

/* a Dev page with two tabs: a comparison and a bench */
const icon = (name) => ({ size }) => <Icon name={name} size={size} />
const ITEMS = ['chevron-down', 'arrow-right', 'grid'].map((n) => ({ id: n, label: n, a: icon(n), b: icon(n), state: 'same' }))

export default function HubDevPreview() {
  return (
    <HubDev
      storageKey="kol-dev-tab:preview"
      tabs={[
        { value: 'icons', label: 'ICONS', content: <CompareGrid items={ITEMS} labels={{ a: 'app', b: 'kol-icons' }} defaultSize={48} /> },
        { value: 'bench', label: 'BENCH', content: <p className="kol-mono-12 text-meta">The bench content.</p> },
      ]}
    />
  )
}
