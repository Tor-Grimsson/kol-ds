import { useEffect, useMemo, useState } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { CodeBlock, Dropdown, PageHeader, SegmentedToggle, Table, Tag, Textarea, Tooltip } from '@kolkrabbi/kol-component'
import { PageShell, ShortcutsOverlay } from '@kolkrabbi/kol-shell'
import { DocumentationReader } from '@kolkrabbi/kol-workshop'
import {
  parseDocsMarkdown,
  parseFrontmatter,
  splitFrontmatter,
  joinFrontmatter,
  extractHashtags,
  buildInventory,
  buildInventoryCounts,
  buildTagCounts,
  buildTagCooccurrence,
  getTagColor,
} from '@kolkrabbi/kol-markdown'
import { CORPUS, DOC_MODULES } from 'workshop-fixture'

/* KOL-MARKDOWN, ALONE, IN THE TOOL FRAME — the source on the left, what the engine reads on the
 * right. Pick a fixture doc or type; every view recomputes from the text as it stands. Rendering is
 * kol-workshop's reader (the engine returns tokens, never elements). */

const PATHS = Object.keys(DOC_MODULES).sort()
const label = (p) => p.replace(/^\.\/docs\//, '').replace(/\.md$/, '')
const DOC_OPTIONS = [...PATHS.map((p) => ({ value: p, label: label(p) })), { value: '', label: 'Blank' }]

const VIEWS = [
  { value: 'rendered', label: 'Rendered' },
  { value: 'frontmatter', label: 'Frontmatter' },
  { value: 'structure', label: 'Structure' },
  { value: 'tags', label: 'Tags' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'corpus', label: 'Corpus' },
]

const SHORTCUTS = [
  { section: 'Views', items: VIEWS.map((v, i) => ({ id: v.value, label: v.label, combo: String(i + 1) })) },
  { section: 'Help', items: [{ id: 'sheet', label: 'This sheet', combo: 'S' }] },
]

const show = (v) => (Array.isArray(v) ? v.join(', ') : v === '' ? '—' : String(v))
const Section = ({ title, children }) => (
  <section className="flex flex-col gap-3">
    <h2 className="kol-doc-eyebrow">{title}</h2>
    {children}
  </section>
)

function Rendered({ path, raw }) {
  /* the reader resolves its doc from the route and its text by path — so the preview is a
   * one-doc inventory under a memory router, remounted whenever the id changes */
  const file = path || './docs/scratch/untitled.md'
  const inventory = useMemo(() => buildInventory({ [file]: raw }), [file, raw])
  const id = inventory[0]?.id
  if (!id) return null
  return (
    <MemoryRouter key={id} initialEntries={[`/d/${id}`]}>
      <Routes>
        <Route path="/d/:docId" element={<DocumentationReader inventory={inventory} modules={{ [file]: raw }} docHref={(d) => `/d/${d}`} />} />
      </Routes>
    </MemoryRouter>
  )
}

function Frontmatter({ raw }) {
  const meta = parseFrontmatter(raw)
  const split = splitFrontmatter(raw)
  const lossless = joinFrontmatter(split.fields, split.body) === raw
  return (
    <>
      <Section title="parseFrontmatter — for display (keys lowercased)">
        <Table width="column" columns={[{ accessor: 'key', header: 'Key' }, { accessor: 'value', header: 'Value' }, { accessor: 'type', header: 'Type' }]}
          rows={Object.entries(meta).map(([key, v]) => ({ id: key, key, value: show(v), type: Array.isArray(v) ? 'list' : 'string' }))} />
      </Section>
      <Section title="splitFrontmatter — for editing (case and order kept)">
        <Table width="column" columns={[{ accessor: 'n', header: '#' }, { accessor: 'key', header: 'Key' }, { accessor: 'value', header: 'Value' }]}
          rows={split.fields.map(([key, v], i) => ({ id: `${i}-${key}`, n: i + 1, key, value: show(v) }))} />
        <p className="kol-doc-body">
          {split.has ? (lossless ? 'joinFrontmatter(split) reproduces the source byte for byte.' : 'joinFrontmatter(split) differs from the source — the writer would normalise it on save.') : 'No frontmatter block.'}
        </p>
      </Section>
    </>
  )
}

function Structure({ parsed }) {
  const blocks = [...parsed.introBlocks, ...parsed.sections.flatMap((s) => s.blocks)]
  const counts = blocks.reduce((m, b) => m.set(b.type, (m.get(b.type) ?? 0) + 1), new Map())
  return (
    <>
      <Section title="Table of contents">
        <Table width="column" columns={[{ accessor: 'id', header: 'Anchor' }, { accessor: 'label', header: 'Heading' }]}
          rows={parsed.toc.map((t) => ({ id: t.id, label: t.label }))} />
      </Section>
      <Section title="Blocks by type">
        <Table width="column" columns={[{ accessor: 'type', header: 'Type' }, { accessor: 'count', header: 'Count' }]}
          rows={[...counts].map(([type, count]) => ({ id: type, type, count }))} />
      </Section>
      <Section title="parseDocsMarkdown — the raw output">
        <CodeBlock language="json" code={JSON.stringify(parsed, null, 2)} />
      </Section>
    </>
  )
}

const TagRow = ({ tags }) => (
  <div className="flex flex-wrap gap-2">
    {tags.length ? tags.map((t) => (
      <Tooltip key={t} label={`getTagColor → ${getTagColor(t)}`}><span><Tag text={t} /></span></Tooltip>
    )) : <span className="kol-doc-body">None.</span>}
  </div>
)

function Tags({ raw, parsed }) {
  const meta = parseFrontmatter(raw)
  return (
    <>
      <Section title="Frontmatter tags"><TagRow tags={Array.isArray(meta.tags) ? meta.tags : []} /></Section>
      <Section title="Inline #hashtags — extractHashtags"><TagRow tags={extractHashtags(raw.replace(/^---[\s\S]*?---/, ''))} /></Section>
      <Section title="Inline tags the parser collected"><TagRow tags={parsed.inlineTags} /></Section>
    </>
  )
}

function Inventory({ path, raw }) {
  const [entry] = buildInventory({ [path || './docs/scratch/untitled.md']: raw })
  if (!entry) return null
  return (
    <Section title="buildInventory — this doc's entry">
      <Table width="column" columns={[{ accessor: 'field', header: 'Field' }, { accessor: 'value', header: 'Value' }]}
        rows={[
          { id: 'id', field: 'id', value: entry.id },
          { id: 'file', field: 'file', value: entry.file },
          { id: 'title', field: 'title', value: entry.title },
          { id: 'headings', field: 'headings', value: show(entry.headings) },
          { id: 'tags', field: 'metadata.tags', value: show(entry.metadata.tags ?? '') },
        ]} />
    </Section>
  )
}

function Corpus() {
  const { inventory } = CORPUS
  const counts = buildInventoryCounts(inventory)
  const tags = buildTagCounts(inventory)
  const graph = buildTagCooccurrence(inventory)
  const edges = [...graph.edges].sort((a, b) => b.weight - a.weight || a.source.localeCompare(b.source)).slice(0, 12)
  return (
    <>
      <Section title={`buildInventoryCounts — ${counts.total} docs`}>
        <Table width="column" columns={[{ accessor: 'status', header: 'Status' }, { accessor: 'count', header: 'Docs' }]}
          rows={Object.entries(counts.statuses).map(([status, count]) => ({ id: status, status, count }))} />
      </Section>
      <Section title={`buildTagCounts — ${tags.length} tags`}>
        <Table width="column" columns={[{ accessor: 'tag', header: 'Tag', sortable: true }, { accessor: 'count', header: 'Docs', sortable: true }]}
          rows={tags.map((t) => ({ ...t, id: t.tag }))} />
      </Section>
      <Section title={`buildTagCooccurrence — ${graph.nodes.length} nodes, ${graph.edges.length} edges (strongest 12)`}>
        <Table width="column" columns={[{ accessor: 'source', header: 'Tag' }, { accessor: 'target', header: 'Tag' }, { accessor: 'weight', header: 'Shared docs' }]}
          rows={edges.map((e) => ({ ...e, id: `${e.source}-${e.target}` }))} />
      </Section>
    </>
  )
}

export default function App() {
  const [path, setPath] = useState(PATHS.find((p) => p.includes('01-tokens')) ?? PATHS[0])
  const [raw, setRaw] = useState(DOC_MODULES[path] ?? '')
  const [view, setView] = useState('rendered')
  const [sheet, setSheet] = useState(false)
  const parsed = useMemo(() => parseDocsMarkdown(raw), [raw])

  const pick = (p) => {
    setPath(p)
    setRaw(p ? DOC_MODULES[p] : '---\ntitle: Untitled\ntags: [scratch]\n---\n\n# Untitled\n\n## A section\n\nType here. #draft\n')
  }

  /* S — the sheet; 1–6 — the views. Ignored while typing in the source. */
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target
      if (el?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el?.tagName ?? '')) return
      if (e.key === 's') { e.preventDefault(); setSheet((v) => !v) }
      const n = Number(e.key)
      if (n >= 1 && n <= VIEWS.length) setView(VIEWS[n - 1].value)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const actions = (
    <Tooltip label="Fixture doc">
      <Dropdown value={path} onChange={pick} options={DOC_OPTIONS} maxRows={12} />
    </Tooltip>
  )

  return (
    <PageShell mode="fixed" className="gap-10 [--kol-page-header-mb:0]">
      <PageHeader title="MARKDOWN" actions={actions} />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex min-h-0 flex-col gap-3">
          <h2 className="kol-doc-eyebrow">Source</h2>
          <Textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            axis="none"
            aria-label="Markdown source"
            className="min-h-0 flex-1 [&_textarea]:h-full [&_textarea]:font-mono"
            spellCheck={false}
          />
        </div>
        <div className="flex min-h-0 flex-col gap-4">
          <SegmentedToggle value={view} onChange={setView} options={VIEWS} size="sm" ariaLabel="View" />
          <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto pb-12">
            {view === 'rendered' && <Rendered path={path} raw={raw} />}
            {view === 'frontmatter' && <Frontmatter raw={raw} />}
            {view === 'structure' && <Structure parsed={parsed} />}
            {view === 'tags' && <Tags raw={raw} parsed={parsed} />}
            {view === 'inventory' && <Inventory path={path} raw={raw} />}
            {view === 'corpus' && <Corpus />}
          </div>
        </div>
      </div>
      {sheet && <ShortcutsOverlay shortcuts={SHORTCUTS} onClose={() => setSheet(false)} />}
    </PageShell>
  )
}
