import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import ActionButton from '../atoms/ActionButton.jsx'
import Button from '../atoms/Button.jsx'
import Divider from '../atoms/Divider.jsx'
import Input from '../atoms/Input.jsx'
import SegmentedToggle from '../atoms/SegmentedToggle.jsx'
import SizeOrDownload from '../atoms/SizeOrDownload.jsx'
import ViewToggle from '../atoms/ViewToggle.jsx'
import FullscreenOverlay from '../utilities/FullscreenOverlay.jsx'
import { Tooltip } from '../utilities/Popover.jsx'
import ContentCard from '../molecules/ContentCard.jsx'
import ContentRow from '../molecules/ContentRow.jsx'
import ContentFilters from './ContentFilters.jsx'
import MediaViewer from './MediaViewer.jsx'
import { MediaLibraryBrowse, MediaLibraryLibrary } from './MediaLibraryPages.jsx'
import MediaLibraryExplorer from './MediaLibraryExplorer.jsx'
import { SettingsChipRow, chipCls } from './SettingsPanel.jsx'

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
 *   ContentCard    — the grid tile, `variant="default"` (thumb · download in the
 *                    frame corner · title · date · size-or-download · inline actions)
 *   ContentRow     — the list row, `variant="default"` (thumb · title · date · size · actions)
 *                    MediaCard / MediaRow retired 2026-08-26 (ContentSetRetirement);
 *                    this was the DS's own last composition of them, swapped 2026-08-27
 *                    onto kol-r2b2 FileList's ContentCard / ContentRow shape.
 *   MediaViewer    — the lightbox, via its `actions` slot
 *   ContentFilters — the PICKER's chrome (search, kind filter, view toggle, N-of-M)
 *   FullscreenOverlay — the picker's scrim, dismissal and close button
 *
 * NAVIGATION IS CLICK-TO-ENTER + BREADCRUMB (MediaLibraryReconcile, kol-r2b2
 * 2026-08-26). The page variant is the read-only render of kol-r2b2's
 * `FileList` — the one the user works in on media.kolkrabbi.io — so brand
 * `/library` and media. are ONE picture: breadcrumb on top, a stats line
 * (level · bucket · system files hidden), folder rows that ENTER a prefix,
 * a bare toolbar (filter · search | Flat · view · sort with direction), a
 * 260px tile grid, and `Show N more` paging. Finder's disclose-in-place tree
 * (2026-08-01) is DROPPED, not kept as a variant — two navigation models in
 * one organism is the fork this ticket exists to end. The picker keeps its
 * ContentFilters chrome and its path bar at the foot; it navigates the same way.
 *
 * Read-only by design. Upload / rename / delete / select stay in kol-r2b2 —
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

/* ── The prefix-scoped list ────────────────────────────────────────────────
 * The list endpoint returns keys with no `prefixes` key and `?delimiter=/`
 * changes nothing (probed 2026-08-01), so folders are derived here from the
 * keys under the current prefix — this function is the whole navigation. */
function foldersUnder(list, prefix) {
  const names = new Set()
  for (const o of list) {
    const rest = o.key.slice(prefix.length)
    const i = rest.indexOf('/')
    if (i > 0) names.add(rest.slice(0, i))
  }
  return [...names].sort().map((name) => ({ key: `${prefix}${name}/`, label: name }))
}

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'date', label: 'Date' },
  { value: 'size', label: 'Size' },
  { value: 'kind', label: 'Kind' },
]

/* Chip labels — authored here, no text-transform (the kind key is the value). */
const KIND_LABEL = {
  image: 'Image', video: 'Video', audio: 'Audio', text: 'Text', code: 'Code',
  playlist: 'Playlist', font: 'Font', archive: 'Archive', other: 'Other',
}

/* Sortable-header semantics (FileList): arrow-down = ascending (A→Z, oldest
 * first, smallest first); ties fall back to the name. */
