/* Images in Folio's documents (user, 2026-11-04): standard Markdown `![caption](url "title")` and Obsidian embeds
   `![[name.png]]`, `![[name.png|300]]` (a width), `![[name.png|A caption]]`. An embed is looked up in the private
   bucket's index (data/records/bucket.json) by its key or its file name; every image renders as a figure with its
   caption. In dev the private files come through record's dev server (shelf.js urlOf). */
import { useEffect, useMemo, useRef, useState } from 'react'
import { client } from './client'
import { Input, MediaPlayer, ModalShell } from '@kolkrabbi/kol-component'

const IMAGE = /\.(png|jpe?g|webp|gif|svg)$/i
const BUCKET = client().read('bucket')
export const IMAGES = BUCKET.folders.flatMap((f) => f.files).filter((f) => IMAGE.test(f.key))
const byName = (name) => IMAGES.find((f) => f.key === name) ?? IMAGES.find((f) => f.name === name.split('/').pop())

/* `![[name|opt]]` → `![caption](url "w=300")`; an embed that finds no file stays as written */
export function embeds(md, urlOf) {
  return md.replace(/!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (all, name, opt) => {
    const file = byName(name.trim())
    if (!file) return all
    const width = /^\d+(x\d+)?$/.test(opt ?? '') ? opt.split('x')[0] : null
    const caption = width ? '' : (opt ?? '')
    return `![${caption}](${urlOf(file)}${width ? ` "w=${width}"` : ''})`
  })
}

/* a pasted image link (a bucket or any image URL) becomes Markdown */
export const pastedImage = (text) => (/^https?:\/\/\S+$/.test(text.trim()) && (IMAGE.test(text.trim().split('?')[0]) || BUCKETS.some((b) => b.host && text.includes(`//${b.host}/`))) ? `![](${text.trim()})` : null)

/* the image as a figure (KOL's Figure variant="folio" since Folio batch E): the caption from the alt text, a width from
   `"w=300"` */
export function figureOf({ src, alt, title }) {
  const width = /^w=(\d+)$/.exec(title ?? '')?.[1]
  return { src, alt, width, caption: alt || (width ? undefined : title) }
}

/* the editor's Image picker — the four buckets, named (user, 2026-11-04: "what bucket? I have 4"). Private comes from
   record's own index of kol-private and inserts `![[key]]` (resolved through the sign-in); the three public buckets are
   listed live from media's API and insert their full link `![](url)`, so nothing needs resolving later. */
/* the buckets and their lists come through the client (record: its four buckets and media's /api/list) */
const BUCKETS = client().read('buckets')
const SHOWN = 120
const lists = {}
const listOf = (b) => (lists[b.id] ??= client().list(b.id))

export function ImagePicker({ urlOf, onPick, onClose }) {
  const [q, setQ] = useState('')
  const [bucket, setBucket] = useState('private')
  const [files, setFiles] = useState(IMAGES)
  const [state, setState] = useState('')
  const input = useRef(null)
  /* the public lists take ~2 s each — ask for all three as the picker opens */
  useEffect(() => { input.current?.focus(); BUCKETS.filter((b) => b.id !== 'private').forEach((b) => listOf(b).catch(() => {})) }, [])
  useEffect(() => {
    if (bucket === 'private') { setFiles(IMAGES); setState(''); return }
    let live = true
    setFiles([]); setState('Loading…')
    listOf(BUCKETS.find((b) => b.id === bucket)).then((l) => { if (live) { setFiles(l); setState('') } }).catch((e) => live && setState(`Could not list it — ${e.message}`))
    return () => { live = false }
  }, [bucket])
  const list = useMemo(() => {
    const n = q.trim().toLowerCase()
    return n ? files.filter((f) => `${f.key} ${f.what ?? ''}`.toLowerCase().includes(n)) : files
  }, [q, files])
  const here = BUCKETS.find((b) => b.id === bucket)
  const src = (f) => f.url ?? urlOf(f)
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[rgb(38_41_34/0.32)] px-[16px] pt-[10vh]" onMouseDown={onClose}>
      {/* kolbox's window (plan-2026-11-23 W8.2): the bucket tabs in its header row beside the close; the find row and the grid are Folio's */}
      <ModalShell variant="kolbox" aria-label="Insert an image" width={820} onClose={onClose} onMouseDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.key === 'Escape' && onClose()} className="max-h-[75vh] max-w-full"
        leading={
          <div role="tablist" aria-label="Bucket" className="-my-2 -ml-4 mr-auto flex shrink-0 gap-[4px] px-[4px] pt-[10px]">
            {BUCKETS.map((b) => (
              <button key={b.id} type="button" role="tab" aria-selected={bucket === b.id} onClick={() => setBucket(b.id)} className={`-mb-px flex flex-col items-start gap-[2px] px-[12px] pb-[10px] pt-[4px] text-left ${bucket === b.id ? 'shadow-[inset_0_-2px_0_var(--kol-folio-ink)]' : 'text-folio-muted hover:text-folio-ink'}`}>
                <span className="kol-folio-control">{b.label}</span>
                <span className="kol-folio-meta-sm text-folio-muted">{b.note}</span>
              </button>
            ))}
          </div>
        }>
        <div className="flex h-[52px] shrink-0 items-center gap-[12px] border-y border-folio-rule px-[16px]">
          <Input variant="kolbox" size="md" ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Find an image in ${here.label}`} className="min-w-0 flex-1" />
          <span className="kol-folio-meta text-folio-muted">{state || `${list.length} images${list.length > SHOWN ? `, first ${SHOWN} shown — search to narrow` : ''}, esc`}</span>
        </div>
        <div className="grid grid-cols-4 gap-[12px] overflow-y-auto p-[16px]">
          {list.slice(0, SHOWN).map((f) => (
            <button key={f.key} type="button" onClick={() => onPick(f)} className="group flex min-w-0 flex-col gap-[6px] text-left">
              <span className="block aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-folio-rule bg-folio-surface">
                <img src={src(f)} alt="" loading="lazy" className="size-full object-cover transition-opacity group-hover:opacity-85" />
              </span>
              <span className="kol-folio-meta truncate" title={f.key}>{f.name}</span>
            </button>
          ))}
          {!state && !list.length && <p className="kol-folio-body col-span-4 py-[24px] text-folio-muted">No image matches “{q}” in {here.label}.</p>}
        </div>
      </ModalShell>
    </div>
  )
}

/* Sound and video in Folio's documents (user, 2026-11-05: "implement video/audio media player in the folio ebook reader.
   just take something from media"): a link to an audio or video file plays where it stands, in media's own player —
   kol-component `MediaPlayer`, the one Quick Look uses. The link's text stays above it as its name. */
const AUDIO = /\.(mp3|wav|m4a|flac|aac|ogg)$/i
const VIDEO = /\.(mp4|mov|webm|m4v)$/i
export const mediaKind = (href = '') => {
  const path = href.split(/[?#]/)[0]
  return AUDIO.test(path) ? 'audio' : VIDEO.test(path) ? 'video' : null
}
export function Player({ href, children }) {
  const kind = mediaKind(href)
  return (
    <span className="my-[0.5em] flex flex-col gap-[6px]">
      <span className="text-folio-muted text-[0.8em]">{children}</span>
      <MediaPlayer variant={kind} src={href} ext={href.split(/[?#]/)[0].split('.').pop()} preload={kind === 'video' ? 'metadata' : 'none'} className={kind === 'video' ? 'w-full overflow-hidden rounded-[8px]' : 'w-full'} />
    </span>
  )
}
