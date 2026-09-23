import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import formatSize from '../utilities/formatSize.js'
import { Icon } from '@kolkrabbi/kol-icons'
import Button from '../atoms/Button.jsx'
import Divider from '../atoms/Divider.jsx'
import Input from '../atoms/Input.jsx'
import IconFrame from '../atoms/IconFrame.jsx'
import ActionButton from '../atoms/ActionButton.jsx'
import SizeOrDownload from '../atoms/SizeOrDownload.jsx'
import ToggleCheckbox from '../atoms/ToggleCheckbox.jsx'
import ViewToggle from '../atoms/ViewToggle.jsx'
import Dropdown from '../molecules/Dropdown.jsx'
import ContentCard from '../molecules/ContentCard.jsx'
import MediaTile from '../molecules/MediaTile.jsx'
import ContentRow from '../molecules/ContentRow.jsx'
import SortControls from '../molecules/SortControls.jsx'
import SearchInput from '../molecules/SearchInput.jsx'
import MobileTabBar, { TABBAR_H } from '../molecules/MobileTabBar.jsx'
import { MenuItem, MenuDropdownItem, MenuDropdownDivider } from '../molecules/MenuItem.jsx'
import { Tooltip } from '../utilities/Popover.jsx'
import ContextMenu, { useContextMenu } from '../utilities/ContextMenu.jsx'
import useMarquee from '../hooks/useMarquee.js'
import KindPreview from '../molecules/KindPreview.jsx'
import AudioSheet from '../molecules/AudioSheet.jsx'
import VideoSheet from '../molecules/VideoSheet.jsx'
import QuickLookFrame from '../molecules/QuickLookFrame.jsx'
import { formatLength } from '../molecules/AudioPreview.jsx'
import FullscreenOverlay from '../utilities/FullscreenOverlay.jsx'
import { useModal } from '../molecules/Modal.jsx'
import ContentFilters from './ContentFilters.jsx'
import ShellSearchOverlay from './ShellSearchOverlay.jsx'
import ColumnBrowser, { isFileDrag, Preview as ColumnPreview, SelectionPreview } from './ColumnBrowser.jsx'
import SettingsPanel, { LabeledControlSection, SettingsRow, SettingsSwitch, SettingsChoice, SettingsMulti, SettingsFooter } from './SettingsPanel.jsx'
import { kindOf, extOf, KIND_LABEL, KINDS, DEFAULT_KINDS, isSystemFile, isSegment, groupSegments, groupVariants, posterFor, partition } from '../utilities/mediaKinds.js'
import { nearestRatio } from '../utilities/ratios.js'

/* taxonomy-ok: organism — the two media pages composed of DS parts. */

/**
 * MediaLibrary's two PAGES — kol-r2b2's app cut in two (MediaLibraryPages,
 * 2026-08-27; user: "wouldn't it make sense to have these much newer components
 * available in library?" — and the split, ruled the same hour: "one page for the
 * content filters, one page for folder/files, and a local gallery. Bucket is a
 * control, not a page"):
 *
 *   MediaLibraryBrowse   `variant="browse"`  — r2b2's header (the bucket Dropdown,
 *                        a lock when read-only, settings) · the crumb line with the
 *                        ROW | COLUMN toggle · ColumnBrowser (or folder rows) on the
 *                        flat key space · the count line
 *   MediaLibraryLibrary  `variant="library"` — r2b2's FileList wall, promoted
 *                        verbatim minus the app wiring: ContentFilters (FILES ·
 *                        kind chips · search · SELECT / FLAT · grid | list | off ·
 *                        SortControls · the selection bar while selecting), the
 *                        wall on ContentCard / ContentRow default, paging, the
 *                        per-bucket list cache, the stats line, the inspector
 *                        lightbox (image · VideoSheet · AudioSheet · DocPage via
 *                        KindPreview)
 *
 * Both take the injected `client` (`{ listMedia, mediaUrl, proxied?, buckets? }`
 * — ARCHITECTURE §3 stands: never imported) and render READ-ONLY unless the
 * client carries the write seams (`deleteObject` · `renameObject` · `downloadUrl`
 * — the admin app's; brand's read client shows none). Buckets come from
 * `client.buckets()` (kol-media-client ≥0.2.0); a client with none is one bucket
 * and no dropdown. Settings are kol-r2b2's per-bucket model (`SETTINGS_BASE`),
 * controlled through `settings` / `onSettingsChange` so a consumer persists them.
 */

/* THE ROW VIEW'S COLUMNS (user 2026-09-22). OFF by default and `rowColumns` turns them on: with
 * them off a row is a name, and every fact about it is one click away in the preview. On, the
 * header and both row kinds read these same widths — drag a header divider and both move — and the
 * values sit LEFT in their column, as the reference draws them. */
const ROW_COL_DEFAULTS = { date: 96, size: 80 }
const ROW_COL_MIN = 56
const ROW_COL_MAX = 240
const rowColWidths = (settings) => ({ ...ROW_COL_DEFAULTS, ...(settings.rowColumnWidths ?? {}) })

/* ── the settings model — kol-r2b2's lib/settings.js BASE, verbatim ───────── */
export const ALL_KINDS = [...KINDS, 'segments', 'system']
export const SETTINGS_BASE = {
  kinds: [...DEFAULT_KINDS],
  flat: false,
  groupVariants: true,
  foldSegments: true,
  pageSize: 200,
  videoPreview: 'poster', // 'poster' | 'none' | 'autoload'
  layout: 'off', // 'off' | 'grid' | 'list' — off by default: the column view browses, cards load thumbnails
  folderView: 'columns', // 'rows' | 'columns'
  sortBy: 'name',
  sortDir: 'asc',
  columnHeight: 528, // px, or any CSS length — forwarded to ColumnBrowser `height` untouched
  columnWidths: {},
  rowPreview: true, // row view's preview pane beside the list (Finder's "Show preview")
  view: 'columns', // 'columns' | 'rows' | 'grid' | 'list' — the ONE view state (2026-09-22)
  filters: false, // the filter bar above the body; off until asked for
  rowColumns: false, // row view's Date/Size columns + their header; off, a row is just its name
  rowColumnWidths: { ...ROW_COL_DEFAULTS }, // px, dragged on the header's own dividers
}

/* THE FOUR VIEWS (the merge, user 2026-09-22: "they both just display files"). Columns and rows
 * walk the tree; grid and list are the same files as a wall. One switch, one surface, one listing —
 * `BROWSE · FILES` was two pages pretending to be two products. */
/* THREE, NOT FOUR (user 2026-09-23: *"list view is the same as row view now..so redundant"*). It
 * was: the wall's list is a row per file with a thumbnail, which is what the row view became the
 * moment it took the pane, the columns and the preview. A stored `list` lands on `rows`. */
const VIEW_OPTIONS = [
  { value: 'columns', label: 'Columns', icon: 'columns' },
  /* `rows` in the set is a BRANCH glyph, not a row stack — the tree list takes `row` (stacked
   * bands) and the file list the four rules of `view-list`. */
  { value: 'rows', label: 'Rows', icon: 'row' },
  { value: 'grid', label: 'Grid', icon: 'grid' },
]

const LAYOUT_OPTIONS = [
  { value: 'grid', label: 'Grid', icon: 'grid' },
  { value: 'list', label: 'List', icon: 'view-list' },
  { value: 'off', label: 'Off', icon: 'eye-off' },
]
/* the stack view the `···` switches (item 15) — the same two ColumnBrowser
 * carries below `md`, named as the references name them */
const STACK_VIEW_OPTIONS = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Icons' },
]

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'date', label: 'Date' },
  { value: 'size', label: 'Size' },
  { value: 'kind', label: 'Kind' },
]

/* bytes → weight: `utilities/formatSize` since 0.178.0 — one copy, exported */
/* the pages' shared date default. Named `default*` because BOTH pages now take
 * a `formatDate` prop, and a prop of the same name would shadow this into a TDZ
 * error at the destructure. */
const defaultFormatDate = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : '')
const isImage = (ct) => !!ct && ct.startsWith('image/')
const isVideo = (ct) => !!ct && ct.startsWith('video/')

function sortFiles(files, sortBy, sortDir) {
  const dir = sortDir === 'desc' ? -1 : 1
  return [...files].sort((a, b) => {
    if (sortBy === 'date') return dir * (new Date(a.uploaded) - new Date(b.uploaded))
    if (sortBy === 'size') return dir * (a.size - b.size)
    if (sortBy === 'kind') return dir * kindOf(a).localeCompare(kindOf(b)) || a.displayKey.localeCompare(b.displayKey)
    return dir * a.displayKey.localeCompare(b.displayKey)
  })
}

/* R2 has no real folders — "move" = rewrite the key with a folder prefix */
const moveKey = (key, prefix, folder) => {
  const clean = folder.replace(/^\/+|\/+$/g, '').trim()
  const rel = prefix ? key.slice(prefix.length) : key
  return `${prefix}${clean}/${rel}`
}

/* ── ONE hook: the bucket, its list, its settings ───────────────────────────
 * Lists from root and partitions client-side so folder counts are right; the
 * result carries the refresh key it answered so `loading` is derived. A
 * per-bucket cache makes switching back instant while the fetch replaces it. */
function useBucketLibrary({ client, bucket, defaults, settings: controlled, onSettingsChange, refreshKey = 0 }) {
  const buckets = useMemo(() => client?.buckets?.() ?? [], [client])
  const bucketMeta = buckets.find((b) => b.id === bucket) ?? buckets[0] ?? { id: null, label: '', writable: false }
  const bucketId = bucketMeta.id
  const [own, setOwn] = useState(() => ({ ...SETTINGS_BASE, ...(defaults?.[bucketId] ?? defaults ?? {}) }))
  const settings = controlled ?? own
  const setSettings = (next) => {
    if (next === null) { const back = { ...SETTINGS_BASE, ...(defaults?.[bucketId] ?? defaults ?? {}) }; if (!controlled) setOwn(back); onSettingsChange?.(back); return }
    if (!controlled) setOwn(next)
    onSettingsChange?.(next)
  }
  const [loaded, setLoaded] = useState({ key: null, bucket: null, objects: [], error: null })
  const [cache, setCache] = useState({})
  useEffect(() => {
    if (!client) return undefined
    let cancelled = false
    const controller = new AbortController()
    client.listMedia('', { signal: controller.signal, bucket: bucketId ?? undefined })
      .then((objs) => { if (cancelled) return; setLoaded({ key: refreshKey, bucket: bucketId, objects: objs, error: null }); setCache((c) => ({ ...c, [bucketId]: objs })) })
      .catch((e) => { if (!cancelled && e.name !== 'AbortError') setLoaded({ key: refreshKey, bucket: bucketId, objects: [], error: e.message }) })
    return () => { cancelled = true; controller.abort() }
  }, [client, refreshKey, bucketId])
  const ready = loaded.key === refreshKey && loaded.bucket === bucketId
  const objects = ready ? loaded.objects : (cache[bucketId] ?? [])
  const setObjects = (fn) => setLoaded((prev) => ({ ...prev, objects: fn(prev.objects) }))
  const error = ready ? loaded.error : null
  const mediaUrl = (key) => client?.mediaUrl?.(key, bucketId ?? undefined) ?? key
  const downloadUrl = (key) => client?.downloadUrl?.(key, bucketId ?? undefined) ?? mediaUrl(key)
  const writable = !!bucketMeta.writable && !!(client?.deleteObject || client?.renameObject)
  return { buckets, bucketMeta, bucketId, settings, setSettings, objects, setObjects, error, ready, mediaUrl, downloadUrl, writable }
}

/* ── shared pieces, kol-r2b2's ─────────────────────────────────────────────── */

/* The frame is square until the file reports its size, then snaps to its nearest preset. */
function ImageFrame({ src }) {
  const [ratio, setRatio] = useState('1 / 1')
  return (
    <div className="w-full rounded overflow-hidden flex items-center justify-center" style={{ aspectRatio: ratio }}>
      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" onLoad={(e) => setRatio(nearestRatio(e.target.naturalWidth, e.target.naturalHeight))} />
    </div>
  )
}


/* `depth` indents a row under the folder it was expanded from; `expanded`/`onToggle` draw the
 * disclosure twisty. A folder row without `onToggle` keeps the old behaviour exactly — one chevron
 * that navigates — so nothing that already renders these moves. */
function FolderRow({ name, onClick, onDoubleClick, depth = 0, expanded, onToggle, meta, cols, onContextMenu, drag, dropFiles, selected, current, markKey }) {
  const [over, setOver] = useState(false)
  /* A FOLDER IS A DROP TARGET. `drag` carries the page's move verb and the path this row is; the
   * row highlights only while something is actually over it, so an accidental hover reads as
   * nothing. Without `drag` every handler below is undefined and the row is exactly what it was. */
  /* `dropFiles(files)` is the OS half: desktop files dropped here go to the consumer's upload. */
  const takesFiles = (e) => dropFiles && isFileDrag(e)
  /* A CLICK TAKES THE WHOLE ROW, A DRAG STARTS WHERE YOU PRESSED (user 2026-09-23: *"the example
   * I used before … was more about the ability to make a marquee selection, not to make it difficult
   * to select row items"*). Click, double-click and ⌘/⇧-click land anywhere on the row. The icon and
   * name (`data-hit`) carry the drag-to-move and the pointer; a press-and-drag anywhere else on the
   * row draws the marquee (`data-hit-zone`, `useMarquee`). The DROP stays on the whole row. */
  const hitDrag = drag ? { draggable: true, onDragStart: (e) => { e.stopPropagation(); drag.onDragStart(e, drag.path) } } : {}
  const dropProps = drag || dropFiles ? {
    onDragOver: (e) => { if (takesFiles(e) || (drag && !isFileDrag(e) && drag.canDrop(drag.path))) { e.preventDefault(); setOver(true) } },
    onDragLeave: () => setOver(false),
    onDrop: (e) => {
      e.preventDefault(); e.stopPropagation(); setOver(false)
      if (takesFiles(e)) dropFiles(e.dataTransfer.files)
      else if (drag && !isFileDrag(e)) drag.onDrop(drag.path)
    },
  } : {}
  return (
    /* THE COLUMN BROWSER'S ROW (user 2026-09-22): `kol-column-browser-row` carries the 4px pill
     * inset, the selected fill and the drop fill; no divider, as the columns have none. */
    <li onContextMenu={onContextMenu} {...dropProps} data-marquee-key={markKey} data-hit-zone data-drop-over={over || undefined} className={`kol-column-browser-row flex items-center gap-3 py-2 px-3 transition-colors${selected ? ' is-selected' : ''}${current ? ' is-current' : ''}`} style={{ paddingLeft: depth * 20 + 12 }} onClick={onClick} onDoubleClick={onDoubleClick}>
      {onToggle ? (
        <button type="button" aria-label={expanded ? `Collapse ${name}` : `Expand ${name}`} aria-expanded={!!expanded}
          onClick={(e) => { e.stopPropagation(); onToggle() }}
          className="w-4 h-4 shrink-0 flex items-center justify-center text-fg-32 hover:text-fg-default transition-transform"
          style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}>
          <Icon name="chevron-right" size={12} />
        </button>
      ) : <span className="w-4 shrink-0" />}
      {/* THE FOLDER GLYPH IS THE ONE ICON LEFT, so it fills its box (user 2026-09-23: *"only folder
          should use icon, and it should be bigger"*). Every other kind now renders its own bytes. */}
      <span data-hit {...hitDrag} className="kol-row-hit flex items-center gap-3 min-w-0">
        <span className="w-8 h-8 shrink-0 flex items-center justify-center text-oq-48"><Icon name="folder" size={26} /></span>
        {/* NO TRAILING SLASH (user 2026-09-22). `partition` hands folders back as `audio/` because a
            slash is what marks one in a flat key space; that is storage's spelling, not a label, and
            `ColumnBrowser` has always stripped it. The glyph says "folder". */}
        <span className="kol-mono-12 min-w-0 truncate text-fg-default">{name.replace(/\/$/, '')}</span>
      </span>
      <span className="flex-1" />
      {/* THE FOLDER'S COUNT SITS IN THE DATE COLUMN and the size column takes a dash — the columns
          line up or the header above them is a lie. The trailing chevron went with them: it
          promised a click that opens, and a click now SELECTS (opening is a double-click). */}
      {cols && <>
        <span className="kol-mono-12 text-fg-32 shrink-0 truncate" style={{ width: cols.date }}>{meta}</span>
        <span className="kol-mono-12 text-fg-24 shrink-0 truncate" style={{ width: cols.size }}>—</span>
      </>}
    </li>
  )
}

/* One expanded level, drawn inline under its folder, recursing for anything expanded beneath it —
 * the disclosure behaviour a list view is expected to have. Depth only indents; the data comes from
 * the same `rowLevel` the top level uses, so an expanded branch cannot disagree with the columns. */
