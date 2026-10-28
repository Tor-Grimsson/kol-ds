import { useContext, useLayoutEffect, useMemo } from 'react'
import { CodeBlock, DocsToc, Table } from '@kolkrabbi/kol-component'
import { ShellTocContext } from './SiteLayout.jsx'
import { parseDocsMarkdown, splitFrontmatter } from '@kolkrabbi/kol-markdown'

/* MARKDOWN PAGE — a markdown file as a document page (plan-2026-10-28-document W3.2, born in apps/document, home here
 * since W5.2 after his review, 2026-10-28; kol-website's MarkdownPage ticket). kol-markdown's blocks written as the
 * markup `.kol-sheet` already styles (kol-theme's port of kol-atlas's workspace.css, class for
 * class): the head, `.proj` with the `num` gutter when the document is numbered, `p.when` meta lines with their `k`,
 * `.mk` marks and `.why` reasons, `sup.fn` + `ol.fns` notes under the passage that cites them (kol-atlas's rule: a
 * note sits at the end of its phase, not the page), `ol.fns.src` for Sources, tables on the DS `Table` inside
 * `.tablewrap` (a key–value table plain), `CodeBlock` for fences, the `.media` figure grid, blockquote with `cite`,
 * `.tb` item text. No class of its own.
 *
 *   source       the file's text, frontmatter included
 *   numbered     a numbered document (kol-atlas's `proj`): `.proj`, the number gutter, `data-ms` levels, `.tb` items
 *   toc          'frame' (default): the headings go to the frame's TOC rail through ShellTocContext, nothing drawn here;
 *                without a frame, or with 'rail', the DS rail (DocsToc variant="rail"); false: none
 *   linkNotes    every external link becomes a numbered note too (kol-atlas's `footnotes` tabs: Project, SEO + GEO)
 *   fit          'cover' (default): a figure fills its frame; 'contain': the whole image on the plate
 *   ratio        the figure frame's aspect ratio ('4/3' by default, from the theme)
 *   resolveLink  (url) => href — the app maps `#page`, `#page--section` and `.md` links to its routes
 *   assetUrl     (file) => url for `![[file]]` embeds; null draws the file's name on a plate */
const jumpTo = (e) => {
  e.preventDefault()
  const id = e.currentTarget.getAttribute('href')?.slice(1)
  if (id) document.getElementById(id)?.scrollIntoView({ block: 'start' })
}
const MARK = { hand: '✋', park: '🅿️', pin: '📍', done: '✓' }
const isGraphic = (file) => /\.(svg|png)$/i.test(file)
const isExternal = (url) => /^https?:\/\//.test(url)
const shortUrl = (url) => { const s = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''); try { return decodeURIComponent(s) } catch { return s } }

/* THE NOTES — kol-atlas's engine rule (apps/workspace/src/engine/render.js, 2026-10-20): one sequence through the page in
 * reading order, headings included. A `[^key]` takes its number at its first reference, or when its definition line is
 * listed; with linkNotes every external link takes a new number where it stands (the same address twice in one passage
 * shares one). The pending notes are listed before the next ## or ### and at the end, under the passage they belong to;
 * a note's own text can carry links, which join that list. Every link and footnote token is given its number (`t.note`)
 * so the text and the list agree. */
function collectNotes(parsed, linkNotes) {
  const at = {}                 // passage id → [{ key, n, def }]
  const defs = {}               // key → { tokens } (a footnote's text) | { text, url } (a link's)
  const num = {}                // key → number
  let n = 0, pend = [], passage = 'intro'
  const scan = (tokens = []) => tokens.forEach((t) => {
    if (t.type === 'footnote') { if (!(t.key in num)) num[t.key] = ++n; t.note = num[t.key] }
    else if (linkNotes && t.type === 'link' && isExternal(t.url)) {
      let k = pend.find((x) => defs[x]?.url === t.url)
      if (!k) { k = `u${++n}`; num[k] = n; defs[k] = { text: t.text, url: t.url }; pend.push(k) }
      t.note = num[k]
    } else if (t.type === 'link') t.note = undefined
  })
  const scanBlock = (b) => {
    scan(b.tokens); scan(b.citeTokens)
    b.rows?.forEach((r) => (Array.isArray(r) ? r.forEach((c) => scan(c?.tokens)) : scan(r.tokens)))
    b.header?.forEach((c) => scan(c?.tokens))
    b.items?.forEach((it) => scan(it.tokens ?? it.captionTokens))
  }
  const flush = () => {
    if (!pend.length) return
    const list = []
    while (pend.length) {
      const ks = pend.sort((a, b) => (num[a] ?? 1e9) - (num[b] ?? 1e9)); pend = []
      ks.forEach((k) => { if (!(k in num)) num[k] = ++n; list.push({ key: k, n: num[k], def: defs[k] ?? {} }); if (defs[k]?.tokens) scan(defs[k].tokens) })
    }
    at[passage] = list
  }
  const walk = (blocks, sectionId) => {
    blocks.forEach((b) => {
      if (b.type === 'heading3') { flush(); passage = `${sectionId}/${b.id}`; scan(b.tokens); return }
      if (b.type === 'footnote-def') { defs[b.key] = { tokens: b.tokens }; pend.push(b.key); return }
      scanBlock(b)
    })
  }
  walk(parsed.introBlocks, 'intro')
  parsed.sections.forEach((s) => { flush(); passage = s.id; scan(s.tokens); walk(s.blocks, s.id) })
  flush()
  return { at, defs }
}

