import { Link } from 'react-router-dom'
import DocLayout from './DocLayout.jsx'
import DocHeader from './DocHeader.jsx'
import BlockViewer from './BlockViewer.jsx'
import { slugify, getComponentBySlug } from './registry.js'

/**
 * CollectionPage — the dedicated page for ONE collection item (block or set)
 * at `<basePath>/:slug`: docs chrome + header + the full viewer stage + the
 * COMPOSITION manifest (every component the item is compiled from, scanner-
 * derived — see scripts/extract-composition.mjs) + prev/next pager.
 */

/* KOL loaders are documented on /docs/loaders, not component pages. */
const DOC_ROUTES = { Icon: '/docs/loaders', Graphic: '/docs/loaders' }

const kolHref = (name) => {
  if (DOC_ROUTES[name]) return DOC_ROUTES[name]
  const slug = slugify(name)
  return getComponentBySlug(slug) ? `/components/${slug}` : null
}

const chipCls = 'inline-flex items-center rounded-[var(--kol-radius-sm)] border border-fg-12 px-2.5 py-1 kol-mono-12'

function Composition({ composition }) {
  if (!composition) return null
  const { kol = [], local = {}, support = [], external = [] } = composition
  const localAreas = Object.entries(local)

  return (
    <section className="flex flex-col gap-6">
      <h2 className="kol-sans-heading-03 text-emphasis">Components</h2>

      {kol.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="kol-helper-10 uppercase tracking-widest text-meta">KOL components ({kol.length})</p>
          <div className="flex flex-wrap gap-2">
            {kol.map((name) => {
              const href = kolHref(name)
              return href ? (
                <Link key={name} to={href} className={`${chipCls} text-emphasis transition-colors hover:border-fg-40`}>
                  {name}
                </Link>
              ) : (
                <span key={name} className={`${chipCls} text-body`}>{name}</span>
              )
            })}
          </div>
        </div>
      )}

      {localAreas.map(([area, names]) => (
        <div key={area} className="flex flex-col gap-3">
          <p className="kol-helper-10 uppercase tracking-widest text-meta">{area} — local parts ({names.length})</p>
          <div className="flex flex-wrap gap-2">
            {names.map((name) => (
              <span key={name} className={`${chipCls} text-body`}>{name}</span>
            ))}
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