function RowSubtree({ level, depth, rowLevel, expanded, onToggle, onOpenFolder, onPickFolder, onOpenFile, onPickFile, formatDate, folderMeta, thumbnailFor, cols, onRowContextMenu, dragFor, dropFilesTo, pickedKey, currentKey, selectRow, order, selectedKeys }) {
  const { folders, files } = rowLevel(level)
  return (
    <>
      {folders.map((f) => {
        const path = level + f
        const open = expanded.has(path)
        return (
          <Fragment key={path}>
            <FolderRow
              name={f} depth={depth} expanded={open}
              markKey={path}
              meta={folderMeta?.(path) || undefined}
              cols={cols}
              onToggle={() => onToggle(path)}
              onContextMenu={(e) => onRowContextMenu?.(e, { type: 'folder', path, targets: selectedKeys?.has(path) ? [...selectedKeys] : [path] })}
              drag={dragFor?.(path)}
              dropFiles={dropFilesTo?.(path)}
              selected={pickedKey === path || !!selectedKeys?.has(path)}
              current={currentKey === path}
              /* SELECTION IS THE SAME HERE AS AT THE ROOT (user 2026-09-23). These rows had no
               * `selectRow` at all, so ⌘-click picked instead of adding — which is why a drag
               * carried one item however many looked lit. */
              onClick={(e) => { if (!selectRow?.(path, e, order)) onPickFolder(path) }}
              onDoubleClick={() => onOpenFolder(path)}
            />
            {open && <RowSubtree
              level={path} depth={depth + 1} rowLevel={rowLevel} expanded={expanded} onToggle={onToggle}
              onOpenFolder={onOpenFolder} onPickFolder={onPickFolder} onOpenFile={onOpenFile} onPickFile={onPickFile} onRowContextMenu={onRowContextMenu} dragFor={dragFor} dropFilesTo={dropFilesTo} pickedKey={pickedKey} currentKey={currentKey} cols={cols}
              selectRow={selectRow} order={order} selectedKeys={selectedKeys}
              formatDate={formatDate} folderMeta={folderMeta} thumbnailFor={thumbnailFor}
            />}
          </Fragment>
        )
      })}
      {files.map((o) => (
        <FileRow key={o.key} o={o} depth={depth} formatDate={formatDate} thumb={thumbnailFor?.(o)} cols={cols}
          selected={pickedKey === o.key || !!selectedKeys?.has(o.key)}
          onContextMenu={(e) => onRowContextMenu?.(e, { type: 'file', path: o.key, o, targets: selectedKeys?.has(o.key) ? [...selectedKeys] : [o.key] })}
          drag={dragFor?.(o.key)}
          onClick={(e) => { if (!selectRow?.(o.key, e, order)) onPickFile(o) }}
          onDoubleClick={() => onOpenFile(o)} />
      ))}
    </>
  )
}

/* The file half of the row view. Row view listed FOLDERS ONLY and dropped `files` on the floor, so
 * `#img/` drew two rows where the column browser drew four — the two folders, the empty folder the
 * columns knew about, and a file. A list view that cannot show a file is not a list view. */
function FileRow({ o, onClick, onDoubleClick, depth = 0, formatDate, thumb, cols, onContextMenu, drag, selected, markKey }) {
  const dragProps = drag ? { draggable: true, onDragStart: (e) => { e.stopPropagation(); drag.onDragStart(e, o.key) } } : {}
  return (
    <li onContextMenu={onContextMenu} data-marquee-key={markKey ?? o.key} data-hit-zone className={`kol-column-browser-row flex items-center gap-3 py-2 px-3 transition-colors${selected ? ' is-selected' : ''}`} style={{ paddingLeft: depth * 20 + 12 }} onClick={onClick} onDoubleClick={onDoubleClick}>
      <span className="w-4 shrink-0" />
      {/* the hit — icon and name, as in the folder row above */}
      <span data-hit {...dragProps} className="kol-row-hit flex items-center gap-3 min-w-0">
        <span className="w-8 h-8 shrink-0 flex items-center justify-center text-oq-48 overflow-hidden rounded">
          {thumb ?? <Icon name={kindOf(o) === 'image' ? 'image' : 'file'} size={18} />}
        </span>
        <span className="kol-mono-12 min-w-0 truncate text-fg-default">{o.displayKey ?? o.key.split('/').pop()}</span>
      </span>
      <span className="flex-1" />
      {cols && <>
        <span className="kol-mono-12 text-fg-32 shrink-0 truncate" style={{ width: cols.date }}>{formatDate?.(o.uploaded)}</span>
        <span className="kol-mono-12 text-fg-32 shrink-0 truncate" style={{ width: cols.size }}>{formatSize(o.size)}</span>
      </>}
    </li>
  )
}

/* A FOLDER HAS A PREVIEW TOO (user 2026-09-22, against Finder: selecting a folder fills the pane).
 * The columns never needed one — stepping into a folder IS its preview there — so this is the row
 * view's, and it is the page's rather than ColumnBrowser's because the counts come off the same
 * `objects` the page already holds. Same shell as the file preview, so the pane never shifts. */
function FolderPreview({ path, objects, width, formatDate }) {
  const inside = objects.filter((o) => o.key.startsWith(path))
  const bytes = inside.reduce((n, o) => n + (o.size ?? 0), 0)
  const last = inside.reduce((t, o) => (o.uploaded && o.uploaded > t ? o.uploaded : t), '')
  const facts = [
    ['Kind', 'folder'],
    ['Items', `${inside.length}`],
    ['Size', formatSize(bytes)],
    ...(last ? [['Newest', formatDate(last) || '—']] : []),
  ]
  return (
    <div className="kol-column-browser-preview shrink-0 overflow-y-auto p-4 flex flex-col gap-4" style={{ width }}>
      <div className="w-full aspect-square bg-oq-04 rounded flex items-center justify-center">
        <Icon name="folder" size={64} className="text-oq-48" />
      </div>
      <p className="kol-mono-12 text-fg-default break-all">{path.replace(/\/$/, '').split('/').pop()}</p>
      <dl className="flex flex-col gap-1">
        {facts.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 kol-mono-12">
            <dt className="text-fg-48">{k}</dt>
            <dd className="text-fg-default text-right break-all">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/* THE COLUMN HEADER — Name · Date · Size, each one the sort control for its own column (user
 * 2026-09-22). Unlabelled meta at the end of a row is a number nobody can read a column of; a
 * header names them AND gives them the one behaviour a labelled column implies. Clicking the
 * active column flips the direction, which is what every file manager does. It writes the SAME
 * `sortBy`/`sortDir` the files wall's own SortControls write, so the two views cannot disagree.
 *
 * FINDER'S SHAPE, on the user's read of it (2026-09-22): the header sits ABOVE the pane rather
 * than inside it — it labels the list, it is not a row of it — the labels are sentence case, and a
 * hairline divides each column from the one before it. `PAD` is the rows' own inset (the pane's
 * 1px border + the row pill's 4px margin + the row's 12px padding), so a label lands over the
 * column it names; it is derived here rather than typed, because those three numbers are the ones
 * that move. */
const ROW_PAD = 1 + 4 + 12

function RowHeader({ sortBy = 'name', sortDir = 'asc', onSort, width, cols, onResize }) {
  const label = (key, text) => {
    const active = sortBy === key
    return (
      <button type="button" onClick={() => onSort(key, active && sortDir === 'asc' ? 'desc' : 'asc')}
        aria-sort={active ? (sortDir === 'desc' ? 'descending' : 'ascending') : 'none'}
        className={`kol-helper-12 cursor-pointer inline-flex items-center gap-1 w-full transition-colors ${active ? 'text-fg-default' : 'text-fg-48 hover:text-fg-default'}`}>
        {text}
        {active && <Icon name={sortDir === 'desc' ? 'arrow-up' : 'arrow-down'} size={9} />}
      </button>
    )
  }
  /* EACH DIVIDER RESIZES THE COLUMN TO ITS RIGHT — those are the fixed ones; Name takes whatever is
   * left, so there is nothing to drag on its side. Pointer capture, no library, same gesture the
   * column browser's own edges use. */
  const handle = (key) => (
    <span
      role="separator" aria-orientation="vertical" aria-label={`Resize ${key} column`}
      className="cursor-col-resize"
      /* inline, not utilities: it must be OUT OF FLOW or it pushes the label 8px off the column
         it names — which is exactly what it did */
      style={{ position: 'absolute', top: 0, bottom: 0, left: -4, width: 8 }}
      onPointerDown={(e) => {
        e.preventDefault()
        e.currentTarget.setPointerCapture(e.pointerId)
        const startX = e.clientX
        const base = cols[key]
        const move = (ev) => onResize(key, Math.max(ROW_COL_MIN, Math.min(ROW_COL_MAX, Math.round(base - (ev.clientX - startX)))))
        const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
      }}
    />
  )
  const column = (key, text) => (
    /* no left padding: the label shares its column's left edge with the values under it */
    <div key={key} className="relative shrink-0 border-l" style={{ width: cols[key], borderColor: 'var(--kol-oq-08)' }}>
      {handle(key)}
      {label(key, text)}
    </div>
  )
  return (
    /* the right padding carries TWO extra pixels of borders — the pane's own and the cell's divider
       — which is what a label sitting two pixels right of its column looks like */
    <div className="flex items-center gap-3 shrink-0" style={{ width, paddingLeft: ROW_PAD, paddingRight: ROW_PAD + 2 }}>
      <span className="w-4 shrink-0" aria-hidden="true" />
      <span className="w-8 shrink-0" aria-hidden="true" />
      <span className="flex-1 min-w-0">{label('name', 'Name')}</span>
      {column('date', 'Date')}
      {column('size', 'Size')}
    </div>
  )
}

/**
 * MediaInspector — the full-screen viewer for one file in a set: image, video
 * (scrubbable, audio on), audio, or a document page, in one `QuickLookFrame`, with
 * prev / next fixed at the viewport edges.
 *
 * PUBLIC SINCE 2026-09-04 (user ruling, off `ColumnBrowserMobileViews`: the
 * mobile viewers are the DS's). It already existed and already rendered both
 * of the views that ticket drew — it was simply module-private, so every
 * consumer that needed a phone viewer had to hand-roll one, which is the
 * outcome the ticket named. Same unweld as the rulers a day earlier: the
 * component was right, its visibility was not.
 *
 * Shell is `FullscreenOverlay` (scrim, Escape, backdrop dismiss, scroll lock).
 * The stage is kol-r2b2's MediaLightbox verbatim. Not `MediaViewer`, which is a
 * gallery — muted, looping, no controls, image and video only.
 *
 * @param {Array<Object>} files - The set being paged through
 * @param {number} index - Which one is open
 * @param {Function} onClose - Dismiss
 * @param {Function} onPrev - Previous; also ArrowLeft
 * @param {Function} onNext - Next; also ArrowRight
 * @param {Function} mediaUrl - `(key) => url` — the consumer's media resolver
 * @param {Function} downloadUrl - `(key) => url` for the download control
 * @param {Set|Object} keySet - The bucket's key set, used to find a video's poster
 * @param {boolean} showNav - ‹ › and n / N in the header (default on); off when not paging a selection
 */
export function MediaInspector({ files, index, onClose, onPrev, onNext, mediaUrl, downloadUrl, keySet, showNav = true }) {
  const o = files[index]
  const [dims, setDims] = useState(null)
  /* the window's size survives paging — Finder keeps it — so it lives here, not in the frame,
   * which remounts whenever the kind changes */
  const [size, setSize] = useState(null)
  const shownDims = dims && dims.key === o?.key ? dims : null
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'ArrowLeft') onPrev(); if (e.key === 'ArrowRight') onNext() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onPrev, onNext])
  if (!o) return null
  const kind = kindOf(o)
  const poster = kind === 'video' ? posterFor(o.key, keySet) : null
  /* ONE WINDOW FOR EVERY KIND (user 2026-09-23: *"put them in a container LIKE FINDER"*). The
   * name, the facts and the download ride the window's header; the transport, when there is one,
   * its footer. They used to be a caption line under whatever the kind drew. */
  const facts = [
    formatSize(o.size),
    shownDims?.w && `${shownDims.w} × ${shownDims.h} px`,
    shownDims?.len && formatLength(shownDims.len),
  ].filter(Boolean).join(' · ')
  const frame = {
    title: o.displayKey ?? o.key.split('/').pop(),
    meta: facts,
    onClose,
    /* ‹ › and n / N only when the window pages a SELECTION (user 2026-09-23: *"I only selected one
     * file, why am I getting the chevrons"*). ← → still step, as Finder's do; the header does not
     * advertise a set you did not make. `showNav` — the page passes whether several are selected. */
    nav: showNav ? { index, total: files.length, onPrev, onNext } : undefined,
    size,
    onResize: setSize,
    /* THE TWO READ VERBS (user 2026-09-23): Copy URL beside Download — the window is the one place
     * besides the right-click menu that carries them */
    /* THE CLOSE BUTTON'S IDIOM (user 2026-09-23): a filled container read as a second surface on
     * the header; bare at rest with a wash on hover, `sm` so the glyphs sit with the 12px text. */
    actions: (
      <span className="flex items-center gap-1">
        <CopyAction label="Copy URL" text={mediaUrl(o.key)} />
        <Tooltip label="Download">
          <Button variant="nav" size="sm" iconOnly="download" href={downloadUrl(o.key)} download={o.key.split('/').pop()} aria-label="Download" />
        </Tooltip>
      </span>
    ),
  }
  return (
    /* QUICK LOOK DIMS, it does not black out — you keep the list you came from in view */
    <FullscreenOverlay open onClose={onClose} closeButton={false} scrim>
      {isImage(o.contentType) ? (
        <QuickLookFrame {...frame}>
          <img src={mediaUrl(o.key)} alt={o.displayKey} className="kol-quicklook-media" onLoad={(e) => setDims({ key: o.key, w: e.target.naturalWidth, h: e.target.naturalHeight })} />
        </QuickLookFrame>
      ) : isVideo(o.contentType) ? (
        <VideoSheet key={o.key} src={mediaUrl(o.key)} poster={poster ? mediaUrl(poster) : undefined} onMeta={(m) => setDims({ key: o.key, ...m })} frame={frame} />
      ) : kind === 'audio' ? (
        <AudioSheet key={o.key} src={mediaUrl(o.key)} ext={extOf(o.key)} onDuration={(len) => setDims({ key: o.key, len })} frame={frame} />
      ) : (
        <QuickLookFrame {...frame}>
          <KindPreview o={o} fit="sheet" urlOf={(x) => mediaUrl(x.key)} poster={poster ? mediaUrl(poster) : undefined} />
        </QuickLookFrame>
      )}
    </FullscreenOverlay>
  )
}

/* Display settings for the ACTIVE bucket — kol-r2b2's drawer wiring on the DS
 * organism (the composition the user locked 2026-08-27). Every control sets a
 * default, never a gate. */
function MediaSettings({ bucketMeta, settings, onChange, onReset, onClose, profile, settingsFooter }) {
  const set = (patch) => onChange({ ...settings, ...patch })
  const toggleKind = (k) => set({ kinds: settings.kinds.includes(k) ? settings.kinds.filter((x) => x !== k) : [...settings.kinds, k] })
  const noVariants = profile.variantSets === 0
  const noSegments = profile.segments === 0
  return (
    <SettingsPanel variant="drawer" title="Display settings" onClose={onClose} footer={<SettingsFooter onReset={onReset} resetLabel="Reset preferences">{settingsFooter}</SettingsFooter>}>
      <LabeledControlSection label="Structure" rowGap={1} divided>
        <SettingsRow label="Columns" hint="Finder-style columns instead of folder rows">
          <SettingsSwitch label="Columns" on={(settings.folderView ?? 'rows') === 'columns'} onChange={(v) => set({ folderView: v ? 'columns' : 'rows' })} />
        </SettingsRow>
        <SettingsRow label="Preview" hint="the picked file beside the rows">
          <SettingsSwitch label="Preview" on={settings.rowPreview ?? true} onChange={(v) => set({ rowPreview: v })} />
        </SettingsRow>
        {/* NOT "Columns" — that switch three rows up means Finder's column browser. These are the
            row view's date/size FIELDS, which is what the user calls them. */}
        <SettingsRow label="Fields" hint="date and size beside each row, with a sort header">
          <SettingsSwitch label="Fields" on={!!settings.rowColumns} onChange={(v) => set({ rowColumns: v })} />
        </SettingsRow>
        <SettingsRow label="Flat" hint="ignore folders, show the whole subtree">
          <SettingsSwitch label="Flat" on={settings.flat} onChange={(v) => set({ flat: v })} />
        </SettingsRow>
        <SettingsRow label="Group resolutions" hint={noVariants ? 'no resolution sets in this bucket' : `${profile.variantSets} sets — previews the smallest file`}>
          <SettingsSwitch label="Group resolutions" on={settings.groupVariants} onChange={(v) => set({ groupVariants: v })} disabled={noVariants} disabledHint="nothing to group here" />
        </SettingsRow>
        <SettingsRow label="Fold HLS segments" hint={noSegments ? 'no segments in this bucket' : `${profile.segments} segments into stream rows`}>
          <SettingsSwitch label="Fold HLS segments" on={settings.foldSegments} onChange={(v) => set({ foldSegments: v })} disabled={noSegments} disabledHint="nothing to fold here" />
        </SettingsRow>
      </LabeledControlSection>
      <LabeledControlSection label="Loading" divided>
        <SettingsRow label="Kinds" align="fill">
          <SettingsMulti options={ALL_KINDS.map((k) => ({ value: k, label: KIND_LABEL[k] || k }))} selected={settings.kinds} onToggle={toggleKind} noun="kinds" />
        </SettingsRow>
        <SettingsRow label="Page size" hint="entries mounted at once" align="fill">
          <SettingsChoice options={[{ value: 100, label: '100' }, { value: 200, label: '200' }, { value: 500, label: '500' }, { value: 0, label: 'All' }]} value={settings.pageSize} onChange={(v) => set({ pageSize: v })} />
        </SettingsRow>
        <SettingsRow label="Video preview" hint="poster uses the sibling image; autoload fetches the file" align="fill">
          <SettingsChoice options={[{ value: 'poster', label: 'Poster' }, { value: 'none', label: 'None' }, { value: 'autoload', label: 'Autoload' }]} value={settings.videoPreview} onChange={(v) => set({ videoPreview: v })} />
        </SettingsRow>
      </LabeledControlSection>
      <LabeledControlSection label="Layout" divided>
        <SettingsRow label="View" align="fill">
          <SettingsChoice options={[{ value: 'off', label: 'Off' }, { value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]} value={settings.layout} onChange={(v) => set({ layout: v })} />
        </SettingsRow>
        <SettingsRow label="Sort" align="fill">
          <SettingsChoice options={SORT_OPTIONS} value={settings.sortBy} onChange={(v) => set({ sortBy: v })} />
        </SettingsRow>
        <SettingsRow label="Direction" align="fill">
          <SettingsChoice options={[{ value: 'asc', label: '↓ Asc' }, { value: 'desc', label: '↑ Desc' }]} value={settings.sortDir} onChange={(v) => set({ sortDir: v })} />
        </SettingsRow>
      </LabeledControlSection>
      {void bucketMeta}
    </SettingsPanel>
  )
}

/* ── the header — bucket Dropdown · lock / the app's actions · settings ────
 *
 * THE ROW HAS TO GIVE AT 390 (StackModeChromeAndAncestors §4, kol-r2b2
 * 2026-09-04). The title was `white-space: normal` in a box the fixed `w-48`
 * dropdown had squeezed to 48px, so `KOL-R2B2` wrapped MID-TOKEN into two
 * 36px lines — 72px of header spent breaking a word in half. Neither reference
 * wraps a title.
 *
 * The dropdown's 192px was the actual cost: 192 of 390 before the title, the
 * lock and the gear have had any. It keeps that width from `md` up, where the
 * room exists, and shrinks below it. The title never wraps — it takes the room
 * left and ellipsises, which is honest where a mid-token break is not.
 *
 * `headerActions` is a REAL slot and it is narrow here: at 390 the row holds
 * the dropdown, the gear, and about ONE consumer icon. kol-r2b2 added a second
 * and pushed the gear off the right edge — they resolved it by SWAPPING a
 * control below `md` rather than adding one, which is the pattern to copy. If a
 * consumer needs more than one at this width, it belongs in a sheet, not here. */
/* A copy control in the header's idiom (the close button's: bare, a wash on hover); the tooltip says it worked. */
function CopyAction({ label, text }) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return undefined
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])
  return (
    <Tooltip label={copied ? 'Copied' : label}>
      <Button variant="nav" size="sm" iconOnly={copied ? 'check' : 'copy'} aria-label={label}
        onClick={() => { navigator.clipboard?.writeText(text); setCopied(true) }} />
    </Tooltip>
  )
}

