import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Icon } from '@kolkrabbi/kol-loader'
import DocLayout from '../lib/DocLayout.jsx'
import { DEMOS } from '../lib/demos-registry.js'
import { getComponentBySlug, CATEGORY_LABELS } from '../lib/registry.js'
import { DOC_DATA } from '../lib/component-docs.js'
import ErrorBoundary from '../lib/ErrorBoundary.jsx'

/**
 * ComponentPage — the generic shadcn-style component doc, driven by:
 *   registry (name, pkg, category, description) + DEMOS (one-file previews) +
 *   DOC_DATA (usage, examples, api). Any /c/:slug renders from data — no
 *   per-component page files. Badge is now just an instance of this.
 */

const PMS = { pnpm: 'pnpm add', npm: 'npm install', yarn: 'yarn add', bun: 'bun add' }

/* Render inline `code` spans inside a plain string. */
function RichText({ text }) {
  if (!text) return null
  return text.split('`').map((part, i) =>
    i % 2 ? <code key={i} className="kol-mono-12 text-emphasis">{part}</code> : part,
  )
}

function Copy({ text }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard?.writeText(text).catch(() => {}); setDone(true); setTimeout(() => setDone(false), 1400) }}
      className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-[var(--kol-radius-sm)] text-meta hover:text-emphasis hover:bg-fg-08 transition-colors"
      aria-label={done ? 'Copied' : 'Copy'}
    >
      <Icon name={done ? 'check' : 'copy'} size={13} />
    </button>
  )
}

function CodeLine({ text }) {
  return (
    <div className="relative">
      <pre className="kol-mono-12 overflow-x-auto rounded-[var(--kol-radius-sm)] border border-fg-08 bg-fg-04 px-3 py-2.5 pr-10 text-fg">{text}</pre>
      <Copy text={text} />
    </div>
  )
}

function Preview({ name }) {
  const [tab, setTab] = useState('preview')
  const entry = DEMOS[name]
  const C = entry?.Component
  return (
    <div className="overflow-hidden rounded-[var(--kol-radius-md)] border border-fg-12">
      <div className="flex items-center gap-1 border-b border-fg-12 px-3 py-2">
        {['preview', 'code'].map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`kol-mono-12 rounded-[var(--kol-radius-sm)] px-3 py-1 capitalize transition-colors ${tab === t ? 'bg-fg-08 text-emphasis' : 'text-meta hover:text-emphasis'}`}>
            {t}
          </button>
        ))}
      </div>
      {tab === 'preview' ? (
        <div className="flex min-h-[20rem] flex-wrap items-center justify-center gap-3 bg-fg-02 p-10">
          <ErrorBoundary>{C ? <C /> : <span className="kol-mono-12 text-meta">no live preview — see usage below</span>}</ErrorBoundary>
        </div>
      ) : (
        <pre className="kol-mono-12 overflow-x-auto whitespace-pre-wrap bg-fg-04 px-4 py-3 text-fg">{entry?.source || '// no source'}</pre>
      )}
    </div>
  )
}

function InstallBlock({ pkg }) {
  const [pm, setPm] = useState('pnpm')
  const cmd = `${PMS[pm]} ${pkg}`
  return (
    <div className="overflow-hidden rounded-[var(--kol-radius-md)] border border-fg-12">
      <div className="flex items-center gap-1 border-b border-fg-12 px-2 py-1.5">
        {Object.keys(PMS).map((k) => (
          <button key={k} type="button" onClick={() => setPm(k)}
            className={`kol-mono-12 rounded-[var(--kol-radius-sm)] px-3 py-1 transition-colors ${pm === k ? 'bg-fg-08 text-emphasis' : 'text-meta hover:text-emphasis'}`}>
            {k}
          </button>
        ))}
      </div>
      <div className="relative">
        <pre className="kol-mono-12 overflow-x-auto bg-fg-04 px-4 py-3 pr-10 text-fg">{cmd}</pre>
        <Copy text={cmd} />
      </div>
    </div>
  )
}

function H2({ id, children }) {
  return <h2 id={id} className="kol-sans-heading-04 text-emphasis scroll-mt-20">{children}</h2>
}

export default function ComponentPage() {
  const { slug } = useParams()
  const c = getComponentBySlug(slug)
  if (!c) return <Navigate to="/components" replace />

  const data = DOC_DATA[c.name] || {}
  const examples = data.examples || []
  const api = data.api || []
  const hasMainDemo = !!DEMOS[c.name]

  const toc = [
    { id: 'installation', label: 'Installation' },
    { id: 'usage', label: 'Usage' },
    ...(examples.length ? [{ id: 'examples', label: 'Examples' }, ...examples.map((e) => ({ id: e.id, label: e.label, sub: true }))] : []),
    ...(api.length ? [{ id: 'api', label: 'API Reference' }] : []),
  ]

  return (
    <DocLayout activeSlug={c.slug} toc={toc}>
      <header className="flex flex-col gap-3">
        <p className="kol-helper-10 uppercase tracking-widest text-meta">Components / {CATEGORY_LABELS[c.category] ?? c.category}</p>
        <h1 className="kol-sans-heading-03 text-emphasis">{c.name}</h1>
        {c.description && <p className="kol-sans-body-01 text-body">{c.description}</p>}
      </header>

      {hasMainDemo && <Preview name={c.name} />}

      <section className="flex flex-col gap-4">
        <H2 id="installation">Installation</H2>
        <InstallBlock pkg={c.pkg} />
      </section>

      <section className="flex flex-col gap-4">
        <H2 id="usage">Usage</H2>
        <CodeLine text={`import { ${c.name} } from '${c.pkg}'`} />
        {data.usage && <CodeLine text={data.usage} />}
      </section>

      {examples.length > 0 && (
        <section className="flex flex-col gap-6">
          <H2 id="examples">Examples</H2>
          {examples.map((e) => (
            <div key={e.id} className="flex flex-col gap-3">
              <h3 id={e.id} className="kol-sans-heading-05 text-emphasis scroll-mt-20">{e.label}</h3>
              {e.desc && <p className="kol-sans-body-02 text-body"><RichText text={e.desc} /></p>}
              <Preview name={e.demo} />
            </div>
          ))}
        </section>
      )}

      {api.length > 0 && (
        <section className="flex flex-col gap-4">
          <H2 id="api">API Reference</H2>
          <div className="overflow-x-auto rounded-[var(--kol-radius-md)] border border-fg-12">
            <table className="w-full text-left kol-sans-body-02">
              <thead>
                <tr className="border-b border-fg-12 text-meta">
                  {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                    <th key={h} className="px-4 py-2.5 kol-helper-10 font-normal uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {api.map((r) => (
                  <tr key={r.prop} className="border-b border-fg-08 align-top last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 kol-mono-12 text-emphasis">{r.prop}</td>
                    <td className="px-4 py-3 kol-mono-12 text-meta">{r.type}</td>
                    <td className="whitespace-nowrap px-4 py-3 kol-mono-12 text-meta">{r.def}</td>
                    <td className="px-4 py-3 text-body">{r.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </DocLayout>
  )
}
