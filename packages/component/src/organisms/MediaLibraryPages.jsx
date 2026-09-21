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
import ContentRow from '../molecules/ContentRow.jsx'
import SortControls from '../molecules/SortControls.jsx'
import SearchInput from '../molecules/SearchInput.jsx'
import MobileTabBar, { TABBAR_H } from '../molecules/MobileTabBar.jsx'
import { MenuItem, MenuDropdownItem, MenuDropdownDivider } from '../molecules/MenuItem.jsx'
import { Tooltip } from '../utilities/Popover.jsx'
import ContextMenu, { useContextMenu } from '../utilities/ContextMenu.jsx'
import KindPreview from '../molecules/KindPreview.jsx'
import AudioSheet from '../molecules/AudioSheet.jsx'
import VideoSheet from '../molecules/VideoSheet.jsx'
import { formatLength } from '../molecules/AudioPreview.jsx'
import FullscreenOverlay from '../utilities/FullscreenOverlay.jsx'
import ContentFilters from './ContentFilters.jsx'
import ColumnBrowser from './ColumnBrowser.jsx'
import SettingsPanel, { LabeledControlSection, SettingsRow, SettingsSwitch, SettingsChoice, SettingsMulti, SettingsFooter } from './SettingsPanel.jsx'
import { kindOf, KIND_LABEL, KINDS, DEFAULT_KINDS, isSystemFile, isSegment, groupSegments, groupVariants, posterFor, partition } from '../utilities/mediaKinds.js'
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
  columnHeight: 528,
  columnWidths: {},
}

const LAYOUT_OPTIONS = [
  { value: 'grid', label: 'Grid', icon: 'grid' },
  { value: 'list', label: 'List', icon: 'view-list' },
  { value: 'off', label: 'Off', icon: 'eye-off' },
]
const FOLDER_VIEW_OPTIONS = [
  { value: 'rows', label: 'Rows', icon: 'view-list' },
  { value: 'columns', label: 'Columns', icon: 'columns' },
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

/* `struck` = folder grouping is bypassed (flat mode) — still navigable, de-emphasised.
 *
 * `depth` indents a row under the folder it was expanded from; `expanded`/`onToggle` draw the
 * disclosure twisty. A folder row without `onToggle` keeps the old behaviour exactly — one chevron
 * that navigates — so nothing that already renders these moves. */
function FolderRow({ name, onClick, struck = false, depth = 0, expanded, onToggle, meta, onContextMenu, drag, selected }) {
  const [over, setOver] = useState(false)
  /* A FOLDER IS A DROP TARGET. `drag` carries the page's move verb and the path this row is; the
   * row highlights only while something is actually over it, so an accidental hover reads as
   * nothing. Without `drag` every handler below is undefined and the row is exactly what it was. */
  const dropProps = drag ? {
    draggable: true,
    onDragStart: (e) => { e.stopPropagation(); drag.onDragStart(e, drag.path) },
    onDragOver: (e) => { if (drag.canDrop(drag.path)) { e.preventDefault(); setOver(true) } },
    onDragLeave: () => setOver(false),
    onDrop: (e) => { e.preventDefault(); e.stopPropagation(); setOver(false); drag.onDrop(drag.path) },
  } : {}
  return (
    <li onContextMenu={onContextMenu} {...dropProps} className={`flex items-center gap-3 py-2 border-b cursor-pointer transition-colors px-1 rounded ${over ? 'bg-fg-08' : selected ? 'bg-fg-04' : 'hover:bg-fg-04'}`} style={{ borderColor: 'var(--kol-fg-08)', paddingLeft: depth * 20 + 4 }} onClick={onClick}>
      {onToggle ? (
        <button type="button" aria-label={expanded ? `Collapse ${name}` : `Expand ${name}`} aria-expanded={!!expanded}
          onClick={(e) => { e.stopPropagation(); onToggle() }}
          className="w-4 h-4 shrink-0 flex items-center justify-center text-fg-32 hover:text-fg-default transition-transform"
          style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}>
          <Icon name="chevron-right" size={12} />
        </button>
      ) : <span className="w-4 shrink-0" />}
      <div className="w-8 h-8 shrink-0 flex items-center justify-center text-fg-48"><Icon name="folder" size={18} /></div>
      <span className={`kol-mono-12 flex-1 min-w-0 truncate ${struck ? 'line-through text-fg-48' : 'text-fg-default'}`}>{name}</span>
      {meta && <span className="kol-mono-12 text-fg-32 shrink-0">{meta}</span>}
      <Icon name="chevron-right" size={14} className="text-fg-32 shrink-0" />
    </li>
  )
}