/* THE CURRENT CRUMB COPIES THE PATH (user 2026-09-23: *"could we make a hover click to copy path?
 * … just click and it copies to clipboard, maybe popover tooltip appears 'path copied'"*). It was
 * a button navigating to where you already were; now it is the one crumb that does something new.
 * The other crumbs still navigate. */
function CopyCrumb({ label, path, className }) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return undefined
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])
  return (
    <Tooltip label={copied ? 'Path copied' : 'Copy path'}>
      <button type="button" className={className} onClick={() => { navigator.clipboard?.writeText(path); setCopied(true) }}>{label}</button>
    </Tooltip>
  )
}

/* THE TRASH — what delete moved aside, newest first. BUILT FROM PARTS THAT EXIST (user 2026-09-23:
 * *"follow an example, dont reinvent the wheel"*): the settings drawer's title, a
 * list in the column browser's own rows, and `SettingsFooter` for Empty trash.
 *
 * NO BUTTONS ON THE ROWS (user 2026-09-23: *"remove both x and restore and use context menu for
 * those items, as single or multiple selection"*). The items select the way files do — click, ⌘ to
 * add, ⇧ for a run — and right-click offers Restore and Delete forever for the row, or for the
 * whole selection when the row is in it. Delete forever asks first: it is the one verb here that
 * cannot be taken back. */
