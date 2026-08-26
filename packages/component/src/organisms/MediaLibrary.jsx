import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import Button from '../atoms/Button.jsx'
import SegmentedToggle from '../atoms/SegmentedToggle.jsx'
import FullscreenOverlay from '../utilities/FullscreenOverlay.jsx'
import MediaCard from '../molecules/MediaCard.jsx'
import MediaRow from '../molecules/MediaRow.jsx'
import ContentFilters from './ContentFilters.jsx'
import MediaViewer from './MediaViewer.jsx'

/**
 * MediaLibrary — a browser over an object bucket, in two views over one
 * headless core. Consolidates four consumer forks (kol-ds-fxr, kol-labs-single,
 * kol-client-kolkrabbi, kol-website/brand — 9 files, ~1542 lines) that had
 * already diverged: only fxr carried the canvas-taint fix, only labs carried
 * the write paths, and neither page view ever learned folders.
 *
 * THE CLIENT IS INJECTED, NEVER IMPORTED. ARCHITECTURE §3 keeps the clients
 * tier free of UI dependencies in both directions, so this package does not
 * import `@kolkrabbi/kol-media-client` — the consumer passes an instance in.
 * Same contract as kol-dashboards / kol-chess / kol-content.
 *
 * COMPOSED, NOT BUILT. Every part is an existing DS member:
 *   ContentFilters — filter groups, animated search, view toggle, N-of-M count
 *   MediaCard      — the grid tile (thumb · download chip · name · meta · actions)
 *   MediaRow       — the list row (thumb · name · date · size · actions)
 *   MediaViewer    — the lightbox, via its `actions` slot
 *   FullscreenOverlay — the picker's scrim, dismissal and close button
 * The first pass hand-rolled a tile grid and a folder row while MediaCard and
 * MediaRow — built from this same source in the 2026-07-03 sweep — sat unused.
 *
 * NAVIGATION IS FINDER'S LIST MODEL, not click-to-enter. Folders are rows in
 * the same list with a disclosure chevron and expand IN PLACE, so the parent
 * never leaves the screen and there is no breadcrumb stacked above a divider.
 * The path bar sits at the FOOT, where Finder puts it.
 *
 * Read-only by design. Upload / rename / delete stay in kol-media-admin —
 * write auth does not belong in a browser-shipped package.
 */

const MediaLibraryContext = createContext(null)

const isImage = (ct) => !!ct && ct.startsWith('image/')
const isVideo = (ct) => !!ct && ct.startsWith('video/')

/* Bytes → a human-readable weight. Duplicated from the client on purpose:
 * importing it would create the very UI→clients edge §3 forbids, and it is
 * four lines of arithmetic with no contract behind it. */
