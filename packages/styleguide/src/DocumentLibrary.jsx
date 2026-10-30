import { useState } from 'react'
import { Button, FileQuickLook, SOLO, Table, Tag } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { MarkdownPage, PageSection, libraryLinks } from '@kolkrabbi/kol-framework'
import DocumentIndex from './DocumentIndex.jsx'

/* DOCUMENT LIBRARY — a `documentLibrary` (kol-framework) drawn: a sortable table per folder, the title opening the text,
 * the originals opening in the DS Quick Look, the markdown downloading (DocumentLibraryAndBoardParts, kol-website
 * 2026-10-29 — record's DocumentsIndex · FolderTable · Files · MdDownload, made the DS's so brand and record draw their
 * documents the same way: *"I already asked for tables, and download and file preview"*).
 *
 *   <DocumentLibrary library={lib} onNavigate={navigate} urlOf={(f) => f.url} />          every folder, a section each
 *   <DocumentLibrary library={lib} folder="press" … />                                   one folder
 *   <DocumentView library={lib} row={row} urlOf={…} resolveLink={…} assetUrl={…} />     the open document
 *
 * DocumentLibrary
 *   library    `{ rows, folders }` from documentLibrary
 *   folder     one folder's id; omitted, every folder
 *   columns    the table's columns — an array of keys (`title · kind · date · lang · assets · markdown`) and/or Table column
 *              objects, or `(defaults) => columns` to drop, reorder or add
 *   view       `table` (default) · `cards` (DocumentIndex's contents cards, for anyone who still wants them)
 *   onNavigate (to) => void — a title's click; the link is a real `href` too
 *   urlOf      (file) => string — an original's URL (default `file.url`; record serves the bucket in prod and a mirror in dev)
 *
 *   assetsView `label` (default) · `icon` · `icon-label` — the Assets cell (below)
 *   langView   `text` (default) · `chips` (a `Tag` per language) · `icon` (the globe and the codes)
 *   fileIcon   (file) => an icon name or a node — the glyph for an original in `icon` / `icon-label` (default `kindIcon`)
 *
 * DocumentFiles — the Assets cell on its own: a button per original, labelled by extension, two of one kind told apart by
 * language (`PDF IS`, `PDF EN`); each opens Quick Look over the row's files. `DocumentMarkdown` — the source as `<stem>.md`.
 *
 * ICONS AND CHIPS ARE PROPS (OverviewTocAndLibraryIcons, kol-website 2026-10-29 — user: *"file type and language, can
 * use icons? the table is deadboring like this"* · *"props are good. we use variants and presets to define how things
 * ship, but props make things flexible"*). `assetsView="icon"` draws kol-icons' file-type glyph per original, its
 * extension and language in the tooltip and the aria-label; two of one kind carry the language as a subscript on the
 * glyph. `icon-label` is the glyph beside today's label. The defaults are the cells as they were. */
const LANGS = ['is', 'en', 'de']
const ext = (f) => (f.key ?? f.name ?? '').split('.').pop().toUpperCase()
export const fileLabel = (files, f) => (files.filter((x) => ext(x) === ext(f)).length > 1
  ? `${ext(f)} ${(f.key ?? f.name).split('/').pop().split(/[-.]/).filter((t) => LANGS.includes(t)).join(' ').toUpperCase()}`.trim()
  : ext(f))
const langOf = (f) => (f.key ?? f.name ?? '').split('/').pop().split(/[-.]/).filter((t) => LANGS.includes(t)).join(' ').toUpperCase()
const fullLabel = (f) => `${ext(f)} ${langOf(f)}`.trim()
/* the default glyph map, by extension — kol-icons' file family (0.53.0); anything else is `file` */
const KINDS = {
  'file-pdf': ['pdf'], 'file-doc': ['doc', 'docx', 'odt', 'rtf', 'pages'], 'file-image': ['jpg', 'jpeg', 'png', 'webp', 'heic', 'gif', 'avif', 'tif', 'tiff'],
  'file-svg': ['svg'], 'file-video': ['mp4', 'mov', 'webm', 'm4v'], 'file-audio': ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'],
  'file-zip': ['zip'], 'file-md': ['md', 'markdown'], 'file-text': ['txt'],
}
const BY_EXT = Object.fromEntries(Object.entries(KINDS).flatMap(([name, exts]) => exts.map((e) => [e, name])))
export const kindIcon = (f) => BY_EXT[ext(f).toLowerCase()] ?? 'file'
const plain = (e) => !(e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0)

/* the one Quick Look a page holds: `open(files, index)` and the overlay to render */
export function useFileQuickLook(urlOf) {
  const [look, setLook] = useState(null)
  const overlay = look && <FileQuickLook files={look.files} index={look.index} onIndex={(index) => setLook({ ...look, index })} onClose={() => setLook(null)} urlOf={urlOf} />
  return [(files, index) => setLook({ files, index }), overlay]
}

/* a glyph with the language under its corner — two of one kind told apart */
const Subscripted = ({ glyph, sub }) => (
  <span className="relative inline-flex">
    {glyph}
    <span aria-hidden className="kol-mono-8 absolute -bottom-1 -right-2 leading-none">{sub}</span>
  </span>
)