function TrashPanel({ trash, onClose, run, confirm }) {
  const items = trash.items ?? []
  const [sel, setSel] = useState(() => new Set())
  const anchor = useRef(null)
  const menu = useContextMenu()
  const pick = (e, id) => {
    const ids = items.map((t) => t.id)
    if (e.shiftKey && anchor.current) {
      const a = ids.indexOf(anchor.current)
      const b = ids.indexOf(id)
      setSel(new Set(ids.slice(Math.min(a, b), Math.max(a, b) + 1)))
      return
    }
    anchor.current = id
    if (e.metaKey || e.ctrlKey) setSel((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
    else setSel(new Set([id]))
  }
  const targetsFor = (id) => (sel.has(id) ? [...sel] : [id])
  const restore = (ids) => run(async () => { for (const id of ids) await trash.restore(id); setSel(new Set()) })
  const purge = async (ids) => {
    const n = ids.length
    if (confirm && !(await confirm(`Delete ${n === 1 ? 'this item' : `${n} items`} forever? This cannot be undone.`, { okLabel: 'Delete forever' }))) return
    run(async () => { for (const id of ids) await trash.purge(id); setSel(new Set()) })
  }
  return (
    <SettingsPanel variant="drawer" title="Trash" onClose={onClose}
      footer={items.length > 0 && trash.empty ? (
        <SettingsFooter>
          <Button variant="primary" size="sm" onClick={async () => {
            if (confirm && !(await confirm(`Empty the trash? ${items.length} item${items.length === 1 ? '' : 's'} will be gone for good.`, { okLabel: 'Empty trash' }))) return
            run(async () => { await trash.empty(); setSel(new Set()) })
          }}>Empty trash</Button>
        </SettingsFooter>
      ) : undefined}>
      {/* THE COLUMN BROWSER'S ROWS, as they are (user 2026-09-23: *"just USE WHAT COLUMN browser
        * uses. its literally a solved problem"*) — icon, name as spelled, the same selection fill. No
        * heading, no count: it is the trash, and the files are the content. */}
      <ul className="kol-column-browser-column flex flex-col">
        {items.map((t) => {
          const name = t.path.replace(/\/$/, '').split('/').pop()
          const icon = t.isFolder ? 'folder' : ({ image: 'image', video: 'video' })[kindOf({ key: t.path })] ?? 'file'
          return (
            <li key={t.id} className={`kol-column-browser-row flex items-center gap-3 py-2 px-3 cursor-pointer transition-colors${sel.has(t.id) ? ' is-selected' : ''}`}
              onClick={(e) => pick(e, t.id)}
              onContextMenu={(e) => { if (!sel.has(t.id)) { anchor.current = t.id; setSel(new Set([t.id])) } menu.openAt(e, { ids: targetsFor(t.id) }) }}>
              <span className="w-5 shrink-0 flex items-center justify-center text-oq-48"><Icon name={icon} size={icon === 'folder' ? 18 : 14} /></span>
              <span className="kol-mono-12 min-w-0 truncate">{name}</span>
            </li>
          )
        })}
      </ul>
      <ContextMenu menu={menu}>
        {(target) => {
          if (!target) return null
          const n = target.ids.length
          return (
            <>
              {trash.restore && <MenuDropdownItem iconLeft={<Icon name="refresh" size={14} />} onClick={() => restore(target.ids)}>{n > 1 ? `Restore ${n}` : 'Restore'}</MenuDropdownItem>}
              {trash.purge && <MenuDropdownItem iconLeft={<Icon name="trash" size={14} />} onClick={() => purge(target.ids)}>{n > 1 ? `Delete ${n} forever` : 'Delete forever'}</MenuDropdownItem>}
            </>
          )
        }}
      </ContextMenu>
    </SettingsPanel>
  )
}

function LibraryHeader({ title, buckets, bucketId, appRoot, onBucket, bucketMeta, writable, headerActions, onSettings, onTrash, onHome, headerTrailing }) {
  /* ONE BUCKET, NO DROPDOWN (user 2026-09-22) — a picker with one thing in it chooses nothing. */
  const options = buckets.length > 1 ? [{ value: 'all', label: `${title} · all` }, ...buckets.map((b) => ({ value: b.id, label: b.label }))] : []
  /* THE WORDMARK IS THE HOME BUTTON when `onHome` is given (user 2026-09-21: "it should reload,
   * like a home button"). The crumb row's root already did exactly this and the wordmark above it
   * did nothing — the one element every file manager makes clickable was the one that was inert.
   * Without the prop it stays a plain <h1>, so nothing existing changes. */
  return (
    <header className="flex items-baseline justify-between gap-4">
      {onHome ? (
        <button type="button" onClick={onHome}
          className="kol-sans-display-03 min-w-0 truncate text-left cursor-pointer transition-opacity hover:opacity-64"
          aria-label={`${title} — back to the top`}>{title}</button>
      ) : (
        <h1 className="kol-sans-display-03 min-w-0 truncate">{title}</h1>
      )}
      <div className="flex items-center gap-2 min-w-0">
        {options.length > 0 && <Dropdown className="min-w-0 max-w-[45vw] md:w-48 md:max-w-none" value={appRoot ? 'all' : bucketId} onChange={onBucket} options={options} />}
        {headerActions}
        {/* The DS's own `Tooltip` (utilities/Popover → `.kol-tooltip`), not a `title`
            attribute. These two were the only header chrome still handing the label to
            the browser, which drew its native box beside DS-styled ones. */}
        {!writable && bucketMeta.id && (
          <Tooltip label={`${bucketMeta.label} is read-only here`}>
            <IconFrame name="lock" variant="primary" size="sm" aria-label="Read-only" />
          </Tooltip>
        )}
        {/* THE TRASH (user 2026-09-23) — the failsafe for every delete. Search moved back to the crumb
            row, into the well beside the view switch. */}
        {onTrash && (
          <Tooltip label="Trash">
            <IconFrame name="trash" variant="primary" size="sm" onClick={onTrash} aria-label="Trash" />
          </Tooltip>
        )}
        <Tooltip label="Display settings">
          <IconFrame name="settings-01" variant="primary" size="sm" onClick={onSettings} aria-label="Display settings" />
        </Tooltip>
        {/* AFTER the icons, because the crumb row below reads `[icons] │ ROW COLUMN` and a text
          * switch in this surface sits to the RIGHT of its divider. Put before them it mirrored
          * the row directly beneath it. */}
        {headerTrailing}
      </div>
    </header>
  )
}

/* the profile — what the bucket holds; drives the chips and the settings' "nothing to fold" states */
const profileOf = (objects, rawFiles, systemCount) => ({
  variantSets: groupVariants(objects.map((o) => ({ ...o, displayKey: o.key }))).filter((g) => g.variants).length,
  segments: objects.filter((o) => isSegment(o.key)).length,
  kinds: { ...rawFiles.reduce((acc, o) => { acc[o.kind] = (acc[o.kind] || 0) + 1; return acc }, {}), ...(systemCount ? { system: systemCount } : {}) },
})

/* ══ BROWSE — folder / files ═══════════════════════════════════════════════ */
/* THE `···`'s SORT, pure and module-level so it is reachable by a check
 * (ColumnBrowserMobileViews item 15). Sorting was desktop-only chrome until
 * now — item 7 of the previous ticket hid the control cluster below `md` and
 * put nothing in its place, so on a phone sort could not be reached at all.
 *
 * NAME IS THE TIEBREAK IN EVERY MODE. Two files of equal size, or a bucket
 * whose objects carry no `uploaded`, otherwise come back in whatever order the
 * comparator happened to walk — a list that reshuffles between renders for no
 * reason the user did anything to cause. The tiebreak is deliberately NOT
 * reversed by `sortDir`: descending by size still reads A before B inside a
 * tie, which is what every file manager does. */
function sortObjects(objects, sortBy = 'name', sortDir = 'asc') {
  const nameOf = (o) => o.key.slice(o.key.lastIndexOf('/') + 1).toLowerCase()
  const val = {
    name: nameOf,
    date: (o) => o.uploaded ?? '',
    size: (o) => o.size ?? 0,
    kind: (o) => String(kindOf(o)),
  }[sortBy] ?? nameOf
  const dir = sortDir === 'desc' ? -1 : 1
  return [...objects].sort((m, n) => {
    const x = val(m), y = val(n)
    if (x === y) return nameOf(m) < nameOf(n) ? -1 : 1
    return (x < y ? -1 : 1) * dir
  })
}

export function MediaLibraryBrowse({
  client, title = 'MEDIA', bucket, onBucketChange, prefix: prefixProp, onPrefix, defaults, settings: settingsProp, onSettingsChange,
  /* THE ONE VIEW (2026-09-22): 'columns' | 'rows' | 'grid' | 'list'. Controlled or from settings;
   * `folderView` and `layout` are kept in step beneath it so a consumer still on those keeps
   * rendering what it rendered. */
  view: viewProp, onViewChange,
  folderTree, headerActions, headerTrailing, refreshKey, onOpen, autoFocus = false, settingsFooter, className = '', banner,
  /* THE FILE VERBS, as ONE seam (2026-09-21). `{ createFolder, rename, move, remove }`, each
   * optional and each async; whatever is supplied becomes a right-click menu entry and
   * anything absent simply is not offered. One object rather than four props because they
   * arrive together — a consumer with a writable store has all of them, one with a read-only
   * bucket has none — and because the page must never have to know WHICH verbs exist to
   * decide whether to draw a menu at all. The consumer re-lists after a mutation by bumping
   * `refreshKey`; the page does not own the data.
   *
   * `fileActions.items` — THE CONSUMER'S OWN VERBS (kol-client-olina 2026-09-22: Duplicate was
   * a DS publish away, and so would every verb after it be). `[{ label, icon?, when?, run }]`;
   * each gets the menu's payload `{ type, path, o?, targets? }`, `when` filters per target
   * (absent = always), and `run` goes through the same busy/error path as the built-ins. They
   * render AFTER the built-in verbs. Without `items` the menu is exactly what it was. */
  fileActions,
  /* `onDropFiles(files, folderPath)` — desktop files dropped on a folder row or a level
   * (kol-client-olina 2026-09-22). The page hands over the `FileList` and the bucket-relative
   * folder and NEVER uploads: every consumer's pipeline differs. The consumer re-lists through
   * `refreshKey`, the same contract as `fileActions`. Writable buckets only; absent, nothing. */
  onDropFiles,
  /* `trash` — THE FAILSAFE (user 2026-09-23). `{ items, restore(id), purge(id), empty() }`, the
   * consumer's: `items` is `[{ id, path, deletedAt, isFolder?, count?, size?, expiresAt? }]`, and
   * `fileActions.remove` is expected to move into it. Given, delete stops asking "this cannot be
   * undone" — it can — and a trash button opens the list with Restore and Delete forever. The
   * consumer re-lists through `refreshKey`. Absent, delete is what it was. */
  trash,
  /* PASS-THROUGHS TO `ColumnBrowser`. A documented prop this page does not
   * forward is a prop no consumer of the PAGE can reach, which makes the seam
   * fictional — `thumbnailFor` and `folderMeta` shipped, were announced, and
   * rendered as if they never existed because this signature ended before them
   * (ColumnBrowserMobileViews items 10 + 13, kol-r2b2 2026-09-04). Second time
   * this shape bit: `SettingsPanel` documented a `footer` slot this file
   * hardcoded past. The rule the sweep leaves behind — WHEN A PROP IS ADDED TO
   * `ColumnBrowser`, IT IS ADDED HERE IN THE SAME EDIT, unless the page holds a
   * real opinion about it (it owns `height`, the widths and `partition`, so
   * those are deliberately absent from this list). */
  thumbnailFor, folderMeta, stackView,
  /* defaulted, not bare — see the note on the sibling page */
  formatDate = defaultFormatDate,
  /* THE TAB PILL'S LIST (ColumnBrowserMobileViews item 16). What a tab MEANS is
   * the consumer's — a repo whose surfaces are routes wires its router here.
   * No tabs, no pill, and the page is exactly what it was. */
  tabs, activeTab, onTabChange,
  /* `bucketLevel` — keep title → bucket → folders with ONE bucket (kol-client-olina 2026-09-23).
   * Absent, a one-bucket consumer collapses the level as ruled 2026-09-03. */
  bucketLevel = false,
}) {
  const [ownPrefix, setOwnPrefix] = useState('')
  const prefix = prefixProp ?? ownPrefix
  const setPrefix = (v) => { if (prefixProp == null) setOwnPrefix(v); onPrefix?.(v) }
  const [appRoot, setAppRoot] = useState(false)
  const [ownBucket, setOwnBucket] = useState(bucket)
  const bucketId = bucket ?? ownBucket
  const lib = useBucketLibrary({ client, bucket: bucketId, defaults, settings: settingsProp, onSettingsChange, refreshKey })
  const { buckets, bucketMeta, settings, setSettings, objects, error, mediaUrl, downloadUrl, writable } = lib
  const switchBucket = (id, pfx = '') => { if (bucket == null) setOwnBucket(id); onBucketChange?.(id); setPrefix(pfx) }
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [trashOpen, setTrashOpen] = useState(false)
  const [pickedFile, setPickedFile] = useState(null)
  /* ROW VIEW PICKS, and only one at a time: a click selects and fills the preview, a DOUBLE click
   * opens (user 2026-09-22, Finder's behaviour — "clicking shouldnt automatically open it"). The
   * chevron still expands in place, which is the third thing and always was. */
  const [pickedFolder, setPickedFolder] = useState(null)
  const pickFile = (o) => { setPickedFolder(null); setPickedFile(o) }
  const pickFolder = (path) => { setPickedFile(null); setPickedFolder(path) }
  /* IN THE ROWS, WHAT YOU PICK SETS WHERE YOU ARE (user 2026-09-23: *"that files folder becomes the
   * default NOT the previous folder"*). The list is rooted at the top, so a pick can sit in any open
   * folder; the current folder follows it to the pick's parent. Whatever the old path had open
   * STAYS open — moving where you are must not fold up what you were looking at. */
  const dirOf = (path) => { const t = path.replace(/\/$/, ''); return t.slice(0, t.lastIndexOf('/') + 1) }
  const moveHereKeepingOpen = (to) => {
    if (to === prefix) return
    setExpandedRows((prev) => new Set([...prev, ...openChain(prefix)]))
    setPrefix(to)
  }
  const rowPickFile = (o) => { pickFile(o); moveHereKeepingOpen(dirOf(o.key)) }
  const rowPickFolder = (path) => { pickFolder(path); moveHereKeepingOpen(dirOf(path)) }
  /* Row view's inline disclosure set — folder paths currently expanded. Kept here rather than in
   * settings: it is a transient reading state, not a preference, and Finder does not persist it
   * across a relaunch either. */
  const [expandedRows, setExpandedRows] = useState(() => new Set())
  /* THE ROW LIST IS ALWAYS BASED AT THE ROOT (user 2026-09-23: *"row view should not open a path
   * of the folder its highlighted … rather expand the folders to that location, still showing the
   * root"*). It used to re-base on `prefix`, so arriving from the columns three folders deep threw
   * the tree away and showed one level. The path now seeds the EXPANSION instead: every ancestor
   * opens, the folder you are in reads selected, and the root is still the first row.
   *
   * Collapsing a folder ON that path is how you leave it — the chevron cannot fight `prefix` and
   * win, so it moves `prefix` up instead of flickering back open. */
  const openChain = (p) => {
    const out = []
    let cur = ''
    for (const seg of p.replace(/\/$/, '').split('/').filter(Boolean)) { cur += `${seg}/`; out.push(cur) }
    return out
  }
  const rowsExpanded = new Set([...expandedRows, ...openChain(prefix)])
  /* THE VISIBLE ORDER, flattened in render order, so ⇧-click ranges across expanded folders and
   * not just the level you happen to be on. Built from the same `rowLevel` + expansion the list
   * draws from, so it cannot disagree with what is on screen. */
  const visibleRowOrder = (list) => {
    const out = []
    const walk = (level) => {
      const { folders, files } = rowLevel(level, list)
      for (const f of folders) {
        const path = level + f
        out.push(path)
        if (rowsExpanded.has(path)) walk(path)
      }
      for (const o of files) out.push(o.key)
    }
    walk('')
    return out
  }
  const toggleRow = (path) => {
    if (openChain(prefix).includes(path)) { setPrefix(path.replace(/[^/]+\/$/, '')); return }
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.has(path) ? next.delete(path) : next.add(path)
      return next
    })
  }

  /* ── THE FILE VERBS ────────────────────────────────────────────────────────────────────────
   * Right-click is the surface; `fileActions` is the implementation. The page owns neither the
   * data nor the store — it collects an intent, asks for the one piece of text it needs, calls
   * the consumer's verb and lets the consumer re-list. The asking goes through `useModal()` —
   * the DS's one dialog idiom — so a consumer that mounts `ModalProvider` gets DS dialogs and one
   * that does not gets the native ones, exactly as before (kol-client-olina 2026-09-22: the
   * browser's own grey prompt box was the last non-DS surface on media.olina-productions.com). */
  const menu = useContextMenu()
  const modal = useModal()
  const canWrite = !!fileActions && writable
  const [busyAction, setBusyAction] = useState(false)

  const runAction = async (fn) => {
    if (!fn) return
    setBusyAction(true)
    try { await fn() } catch (e) { await modal.alert(e.message) } finally { setBusyAction(false) }
  }

  const doCreateFolder = async (parent) => {
    const name = await modal.prompt(`New folder in ${parent || 'the bucket root'}:`, '', { okLabel: 'Create' })
    if (!name?.trim()) return
    runAction(() => fileActions.createFolder(`${parent}${name.trim().replace(/^\/+|\/+$/g, '')}/`))
  }
  const doCreateFile = async (parent) => {
    const name = await modal.prompt(`New file in ${parent || 'the bucket root'}:`, 'untitled.txt', { okLabel: 'Create' })
    if (!name?.trim()) return
    runAction(() => fileActions.createFile(`${parent}${name.trim().replace(/^\/+/, '')}`))
  }
  const doRename = async (path, isFolder) => {
    const current = path.replace(/\/$/, '').split('/').pop()
    const name = await modal.prompt(`Rename ${isFolder ? 'folder' : 'file'}:`, current, { okLabel: 'Rename' })
    if (!name?.trim() || name === current) return
    const parent = path.replace(/\/$/, '').slice(0, path.replace(/\/$/, '').length - current.length)
    runAction(() => fileActions.rename(path, `${parent}${name.trim()}${isFolder ? '/' : ''}`))
  }
  const doMove = async (path) => {
    const dest = await modal.prompt(`Move into which folder? (blank = bucket root)`, prefix, { okLabel: 'Move' })
    if (dest == null) return
    const clean = dest ? `${dest.replace(/^\/+|\/+$/g, '')}/` : ''
    runAction(async () => { await fileActions.move(path, clean); afterMove([path], clean) })
  }
  /* A MOVE KEEPS WHAT YOU MOVED IN HAND (user 2026-09-23: *"they should remain selected and new
   * location shown"*). The set is re-keyed to where the items now live, and the target comes into
   * view: expanded in place in the rows, navigated into in the columns and the grid. */
  const afterMove = (paths, dest) => {
    const moved = paths.map((p) => `${dest}${p.replace(/\/$/, '').split('/').pop()}${p.endsWith('/') ? '/' : ''}`)
    setPickedFile(null); setPickedFolder(null)
    setRowSelection(new Set(moved))
    selectAnchorRef.current = moved[0] ?? null
    if (view === 'rows') setExpandedRows((prev) => new Set([...prev, ...openChain(dest)]))
    else setPrefix(dest)
  }
  /* DRAG TO MOVE. HTML5 drag-and-drop, not a pointer-tracking implementation: the rows are a list,
   * the targets are folders, and the browser already does the hit-testing and the cursor. The
   * dragged path lives in a ref rather than dataTransfer alone so `canDrop` can answer without
   * reading the event — a folder may not be dropped into itself or into its own subtree, which is
   * the one rule that makes this safe to wire straight to `move`. */
  /* MULTI-SELECT in the browse views. ⌘/Ctrl-click adds one, ⇧-click takes the run between the
   * anchor and the click, a plain click clears back to navigation. The wall has had its own SELECT
   * mode since 0.119.0; this is the browse half, and it deliberately does NOT reuse that mode's
   * chrome — there the wall IS the surface and a mode bar fits, here selection is a modifier on a
   * tree you are still walking. The menu acts on the whole set when the clicked row is in it. */
  const [rowSelection, setRowSelection] = useState(() => new Set())
  const selectAnchorRef = useRef(null)
  /* where the keyboard IS, apart from where a ⇧ run began — null means "at the anchor" */
  const selectCursorRef = useRef(null)
  /* DRAG A BAND ACROSS THE LIST (user 2026-09-22). The same set the ⌘/⇧ clicks build, so the menu
   * acts on a dragged selection exactly as it does on a clicked one. */
  const marqueeSelect = (keys, additive) => setRowSelection((prev) => (additive ? new Set([...prev, ...keys]) : new Set(keys)))
  const rowsMarquee = useMarquee({ onSelect: marqueeSelect })
  const gridMarquee = useMarquee({ onSelect: marqueeSelect })

  const selectRow = (path, e, orderedPaths) => {
    selectCursorRef.current = null
    const additive = e.metaKey || e.ctrlKey
    const ranged = e.shiftKey && selectAnchorRef.current
    /* A PLAIN CLICK IS A SELECTION OF ONE (user 2026-09-23). It used to CLEAR the set and only
     * "pick" the row for the preview, so a row could look selected while the set was empty — and
     * a drag, which carries the set, then took one fewer item than the screen showed. The pick and
     * the selection are the same act; `false` still tells the caller to preview it. */
    if (!additive && !ranged) { setRowSelection(new Set([path])); selectAnchorRef.current = path; return false }
    e.preventDefault()
    setRowSelection((prev) => {
      const next = new Set(prev)
      if (ranged) {
        const a = orderedPaths.indexOf(selectAnchorRef.current)
        const b = orderedPaths.indexOf(path)
        if (a !== -1 && b !== -1) for (let i = Math.min(a, b); i <= Math.max(a, b); i++) next.add(orderedPaths[i])
      } else {
        next.has(path) ? next.delete(path) : next.add(path)
        selectAnchorRef.current = path
      }
      return next
    })
    return true
  }

  /* The set the menu acts on: the selection when you right-clicked something inside it, otherwise
   * just the row you hit — which is what every file manager does and what stops a right-click on an
   * unrelated row from silently deleting five things. */
  const targetsFor = (path) => (rowSelection.has(path) ? [...rowSelection] : [path])

  const doBatch = async (paths, verb, label) => {
    if (paths.length === 1) return null
    if (label === 'Delete' && !trash && !(await modal.confirm(`Delete ${paths.length} items? This cannot be undone.`, { okLabel: 'Delete' }))) return null
    let dest = null
    if (label === 'Move') {
      dest = await modal.prompt(`Move ${paths.length} items into which folder? (blank = bucket root)`, prefix, { okLabel: 'Move' })
      if (dest == null) return null
      dest = dest ? `${dest.replace(/^\/+|\/+$/g, '')}/` : ''
    }
    runAction(async () => {
      for (const p of paths) {
        if (label === 'Delete') await fileActions.remove(p)
        else await fileActions.move(p, dest)
      }
      if (label === 'Delete') setRowSelection(new Set())
      else afterMove(paths, dest)
    })
    void verb
    return true
  }

  /* THE DRAG CARRIES THE SELECTION (user 2026-09-23: "if 3 are selected, drag and drop still only
   * grabs one"). Dragging a row that is IN the selection drags the whole set — which is what the
   * right-click menu already did, and the two must not disagree about what "the targets" means.
   * Dragging a row outside the selection is that row alone, as every file manager does. */
  const draggingRef = useRef(null)
  const dragFor = canWrite && fileActions.move ? (path) => ({
    path,
    onDragStart: (e, from) => {
      const set = rowSelection.has(from) ? [...rowSelection] : [from]
      draggingRef.current = set
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', set.join('\n'))
    },
    /* every dragged path has to be legal, or the drop would half-happen */
    canDrop: (dest) => {
      const set = draggingRef.current
      if (!set?.length) return false
      /* ONLY A FOLDER TAKES A DROP. A file row is not a destination: moving `a.jpg` "into"
       * `b.json` renamed it to `b.jsona.jpg`-shaped keys (the file-onto-file bug, 2026-09-22). */
      if (dest && !dest.endsWith('/')) return false
      return set.every((from) => {
        if (from === dest) return false
        if (from.endsWith('/') && dest.startsWith(from)) return false // into itself
        const parent = from.replace(/\/$/, '').split('/').slice(0, -1).join('/')
        return dest !== (parent ? `${parent}/` : '')                  // already there
      })
    },
    onDrop: (dest) => {
      const set = draggingRef.current
      draggingRef.current = null
      if (!set?.length) return
      runAction(async () => {
        for (const from of set) await fileActions.move(from, dest)
        afterMove(set, dest)
      })
    },
  }) : null

  /* the OS-drop target for a bucket-relative folder path, or null where nothing may land */
  const dropFilesTo = onDropFiles && writable ? (path) => (files) => onDropFiles(files, path) : null

  /* UPLOAD FROM THE MENU (user 2026-09-22). The drop zone asked where files should go and never
   * said; right-click names the folder. The picker is the browser's own and the files go through
   * `onDropFiles`, the same seam a drag uses — the page still never uploads. */
  const doUpload = (path) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.onchange = () => { if (input.files?.length) runAction(() => onDropFiles(input.files, path)) }
    input.click()
  }

  /* The wall's two read verbs, in the tree's menu too (user 2026-09-22: "in right click dropdown we
   * need copy url and download options, they are currently only availble in files mode"). Both are
   * the client's URLs, so neither needs a write seam — they are offered wherever a FILE is. */
  const doCopyUrl = (paths) => navigator.clipboard?.writeText(paths.map((p) => mediaUrl(p)).join('\n'))
  const doDownload = (paths) => {
    for (const p of paths) {
      const a = document.createElement('a')
      a.href = downloadUrl(p)
      a.download = p.split('/').pop()
      document.body.appendChild(a)
      a.click()
      a.remove()
    }
  }

  const doDelete = async (path, isFolder) => {
    if (!trash && !(await modal.confirm(`Delete ${isFolder ? `"${path}" and everything in it` : `"${path}"`}? This cannot be undone.`, { okLabel: 'Delete' }))) return
    runAction(() => fileActions.remove(path))
  }
  /* stepping into a folder drops the pick — the preview would otherwise describe something no
   * longer in the list */
  const goFolder = (path) => { setPickedFile(null); setPickedFolder(null); setPrefix(path) }
  /* SPACE IS QUICK LOOK IN EVERY VIEW (user 2026-09-23: *"spacebar preview only works in column,
   * fix that. CONSISTENCY"*). `ColumnBrowser` has owned that key since it shipped, so the columns
   * had it and the two views built later did not. The target is whatever is picked — the previewed
   * file, or a selection of exactly one — and the set it pages through is the list you are looking
   * at: the folder's files in rows, the wall's own list in grid. */
  /* QUICK LOOK PAGES THROUGH THE SELECTION (user 2026-09-23: *"multiple files selected should
   * show '1/2 <>' … because two files are highlighted"*). With more than one file selected the set
   * is the selection, in list order, starting on the file asked for; otherwise it is the list the
   * caller handed over. Every open goes through here so no view pages a different set. */
  const openQuickLook = (q) => {
    if (!q) { setQuickLook(null); return }
    /* in the order on screen when the caller's list holds the whole selection, else bucket order */
    const inView = q.files.filter((o) => rowSelection.has(o.key))
    const sel = inView.length === rowSelection.size ? inView : objects.filter((o) => rowSelection.has(o.key))
    const current = q.files[q.index]
    if (sel.length > 1) {
      const index = Math.max(0, sel.findIndex((o) => o.key === current?.key))
      setQuickLook({ files: sel, index })
      return
    }
    setQuickLook(q)
  }
  /* QUICK LOOK STEPS THE SELECTION TOO (user 2026-09-23: *"when quicklook preview is open on
   * selected item and arrow right focuses new item, that item is being selected"*). Paging a folder,
   * the file you land on becomes the selection and the pick — so closing the window leaves you on
   * it. Paging a multi-selection, the set is what you are looking through and stays whole. */
  /* closing hands focus to the SELECTION, not back to the tile that opened the window — after
   * stepping they are different tiles, and the overlay's own focus-return would light the old one */
  const closeQuickLook = () => {
    setQuickLook(null)
    requestAnimationFrame(() => {
      const key = selectAnchorRef.current
      const el = key && document.querySelector(`[data-marquee-key="${CSS.escape(key)}"]`)
      if (el?.tabIndex >= 0) el.focus({ preventScroll: true })
    })
  }
  const stepQuickLook = (dir) => {
    if (!quickLook) return
    const { files } = quickLook
    const index = (quickLook.index + dir + files.length) % files.length
    setQuickLook({ ...quickLook, index })
    const o = files[index]
    if (o && rowSelection.size <= 1) {
      setRowSelection(new Set([o.key])); selectAnchorRef.current = o.key
      setPickedFolder(null); setPickedFile(o)
    }
  }
  const spaceQuickLook = () => {
    const key = pickedFile?.key ?? pickedFolder ?? (rowSelection.size === 1 ? [...rowSelection][0] : null)
    if (!key) return
    /* A FOLDER QUICK-LOOKS TOO (user 2026-09-23: *"anything can be quick viewed, also folders"*) —
     * the same pane the preview column draws, at overlay size. */
    if (key.endsWith('/')) { setQuickLookFolder(key); return }
    const files = isWall
      ? wallFiles
      : rowLevel(key.slice(0, key.lastIndexOf('/') + 1), sortedObjects).files
    const index = files.findIndex((f) => f.key === key)
    if (index === -1) return
    openQuickLook({ files, index })
  }

  /* SEARCH IS THE DS'S OWN PALETTE (2026-09-22). `/` is the file-manager habit and ⌘K the app one,
   * so both open it; it searches the bucket's keys and JUMPS — it does not filter the list under
   * you, which is what the filter bar is for. */
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  /* THE ARROWS IN THE GRID AND THE ROWS (user 2026-09-23: *"arrow navigation doesnt work in grid
   * mode? nor in row mode"*). The columns have always had theirs (`ColumnBrowser`); these are the
   * same keys for the other two views, and every one is listed in the shortcuts sheet.
   *   grid   ←→ one tile, ↑↓ one row of tiles (the grid's live column count)
   *   rows   ↑↓ the visible order · → expands a folder, again steps into it · ← collapses, or goes
   *          to the parent folder
   *   both   ⌘↑ the enclosing folder · ⌘↓ opens (a folder in the rows, Quick Look on a file) */
  const gridOrderRef = useRef([])
  const arrowNav = (e) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return false
    if (view === 'columns' || quickLook || quickLookFolder || searchOpen) return false
    const cur = selectCursorRef.current ?? selectAnchorRef.current ?? [...rowSelection].pop() ?? null
    /* ⇧ + ARROW EXTENDS (user 2026-09-23: *"shift up down or left right … should also make
     * selection"*): the anchor stays where the run began, the cursor moves, and the selection is
     * everything between them in the order on screen. */
    const extend = (order, key) => {
      const anchor = selectAnchorRef.current ?? cur ?? key
      const a = order.indexOf(anchor)
      const b = order.indexOf(key)
      if (a === -1 || b === -1) return false
      setRowSelection(new Set(order.slice(Math.min(a, b), Math.max(a, b) + 1)))
      selectAnchorRef.current = anchor
      selectCursorRef.current = key
      return true
    }
    /* FOCUS FOLLOWS THE SELECTION (user 2026-09-23: *"why are we supporting multiple selected/highlight
     * states?"*). The clicked tile kept keyboard focus — and its focus ring — while the arrows moved
     * the selection on, so two tiles looked current. The one the arrows land on takes focus too. */
    const reveal = (box, key) => {
      const el = box?.querySelector(`[data-marquee-key="${CSS.escape(key)}"]`)
      el?.scrollIntoView({ block: 'nearest' })
      if (el?.tabIndex >= 0) el.focus({ preventScroll: true })
    }
    if (view === 'grid') {
      const list = gridOrderRef.current
      if (!list.length) return true
      if (e.metaKey && e.key === 'ArrowUp') { if (prefix) goFolder(dirOf(prefix)); return true }
      const i = list.findIndex((f) => f.key === cur)
      if (e.metaKey && e.key === 'ArrowDown') { if (i !== -1) openQuickLook({ files: list, index: i }); return true }
      const box = gridMarquee.ref.current
      const cols = box ? getComputedStyle(box).gridTemplateColumns.split(' ').filter(Boolean).length : 1
      const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -cols, ArrowDown: cols }[e.key]
      const o = list[i === -1 ? 0 : Math.max(0, Math.min(list.length - 1, i + step))]
      if (e.shiftKey && extend(list.map((f) => f.key), o.key)) { reveal(box, o.key); return true }
      setRowSelection(new Set([o.key])); selectAnchorRef.current = o.key; selectCursorRef.current = null
      setPickedFolder(null); setPickedFile(o)
      reveal(box, o.key)
      return true
    }
    if (view === 'rows') {
      const order = visibleRowOrder(sortedObjects)
      if (!order.length) return true
      const select = (key) => {
        setRowSelection(new Set([key])); selectAnchorRef.current = key; selectCursorRef.current = null
        if (key.endsWith('/')) rowPickFolder(key)
        else { const o = objects.find((x) => x.key === key); if (o) rowPickFile(o) }
        reveal(rowsMarquee.ref.current, key)
      }
      const isFolder = cur?.endsWith('/')
      const open = isFolder && rowsExpanded.has(cur)
      if (e.metaKey && e.key === 'ArrowUp') { const up = cur ? dirOf(cur) : dirOf(prefix); if (up) select(up); return true }
      if (e.metaKey && e.key === 'ArrowDown') {
        if (!cur) return true
        if (isFolder) goFolder(cur)
        else { const lvl = rowLevel(dirOf(cur), sortedObjects).files; openQuickLook({ files: lvl, index: Math.max(0, lvl.findIndex((f) => f.key === cur)) }) }
        return true
      }
      const i = order.indexOf(cur)
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const next = order[i === -1 ? 0 : Math.max(0, Math.min(order.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))]
        if (e.shiftKey && extend(order, next)) { reveal(rowsMarquee.ref.current, next); return true }
        select(next); return true
      }
      if (e.key === 'ArrowRight' && isFolder) {
        if (!open) setExpandedRows((prev) => new Set([...prev, cur]))
        else if (order[i + 1]?.startsWith(cur)) select(order[i + 1])
        return true
      }
      if (e.key === 'ArrowLeft' && cur) {
        if (open) toggleRow(cur)
        else if (dirOf(cur)) select(dirOf(cur))
        return true
      }
      return true
    }
    return false
  }
  useEffect(() => {
    const onKey = (e) => {
      const el = e.target
      if (el?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el?.tagName ?? '')) return
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setSearchOpen(true) }
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setSearchOpen(true) }
      if (arrowNav(e)) { e.preventDefault(); return }
      /* the columns keep their own space handler — theirs knows the column's cursor */
      if (e.key === ' ' && view !== 'columns' && !searchOpen) {
        e.preventDefault()
        if (quickLook) closeQuickLook()
        else if (quickLookFolder) setQuickLookFolder(null)
        else spaceQuickLook()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const [quickLook, setQuickLook] = useState(null)
  const [quickLookFolder, setQuickLookFolder] = useState(null)
  const columnsRef = useRef(null)
  /* `flat` IS THE WALL'S, NOT THIS PAGE'S (user 2026-09-22: "there is no option to switch to flat
   * mode, bc its not in files view. this is row mode.. this makes no sense"). It reached here from
   * kol-r2b2's single surface and did two things that cannot be defended in a TREE: it struck every
   * folder name through, and it counted the whole subtree in the level's own count line — with the
   * only control on the other view's filter bar. A tree browses folders; flat browses files. */
  /* `view` IS THE STATE; `folderView` is what it used to be called for the two tree views and is
   * kept in step so an older consumer (kol-r2b2, kol-olina) is unaffected. */
  const stored = viewProp ?? settings.view ?? (settings.folderView === 'rows' ? 'rows' : 'columns')
  const view = stored === 'list' ? 'rows' : stored
  const isWall = view === 'grid'
  const folderView = view === 'rows' ? 'rows' : 'columns'
  const setView = (v) => {
    onViewChange?.(v)
    setSettings({
      ...settings,
      view: v,
      folderView: v === 'rows' ? 'rows' : v === 'columns' ? 'columns' : settings.folderView,
      layout: v === 'grid' ? 'grid' : settings.layout,
    })
  }
  /* ROW VIEW'S PREVIEW PANE. Reserved whenever the setting is on, empty until something is picked
   * — Finder keeps the space rather than reflowing the list on every selection. */
  const showRowPreview = folderView === 'rows' && (settings.rowPreview ?? true)
  const showGridPreview = view === 'grid' && (settings.rowPreview ?? true)
  /* OFF by default: a row is a name, and the facts live in the preview (user 2026-09-22) */
  const rowCols = settings.rowColumns ? rowColWidths(settings) : null
  const previewWidth = settings.columnWidths?.preview ?? 320
  const previewFile = pickedFile && pickedFile.key.startsWith(prefix) ? pickedFile : null
  const previewFolder = pickedFolder && pickedFolder.startsWith(prefix) ? pickedFolder : null
  /* THE PREVIEW PANE, ONE FUNCTION FOR THE ROWS AND THE GRID (user 2026-09-23: *"why did you not
   * treat this like column and row, with container padding + preview pane? CONSISTENCY"*). Several
   * selected → the stack; a file → its preview; a folder → its summary; nothing → the reserved
   * space, which Finder keeps rather than reflowing the list on every pick. */
  const previewPane = () => (
    rowSelection.size > 1 ? (
      <SelectionPreview keys={[...rowSelection]} objects={objects} urlOf={(o) => mediaUrl(o.key)} kindOf={kindOf} formatSize={formatSize} formatDate={formatDate} width={previewWidth} />
    ) : previewFile ? (
      <ColumnPreview key={previewFile.key} o={previewFile} urlOf={(o) => mediaUrl(o.key)} kindOf={kindOf} kindLabel={KIND_LABEL}
        formatSize={formatSize} formatDate={formatDate} width={previewWidth}
        renderPreview={(o) => {
          if (isImage(o.contentType)) return <ImageFrame src={mediaUrl(o.key)} />
          const poster = posterFor(o.key, keySet)
          return <KindPreview o={o} urlOf={(x) => mediaUrl(x.key)} poster={poster ? mediaUrl(poster) : undefined} kindOf={kindOf} kindLabel={KIND_LABEL} />
        }} />
    ) : previewFolder ? (
      <FolderPreview key={previewFolder} path={previewFolder} objects={objects} width={previewWidth} formatDate={formatDate} />
    ) : (
      <div className="kol-column-browser-preview shrink-0" style={{ width: previewWidth }} />
    )
  )
  /* PINNED SEARCH + `···` (item 15), below `md` only. Item 7 of the previous
   * ticket hid the desktop control cluster and put nothing in its place, so
   * SORT became unreachable on a phone; both references carry exactly these two
   * controls above the list. Search is page state, not a setting — a query is
   * something you are doing, not something you have configured. */
  const [query, setQuery] = useState('')

  /* Search filters the KEY SPACE, so the tree still navigates: a path survives
   * when a file under it matches and ColumnBrowser's own partition does the
   * rest. One view, rather than a flat results list nobody asked for. Sort
   * orders the files the way the wall already sorts its own. */
  const q = query.trim().toLowerCase()
  /* SEGMENTS HIDE WHEN FOLDED, in every view (user 2026-09-23: *"we can just by default hide the
   * segments, if they serve no practical purpose"*). A `.ts` chunk cannot play on its own — its
   * stream's `.m3u8` beside it is the thing you open. The fold used to reach only the grid, so the
   * columns and rows listed every chunk. */
  const listed = useMemo(() => (settings.foldSegments ? objects.filter((o) => !isSegment(o.key)) : objects), [objects, settings.foldSegments])
  const searched = useMemo(() => (q ? listed.filter((o) => o.key.toLowerCase().includes(q)) : listed), [listed, q])
  const sortedObjects = useMemo(
    () => sortObjects(searched, settings.sortBy, settings.sortDir),
    [searched, settings.sortBy, settings.sortDir],
  )

  const treeFolders = (level) => (folderTree?.[bucketMeta.id]?.folders ?? [])
    .filter((p) => p.startsWith(level) && p.length > level.length && !p.slice(level.length, -1).includes('/'))
    .map((p) => p.slice(level.length))

  const scoped = prefix ? sortedObjects.filter((o) => o.key.startsWith(prefix)) : sortedObjects
  const { folders: keyFolders, files: dirFiles } = partition(scoped, prefix)
  /* THE COUNT COUNTS WHAT IS ON SCREEN. `partition` derives folders from file keys, so an EMPTY
   * folder is invisible to it — the stats line said "2 folders" under a list showing three, the
   * third being `03-scratch/`, which exists in `folderTree` and nowhere else. Both views draw the
   * merged set now, so the tally is taken from the same place. */
  const folders = [...new Set([...treeFolders(prefix), ...keyFolders])].sort()
  const keySet = new Set(objects.map((o) => o.key))
  const levelFiles = dirFiles
  const systemCount = levelFiles.filter((o) => isSystemFile(o.key)).length
  const rawFiles = levelFiles.filter((o) => !isSystemFile(o.key)).map((o) => ({ ...o, kind: kindOf(o) }))
  const profile = profileOf(objects, rawFiles, systemCount)
  const totalBytes = rawFiles.reduce((n, o) => n + (o.size ?? 0), 0)
  const bucketFiles = objects.length
  const bucketBytes = objects.reduce((n, o) => n + (o.size || 0), 0)
  const crumbs = prefix ? prefix.replace(/\/$/, '').split('/') : []

  /* the virtual root — one browser for the whole client: root row = the title,
   * its children the buckets, stepping into one IS the bucket switch.
   *
   * ONE BUCKET GETS NO BUCKET LEVEL (one-bucket-consumer, kol-client-olina
   * 2026-09-03): with a single bucket the second column was a row that named
   * the only thing it could name, under a root that named the app — two levels
   * to reach a folder. The virtual root collapses to the empty string, which
   * makes every `slice(VROOT.length)` below a no-op and leaves column 0 as the
   * bucket's own folders. Multi-bucket browse is untouched. */
  const single = !bucketLevel && buckets.length <= 1
  const ROOT = title
  const label = bucketMeta.label || 'bucket'
  const VROOT = single ? '' : `${ROOT}/${label}/`
  const unroot = (p) => (VROOT && p.startsWith(VROOT) ? p.slice(VROOT.length) : p)
  /* ONE LEVEL, ONE ANSWER. The column view merges the baked tree with the live partition inside its
   * `partition` prop; the row view used the live partition alone and therefore disagreed with the
   * columns about what a folder even is. This is that merge, lifted so both callers share it —
   * folders from `folderTree` (real nodes, empty ones included) unioned with the ones derived from
   * keys, plus the level's own files, which the row view never rendered at all. */
  const rowLevel = (level, list = objects) => {
    /* `partition` slices every key by `prefix` WITHOUT checking it matches, so it must be handed an
     * already-scoped list. Given the whole bucket it cut four characters off every root key and
     * drew `readme.md` as `me.md` and `video/` as `o/`. Scope first, always. */
    const inLevel = level ? list.filter((o) => o.key.startsWith(level)) : list
    const live = partition(inLevel, level)
    const baked = treeFolders(level)
    return {
      folders: [...new Set([...baked, ...live.folders])].sort(),
      files: sortObjects(live.files.filter((o) => !isSystemFile(o.key)), settings.sortBy, settings.sortDir),
    }
  }

  useEffect(() => {
    if (folderView !== 'columns') return undefined
    const root = columnsRef.current?.querySelector('[tabindex="0"]')
    if (!root) return undefined
    const id = requestAnimationFrame(() => root.scrollTo({ left: root.scrollWidth, behavior: 'smooth' }))
    return () => cancelAnimationFrame(id)
  }, [folderView, prefix, appRoot, pickedFile, bucketMeta.id])

  if (error) return <p className="kol-mono-12 text-ui-error">Error: {error}</p>
  /* NOT SELECTABLE (user 2026-09-23, superseding 2026-09-22's selectable crumbs: *"instead of this
   * highlight, could we make a hover click to copy path?"*). A drag across the line painted the
   * browser's selection block over it; the path is one click on the current crumb now. */
  const crumbCls = (active) => `cursor-pointer select-none transition-colors ${active ? 'text-oq-96' : 'text-oq-48 hover:text-oq-64'}`
  const fullPath = (tail = '') => [ROOT, ...(appRoot ? [] : [label, ...crumbs]), ...(tail ? [tail] : [])].join('/')

  /* ── THE WALL'S LIST, on the same surface (2026-09-22) ──────────────────────────────────────
   * `flat` belongs to the FILE views and not to the tree (that ruling stands): a wall shows the
   * folder's own files, or the whole subtree when flat is on. Grouping and segment-folding are the
   * settings the wall always had. */
  const wallKinds = new Set(settings.kinds ?? SETTINGS_BASE.kinds)
  const wallSource = settings.flat
    ? scoped.map((o) => ({ ...o, displayKey: prefix ? o.key.slice(prefix.length) : o.key }))
    : dirFiles
  const wallVisible = wallKinds.has('system') ? wallSource : wallSource.filter((o) => !isSystemFile(o.key))
  const wallGrouped = settings.groupVariants ? groupVariants(wallVisible) : wallVisible
  const wallFiles = (settings.foldSegments ? groupSegments(wallGrouped) : wallGrouped)
    .map((o) => ({ ...o, kind: kindOf(o), poster: posterFor(o.key, keySet) }))
  const filtersOn = !!settings.filters
  /* the bar filters FILES, and a tree is drawn from the files under it — so one filtered list
   * serves both: the wall renders it, the tree is scoped to the keys in it */
  const filterItems = isWall ? wallFiles : scoped.filter((o) => !isSystemFile(o.key)).map((o) => ({ ...o, kind: kindOf(o), displayKey: prefix ? o.key.slice(prefix.length) : o.key }))
  const filterKinds = [...new Set(filterItems.map((o) => o.kind))].sort()

  /* ── THE BODY, one of four (2026-09-22) ────────────────────────────────────────────────────
   * `treeBody` draws the columns or the rows over whatever object list it is handed — the whole
   * key space, or the subset the filter bar left standing. `wallPane` is the same two file views
   * the Files page rendered, in a pane of the browser's own height so the page does not jump
   * between views. */
  const treeBody = (keep) => {
    const treeObjects = keep ? sortedObjects.filter((o) => keep.has(o.key)) : sortedObjects
    return (
  folderView === 'columns' ? (
            <div ref={columnsRef} className="relative">
              <ColumnBrowser
                autoFocus={autoFocus}
                className={appRoot ? 'is-root' : ''}
                height={settings.columnHeight}
                onHeightChange={(px) => setSettings({ ...settings, columnHeight: px })}
                columnWidths={settings.columnWidths}
                onColumnResize={(i, px) => setSettings({ ...settings, columnWidths: { ...(settings.columnWidths ?? {}), [i]: px } })}
                objects={treeObjects.filter((o) => !isSystemFile(o.key)).map((o) => ({ ...o, key: `${VROOT}${o.key}` }))}
                prefix={single ? prefix : (appRoot ? `${ROOT}/` : `${VROOT}${prefix}`)}
                onPrefix={(v) => {
                  /* single: the browser's path IS the bucket path, no segment to strip */
                  if (single) { setAppRoot(false); setPrefix(v); return }
                  const [, seg, ...rest] = v.split('/')
                  const target = buckets.find((b) => b.label === seg)
                  if (!target && buckets.length) { setAppRoot(true); setPickedFile(null); setPrefix(''); return }
                  setAppRoot(false)
                  const real = rest.join('/')
                  if (target && target.id !== bucketMeta.id) switchBucket(target.id, real); else setPrefix(real)
                }}
                onPick={(o) => setPickedFile(o ? { ...o, key: o.key.slice(VROOT.length) } : null)}
                quickLook={quickLook && { ...quickLook, files: quickLook.files.map((o) => ({ ...o, key: `${VROOT}${o.key}` })) }}
                onQuickLook={(q) => openQuickLook(q && { ...q, files: q.files.map((o) => ({ ...o, key: o.key.slice(VROOT.length) })) })}
                urlOf={(o) => mediaUrl(o.key.slice(VROOT.length))}
                kindOf={kindOf}
                kindLabel={KIND_LABEL}
                formatSize={formatSize}
                formatDate={formatDate}
                thumbnailFor={thumbnailFor}
                folderMeta={folderMeta}
                /* the PROP wins when a consumer passes one; otherwise the `···`
                   owns it through settings (item 15) */
                stackView={stackView ?? settings.stackView ?? 'list'}
                renderPreview={(o) => {
                  const real = { ...o, key: o.key.slice(VROOT.length) }
                  if (isImage(real.contentType)) return <ImageFrame src={mediaUrl(real.key)} />
                  const poster = posterFor(real.key, keySet)
                  return <KindPreview o={real} urlOf={(x) => mediaUrl(x.key)} poster={poster ? mediaUrl(poster) : undefined} kindOf={kindOf} kindLabel={KIND_LABEL} />
                }}
                /* THE COLUMNS SPEAK IN VIRTUAL PATHS. With more than one bucket every level is
                  * prefixed `<title>/<bucket>/` so the stores share one tree — so a path coming OUT
                  * of the browser must be un-rooted before it reaches a file verb, or the store is
                  * asked to move `MEDIA/R2 · kol-media/img/x.jpg`, which it has never heard of. The
                  * row view needs none of this; it is already bucket-relative. */
                onRowContextMenu={(e, payload) => menu.openAt(e, { ...payload, path: unroot(payload.path), ...(payload.o && { o: { ...payload.o, key: unroot(payload.o.key) } }) })}
                dragFor={dragFor ? (path) => dragFor(unroot(path)) : undefined}
                /* virtual paths again: only a level inside THIS bucket's root can take a file */
                onDropFiles={dropFilesTo ? (files, path) => { if (!VROOT || path.startsWith(VROOT)) dropFilesTo(unroot(path))(files) } : undefined}
                /* the band's keys come back virtual-rooted; the page keeps ONE selection, bucket-relative */
                selectedKeys={VROOT ? new Set([...rowSelection].map((k) => `${VROOT}${k}`)) : rowSelection}
                onSelectKeys={(keys, additive) => { marqueeSelect(keys.map(unroot), additive); if (!additive && keys.length === 1) selectAnchorRef.current = unroot(keys[0]) }}
                onSelectClick={(key, e, keys) => selectRow(unroot(key), e, keys.map(unroot))}
                /* the bucket rows under the title are SOURCES — `database`, not `folder` */
                folderIcon={(path) => (!single && path.startsWith(`${ROOT}/`) && path.slice(ROOT.length + 1).split('/').filter(Boolean).length === 1 ? 'database' : 'folder')}
                partition={(objs, level) => {
                  if (!single) {
                    if (level === '') return { folders: [`${ROOT}/`], files: [] }
                    if (level === `${ROOT}/`) return { folders: (buckets.length ? buckets : [bucketMeta]).map((b) => `${b.label || 'bucket'}/`), files: [] }
                  }
                  const live = partition(objs, level)
                  const baked = treeFolders(level.slice(VROOT.length))
                  return { folders: [...new Set([...baked, ...live.folders])].sort(), files: live.files }
                }}
              />
            </div>
          ) : (
            /* ROW VIEW — the same level the column view draws, not a different one. It used to render
             * `partition(scoped, prefix).folders` and nothing else, which lost two things: an EMPTY
             * folder (partition derives folders from file keys, so a folder with no files under it
             * does not exist to it — `folderTree` is where real nodes live, and the column view was
             * already merging the two) and every FILE at the level. `#img/` drew 2 rows against the
             * columns' 4. Folders first, then files, each expandable in place like a list view. */
            /* SAME AREA AS THE COLUMNS. The row view used to be content-height, so the two folder
             * views made the page jump between them and the blank space below the last row — where
             * you right-click for "new folder" and drop to file something here — did not exist. It
             * takes the column browser's own height now, from the same setting.
             *
             * The list IS the current folder, so it is a drop target for `prefix`, matching a column
             * being a target for its level. Highlight via a data attribute for the same reason.
             *
             * THE COLUMN BROWSER'S PANE (user 2026-09-22): same border, radius and height, the list a
             * `kol-column-browser-column` (its 4px block inset, its selected rules), and beside it the
             * same preview the columns open — Finder's "Show preview", on by default (`rowPreview`). */
            /* THE WRAPPER OWNS THE HEIGHT, not the pane (2026-09-22). Both folder views have to end on
             * the same line — the count line under them jumps otherwise, and a consumer's fill height
             * is ONE value for both — so the header comes out of this view's budget rather than being
             * added to it. The pane takes what is left. */
            <div className="flex flex-col gap-2" style={{ height: settings.columnHeight ?? SETTINGS_BASE.columnHeight }}>
            {/* the header labels the LIST, so it spans the list and stops where the preview starts */}
            {rowCols && (
              <RowHeader sortBy={settings.sortBy} sortDir={settings.sortDir} width={showRowPreview ? `calc(100% - ${previewWidth}px)` : '100%'}
                cols={rowCols}
                onResize={(key, px) => setSettings({ ...settings, rowColumnWidths: { ...rowColWidths(settings), [key]: px } })}
                onSort={(sortBy, sortDir) => setSettings({ ...settings, sortBy, sortDir })} />
            )}
            <div className="relative border rounded flex overflow-hidden flex-1 min-h-0"
              style={{ borderColor: 'var(--kol-oq-08)' }}>
            <div className={`flex-1 min-w-0 flex flex-col${showRowPreview ? ' border-r' : ''}`} style={{ borderColor: 'var(--kol-oq-08)' }}>
            <ul ref={rowsMarquee.ref} {...rowsMarquee.props}
            /* the background deselects, here as in the columns */
            onClick={(e) => { if (!e.target.closest('[data-marquee-key]')) { setRowSelection(new Set()); setPickedFile(null); setPickedFolder(null) } }}
            className="relative kol-column-browser-column kol-row-browser flex-1 min-w-0 flex flex-col overflow-y-auto"
              onContextMenu={(e) => menu.openAt(e, { type: 'level', path: prefix })}
              onDragOver={(e) => {
                const files = dropFilesTo && isFileDrag(e)
                const d = !isFileDrag(e) && dragFor?.(prefix)
                if (!files && !d?.canDrop(prefix)) return
                e.preventDefault()
                e.currentTarget.dataset.dropOver = '1'
              }}
              /* THE HIGHLIGHT CLEARS HOWEVER THE DRAG ENDS (user 2026-09-22 — it stuck as a border).
               * A drop on a folder row stops propagation, so this list's own onDrop never ran; the
               * capture phase runs first. Leaving through a child fires on the child, so leave is
               * "the pointer is no longer inside", not "the event target was the list". */
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) delete e.currentTarget.dataset.dropOver }}
              onDropCapture={(e) => { delete e.currentTarget.dataset.dropOver }}
              onDrop={(e) => {
                if (dropFilesTo && isFileDrag(e)) { e.preventDefault(); dropFilesTo(prefix)(e.dataTransfer.files); return }
                const d = !isFileDrag(e) && dragFor?.(prefix)
                if (!d?.canDrop(prefix)) return
                e.preventDefault()
                d.onDrop(prefix)
              }}>
              {rowsMarquee.rect && <div className="kol-marquee" style={rowsMarquee.rect} />}
            {rowLevel('', treeObjects).folders.map((f) => {
                const path = f
                const open = rowsExpanded.has(path)
                const order = visibleRowOrder(treeObjects)
                return (
                  <Fragment key={f}>
                    <FolderRow
                      name={f} expanded={open}
                      markKey={path}
                      /* THE FOLDER YOU ARE IN IS NOT A SELECTION (user 2026-09-23) — it wears the trail
                       * mark, the columns' parent-folder tone, never the selected fill */
                      selected={rowSelection.has(path) || pickedFolder === path}
                      current={prefix === path}
                      onContextMenu={(e) => menu.openAt(e, { type: 'folder', path, targets: targetsFor(path) })}
                      drag={dragFor?.(path)}
                      dropFiles={dropFilesTo?.(path)}
                      meta={folderMeta?.(path) || undefined}
                      cols={rowCols}
                      onToggle={() => toggleRow(path)}
                      onClick={(e) => { if (!selectRow(path, e, order)) rowPickFolder(path) }}
                      onDoubleClick={() => goFolder(path)}
                    />
                    {open && <RowSubtree
                      level={path} depth={1} rowLevel={(lvl) => rowLevel(lvl, treeObjects)} expanded={rowsExpanded}
                      onToggle={toggleRow}
                      onOpenFolder={goFolder} onPickFolder={rowPickFolder} onPickFile={rowPickFile}
                      onOpenFile={(o) => { const lvl = rowLevel(o.key.slice(0, o.key.lastIndexOf('/') + 1), treeObjects).files; openQuickLook({ files: lvl, index: Math.max(0, lvl.findIndex((f) => f.key === o.key)) }) }}
                      selectRow={selectRow} order={order} selectedKeys={rowSelection}
                      onRowContextMenu={(e, payload) => menu.openAt(e, payload)} dragFor={dragFor} dropFilesTo={dropFilesTo}
                      formatDate={formatDate} folderMeta={folderMeta} thumbnailFor={thumbnailFor} cols={rowCols}
                      pickedKey={pickedFolder ?? pickedFile?.key ?? null} currentKey={prefix}
                    />}
                  </Fragment>
                )
              })}
              {rowLevel('', treeObjects).files.map((o) => (
                <FileRow key={o.key} o={o} formatDate={formatDate} thumb={thumbnailFor?.(o)} cols={rowCols}
                  selected={rowSelection.has(o.key) || pickedFile?.key === o.key}
                  onDoubleClick={() => { const lvl = rowLevel('', treeObjects).files; openQuickLook({ files: lvl, index: Math.max(0, lvl.findIndex((f) => f.key === o.key)) }) }}
                  onContextMenu={(e) => menu.openAt(e, { type: 'file', path: o.key, o, targets: targetsFor(o.key) })}
                  drag={dragFor?.(o.key)}
                  onClick={(e) => {
                    if (!selectRow(o.key, e, visibleRowOrder(treeObjects))) rowPickFile(o)
                  }} />
              ))}
            </ul>
            </div>
            {showRowPreview && previewPane()}
            </div>
            </div>
          )
    )
  }

  /* THE GRID IS THE THIRD VIEW OF ONE SURFACE (user 2026-09-23, reversing the same day's "no pane,
   * no fill height" for the wall: *"why did you not treat this like column and row, with container
   * padding + preview pane? CONSISTENCY"*). Same bordered frame, same fill height, the tiles scroll
   * inside it, the same preview pane beside them, the same count line under it — with the size
   * slider at its right end, Finder's. */
  const tileSize = settings.tileSize ?? 180
  const wallPane = (files) => (
    <div className="flex flex-col gap-2" style={{ height: settings.columnHeight ?? SETTINGS_BASE.columnHeight }}>
    <div className="relative border rounded flex overflow-hidden flex-1 min-h-0" style={{ borderColor: 'var(--kol-oq-08)' }}>
    <div className={`flex-1 min-w-0 overflow-y-auto p-4${showGridPreview ? ' border-r' : ''}`} style={{ borderColor: 'var(--kol-oq-08)' }}
      onClick={(e) => { if (!e.target.closest('[data-marquee-key]')) { setRowSelection(new Set()); setPickedFile(null); setPickedFolder(null) } }}>
    <WallBody files={files} layout="grid" tiles="media" cardMin={tileSize} marquee={gridMarquee} onSorted={(list) => { gridOrderRef.current = list }}
      onBackgroundClick={() => { setRowSelection(new Set()); setPickedFile(null); setPickedFolder(null) }}
      sortBy={settings.sortBy} sortDir={settings.sortDir}
      pageSize={settings.pageSize} listId={`${prefix}|${view}|${settings.flat}|${refreshKey}|${bucketMeta.id}`}
      mediaUrl={mediaUrl} downloadUrl={downloadUrl} keySet={keySet} videoPreview={settings.videoPreview} formatDate={formatDate}
      selected={rowSelection} onPick={(o, e, keys) => {
        /* ⇧/⌘ ADD TO THE SELECTION HERE TOO (user 2026-09-23) — the same `selectRow` the rows use;
         * a plain click is still a selection of one and still previews */
        if (selectRow(o.key, e, keys)) return
        setPickedFolder(null); setPickedFile(o)
      }}
      onOpen={(o, files) => openQuickLook({ files, index: Math.max(0, files.findIndex((f) => f.key === o.key)) })}
      /* COPY AND DOWNLOAD LIVE IN THE MENU AND QUICK LOOK (user 2026-09-23) — as in the rows and the
       * columns. The tile carries no buttons. */
      onContextMenu={(e, o) => menu.openAt(e, { type: 'file', path: o.key, o, targets: targetsFor(o.key) })} />
    </div>
    {showGridPreview && previewPane()}
    </div>
    </div>
  )

  /* The palette's own ruling (2026-08-01) is that Enter COMMITS the query rather than navigating
   * to whatever happened to be first — so `onExpand` is where a committed query lands, and here
   * that means the top hit. Arrow-then-Enter and a click go through `onSelect`, same jump. */
  const searchResults = (searchQuery.trim()
    ? objects.filter((o) => o.key.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : objects
  ).slice(0, 50).map((o) => ({
    id: o.key,
    label: o.key.split('/').pop(),
    hint: o.key.slice(0, o.key.lastIndexOf('/') + 1) || 'the bucket root',
    group: KIND_LABEL[kindOf(o)] || 'File',
  }))
  const jumpTo = (key) => {
    const o = objects.find((x) => x.key === key)
    setSearchOpen(false); setSearchQuery('')
    if (!o) return
    setAppRoot(false)
    setPrefix(o.key.slice(0, o.key.lastIndexOf('/') + 1))
    pickFile(o)
  }

  const body = (filtered) => (isWall
    ? wallPane(filtered ?? wallFiles)
    : treeBody(filtered ? new Set(filtered.map((f) => f.key)) : null))

  return (
    <div className={`flex flex-col gap-6 ${className}`.trim()}>
      <LibraryHeader title={title} buckets={buckets} bucketId={bucketMeta.id} appRoot={appRoot} bucketMeta={bucketMeta} writable={writable} headerActions={headerActions} headerTrailing={headerTrailing} onTrash={trash ? () => setTrashOpen(true) : undefined}
        onHome={() => { setAppRoot(true); setPickedFile(null); setPrefix('') }}
        onBucket={(v) => { if (v === 'all') { setAppRoot(true); setPrefix('') } else { setAppRoot(false); switchBucket(v) } }}
        onSettings={() => setSettingsOpen(true)} />

      {/* THE BANNER SLOT — anything that must sit directly under the header and above the body.
        * The upload drop zone is why it exists: a consumer rendering it AFTER the page put it
        * below an 800px column browser, so pressing Upload scrolled you past the whole browser to
        * reach the target you had just asked for. A slot is the fix; telling the consumer to
        * re-order is not, because the header is ours and the body is ours and there was no
        * between. */}
      {banner}

      <div className="flex flex-col gap-3">
        {/* Breadcrumb (uppercase, active segment at full ink) · folder-view toggle
          *
          * AT 390 THIS ROW FAILED (ColumnBrowserStackMode items 3 + 7, kol-r2b2
          * 2026-09-03, measured on a live site): breadcrumb, the folder-view
          * toggle and the ROW·COLUMN pair share one `justify-between` line with
          * no wrap or collapse rule, so the crumbs wrapped to two lines and
          * `COLUMN` was cut off. Below `md` the crumb becomes ONE middle-elided
          * path line and the toggles collapse into the settings drawer — where
          * both already live, so nothing new was minted to hold them. Both
          * references (iOS Files, Dropbox) put these behind a `···` too. */}
        <div className="flex items-center justify-between gap-4">
          {/* the elided line — first segment, an ellipsis for anything between,
            * and the current one. Below `md` only. */}
          <div className="flex md:hidden items-center gap-2 kol-mono-12 min-w-0">
            <button className={crumbCls(appRoot)} onClick={() => { setAppRoot(true); setPickedFile(null); setPrefix('') }}>{ROOT}</button>
            {!appRoot && bucketMeta.id && crumbs.length > 1 && (
              <><span className="text-oq-32">/</span><span className="text-oq-32">…</span></>
            )}
            {!appRoot && bucketMeta.id && (
              <span className="flex items-center gap-2 min-w-0">
                <span className="text-oq-32">/</span>
                <button
                  className={`${crumbCls(true)} truncate`}
                  onClick={() => setPrefix(crumbs.length ? crumbs.join('/') + '/' : '')}
                >
                  {(crumbs[crumbs.length - 1] ?? label).toUpperCase()}
                </button>
              </span>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2 kol-mono-12">
            <button className={crumbCls(appRoot)} onClick={() => { setAppRoot(true); setPickedFile(null); setPrefix('') }}>{ROOT}</button>
            {!appRoot && bucketMeta.id && (
              <span className="flex items-center gap-2">
                <span className="text-oq-32 select-none">/</span>
                {crumbs.length === 0 && !(folderView === 'columns' && pickedFile)
                  ? <CopyCrumb className={crumbCls(true)} label={label.toUpperCase()} path={fullPath()} />
                  : <button className={crumbCls(false)} onClick={() => setPrefix('')}>{label.toUpperCase()}</button>}
              </span>
            )}
            {!appRoot && crumbs.map((seg, i) => {
              const to = crumbs.slice(0, i + 1).join('/') + '/'
              const last = i === crumbs.length - 1
              const current = last && !(folderView === 'columns' && pickedFile)
              return (
                <span key={to} className="flex items-center gap-2">
                  <span className="text-oq-32 select-none">/</span>
                  {current
                    ? <CopyCrumb className={crumbCls(true)} label={seg.toUpperCase()} path={fullPath()} />
                    : <button className={crumbCls(false)} onClick={() => setPrefix(to)}>{seg.toUpperCase()}</button>}
                </span>
              )
            })}
            {folderView === 'columns' && pickedFile && pickedFile.key.startsWith(prefix) && (
              <span className="flex items-center gap-2"><span className="text-oq-32 select-none">/</span>
                <CopyCrumb className={crumbCls(true)} label={pickedFile.key.slice(prefix.length).toUpperCase()} path={fullPath(pickedFile.key.slice(prefix.length))} />
              </span>
            )}
          </div>
          {/* the control cluster is desktop-only — below `md` this is the same
            * setting the drawer already carries, and nothing in this row survives 390.
            *
            * ONE SWITCH FOR FOUR VIEWS (the merge, 2026-09-22). Two views were a pair of words;
            * four are an icon strip — the same reason Finder draws four glyphs and no labels.
            * Beside it: the filter bar's funnel and search, which belong to every view now. */}
          <div className="hidden md:flex items-center gap-4">
            {/* FILTER AND SEARCH, ONE WELL (user 2026-09-23): the same chip and height as the view
              * switch beside them — the bare filter frame sat shorter than the well, and search had
              * wandered up to the header. Tooltips are the word, not a sentence. */}
            <ViewToggle variant="icon" viewMode={null} onViewChange={() => {}} options={[
              { value: 'filter', label: 'Filter', icon: 'filter', pressed: filtersOn, onClick: () => setSettings({ ...settings, filters: !filtersOn }) },
              { value: 'search', label: 'Search', icon: 'search', dividerBefore: true, onClick: () => setSearchOpen(true) },
            ]} />
            <Divider variant="vertical" />
            <ViewToggle viewMode={view} onViewChange={setView} variant="icon" options={VIEW_OPTIONS} />
          </div>
        </div>

        {/* PINNED ABOVE THE LIST, below `md` (item 15). Search sits here and not
            inside the ContentFilters wall, because the wall is a DIFFERENT
            SURFACE — on a phone it is a tab away, so a control living in it is
            a control you cannot reach from the thing you are searching. */}
        <div className="flex md:hidden items-center gap-2">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value ?? '')}
            onClear={() => setQuery('')}
            placeholder="Search this bucket"
            size="sm"
            className="flex-1 min-w-0"
          />
          {/* `···` — view mode and sort, the two the desktop cluster carries and
              item 7 left with nowhere to go. `caret={false}`: an icon trigger is
              already complete, and neither reference draws a chevron on it. */}
          <MenuItem
            label={<Icon name="more" size={16} />}
            caret={false}
            align="end"
            buttonClassName="shrink-0 px-2"
          >
            {({ close }) => (
              <div className="py-1 w-[200px]">
                {STACK_VIEW_OPTIONS.map((opt) => (
                  <MenuDropdownItem
                    key={opt.value}
                    onClick={() => { setSettings({ ...settings, stackView: opt.value }); close() }}
                    shortcut={(settings.stackView ?? 'list') === opt.value ? <Icon name="check" size={11} /> : undefined}
                  >
                    {opt.label}
                  </MenuDropdownItem>
                ))}
                <MenuDropdownDivider />
                {SORT_OPTIONS.map((opt) => (
                  <MenuDropdownItem
                    key={opt.value}
                    /* tapping the ACTIVE key flips the direction, which is how
                       both references let you reverse without a second control */
                    onClick={() => {
                      const same = (settings.sortBy ?? 'name') === opt.value
                      setSettings({
                        ...settings,
                        sortBy: opt.value,
                        sortDir: same && settings.sortDir !== 'desc' ? 'desc' : 'asc',
                      })
                      close()
                    }}
                    shortcut={(settings.sortBy ?? 'name') === opt.value
                      ? <Icon name={settings.sortDir === 'desc' ? 'arrow-up' : 'arrow-down'} size={11} />
                      : undefined}
                  >
                    {opt.label}
                  </MenuDropdownItem>
                ))}
              </div>
            )}
          </MenuItem>
        </div>

        {searchOpen && (
          <ShellSearchOverlay
            open
            onClose={() => { setSearchOpen(false); setSearchQuery('') }}
            query={searchQuery}
            onQueryChange={setSearchQuery}
            placeholder="Search this bucket"
            results={searchResults}
            onExpand={() => searchResults[0] && jumpTo(searchResults[0].id)}
            onSelect={(item) => jumpTo(item.id)}
          />
        )}
        {quickLookFolder && (
          <FullscreenOverlay open onClose={() => setQuickLookFolder(null)} scrim>
            <FolderPreview path={quickLookFolder} objects={objects} width={420} formatDate={formatDate} />
          </FullscreenOverlay>
        )}
        {quickLook && (
          <MediaInspector files={quickLook.files} index={quickLook.index} onClose={closeQuickLook} mediaUrl={mediaUrl} downloadUrl={downloadUrl} keySet={keySet} showNav={rowSelection.size > 1}
            onPrev={() => stepQuickLook(-1)} onNext={() => stepQuickLook(1)} />
        )}
        {settingsOpen && (
          <MediaSettings bucketMeta={bucketMeta} settings={settings} profile={profile} onChange={setSettings} onReset={() => setSettings(null)} onClose={() => setSettingsOpen(false)} settingsFooter={settingsFooter} />
        )}
        {trashOpen && trash && (
          <TrashPanel trash={trash} onClose={() => setTrashOpen(false)} run={runAction} confirm={modal.confirm} />
        )}

        {/* THE FILTER BAR, above whichever body is mounted (2026-09-22). It filters FILES, so the
          * tree is scoped to the keys it leaves and the wall renders them directly. Off by default
          * — the funnel in the crumb row turns it on. */}
        {filtersOn ? (
          <ContentFilters
            items={filterItems}
            title="Files"
            totalCount={filterItems.length}
            searchKeys={['displayKey']}
            filterGroups={[{ label: 'Kind', key: 'kind', values: filterKinds }]}
            mutuallyExclusiveFilters={['kind']}
            /* ONE FUNNEL, NOT TWO (2026-09-22): the crumb row's funnel mounts this bar AND opens
             * its panel, and the bar's own funnel closes the bar — the same switch from either
             * end, instead of two controls that each do half of it. */
            filtersOpen
            onFiltersOpenChange={(open) => { if (!open) setSettings({ ...settings, filters: false }) }}
            renderItem={(filtered) => body(filtered)}
          />
        ) : body(null)}

        {/* THE GAPS MATCH ABOVE AND BELOW (user 2026-09-21: "what was unclear about matching the
          * gap above to below"). This carried `mt-2` while the crumb row's icon toggle made that
          * row 8px taller than its text; the toggle was cut 2026-09-22, the crumb row is text
          * height again, and one shared `gap-3` puts both gaps level on its own. */}
        {/* THE COUNT LINE IS EVERY VIEW'S (user 2026-09-23) — and in the grid it carries the tile-size
          * slider at its right end, bare: no glyph, no readout (Finder's). */}
        {isWall ? (
          /* ONE LINE'S HEIGHT, like the other views' count line — the slider is 24px tall and made
           * this row 8px taller than the fill budget, so the page scrolled by that much */
          <div className="flex items-center justify-between gap-4 h-4">
            <p className="kol-mono-12 text-fg-48">
              {wallFiles.length} {wallFiles.length === 1 ? 'file' : 'files'} · {formatSize(wallFiles.reduce((n, o) => n + (o.size ?? 0), 0))}
            </p>
            <input type="range" className="slider-black w-32 cursor-pointer" min={100} max={360} step={20} value={tileSize}
              onChange={(e) => setSettings({ ...settings, tileSize: Number(e.target.value) })} aria-label="Tile size" />
          </div>
        ) : appRoot && folderView === 'columns' && folderTree ? (
          <p className="kol-mono-12 text-fg-48">
            {buckets.length} buckets · {Object.values(folderTree).reduce((n, t) => n + (t.files ?? 0), 0)} files · {formatSize(Object.values(folderTree).reduce((n, t) => n + (t.bytes ?? 0), 0))}
          </p>
        ) : (
          <p className="kol-mono-12 text-fg-48">
            {folders.length > 0 && `${folders.length} folder${folders.length > 1 ? 's' : ''} · `}
            {rawFiles.length} {rawFiles.length === 1 ? 'file' : 'files'} · {formatSize(totalBytes)}
            {/* THE GREY TAIL TOTALS WHERE YOU STAND (kol-client-olina 2026-09-23): the bucket at the
              * root, the current folder recursively below it. Hidden when it would repeat the
              * bright part — a leaf has nothing beneath it to add. */}
            {!prefix && rawFiles.length !== bucketFiles && <span className="text-fg-32">{'  ·  bucket: '}{bucketFiles} files · {formatSize(bucketBytes)}</span>}
            {prefix && scoped.length !== levelFiles.length && <span className="text-fg-32">{`  ·  in ${crumbs.at(-1)}: `}{scoped.length} files · {formatSize(scoped.reduce((n, o) => n + (o.size || 0), 0))}</span>}
            {systemCount > 0 && <span className="text-fg-32">{'  ·  '}{systemCount} system files hidden</span>}
          </p>
        )}
        {void onOpen}

        {/* ONE MENU FOR EVERY ROW. `useContextMenu` carries the payload from whichever row opened
          * it, so this is a single instance rather than one per row, and the entries are built from
          * what `fileActions` actually supplies — a read-only bucket gets no menu at all. */}
        {canWrite && (
          <ContextMenu menu={menu}>
            {(target) => {
              if (!target) return null
              const isFolder = target.type === 'folder'
              const isLevel = target.type === 'level'
              /* A SELECTION OF MORE THAN ONE takes over the verbs that can act on a set. Rename is
               * not one of them — renaming five things to one name is not a thing — so it stays
               * single and disappears from a multi-selection rather than lying about what it does. */
              const many = (target.targets ?? []).length > 1 ? target.targets : null
              const custom = (fileActions.items ?? []).filter((it) => !it.when || it.when(target))
              const customItems = custom.length > 0 && (
                <>
                  <MenuDropdownDivider />
                  {custom.map((it) => (
                    <MenuDropdownItem key={it.label} iconLeft={it.icon ? <Icon name={it.icon} size={14} /> : undefined} onClick={() => runAction(() => it.run(target))}>{it.label}</MenuDropdownItem>
                  ))}
                </>
              )
              if (many) {
                return (
                  <>
                    <MenuDropdownItem disabled>{many.length} selected</MenuDropdownItem>
                    <MenuDropdownDivider />
                    {fileActions.move && (
                      <MenuDropdownItem iconLeft={<Icon name="arrow-right" size={14} />} onClick={() => doBatch(many, 'move', 'Move')}>Move {many.length} to…</MenuDropdownItem>
                    )}
                    {many.every((p) => !p.endsWith('/')) && (
                      <>
                        <MenuDropdownItem iconLeft={<Icon name="copy" size={14} />} onClick={() => doCopyUrl(many)}>Copy {many.length} URLs</MenuDropdownItem>
                        <MenuDropdownItem iconLeft={<Icon name="download" size={14} />} onClick={() => doDownload(many)}>Download {many.length}</MenuDropdownItem>
                      </>
                    )}
                    {fileActions.remove && (
                      <MenuDropdownItem iconLeft={<Icon name="trash" size={14} />} onClick={() => doBatch(many, 'remove', 'Delete')}>Delete {many.length}</MenuDropdownItem>
                    )}
                    {customItems}
                  </>
                )
              }
              return (
                <>
                  {fileActions.createFolder && (
                    <MenuDropdownItem iconLeft={<Icon name="folder" size={14} />} onClick={() => doCreateFolder(isFolder ? target.path : (isLevel ? target.path : prefix))}>
                      New folder{isFolder ? ` in ${target.path.replace(/\/$/, '').split('/').pop()}` : ''}
                    </MenuDropdownItem>
                  )}
                  {fileActions.createFile && (
                    <MenuDropdownItem iconLeft={<Icon name="file" size={14} />} onClick={() => doCreateFile(isFolder ? target.path : (isLevel ? target.path : prefix))}>
                      New file
                    </MenuDropdownItem>
                  )}
                  {dropFilesTo && !(target.type === 'file') && (
                    <MenuDropdownItem iconLeft={<Icon name="upload" size={14} />} onClick={() => doUpload(target.path)}>
                      {isFolder ? `Upload into ${target.path.replace(/\/$/, '').split('/').pop()}…` : 'Upload here…'}
                    </MenuDropdownItem>
                  )}
                  {!isLevel && <MenuDropdownDivider />}
                  {!isLevel && fileActions.rename && (
                    <MenuDropdownItem iconLeft={<Icon name="edit" size={14} />} onClick={() => doRename(target.path, isFolder)}>Rename</MenuDropdownItem>
                  )}
                  {!isLevel && fileActions.move && (
                    <MenuDropdownItem iconLeft={<Icon name="arrow-right" size={14} />} onClick={() => doMove(target.path)}>Move to…</MenuDropdownItem>
                  )}
                  {/* A FOLDER GETS COPY URL TOO (user 2026-09-23) — through the SAME `mediaUrl`
                      seam a file goes through, so what a folder URL means is the consumer's call
                      (a CDN prefix, a listing, a signed path) and never this page's guess. No
                      Download: a folder is not an object to fetch. */}
                  {!isLevel && (
                    <MenuDropdownItem iconLeft={<Icon name="copy" size={14} />} onClick={() => doCopyUrl([target.path])}>Copy URL</MenuDropdownItem>
                  )}
                  {target.type === 'file' && (
                    <MenuDropdownItem iconLeft={<Icon name="download" size={14} />} onClick={() => doDownload([target.path])}>Download</MenuDropdownItem>
                  )}
                  {!isLevel && fileActions.remove && (
                    <>
                      <MenuDropdownDivider />
                      <MenuDropdownItem iconLeft={<Icon name="trash" size={14} />} onClick={() => doDelete(target.path, isFolder)}>Delete</MenuDropdownItem>
                    </>
                  )}
                  {customItems}
                </>
              )
            }}
          </ContextMenu>
        )}
        {busyAction && <span className="sr-only" role="status">Working…</span>}

        {/* THE TAB PILL (item 16) — floats over the list, so the list owes it
            room or its last row sits under the bar forever.
            THE SPACER GOES LAST, AND THAT IS THE WHOLE POINT
            (TabBarSpacerAboveTheList, kol-r2b2 2026-09-04). `MobileTabBar` is
            `fixed`, so where it sits in the tree is irrelevant — the SPACER is
            in NORMAL FLOW, so its position is everything. Rendered before the
            list it failed twice at once: a 56px hole punched into the gap under
            the pinned search, and the last row still running 99px under the
            bar. The comment above named the failure it was meant to prevent and
            the block sat in the wrong place anyway. Below `md` only; above it
            the 2026-08-26 one-view ruling stands. */}
        {tabs?.length > 0 && (
          <>
            <div className="md:hidden" aria-hidden="true" style={{ height: TABBAR_H }} />
            <MobileTabBar tabs={tabs} value={activeTab} onChange={onTabChange} />
          </>
        )}
      </div>
    </div>
  )
}