/* inline tokens → elements */
function Inline({ tokens = [], ctx }) {
  return tokens.map((t, i) => {
    switch (t.type) {
      case 'text': return t.content
      case 'bold': return <strong key={i}>{t.tokens ? <Inline tokens={t.tokens} ctx={ctx} /> : t.content}</strong>
      case 'italic': return <em key={i}>{t.tokens ? <Inline tokens={t.tokens} ctx={ctx} /> : t.content}</em>
      case 'code': return <code key={i}>{t.content}</code>
      case 'link': {
        const ext = isExternal(t.url)
        return <span key={i}><a href={ctx.resolveLink(t.url)} target={ext ? '_blank' : undefined} rel={ext ? 'noopener' : undefined}>{t.text}</a>{t.note && <sup className="fn"><a href={`#fn-${t.note}`}>{t.note}</a></sup>}</span>
      }
      case 'image': {
        /* a markdown image names a file beside the document (`_assets/x.png`, `./x.png`) — the fixture's url for it; a web image as written */
        const local = !/^(https?:|data:|\/)/.test(t.src)
        return <img key={i} src={(local && ctx.assetUrl(t.src.split('/').pop())) || t.src} alt={t.alt} loading="lazy" />
      }
      case 'colorswatch': return <span key={i} className="inline-block size-3 align-middle rounded-sm border border-fg-12" style={{ background: t.color }} />
      case 'hashtag': return `#${t.tag}`
      case 'footnote': return <sup key={i} className="fn"><a href={`#fn-${t.note}`}>{t.note}</a></sup>
      default: return null
    }
  })
}

/* a mark with a reason follows the title (`.mk` + `.why`); a bare mark (📍 Sync) leads it, as kol-atlas prints it */
const Marks = ({ marks = [], lead }) => marks.filter((m) => m.kind !== 'done' && Boolean(m.reason) !== Boolean(lead)).map((m, i) => (
  lead ? <span key={i}>{MARK[m.kind]} </span> : <span key={i}><span className="mk">{MARK[m.kind]}</span>{m.reason && <span className="why">{m.reason}</span>}</span>
))

function Heading({ as: Tag, block, ctx }) {
  const done = block.marks?.some((m) => m.kind === 'done')
  return (
    <Tag id={`a-${block.id}`} className={done ? 'done' : undefined}>
      {block.num && <span className="num">{block.num}</span>}
      <Marks marks={block.marks} lead />
      <Inline tokens={block.tokens ?? [{ type: 'text', content: block.content }]} ctx={ctx} />
      <Marks marks={block.marks} />
    </Tag>
  )
}

/* the notes of one passage: a footnote's text, or a link's text and short address */
function Notes({ list = [], ms, ctx }) {
  if (!list.length) return null
  return (
    <ol className="fns" data-ms={ms ? '' : undefined} start={list[0].n}>
      {list.map(({ key, n, def: d }) => (
        <li key={key} id={`fn-${n}`}>
          <span className="fnn">{n}.</span>
          {d.url ? <><a href={d.url} target="_blank" rel="noopener">{d.text}</a> <span className="url">{shortUrl(d.url)}</span></> : <Inline tokens={d.tokens ?? []} ctx={ctx} />}
        </li>
      ))}
    </ol>
  )
}

/* the figure grid: a workspace image by its file, or a web link card (`![caption](https://…)`) — its stored screenshot,
 * the figure a link to the site, the site's name on the plate when there is no shot. A figure fills its frame (`fit`
 * 'cover', the theme's default); `fit="contain"` shows the whole image on the plate; `ratio` sets the frame ('4/3') */
