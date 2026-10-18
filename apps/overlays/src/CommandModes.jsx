import { useState } from 'react'
import { CommandOverlay } from '@kolkrabbi/kol-component'
import { CATEGORIES, MODULES, KEYMAP } from './monitor-data.js'

/* CommandOverlay's modes on monitor's real content (monitor-data.js). `add` is monitor's ModuleSearch's content
 * (src/rack/ModuleSearch.jsx) as fold rows: All, the categories and sizes open in place; typing searches every module. */

export { KEYMAP }

const title = (s) => s[0].toUpperCase() + s.slice(1)

const MODULE_ROWS = MODULES.map((m) => ({ id: m.id, label: m.label, hint: `${m.hp}HP ${m.u}U`, group: title(m.category), u: m.u, category: m.category }))
/* ADD AS FOLDS: All first (every module), then monitor's categories and sizes — each opens its modules in place */
const fold = (id, label, group, pick) => ({ id, label, group, hint: `${MODULE_ROWS.filter(pick).length} modules`, items: MODULE_ROWS.filter(pick) })
const FOLDS = [
  fold('all', 'All', 'Categories', () => true),
  ...CATEGORIES.map((c) => fold(`cat:${c}`, title(c), 'Categories', (m) => m.category === c)),
  fold('u:1', '1U', 'Size', (m) => m.u === 1),
  fold('u:3', '3U', 'Size', (m) => m.u !== 1),
]

/* monitor's rail (src/App.jsx) */
const PAGES = ['Home', 'Rack', 'Stage', 'Media', 'Settings'].map((label) => ({ id: label, label, icon: 'arrow-right', group: 'Spaces' }))

export default function CommandModes({ Group, Open }) {
  const [mode, setMode] = useState(null)
  const [query, setQuery] = useState('')
  const close = () => { setMode(null); setQuery('') }
  const q = query.trim().toLowerCase()
  const hits = q ? MODULE_ROWS.filter((m) => m.label.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.category.includes(q)) : []

  const props = {
    search: { results: [...PAGES.filter((p) => p.label.toLowerCase().includes(q)), ...hits], suggestions: PAGES, placeholder: 'Search monitor…', onSelect: close },
    add: { results: hits, suggestions: FOLDS, placeholder: 'Search modules…', selectLabel: 'Add module', onSelect: close },
    shortcuts: { shortcuts: KEYMAP, currentPath: '/rack' },
  }

  return (
    <Group title="CommandOverlay" ships="kol-component · CommandOverlay">
      {['search', 'add', 'shortcuts'].map((m) => <Open key={m} onClick={() => setMode(m)}>{m}</Open>)}
      <CommandOverlay open={!!mode} mode={mode ?? 'search'} query={query} onQueryChange={setQuery} onClose={close} {...(mode ? props[mode] : {})} />
    </Group>
  )
}