/* ── THE WALL, as a body ────────────────────────────────────────────────────
 * The grid / list of files, its paging and its inspector, lifted out of
 * `MediaLibraryLibrary` so ONE surface can render it beside the folder views
 * (the merge, user 2026-09-22: "they both just display files"). The page above
 * it owns the listing, the filtering and the selection; this owns the tiles.
 *
 * `renderName` / `renderActions` are seams because the standalone wall edits a
 * name in place and the merged surface does not — the markup is the same either
 * way, which is the whole reason this is one component and not two.
 */
/* The kinds that ARE a document — the ones whose page is worth zooming into a tile. */
const DOC_KINDS = new Set(['markdown', 'json', 'yaml', 'text', 'code'])

/* THE TILE MEASURES ITSELF (user 2026-09-23: *"is nothing about the thumbnails responsive?"*).
 * A document in a tile is zoomed, and the zoom was a fixed step — so the same file read one size
 * in a 260px card and another in a 400px one, because `zoom` reflows the page: at zoom z a
 * `width: 100%` page lays out at box/z CSS pixels. Solving for a CONSTANT page width keeps the
 * text the same physical size at every tile size: z = box / PAGE. That number cannot be derived
 * in CSS from the box, which is why this measures.
 *
 * `PAGE` is the width the page is laid out AT, not a paper size: 720 is where the doc page's
 * 24px padding, prose measure and code blocks read as a page rather than as a column of wrap. */
