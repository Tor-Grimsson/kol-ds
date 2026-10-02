import { Fragment, useEffect, useMemo, useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Button, Dropdown, Input, PageHeader, Pill, SegmentedToggle, ShellSearchOverlay, Tag, ToggleCheckbox, Tooltip } from '@kolkrabbi/kol-component'
import { PageShell, ShortcutsOverlay } from '@kolkrabbi/kol-shell'
import { createIndex, search } from '@kolkrabbi/kol-search'
import { TagGraph } from '@kolkrabbi/kol-workshop'
import { CORPUS } from 'workshop-fixture'

/* KOL-SEARCH, ALONE, IN THE TOOL FRAME — every search surface in one app, so each is seen at every
 * breakpoint before it ships (apps review 2026-09-29 — the user: *"having the results page, and the
 * shortcuts, and overlay etc. in the same app is kinda the point"*):
 *
 *   ⌘K     the search modal (ShellSearchOverlay) on the same engine — Enter commits the query here
 *   /      focuses the query on the results page
 *   S      the syntax sheet
 *   RESULTS · GRAPH   the page's two views: the ranked results, or the index's tags as a network
 *                     (kol-search `tagGraph`, drawn by kol-workshop's TagGraph — ruling D4)
 *
 * The scope in the masthead is the UI's hard filter (what a page passes as `scope`); the facet boxes
 * are chips (`filters`). */

const INDEX = createIndex(CORPUS.searchItems)

const SCOPES = [
  { value: '', label: 'Everything' },
  { value: 'components', label: 'Components' },
  { value: 'docs', label: 'Docs' },
  { value: 'development', label: 'Development' },
  { value: 'blocks', label: 'Blocks' },
  { value: 'sets', label: 'Sets' },
]

const VIEWS = [{ value: 'results', label: 'RESULTS' }, { value: 'graph', label: 'GRAPH' }]
/* the graph reads the corpus as TagGraph's docs shape */
const GRAPH_DOCS = CORPUS.searchItems.map((i) => ({ id: i.id, metadata: { tags: i.tags ?? [] } }))

const EXAMPLES = ['atom', '"atom"', 'atom tag:pattern/action', 'input -textarea', 'in:docs after:2026-09-15', '#domain/layout', 'is:doc release', 'overlay molecules']

const FACETS = [
  ['space', 'Space'],
  ['kind', 'Kind'],
  ['category', 'Category'],
  ['tags', 'Tags'],
]

const RUNG_LABEL = {
  titleExact: 'title exact',
  titlePrefix: 'title prefix',
  titleWord: 'title word',
  title: 'title',
  tagExact: 'tag exact',
  tag: 'tag',
  heading: 'heading',
  keyword: 'keyword',
  description: 'description',
  body: 'body',
}

const SHORTCUTS = [
  { section: 'Query', items: [
    { id: 'search-modal', label: 'The search modal', combo: '⌘K' },
    { id: 'focus', label: 'Focus the query', combo: '/' },
    { id: 'tag', label: 'Tag filter', combo: 'tag:x · #x' },
    { id: 'kind', label: 'Kind filter', combo: 'is:x · kind:x' },
    { id: 'space', label: 'Space filter', combo: 'in:x · space:x' },
    { id: 'cat', label: 'Category filter', combo: 'cat:x' },
  ] },
  { section: 'Refine', items: [
    { id: 'neg', label: 'Must not match', combo: '-word · -tag:x' },
    { id: 'phrase', label: 'Text only, never a filter', combo: '"word"' },
    { id: 'date', label: 'Updated between', combo: 'after: · before:' },
    { id: 'smart', label: 'A word naming a category, kind or space filters by it', combo: 'atom' },
  ] },
  { section: 'Help', items: [{ id: 'sheet', label: 'This sheet', combo: 'S' }] },
]

function Highlight({ text, ranges }) {
  if (!ranges.length) return text
  const out = []
  let at = 0
  ranges.forEach(([s, e], i) => {
    if (s > at) out.push(<Fragment key={`t${i}`}>{text.slice(at, s)}</Fragment>)
    out.push(<mark key={`m${i}`} className="bg-transparent text-auto underline decoration-2 underline-offset-4">{text.slice(s, e)}</mark>)
    at = e
  })
  if (at < text.length) out.push(<Fragment key="rest">{text.slice(at)}</Fragment>)
  return out
}