function formatSize(bytes) {
  if (bytes == null) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

const fileName = (key) => key.slice(key.lastIndexOf('/') + 1)
const folderOf = (key) => key.slice(0, key.lastIndexOf('/') + 1)

/* A video with neither poster nor sibling still paints an empty box until
 * played — a time fragment makes the browser seek and paint frame one. Only
 * the fallback now: `pairPosters` finds a real poster where one exists. */
const posterSrc = (url) => `${url}#t=0.1`

/* ── Kind, and the four rules a real bucket forces ─────────────────────────
 * Every rule below exists because the unfiltered list was unusable over the
 * live 3443-object bucket, not because it read tidier. Measurements from
 * lobby/media-library-non-av-blindness (kol-r2b2, 2026-08-15), which tested
 * each one against that data. */

/* B2 and R2 hand back `application/octet-stream` for .json, .pgn, .m3u8 and
 * .woff2, so contentType cannot be the primary signal — extension wins, the
 * header is the fallback. `.ts` is an HLS segment here, never TypeScript: this
 * reads object buckets, not source trees. */
const EXT_KIND = {
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image',
  avif: 'image', svg: 'image', bmp: 'image', ico: 'image', tif: 'image',
  tiff: 'image', heic: 'image',
  mp4: 'video', mov: 'video', webm: 'video', m4v: 'video', avi: 'video',
  mkv: 'video', ts: 'video',
  mp3: 'audio', wav: 'audio', ogg: 'audio', flac: 'audio', aac: 'audio',
  m4a: 'audio', aiff: 'audio',
  m3u8: 'playlist',
  json: 'text', yaml: 'text', yml: 'text', csv: 'text', txt: 'text',
  md: 'text', pgn: 'text', xml: 'text', srt: 'text', vtt: 'text',
  js: 'code', mjs: 'code', cjs: 'code', jsx: 'code', tsx: 'code',
  css: 'code', html: 'code', py: 'code', sh: 'code',
  woff: 'font', woff2: 'font', ttf: 'font', otf: 'font', eot: 'font',
  zip: 'archive', tar: 'archive', gz: 'archive', rar: 'archive', '7z': 'archive',
  pdf: 'text',
}

/* One per folder, in the way of everything — hidden, never silently dropped:
 * the count is reported at the foot. */
const SYSTEM_NAMES = new Set(['.DS_Store', '.bzEmpty', 'Thumbs.db', 'desktop.ini', '.gitkeep'])

const extOf = (key) => {
  const base = fileName(key)
  const dot = base.lastIndexOf('.')
  return dot > 0 ? base.slice(dot + 1).toLowerCase() : ''
}

function kindOf(o) {
  if (SYSTEM_NAMES.has(fileName(o.key))) return 'system'
  const byExt = EXT_KIND[extOf(o.key)]
  if (byExt) return byExt
  if (isImage(o.contentType)) return 'image'
  if (isVideo(o.contentType)) return 'video'
  if (o.contentType?.startsWith('audio/')) return 'audio'
  if (o.contentType?.startsWith('text/')) return 'text'
  return 'other'
}

/* `accept` WIDENS, it never gates. 'all' — the default, and what every browse
 * consumer passes — means EVERYTHING. It used to mean "image or video", which
 * discarded 332 objects of the reference bucket before anything downstream
 * could see them; a brand book embedding this saw a library quietly missing
 * every stream it held. A picker asks for what it can pick: `['image','video']`. */
function acceptsKind(accept) {
  if (!accept || accept === 'all') return () => true
  const wanted = new Set(Array.isArray(accept) ? accept : [accept])
  return (o) => wanted.has(o.kind)
}

/* 2012 `segment_NNN.ts` files are ONE stream. Counted raw they took the
 * bucket's video tally to 2051 instead of 39, and filled the grid with 2.7 GB
 * of unopenable fragments. Fold per folder onto the first segment — a real key,
 * so the row still resolves and still sits in its own folder. */
const SEGMENT = /segment[_-]?\d+\.ts$/i

function foldHlsSegments(list) {
  const streams = new Map()
  const rest = []
  for (const o of list) {
    if (!SEGMENT.test(fileName(o.key))) { rest.push(o); continue }
    const dir = folderOf(o.key)
    const seen = streams.get(dir)
    if (seen) { seen.count += 1; seen.size += o.size ?? 0 }
    else streams.set(dir, { first: o, count: 1, size: o.size ?? 0 })
  }
  for (const [dir, s] of streams) {
    rest.push({
      ...s.first,
      displayName: `${fileName(dir.slice(0, -1))} · ${s.count} segments`,
      size: s.size,
      segments: s.count,
    })
  }
  return rest
}

/* Art prints ship as one picture in four widths (`name-566.jpg` … `-2840.jpg`).
 * Left alone that is 604 rows for 197 pictures, and the grid pulls the 2840px
 * file to paint a 200px tile — 718 KB where 27 KB does. Collapse each set to
 * one row: `key` (what the thumb loads) is the SMALLEST, `fullKey` (what
 * download hands over) the largest. Guards: images only, width ≥ 100 so
 * `2017-03.json` is not read as a variant, and sets of ≥2 only. */
const VARIANT = /^(.+)-(\d{2,5})$/

function foldResolutionSets(list) {
  const sets = new Map()
  const rest = []

  for (const o of list) {
    const base = fileName(o.key)
    const dot = base.lastIndexOf('.')
    const stem = dot > 0 ? base.slice(0, dot) : base
    const match = o.kind === 'image' ? VARIANT.exec(stem) : null
    if (!match || Number(match[2]) < 100) { rest.push(o); continue }
    const id = `${folderOf(o.key)}${match[1]}`
    const set = sets.get(id)
    if (set) set.push({ o, width: Number(match[2]) })
    else sets.set(id, [{ o, width: Number(match[2]) }])
  }

  for (const [id, variants] of sets) {
    if (variants.length < 2) { rest.push(variants[0].o); continue }
    const byWidth = [...variants].sort((a, b) => a.width - b.width)
    rest.push({
      ...byWidth[0].o,
      fullKey: byWidth[byWidth.length - 1].o.key,
      displayName: `${fileName(id)} · ${byWidth.length} sizes`,
      size: variants.reduce((n, v) => n + (v.o.size ?? 0), 0),
      variants: byWidth.map((v) => v.o.key),
    })
  }
  return rest
}

/* Every video in the vault ships a sibling `<name>.png`. Using it as the poster
 * means `preload="none"` still paints a frame; without one the browser fetches
 * the video itself just to show frame one, which over a 20.4 GB bucket is the
 * single most expensive thing this component does. */
const POSTER_EXT = ['png', 'jpg', 'jpeg', 'webp']

function pairPosters(list) {
  const images = new Set(list.filter((o) => o.kind === 'image').map((o) => o.key))
  return list.map((o) => {
    if (o.kind !== 'video') return o
    const stem = o.key.slice(0, o.key.lastIndexOf('.'))
    const poster = POSTER_EXT.map((e) => `${stem}.${e}`).find((k) => images.has(k))
    return poster ? { ...o, poster } : o
  })
}

/**
 * Flatten the bucket's flat key list into ONE ordered row list, folders and
 * files interleaved, honouring which folders are open. The list endpoint
 * returns keys with no `prefixes` key and `?delimiter=/` changes nothing
 * (probed 2026-08-01), so the tree is derived here — this function is the
 * whole navigation feature.
 */
function buildRows(objects, expanded, sort) {
  const childrenOf = new Map()
  const folders = new Set()

  for (const o of objects) {
    const dir = folderOf(o.key)
    if (dir) {
      /* register every ancestor so a deep key materialises its whole chain */
      const parts = dir.slice(0, -1).split('/')
      for (let i = 0; i < parts.length; i += 1) folders.add(`${parts.slice(0, i + 1).join('/')}/`)
    }
    if (!childrenOf.has(dir)) childrenOf.set(dir, [])
    childrenOf.get(dir).push(o)
  }

  const subFoldersOf = (prefix) =>
    [...folders].filter((f) => folderOf(f.slice(0, -1)) === prefix).sort()

  const sorted = (list) => {
    const by = {
      name: (a, b) => a.key.localeCompare(b.key),
      date: (a, b) => String(b.uploaded ?? '').localeCompare(String(a.uploaded ?? '')),
      size: (a, b) => (b.size ?? 0) - (a.size ?? 0),
      kind: (a, b) => String(a.contentType ?? '').localeCompare(String(b.contentType ?? '')),
    }
    return [...list].sort(by[sort] ?? by.name)
  }

  const rows = []
  const walk = (prefix, depth) => {
    for (const f of subFoldersOf(prefix)) {
      rows.push({ type: 'folder', key: f, label: fileName(f.slice(0, -1)) + '/', depth })
      if (expanded.has(f)) walk(f, depth + 1)
    }
    for (const o of sorted(childrenOf.get(prefix) ?? [])) {
      rows.push({ type: 'file', depth, ...o, displayKey: o.displayName ?? fileName(o.key) })
    }
  }
  walk('', 0)
  return rows
}

/**
 * MediaLibraryProvider — the headless core: one list call, client-side tree
 * derivation, the open-folder set and the sort key.
 *
 * @param {object} client   `{ listMedia, mediaUrl, proxied? }` — required
 * @param {string|string[]} accept  'all' (default) = everything · one kind ·
 *   or an allow-list, `['image','video']`, which is what a picker wants.
 *   Kinds: image · video · audio · text · code · playlist · font · archive ·
 *   other. Browsing never filters by default.
 */
export function MediaLibraryProvider({ client, accept = 'all', children }) {
  const [objects, setObjects] = useState([])
  const [expanded, setExpanded] = useState(() => new Set())
  const [sort, setSort] = useState('name')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!client) return undefined
    let cancelled = false
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    client
      .listMedia('', { signal: controller.signal })
      .then((objs) => { if (!cancelled) setObjects(objs) })
      .catch((e) => { if (!cancelled && e.name !== 'AbortError') setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true; controller.abort() }
  }, [client])

  const toggleFolder = (key) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const value = useMemo(() => {
    const annotated = objects.map((o) => ({ ...o, kind: kindOf(o) }))
    const systemCount = annotated.reduce((n, o) => n + (o.kind === 'system' ? 1 : 0), 0)

    /* Fold before pairing: a poster must be matched against real image keys,
     * and resolution sets must be collapsed after that or the poster's own
     * width suffix would swallow it. */
    const visible = foldResolutionSets(
      pairPosters(foldHlsSegments(annotated.filter((o) => o.kind !== 'system'))),
    )

    const kept = visible.filter(acceptsKind(accept))
    /* The lightbox pages images and videos; a .json in that list is a broken
     * frame with a next-arrow. Its index space is this list, not `files`. */
    const viewable = kept.filter((o) => o.kind === 'image' || o.kind === 'video')

    return {
      objects: kept,
      rows: buildRows(kept, expanded, sort),
      files: kept,
      viewable,
      kinds: [...new Set(kept.map((o) => o.kind))].sort(),
      systemCount,
      expanded,
      toggleFolder,
      sort,
      setSort,
      loading,
      error,
      mediaUrl: client?.mediaUrl ?? ((key) => key),
      proxied: client?.proxied ?? ((url) => url),
    }
  }, [objects, expanded, sort, loading, error, accept, client])

  return <MediaLibraryContext.Provider value={value}>{children}</MediaLibraryContext.Provider>
}