/* CODE IS NOT PROSE, so it is not laid out on a prose page (user 2026-09-23: *"code is small here
 * in the container"*). A narrower target page means a bigger zoom for the same box, which is what
 * makes 60-column code readable in a tile where a 720px page turned it into texture. */
const DOC_PAGE_W = 720
const CODE_PAGE_W = 460
const pageWidthFor = (kind) => (kind === 'markdown' || kind === 'text' ? DOC_PAGE_W : CODE_PAGE_W)
const DOC_ZOOM_MIN = 0.18
const DOC_ZOOM_MAX = 0.6

function DocThumb({ children, className, onClick, pageWidth = DOC_PAGE_W }) {
  const box = useRef(null)
  const [zoom, setZoom] = useState(null)
  useEffect(() => {
    const el = box.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const measure = () => {
      const w = el.getBoundingClientRect().width
      if (!w) return
      setZoom(Math.min(DOC_ZOOM_MAX, Math.max(DOC_ZOOM_MIN, Math.round((w / pageWidth) * 100) / 100)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [pageWidth])
  return (
    <div ref={box} className={className} onClick={onClick} style={zoom ? { '--kol-thumb-zoom': zoom } : undefined}>
      {children}
    </div>
  )
}

export function WallBody({
  files, layout = 'list', sortBy = 'name', sortDir = 'asc', pageSize = 200, listId = '', cardMin = 260,
  mediaUrl, downloadUrl, keySet, videoPreview, formatDate = defaultFormatDate,
  selected, selectMode = false, onToggleSelect, onSorted, onContextMenu, onPick,
  /* ONE INSPECTOR (user 2026-09-23). Given `onOpen`, the wall hands the open UP and keeps no
   * lightbox of its own — otherwise a page that also opens one (space, a row double-click) ends up
   * with two stacked overlays of the same file. The standalone wall passes nothing and keeps its
   * own, exactly as it was. */
  onOpen,
  renderName = (o) => o.displayKey?.split('/').pop() ?? o.key.split('/').pop(),
  renderActions,
  /* `tiles="media"` (2026-09-23) — the file manager's grid: `MediaTile`, preview over name, no card
   * and no buttons (the verbs live in the right-click menu and Quick Look). `card` is the site
   * wall's `ContentCard` and stays the default, so an embedded wall renders exactly as before. */
  tiles = 'card',
  /* the grid's drag-select band and its empty-space click — both the page's, like the rows' */
  marquee, onBackgroundClick,
}) {
  const PAGE = pageSize || Infinity
  const [visible, setVisible] = useState(PAGE)
  const [lastListId, setLastListId] = useState(listId)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  if (listId !== lastListId) { setLastListId(listId); setVisible(PAGE) }
  if (layout === 'off') return null

  /* ONE PREVIEWER — `KindPreview`, as the column pane uses. An image is the caller's <img>, a
   * video keeps its sibling poster when the bucket has one, and every other kind falls through. */
  const renderThumb = (o, onClick) => {
    const kind = kindOf(o)
    const poster = (isVideo(o.contentType) || kind === 'playlist') ? posterFor(o.key, keySet) : null
    const imgSrc = isImage(o.contentType) ? mediaUrl(o.key) : poster && videoPreview !== 'none' ? mediaUrl(poster) : null
    if (imgSrc) return <img src={imgSrc} alt="" loading="lazy" className={onClick ? 'cursor-zoom-in' : undefined} onClick={onClick || undefined} />
    if (isVideo(o.contentType) && videoPreview === 'none') {
      return (
        <div className={`w-full h-full flex items-center justify-center bg-oq-04 overflow-hidden${onClick ? ' cursor-zoom-in' : ''}`} onClick={onClick || undefined}>
          <span className="kol-mono-12 text-fg-48">video</span>
        </div>
      )
    }
    /* ONE LADDER (user 2026-09-23). Every kind that is not the caller's own image goes through
     * `KindPreview` at `fit="tile"` — audio gets the same tile the pane shows, a PDF its first
     * page, a document its zoomed page. The glyph branch that stood here was a second ladder, and
     * a second ladder is the thing this pass exists to delete: a glyph is for a FOLDER. */
    const cls = `kol-media-thumb w-full h-full flex items-center justify-center bg-oq-04 overflow-hidden${onClick ? ' cursor-zoom-in' : ''}`
    const preview = <KindPreview o={o} fit="tile" urlOf={(x) => mediaUrl(x.key)} poster={poster ? mediaUrl(poster) : undefined} kindOf={kindOf} kindLabel={KIND_LABEL} />
    if (DOC_KINDS.has(kind)) {
      return <DocThumb className={cls} pageWidth={pageWidthFor(kind)} onClick={onClick || undefined}>{preview}</DocThumb>
    }
    return <div className={cls} onClick={onClick || undefined}>{preview}</div>
  }

  const sorted = sortFiles(files, sortBy, sortDir)
  onSorted?.(sorted)
  const shown = sorted.slice(0, visible)
  const more = sorted.length - shown.length
  const isSelected = (key) => !!selected?.has(key)
  const openAt = (o, idx) => (onOpen ? onOpen(o, sorted) : setLightboxIndex(idx))
  return (
    <div className="flex flex-col gap-3">
      {sorted.length === 0 ? null : layout !== 'grid' ? (
        <div className="flex flex-col">
          {shown.map((o, idx) => (
            <ContentRow key={o.key} variant="default" media={renderThumb(o, null)} title={renderName(o)} date={formatDate(o.uploaded)} size={formatSize(o.size)}
              actions={renderActions?.(o, true)} selected={isSelected(o.key)}
              onContextMenu={onContextMenu ? (e) => onContextMenu(e, o) : undefined}
              onDoubleClick={() => openAt(o, idx)}
              onClick={selectMode ? (e) => onToggleSelect?.(idx, o.key, e.shiftKey) : onPick ? (e) => onPick(o, e, sorted.map((f) => f.key)) : undefined} />
          ))}
        </div>
      ) : tiles === 'media' ? (
        <div ref={marquee?.ref} {...marquee?.props} className="relative grid gap-x-3 gap-y-5"
          style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${cardMin}px, 1fr))` }}
          onClick={(e) => { if (!e.target.closest('[data-marquee-key]')) onBackgroundClick?.() }}>
          {marquee?.rect && <div className="kol-marquee" style={marquee.rect} />}
          {shown.map((o, idx) => (
            <MediaTile key={o.key} markKey={o.key} preview={renderThumb(o, null)} name={renderName(o)} selected={isSelected(o.key)}
              onContextMenu={onContextMenu ? (e) => onContextMenu(e, o) : undefined}
              onDoubleClick={() => openAt(o, idx)}
              onClick={onPick ? (e) => onPick(o, e, sorted.map((f) => f.key)) : undefined} />
          ))}
        </div>
      ) : (
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${cardMin}px, 1fr))` }}>
          {shown.map((o, idx) => (
            <ContentCard key={o.key} variant="default" media={renderThumb(o, null)}
              control={<ActionButton chrome="media" icon="download" confirmIcon="check" label="Download" confirmLabel="Downloaded" href={downloadUrl(o.key)} />}
              controlStart={selectMode ? <ToggleCheckbox variant="media" checked={isSelected(o.key)} onChange={() => onToggleSelect?.(idx, o.key, false)} onClick={(e) => e.stopPropagation()} aria-label={`Select ${o.key}`} /> : undefined}
              title={renderName(o)} date={formatDate(o.uploaded)} size={<SizeOrDownload href={downloadUrl(o.key)}>{formatSize(o.size)}</SizeOrDownload>}
              actions={renderActions?.(o)} selected={isSelected(o.key)}
              onContextMenu={onContextMenu ? (e) => onContextMenu(e, o) : undefined}
              /* ONE GESTURE SET ACROSS THE THREE VIEWS (2026-09-23): click selects, double-click
               * opens, right-click is the menu. The media used to open on a single click, which
               * made the grid the one view where a click did something else. */
              onDoubleClick={() => openAt(o, idx)}
              onClick={selectMode ? (e) => onToggleSelect?.(idx, o.key, e.shiftKey) : onPick ? (e) => onPick(o, e, sorted.map((f) => f.key)) : undefined} />
          ))}
        </div>
      )}
      {more > 0 && (
        <button type="button" onClick={() => setVisible((v) => v + PAGE)} className="kol-mono-12 text-fg-48 hover:text-fg-default transition-colors self-start py-2">
          Show {Math.min(more, PAGE)} more · {more} remaining
        </button>
      )}
      {lightboxIndex !== null && !onOpen && (
        <MediaInspector files={sorted} index={lightboxIndex} onClose={() => setLightboxIndex(null)} mediaUrl={mediaUrl} downloadUrl={downloadUrl} keySet={keySet}
          onPrev={() => setLightboxIndex((i) => (i - 1 + sorted.length) % sorted.length)} onNext={() => setLightboxIndex((i) => (i + 1) % sorted.length)} />
      )}
    </div>
  )
}

