import { Routes, Route, Link } from 'react-router-dom'
import { DocumentationReader } from '@kolkrabbi/kol-workshop'
import { buildInventory } from '@kolkrabbi/kol-workshop/engine'
import { DEMOS } from '../lib/demos-registry.js'
import TopBar from '../lib/TopBar.jsx'

/* The lobby as a memory wall — name + live render, nothing else. Globs the
 * repo-root lobby/ specs; entries with a one-file demo render live. */
const queueModules = import.meta.glob('../../../lobby/*.md', { eager: true, query: '?raw', import: 'default' })
const doneModules = import.meta.glob('../../../lobby/done/*.md', { eager: true, query: '?raw', import: 'default' })

const modules = { ...queueModules, ...doneModules }
const inventory = buildInventory(modules)

const entries = inventory.filter((d) => d.id !== 'INDEX' && !d.id.startsWith('WORKLOG'))
const demoOf = (d) => DEMOS[d.metadata?.component || d.id]
const rendered = entries.filter(demoOf)
const specOnly = entries.filter((d) => !demoOf(d))

const basePath = '/lobby'
const docHref = (id) => `${basePath}/${id}`

function Wall() {
  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rendered.map((d) => (
          <Link key={d.id} to={docHref(d.id)} className="block">
            <div className="kol-helper-12 text-emphasis mb-1">{d.metadata?.component || d.id}</div>
            <div className="rounded border border-fg-08 p-4 max-h-[480px] overflow-hidden pointer-events-none">
              {(() => { const D = demoOf(d).Component; return <D /> })()}
            </div>
          </Link>
        ))}
      </div>
      <div className="kol-helper-12 text-meta leading-7">
        spec only:{' '}
        {specOnly.map((d, i) => (
          <span key={d.id}>
            {i > 0 && ' · '}
            <Link to={docHref(d.id)} className="hover:text-emphasis">{d.metadata?.component || d.id}</Link>
          </span>
        ))}
      </div>
    </div>
  )
}

function SpecView() {
  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <DocumentationReader
        inventory={inventory}
        modules={modules}
        docHref={docHref}
        routes={{ docsIndex: basePath, components: '/components' }}
      />
    </div>
  )
}

export default function Lobby() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route index element={<Wall />} />
        <Route path=":docId" element={<SpecView />} />
      </Routes>
    </>
  )
}