/** Read the surrounding library. Throws outside a provider — a silent null
 *  here would surface as an empty grid with no explanation. */
export function useMediaLibrary() {
  const ctx = useContext(MediaLibraryContext)
  if (!ctx) throw new Error('useMediaLibrary must be used inside <MediaLibraryProvider>')
  return ctx
}

function withProvider(node, { client, accept }) {
  if (!client) return node
  return <MediaLibraryProvider client={client} accept={accept}>{node}</MediaLibraryProvider>
}

/* Indentation per tree depth. A rem step rather than a magic pixel, and it
 * rides the spacing scale's 1rem rung. */
const indent = (depth) => ({ paddingInlineStart: `calc(${depth} * var(--kol-spacing-4))` })

function FolderRow({ row, open, onToggle }) {
  return (
    <li
      className="kol-media-folder"
      style={indent(row.depth)}
      onClick={onToggle}
      aria-expanded={open}
    >
      <Icon name={open ? 'chevron-down' : 'chevron-right'} size={14} />
      <Icon name="folder" size={16} />
      <span className="kol-mono-12 text-emphasis flex-1">{row.label}</span>
    </li>
  )
}

/* Copy-URL is the one action every view carries; the admin's Rename/Delete are
 * write ops and stay out of the DS (ARCHITECTURE §3, and the spec's own note). */
