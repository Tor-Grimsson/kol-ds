import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Dropdown, Input, Textarea } from '@kolkrabbi/kol-component'
import { flow, frontmatter, paginateInDocument, printHtml, footLine, toDocxBlob, toMarkdown } from '@kolkrabbi/kol-print'

/**
 * PrintStudio — markdown to print, in the page: pick a layout, write or paste the document, see the A4 sheets, and take it
 * away as PDF, DOCX or MD (PdfToolsFromStudio, 2026-10-28 — user: *"we have a bunch of stationery, we would like to connect
 * those together with the package"*). A tool: drop it into an app's Hub page or a site's page.
 *
 * The engine is `@kolkrabbi/kol-print` — the same flow and pagination the `kol-print` CLI runs in headless Chrome, here run
 * in this browser, so a sheet on screen is the sheet the CLI prints. PDF is the browser's own print of the sheets (a hidden
 * frame, A4, no margins); DOCX is built in the page (`docx`); MD is the source under the export frontmatter.
 *
 * Two kinds of layout share the picker: **Document** (kol-print's: the studio's header, the parties block, numbered
 * sections, kv tables, footnotes, the ✋ 🅿️ 📍 marks — paginated from the markdown) and the app's **templates** — finished
 * A4 boards (the stationery: letters, invoices, agreements), shown and printed as they are.
 *
 * @param {Object}   studio         `{ studio, designer, address, contacts }` — the sheet's header and the parties block (the
 *                                  caller's: the package ships no studio's details)
 * @param {string}   logoSvg        the header's logo markup (the sheets)
 * @param {string}   logoPngUrl     the header's logo as a PNG url (the DOCX)
 * @param {Object}   meta           the project — `{ project, slug, client, contact?, site?, dates }`, editable on the page
 * @param {string}   markdown       the starting document (kol-docs markdown, frontmatter `title`)
 * @param {Array}    templates      `[{ id, label, sheets: [html] }]` — finished A4 boards (1190 × 1684), printed as they are
 */
const ZOOM = 0.42 // a 1190px sheet at ~500px on screen
/* a template sheet may be a whole HTML document (the stationery boards are): its styles and body, without the document */
const sheetBody = (h) => {
  if (!/<body[\s>]/i.test(h)) return h
  const styles = (h.match(/<style[\s\S]*?<\/style>/gi) ?? []).join('')
  const body = (h.match(/<body[^>]*>([\s\S]*)<\/body>/i) ?? [, h])[1]
  return styles + body
}
const download = (blob, name) => {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob); a.download = name
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export default function PrintStudio({ studio = {}, logoSvg = '', logoPngUrl, meta: metaProp = {}, markdown: mdProp = '', templates = [], className = '' }) {
  const [layout, setLayout] = useState('document')
  const [md, setMd] = useState(mdProp)
  const [meta, setMeta] = useState({ project: '', slug: 'doc', client: '', dates: '', ...metaProp })
  const [pages, setPages] = useState([])
  const frameRef = useRef(null)
  const template = templates.find((t) => t.id === layout)

  /* the document: flow → pages, cut in this browser by the CLI's own script */
  const { doc } = useMemo(() => (md.trim() ? flow(md, meta, studio) : { doc: '', html: '' }), [md, meta, studio])
  useEffect(() => {
    if (template || !md.trim()) { setPages([]); return }
    const { html } = flow(md, meta, studio)
    setPages(paginateInDocument(html))
  }, [md, meta, studio, template])

  const foot = footLine(studio, meta, doc)
  const printable = template
    ? `<!doctype html><meta charset="utf-8"><title>${template.label}</title><style>@page{size:A4;margin:0}html{zoom:0.6665}body{margin:0}.sheet{width:1190px;height:1684px;overflow:hidden;break-after:page}</style>${template.sheets.map((h) => `<section class="sheet">${sheetBody(h)}</section>`).join('')}`
    : printHtml(pages, { title: doc, studio, logoSvg, foot })
  /* on screen: the same document at a reading zoom, the sheets on a grey desk */
  const preview = printable.replace('html{zoom:0.6665}body{margin:0}', `html{zoom:${ZOOM}}body{margin:0;padding:24px 0;background:#d4d4d8}.sheet{margin:0 auto 24px;box-shadow:0 4px 24px rgba(0,0,0,.25)}`)
  const sheetCount = template ? template.sheets.length : pages.length

  const printPdf = () => {
    const f = frameRef.current
    f.srcdoc = printable
    f.onload = () => { f.contentWindow.focus(); f.contentWindow.print() }
  }
  const saveDocx = async () => {
    const logoPng = logoPngUrl ? new Uint8Array(await (await fetch(logoPngUrl)).arrayBuffer()) : undefined
    download(await toDocxBlob(pages, { foot, title: `${doc} ${meta.project}`, studio, logoPng }), `${meta.slug}-${(frontmatter(md).fm.title || 'document').toLowerCase().replace(/[^\w]+/g, '-')}.docx`)
  }
  const saveMd = () => download(new Blob([toMarkdown(md, { meta, studio, doc })], { type: 'text/markdown' }), `${meta.slug}-${(doc || 'document').toLowerCase().replace(/[^\w]+/g, '-')}.md`)
  const field = (k, label) => (
    <label className="flex flex-col gap-1">
      <span className="kol-mono-10 text-meta uppercase">{label}</span>
      <Input size="sm" value={meta[k] ?? ''} onChange={(e) => setMeta((m) => ({ ...m, [k]: e.target.value }))} aria-label={label} />
    </label>
  )

  return (
    <div className={`flex h-full min-h-0 flex-col md:flex-row ${className}`.trim()} data-print-studio>
      <aside className="flex flex-col gap-4 p-4 md:w-[380px] md:shrink-0 md:overflow-y-auto">
        <label className="flex flex-col gap-1">
          <span className="kol-mono-10 text-meta uppercase">Layout</span>
          <Dropdown size="sm" value={layout} onChange={setLayout} ariaLabel="Layout"
            options={[{ value: 'document', label: 'Document' }, ...templates.map((t) => ({ value: t.id, label: t.label }))]} />
        </label>
        {!template && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {field('project', 'Project')}
              {field('client', 'Client')}
              {field('dates', 'Dates')}
              {field('slug', 'File slug')}
            </div>
            <label className="flex flex-col gap-1">
              <span className="kol-mono-10 text-meta uppercase">Markdown</span>
              <Textarea rows={16} value={md} onChange={(e) => setMd(e.target.value)} aria-label="Markdown" className="kol-mono-12" />
            </label>
          </>
        )}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" tone="inverted" onClick={printPdf} disabled={!sheetCount}>PDF</Button>
          <Button size="sm" onClick={saveDocx} disabled={!!template || !pages.length}>DOCX</Button>
          <Button size="sm" onClick={saveMd} disabled={!!template || !md.trim()}>MD</Button>
        </div>
        <span className="kol-mono-10 text-meta">{sheetCount} {sheetCount === 1 ? 'sheet' : 'sheets'} · A4</span>
      </aside>
      <iframe title="Sheets" className="min-h-[60vh] flex-1 border-0" srcDoc={preview} data-print-preview />
      <iframe ref={frameRef} title="Print" aria-hidden="true" tabIndex={-1} className="fixed h-0 w-0 border-0 opacity-0 pointer-events-none" />
    </div>
  )
}