function MediaGrid({ items, ctx }) {
  const cols = items.length <= 2 ? 2 : items.length === 3 ? 3 : 4
  return (
    <div className="media" data-fit={ctx.fit === 'contain' ? 'contain' : undefined} style={{ '--cols': cols, ...(ctx.ratio ? { '--media-ratio': ctx.ratio } : {}) }}>
      {items.map((it, i) => {
        const web = isExternal(it.file)
        const url = ctx.assetUrl(it.file)
        const fig = (
          <figure key={i} className={!web && isGraphic(it.file) ? 'g' : undefined}>
            {url ? <img src={url} alt={it.caption || it.file} loading="lazy" /> : <div className="doc">{web ? shortUrl(it.file) : it.file}</div>}
            <figcaption>{it.captionTokens ? <Inline tokens={it.captionTokens} ctx={ctx} /> : it.caption || it.file.split('/').pop()}</figcaption>
          </figure>
        )
        return web ? <a key={i} href={it.file} className="no-underline">{fig}</a> : fig
      })}
    </div>
  )
}

function TableBlock({ block, ms, ctx }) {
  const cell = (c, key) => <Inline key={key} tokens={c.tokens} ctx={ctx} />
  if (block.kv) {
    return (
      <div className="tablewrap kv" data-ms={ms ? '' : undefined}>
        <table><tbody>{block.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={block.align?.[j] === 'right' ? 'num' : undefined}>{cell(c, j)}</td>)}</tr>)}</tbody></table>
      </div>
    )
  }
  const columns = block.headers.map((h, j) => ({ accessor: `c${j}`, header: h, wrap: true, align: block.align?.[j] }))
  const rows = block.rows.map((r, i) => Object.fromEntries([['id', i], ...r.map((c, j) => [`c${j}`, cell(c, `${i}-${j}`)])]))
  return <div className="tablewrap" data-ms={ms ? '' : undefined}><Table variant="simple" columns={columns} rows={rows} /></div>
}

/* a section's blocks in order; each passage's notes close it. In a numbered document (`.proj`) the text has three
 * levels, kol-atlas's: MILESTONE text (the intro, and under a ## before any ###) hangs back into the gutter with
 * `data-ms`; PHASE text (under a ###) sits at the padded edge; ITEM text (under a ####) is `.tb`, one gutter further. */
function Blocks({ blocks, sectionId, sources, ctx }) {
  const out = []
  let passage = sectionId
  let level = 'ms'      // 'ms' · 'phase' · 'item'
  let skipList = false  // the list under a pop-out definition is the pop-out's, not the page's
  const ms = () => (ctx.proj && level === 'ms' ? '' : undefined)
  const tb = () => (ctx.proj && level === 'item' ? 'tb' : undefined)
  const close = (key) => out.push(<Notes key={`notes-${key}`} list={ctx.notes.at[passage]} ms={ms() !== undefined} ctx={ctx} />)
  blocks.forEach((b, i) => {
    switch (b.type) {
      case 'heading3': close(i); passage = `${sectionId}/${b.id}`; level = 'phase'; out.push(<Heading key={i} as="h3" block={b} ctx={ctx} />); break
      case 'heading4': level = 'item'; out.push(<Heading key={i} as="h4" block={b} ctx={ctx} />); break
      case 'meta': {
        /* one `p.when` per run of meta lines, the lines on <br>; an Acceptance line is its own `p.dw` (the engine's rule) */
        const runs = []
        b.rows.forEach((r) => { const dw = r.key === 'Acceptance'; const last = runs[runs.length - 1]; if (!dw && last && !last.dw) last.rows.push(r); else runs.push({ dw, rows: [r] }) })
        runs.forEach((run, j) => out.push(
          <p key={`${i}-${j}`} className={run.dw ? 'dw' : 'when'} data-ms={ms()}>
            {run.rows.map((r, k) => <span key={k}>{k > 0 && <br />}<span className="k">{r.key}:</span> <Inline tokens={r.tokens} ctx={ctx} /></span>)}
          </p>,
        ))
        break
      }
      case 'paragraph': out.push(<p key={i} className={b.tokens.length === 1 && b.tokens[0].type === 'italic' ? 'note' : tb()} data-ms={ms()}><Inline tokens={b.tokens} ctx={ctx} /></p>); break
      case 'list': {
        if (skipList) { skipList = false; break }
        /* a Sources list is numbered notes whatever its bullet (kol-atlas's rule) */
        const L = b.ordered || sources ? 'ol' : 'ul'
        out.push(<L key={i} className={sources ? 'fns src' : tb()} data-ms={ms()}>{b.items.map((it, j) => {
          /* a Sources item: number, text, and the short address of its first link (the engine's rule) */
          const u = sources && it.tokens.find((t) => t.type === 'link' && isExternal(t.url))?.url
          return <li key={j}>{sources && <span className="fnn">{j + 1}.</span>}<Inline tokens={it.tokens} ctx={ctx} />{u && <> <span className="url">{shortUrl(u)}</span></>}</li>
        })}</L>)
        break
      }
      case 'blockquote': out.push(<blockquote key={i} data-ms={ms()}><p><Inline tokens={b.tokens} ctx={ctx} /></p>{b.cite && <cite><Inline tokens={b.citeTokens} ctx={ctx} /></cite>}</blockquote>); break
      case 'code': out.push(<CodeBlock key={i} language={b.lang || 'text'} code={b.lines.join('\n')} />); break
      case 'divider': out.push(<hr key={i} />); break
      case 'table': out.push(<TableBlock key={i} block={b} ms={ms() !== undefined} ctx={ctx} />); break
      case 'media': out.push(<MediaGrid key={i} items={b.items} ctx={ctx} />); break
      case 'popout-def': skipList = true; break
      default: break   // footnote-def: its text is read by the notes
    }
  })
  close('end')
  return out
}