/* One expanded level, drawn inline under its folder, recursing for anything expanded beneath it —
 * the disclosure behaviour a list view is expected to have. Depth only indents; the data comes from
 * the same `rowLevel` the top level uses, so an expanded branch cannot disagree with the columns. */
function RowSubtree({ level, depth, rowLevel, expanded, onToggle, onOpenFolder, onOpenFile, formatDate, folderMeta, thumbnailFor, flat, onRowContextMenu, dragFor }) {
  const { folders, files } = rowLevel(level)
  return (
    <>
      {folders.map((f) => {
        const path = level + f
        const open = expanded.has(path)
        return (
          <Fragment key={path}>
            <FolderRow
              name={f} depth={depth} struck={flat} expanded={open}
              meta={folderMeta?.(path) || undefined}
              onToggle={() => onToggle(path)}
              onContextMenu={(e) => onRowContextMenu?.(e, { type: 'folder', path })}
              drag={dragFor?.(path)}
              onClick={() => onOpenFolder(path)}
            />
            {open && <RowSubtree
              level={path} depth={depth + 1} rowLevel={rowLevel} expanded={expanded} onToggle={onToggle}
              onOpenFolder={onOpenFolder} onOpenFile={onOpenFile} onRowContextMenu={onRowContextMenu} dragFor={dragFor}
              formatDate={formatDate} folderMeta={folderMeta} thumbnailFor={thumbnailFor} flat={flat}
            />}
          </Fragment>
        )
      })}
      {files.map((o) => (
        <FileRow key={o.key} o={o} depth={depth} formatDate={formatDate} thumb={thumbnailFor?.(o)}
          onContextMenu={(e) => onRowContextMenu?.(e, { type: 'file', path: o.key, o })}
          drag={dragFor?.(o.key)}
          onClick={() => onOpenFile(o)} />
      ))}
    </>
  )
}

/* The file half of the row view. Row view listed FOLDERS ONLY and dropped `files` on the floor, so
 * `#img/` drew two rows where the column browser drew four — the two folders, the empty folder the
 * columns knew about, and a file. A list view that cannot show a file is not a list view. */
function FileRow({ o, onClick, depth = 0, formatDate, thumb, onContextMenu, drag, selected }) {
  const dragProps = drag ? { draggable: true, onDragStart: (e) => { e.stopPropagation(); drag.onDragStart(e, o.key) } } : {}
  return (
    <li onContextMenu={onContextMenu} {...dragProps} className={`flex items-center gap-3 py-2 border-b cursor-pointer transition-colors px-1 rounded ${selected ? 'bg-fg-04' : 'hover:bg-fg-04'}`} style={{ borderColor: 'var(--kol-fg-08)', paddingLeft: depth * 20 + 4 }} onClick={onClick}>
      <span className="w-4 shrink-0" />
      <div className="w-8 h-8 shrink-0 flex items-center justify-center text-fg-48 overflow-hidden rounded">
        {thumb ?? <Icon name={kindOf(o) === 'image' ? 'image' : 'file'} size={18} />}
      </div>
      <span className="kol-mono-12 flex-1 min-w-0 truncate text-fg-default">{o.displayKey ?? o.key.split('/').pop()}</span>
      <span className="kol-mono-12 text-fg-32 shrink-0">{formatDate?.(o.uploaded)}</span>
      <span className="kol-mono-12 text-fg-32 shrink-0 w-20 text-right">{formatSize(o.size)}</span>
    </li>
  )
}

/**
 * MediaInspector — the full-screen viewer for one file in a set: image, video
 * (scrubbable, audio on), audio, or a document page, with the facts line and
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
 */
