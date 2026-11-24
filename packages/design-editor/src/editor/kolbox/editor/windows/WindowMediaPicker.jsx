import { useEffect, useMemo, useRef, useState } from 'react'
import { CANVAS_H, CANVAS_W, formatSize, getMediaClient, findLayerDeep, proxied, useComposeState } from '../engine.js'
import Icon from '../../ui/Icon.jsx'
import { SAMPLE_LINE } from '../../app/sampleMedia.js'
import { Button, ButtonGroup, Dropdown, Input, ModalDialog, Slider, Tooltip, TreeRow } from '@kolkrabbi/kol-component'

/* The media picker (round 3, 3.1): the real MediaPickerDialog (library/MediaPickerDialog.jsx, MediaLibrary
   variant="browse") in kolbox's Modal, on the media client the screen set (the fixture library). Its parts, in its
   order: the title "Media", the bucket dropdown, Display settings and close; the crumb line ("Media", the bucket, the
   folders) with Filter, Search and the three views Columns, Rows and Grid; the listing; the count line with the row
   size; the footer: the picked key or "Select a file", Cancel and Use. A click picks a file (a folder opens), Use or
   Enter takes it, a double click takes it at once; Use is live only for a kind `accept` takes. Read-only: a picker
   picks, so no upload, verbs or trash, as the real one. Same props as the real one: onSelect(url, { contentType, kind })
   then onClose. Display settings and Filter are dimmed, each saying why: the picker has no settings drawer or filter
   wall to open (the Library has both). Search filters the bucket's keys in place (the real Search opens the library's
   own search modal, not built here). Use, dimmed, says what it waits for. */
const kindOf = (o) => (o?.contentType ?? '').split('/')[0]
const nameOf = (key) => key.replace(/\/$/, '').split('/').pop()
const VIEWS = [['columns', 'columns', 'Columns'], ['rows', 'row', 'Rows'], ['grid', 'grid', 'Grid']]
const Why = ({ label, children }) => <Tooltip variant="kolbox" label={label}>{children}</Tooltip>

/* the folders and files directly under `prefix` in a flat listing of keys */
function level(files, prefix) {
  const folders = new Set(), here = []
  for (const o of files) {
    if (!o.key.startsWith(prefix)) continue
    const rest = o.key.slice(prefix.length)
    const cut = rest.indexOf('/')
    if (cut >= 0) folders.add(prefix + rest.slice(0, cut + 1))
    else here.push(o)
  }
  return { folders: [...folders].sort(), files: here.sort((a, b) => a.key.localeCompare(b.key)) }
}

