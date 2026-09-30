import { Fragment, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, EmptyState, Input, Pill } from '@kolkrabbi/kol-component'
import ResultRow from './ResultRow.jsx'
import { createIndex, search, parseQuery } from '@kolkrabbi/kol-search'
import { DocHeader, DocSection } from '../docs/DocKit.jsx'

/**
 * SearchPage — THE results page (2026-09-28). Enter in the shell's palette
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

  return (
    <div className="flex flex-col gap-10">
      <DocHeader
        eyebrow="Search"
        title="Search"
        lede={q ? `${out.total} result${out.total === 1 ? '' : 's'} for “${q}”.` : 'Everything in the site — components, docs, blocks, sets.'}
      />

      <div className="flex flex-col gap-4">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search — try atom, tag:pattern/input, in:docs, -legacy"
          iconLeft="search"
          size="lg"
          aria-label="Search query"
          autoFocus
        />
        {spaces.length > 0 && (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Scope">
            <Button variant="ghost" size="sm" pressed={!inSpace.length} onClick={() => setQ(q.split(/\s+/).filter((p) => p && !/^in:/.test(p)).join(' '))}>Everything</Button>
            {spaces.map((sp) => (
              <Button key={sp.value} variant="ghost" size="sm" pressed={inSpace.includes(sp.value)} onClick={() => toggleToken('space', sp.value)}>
                {sp.label}
              </Button>
            ))}
          </div>
        )}
        {out.query.tokens.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="kol-doc-eyebrow">Read as</span>
            {out.query.tokens.map((t, i) => (
              <button key={`${t.raw}-${i}`} type="button" onClick={() => removeToken(t.raw)} aria-label={`Remove ${t.raw}`} className="cursor-pointer">
                <Pill variant={t.kind === 'term' ? 'secondary' : 'primary'} size="md">{readToken(t)} ×</Pill>
              </button>
            ))}
          </div>
        )}
      </div>

      {facets.map(([field, label]) => {
        const values = (out.facets[field] ?? []).slice(0, 16)
        if (!values.length) return null
        return (
          <DocSection key={field} id={`facet-${field}`} title={label}>
            <div className="flex flex-wrap gap-2">
              {values.map((f) => (
                <Button key={f.value} variant="ghost" size="sm" pressed={f.selected} onClick={() => toggleToken(field, f.value)}>
                  {f.value}<span className="ml-1.5 opacity-60">{f.count}</span>
                </Button>
              ))}
            </div>
          </DocSection>
        )
      })}

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
        {out.total > out.results.length && <p className="kol-helper-12 text-subtle">{out.total - out.results.length} more — narrow the query.</p>}
      </DocSection>
    </div>
  )
}
