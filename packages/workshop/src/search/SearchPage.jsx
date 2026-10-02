import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { getTagColor } from '@kolkrabbi/kol-markdown'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { EmptyState, Input, Tag } from '@kolkrabbi/kol-component'
import ResultRow from './ResultRow.jsx'
import { Icon } from '@kolkrabbi/kol-icons'
import { createIndex, search, parseQuery } from '@kolkrabbi/kol-search'

/**
 * SearchPage — The search results page. THE results page (2026-09-28). Enter in the shell's search modal
 * lands here with `?q=`; so does a tag clicked anywhere (`#tag`). The WHOLE
 * state is the query string in the URL — scope and facet picks are written back
 * into it as `in:` · `kind:` · `cat:` · `tag:` tokens — so Back returns to the
 * same results, a result link is an ordinary navigation, and a search can be
 * shared as a link.
 *
 * It replaced two surfaces that each did half the job: the search modal's in-place
 * tag browser and a page whose groups were whatever `sectionLabel` each
 * source happened to emit.
 *
 * @param {Array}  items   kol-search items: { id, title, href, kind?, space?, category?, tags?, headings?, keywords?, description?, date? }
 * @param {Array}  [spaces] the scope row, `[{ value, label }]` in header order — `value` is an item's `space`
 * @param {Array}  [facets] `[[field, label]]` — the FIRST is the visible filter row, the rest fold behind `+`
 *                          with the scope and the read-as line (default kind · category · tags)
 * @param {number} [limit=60]
 * @param {string} [resultsPath] the route that shows results, when this box can also sit on another page
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

export default function SearchPage({ items = [], spaces = [], facets = DEFAULT_FACETS, limit = 60, rowVariant = 'underline', rowMeta = 'facts', kindIcons, resultsPath }) {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const q = params.get('q') ?? ''
  const index = useMemo(() => createIndex(items), [items])
  const out = useMemo(() => search(index, q, { limit }), [index, q, limit])

  /* `resultsPath`: the query is written to THAT route — a box on a search home sends its first
   * keystroke straight to the results page instead of filtering in place */
  const setQ = (next) => (resultsPath
    ? navigate(next.trim() ? `${resultsPath}?q=${encodeURIComponent(next)}` : resultsPath, { replace: true })
    : setParams(next.trim() ? { q: next } : {}, { replace: true }))
  /* a pick adds its token; picking it again takes the token back out */
  const toggleToken = (field, value) => {
    const tok = token(field, value)
    const parts = q.split(/\s+/).filter(Boolean)
    const has = parts.includes(tok)
    setQ((has ? parts.filter((p) => p !== tok) : [...parts, tok]).join(' '))
  }
  const removeToken = (raw) => setQ(q.split(/\s+/).filter((p) => p && p !== raw).join(' '))
  /* THE BOX OWNS ITS TEXT (2026-10-01). The URL is still the state, but a navigation lands a beat
   * after the keystroke, and an input controlled by the URL alone dropped the letter typed in
   * between ("tag" arrived as "tg"). The box shows what was typed; the URL follows; a query that
   * changes from OUTSIDE (a chip, Back, a link) is read back into the box. */
  const [text, setText] = useState(q)
  const pushed = useRef(q)
  useEffect(() => {
    if (q !== pushed.current) { pushed.current = q; setText(q) }
  }, [q])
  const type = (next) => { pushed.current = next.trim() ? next : ''; setText(next); setQ(next) }
  const inSpace = parseQuery(q).filters.space ?? []

  /* ONE FILTER ROW (2026-10-01 — user: "why are there so many categories and options, is it relevant
   * to the results we are seeking as a 'searcher'"; ruled: kind stays, the rest folds behind a `+`).
   * The page was a scope row, a "read as" row, a tab strip and its chips before the first result.
   * Now: the box, one row of kind chips, the results. Scope · read-as · category · tags are the
   * same controls, behind the `+` — and open by themselves while one of them is narrowing the list,
   * so an active filter is never hidden. Reverses W11's tab strip (2026-09-30). */
  const [first, ...rest] = facets.filter(([field]) => (out.facets[field] ?? []).length)
  const tokens = out.query.tokens
  const narrowed = inSpace.length > 0 || tokens.some((t) => t.kind !== 'term' && t.field !== first?.[0])
  const [more, setMore] = useState(false)
  const open = more || narrowed
  const chips = ([field]) => (out.facets[field] ?? []).slice(0, 24).map((f) => (
    <Tag key={f.value} hash={field === 'tags'} color={field === 'tags' ? getTagColor(f.value) : undefined} active={f.selected} onClick={() => toggleToken(field, f.value)}>
      {f.value}<span className="ml-1.5 text-subtle">{f.count}</span>
    </Tag>
  ))

  return (
    <div className="flex flex-col gap-6">
      {/* ONE LINE, AND ONLY ONCE THERE IS A QUERY (2026-10-01 — user: "section is search and the title
        * is search, seems like redundant noise"): the eyebrow, the title and the count were three
        * lines, and the count was printed again on the results heading. Without a query the page is
        * its home's (the consumer renders it above) and this is just the box. */}
      {q && <h1 className="kol-doc-section-title">{`${out.total} result${out.total === 1 ? '' : 's'} for “${q}”.`}</h1>}

      <div className="flex flex-col gap-3">
        {/* md, the ladder's default — lg towered over the page (W11) */}
        <Input
          value={text}
          onChange={(e) => type(e.target.value)}
          placeholder="Search — try atom, tag:pattern/input, in:docs, -legacy"
          iconLeft="search"
          size="md"
          aria-label="Search query"
          autoFocus
        />
        {/* every chip on the page is THE Tag, one size (W11 — they were ghost Buttons and md Pills) */}
        {q && (first || spaces.length > 0) && (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={first?.[1] ?? 'Filters'}>
            {first && chips(first)}
            <Tag hash={false} variant="secondary" active={open} onClick={() => setMore((m) => !m)} aria-expanded={open} aria-label="More filters">{open ? '−' : '+'}</Tag>
          </div>
        )}
        {q && open && (
          <div className="flex flex-col gap-3">
            {spaces.length > 0 && (
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Scope">
                <span className="kol-doc-eyebrow">Scope</span>
                <Tag hash={false} active={!inSpace.length} onClick={() => setQ(q.split(/\s+/).filter((p) => p && !/^in:/.test(p)).join(' '))}>Everything</Tag>
                {spaces.map((sp) => (
                  <Tag key={sp.value} hash={false} active={inSpace.includes(sp.value)} onClick={() => toggleToken('space', sp.value)}>{sp.label}</Tag>
                ))}
              </div>
            )}
            {rest.map((facet) => (
              <div key={facet[0]} className="flex flex-wrap items-center gap-2" role="group" aria-label={facet[1]}>
                <span className="kol-doc-eyebrow">{facet[1]}</span>
                {chips(facet)}
              </div>
            ))}
            {tokens.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="kol-doc-eyebrow">Read as</span>
                {tokens.map((t, i) => (
                  <Tag key={`${t.raw}-${i}`} hash={false} variant="secondary" onRemove={() => removeToken(t.raw)} aria-label={`Remove ${t.raw}`}>{readToken(t)}</Tag>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {q && (
        <section id="results" className="flex flex-col gap-4 scroll-mt-20">
          {out.results.length === 0 ? (
            <EmptyState eyebrow="No results" title="Nothing matches." body="Remove a token above, or try fewer words." />
          ) : (
            <ol className="flex flex-col border-t border-fg-08">
              {out.results.map((r) => (
                <li key={r.item.id} className="border-t border-fg-08 first:border-t-0">
                  <ResultRow
                    to={r.item.href}
                    variant={rowVariant}
                    title={<Highlight text={r.item.title} ranges={r.highlights.title} />}
                    /* Round 6 (2026-10-01): `kindIcons` puts a glyph for the kind on the row, `rowMeta="path"` prints the route as the second line */
                    icon={kindIcons?.[r.item.kind] && <Icon name={kindIcons[r.item.kind]} size={14} />}
                    meta={rowMeta === 'path' ? r.item.href : [r.item.kind, r.item.category, r.item.space, r.item.date].filter(Boolean).join(' · ')}
                    description={r.item.description}
                  />
                </li>
              ))}
            </ol>
          )}
          {out.total > out.results.length && <p className="kol-helper-12 text-meta">{out.total - out.results.length} more — narrow the query.</p>}
        </section>
      )}
    </div>
  )
}