export default function WindowMediaPicker({ open, accept = ['image', 'video'], onClose, onSelect }) {
  const client = getMediaClient()
  const buckets = useMemo(() => client.buckets?.() ?? [], [client])
  const [bucket, setBucket] = useState(buckets[0]?.id)
  const [files, setFiles] = useState([])
  const [prefix, setPrefix] = useState('')
  const [file, setFile] = useState(null)
  const [view, setView] = useState('columns')
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState('')
  const [size, setSize] = useState(96)

  useEffect(() => {
    if (!open) return
    let live = true
    setPrefix(''); setFile(null); setQuery('')
    Promise.resolve(client.listMedia('', { bucket })).then((list) => live && setFiles(list ?? []))
    return () => { live = false }
  }, [open, bucket, client])

  const ok = !!file && (typeof accept === 'function' ? accept(file) : accept.includes(kindOf(file)))
  const use = (o = file) => {
    if (!o) return
    onSelect?.(client.mediaUrl(o.fullKey ?? o.key, bucket), { contentType: o.contentType, kind: kindOf(o) })
    onClose?.()
  }
  /* Enter is Use, on a usable pick, unless a text field has the key (the search), as the real one */
  const useNow = useRef(null); useNow.current = ok ? () => use() : null
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== 'Enter' || e.metaKey || e.ctrlKey || e.altKey || e.target?.closest?.('input, textarea, button, [contenteditable="true"]') || !useNow.current) return
      e.preventDefault(); e.stopPropagation()
      useNow.current()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open])

  const bucketLabel = buckets.find((b) => b.id === bucket)?.label ?? bucket
  const crumbs = prefix ? prefix.replace(/\/$/, '').split('/') : []
  const q = query.trim().toLowerCase()
  const here = q ? { folders: [], files: files.filter((o) => o.key.toLowerCase().includes(q)) } : level(files, prefix)
  const totalBytes = files.reduce((n, o) => n + (o.size ?? 0), 0)

  const thumb = (o, cls) => (kindOf(o) === 'image'
    ? <img src={client.mediaUrl(o.key, bucket)} alt="" loading="lazy" className={`object-cover ${cls}`} />
    : <span className={`flex items-center justify-center bg-field text-muted ${cls}`}><Icon name={kindOf(o) === 'video' ? 'video' : 'file'} /></span>)
  const fileRow = (o) => (
    <TreeRow variant="kolbox" key={o.key} icon={kindOf(o) === 'image' ? 'image' : kindOf(o) === 'video' ? 'video' : 'file'} label={nameOf(o.key)} active={file?.key === o.key}
      onClick={() => setFile(o)} onDoubleClick={() => (typeof accept === 'function' ? accept(o) : accept.includes(kindOf(o))) && use(o)}
      trailing={<span className="shrink-0 font-mono text-meta text-muted">{formatSize?.(o.size) ?? o.size}</span>} data-media-file={o.key} />
  )
  const folderRow = (f, selected) => (
    <TreeRow variant="kolbox" key={f} icon="folder" label={nameOf(f)} active={selected} onClick={() => { setPrefix(f); setFile(null) }}
      trailing={<Icon name="chevron-right" size={12} className="text-muted" />} data-media-folder={f} />
  )

  const listing = () => {
    if (view === 'grid') {
      return (
        <div className="grid gap-2 p-2" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))` }}>
          {here.folders.map((f) => (
            <button key={f} type="button" onClick={() => { setPrefix(f); setFile(null) }} data-media-folder={f}
              className="flex flex-col gap-1 rounded-control p-1 text-left outline-none hover:bg-field focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent">
              <span className="flex aspect-square w-full items-center justify-center rounded-control bg-field text-muted"><Icon name="folder" /></span>
              <span className="truncate text-label text-text">{nameOf(f)}</span>
            </button>
          ))}
          {here.files.map((o) => (
            <button key={o.key} type="button" onClick={() => setFile(o)} onDoubleClick={() => (typeof accept === 'function' ? accept(o) : accept.includes(kindOf(o))) && use(o)} data-media-file={o.key}
              className={`flex flex-col gap-1 rounded-control p-1 text-left outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent ${file?.key === o.key ? 'bg-accent-tint' : 'hover:bg-field'}`}>
              {thumb(o, 'aspect-square w-full rounded-control')}
              <span className={`truncate text-label ${file?.key === o.key ? 'text-accent' : 'text-text'}`}>{nameOf(o.key)}</span>
            </button>
          ))}
        </div>
      )
    }
    if (view === 'rows') return <div className="flex flex-col gap-1 p-2">{here.folders.map((f) => folderRow(f, false))}{here.files.map(fileRow)}</div>
    /* columns: one per level from the bucket's root to the open folder, then the pick's preview */
    const levels = q ? [{ p: '', ...here }] : ['', ...crumbs.map((_, i) => `${crumbs.slice(0, i + 1).join('/')}/`)].map((p) => ({ p, ...level(files, p) }))
    return (
      <div className="flex h-full">
        {levels.map(({ p, folders, files: fs }) => (
          <div key={p} className="flex w-56 shrink-0 flex-col gap-1 overflow-y-auto p-2" data-media-column={p}>
            {folders.map((f) => folderRow(f, prefix.startsWith(f)))}
            {fs.map(fileRow)}
          </div>
        ))}
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2 p-4" data-media-preview>
          {file && thumb(file, 'max-h-64 w-full rounded-well object-contain')}
          {file && <span className="font-mono text-meta text-muted">{formatSize?.(file.size) ?? file.size}</span>}
        </div>
      </div>
    )
  }

  return (
    <ModalDialog variant="kolbox"
      open={open}
      onClose={onClose}
      title="Media"
      width="var(--spacing-modal-wide)"
      className="h-modal-generator-height"
      actions={(
        <>
          <Dropdown variant="kolbox" ariaLabel="Bucket" value={bucket} options={buckets.map((b) => ({ value: b.id, label: b.label ?? b.id }))} onChange={setBucket} className="w-44" />
          <Why label="Display settings are in the Library"><Button variant="kolbox" iconOnly="gear" aria-label="Display settings" disabled/></Why>
        </>
      )}
      footer={(
        <>
          <span className="mr-auto min-w-0 truncate font-mono text-meta text-muted" data-media-picked>{file ? file.key : 'Select a file'}</span>
          <Button variant="kolbox" tone="ghost" onClick={onClose}>Cancel</Button>
          {ok ? <Button variant="kolbox" tone="primary" onClick={() => use()} data-media-use>Use</Button> : (
            <Why label={file ? 'This file is not a kind this place takes' : 'Select a file first'}><Button variant="kolbox" tone="primary" disabled data-media-use>Use</Button></Why>
          )}
        </>
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2 px-4 pb-4" data-window="media-picker">
        {client.sample && <p className="shrink-0 text-help text-muted" data-media-sample>{SAMPLE_LINE}</p>}
        <div className="flex h-control shrink-0 items-center gap-2">
          <nav className="flex min-w-0 flex-1 items-center gap-1 truncate text-label" data-media-crumbs>
            {[['Media', null], [bucketLabel, ''], ...crumbs.map((c, i) => [c, `${crumbs.slice(0, i + 1).join('/')}/`])].map(([c, p], i, all) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-muted">/</span>}
                {p === null ? <span className="truncate text-muted">{c}</span> : (
                  <button type="button" onClick={() => { setPrefix(p); setFile(null) }}
                    className={`truncate outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent ${i === all.length - 1 ? 'text-text' : 'text-muted hover:text-text'}`}>{c}</button>
                )}
              </span>
            ))}
          </nav>
          {searching && <Input variant="kolbox" size="md" iconLeft="search" placeholder="Search this bucket" aria-label="Search this bucket" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus className="w-56"/>}
          <Why label="Filters are in the Library; Search finds by name here"><Button variant="kolbox" iconOnly="filter" aria-label="Filter" disabled/></Why>
          <Button variant="kolbox" iconOnly="search" aria-label="Search" pressed={searching} onClick={() => { setSearching((s) => !s); setQuery('') }}/>
          <ButtonGroup layout="joined" variant="kolbox" options={VIEWS.map(([v, icon, label]) => ({ icon, ariaLabel: label, pressed: view === v, onPress: () => setView(v) }))}/>
        </div>
        <div className="min-h-0 flex-1 overflow-auto rounded-well bg-ground" data-media-listing={view}>{listing()}</div>
        <div className="flex h-control shrink-0 items-center gap-2">
          <span className="min-w-0 flex-1 truncate font-mono text-meta text-muted" data-media-count>
            {`${here.folders.length} ${here.folders.length === 1 ? 'folder' : 'folders'}, ${here.files.length} ${here.files.length === 1 ? 'file' : 'files'}, ${formatSize?.(totalBytes) ?? totalBytes}`}
          </span>
          <Slider variant="kolbox" aria-label="Row size" value={size} min={48} max={192} step={8} onChange={setSize} formatValue={(v) => `${v}`} className="w-40" />
        </div>
      </div>
    </ModalDialog>
  )
}

/* `await pickMedia({ accept, layerId })` opens the picker from anywhere on the screen and puts the pick where the real
   doors put it: with `layerId`, that photo layer's source (the real PhotoFileTab and photo inspector: src through the
   proxy, srcType image or video); without, a new photo layer contained to 720 and centred, as the real Insert image
   makes one. Resolves the pick ({ url, contentType, kind }) or null on cancel. The host is mounted with the screen's
   windows (editor/Windows.jsx), inside the engine's providers. */
let host = null
export const pickMedia = (ask = {}) => new Promise((resolve) => (host ? host({ ...ask, resolve }) : resolve(null)))

export function WindowMediaPickerHost() {
  const { addLayer, updateLayer, beginTransaction, commitTransaction, layers } = useComposeState()
  const [ask, setAsk] = useState(null)
  const live = useRef(null)
  useEffect(() => {
    const show = (next) => { live.current?.resolve(null); live.current = next; setAsk(next) }
    host = show
    return () => { if (host === show) host = null }
  }, [])
  const done = (pick) => { const a = live.current; live.current = null; setAsk(null); a?.resolve(pick) }
  const place = (url, { contentType, kind } = {}) => {
    const a = live.current
    const src = proxied(url)
    const srcType = kind === 'video' ? 'video' : 'image'
    /* `place: false`: the caller puts the pick itself (Labs' one layer, round 4, 7.3) */
    if (a?.place === false) { done({ url, contentType, kind }); return }
    if (a?.layerId && a.fill) {
      /* `fill`: the pick is that layer's image fill (W22: photo is a fill); a solid or no fill becomes the image */
      const prev = findLayerDeep(layers, a.layerId)?.fill
      const base = prev?.type === 'image' || prev?.type === 'video' ? prev : { type: 'image', fit: 'cover' }
      beginTransaction(); updateLayer(a.layerId, { fill: { ...base, src, srcType, type: 'image' } }); commitTransaction()
    } else if (a?.layerId) {
      beginTransaction(); updateLayer(a.layerId, { src, srcType }); commitTransaction()
    } else {
      const img = new Image()
      img.onload = () => {
        if (!img.naturalWidth || !img.naturalHeight) return
        const k = Math.min(1, 720 / img.naturalWidth, 720 / img.naturalHeight)
        const w = Math.round(img.naturalWidth * k), h = Math.round(img.naturalHeight * k)
        addLayer('photo', { src, srcType, x: Math.round((CANVAS_W - w) / 2), y: Math.round((CANVAS_H - h) / 2), w, h, fit: 'cover' })
      }
      img.src = src
    }
    done({ url, contentType, kind })
  }
  return <WindowMediaPicker open={!!ask} accept={ask?.accept} onClose={() => live.current && done(null)} onSelect={place} />
}
