import { useEffect, useState } from 'react'
import { FloatLayout, PropertyRail } from '@kolkrabbi/kol-shell'
import { ContentRow, EmptyState, SectionText } from '@kolkrabbi/kol-component'
import VisualEditor from './views/VisualEditor.jsx'
import FloatEditor from './views/FloatEditor.jsx'
import FloatLabs from './views/FloatLabs.jsx'
import * as RecordTabs from './views/RecordTabs.jsx'
import * as RecordFloat from './views/RecordFloat.jsx'
import * as Rails from './views/Rails.jsx'
import * as Workspace from './views/Workspace.jsx'
import * as Metrics from './views/Metrics.jsx'
import { PARTS } from './parts/index.js'

/* A view module may also export `bare = true` (full screen, its own chrome), `inspector` (a FloatLayout inspector
 * render fn, gets { hide }) and `layout` (extra FloatLayout props — defaultRail, eyebrow, bottom, …; `bar` merges over
 * the default document capsule). Without `inspector` it gets the shared placeholder below. */
/* the views (plan-2026-11-04-float-views W3). Folio is parked. */
const VIEWS = [
  { path: '/views/float-editor', label: 'Float editor', icon: 'desktop', note: 'Section 5 · 20:12208', Component: FloatEditor, bare: true },
  { path: '/views/float-labs', label: 'Float labs', icon: 'globe', note: 'Labs on FloatLayout · 3.2', Component: FloatLabs, bare: true },
  { path: '/views/visual-editor', label: 'Visual editor', icon: 'pencil', note: 'Scene editing · 9:8594', Component: VisualEditor, bare: true },
  { path: '/views/record-tabs', label: 'Record dashboard · tabs', icon: 'checklist', note: '13:5037', Component: RecordTabs.default, mod: RecordTabs },
  { path: '/views/record-float', label: 'Record dashboard · float', icon: 'inbox', note: '9:14340', Component: RecordFloat.default, mod: RecordFloat },
  { path: '/views/rails', label: 'Rails', icon: 'panel-left', note: '9:14486', Component: Rails.default, mod: Rails },
  { path: '/views/workspace', label: 'Adaptive workspace', icon: 'grid', note: '9:15449', Component: Workspace.default, mod: Workspace },
  { path: '/views/metrics', label: 'Metrics', icon: 'bar-chart', note: '13:6898', Component: Metrics.default, mod: Metrics },
]
/* two groups, each opening its own page (every rail group gets a page): Parts → the 13 families, Views → the screens */
const NAV = [
  { heading: 'Float' },
  { icon: 'home-01', label: 'Home', path: '/' },
  { icon: 'layers', label: 'Parts', path: '/parts', to: '/parts', count: PARTS.length, sub: PARTS.map(({ path, label, icon }) => ({ path, label, icon })) },
  { icon: 'layout', label: 'Views', path: '/views', to: '/views', count: VIEWS.length, sub: VIEWS.map(({ path, label, icon }) => ({ path, label, icon })) },
]
const GROUPS = { '/parts': { headline: 'Parts', body: 'Every float part, family by family — solid and glass.', rows: PARTS }, '/views': { headline: 'Views', body: 'The float screens, built from the parts. Layout, not function.', rows: VIEWS } }

/* routing on the hash — no router dependency, and the same App mounts unchanged as the showcase's Float set
 * (showcase/src/sets/float.jsx), whose own router owns the path (the Controls set's pattern) */
const here = () => window.location.hash.slice(1) || '/'

export default function App() {
  const [path, setPath] = useState(here)
  const [mode, setMode] = useState('properties')
  useEffect(() => {
    const on = () => setPath(here())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const go = (p) => { window.location.hash = p === '/' ? '' : p; setPath(p) }

  const view = VIEWS.find((v) => v.path === path) ?? PARTS.find((v) => v.path === path)
  const group = GROUPS[path]
  if (view?.bare || view?.mod?.bare) return <view.Component />

  const { bar, ...layout } = view?.mod?.layout ?? {}
  return (
    <FloatLayout
      key={path}
      nav={NAV} defaultExpanded={['/parts', '/views']} currentPath={path} onNavigate={go} title="Float"
      bar={{ document: { name: view ? `Float / ${view.label}` : 'Float' }, ...bar }}
      inspector={view?.mod?.inspector ?? (({ hide }) => (
        <PropertyRail title="Inspector" onCollapse={hide} tabs={[{ value: 'layers', label: 'Layers' }, { value: 'properties', label: 'Properties' }]} tab={mode} onTab={setMode}
          sections={[{ rows: [{ render: () => <EmptyState variant="float" title="Nothing selected" body="Select something to see its fields." /> }] }]} />
      ))}
      {...layout}
    >
      {view ? <view.Component /> : (
        <div className="flex flex-col gap-10">
          {(group ? [group] : [{ headline: 'Float', body: 'The float family — its parts and the screens built from them.' }, GROUPS['/parts'], GROUPS['/views']]).map((g) => (
            <div key={g.headline} className="flex flex-col gap-6">
              <SectionText variant="float" headline={g.headline} body={g.body} />
              {g.rows && (
                <div className="flex flex-col gap-2">
                  {g.rows.map((v) => (
                    <ContentRow key={v.path} variant="float" title={v.label} url={v.note ?? v.path} href={`#${v.path}`} onClick={(e) => { e.preventDefault(); go(v.path) }} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </FloatLayout>
  )
}