function useCopy() {
  const [copied, setCopied] = useState(null)
  const copy = async (url) => {
    try { await navigator.clipboard.writeText(url) } catch { /* clipboard blocked */ }
    setCopied(url)
    setTimeout(() => setCopied(null), 1500)
  }
  return [copied, copy]
}

/* A video paints nothing until a frame decodes, so its resting state is a blank
 * box — no name, no type marker. This gives it the <img alt> equivalent: a play
 * glyph and the filename behind the video, revealed only while it has nothing
 * to show. `onLoadedData` is the earliest event that guarantees a frame.
 *
 * The loading strategy is deliberately unchanged (lobby/MediaLibraryVideoFallback:
 * both candidate strategies failed the same way headless, so that measurement
 * discriminates nothing). This layer needs no decoder to be correct. */
const KIND_ICON = {
  audio: 'frequency',
  playlist: 'video',
  text: 'file',
  code: 'code',
  font: 'type',
  archive: 'layers',
  other: 'file',
}

function Thumb({ row, mediaUrl }) {
  const [painted, setPainted] = useState(false)

  if (row.kind === 'image') {
    return <img src={mediaUrl(row.key)} alt="" loading="lazy" className="w-full h-full object-cover" />
  }

  /* Everything the browser cannot paint gets the same treatment a video's
   * resting state gets — a kind glyph and the filename, rather than an <img>
   * pointed at a .json and the broken-image chrome that follows. */
  if (row.kind !== 'video') {
    return (
      <div className="kol-media-thumb">
        <span className="kol-media-thumb-fallback" data-painted={false}>
          <Icon name={KIND_ICON[row.kind] ?? 'file'} size={20} />
          <span className="kol-mono-12">{fileName(row.key)}</span>
        </span>
      </div>
    )
  }

  return (
    <div className="kol-media-thumb">
      <span className="kol-media-thumb-fallback" data-painted={painted || !!row.poster}>
        <Icon name="play" size={20} />
        <span className="kol-mono-12">{fileName(row.key)}</span>
      </span>
      <video
        src={row.poster ? mediaUrl(row.key) : posterSrc(mediaUrl(row.key))}
        poster={row.poster ? mediaUrl(row.poster) : undefined}
        muted
        preload={row.poster ? 'none' : 'metadata'}
        onLoadedData={() => setPainted(true)}
        className="relative w-full h-full object-cover"
      />
    </div>
  )
}