export function DocumentFiles({ row, onOpen, assetsView = 'label', fileIcon = kindIcon }) {
  if (!row.files?.length) return null
  return (
    <div className="flex flex-wrap gap-1">
      {row.files.map((f, i) => {
        const name = f.name ?? f.key.split('/').pop()
        const open = () => onOpen(row.files, i)
        if (assetsView === 'label') return <Button key={f.key} variant="nav" size="sm" onClick={open} title={name}>{fileLabel(row.files, f)}</Button>
        const icon = fileIcon(f)
        const glyph = typeof icon === 'string' ? <Icon name={icon} size={SOLO.sm} /> : icon
        if (assetsView === 'icon-label') return <Button key={f.key} variant="nav" size="sm" onClick={open} title={name} iconLeft={typeof icon === 'string' ? icon : 'file'} iconComponent={typeof icon === 'string' ? undefined : icon}>{fileLabel(row.files, f)}</Button>
        const twin = fileLabel(row.files, f) !== ext(f)
        return (
          <Button key={f.key} variant="nav" size="sm" onClick={open} title={`${fullLabel(f)}, ${name}`} aria-label={fullLabel(f)}
            iconOnly={typeof icon === 'string' ? icon : 'file'} iconComponent={twin ? <Subscripted glyph={glyph} sub={langOf(f)} /> : (typeof icon === 'string' ? undefined : icon)} />
        )
      })}
    </div>
  )
}

/* the Language cell: today's text, a `Tag` per language, or the globe and the codes */
function DocumentLangs({ lang, langView = 'text' }) {
  if (!lang || langView === 'text') return lang ?? null
  const codes = String(lang).split(/[,\s]+/).filter(Boolean)
  if (langView === 'chips') return <span className="inline-flex flex-wrap gap-1">{codes.map((c) => <Tag key={c} variant="tertiary" size="xs" hash={false}>{c}</Tag>)}</span>
  return <span className="inline-flex items-center gap-1" aria-label={`Language: ${codes.join(', ')}`}><Icon name="globe" size={14} />{codes.join(' ')}</span>
}

export const DocumentMarkdown = ({ row }) => (
  <Button variant="nav" size="sm" iconOnly="download" href={`data:text/markdown;charset=utf-8,${encodeURIComponent(row.source ?? '')}`} download={`${row.id.split('/').pop()}.md`} aria-label="Download markdown" />
)

const DEFAULT_KEYS = ['title', 'kind', 'date', 'lang', 'assets', 'markdown']

function columnsFor({ onNavigate, onOpen, assetsView, langView, fileIcon }) {
  return {
    title: { header: 'Title', accessor: 'title', wrap: true, sortable: true, render: (r) => (
      <a href={r.to} className="underline-offset-2 hover:underline" onClick={onNavigate ? (e) => { if (!plain(e)) return; e.preventDefault(); onNavigate(r.to) } : undefined}>{r.title}</a>
    ) },
    kind: { header: 'Kind', accessor: 'kind', sortable: true },
    date: { header: 'Date', accessor: 'date', sortable: true },
    lang: { header: 'Language', accessor: 'lang', ...(langView !== 'text' && { render: (r) => <DocumentLangs lang={r.lang} langView={langView} /> }) },
    assets: { header: 'Assets', accessor: 'files', render: (r) => <DocumentFiles row={r} onOpen={onOpen} assetsView={assetsView} fileIcon={fileIcon} /> },
    markdown: { header: 'Markdown', accessor: 'source', render: (r) => <DocumentMarkdown row={r} /> },
  }
}

export default function DocumentLibrary({ library, folder, columns, view = 'table', onNavigate, urlOf = (f) => f.url, assetsView = 'label', langView = 'text', fileIcon }) {
  const [open, overlay] = useFileQuickLook(urlOf)
  const named = columnsFor({ onNavigate, onOpen: open, assetsView, langView, fileIcon })
  const defaults = DEFAULT_KEYS.map((k) => named[k])
  const resolve = (c) => (typeof c === 'string' ? named[c] : c)
  const cols = (typeof columns === 'function' ? columns(defaults) : columns ?? DEFAULT_KEYS).map(resolve).filter(Boolean)
  const folders = folder != null ? library.folders.filter((f) => f.id === folder) : library.folders

  if (view === 'cards') {
    /* the contents cards: pages as cards in their folder's part, the originals as file cards (DocumentIndex opens them) */
    const rows = folders.flatMap((f) => library.rows.filter((r) => r.folder === f.id).flatMap((r) => [
      { id: r.id, to: r.to, title: r.title, label: r.kind || undefined, part: f.label },
      ...(r.files ?? []).map((x) => ({ id: `${r.id}:${x.key}`, file: urlOf(x), title: x.name ?? x.key.split('/').pop(), part: f.label })),
    ]))
    return <DocumentIndex rows={rows} onNavigate={onNavigate} />
  }
  return (
    <div>
      {folders.map((f) => (
        <PageSection key={f.id || 'root'} id={f.id || 'documents'} label={f.label}>
          <Table columns={cols} rows={library.rows.filter((r) => r.folder === f.id)} width="column" variant="simple" />
        </PageSection>
      ))}
      {overlay}
    </div>
  )
}

/* THE OPEN DOCUMENT: the same Assets and Markdown buttons above `MarkdownPage`, then `actions` — record's DocumentsPage.
 * `assetsView` and `fileIcon` as the library's.
 * Every other prop goes to MarkdownPage (`resolveLink`, `assetUrl`, `toc`, `numbered`, …); `resolveLink` defaults to the
 * library's own (`libraryLinks`, kol-framework) when the caller passes `library` and no resolver. */
export function DocumentView({ row, library, urlOf = (f) => f.url, actions, markdown = true, assetsView = 'label', fileIcon, ...page }) {
  const [open, overlay] = useFileQuickLook(urlOf)
  if (library && !page.resolveLink) page.resolveLink = libraryLinks(library)
  return (
    <>
      <div className="kol-page flex items-center justify-end gap-1 pb-0">
        <DocumentFiles row={row} onOpen={open} assetsView={assetsView} fileIcon={fileIcon} />
        {markdown && <DocumentMarkdown row={row} />}
        {actions}
      </div>
      <MarkdownPage key={row.id} source={row.source} {...page} />
      {overlay}
    </>
  )
}
