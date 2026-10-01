import { Fragment, useMemo, useState } from 'react'
import { getTagColor } from '@kolkrabbi/kol-markdown'
import { useSearchParams } from 'react-router-dom'
import { EmptyState, Input, TabsRow, Tag } from '@kolkrabbi/kol-component'
import ResultRow from './ResultRow.jsx'
import { createIndex, search, parseQuery } from '@kolkrabbi/kol-search'
import { DocHeader, DocSection } from '../docs/DocKit.jsx'

/**
 * SearchPage — The search results page. THE results page (2026-09-28). Enter in the shell's palette
 * lands here with `?q=`; so does a tag clicked anywhere (`#tag`). The WHOLE
 * state is the query string in the URL — scope and facet picks are written back
 * into it as `in:` · `kind:` · `cat:` · `tag:` tokens — so Back returns to the
 * same results, a result link is an ordinary navigation, and a search can be
 * shared as a link.
 *
 * It replaced two surfaces that each did half the job: the palette's in-place
 * tag browser and a page whose groups were whatever `sectionLabel` each
 * source happened to emit.
 *
 * @param {Array}  items   kol-search items: { id, title, href, kind?, space?, category?, tags?, headings?, keywords?, description?, date? }
 * @param {Array}  [spaces] the scope row, `[{ value, label }]` in header order — `value` is an item's `space`
 * @param {Array}  [facets] `[[field, label]]` shown as filter rows (default kind · category · tags)
 * @param {number} [limit=60]
 */
const DEFAULT_FACETS = [['kind', 'Kind'], ['category', 'Category'], ['tags', 'Tags']]
const PREFIX = { space: 'in', kind: 'kind', category: 'cat', tags: 'tag' }
const token = (field, value) => `${PREFIX[field] ?? field}:${/\s/.test(value) ? `"${value}"` : value}`

function Highlight({ text, ranges }) {
  if (!ranges?.length) return text
  const out = []
  let at = 0
  ranges.forEach(([s, e], i) => {
    if (s > at) out.push(<Fragment key={`t${i}`}>{text.slice(at, s)}</Fragment>)
    out.push(<span key={`m${i}`} className="underline decoration-2 underline-offset-4">{text.slice(s, e)}</span>)
    at = e
  })
  if (at < text.length) out.push(<Fragment key="rest">{text.slice(at)}</Fragment>)
  return out
}

const readToken = (t) => (t.kind === 'term'
  ? `${t.negate ? 'not ' : ''}“${t.value}”`
  : t.kind === 'date'
    ? `${t.field} ${t.value}`
    : `${t.negate ? 'not ' : ''}${t.field === 'tags' ? 'tag' : t.field}: ${t.value}${t.via === 'smart' ? ' (from the word)' : ''}`)

export default function SearchPage({ items = [], spaces = [], facets = DEFAULT_FACETS, limit = 60, rowVariant = 'underline' }) {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const index = useMemo(() => createIndex(items), [items])
  const out = useMemo(() => search(index, q, { limit }), [index, q, limit])

  const setQ = (next) => setParams(next.trim() ? { q: next } : {}, { replace: true })
  /* a pick adds its token; picking it again takes the token back out */
  const toggleToken = (field, value) => {
    const tok = token(field, value)
    const parts = q.split(/\s+/).filter(Boolean)
    const has = parts.includes(tok)
    setQ((has ? parts.filter((p) => p !== tok) : [...parts, tok]).join(' '))
  }
  const removeToken = (raw) => setQ(q.split(/\s+/).filter((p) => p && p !== raw).join(' '))
  const inSpace = parseQuery(q).filters.space ?? []

  /* THE FACETS ARE TABS (the showcase review W11, 2026-09-30 — user: "could kind category and tags be
   * folded into tabs? … if you are searching something and press enter, why do you need to scroll
   * million kilometers down to get to the actual link"). Three facet sections sat between the box and
   * the results; now one tab strip picks which facet's chips show, and the results follow it. */
  const shown = facets.filter(([field]) => (out.facets[field] ?? []).length)
  const [facetTab, setFacetTab] = useState(facets[0]?.[0])
  const activeFacet = shown.find(([f]) => f === facetTab) ?? shown[0]

  return (
    <div className="flex flex-col gap-10">
      <DocHeader
        eyebrow="Search"
        title="Search"
        lede={q ? `${out.total} result${out.total === 1 ? '' : 's'} for “${q}”.` : 'Every page on the site.'}
      />

      <div className="flex flex-col gap-4">
        {/* md, the ladder's default — lg towered over the page (W11) */}
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search — try atom, tag:pattern/input, in:docs, -legacy"
          iconLeft="search"
          size="md"
          aria-label="Search query"
          autoFocus
        />
        {/* every chip on the page is THE Tag, one size (W11 — they were ghost Buttons and md Pills) */}
        {spaces.length > 0 && (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Scope">
            <Tag hash={false} active={!inSpace.length} onClick={() => setQ(q.split(/\s+/).filter((p) => p && !/^in:/.test(p)).join(' '))}>Everything</Tag>
            {spaces.map((sp) => (
              <Tag key={sp.value} hash={false} active={inSpace.includes(sp.value)} onClick={() => toggleToken('space', sp.value)}>{sp.label}</Tag>
            ))}
          </div>
        )}
        {out.query.tokens.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="kol-doc-eyebrow">Read as</span>
            {out.query.tokens.map((t, i) => (
              <Tag key={`${t.raw}-${i}`} hash={false} variant="secondary" onRemove={() => removeToken(t.raw)} aria-label={`Remove ${t.raw}`}>{readToken(t)}</Tag>
            ))}
          </div>
        )}
      </div>

      {activeFacet && (
        <div className="flex flex-col gap-4">
          <TabsRow tabs={shown.map(([field, label]) => ({ id: field, label }))} value={activeFacet[0]} onChange={setFacetTab} />
          <div className="flex flex-wrap gap-2">
            {(out.facets[activeFacet[0]] ?? []).slice(0, 24).map((f) => (
              <Tag key={f.value} hash={activeFacet[0] === 'tags'} color={activeFacet[0] === 'tags' ? getTagColor(f.value) : undefined} active={f.selected} onClick={() => toggleToken(activeFacet[0], f.value)}>
                {f.value}<span className="ml-1.5 text-subtle">{f.count}</span>
              </Tag>
            ))}
          </div>
        </div>
      )}

      <DocSection id="results" title={`Results (${out.total})`}>
        {out.results.length === 0 ? (
          <EmptyState eyebrow={q ? 'No results' : 'Search'} title={q ? 'Nothing matches.' : 'Type to search.'} body={q ? 'Remove a token above, or try fewer words.' : undefined} />
        ) : (
          <ol className="flex flex-col">
            {out.results.map((r) => (
              <li key={r.item.id} className="border-t border-fg-08 first:border-t-0">
                <ResultRow
                  to={r.item.href}
                  variant={rowVariant}
                  title={<Highlight text={r.item.title} ranges={r.highlights.title} />}
                  meta={[r.item.kind, r.item.category, r.item.space, r.item.date].filter(Boolean).join(' · ')}
                  description={r.item.description}
                />
              </li>
            ))}
          </ol>
        )}
        {out.total > out.results.length && <p className="kol-helper-12 text-meta">{out.total - out.results.length} more — narrow the query.</p>}
      </DocSection>
    </div>
  )
}