/* ══ LIBRARY — the content-filters wall ═══════════════════════════════════ */
export function MediaLibraryLibrary({
  client, title = 'MEDIA', bucket, onBucketChange, prefix = '', defaults, settings: settingsProp, onSettingsChange,
  headerActions, headerTrailing, refreshKey, header = true, stats = true, settingsFooter, className = '', banner,
  /* the same pill the browse page takes — the wall is one of the surfaces it
     switches between, so it has to carry it too (item 16) */
  tabs, activeTab, onTabChange,
  /* A SEAM ON ONE PAGE IS A SEAM ON BOTH, when the field is one both render
   * (FormatDateSkipsTheLibraryPage, kol-r2b2 2026-09-04). This reached
   * `MediaLibraryBrowse` and not here, so a consumer passing ONE props object
   * to both got `19.6.2026` on the Browse tab and `2026-06-19` on the Files tab
   * — two formats for one field, one tap apart. The desktop stack had the same
   * mismatch; the tab pill just moved the two halves close enough to see it.
   *
   * THE RULE, WIDENED — the fourth defect of this exact shape (`settingsFooter`
   * documented and hardcoded past · `thumbnailFor` and `folderMeta` not
   * forwarded · now this). These two pages are ONE SURFACE SPLIT IN TWO and a
   * consumer hands the same props object to both, so: a prop naming how a
   * SHARED FIELD renders is added to BOTH pages in the same edit. Props about a
   * concept only one page has stay put — `thumbnailFor`, `folderMeta` and
   * `stackView` are folder and stack concepts and are correctly absent here. */
  formatDate = defaultFormatDate,
}) {
  const [ownBucket, setOwnBucket] = useState(bucket)
  const bucketId = bucket ?? ownBucket
  const lib = useBucketLibrary({ client, bucket: bucketId, defaults, settings: settingsProp, onSettingsChange, refreshKey })
  const { buckets, bucketMeta, settings, setSettings, objects, setObjects, error, mediaUrl, downloadUrl, writable } = lib
  /* the same one dialog idiom as the browse page — see its note on `useModal()` */
  const modal = useModal()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [editingKey, setEditingKey] = useState(null)
  const [editingValue, setEditingValue] = useState('')
  const [renaming, setRenaming] = useState(false)
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState(() => new Set())
  const [lastIdx, setLastIdx] = useState(null)
  const [busy, setBusy] = useState(false)
  const sortedRef = useRef([])
  /* the wall is FLAT by default — the folders are the browse page's */
  const { flat = true, layout, sortBy, sortDir, pageSize, videoPreview } = { flat: true, ...settings }
  const kinds = new Set(settings.kinds)
  const setFlat = (v) => setSettings({ ...settings, flat: v })
  const setLayout = (v) => setSettings({ ...settings, layout: v })
  const listId = `${prefix}|${flat}|${[...kinds].sort().join(',')}|${pageSize}|${refreshKey}|${bucketMeta.id}`
  const handleSort = (field) => setSettings(sortBy === field ? { ...settings, sortDir: sortDir === 'asc' ? 'desc' : 'asc' } : { ...settings, sortBy: field, sortDir: 'asc' })

  useEffect(() => {
    if (!selectMode) return undefined
    const onKey = (e) => { if (e.key === 'Escape') { setSelectMode(false); setSelected(new Set()); setLastIdx(null) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectMode])

  if (error) return <p className="kol-mono-12 text-ui-error">Error: {error}</p>

  const scoped = prefix ? objects.filter((o) => o.key.startsWith(prefix)) : objects
  const { files: dirFiles } = partition(scoped, prefix)
  const flatFiles = scoped.map((o) => ({ ...o, displayKey: prefix ? o.key.slice(prefix.length) : o.key }))
  const levelFiles = flat ? flatFiles : dirFiles
  const systemCount = levelFiles.filter((o) => isSystemFile(o.key)).length
  const visibleFiles = kinds.has('system') ? levelFiles : levelFiles.filter((o) => !isSystemFile(o.key))
  const keySet = new Set(objects.map((o) => o.key))
  const grouped = settings.groupVariants ? groupVariants(visibleFiles) : visibleFiles
  const rawFiles = (settings.foldSegments ? groupSegments(grouped) : grouped).map((o) => ({ ...o, kind: kindOf(o), poster: posterFor(o.key, keySet) }))
  const profile = profileOf(objects, rawFiles, systemCount)
  const presentKinds = Object.keys(profile.kinds).sort()
  const files = rawFiles.filter((o) => kinds.has(o.kind))
  const chipKinds = presentKinds.filter((k) => kinds.has(k))
  const totalBytes = rawFiles.reduce((n, o) => n + (o.totalSize ?? o.size ?? 0), 0)

  const handleCopy = (key) => navigator.clipboard.writeText(mediaUrl(key))
  const handleDelete = async (key) => {
    if (!(await modal.confirm(`Delete "${key}"? This cannot be undone.`, { okLabel: 'Delete' }))) return
    try { await client.deleteObject(key); setObjects((prev) => prev.filter((o) => o.key !== key)) } catch (e) { await modal.alert(`Delete failed: ${e.message}`) }
  }
  const startRename = (key) => { setEditingKey(key); setEditingValue(key) }
  const cancelRename = () => { setEditingKey(null); setEditingValue('') }
  const commitRename = async () => {
    const from = editingKey; const to = editingValue.trim()
    if (!from || !to || from === to) { cancelRename(); return }
    setRenaming(true)
    try { const r = await client.renameObject(from, to); const newKey = r?.to || to; setObjects((prev) => prev.map((o) => (o.key === from ? { ...o, key: newKey } : o))); setEditingKey(null); setEditingValue('') }
    catch (e) { await modal.alert(`Rename failed: ${e.message}`) } finally { setRenaming(false) }
  }
  const toggleSelect = (idx, key, shift) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (shift && lastIdx !== null) { const [a, b] = [Math.min(lastIdx, idx), Math.max(lastIdx, idx)]; for (let i = a; i <= b; i++) next.add(sortedRef.current[i].key) }
      else if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
    setLastIdx(idx)
  }
  const selectAll = () => setSelected(new Set(sortedRef.current.map((o) => o.key)))
  const exitSelect = () => { setSelectMode(false); setSelected(new Set()); setLastIdx(null) }
  const batchMove = async () => {
    const folder = await modal.prompt(`Move ${selected.size} file(s) into folder (under ${prefix || 'root'}):`, '', { okLabel: 'Move' })
    if (folder == null) return
    const clean = folder.replace(/^\/+|\/+$/g, '').trim()
    if (!clean) return
    setBusy(true)
    const remap = new Map(); const failures = []
    for (const from of selected) {
      const to = moveKey(from, prefix, clean)
      if (from === to) continue
      try { const r = await client.renameObject(from, to); remap.set(from, r?.to || to) } catch (e) { failures.push(`${from.split('/').pop()}: ${e.message}`) }
    }
    setObjects((prev) => prev.map((o) => (remap.has(o.key) ? { ...o, key: remap.get(o.key) } : o)))
    setBusy(false); exitSelect()
    if (failures.length) await modal.alert(`Moved ${remap.size}. ${failures.length} failed:\n${failures.join('\n')}`)
  }
  const batchDelete = async () => {
    if (!(await modal.confirm(`Delete ${selected.size} file(s)? This cannot be undone.`, { okLabel: 'Delete' }))) return
    setBusy(true)
    const done = []; const failures = []
    for (const key of selected) { try { await client.deleteObject(key); done.push(key) } catch (e) { failures.push(`${key.split('/').pop()}: ${e.message}`) } }
    setObjects((prev) => prev.filter((o) => !done.includes(o.key)))
    setBusy(false); exitSelect()
    if (failures.length) await modal.alert(`Deleted ${done.length}. ${failures.length} failed:\n${failures.join('\n')}`)
  }
  const batchDownload = () => {
    for (const key of selected) { const a = document.createElement('a'); a.href = downloadUrl(key); a.download = key.split('/').pop(); document.body.appendChild(a); a.click(); a.remove() }
  }

  const renderActions = (o, row = false) => {
    if (editingKey === o.key) {
      return (
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={commitRename} disabled={renaming}>{renaming ? 'Saving…' : 'Save'}</Button>
          <Button variant="ghost" size="sm" onClick={cancelRename} disabled={renaming}>Cancel</Button>
        </div>
      )
    }
    return (
      <div className={row ? 'flex translate-y-[2px] items-center gap-2' : 'flex h-full flex-col items-center justify-between'}>
        {!selectMode && (
          <>
            <ActionButton chrome="inline" size="sm" icon="copy" confirmIcon="check" label="Copy URL" confirmLabel="Copied" onAction={() => handleCopy(o.key)} />
            {writable && !row && <span className="invisible" aria-hidden><ActionButton chrome="inline" size="sm" icon="trash" label="" /></span>}
          </>
        )}
        {writable && selectMode && (
          <>
            <ActionButton chrome="inline" size="sm" icon="edit" label="Rename" onAction={() => startRename(o.key)} />
            <ActionButton chrome="inline" size="sm" icon="trash" confirmIcon="check" label="Delete" confirmLabel="Deleted" onAction={() => handleDelete(o.key)} />
          </>
        )}
      </div>
    )
  }
  const renderNameCell = (o) => {
    if (editingKey === o.key) {
      return <Input size="sm" width="100%" value={editingValue} autoFocus disabled={renaming} onChange={(e) => setEditingValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') cancelRename() }} />
    }
    return o.displayKey.split('/').pop()
  }
  const layoutOptions = [
    ...(writable ? [{ value: 'grid', label: selectMode ? 'CANCEL' : 'SELECT', active: !selectMode, title: 'Select multiple files', onClick: () => (selectMode ? exitSelect() : setSelectMode(true)) }] : []),
    { value: 'list', label: flat ? 'TREE' : 'FLAT', active: flat, title: 'Show all files recursively', onClick: () => setFlat(!flat) },
  ]

  return (
    <div className={`flex flex-col gap-6 ${className}`.trim()}>
      {header && (
        <LibraryHeader title={title} buckets={buckets} bucketId={bucketMeta.id} appRoot={false} bucketMeta={bucketMeta} writable={writable} headerActions={headerActions} headerTrailing={headerTrailing}
          onBucket={(v) => { if (v === 'all') return; if (bucket == null) setOwnBucket(v); onBucketChange?.(v) }} onSettings={() => setSettingsOpen(true)} />
      )}
      {/* A SEAM ON ONE PAGE IS A SEAM ON BOTH — `banner` is shared chrome, so it lands here in the
        * same edit it landed on the browse page. See the note on `formatDate` above. */}
      {banner}
      {settingsOpen && (
        <MediaSettings bucketMeta={bucketMeta} settings={settings} profile={profile} onChange={setSettings} onReset={() => setSettings(null)} onClose={() => setSettingsOpen(false)} settingsFooter={settingsFooter} />
      )}

      {/* `stats={false}` (ColumnBrowserSeams, kol-r2b2 2026-08-28) — beside `header={false}`: a browse
        * page stacked above this one already prints the folder-aware count ("it used to be a row") */}
      {stats && (
        <p className="kol-mono-12 text-fg-48">
          {files.length !== rawFiles.length ? `${files.length} of ${rawFiles.length}` : rawFiles.length}{' '}{rawFiles.length === 1 ? 'file' : 'files'} · {formatSize(totalBytes)}
          {systemCount > 0 && <span className="text-fg-32">{'  ·  '}{systemCount} system files hidden</span>}
        </p>
      )}

      <ContentFilters
        items={files}
        title="Files"
        totalCount={files.length}
        searchKeys={['displayKey']}
        filterGroups={[{ label: 'Kind', key: 'kind', values: chipKinds }]}
        mutuallyExclusiveFilters={['kind']}
        leadingActions={writable ? (
          <div className={`flex items-center gap-4 kol-mono-12 text-fg-48 h-8 ${selectMode ? '' : 'hidden'}`} aria-hidden={!selectMode}>
            <span className="text-fg-default">{selected.size} selected</span>
            <button type="button" onClick={selectAll} className="hover:text-fg-default transition-colors">Select all ({files.length})</button>
            <Divider variant="vertical" />
            <button type="button" disabled={!selected.size || busy} onClick={batchMove} className="hover:text-fg-default transition-colors disabled:opacity-40 disabled:pointer-events-none">Move to folder…</button>
            <button type="button" disabled={!selected.size || busy} onClick={batchDownload} className="hover:text-fg-default transition-colors disabled:opacity-40 disabled:pointer-events-none">Download</button>
            <button type="button" disabled={!selected.size || busy} onClick={batchDelete} className="hover:text-fg-default transition-colors disabled:opacity-40 disabled:pointer-events-none">Delete</button>
            {busy && <span>working…</span>}
          </div>
        ) : undefined}
        layoutPlacement="header"
        layoutClassName="kol-helper-14"
        layoutOptions={layoutOptions}
        layout={layout}
        onLayoutChange={setLayout}
        trailingActions={<div className="flex items-center gap-6"><ViewToggle viewMode={layout} onViewChange={setLayout} variant="icon" options={LAYOUT_OPTIONS} /></div>}
        belowActions={layout === 'off' ? null : <div className="h-8 flex items-center"><SortControls options={SORT_OPTIONS} sortBy={sortBy} sortDir={sortDir} onSort={handleSort} /></div>}
        /* ONE WALL BODY, shared with the merged surface (2026-09-22) */
        renderItem={(filtered) => (
          <WallBody files={filtered} layout={layout} sortBy={sortBy} sortDir={sortDir} pageSize={pageSize} listId={listId}
            mediaUrl={mediaUrl} downloadUrl={downloadUrl} keySet={keySet} videoPreview={videoPreview} formatDate={formatDate}
            selected={selected} selectMode={selectMode} onToggleSelect={toggleSelect} onSorted={(list) => { sortedRef.current = list }}
            renderName={renderNameCell} renderActions={renderActions} />
        )}
      />

      {/* the pill again — the wall is one of the surfaces it switches, so it
          carries the same bar and owes it the same room (item 16) */}
      {tabs?.length > 0 && (
        <>
          <div className="md:hidden" aria-hidden="true" style={{ height: TABBAR_H }} />
          <MobileTabBar tabs={tabs} value={activeTab} onChange={onTabChange} />
        </>
      )}
    </div>
  )
}