/* Folders, then the tiles or rows. Shared by both views — the modal shell and
 * the pick action are the ONLY differences between them. */
function LibraryBody({ rows, viewMode, onOpen, onPick }) {
  const { expanded, toggleFolder, mediaUrl, loading, error, viewable } = useMediaLibrary()
  const [copied, copy] = useCopy()

  if (error) return <p className="kol-helper-12 text-ui-error">Couldn’t load: {error}</p>
  if (loading) return <p className="kol-helper-12 text-meta">Loading…</p>
  if (rows.length === 0) return <p className="kol-helper-12 text-meta">Nothing here.</p>

  const files = rows.filter((r) => r.type === 'file')
  /* Index into `viewable`, which is what the lightbox pages — indexing into the
   * filtered rows meant a search narrowing the grid opened the wrong file. */
  const openerFor = (row) => {
    const i = viewable.findIndex((f) => f.key === row.key)
    return i < 0 ? undefined : () => onOpen(i)
  }

  /* Copy hands over the full-size variant, not the thumbnail the tile loaded. */
  const urlFor = (row) => mediaUrl(row.fullKey ?? row.key)

  const actionsFor = (row) => (
    <div className="flex items-center gap-2">
      {onPick && <Button size="sm" onClick={() => onPick(row)}>Use</Button>}
      <Button variant="secondary" size="sm" onClick={() => copy(urlFor(row))}>
        {copied === urlFor(row) ? 'Copied' : 'Copy URL'}
      </Button>
    </div>
  )

  if (viewMode === 'list') {
    return (
      <ul className="kol-media-scroll kol-media-list">
        {rows.map((row) =>
          row.type === 'folder' ? (
            <FolderRow key={row.key} row={row} open={expanded.has(row.key)} onToggle={() => toggleFolder(row.key)} />
          ) : (
            <div key={row.key} style={indent(row.depth)}>
              <MediaRow
                thumb={<Thumb row={row} mediaUrl={mediaUrl} />}
                name={
                  openerFor(row) ? (
                    <button type="button" className="kol-mono-12 text-emphasis" onClick={openerFor(row)}>
                      {row.displayKey}
                    </button>
                  ) : (
                    <span className="kol-mono-12 text-emphasis">{row.displayKey}</span>
                  )
                }
                date={row.uploaded ? String(row.uploaded).slice(0, 10) : ''}
                size={formatSize(row.size)}
                actions={actionsFor(row)}
              />
            </div>
          ),
        )}
      </ul>
    )
  }

  return (
    <div className="kol-media-scroll">
      <ul className="kol-media-list">
        {rows.filter((r) => r.type === 'folder').map((row) => (
          <FolderRow key={row.key} row={row} open={expanded.has(row.key)} onToggle={() => toggleFolder(row.key)} />
        ))}
      </ul>
      <ul className="kol-media-grid">
        {files.map((row) => (
          <MediaCard
            key={row.key}
            thumb={
              <div
                className={openerFor(row) ? 'w-full h-full cursor-pointer' : 'w-full h-full'}
                onClick={openerFor(row)}
              >
                <Thumb row={row} mediaUrl={mediaUrl} />
              </div>
            }
            name={<p className="kol-mono-12 text-emphasis truncate">{row.displayKey}</p>}
            meta={`${formatSize(row.size)}${row.uploaded ? ` · ${String(row.uploaded).slice(0, 10)}` : ''}`}
            /* The set's largest variant, not the thumbnail the tile painted. */
            downloadHref={mediaUrl(row.fullKey ?? row.key)}
            actions={actionsFor(row)}
          />
        ))}
      </ul>
    </div>
  )
}

