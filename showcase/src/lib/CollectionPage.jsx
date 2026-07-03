import { Link } from 'react-router-dom'
import DocLayout from './DocLayout.jsx'
import DocHeader from './DocHeader.jsx'
import BlockViewer from './BlockViewer.jsx'
import DemoStage from './DemoStage.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import { DEMOS } from './demos-registry.js'
import { slugify, getComponentBySlug, FUNCTIONS } from './registry.js'

/**
 * CollectionPage — the dedicated page for ONE collection item (block or set)
 * at `<basePath>/:slug`: docs chrome + header + the full viewer stage + the
 * COMPOSITION gallery (EVERY component the item is compiled from, scanner-
 * derived, each rendered live in its own container) + prev/next pager.
 */

/* KOL loaders are documented on /docs/loaders, not component pages. */
const DOC_ROUTES = { Icon: '/docs/loaders', Graphic: '/docs/loaders' }

const kolHref = (name) => {
  if (DOC_ROUTES[name]) return DOC_ROUTES[name]
  const slug = slugify(name)
  return getComponentBySlug(slug) ? `/components/${slug}` : null
}

const chipCls = 'inline-flex items-center rounded-[var(--kol-radius-sm)] border border-fg-12 px-2.5 py-1 kol-mono-12'

/* One component of the collection, in its own container — live demo where one
 * exists, otherwise a labelled card linking to the component's own page. */
function ComponentSpecimen({ name, local = false }) {
  const slug = slugify(name)
  const comp = getComponentBySlug(slug)
  const href = kolHref(name)
  const demo = DEMOS[name]
  const fn = comp?.function ? FUNCTIONS[comp.function] : null
  const tag = local ? 'LOCAL PART' : fn

  return (
    <div className="overflow-hidden rounded-[var(--kol-radius-md)] border border-fg-08 bg-surface-primary">
      <div className="flex items-center justify-between border-b border-fg-08 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="kol-mono-13 text-emphasis">{name}</span>
          {tag && <span className="kol-helper-10 uppercase tracking-widest text-meta">{tag}</span>}
        </div>
        {href && (
          <Link to={href} className="kol-mono-12 text-meta transition-colors hover:text-emphasis">View →</Link>
        )}
      </div>
      <div className="flex min-h-[96px] items-center justify-center p-6">
        <ErrorBoundary>
          {demo
            ? <DemoStage entry={demo} />
            : <p className="max-w-[52ch] text-center kol-mono-12 text-meta">{comp?.description || (local ? 'Showcase-local part composed into this set.' : 'Live preview on the component page.')}</p>}
        </ErrorBoundary>
      </div>
    </div>
  )
}

function Composition({ composition }) {
  if (!composition) return null
  const { kol = [], local = {}, support = [], external = [] } = composition
  const localAreas = Object.entries(local)

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="kol-sans-heading-03 text-emphasis">Components</h2>
        <p className="kol-mono-12 text-meta">Every KOL component this collection is built from ({kol.length}) — rendered live, one after another.</p>
      </div>

      {/* Live gallery — one container per KOL component, stacked */}
      {kol.length > 0 && (
        <div className="flex flex-col gap-4">
          {kol.map((name) => <ComponentSpecimen key={name} name={name} />)}
        </div>
      )}

      {/* Showcase-local parts (chess board, dashboard cards…) — same container
          treatment, one after another, live where a demo exists. */}
      {localAreas.map(([area, names]) => (
        <div key={area} className="flex flex-col gap-4">
          <p className="kol-helper-10 uppercase tracking-widest text-meta">{area} — local parts ({names.length})</p>
          <div className="flex flex-col gap-4">
            {names.map((name) => <ComponentSpecimen key={name} name={name} local />)}
          </div>
        </div>
      ))}

      {support.length > 0 && (
        <p className="kol-mono-12 text-meta">
          <span className="kol-helper-10 uppercase tracking-widest">support modules</span>{' '}
          {support.join(' · ')}
        </p>
      )}
      {external.length > 0 && (
        <p className="kol-mono-12 text-meta">
          <span className="kol-helper-10 uppercase tracking-widest">external deps</span>{' '}
          {external.join(' · ')}
        </p>
      )}
    </section>
  )
}

export default function CollectionPage({ slug, items, getItem, labels, eyebrow, basePath, previewBase, srcDir, allLabel }) {
  const entry = getItem(slug)

  if (!entry) {
    return (
      <DocLayout>
        <DocHeader eyebrow={eyebrow} title="Not found" lede={`No entry named “${slug}”.`} />
        <Link to={basePath} className="kol-mono-13 text-meta hover:text-emphasis transition-colors">← {allLabel}</Link>
      </DocLayout>
    )
  }

  const i = items.findIndex((b) => b.key === entry.key)
  const prev = items[i - 1]
  const next = items[i + 1]

  return (
    <DocLayout wide>
      <DocHeader
        eyebrow={`${eyebrow} · ${labels[entry.category] ?? entry.category}`}
        title={entry.title}
        lede={entry.description}
      />
      <BlockViewer entry={entry} previewBase={previewBase} srcDir={srcDir} />
      <Composition composition={entry.composition} />
      <div className="flex items-center justify-between border-t border-fg-08 pt-6">
        {prev ? (
          <Link to={`${basePath}/${prev.key}`} className="kol-mono-12 text-meta hover:text-emphasis transition-colors">← {prev.title}</Link>
        ) : <span />}
        {next ? (
          <Link to={`${basePath}/${next.key}`} className="kol-mono-12 text-meta hover:text-emphasis transition-colors">{next.title} →</Link>
        ) : <span />}
      </div>
    </DocLayout>
  )
}