/* how the box was read — one chip per token */
function Reading({ tokens }) {
  if (!tokens.length) return <p className="kol-doc-body">Nothing typed — every item, filtered by the scope and the boxes.</p>
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tokens.map((t, i) => {
        const text = t.kind === 'term'
          ? `${t.negate ? 'not ' : ''}text “${t.value}”${t.phrase ? ' · phrase' : ''}`
          : t.kind === 'date'
            ? `${t.field} ${t.value}`
            : `${t.negate ? 'not ' : ''}${t.field}: ${t.value}${t.via === 'smart' ? ' · smart' : ''}`
        return (
          <Tooltip key={`${t.raw}-${i}`} label={`typed ${t.raw}`}>
            <span><Pill variant={t.kind === 'term' ? 'secondary' : 'primary'} size="md">{text}</Pill></span>
          </Tooltip>
        )
      })}
    </div>
  )
}

function Facets({ facets, filters, toggle }) {
  return (
    <div className="flex flex-col gap-8">
      {FACETS.map(([field, label]) => (
        <section key={field} className="flex flex-col gap-2">
          <h2 className="kol-doc-eyebrow">{label}</h2>
          {(facets[field] ?? []).length === 0 && <p className="kol-doc-body">—</p>}
          {(facets[field] ?? []).map((f) => {
            const boxed = (filters[field] ?? []).includes(f.value)
            const fromQuery = f.selected && !boxed
            return (
              <ToggleCheckbox
                key={f.value}
                label={`${f.value} (${f.count})${fromQuery ? ' · from the query' : ''}`}
                checked={f.selected}
                disabled={fromQuery}
                onChange={() => toggle(field, f.value)}
              />
            )
          })}
        </section>
      ))}
    </div>
  )
}

function Results({ results, total }) {
  if (!results.length) return <p className="kol-doc-body">No results.</p>
  return (
    <ol className="flex flex-col">
      {results.map((r, i) => {
        const best = new Map()
        for (const reason of r.reasons) {
          const k = `${reason.term}`
          if (!best.has(k) || best.get(k).weight < reason.weight) best.set(k, reason)
        }
        return (
          <li key={r.item.id} className="flex items-start justify-between gap-6 border-t border-fg-08 py-4">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="kol-doc-body text-emphasis">
                <span className="text-subtle">{i + 1}. </span>
                <Highlight text={r.item.title} ranges={r.highlights.title} />
              </p>
              <p className="kol-helper-12 text-subtle">{[r.item.kind, r.item.category, r.item.space, r.item.date].filter(Boolean).join(' · ')}</p>
              {r.item.description && <p className="kol-doc-body">{r.item.description}</p>}
              {r.reasons.length > 0 && (
                <p className="kol-helper-12 text-subtle">
                  {[...best.values()].map((b) => `“${b.term}” ${RUNG_LABEL[b.rung]}${b.hit ? ` (${b.hit})` : ''} +${b.weight}`).join(' · ')}
                  {r.reasons.length > best.size && ` — also ${r.reasons.length - best.size} weaker hit${r.reasons.length - best.size > 1 ? 's' : ''}`}
                </p>
              )}
            </div>
            {r.score > 0 && (
              <Tooltip label="Score — the best hit per term, summed">
                <span className="kol-mono-12 text-subtle">{r.score}</span>
              </Tooltip>
            )}
          </li>
        )
      })}
      {total > results.length && <li className="kol-helper-12 text-subtle border-t border-fg-08 py-4">{total - results.length} more</li>}
    </ol>
  )
}

