import { Link, useParams } from 'react-router-dom'
import { DocHeader, DocSection, DocsFrontmatter } from '@kolkrabbi/kol-workshop'
import { CodeBlock } from '@kolkrabbi/kol-component'
import { SETS, getSet, SET_CATEGORY_LABELS } from '../lib/sets-registry.js'
import { getComponentBySlug, slugify, CATEGORY_ORDER, CATEGORY_LABELS } from '../nav/registry.js'

/**
 * SetPage — a set shown AS A SET (the showcase review W9, 2026-09-30 — user: *"why do both sets and
 * blocks use the same responsive component … surely they are not solving the same problem … set needs
 * instead something that visualises A SET aka a collection aka corpus aka group of things"*).
 *
 * It used to be CollectionPage over BlockViewer — the blocks' device frame, whose whole job is to show
 * how one composition breakpoints. A set is a family: what it holds comes first, grouped by tier, then
 * the family working together, then its source. Blocks keep CollectionPage.
 */
const linkCls = 'kol-table-token hover:text-emphasis'
const omit = (obj = {}, keys) => Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))

/* the set's members on the atomic ladder — every DS component it is built from, by tier */
function membersByTier(entry) {
  const comps = (entry.composition?.kol ?? [])
    .map((name) => getComponentBySlug(slugify(name)))
    .filter(Boolean)
  return CATEGORY_ORDER
    .map((tier) => [tier, comps.filter((c) => c.category === tier).sort((a, b) => a.displayName.localeCompare(b.displayName))])
    .filter(([, list]) => list.length)
}

export default function SetPage() {
  const { slug } = useParams()
  const entry = getSet(slug)
  if (!entry) {
    return (
      <>
        <DocHeader eyebrow="Sets" title="Not found" lede={`No set named “${slug}”.`} />
        <Link to="/sets" className="kol-mono-14 text-meta hover:text-emphasis">← All sets</Link>
      </>
    )
  }
  const tiers = membersByTier(entry)
  const local = Object.entries(entry.composition?.local ?? {})
  const total = tiers.reduce((n, [, l]) => n + l.length, 0)
  const i = SETS.findIndex((s) => s.key === entry.key)
  const prev = SETS[i - 1]
  const next = SETS[i + 1]

  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocsFrontmatter metadata={omit(entry.meta, ['title', 'description'])} />
      <DocHeader eyebrow={`Sets · ${SET_CATEGORY_LABELS[entry.category] ?? entry.category}`} title={entry.title} lede={entry.description} />

      {/* THE SET — its members, a column per tier, so the family reads at a glance */}
      <DocSection id="members" title="The set" lede={`${total} components from the design system${local.length ? ', and the parts built for this set' : ''}.`}>
        <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))' }}>
          {tiers.map(([tier, list]) => (
            <div key={tier} className="flex flex-col gap-3">
              <p className="kol-doc-eyebrow">{CATEGORY_LABELS[tier] ?? tier} · {list.length}</p>
              <div className="flex flex-wrap gap-2">
                {list.map((c) => <Link key={c.slug} to={`/components/${c.slug}`} className={linkCls}>{c.displayName}</Link>)}
              </div>
            </div>
          ))}
          {local.map(([area, names]) => (
            <div key={area} className="flex flex-col gap-3">
              <p className="kol-doc-eyebrow">Built for this set · {names.length}</p>
              <div className="flex flex-wrap gap-2">
                {names.map((n) => <span key={n} className="kol-table-token">{n}</span>)}
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      {/* IN USE — the family working together, at the page's width; a set is not shown per device */}
      <DocSection id="in-use" title="In use">
        <div className="overflow-hidden rounded-[var(--kol-radius-sm)] border border-oq-08">
          <iframe title={entry.title} src={`/sets/preview/${entry.key}`} className="block w-full border-0" style={{ height: 800 }} />
        </div>
        <Link to={`/sets/preview/${entry.key}`} target="_blank" rel="noreferrer" className="kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64">Open it alone</Link>
      </DocSection>

      <DocSection id="source" title="Source">
        <div className="max-w-[var(--kol-content-panel)]">
          <CodeBlock code={entry.source} language="jsx" filename={`showcase/src/sets/${entry.key}.jsx`} />
        </div>
      </DocSection>

      <div className="flex items-center justify-between border-t border-fg-08 pt-6">
        {prev ? <Link to={`/sets/${prev.key}`} className="kol-mono-12 text-meta hover:text-emphasis">← {prev.title}</Link> : <span />}
        {next ? <Link to={`/sets/${next.key}`} className="kol-mono-12 text-meta hover:text-emphasis">{next.title} →</Link> : <span />}
      </div>
    </div>
  )
}
