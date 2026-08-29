import { useEffect, useMemo, useRef, useState } from 'react'
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
const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'date', label: 'Date' },
  { value: 'size', label: 'Size' },
  { value: 'kind', label: 'Kind' },
]

/* bytes → weight, duplicated from the client on purpose (§3: the UI never imports it) */
function formatSize(bytes) {
  if (bytes == null) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}
const formatDate = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : '')
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

/* `struck` = folder grouping is bypassed (flat mode) — still navigable, de-emphasised. */
function FolderRow({ name, onClick, struck = false }) {
  return (
    <li className="flex items-center gap-3 py-2 border-b cursor-pointer hover:bg-fg-04 transition-colors px-1 rounded" style={{ borderColor: 'var(--kol-fg-08)' }} onClick={onClick}>
      <div className="w-8 h-8 shrink-0 flex items-center justify-center text-fg-48"><Icon name="folder" size={18} /></div>
      <span className={`kol-mono-12 flex-1 ${struck ? 'line-through text-fg-48' : 'text-fg-default'}`}>{name}</span>
      <Icon name="chevron-right" size={14} className="text-fg-32" />
    </li>
  )
}

/* The inspector — shell is FullscreenOverlay; the STAGE is kol-r2b2's
 * MediaLightbox, verbatim: scrubbable audio-on video (VideoSheet), AudioSheet,
 * DocPage-through-KindPreview for documents, the facts line, prev / next FIXED
 * at the viewport edges (DocPageAndKindShowcase). Not MediaViewer, which is a
 * gallery — muted/loop/no-controls, image-and-video only. */