function sortFiles(files, { by, dir }) {
  const d = dir === 'desc' ? -1 : 1
  const name = (a, b) => a.displayKey.localeCompare(b.displayKey)
  const cmp = {
    name,
    date: (a, b) => String(a.uploaded ?? '').localeCompare(String(b.uploaded ?? '')) || name(a, b),
    size: (a, b) => (a.size ?? 0) - (b.size ?? 0) || name(a, b),
    kind: (a, b) => a.kind.localeCompare(b.kind) || name(a, b),
  }[by] ?? name
  return [...files].sort((a, b) => d * cmp(a, b))
}

/**
 * MediaLibraryProvider — the headless core: one list call, then a
 * PREFIX-SCOPED view over it: the folders directly under the prefix, the
 * files at that level (or the whole subtree in `flat`), the kind allow-list,
 * the search, the sort with direction, and paging.
 *
 * @param {object} client   `{ listMedia, mediaUrl, proxied? }` — required
 * @param {string|string[]} accept  'all' (default) = everything · one kind ·
 *   or an allow-list, `['image','video']`, which is what a picker wants.
 *   Kinds: image · video · audio · text · code · playlist · font · archive ·
 *   other. Browsing never filters by default.
 * @param {number}  pageSize     rows mounted before `Show N more` (60; 0 = all)
 * @param {object}  defaultSort  `{ by, dir }` — `{ by: 'date', dir: 'desc' }`
 * @param {boolean} flat         start in flat mode (every object under the prefix)
 */
