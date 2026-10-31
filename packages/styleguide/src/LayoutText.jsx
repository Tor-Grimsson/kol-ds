import { DocsToc, Table } from '@kolkrabbi/kol-component'
import { useLayoutType } from './layoutScope.jsx'

/* taxonomy-ok: organism — voice and copy: the lines with their sources (chapters), or one source document */

/**
 * LayoutText — voice and copy, in the brand's type roles (`.t-<role>`, from its TypeLab value): what the brand says,
 * chapter by chapter with where each line comes from (`lines`), or a source document, verbatim, on the rail (`source`).
 * kol-atlas's identity lab (apps/lab v1-verbal.jsx, 2026-10-30), carried class for class (LayoutGroup, 2026-10-31): the
 * chapters, the markdown and the type are props; Atlas's copy and the Lab bar are left out.
 *
 * @param {string} view      `lines` (default) · `source`
 * @param {Array}  chapters  lines: `[{ title, lede, source, blocks }]`; a block is `{ type: 'text', lines }` · `{ type: 'quote', text, source }`
 *                           · `{ type: 'quotes', items }` · `{ type: 'list', items }` · `{ type: 'cards', items: [{ title, body, source }] }`
 *                           · `{ type: 'table', columns, rows }`
 * @param {string} markdown  source: the document (headings, paragraphs, lists, tables; images dropped)
 * @param {string} source    source: where it comes from, the eyebrow over it
 * @param {string} lang      source: the document's language
 * @param {Object} type      a TypeLab value · @param {Object} faces the faces its roles are set in
 */
export default function LayoutText({ view = 'lines', chapters = [], markdown = '', source, lang, type, faces = {}, className = '' }) {
  const t = useLayoutType({ type, faces })
  return (
    <div className={`${t.className} ${className}`.trim()}>
      {t.style}
      {view === 'source' ? <SourceDoc md={markdown} source={source} lang={lang} /> : <Lines chapters={chapters} />}
    </div>
  )
}

const Source = ({ children }) => <p className="t-label">From: {children}</p>

const Block = ({ b }) => {
  if (b.type === 'text') return <div className="flex max-w-[720px] flex-col gap-3">{b.lines.map((l) => <p key={l} className="t-body">{l}</p>)}</div>
  if (b.type === 'quote') return <blockquote className="flex max-w-[720px] flex-col gap-2 border-l-2 border-[var(--kol-layout-ink-emphasis)] pl-6"><p className="t-quote">{b.text}</p><Source>{b.source}</Source></blockquote>
  if (b.type === 'quotes') return <div className="flex max-w-[720px] flex-col gap-4">{b.items.map((q) => <p key={q} className="t-lead">{q}</p>)}</div>
  if (b.type === 'list') return <ol className="grid gap-x-12 sm:grid-cols-2">{b.items.map((x, i) => <li key={x} className="t-body flex gap-4 border-b border-[var(--kol-fg-subtle)] py-2"><span className="w-6 shrink-0 font-bold">{i + 1}</span>{x}</li>)}</ol>
  if (b.type === 'cards') return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {b.items.map((c) => (
        <div key={c.title} className="flex flex-col gap-2 border-t-2 border-[var(--kol-layout-ink-emphasis)] pt-4">
          <p className="t-h5">{c.title}</p>
          <p className="t-body">{c.body}</p>
          <Source>{c.source}</Source>
        </div>
      ))}
    </div>
  )
  if (b.type === 'table') {
    const columns = b.columns.map((h, i) => ({ accessor: String(i), header: h, wrap: true }))
    const rows = b.rows.map((r, j) => ({ id: j, ...Object.fromEntries(r.map((c, i) => [String(i), c])) }))
    return <Table variant="simple" width="column" columns={columns} rows={rows} />
  }
  return null
}

/* the chapters, one after another on one board: number, title, lede, its blocks, and where the words come from */
function Lines({ chapters }) {
  return (
    <div data-theme="light" className="mx-auto flex w-full max-w-[1200px] flex-col gap-24 bg-[var(--kol-surface-primary)] px-16 py-24">
      {chapters.map((c, i) => (
        <section key={c.title} className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="t-eyebrow">{String(i + 1).padStart(2, '0')}</p>
            <h2 className="t-h2">{c.title}</h2>
            {c.lede && <p className="t-lead max-w-[720px]">{c.lede}</p>}
          </div>
          {c.blocks.map((b, j) => <Block key={j} b={b} />)}
          {c.source && <Source>{c.source}</Source>}
        </section>
      ))}
    </div>
  )
}