/* Finder puts the path at the window FOOT, not stacked above the content. The
 * hidden-system count rides the same bar — hiding 118 `.DS_Store` files without
 * saying so is the same silent drop this component was filed for. */
function PathBar({ rows, systemCount }) {
  const open = rows.filter((r) => r.type === 'folder' && r.depth > 0)
  const trail = open.length ? open[open.length - 1].key.replace(/\/$/, '').split('/') : []
  return (
    <div className="kol-media-pathbar">
      <Icon name="folder" size={12} />
      <span className="kol-helper-12 text-meta">root</span>
      {trail.map((seg) => (
        <span key={seg} className="flex items-center gap-1">
          <Icon name="chevron-right" size={10} />
          <span className="kol-helper-12 text-meta">{seg}</span>
        </span>
      ))}
      {systemCount > 0 && (
        <span className="kol-helper-12 text-meta ms-auto">
          {systemCount} system file{systemCount === 1 ? '' : 's'} hidden
        </span>
      )}
    </div>
  )
}

const VIEW_OPTIONS = [
  { value: 'grid', icon: 'grid', label: 'Grid' },
  { value: 'list', icon: 'view-list', label: 'List' },
]

/* Sort is a SegmentedToggle — the DS's joined N-way control. The first
 * pass hand-rolled four <button className="kol-helper-12"> instead. */
const SORTS = [
  { value: 'name', label: 'name' },
  { value: 'date', label: 'date' },
  { value: 'size', label: 'size' },
  { value: 'kind', label: 'kind' },
]

/* The chrome — ContentFilters owns the animated search, the filter groups, the
 * view toggle and the N-of-M count. It was hand-rolled as a static <Input> on
 * the first pass while this organism sat one import away. */
function LibraryChrome({ onOpen, onPick }) {
  const { rows, sort, setSort, kinds, systemCount } = useMediaLibrary()
  const [viewMode, setViewMode] = useState('grid')

  const items = useMemo(
    () => rows.map((r) => ({
      ...r,
      name: r.type === 'folder' ? r.label : r.displayKey,
      kind: r.type === 'folder' ? 'folder' : r.kind,
    })),
    [rows],
  )

  return (
    <>
      <ContentFilters
        items={items}
        title="Media library"
        titleIcon="folder"
        totalCount={items.length}
        searchKeys={['name']}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        viewModeOptions={VIEW_OPTIONS}
        mutuallyExclusiveFilters={['kind']}
        /* Derived — a hard-coded image/video/folder list is how the filter bar
         * denied the existence of the audio and data the provider now keeps. */
        filterGroups={[{ label: 'Kind', key: 'kind', values: ['folder', ...kinds] }]}
        headerActions={
          <SegmentedToggle
            size="sm"
            value={sort}
            onChange={setSort}
            options={SORTS}
            ariaLabel="Sort by"
          />
        }
        renderItem={(filtered, mode) => (
          <LibraryBody rows={filtered} viewMode={mode} onOpen={onOpen} onPick={onPick} />
        )}
      />
      <PathBar rows={rows} systemCount={systemCount} />
    </>
  )
}

/* The lightbox is MediaViewer — the DS already has ONE fullscreen paged viewer
 * and this is not a second one. Use / Copy URL ride its `actions` slot. */
function LibraryViewer({ index, onIndexChange, onClose, onPick }) {
  const { viewable, mediaUrl } = useMediaLibrary()
  const [copied, copy] = useCopy()

  /* Full-size in the lightbox — `key` is the thumbnail variant for folded sets. */
  const media = viewable.map((o) => ({
    url: mediaUrl(o.fullKey ?? o.key),
    alt: fileName(o.key),
    kind: o.kind === 'video' ? 'video' : 'image',
    caption: `${o.displayName ?? fileName(o.key)} · ${formatSize(o.size)}`,
  }))

  return (
    <MediaViewer
      open={index !== null}
      media={media}
      index={index ?? 0}
      onIndexChange={onIndexChange}
      onClose={onClose}
      actions={(item, i) => (
        <>
          {onPick && <Button size="sm" onClick={() => onPick(viewable[i])}>Use</Button>}
          <Button variant="secondary" size="sm" onClick={() => copy(item.url)}>
            {copied === item.url ? 'Copied' : 'Copy URL'}
          </Button>
        </>
      )}
    />
  )
}

