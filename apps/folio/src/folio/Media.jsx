/* Images in Folio's documents (user, 2026-11-04): standard Markdown `![caption](url "title")` and Obsidian embeds
   `![[name.png]]`, `![[name.png|300]]` (a width), `![[name.png|A caption]]`. An embed is looked up in the private
   bucket's index (data/records/bucket.json) by its key or its file name; every image renders as a figure with its
   caption. In dev the private files come through record's dev server (shelf.js urlOf). */
import { useEffect, useMemo, useRef, useState } from 'react'
import { client } from './client'
import { MediaPlayer } from '@kolkrabbi/kol-component'

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

/* the image as a figure: the caption from the alt text, a width from `"w=300"` */
export function Figure({ src, alt, title }) {
  const width = /^w=(\d+)$/.exec(title ?? '')?.[1]
  return (
    /* spans, not <figure>: an image that shares a line with text sits inside a <p>, where a figure is not allowed */
    <span data-wide role="figure" aria-label={alt || title || undefined} className="flex flex-col items-start gap-[10px]">
      <img src={src} alt={alt ?? ''} loading="lazy" className="max-w-full rounded-[2px] border border-folio-rule" style={width ? { width: `${width}px` } : undefined} />
      {(alt || (title && !width)) && <span className="kol-reader-meta block text-folio-muted">{alt || title}</span>}
    </span>
  )
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
      <div role="dialog" aria-label="Insert an image" onMouseDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.key === 'Escape' && onClose()} className="flex max-h-[75vh] w-full max-w-[820px] flex-col overflow-hidden rounded-[3px] border border-folio-rule bg-folio-paper shadow-[0_24px_64px_rgb(0_0_0/0.18)]">
        <div role="tablist" aria-label="Bucket" className="flex shrink-0 gap-[4px] border-b border-folio-rule px-[12px] pt-[10px]">
          {BUCKETS.map((b) => (
            <button key={b.id} type="button" role="tab" aria-selected={bucket === b.id} onClick={() => setBucket(b.id)} className={`-mb-px flex flex-col items-start gap-[2px] px-[12px] pb-[10px] pt-[4px] text-left ${bucket === b.id ? 'shadow-[inset_0_-2px_0_var(--color-folio-ink)]' : 'text-folio-muted hover:text-folio-ink'}`}>
              <span className="kol-reader-control">{b.label}</span>
              <span className="kol-reader-meta-sm text-folio-muted">{b.note}</span>
            </button>
          ))}
        </div>
        <div className="flex h-[52px] shrink-0 items-center gap-[12px] border-b border-folio-rule px-[16px]">
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Find an image in ${here.label}`} className="kol-reader-nav min-w-0 flex-1 bg-transparent font-normal outline-none placeholder:text-folio-muted" />
          <span className="kol-reader-meta text-folio-muted">{state || `${list.length} images${list.length > SHOWN ? `, first ${SHOWN} shown — search to narrow` : ''}, esc`}</span>
        </div>
        <div className="grid grid-cols-4 gap-[12px] overflow-y-auto p-[16px]">
          {list.slice(0, SHOWN).map((f) => (
            <button key={f.key} type="button" onClick={() => onPick(f)} className="group flex min-w-0 flex-col gap-[6px] text-left">
              <span className="block aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-folio-rule bg-folio-surface">
                <img src={src(f)} alt="" loading="lazy" className="size-full object-cover transition-opacity group-hover:opacity-85" />
              </span>
              <span className="kol-reader-meta truncate" title={f.key}>{f.name}</span>
            </button>
          ))}
          {!state && !list.length && <p className="kol-reader-body col-span-4 py-[24px] text-folio-muted">No image matches “{q}” in {here.label}.</p>}
        </div>
      </div>
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