/* ── a source, verbatim, in its own language: a small markdown subset, set in the t-* roles ── */

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9áðéíóúýþæö]+/g, '-').replace(/^-|-$/g, '')
const inline = (s) => s.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map((p, i) => {
  if (/^\*\*.+\*\*$/.test(p)) return <b key={i}>{p.slice(2, -2)}</b>
  if (/^\*.+\*$/.test(p)) return <i key={i}>{p.slice(1, -1)}</i>
  if (/^`.+`$/.test(p)) return <code key={i} className="t-data">{p.slice(1, -1)}</code>
  if (/^\[.+\]\(.+\)$/.test(p)) return p.replace(/^\[(.+)\]\(.+\)$/, '$1')
  return p
})

/* markdown → blocks: headings, paragraphs, bullet and numbered lists, tables; images dropped */
function blocks(md) {
  const out = []
  const lines = md.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]
    if (!l.trim() || l.startsWith('![') || /^-{3,}\s*$/.test(l)) continue   /* a thematic break draws nothing */
    const h = /^(#{1,3}) (.+)/.exec(l)
    if (h) { out.push({ type: `h${h[1].length}`, text: h[2] }); continue }
    if (l.startsWith('|')) { const rows = []; while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]); i--; out.push({ type: 'table', rows: rows.filter((r) => !/^\|\s*-/.test(r)).map((r) => r.split('|').slice(1, -1).map((c) => c.trim())) }); continue }
    const li = /^(-|\d+\.) /
    if (li.test(l)) {
      const items = []; const ordered = /^\d/.test(l)
      while (i < lines.length && (li.test(lines[i]) || /^ {2,}\S/.test(lines[i]))) { if (li.test(lines[i])) items.push(lines[i].replace(li, '')); else items[items.length - 1] += ' ' + lines[i].trim(); i++ }
      i--; out.push({ type: ordered ? 'ol' : 'ul', items }); continue
    }
    const para = [l]; while (i + 1 < lines.length && lines[i + 1].trim() && !/^(#|\||-|\d+\.|!\[)/.test(lines[i + 1])) para.push(lines[++i])
    out.push({ type: 'p', text: para.join(' ') })
  }
  return out
}

function SourceDoc({ md, source, lang }) {
  const bs = blocks(md)
  /* each ## a stop on the rail, its ### the ticks under it */
  const toc = []
  bs.forEach((b) => {
    if (b.type === 'h2') toc.push({ id: slug(b.text), label: b.text, children: [] })
    if (b.type === 'h3' && toc.length) toc[toc.length - 1].children.push({ id: slug(b.text), label: b.text })
  })
  return (
    <>
    {/* outside the light paper: the rail is pinned to the page edge, so it takes the page's theme. Child ticks 16 apart (KOL draws them at 3), so the rail runs the page's height */}
    <DocsToc toc={toc} variant="rail" className="[&_.kol-toc-child]:h-4" />
    <div lang={lang} className="mx-auto flex w-full max-w-[960px] flex-col gap-6 bg-[var(--kol-surface-primary)] px-20 py-24 [&_b]:font-bold [&_b]:text-[var(--kol-layout-ink-strong)]" data-theme="light">
      {source && <p className="t-eyebrow">{source}</p>}
      {bs.map((b, i) => {
        if (b.type === 'h1') return <h1 key={i} className="t-h1">{inline(b.text)}</h1>
        if (b.type === 'h2') return <h2 key={i} id={slug(b.text)} className="t-h2 scroll-mt-16 pt-12">{inline(b.text)}</h2>
        if (b.type === 'h3') return <h3 key={i} id={slug(b.text)} className="t-h4 scroll-mt-16 pt-6">{inline(b.text)}</h3>
        if (b.type === 'p') return <p key={i} className="t-body">{inline(b.text)}</p>
        if (b.type === 'ul') return <ul key={i} className="t-body m-0 flex list-disc flex-col gap-2 ps-6">{b.items.map((x, j) => <li key={j}>{inline(x)}</li>)}</ul>
        if (b.type === 'ol') return <ol key={i} className="t-body m-0 flex list-decimal flex-col gap-2 ps-6">{b.items.map((x, j) => <li key={j}>{inline(x)}</li>)}</ol>
        if (b.type === 'table') {
          const [head, ...rows] = b.rows
          return <Table key={i} variant="simple" width="column" columns={head.map((h, j) => ({ accessor: String(j), header: h.replace(/\*\*/g, ''), wrap: true }))} rows={rows.map((r, j) => ({ id: j, ...Object.fromEntries(r.map((c, k) => [String(k), inline(c)])) }))} />
        }
        return null
      })}
    </div>
    </>
  )
}

export const LAYOUT_TEXT_VIEWS = ['lines', 'source']