function PickerShell({ onClose, onPick }) {
  const { viewable, mediaUrl } = useMediaLibrary()
  const [viewerIndex, setViewerIndex] = useState(null)

  const pick = (o) => {
    onPick?.(mediaUrl(o.fullKey ?? o.key), { contentType: o.contentType, kind: o.kind })
    onClose?.()
  }

  return (
    <>
      {/* While the viewer is up it owns Escape — handing the picker a no-op
        * close means one keypress steps back one level instead of exiting the
        * whole picker, which is the behaviour the fxr fork hand-rolled. */}
      <FullscreenOverlay open onClose={viewerIndex === null ? onClose : () => {}}>
        <div className="kol-media-picker">
          <LibraryChrome onOpen={setViewerIndex} onPick={pick} />
        </div>
      </FullscreenOverlay>

      {viewerIndex !== null && viewable[viewerIndex] && (
        <LibraryViewer
          index={viewerIndex}
          onIndexChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
          onPick={pick}
        />
      )}
    </>
  )
}

/**
 * MediaLibrary — ONE component, two variants. The user's ruling 2026-08-01:
 * "arent different components, they are more like variants, same shit
 * different viewing." He is right — `page` and `modal` render the identical
 * body and differ only in the shell around it and whether picking closes.
 *
 * Variant is CONTAINER GEOMETRY ONLY, the ThemeToggle precedent: everything
 * else is a prop. `MediaBrowser` and `MediaPicker` survive below as thin
 * aliases so no call site breaks.
 *
 * @param {string}   variant  'page' (in-flow, fills its box) | 'modal' (overlay)
 * @param {boolean}  open     modal only — mounts the overlay
 * @param {object}   client   `{ listMedia, mediaUrl, proxied? }`; omit inside a provider
 * @param {string|string[]} accept  'all' (default) = everything · one kind · an
 *   allow-list `['image','video']`
 * @param {Function} onClose  modal only — Esc, backdrop, close button
 * @param {Function} onSelect `(url, { contentType })`. In `modal` it also closes.
 */
export default function MediaLibrary({
  variant = 'page',
  open = true,
  client,
  accept = 'all',
  onClose,
  onSelect = null,
}) {
  if (variant === 'modal') {
    if (!open) return null
    return withProvider(<PickerShell onClose={onClose} onPick={onSelect} />, { client, accept })
  }
  return withProvider(<BrowserShell onSelect={onSelect} />, { client, accept })
}

/** Alias — `MediaLibrary variant="modal"`. Kept so existing call sites and the
 *  fxr editor's `onPick` naming keep working. */
export function MediaPicker({ open, client, accept = 'all', onClose, onPick }) {
  return (
    <MediaLibrary
      variant="modal"
      open={open}
      client={client}
      accept={accept}
      onClose={onClose}
      onSelect={onPick}
    />
  )
}

function BrowserShell({ onSelect }) {
  const { viewable, mediaUrl } = useMediaLibrary()
  const [viewerIndex, setViewerIndex] = useState(null)

  const pick = onSelect
    ? (o) => onSelect(mediaUrl(o.fullKey ?? o.key), { contentType: o.contentType, kind: o.kind })
    : undefined

  return (
    <div className="kol-media-browser">
      <LibraryChrome onOpen={setViewerIndex} onPick={pick} />

      {viewerIndex !== null && viewable[viewerIndex] && (
        <LibraryViewer
          index={viewerIndex}
          onIndexChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
          onPick={pick}
        />
      )}
    </div>
  )
}

/** Alias — `MediaLibrary variant="page"`. Without `onSelect` the actions offer
 *  Copy URL only, which is the read-only page a brand book wants. */
export function MediaBrowser({ client, accept = 'all', onSelect = null }) {
  return <MediaLibrary variant="page" client={client} accept={accept} onSelect={onSelect} />
}