export function MediaLibraryProvider({
  client,
  accept = 'all',
  pageSize = 60,
  defaultSort = { by: 'date', dir: 'desc' },
  flat: initialFlat = false,
  children,
}) {
  const [objects, setObjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [prefix, setPrefix] = useState('')
  const [flat, setFlat] = useState(initialFlat)
  const [sort, setSortState] = useState(defaultSort)
  const [search, setSearch] = useState('')
  const [kinds, setKinds] = useState(() => new Set())
  /* Paging is keyed to WHAT is listed: prefix / flat / search / kinds change →
   * back to one page, or walking into a folder would inherit the page count
   * from the flat view you just left. Derived, not an effect. */
  const [paging, setPaging] = useState({ id: null, visible: 0 })

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

  /* click an inactive field → ascending; click the active one → flip */
  const sortBy = (by) =>
    setSortState((s) => (s.by === by ? { by, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { by, dir: 'asc' }))
  const toggleKind = (k) =>
    setKinds((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })

  const value = useMemo(() => {
    const annotated = objects.map((o) => ({ ...o, kind: kindOf(o) }))
    const scoped = prefix ? annotated.filter((o) => o.key.startsWith(prefix)) : annotated
    const folders = foldersUnder(scoped, prefix)
    /* level = the direct children; flat = every object under the prefix */
    const level = flat ? scoped : scoped.filter((o) => !o.key.slice(prefix.length).includes('/'))
    /* .DS_Store × 116 in the website bucket — dropped from the list, counted
     * and reported: hiding them silently would be the same lie as the
     * level-only totals were. */
    const systemCount = level.reduce((n, o) => n + (o.kind === 'system' ? 1 : 0), 0)
    /* Fold before pairing: a poster must be matched against real image keys,
     * and resolution sets must be collapsed after that or the poster's own
     * width suffix would swallow it. */
    const folded = foldResolutionSets(pairPosters(foldHlsSegments(level.filter((o) => o.kind !== 'system'))))
    const files = folded
      .filter(acceptsKind(accept))
      .map((o) => ({ ...o, displayKey: o.displayName ?? (flat ? o.key.slice(prefix.length) : fileName(o.key)) }))

    const kindCounts = files.reduce((acc, o) => { acc[o.kind] = (acc[o.kind] || 0) + 1; return acc }, {})
    const kindsPresent = Object.keys(kindCounts).sort().map((k) => ({ value: k, label: KIND_LABEL[k] ?? k, count: kindCounts[k] }))

    const q = search.trim().toLowerCase()
    const filtered = files.filter(
      (o) => (kinds.size === 0 || kinds.has(o.kind)) && (!q || o.displayKey.toLowerCase().includes(q)),
    )
    const sorted = sortFiles(filtered, sort)

    const page = pageSize || Infinity
    const listId = `${prefix}|${flat}|${q}|${[...kinds].sort().join(',')}|${pageSize}`
    const visible = paging.id === listId ? paging.visible : page
    const shown = sorted.slice(0, visible)
    const more = sorted.length - shown.length

    /* The lightbox pages images and videos; a .json in that list is a broken
     * frame with a next-arrow. Its index space is this list, not `sorted`. */
    const viewable = sorted.filter((o) => o.kind === 'image' || o.kind === 'video')

    const bucketFiles = annotated.reduce((n, o) => n + (o.kind === 'system' ? 0 : 1), 0)
    const bucketBytes = annotated.reduce((n, o) => n + (o.size ?? 0), 0)

    return {
      objects: files,
      files,
      filtered,
      sorted,
      shown,
      more,
      pageSize: page,
      showMore: () => setPaging({ id: listId, visible: visible + page }),
      prefix,
      setPrefix,
      crumbs: prefix ? prefix.replace(/\/$/, '').split('/') : [],
      folders,
      flat,
      setFlat,
      kindsPresent,
      kinds,
      toggleKind,
      search,
      setSearch,
      sort,
      sortBy,
      stats: {
        folders: folders.length,
        files: filtered.length,
        rawFiles: files.length,
        bytes: files.reduce((n, o) => n + (o.size ?? 0), 0),
        bucketFiles,
        bucketBytes,
        atRoot: !prefix,
        systemCount,
        filtering: kinds.size > 0 || q.length > 0,
      },
      viewable,
      loading,
      error,
      mediaUrl: client?.mediaUrl ?? ((key) => key),
      proxied: client?.proxied ?? ((url) => url),
    }
  }, [objects, prefix, flat, sort, search, kinds, paging, pageSize, loading, error, accept, client])

  return <MediaLibraryContext.Provider value={value}>{children}</MediaLibraryContext.Provider>
}

/** Read the surrounding library. Throws outside a provider — a silent null
 *  here would surface as an empty grid with no explanation. */
export function useMediaLibrary() {
  const ctx = useContext(MediaLibraryContext)
  if (!ctx) throw new Error('useMediaLibrary must be used inside <MediaLibraryProvider>')
  return ctx
}

function withProvider(node, { client, accept, pageSize, defaultSort, flat }) {
  if (!client) return node
  return (
    <MediaLibraryProvider client={client} accept={accept} pageSize={pageSize} defaultSort={defaultSort} flat={flat}>
      {node}
    </MediaLibraryProvider>
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

/* One folder, click-to-enter. `struck` = flat mode: the folder is bypassed
 * but still navigable, so it stays and reads de-emphasised. Box in
 * .kol-media-folder (kol-components-organisms.css). */
function FolderRow({ folder, struck = false, onEnter }) {
  return (
    <li className="kol-media-folder" onClick={onEnter}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-oq-48">
        <Icon name="folder" size={18} />
      </span>
      <span className={`kol-mono-12 flex-1 ${struck ? 'line-through text-meta' : 'text-body'}`}>{folder.label}</span>
      <Icon name="chevron-right" size={14} className="text-oq-24" />
    </li>
  )
}

function FolderRows() {
  const { folders, flat, setPrefix } = useMediaLibrary()
  if (!folders.length) return null
  return (
    <ul className="kol-media-list">
      {folders.map((f) => (
        <FolderRow key={f.key} folder={f} struck={flat} onEnter={() => setPrefix(f.key)} />
      ))}
    </ul>
  )
}

/* Breadcrumb — `root / seg / seg`, every crumb a step back. */
function Breadcrumb({ className = '' }) {
  const { crumbs, setPrefix } = useMediaLibrary()
  return (
    <div className={`flex items-center gap-1 kol-mono-12 text-meta ${className}`}>
      <button type="button" className="hover:text-emphasis transition-colors" onClick={() => setPrefix('')}>root</button>
      {crumbs.map((seg, i) => {
        const to = `${crumbs.slice(0, i + 1).join('/')}/`
        return (
          <span key={to} className="flex items-center gap-1">
            <span>/</span>
            <button type="button" className="hover:text-emphasis transition-colors" onClick={() => setPrefix(to)}>{seg}</button>
          </span>
        )
      })}
    </div>
  )
}

/* The stats line. Whole-bucket figures at root or in flat — the level-only
 * line used to read "0 files · 0 B" at a B2 root: true of the level, a lie
 * about the bucket. */
function Stats() {
  const { stats: s, flat } = useMediaLibrary()
  return (
    <p className="kol-mono-12 text-meta">
      {s.folders > 0 && `${s.folders} folder${s.folders > 1 ? 's' : ''} · `}
      {s.filtering && s.rawFiles !== s.files ? `${s.files} of ${s.rawFiles}` : s.rawFiles}
      {' '}{s.rawFiles === 1 ? 'file' : 'files'} · {formatSize(s.bytes)}
      {(s.atRoot || flat) && s.rawFiles !== s.bucketFiles && (
        <span className="text-subtle">{'  ·  bucket: '}{s.bucketFiles} files · {formatSize(s.bucketBytes)}</span>
      )}
      {s.systemCount > 0 && (
        <span className="text-subtle">{'  ·  '}{s.systemCount} system file{s.systemCount === 1 ? '' : 's'} hidden</span>
      )}
    </p>
  )
}

/* Sort — label buttons; the active one carries the direction glyph. */
function SortControls() {
  const { sort, sortBy } = useMediaLibrary()
  return (
    <div className="flex items-center gap-4">
      {SORT_OPTIONS.map((opt) => {
        const active = sort.by === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => sortBy(opt.value)}
            className={`kol-mono-12 flex items-center gap-1 transition-colors ${active ? 'text-emphasis' : 'text-meta hover:text-body'}`}
          >
            {opt.label}
            {active && <Icon name={sort.dir === 'asc' ? 'arrow-down' : 'arrow-up'} size={10} />}
          </button>
        )
      })}
    </div>
  )
}

/* The bare toolbar — filter · search on the left; Flat · view · sort on the
 * right. No title: that is the consumer's page header. The icon buttons are
 * DS Buttons on the nav rung (the box has an owner), `pressed` when the
 * filter is open or narrowing. */
function Toolbar({ viewMode, onViewMode }) {
  const { search, setSearch, kindsPresent, kinds, toggleKind, flat, setFlat } = useMediaLibrary()
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="nav"
            size="sm"
            iconOnly="filter"
            iconSize={16}
            quiet
            pressed={filterOpen || kinds.size > 0}
            aria-label="Toggle kind filter"
            onClick={() => setFilterOpen((v) => !v)}
          />
          {searchOpen ? (
            <Input
              size="sm"
              variant="outline"
              width="200px"
              value={search}
              autoFocus
              placeholder="search name…"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') { setSearch(''); setSearchOpen(false) } }}
              onBlur={() => { if (!search) setSearchOpen(false) }}
            />
          ) : (
            <Button
              variant="nav"
              size="sm"
              iconOnly="search"
              iconSize={16}
              quiet
              pressed={search.length > 0}
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            />
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* The DS's own Tooltip, not a `title` attribute — see LibraryHeader. */}
          <Tooltip label="Show all files recursively">
            <button
              type="button"
              aria-pressed={flat}
              onClick={() => setFlat(!flat)}
              className={chipCls(flat)}
            >
              Flat
            </button>
          </Tooltip>
          <ViewToggle viewMode={viewMode} onViewChange={onViewMode} variant="icon" />
          <Divider variant="vertical" />
          <SortControls />
        </div>
      </div>
      {filterOpen && (
        <div className="flex items-center gap-2">
          <span className="kol-mono-12 text-subtle">Kind</span>
          <SettingsChipRow options={kindsPresent} selected={kinds} onToggle={toggleKind} />
        </div>
      )}
    </>
  )
}

/* The tiles or the rows over ONE paged list — shared by the page and the
 * picker; `onPick` is the only difference between them. */
function FilesBody({ files, viewMode, onOpen, onPick }) {
  const { mediaUrl, viewable, prefix, stats, more, pageSize, showMore } = useMediaLibrary()
  const [, copy] = useCopy()

  if (files.length === 0) {
    return (
      <p className="kol-mono-12 text-meta">
        {stats.filtering ? 'No files match.' : `No files${prefix ? ` in "${prefix}"` : ''} yet.`}
      </p>
    )
  }

  /* Index into `viewable`, which is what the lightbox pages — indexing into the
   * filtered rows meant a search narrowing the grid opened the wrong file. */
  const openerFor = (row) => {
    const i = viewable.findIndex((f) => f.key === row.key)
    return i < 0 ? undefined : () => onOpen(i)
  }
  /* Copy and download hand over the full-size variant, not the thumbnail. */
  const urlFor = (row) => mediaUrl(row.fullKey ?? row.key)

  const thumbFor = (row) => {
    const open = openerFor(row)
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-fg-04 overflow-hidden${open ? ' cursor-zoom-in' : ''}`}
        onClick={open}
      >
        <Thumb row={row} mediaUrl={mediaUrl} />
      </div>
    )
  }
  /* INLINE controls, never labelled Buttons (ContentSetRetirement, 2026-08-27):
   * the card's `actions` float in the plate's corner beside the title, so a
   * labelled Button there sits on the copy — kol-r2b2's column of
   * `.kol-inline-control`s is the shape that fits. The card's download is the
   * frame-corner `control` + the size slot (SizeOrDownload); the row keeps its
   * glyph beside Copy. `Use` (picker only) is the same control wearing `plus`. */
  const actionsFor = (row, form) => (
    <div className={form === 'row' ? 'flex items-center gap-2' : 'flex h-full flex-col items-center justify-between'}>
      {onPick && <ActionButton chrome="inline" size="sm" icon="plus" confirmIcon="check" label="Use" confirmLabel="Used" onAction={() => onPick(row)} />}
      <ActionButton chrome="inline" size="sm" icon="copy" confirmIcon="check" label="Copy URL" confirmLabel="Copied" onAction={() => copy(urlFor(row))} />
      {form === 'row' && (
        <ActionButton chrome="inline" size="sm" icon="download" confirmIcon="check" label="Download" confirmLabel="Downloaded" href={urlFor(row)} />
      )}
    </div>
  )
  /* the title voice is the family's ruled default (heading-04 card / heading-05
   * row, truncated by ContentText); the full key rides as the tooltip, as before */
  const nameFor = (row) => <Tooltip label={row.key} asChild><span>{row.displayKey}</span></Tooltip>
  const date = (row) => (row.uploaded ? String(row.uploaded).slice(0, 10) : undefined)
  const size = (row) => formatSize(row.size) || undefined

  return (
    <>
      {viewMode === 'list' ? (
        <div className="kol-media-list">
          {files.map((row) => (
            <ContentRow
              key={row.key}
              variant="default"
              media={thumbFor(row)}
              title={nameFor(row)}
              date={date(row)}
              size={size(row)}
              actions={actionsFor(row, 'row')}
            />
          ))}
        </div>
      ) : (
        <div className="kol-media-grid">
          {files.map((row) => (
            <ContentCard
              key={row.key}
              variant="default"
              media={thumbFor(row)}
              control={
                <ActionButton chrome="media" icon="download" confirmIcon="check" label="Download" confirmLabel="Downloaded" href={urlFor(row)} />
              }
              title={nameFor(row)}
              date={date(row)}
              size={size(row) && <SizeOrDownload href={urlFor(row)}>{size(row)}</SizeOrDownload>}
              actions={actionsFor(row, 'card')}
            />
          ))}
        </div>
      )}
      {more > 0 && (
        <button
          type="button"
          onClick={showMore}
          className="kol-mono-12 text-meta hover:text-emphasis transition-colors self-start py-2"
        >
          Show {Math.min(more, pageSize)} more · {more} remaining
        </button>
      )}
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

/* ── The old PAGE — the 08-26 reconcile; replaced by MediaLibraryPages (browse · library) 2026-08-27, kept only as the picker's parts' first host ── */
// eslint-disable-next-line no-unused-vars
function BrowserShell({ onSelect }) {
  const lib = useMediaLibrary()
  const [viewMode, setViewMode] = useState('grid')
  const [viewerIndex, setViewerIndex] = useState(null)

  const pick = onSelect
    ? (o) => onSelect(lib.mediaUrl(o.fullKey ?? o.key), { contentType: o.contentType, kind: o.kind })
    : undefined

  return (
    <div className="kol-media-browser gap-3">
      <Breadcrumb />
      <Stats />
      {lib.error && <p className="kol-mono-12 text-ui-error">Couldn’t load: {lib.error}</p>}
      {lib.loading && <p className="kol-mono-12 text-meta">Loading…</p>}
      {!lib.loading && !lib.error && lib.stats.folders === 0 && lib.stats.rawFiles === 0 && (
        <p className="kol-mono-12 text-meta">No files{lib.prefix ? ` in "${lib.prefix}"` : ''} yet.</p>
      )}
      <FolderRows />
      {lib.stats.rawFiles > 0 && (
        <div className="flex flex-col gap-3">
          <Toolbar viewMode={viewMode} onViewMode={setViewMode} />
          <Divider />
          <FilesBody files={lib.shown} viewMode={viewMode} onOpen={setViewerIndex} onPick={pick} />
        </div>
      )}
      {viewerIndex !== null && lib.viewable[viewerIndex] && (
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

/* ── The PICKER — ContentFilters chrome, path bar at the foot ───────────── */

const VIEW_OPTIONS = [
  { value: 'grid', icon: 'grid', label: 'Grid' },
  { value: 'list', icon: 'view-list', label: 'List' },
]

/* The path at the FOOT of the picker card; the hidden-system count rides it —
 * hiding 118 `.DS_Store` files without saying so is the same silent drop this
 * component was filed for. */
function PathBar() {
  const { stats } = useMediaLibrary()
  return (
    <div className="kol-media-pathbar">
      <Icon name="folder" size={12} />
      <Breadcrumb />
      {stats.systemCount > 0 && (
        <span className="kol-helper-12 text-meta ms-auto">
          {stats.systemCount} system file{stats.systemCount === 1 ? '' : 's'} hidden
        </span>
      )}
    </div>
  )
}

function PickerBody({ items, viewMode, onOpen, onPick }) {
  const { folders, flat, setPrefix, loading, error, more, pageSize, showMore } = useMediaLibrary()
  if (error) return <p className="kol-helper-12 text-ui-error">Couldn’t load: {error}</p>
  if (loading) return <p className="kol-helper-12 text-meta">Loading…</p>
  const files = items.filter((r) => r.type !== 'folder')
  const shownFolders = items.filter((r) => r.type === 'folder')
  if (items.length === 0) return <p className="kol-helper-12 text-meta">Nothing here.</p>
  return (
    <div className="kol-media-scroll flex flex-col gap-3">
      {shownFolders.length > 0 && (
        <ul className="kol-media-list">
          {shownFolders.map((f) => (
            <FolderRow key={f.key} folder={f} struck={flat} onEnter={() => setPrefix(f.key)} />
          ))}
        </ul>
      )}
      <FilesBody files={files.slice(0, files.length - Math.max(0, more))} viewMode={viewMode} onOpen={onOpen} onPick={onPick} />
      {void folders}{void pageSize}{void showMore}
    </div>
  )
}

/* The picker's chrome — ContentFilters owns the animated search, the kind
 * filter, the view toggle and the N-of-M count; sort rides its header slot. */
function LibraryChrome({ onOpen, onPick }) {
  const { folders, sorted, sort, sortBy } = useMediaLibrary()
  const [viewMode, setViewMode] = useState('grid')

  const items = useMemo(
    () => [
      ...folders.map((f) => ({ ...f, type: 'folder', name: f.label, kind: 'folder' })),
      ...sorted.map((o) => ({ ...o, type: 'file', name: o.displayKey })),
    ],
    [folders, sorted],
  )
  const kinds = useMemo(() => [...new Set(sorted.map((o) => o.kind))].sort(), [sorted])

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
        filterGroups={[{ label: 'Kind', key: 'kind', values: ['folder', ...kinds] }]}
        headerActions={
          <SegmentedToggle size="sm" value={sort.by} onChange={sortBy} options={SORT_OPTIONS} ariaLabel="Sort by" />
        }
        renderItem={(filtered, mode) => (
          <PickerBody items={filtered} viewMode={mode} onOpen={onOpen} onPick={onPick} />
        )}
      />
      <PathBar />
    </>
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
 * MediaLibrary — ONE component, its variants. The user's ruling 2026-08-01:
 * "arent different components, they are more like variants, same shit
 * different viewing." Since 2026-08-27 (MediaLibraryPages — user: "one page for
 * the content filters, one page for folder/files … bucket is a control, not a
 * page") the in-flow page is kol-r2b2's, cut in two:
 *
 *   `browse`   folder / files — the bucket Dropdown, the crumb line, ColumnBrowser
 *              (or folder rows), the count line
 *   `library`  the content-filters wall — FILES · kinds · search · SELECT / FLAT ·
 *              grid | list | off · sort · the cards, paging, the inspector lightbox
 *   `modal`    the picker, as before
 *   `page`     DEPRECATED alias of `library` (one release) — the 08-26 reconcile
 *              of r2b2's list; the two variants above replace it
 *
 * Both pages take the same injected client (`buckets()` for the dropdown,
 * kol-media-client ≥0.2.0) and render read-only unless it carries the write
 * seams (`deleteObject` · `renameObject` · `downloadUrl`). Props of the pages:
 * `title` · `bucket` / `onBucketChange` · `prefix` / `onPrefix` (browse: controlled
 * or internal) · `settings` / `onSettingsChange` (r2b2's per-bucket model,
 * `defaults` to seed) · `folderTree` (browse: the baked tree) · `headerActions`
 * (the app's own upload / write icons) · `refreshKey`.
 *
 * @param {string}   variant  'explorer' | 'browse' | 'library' | 'modal' | 'page' (alias of library)
 *   `explorer` is browse + library as two views of ONE surface — one header, one
 *   count, one listing, a switch beside the bucket dropdown. Prefer it for a new
 *   consumer; the other two remain for the ones that stack them by hand.
 * @param {boolean}  open     modal only — mounts the overlay
 * @param {object}   client   `{ listMedia, mediaUrl, proxied? }`; omit inside a provider
 * @param {string|string[]} accept  'all' (default) = everything · one kind · an
 *   allow-list `['image','video']`
 * @param {number}   pageSize     rows mounted before `Show N more` (60; 0 = all)
 * @param {object}   defaultSort  `{ by, dir }` (date desc)
 * @param {boolean}  flat         start in flat mode
 * @param {Function} onClose  modal only — Esc, backdrop, close button
 * @param {Function} onSelect `(url, { contentType, kind })`. In `modal` it also closes.
 */
export default function MediaLibrary({
  variant = 'page',
  open = true,
  client,
  accept = 'all',
  pageSize = 60,
  defaultSort = { by: 'date', dir: 'desc' },
  flat = false,
  onClose,
  onSelect = null,
  ...pageProps
}) {
  const opts = { client, accept, pageSize, defaultSort, flat }
  if (variant === 'modal') {
    if (!open) return null
    return withProvider(<PickerShell onClose={onClose} onPick={onSelect} />, opts)
  }
  if (variant === 'browse') return <MediaLibraryBrowse client={client} {...pageProps} />
  /* `explorer` = the two above as TWO VIEWS OF ONE SURFACE, one mounted at a
   * time behind a switch in the header — one wordmark, one count, one listing,
   * and the upload target reachable without scrolling past a full-height
   * browser. Added 2026-09-21; `browse` and `library` are unchanged, so no
   * consumer moves until it chooses to. */
  if (variant === 'explorer') return <MediaLibraryExplorer client={client} {...pageProps} />
  /* `page` = the library wall (alias, one release): its old knobs map onto the settings seed */
  const seed = variant === 'page' ? { defaults: { pageSize, sortBy: defaultSort?.by, sortDir: defaultSort?.dir, flat, ...(pageProps.defaults ?? {}) } } : {}
  return <MediaLibraryLibrary client={client} {...pageProps} {...seed} />
}

/** @deprecated 2026-08-01 — alias of `MediaLibrary variant="modal"`. Kept so
 *  existing call sites and the fxr editor's `onPick` naming keep working;
 *  drops when nobody imports it (04-retirements.md). */
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