export function MediaInspector({ files, index, onClose, onPrev, onNext, mediaUrl, downloadUrl, keySet }) {
  const o = files[index]
  const [dims, setDims] = useState(null)
  const shownDims = dims && dims.key === o?.key ? dims : null
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'ArrowLeft') onPrev(); if (e.key === 'ArrowRight') onNext() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onPrev, onNext])
  if (!o) return null
  const kind = kindOf(o)
  const poster = kind === 'video' ? posterFor(o.key, keySet) : null
  const ARROW = 'fixed top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded text-fg-48 hover:text-fg-default hover:bg-fg-ab-24 transition-colors'
  return (
    <FullscreenOverlay open onClose={onClose} closeButton={false}>
      <button type="button" className={`${ARROW} left-6`} onClick={onPrev} disabled={files.length <= 1} aria-label="Previous"><Icon name="chevron-left" size={22} /></button>
      <div className="max-w-[calc(100vw-10rem)] max-h-[85vh] flex flex-col items-center gap-3">
        {isImage(o.contentType) ? (
          <img src={mediaUrl(o.key)} alt={o.displayKey} className="max-w-full max-h-[78vh] object-contain rounded" onLoad={(e) => setDims({ key: o.key, w: e.target.naturalWidth, h: e.target.naturalHeight })} />
        ) : isVideo(o.contentType) ? (
          <VideoSheet src={mediaUrl(o.key)} poster={poster ? mediaUrl(poster) : undefined} onMeta={(m) => setDims({ key: o.key, ...m })} />
        ) : kind === 'audio' ? (
          <AudioSheet src={mediaUrl(o.key)} onDuration={(len) => setDims({ key: o.key, len })} />
        ) : (
          <KindPreview o={o} urlOf={(x) => mediaUrl(x.key)} poster={poster ? mediaUrl(poster) : undefined} />
        )}
        <div className="flex items-center gap-4">
          <span className="kol-mono-12 text-fg-48">{o.displayKey ?? o.key}</span>
          <span className="kol-mono-12 text-fg-32">{formatSize(o.size)}</span>
          {shownDims?.w && <span className="kol-mono-12 text-fg-32">{shownDims.w} × {shownDims.h} px</span>}
          {shownDims?.len && <span className="kol-mono-12 text-fg-32">{formatLength(shownDims.len)}</span>}
          <ActionButton chrome="inline" size="sm" icon="download" confirmIcon="check" label="Download" confirmLabel="Downloaded" href={downloadUrl(o.key)} />
        </div>
        <span className="kol-mono-10 text-fg-24">{index + 1} / {files.length}</span>
      </div>
      <button type="button" className={`${ARROW} right-6`} onClick={onNext} disabled={files.length <= 1} aria-label="Next"><Icon name="chevron-right" size={22} /></button>
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
    <SettingsPanel variant="drawer" title="Display settings" onClose={onClose} footer={<SettingsFooter onReset={onReset}>{settingsFooter}</SettingsFooter>}>
      <LabeledControlSection label="Structure" rowGap={1} divided>
        <SettingsRow label="Columns" hint="Finder-style columns instead of folder rows">
          <SettingsSwitch label="Columns" on={(settings.folderView ?? 'rows') === 'columns'} onChange={(v) => set({ folderView: v ? 'columns' : 'rows' })} />
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
function LibraryHeader({ title, buckets, bucketId, appRoot, onBucket, bucketMeta, writable, headerActions, onSettings, onHome, headerTrailing }) {
  const options = buckets.length ? [{ value: 'all', label: `${title} · all` }, ...buckets.map((b) => ({ value: b.id, label: b.label }))] : []
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
  folderTree, headerActions, headerTrailing, refreshKey, onOpen, autoFocus = false, settingsFooter, className = '', banner,
  /* THE FILE VERBS, as ONE seam (2026-09-21). `{ createFolder, rename, move, remove }`, each
   * optional and each async; whatever is supplied becomes a right-click menu entry and
   * anything absent simply is not offered. One object rather than four props because they
   * arrive together — a consumer with a writable store has all of them, one with a read-only
   * bucket has none — and because the page must never have to know WHICH verbs exist to
   * decide whether to draw a menu at all. The consumer re-lists after a mutation by bumping
   * `refreshKey`; the page does not own the data. */
  fileActions,
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
  const [pickedFile, setPickedFile] = useState(null)
  /* Row view's inline disclosure set — folder paths currently expanded. Kept here rather than in
   * settings: it is a transient reading state, not a preference, and Finder does not persist it
   * across a relaunch either. */
  const [expandedRows, setExpandedRows] = useState(() => new Set())

  /* ── THE FILE VERBS ────────────────────────────────────────────────────────────────────────
   * Right-click is the surface; `fileActions` is the implementation. The page owns neither the
   * data nor the store — it collects an intent, asks for the one piece of text it needs, calls
   * the consumer's verb and lets the consumer re-list. `prompt`/`confirm` are deliberate: this
   * file already uses both for batch move and delete, and inventing a dialog here would be a
   * second modal idiom in one component. */
  const menu = useContextMenu()
  const canWrite = !!fileActions && writable
  const [busyAction, setBusyAction] = useState(false)

  const runAction = async (fn) => {
    if (!fn) return
    setBusyAction(true)
    try { await fn() } catch (e) { alert(e.message) } finally { setBusyAction(false) }
  }

  const doCreateFolder = (parent) => {
    const name = prompt(`New folder in ${parent || 'the bucket root'}:`)
    if (!name?.trim()) return
    runAction(() => fileActions.createFolder(`${parent}${name.trim().replace(/^\/+|\/+$/g, '')}/`))
  }
  const doCreateFile = (parent) => {
    const name = prompt(`New file in ${parent || 'the bucket root'}:`, 'untitled.txt')
    if (!name?.trim()) return
    runAction(() => fileActions.createFile(`${parent}${name.trim().replace(/^\/+/, '')}`))
  }
  const doRename = (path, isFolder) => {
    const current = path.replace(/\/$/, '').split('/').pop()
    const name = prompt(`Rename ${isFolder ? 'folder' : 'file'}:`, current)
    if (!name?.trim() || name === current) return
    const parent = path.replace(/\/$/, '').slice(0, path.replace(/\/$/, '').length - current.length)
    runAction(() => fileActions.rename(path, `${parent}${name.trim()}${isFolder ? '/' : ''}`))
  }
  const doMove = (path) => {
    const dest = prompt(`Move into which folder? (blank = bucket root)`, prefix)
    if (dest === null) return
    const clean = dest ? `${dest.replace(/^\/+|\/+$/g, '')}/` : ''
    runAction(() => fileActions.move(path, clean))
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

  const selectRow = (path, e, orderedPaths) => {
    const additive = e.metaKey || e.ctrlKey
    const ranged = e.shiftKey && selectAnchorRef.current
    if (!additive && !ranged) { setRowSelection(new Set()); selectAnchorRef.current = path; return false }
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

  const doBatch = (paths, verb, label) => {
    if (paths.length === 1) return null
    if (label === 'Delete' && !confirm(`Delete ${paths.length} items? This cannot be undone.`)) return null
    let dest = null
    if (label === 'Move') {
      dest = prompt(`Move ${paths.length} items into which folder? (blank = bucket root)`, prefix)
      if (dest === null) return null
      dest = dest ? `${dest.replace(/^\/+|\/+$/g, '')}/` : ''
    }
    runAction(async () => {
      for (const p of paths) {
        if (label === 'Delete') await fileActions.remove(p)
        else await fileActions.move(p, dest)
      }
      setRowSelection(new Set())
    })
    void verb
    return true
  }

  const draggingRef = useRef(null)
  const dragFor = canWrite && fileActions.move ? (path) => ({
    path,
    onDragStart: (e, from) => { draggingRef.current = from; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', from) },
    canDrop: (dest) => {
      const from = draggingRef.current
      if (!from || from === dest) return false
      if (from.endsWith('/') && dest.startsWith(from)) return false // into itself
      const parent = from.replace(/\/$/, '').split('/').slice(0, -1).join('/')
      return dest !== (parent ? `${parent}/` : '')                  // already there
    },
    onDrop: (dest) => {
      const from = draggingRef.current
      draggingRef.current = null
      if (!from) return
      const name = from.replace(/\/$/, '').split('/').pop()
      runAction(() => fileActions.move(from, dest))
      void name
    },
  }) : null

  const doDelete = (path, isFolder) => {
    if (!confirm(`Delete ${isFolder ? `"${path}" and everything in it` : `"${path}"`}? This cannot be undone.`)) return
    runAction(() => fileActions.remove(path))
  }
  const [quickLook, setQuickLook] = useState(null)
  const columnsRef = useRef(null)
  const { folderView = 'columns', flat } = settings
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
  const searched = useMemo(() => (q ? objects.filter((o) => o.key.toLowerCase().includes(q)) : objects), [objects, q])
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
  const levelFiles = flat ? scoped.map((o) => ({ ...o, displayKey: prefix ? o.key.slice(prefix.length) : o.key })) : dirFiles
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
  const single = buckets.length <= 1
  const ROOT = title
  const label = bucketMeta.label || 'bucket'
  const VROOT = single ? '' : `${ROOT}/${label}/`
  const unroot = (p) => (VROOT && p.startsWith(VROOT) ? p.slice(VROOT.length) : p)
  /* ONE LEVEL, ONE ANSWER. The column view merges the baked tree with the live partition inside its
   * `partition` prop; the row view used the live partition alone and therefore disagreed with the
   * columns about what a folder even is. This is that merge, lifted so both callers share it —
   * folders from `folderTree` (real nodes, empty ones included) unioned with the ones derived from
   * keys, plus the level's own files, which the row view never rendered at all. */
  const rowLevel = (level) => {
    /* `partition` slices every key by `prefix` WITHOUT checking it matches, so it must be handed an
     * already-scoped list. Given the whole bucket it cut four characters off every root key and
     * drew `readme.md` as `me.md` and `video/` as `o/`. Scope first, always. */
    const inLevel = level ? objects.filter((o) => o.key.startsWith(level)) : objects
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
  const crumbCls = (active) => `cursor-pointer select-none transition-colors ${active ? 'text-oq-96' : 'text-oq-48 hover:text-oq-64'}`

  return (
    <div className={`flex flex-col gap-6 ${className}`.trim()}>
      <LibraryHeader title={title} buckets={buckets} bucketId={bucketMeta.id} appRoot={appRoot} bucketMeta={bucketMeta} writable={writable} headerActions={headerActions} headerTrailing={headerTrailing}
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
                <span className="text-oq-32">/</span>
                <button className={crumbCls(crumbs.length === 0 && !(folderView === 'columns' && pickedFile))} onClick={() => setPrefix('')}>{label.toUpperCase()}</button>
              </span>
            )}
            {!appRoot && crumbs.map((seg, i) => {
              const to = crumbs.slice(0, i + 1).join('/') + '/'
              const last = i === crumbs.length - 1
              return (
                <span key={to} className="flex items-center gap-2">
                  <span className="text-oq-32">/</span>
                  <button className={crumbCls(last && !(folderView === 'columns' && pickedFile))} onClick={() => setPrefix(to)}>{seg.toUpperCase()}</button>
                </span>
              )
            })}
            {folderView === 'columns' && pickedFile && pickedFile.key.startsWith(prefix) && (
              <span className="flex items-center gap-2"><span className="text-oq-32">/</span><span className="text-oq-96">{pickedFile.key.slice(prefix.length).toUpperCase()}</span></span>
            )}
          </div>
          {/* the control cluster is desktop-only — below `md` these two toggles
            * are the same setting the drawer already carries, and nothing in
            * this row survives 390 */}
          <div className="hidden md:flex items-center gap-6">
            <ViewToggle viewMode={folderView} onViewChange={(v) => setSettings({ ...settings, folderView: v })} variant="icon" options={FOLDER_VIEW_OPTIONS} />
            <Divider variant="vertical" />
            <div className="flex items-center gap-4">
              {[{ value: 'rows', label: 'ROW' }, { value: 'columns', label: 'COLUMN' }].map((opt) => (
                <span key={opt.value} role="button" onClick={() => setSettings({ ...settings, folderView: opt.value })}
                  className={`kol-helper-14 cursor-pointer select-none ${folderView === opt.value ? 'text-oq-96' : 'text-oq-48 hover:text-oq-64'}`} style={{ letterSpacing: 1 }}>
                  {opt.label}
                </span>
              ))}
            </div>
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

        {quickLook && (
          <MediaInspector files={quickLook.files} index={quickLook.index} onClose={() => setQuickLook(null)} mediaUrl={mediaUrl} downloadUrl={downloadUrl} keySet={keySet}
            onPrev={() => setQuickLook((q) => ({ ...q, index: (q.index - 1 + q.files.length) % q.files.length }))}
            onNext={() => setQuickLook((q) => ({ ...q, index: (q.index + 1) % q.files.length }))} />
        )}
        {settingsOpen && (
          <MediaSettings bucketMeta={bucketMeta} settings={settings} profile={profile} onChange={setSettings} onReset={() => setSettings(null)} onClose={() => setSettingsOpen(false)} settingsFooter={settingsFooter} />
        )}

        {folderView === 'columns' ? (
          <div ref={columnsRef} className="relative">
            <ColumnBrowser
              autoFocus={autoFocus}
              className={appRoot ? 'is-root' : ''}
              height={settings.columnHeight}
              onHeightChange={(px) => setSettings({ ...settings, columnHeight: px })}
              columnWidths={settings.columnWidths}
              onColumnResize={(i, px) => setSettings({ ...settings, columnWidths: { ...(settings.columnWidths ?? {}), [i]: px } })}
              objects={sortedObjects.filter((o) => !isSystemFile(o.key)).map((o) => ({ ...o, key: `${VROOT}${o.key}` }))}
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
              onQuickLook={(q) => setQuickLook(q && { ...q, files: q.files.map((o) => ({ ...o, key: o.key.slice(VROOT.length) })) })}
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
              onRowContextMenu={(e, payload) => menu.openAt(e, { ...payload, path: unroot(payload.path) })}
              dragFor={dragFor ? (path) => dragFor(unroot(path)) : undefined}
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
           * being a target for its level. Highlight via a data attribute for the same reason. */
          <ul className="flex flex-col overflow-y-auto kol-row-browser"
            style={{ height: settings.columnHeight ?? SETTINGS_BASE.columnHeight }}
            onContextMenu={(e) => menu.openAt(e, { type: 'level', path: prefix })}
            onDragOver={(e) => {
              const d = dragFor?.(prefix)
              if (!d?.canDrop(prefix)) return
              e.preventDefault()
              e.currentTarget.dataset.dropOver = '1'
            }}
            onDragLeave={(e) => { if (e.currentTarget === e.target) delete e.currentTarget.dataset.dropOver }}
            onDrop={(e) => {
              delete e.currentTarget.dataset.dropOver
              const d = dragFor?.(prefix)
              if (!d?.canDrop(prefix)) return
              e.preventDefault()
              d.onDrop(prefix)
            }}>
            {rowLevel(prefix).folders.map((f) => {
              const path = prefix + f
              const open = expandedRows.has(path)
              const order = [...rowLevel(prefix).folders.map((x) => prefix + x), ...rowLevel(prefix).files.map((x) => x.key)]
              return (
                <Fragment key={f}>
                  <FolderRow
                    name={f} struck={flat} expanded={open}
                    selected={rowSelection.has(path)}
                    onContextMenu={(e) => menu.openAt(e, { type: 'folder', path, targets: targetsFor(path) })}
                    drag={dragFor?.(path)}
                    meta={folderMeta?.(path) || undefined}
                    onToggle={() => setExpandedRows((prev) => {
                      const next = new Set(prev)
                      next.has(path) ? next.delete(path) : next.add(path)
                      return next
                    })}
                    onClick={(e) => { if (!selectRow(path, e, order)) setPrefix(path) }}
                  />
                  {open && <RowSubtree
                    level={path} depth={1} rowLevel={rowLevel} expanded={expandedRows}
                    onToggle={(p) => setExpandedRows((prev) => { const n = new Set(prev); n.has(p) ? n.delete(p) : n.add(p); return n })}
                    onOpenFolder={setPrefix} onOpenFile={(o) => setPickedFile(o)}
                    onRowContextMenu={(e, payload) => menu.openAt(e, payload)} dragFor={dragFor}
                    formatDate={formatDate} folderMeta={folderMeta} thumbnailFor={thumbnailFor} flat={flat}
                  />}
                </Fragment>
              )
            })}
            {rowLevel(prefix).files.map((o) => (
              <FileRow key={o.key} o={o} formatDate={formatDate} thumb={thumbnailFor?.(o)}
                selected={rowSelection.has(o.key)}
                onContextMenu={(e) => menu.openAt(e, { type: 'file', path: o.key, o, targets: targetsFor(o.key) })}
                drag={dragFor?.(o.key)}
                onClick={(e) => {
                  const order = [...rowLevel(prefix).folders.map((x) => prefix + x), ...rowLevel(prefix).files.map((x) => x.key)]
                  if (!selectRow(o.key, e, order)) setPickedFile(o)
                }} />
            ))}
          </ul>
        )}

        {/* `mt-2` BALANCES THE INK, not the boxes (user 2026-09-21: "what was unclear about matching
          * the gap above to below"). The column pane, the crumb row above it and this line share one
          * `gap-3`, so box-to-box both gaps are 12px — but the crumb row's box runs 8px lower than
          * its own text, because the ROW·COLUMN icon buttons are taller than the crumbs. Measured
          * against the pane's BORDER: 20px above, 12px below. The 8 puts the text gaps level. */}
        {appRoot && folderView === 'columns' && folderTree ? (
          <p className="kol-mono-12 text-fg-48 mt-2">
            {buckets.length} buckets · {Object.values(folderTree).reduce((n, t) => n + (t.files ?? 0), 0)} files · {formatSize(Object.values(folderTree).reduce((n, t) => n + (t.bytes ?? 0), 0))}
          </p>
        ) : (
          <p className="kol-mono-12 text-fg-48 mt-2">
            {folders.length > 0 && `${folders.length} folder${folders.length > 1 ? 's' : ''} · `}
            {rawFiles.length} {rawFiles.length === 1 ? 'file' : 'files'} · {formatSize(totalBytes)}
            {(!prefix || flat) && rawFiles.length !== bucketFiles && <span className="text-fg-32">{'  ·  bucket: '}{bucketFiles} files · {formatSize(bucketBytes)}</span>}
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
              if (many) {
                return (
                  <>
                    <MenuDropdownItem disabled>{many.length} selected</MenuDropdownItem>
                    <MenuDropdownDivider />
                    {fileActions.move && (
                      <MenuDropdownItem iconLeft={<Icon name="arrow-right" size={14} />} onClick={() => doBatch(many, 'move', 'Move')}>Move {many.length} to…</MenuDropdownItem>
                    )}
                    {fileActions.remove && (
                      <MenuDropdownItem iconLeft={<Icon name="trash" size={14} />} onClick={() => doBatch(many, 'remove', 'Delete')}>Delete {many.length}</MenuDropdownItem>
                    )}
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
                  {!isLevel && <MenuDropdownDivider />}
                  {!isLevel && fileActions.rename && (
                    <MenuDropdownItem iconLeft={<Icon name="edit" size={14} />} onClick={() => doRename(target.path, isFolder)}>Rename</MenuDropdownItem>
                  )}
                  {!isLevel && fileActions.move && (
                    <MenuDropdownItem iconLeft={<Icon name="arrow-right" size={14} />} onClick={() => doMove(target.path)}>Move to…</MenuDropdownItem>
                  )}
                  {!isLevel && fileActions.remove && (
                    <>
                      <MenuDropdownDivider />
                      <MenuDropdownItem iconLeft={<Icon name="trash" size={14} />} onClick={() => doDelete(target.path, isFolder)}>Delete</MenuDropdownItem>
                    </>
                  )}
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
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
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
  const PAGE = pageSize || Infinity
  const [visible, setVisible] = useState(PAGE)
  const listId = `${prefix}|${flat}|${[...kinds].sort().join(',')}|${pageSize}|${refreshKey}|${bucketMeta.id}`
  const [lastListId, setLastListId] = useState(listId)
  if (listId !== lastListId) { setLastListId(listId); setVisible(PAGE) }
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
    if (!confirm(`Delete "${key}"? This cannot be undone.`)) return
    try { await client.deleteObject(key); setObjects((prev) => prev.filter((o) => o.key !== key)) } catch (e) { alert(`Delete failed: ${e.message}`) }
  }
  const startRename = (key) => { setEditingKey(key); setEditingValue(key) }
  const cancelRename = () => { setEditingKey(null); setEditingValue('') }
  const commitRename = async () => {
    const from = editingKey; const to = editingValue.trim()
    if (!from || !to || from === to) { cancelRename(); return }
    setRenaming(true)
    try { const r = await client.renameObject(from, to); const newKey = r?.to || to; setObjects((prev) => prev.map((o) => (o.key === from ? { ...o, key: newKey } : o))); setEditingKey(null); setEditingValue('') }
    catch (e) { alert(`Rename failed: ${e.message}`) } finally { setRenaming(false) }
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
    const folder = prompt(`Move ${selected.size} file(s) into folder (under ${prefix || 'root'}):`)
    if (folder === null) return
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
    if (failures.length) alert(`Moved ${remap.size}. ${failures.length} failed:\n${failures.join('\n')}`)
  }
  const batchDelete = async () => {
    if (!confirm(`Delete ${selected.size} file(s)? This cannot be undone.`)) return
    setBusy(true)
    const done = []; const failures = []
    for (const key of selected) { try { await client.deleteObject(key); done.push(key) } catch (e) { failures.push(`${key.split('/').pop()}: ${e.message}`) } }
    setObjects((prev) => prev.filter((o) => !done.includes(o.key)))
    setBusy(false); exitSelect()
    if (failures.length) alert(`Deleted ${done.length}. ${failures.length} failed:\n${failures.join('\n')}`)
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
  /* ONE PREVIEWER (2026-09-21). This was a hand-rolled ladder that knew image, a sibling poster
   * and an autoloaded video, and printed the literal word "video" or "markdown" for everything
   * else — while the column preview eight hundred lines up already called `KindPreview`, which
   * renders markdown, code, json, yaml, audio and HLS for real. That is why every kind previewed
   * in the column pane and nothing previewed in the grid or the list: two previewers for one
   * object, and the wall's predates the component.
   *
   * Images stay the caller's, as they are in the column pane and as `KindPreview` documents —
   * it has no image branch on purpose, because in a frame the frame draws its own. A video keeps
   * its poster when the bucket has a sibling still, because a poster is cheaper than the file and
   * `videoPreview` is the consumer's setting about exactly that. Everything else falls through. */
  const renderThumb = (o, onClick) => {
    const kind = kindOf(o)
    const poster = (isVideo(o.contentType) || kind === 'playlist') ? posterFor(o.key, keySet) : null
    const imgSrc = isImage(o.contentType) ? mediaUrl(o.key) : poster && videoPreview !== 'none' ? mediaUrl(poster) : null
    if (imgSrc) return <img src={imgSrc} alt="" loading="lazy" className={onClick ? 'cursor-zoom-in' : undefined} onClick={onClick || undefined} />
    if (isVideo(o.contentType) && videoPreview === 'none') {
      return (
        <div className={`w-full h-full flex items-center justify-center bg-fg-04 overflow-hidden${onClick ? ' cursor-zoom-in' : ''}`} onClick={onClick || undefined}>
          <span className="kol-mono-12 text-fg-48">video</span>
        </div>
      )
    }
    return (
      <div className={`kol-media-thumb w-full h-full flex items-center justify-center bg-fg-04 overflow-hidden${onClick ? ' cursor-zoom-in' : ''}`} onClick={onClick || undefined}>
        <KindPreview o={o} urlOf={(x) => mediaUrl(x.key)} poster={poster ? mediaUrl(poster) : undefined} kindOf={kindOf} kindLabel={KIND_LABEL} />
      </div>
    )
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
        renderItem={(filtered) => {
          if (layout === 'off') return null
          const sorted = sortFiles(filtered, sortBy, sortDir)
          sortedRef.current = sorted
          const shown = sorted.slice(0, visible)
          const more = sorted.length - shown.length
          return (
            <div className="flex flex-col gap-3">
              {sorted.length === 0 ? null : layout !== 'grid' ? (
                <div className="flex flex-col">
                  {shown.map((o, idx) => (
                    <ContentRow key={o.key} variant="default" media={renderThumb(o, selectMode ? null : () => setLightboxIndex(idx))} title={renderNameCell(o)} date={formatDate(o.uploaded)} size={formatSize(o.size)}
                      actions={renderActions(o, true)} selected={selected.has(o.key)} onClick={selectMode ? (e) => toggleSelect(idx, o.key, e.shiftKey) : undefined} />
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                  {shown.map((o, idx) => (
                    <ContentCard key={o.key} variant="default" media={renderThumb(o, selectMode ? null : () => setLightboxIndex(idx))}
                      control={<ActionButton chrome="media" icon="download" confirmIcon="check" label="Download" confirmLabel="Downloaded" href={downloadUrl(o.key)} />}
                      controlStart={selectMode ? <ToggleCheckbox variant="media" checked={selected.has(o.key)} onChange={() => toggleSelect(idx, o.key, false)} onClick={(e) => e.stopPropagation()} aria-label={`Select ${o.key}`} /> : undefined}
                      title={renderNameCell(o)} date={formatDate(o.uploaded)} size={<SizeOrDownload href={downloadUrl(o.key)}>{formatSize(o.size)}</SizeOrDownload>}
                      actions={renderActions(o)} selected={selected.has(o.key)} onClick={selectMode ? (e) => toggleSelect(idx, o.key, e.shiftKey) : undefined} />
                  ))}
                </div>
              )}
              {more > 0 && (
                <button type="button" onClick={() => setVisible((v) => v + PAGE)} className="kol-mono-12 text-fg-48 hover:text-fg-default transition-colors self-start py-2">
                  Show {Math.min(more, PAGE)} more · {more} remaining
                </button>
              )}
              {lightboxIndex !== null && (
                <MediaInspector files={sorted} index={lightboxIndex} onClose={() => setLightboxIndex(null)} mediaUrl={mediaUrl} downloadUrl={downloadUrl} keySet={keySet}
                  onPrev={() => setLightboxIndex((i) => (i - 1 + sorted.length) % sorted.length)} onNext={() => setLightboxIndex((i) => (i + 1) % sorted.length)} />
              )}
            </div>
          )
        }}
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
