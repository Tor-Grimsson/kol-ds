import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Icon } from '@kolkrabbi/kol-icons'
import DocLayout from '../lib/DocLayout.jsx'
import DocHeader, { DocSection } from '../lib/DocHeader.jsx'
import PreviewCard from '../lib/PreviewCard.jsx'
import ApiTable from '../lib/ApiTable.jsx'
import { DEMOS } from '../lib/demos-registry.js'
import { Link } from 'react-router-dom'
import { getComponentBySlug, CATEGORY_LABELS, COMPONENTS_AZ, slugify } from '../lib/registry.js'
import { DOC_DATA } from '../lib/component-docs.js'
import API_GEN from '../usage/api-tables.json'

/* API rows = authored ∪ generated (scripts/extract-api.mjs). Authored rows
 * keep their curated order + descriptions; generated rows fill defaults and
 * append the props the hand-authored table missed (the drift this kills).
 * react-docgen on plain JS only sees defaulted props reliably, so neither
 * side is complete alone. */
function mergeApi(authored, generated) {
  if (!generated.length) return authored
  const gen = new Map(generated.map((r) => [r.prop, r]))
  const rows = authored.map((a) => {
    const g = gen.get(a.prop)
    return g ? {
      prop: a.prop,
      type: a.type && a.type !== '—' ? a.type : g.type,
      def: a.def && a.def !== '—' ? a.def : g.def,
      desc: a.desc || g.desc,
    } : a
  })
  const have = new Set(authored.map((a) => a.prop))
  for (const g of generated) if (!have.has(g.prop)) rows.push(g)
  return rows
}

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

export default function ComponentPage() {
  const { slug } = useParams()
  const c = getComponentBySlug(slug)
  if (!c) return <Navigate to="/components" replace />

  const data = DOC_DATA[c.name] || {}
  const examples = data.examples || []
  const api = mergeApi(data.api || [], API_GEN[c.name] || [])
  const hasMainDemo = !!DEMOS[c.name]

  const members = c.members || []

  const toc = [
    { id: 'installation', label: 'Installation' },
    { id: 'usage', label: 'Usage' },
    ...(members.length ? [{ id: 'parts', label: 'Parts' }, ...members.map((m) => ({ id: slugify(m.name), label: m.name, sub: true }))] : []),
    ...(examples.length ? [{ id: 'examples', label: 'Examples' }, ...examples.map((e) => ({ id: e.id, label: e.label, sub: true }))] : []),
    ...(api.length ? [{ id: 'api', label: 'API Reference' }] : []),
  ]

  return (
    <DocLayout toc={toc}>
      <DocHeader
        eyebrow={`Components / ${CATEGORY_LABELS[c.category] ?? c.category}`}
        title={c.name}
        lede={c.description}
      />

      {hasMainDemo && <PreviewCard entry={DEMOS[c.name]} />}

      <MetaRows meta={c.meta} />

      <DocSection id="installation" title="Installation">
        <InstallBlock pkg={c.pkg} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeLine text={`import { ${[c.name, ...members.map((m) => m.name)].join(', ')} } from '${c.pkg}'`} />
        {data.usage && <CodeLine text={data.usage} />}
      </DocSection>

      {members.length > 0 && (
        <DocSection id="parts" title="Parts" lede={`${c.name} composes from these parts — import them from the same package.`}>
          {members.map((m) => (
            <div key={m.name} className="flex flex-col gap-3">
              <h3 id={slugify(m.name)} className="kol-sans-heading-05 text-emphasis scroll-mt-20">{m.name}</h3>
              {m.description && <p className="kol-sans-body-02 text-body">{m.description}</p>}
              {DEMOS[m.name] && <PreviewCard entry={DEMOS[m.name]} />}
            </div>
          ))}
        </DocSection>
      )}

      {examples.length > 0 && (
        <DocSection id="examples" title="Examples">
          {examples.map((e) => (
            <div key={e.id} className="flex flex-col gap-3">
              <h3 id={e.id} className="kol-sans-heading-05 text-emphasis scroll-mt-20">{e.label}</h3>
              {e.desc && <p className="kol-sans-body-02 text-body"><RichText text={e.desc} /></p>}
              <PreviewCard entry={DEMOS[e.demo]} />
            </div>
          ))}
        </DocSection>
      )}

      {api.length > 0 && (
        <DocSection id="api" title="API Reference">
          <ApiTable rows={api} />
        </DocSection>
      )}

      <Pager slug={c.slug} />
    </DocLayout>
  )
}

/* Source-mined meta under the preview (scripts/extract-docs-meta.mjs):
 * D1 — the kol type classes the component renders text with, so system
 * conformance vs freestyle Tailwind is visible at a glance;
 * D2 — a "Composes" row linking the KOL components it nests. */
function MetaRows({ meta }) {
  if (!meta) return null
  const composed = (meta.composes || [])
    .map((n) => ({ name: n, comp: getComponentBySlug(slugify(n)) }))
  if (!meta.typeClasses?.length && !composed.length) return null
  return (
    <div className="flex flex-col gap-2">
      {meta.typeClasses?.length > 0 && (
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="kol-helper-10 text-meta uppercase tracking-widest shrink-0">Type styles</span>
          {meta.typeClasses.map((t) => (
            <code key={t} className="kol-mono-12 rounded-[var(--kol-radius-sm)] border border-fg-08 bg-fg-04 px-2 py-0.5 text-body">.{t}</code>
          ))}
        </div>
      )}
      {composed.length > 0 && (
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="kol-helper-10 text-meta uppercase tracking-widest shrink-0">Composes</span>
          {composed.map(({ name, comp }) => comp ? (
            <Link key={name} to={`/components/${comp.slug}`} className="kol-mono-12 text-emphasis underline decoration-fg-16 underline-offset-2 hover:decoration-current">{name}</Link>
          ) : (
            <span key={name} className="kol-mono-12 text-meta">{name}</span>
          ))}
        </div>
      )}
    </div>
  )
}

/* Prev / next through the A→Z order (matches the sidebar within groups). */
function Pager({ slug }) {
  const i = COMPONENTS_AZ.findIndex((x) => x.slug === slug)
  const prev = i > 0 ? COMPONENTS_AZ[i - 1] : null
  const next = i >= 0 && i < COMPONENTS_AZ.length - 1 ? COMPONENTS_AZ[i + 1] : null
  return (
    <nav className="mt-2 flex items-center justify-between gap-3 border-t border-fg-08 pt-6">
      {prev ? (
        <Link to={`/components/${prev.slug}`} className="group flex flex-col gap-0.5 text-left">
          <span className="kol-mono-12 text-meta">← Prev</span>
          <span className="kol-sans-body-02 text-body group-hover:text-emphasis">{prev.name}</span>
        </Link>
      ) : <span />}
      {next ? (
        <Link to={`/components/${next.slug}`} className="group flex flex-col gap-0.5 text-right">
          <span className="kol-mono-12 text-meta">Next →</span>
          <span className="kol-sans-body-02 text-body group-hover:text-emphasis">{next.name}</span>
        </Link>
      ) : <span />}
    </nav>
  )
}