export default function App() {
  const [q, setQ] = useState('atom')
  const [scope, setScope] = useState('')
  const [filters, setFilters] = useState({})
  const [sheet, setSheet] = useState(false)
  const [view, setView] = useState('results')
  const [modal, setModal] = useState(false)
  const [pq, setPq] = useState('')
  const modalRows = useMemo(
    () => search(INDEX, pq, { limit: 30 }).results.map((r) => ({ id: r.item.id, label: r.item.title, group: r.item.kind, hint: r.item.space, highlights: r.highlights.title })),
    [pq],
  )

  const out = useMemo(
    () => search(INDEX, q, { scope: scope ? { space: scope } : {}, filters, limit: 50 }),
    [q, scope, filters],
  )

  const toggle = (field, value) =>
    setFilters((prev) => {
      const cur = prev[field] ?? []
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]
      return { ...prev, [field]: next }
    })

  /* ⌘K opens the search modal; `/` focuses the query (never the browser's find); S opens the sheet */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setModal((v) => !v); return }
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target
      const typing = el?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el?.tagName ?? '')
      if (e.key === '/' && !typing) { e.preventDefault(); document.getElementById('search-query')?.focus() }
      if (e.key === 's' && !typing) { e.preventDefault(); setSheet((v) => !v) }
      if (e.key === 'Escape' && typing) el.blur()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const actions = (
    <span className="flex items-center gap-2">
      <SegmentedToggle size="sm" value={view} onChange={setView} options={VIEWS} ariaLabel="View" />
      <Tooltip label="Scope">
        <Dropdown value={scope} onChange={setScope} options={SCOPES} />
      </Tooltip>
    </span>
  )
  const hasFilters = Object.values(filters).some((v) => v.length)

  return (
    <PageShell mode="fixed" className="gap-10 [--kol-page-header-mb:0]">
      <PageHeader title="SEARCH" actions={actions} />
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <div className="flex flex-col gap-4">
          <Input
            id="search-query"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the fixture — / to focus, S for the syntax"
            iconLeft="search"
            size="lg"
            aria-label="Query"
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="kol-doc-eyebrow">Try</span>
            {/* the suggestions are the DS Tag, not bare buttons (apps review 2026-09-29) — `kol-tag--data`: a
                query is data and renders verbatim (tag:pattern/action is not TAG:PATTERN/ACTION) */}
            {EXAMPLES.map((ex) => (
              <Tag key={ex} variant="tertiary" hash={false} size="md" className="kol-tag--data" active={q === ex} onClick={() => setQ(ex)}>{ex}</Tag>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <span className="kol-doc-eyebrow">Read as</span>
            <Reading tokens={out.query.tokens} />
          </div>
        </div>
        {view === 'graph' ? (
          <div className="min-h-0 flex-1 overflow-hidden">
            {/* the graph is the index's tags; a tag click searches for it. TagGraph draws a square
                as wide as its box, so the box is capped to the height left — the tool fits the window */}
            <div className="mx-auto w-full max-w-[calc(100dvh-340px)]">
            <MemoryRouter>
              <TagGraph allDocs={GRAPH_DOCS} activeTag={out.query.filters.tags?.[0]} onTagClick={(t) => { setQ(`tag:${t}`); setView('results') }} />
            </MemoryRouter>
            </div>
          </div>
        ) : (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <div className="flex min-h-0 flex-col gap-4 overflow-y-auto pb-12">
            {hasFilters && <span className="self-start"><Button tone="ghost" size="sm" onClick={() => setFilters({})}>Clear the boxes</Button></span>}
            <Facets facets={out.facets} filters={filters} toggle={toggle} />
          </div>
          <div className="flex min-h-0 flex-col gap-2 overflow-y-auto pb-12">
            <h2 className="kol-doc-eyebrow">{out.total} result{out.total === 1 ? '' : 's'}</h2>
            <Results results={out.results} total={out.total} />
          </div>
        </div>
        )}
      </div>
      <ShellSearchOverlay
        open={modal}
        onClose={() => { setModal(false); setPq('') }}
        query={pq}
        onQueryChange={setPq}
        results={modalRows}
        placeholder="Search the fixture"
        enterLabel={pq ? `All results for “${pq}”` : undefined}
        onExpand={() => { setQ(pq); setView('results'); setModal(false); setPq('') }}
        onSelect={(item) => { setQ(`"${item.label}"`); setView('results'); setModal(false); setPq('') }}
      />
      {sheet && <ShortcutsOverlay shortcuts={SHORTCUTS} onClose={() => setSheet(false)} />}
    </PageShell>
  )
}