function MediaInspector({ files, index, onClose, onPrev, onNext, mediaUrl, downloadUrl, keySet }) {
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
function MediaSettings({ bucketMeta, settings, onChange, onReset, onClose, profile }) {
  const set = (patch) => onChange({ ...settings, ...patch })
  const toggleKind = (k) => set({ kinds: settings.kinds.includes(k) ? settings.kinds.filter((x) => x !== k) : [...settings.kinds, k] })
  const noVariants = profile.variantSets === 0
  const noSegments = profile.segments === 0
  return (
    <SettingsPanel variant="drawer" title="Display settings" onClose={onClose} footer={<SettingsFooter onReset={onReset} />}>
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

/* ── the header — bucket Dropdown · lock / the app's actions · settings ──── */
function LibraryHeader({ title, buckets, bucketId, appRoot, onBucket, bucketMeta, writable, headerActions, onSettings }) {
  const options = buckets.length ? [{ value: 'all', label: `${title} · all` }, ...buckets.map((b) => ({ value: b.id, label: b.label }))] : []
  return (
    <header className="flex items-baseline justify-between gap-4">
      <h1 className="kol-sans-display-03">{title}</h1>
      <div className="flex items-center gap-2">
        {options.length > 0 && <Dropdown className="w-48" value={appRoot ? 'all' : bucketId} onChange={onBucket} options={options} />}
        {headerActions}
        {!writable && bucketMeta.id && (
          <IconFrame name="lock" variant="primary" size="sm" title={`${bucketMeta.label} is read-only here`} aria-label="Read-only" />
        )}
        <IconFrame name="settings-01" variant="primary" size="sm" onClick={onSettings} aria-label="Display settings" title="Display settings" />
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
export function MediaLibraryBrowse({
  client, title = 'MEDIA', bucket, onBucketChange, prefix: prefixProp, onPrefix, defaults, settings: settingsProp, onSettingsChange,
  folderTree, headerActions, refreshKey, onOpen, autoFocus = false, className = '',
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
  const [quickLook, setQuickLook] = useState(null)
  const columnsRef = useRef(null)
  const { folderView = 'columns', flat } = settings

  const scoped = prefix ? objects.filter((o) => o.key.startsWith(prefix)) : objects
  const { folders, files: dirFiles } = partition(scoped, prefix)
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
   * its children the buckets, stepping into one IS the bucket switch */
  const ROOT = title
  const label = bucketMeta.label || 'bucket'
  const VROOT = `${ROOT}/${label}/`
  const treeFolders = (level) => (folderTree?.[bucketMeta.id]?.folders ?? [])
    .filter((p) => p.startsWith(level) && p.length > level.length && !p.slice(level.length, -1).includes('/'))
    .map((p) => p.slice(level.length))

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
      <LibraryHeader title={title} buckets={buckets} bucketId={bucketMeta.id} appRoot={appRoot} bucketMeta={bucketMeta} writable={writable} headerActions={headerActions}
        onBucket={(v) => { if (v === 'all') { setAppRoot(true); setPrefix('') } else { setAppRoot(false); switchBucket(v) } }}
        onSettings={() => setSettingsOpen(true)} />

      <div className="flex flex-col gap-3">
        {/* Breadcrumb (uppercase, active segment at full ink) · folder-view toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 kol-mono-12">
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
          <div className="flex items-center gap-6">
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

        {quickLook && (
          <MediaInspector files={quickLook.files} index={quickLook.index} onClose={() => setQuickLook(null)} mediaUrl={mediaUrl} downloadUrl={downloadUrl} keySet={keySet}
            onPrev={() => setQuickLook((q) => ({ ...q, index: (q.index - 1 + q.files.length) % q.files.length }))}
            onNext={() => setQuickLook((q) => ({ ...q, index: (q.index + 1) % q.files.length }))} />
        )}
        {settingsOpen && (
          <MediaSettings bucketMeta={bucketMeta} settings={settings} profile={profile} onChange={setSettings} onReset={() => setSettings(null)} onClose={() => setSettingsOpen(false)} />
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
              objects={objects.filter((o) => !isSystemFile(o.key)).map((o) => ({ ...o, key: `${VROOT}${o.key}` }))}
              prefix={appRoot ? `${ROOT}/` : `${VROOT}${prefix}`}
              onPrefix={(v) => {
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
              renderPreview={(o) => {
                const real = { ...o, key: o.key.slice(VROOT.length) }
                if (isImage(real.contentType)) return <ImageFrame src={mediaUrl(real.key)} />
                const poster = posterFor(real.key, keySet)
                return <KindPreview o={real} urlOf={(x) => mediaUrl(x.key)} poster={poster ? mediaUrl(poster) : undefined} kindOf={kindOf} kindLabel={KIND_LABEL} />
              }}
              partition={(objs, level) => {
                if (level === '') return { folders: [`${ROOT}/`], files: [] }
                if (level === `${ROOT}/`) return { folders: (buckets.length ? buckets : [bucketMeta]).map((b) => `${b.label || 'bucket'}/`), files: [] }
                const live = partition(objs, level)
                const baked = treeFolders(level.slice(VROOT.length))
                return { folders: [...new Set([...baked, ...live.folders])].sort(), files: live.files }
              }}
            />
          </div>
        ) : folders.length > 0 && (
          <ul className="flex flex-col">{folders.map((f) => <FolderRow key={f} name={f} onClick={() => setPrefix(prefix + f)} struck={flat} />)}</ul>
        )}

        {appRoot && folderView === 'columns' && folderTree ? (
          <p className="kol-mono-12 text-fg-48">
            {buckets.length} buckets · {Object.values(folderTree).reduce((n, t) => n + (t.files ?? 0), 0)} files · {formatSize(Object.values(folderTree).reduce((n, t) => n + (t.bytes ?? 0), 0))}
          </p>
        ) : (
          <p className="kol-mono-12 text-fg-48">
            {folders.length > 0 && `${folders.length} folder${folders.length > 1 ? 's' : ''} · `}
            {rawFiles.length} {rawFiles.length === 1 ? 'file' : 'files'} · {formatSize(totalBytes)}
            {(!prefix || flat) && rawFiles.length !== bucketFiles && <span className="text-fg-32">{'  ·  bucket: '}{bucketFiles} files · {formatSize(bucketBytes)}</span>}
            {systemCount > 0 && <span className="text-fg-32">{'  ·  '}{systemCount} system files hidden</span>}
          </p>
        )}
        {void onOpen}
      </div>
    </div>
  )
}

/* ══ LIBRARY — the content-filters wall ═══════════════════════════════════ */
export function MediaLibraryLibrary({
  client, title = 'MEDIA', bucket, onBucketChange, prefix = '', defaults, settings: settingsProp, onSettingsChange,
  headerActions, refreshKey, header = true, stats = true, className = '',
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
  const renderThumb = (o, onClick) => {
    const media = isImage(o.contentType) || isVideo(o.contentType)
    const poster = (isVideo(o.contentType) || kindOf(o) === 'playlist') ? posterFor(o.key, keySet) : null
    const imgSrc = isImage(o.contentType) ? mediaUrl(o.key) : poster && videoPreview !== 'none' ? mediaUrl(poster) : null
    if (imgSrc) return <img src={imgSrc} alt="" loading="lazy" className={onClick ? 'cursor-zoom-in' : undefined} onClick={onClick || undefined} />
    return (
      <div className={`w-full h-full flex items-center justify-center bg-fg-04 overflow-hidden${media && onClick ? ' cursor-zoom-in' : ''}`} onClick={media && onClick ? onClick : undefined}>
        {isVideo(o.contentType) && videoPreview === 'autoload' ? <video src={mediaUrl(o.key)} className="w-full h-full object-cover" muted preload="metadata" />
          : isVideo(o.contentType) ? <span className="kol-mono-12 text-fg-48">video</span>
          : <span className="kol-mono-12 text-fg-48">{KIND_LABEL[kindOf(o)] || 'file'}{o.segmentCount ? ` ${o.segmentCount}` : ''}</span>}
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
        <LibraryHeader title={title} buckets={buckets} bucketId={bucketMeta.id} appRoot={false} bucketMeta={bucketMeta} writable={writable} headerActions={headerActions}
          onBucket={(v) => { if (v === 'all') return; if (bucket == null) setOwnBucket(v); onBucketChange?.(v) }} onSettings={() => setSettingsOpen(true)} />
      )}
      {settingsOpen && (
        <MediaSettings bucketMeta={bucketMeta} settings={settings} profile={profile} onChange={setSettings} onReset={() => setSettings(null)} onClose={() => setSettingsOpen(false)} />
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
    </div>
  )
}