export default function MarkdownPage({ source = '', numbered = false, toc = 'frame', linkNotes = false, fit = 'cover', ratio, resolveLink = (u) => u, assetUrl = () => null }) {
  const { fields, body } = useMemo(() => splitFrontmatter(source), [source])
  const fm = Object.fromEntries(fields)
  const parsed = useMemo(() => parseDocsMarkdown(body, { numbered }), [body, numbered])
  const h1 = parsed.introBlocks.find((b) => b.type === 'heading1')
  const title = h1?.content ?? fm.title ?? ''
  const proj = numbered
  const notes = useMemo(() => collectNotes(parsed, linkNotes), [parsed, linkNotes])
  const ctx = { notes, proj, linkNotes, fit, ratio, resolveLink, assetUrl }

  /* two sections with one heading (a research paper repeats its brand names) get one anchor each */
  const seen = {}
  const sections = parsed.sections.map((s) => { seen[s.id] = (seen[s.id] ?? 0) + 1; return seen[s.id] > 1 ? { ...s, id: `${s.id}-${seen[s.id]}` } : s })
  const tocItems = sections.map((s) => ({ id: `a-${s.id}`, label: s.heading }))
  const setToc = useContext(ShellTocContext)
  const onFrame = toc === 'frame' && typeof setToc === 'function'
  useLayoutEffect(() => {
    if (!onFrame) return undefined
    setToc(tocItems.length ? <DocsToc toc={tocItems} onNavigate={jumpTo} /> : null)
    return () => setToc(null)
  }, [onFrame, setToc, body]) // eslint-disable-line react-hooks/exhaustive-deps
  const rail = toc === 'rail' || (toc === 'frame' && !onFrame)

  return (
    /* the page's inset is `.kol-page`, as site-hub's Sheet wears it — the frame paints the plane, the page its margins */
    <div className={`kol-page${rail ? ' xl:pr-32' : ''}`}>
      <article className={`kol-sheet${proj ? ' proj' : ''}`} style={{ maxWidth: 980 }}>
        <h1>{title}</h1>
        <Blocks blocks={parsed.introBlocks.filter((b) => b.type !== 'heading1')} sectionId="intro" ctx={ctx} />
        {sections.map((s, i) => (
          <section key={`${i}-${s.id}`} id={`a-${s.id}`}>
            <h2>{s.num && <span className="num">{s.num}</span>}<Marks marks={s.marks} lead /><Inline tokens={s.tokens ?? [{ type: 'text', content: s.heading }]} ctx={ctx} /><Marks marks={s.marks} /></h2>
            <Blocks blocks={s.blocks} sectionId={parsed.sections[i].id} sources={s.sources} ctx={ctx} />
          </section>
        ))}
      </article>
      {rail && tocItems.length > 1 && <DocsToc variant="rail" toc={tocItems} onNavigate={jumpTo} className="hidden xl:flex" />}
    </div>
  )
}
