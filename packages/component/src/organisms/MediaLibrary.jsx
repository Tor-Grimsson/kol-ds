import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import Button from '../atoms/Button.jsx'
import SegmentedToggle from '../atoms/SegmentedToggle.jsx'
import FullscreenOverlay from '../atoms/FullscreenOverlay.jsx'
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

/* A video element with no poster paints an empty box until played, and 222 of
 * the reference bucket's 433 objects are video — a time fragment makes the
 * browser seek and paint frame one instead. */
const posterSrc = (url) => `${url}#t=0.1`

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
      rows.push({ type: 'file', depth, ...o, displayKey: fileName(o.key) })
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
 * @param {string} accept   'image' | 'video' | 'all' — which types are listed
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
    const wanted = (o) =>
      accept === 'video' ? isVideo(o.contentType)
      : accept === 'image' ? isImage(o.contentType)
      : isImage(o.contentType) || isVideo(o.contentType)

    const kept = objects.filter(wanted)
    return {
      objects: kept,
      rows: buildRows(kept, expanded, sort),
      files: kept,
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
function Thumb({ row, mediaUrl }) {
  const [painted, setPainted] = useState(false)

  if (!isVideo(row.contentType)) {
    return <img src={mediaUrl(row.key)} alt="" loading="lazy" className="w-full h-full object-cover" />
  }

  return (
    <div className="kol-media-thumb">
      <span className="kol-media-thumb-fallback" data-painted={painted}>
        <Icon name="play" size={20} />
        <span className="kol-mono-12">{fileName(row.key)}</span>
      </span>
      <video
        src={posterSrc(mediaUrl(row.key))}
        muted
        preload="metadata"
        onLoadedData={() => setPainted(true)}
        className="relative w-full h-full object-cover"
      />
    </div>
  )
}

/* Folders, then the tiles or rows. Shared by both views — the modal shell and
 * the pick action are the ONLY differences between them. */
function LibraryBody({ rows, viewMode, onOpen, onPick }) {
  const { expanded, toggleFolder, mediaUrl, loading, error } = useMediaLibrary()
  const [copied, copy] = useCopy()

  if (error) return <p className="kol-helper-12 text-ui-error">Couldn’t load: {error}</p>
  if (loading) return <p className="kol-helper-12 text-meta">Loading…</p>
  if (rows.length === 0) return <p className="kol-helper-12 text-meta">Nothing here.</p>

  const files = rows.filter((r) => r.type === 'file')
  const indexOfFile = (row) => files.findIndex((f) => f.key === row.key)

  const actionsFor = (row) => (
    <div className="flex items-center gap-2">
      {onPick && <Button size="sm" onClick={() => onPick(row)}>Use</Button>}
      <Button variant="secondary" size="sm" onClick={() => copy(mediaUrl(row.key))}>
        {copied === mediaUrl(row.key) ? 'Copied' : 'Copy URL'}
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
                  <button type="button" className="kol-mono-12 text-emphasis" onClick={() => onOpen(indexOfFile(row))}>
                    {row.displayKey}
                  </button>
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
        {files.map((row, i) => (
          <MediaCard
            key={row.key}
            thumb={
              <div className="w-full h-full cursor-pointer" onClick={() => onOpen(i)}>
                <Thumb row={row} mediaUrl={mediaUrl} />
              </div>
            }
            name={<p className="kol-mono-12 text-emphasis truncate">{row.displayKey}</p>}
            meta={`${formatSize(row.size)}${row.uploaded ? ` · ${String(row.uploaded).slice(0, 10)}` : ''}`}
            downloadHref={mediaUrl(row.key)}
            actions={actionsFor(row)}
          />
        ))}
      </ul>
    </div>
  )
}

/* Finder puts the path at the window FOOT, not stacked above the content. */
function PathBar({ rows }) {
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
  const { rows, sort, setSort } = useMediaLibrary()
  const [viewMode, setViewMode] = useState('grid')

  const items = useMemo(
    () => rows.map((r) => ({
      ...r,
      name: r.type === 'folder' ? r.label : r.displayKey,
      kind: r.type === 'folder' ? 'folder' : isVideo(r.contentType) ? 'video' : 'image',
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
        filterGroups={[{ label: 'Kind', key: 'kind', values: ['image', 'video', 'folder'] }]}
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
      <PathBar rows={rows} />
    </>
  )
}

/* The lightbox is MediaViewer — the DS already has ONE fullscreen paged viewer
 * and this is not a second one. Use / Copy URL ride its `actions` slot. */
function LibraryViewer({ index, onIndexChange, onClose, onPick }) {
  const { files, mediaUrl } = useMediaLibrary()
  const [copied, copy] = useCopy()

  const media = files.map((o) => ({
    url: mediaUrl(o.key),
    alt: fileName(o.key),
    kind: isVideo(o.contentType) ? 'video' : 'image',
    caption: `${fileName(o.key)} · ${formatSize(o.size)}`,
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
          {onPick && <Button size="sm" onClick={() => onPick(files[i])}>Use</Button>}
          <Button variant="secondary" size="sm" onClick={() => copy(item.url)}>
            {copied === item.url ? 'Copied' : 'Copy URL'}
          </Button>
        </>
      )}
    />
  )
}

function PickerShell({ onClose, onPick }) {
  const { files, mediaUrl } = useMediaLibrary()
  const [viewerIndex, setViewerIndex] = useState(null)

  const pick = (o) => {
    onPick?.(mediaUrl(o.key), { contentType: o.contentType })
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

      {viewerIndex !== null && files[viewerIndex] && (
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
 * @param {string}   accept   'image' | 'video' | 'all'
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
  const { files, mediaUrl } = useMediaLibrary()
  const [viewerIndex, setViewerIndex] = useState(null)

  const pick = onSelect ? (o) => onSelect(mediaUrl(o.key), { contentType: o.contentType }) : undefined

  return (
    <div className="kol-media-browser">
      <LibraryChrome onOpen={setViewerIndex} onPick={pick} />

      {viewerIndex !== null && files[viewerIndex] && (
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
