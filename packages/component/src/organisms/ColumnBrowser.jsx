import { Fragment, useEffect, useRef, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import KindPreview from '../molecules/KindPreview.jsx'
import { formatLength } from '../molecules/AudioPreview.jsx'
import { kindOf as dsKindOf, KIND_LABEL as DS_KIND_LABEL } from '../utilities/mediaKinds.js'

/**
 * ColumnBrowser — Finder-style Miller columns over a flat key space (kol-r2b2's
 * `src/ColumnBrowser.jsx`, built and ruled there first — user 2026-08-27: "make
 * it locally first, then ship it" — and shipped verbatim; ticket ColumnBrowser).
 * The listing surface's FOLDER view: it replaces the folder rows above the
 * files, it is not a card layout.
 *
 * One column per path segment of `prefix`: column 0 is the root level, column
 * k the contents of the k-th folder on the path. Picking a folder sets the
 * prefix to it (and so truncates deeper columns); picking a file highlights it
 * and opens a PREVIEW column on the right — the image and its facts, as Finder
 * does.
 *
 * Keyboard, Finder's: ↑/↓ move within the column (a folder opens its column as
 * you land on it, a file previews), → steps into the open folder's column,
 * ← steps back to the parent column. Space = Quick Look: `onQuickLook({ files,
 * index })` over the column's files; while it is open ↑/↓ step the file off
 * `window` (the overlay holds focus) and space closes — the opening keystroke
 * bubbles from here and is ignored.
 *
 * Rows wear the DS Table's cell metrics (12px 16px, mono 12, an oq-08 hairline
 * between rows, none after the last). Selected and cursor rows draw the HOVER
 * fill (`bg-fg-04`) — user ruling: "make hover state the selected state".
 * Height defaults to 528px = 12 rows × 44px (user ruling); columns scroll. Both
 * the height and every column's width are DRAGGABLE, Finder-style
 * (ColumnBrowserResize, kol-r2b2 2026-08-27 — user: "column height drag yes and
 * individual column width drag" · "that should be a set in ds"): a strip along
 * the browser's bottom edge (`row-resize`) and one on each column's right edge
 * (`col-resize`, the border already there is the visual — the strip is the hit
 * area, invisible at rest, `fg-08` on hover / while dragging). Pointer events
 * with `setPointerCapture`, no library; native CSS `resize:` was rejected.
 *
 * The app-owned bits are SEAMS with working defaults: `urlOf(o)` (the preview
 * image — no URL, no image), `kindOf(o)` (image / video / audio / file from
 * `contentType`), `kindLabel`, `formatSize`, `partition(objects, level)`.
 *
 * @param {Array<{key: string, size?: number, uploaded?: string, contentType?: string}>} objects  the flat key space
 * @param {string}   prefix       the open folder path ('' = root, 'a/b/' = two deep)
 * @param {Function} onPrefix     (prefix) => void
 * @param {{files: object[], index: number}|null} quickLook   the open Quick Look, or null
 * @param {Function} onQuickLook  (quickLook|null) => void — space opens / closes, ↑/↓ step while open
 * @param {Function} onPick       (file|null) => void — the picked file whenever it changes (a folder pick or an outside prefix change → null)
 * @param {Function} urlOf        (o) => string — the object's public URL for the preview image
 * @param {Function} kindOf       (o) => 'image' | 'video' | 'audio' | string
 * @param {Object}   kindLabel    kind → label shown when there is no visual preview
 * @param {Function} formatSize   (bytes) => string
 * @param {Function} partition    (objects, level) => { folders: string[], files: object[] }
 * @param {Function} renderPreview  (file) => ReactNode — replaces the preview column's media frame (the facts stay — Dimensions and Length are read off whatever <img> / <video> / <audio> the node loads); without it images render the organism's <img>, everything else the DS KindPreview
 * @param {number}   height         controlled height in px (omit for uncontrolled)
 * @param {number}   defaultHeight  uncontrolled start height (528); min 240
 * @param {Function} onHeightChange (px) => void — on every drag step; the consumer persists it
 * @param {number}   columnWidth    every column's start width (260); the preview column starts at 320; min 160
 * @param {Object}   columnWidths   the CONTROLLED counterpart to `onColumnResize` (ColumnBrowserWidthsPersist,
 *                                  kol-r2b2 2026-08-27): a map keyed by column index plus `'preview'` —
 *                                  `{ 0: 300, 2: 190, preview: 420 }` — the same shape the callback reports,
 *                                  so a consumer hands back what it stored. A key with no column is ignored;
 *                                  any column it does not name falls back to the drag state, then `columnWidth`
 * @param {Function} onColumnResize (index, px) => void — the column's index, or `'preview'`
 * @param {string}   className    extra classes on the browser
 */

/* the DS kinds (mediaKinds — kol-r2b2's classification, promoted 2026-08-27) */
const defaultKindOf = dsKindOf
const DEFAULT_KIND_LABEL = DS_KIND_LABEL
const defaultFormatSize = (bytes) => {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}
/* kol-r2b2's partition: the next path segment is a folder, the rest are files */
const defaultPartition = (objects, prefix) => {
  const folderSet = new Set()
  const files = []
  for (const o of objects) {
    const rel = prefix ? o.key.slice(prefix.length) : o.key
    const slash = rel.indexOf('/')
    if (slash !== -1) folderSet.add(rel.slice(0, slash + 1))
    else files.push({ ...o, displayKey: o.displayKey ?? rel })
  }
  return { folders: [...folderSet].sort(), files }
}
const isImage = (o) => (o.contentType || '').startsWith('image/')

/* kol-icons has no `audio` glyph yet — audio rows wear `file` until it does */
const COL_ICON = { image: 'image', video: 'video', audio: 'file', playlist: 'video' }

/* ColumnBrowserChromeCorrections (kol-r2b2 2026-08-28, four user rulings measured live on admin.):
 * every column keeps its right edge, the last included — without it the browser reads as an
 * open-sided container when the columns do not fill the box (Finder closes it); a column's ONLY
 * row keeps its bottom hairline (`only:`) — its last row is also its first, and a missing
 * hairline beside neighbours that show one reads as a defect; and ONE ink for folders and files
 * — the `bg-fg-04` fill alone marks selection ("why is folder full opacity but not files?").
 * `muted` stays a prop for other callers; the file rows no longer pass it.
 * STATE CLASSES (ColumnBrowserSeams, kol-r2b2 2026-08-28): `is-selected` / `is-cursor` on the row,
 * and the fill LIVES IN THE THEME now (kol-components-molecules.css) instead of a `bg-fg-04`
 * utility — the only hook a consumer had for "selected" was that utility, and a restyle that
 * changes it breaks every rule hanging off it silently (twice already in kol-r2b2). It also lets the
 * theme say the user's ruling — "ONLY one selected state can exist, not TWO": the selected row in
 * the deepest column that holds one is full strength, every column on the way there is the trail. */
function Row({ icon, label, active, cursor = false, trailing, onClick, muted = false }) {
  return (
    <li
      /* Row metrics are the DS Table's (kol-components-organisms.css .kol-table-cell-*):
       * 12px 16px padding, mono 12, an oq-08 hairline between rows, none after the last. */
      /* `cursor` = the keyboard row, drawn with the hover fill so ↑/↓ always shows where you are. */
      className={`kol-column-browser-row flex items-center gap-2 px-4 py-3 border-b last:border-b-0 only:border-b cursor-pointer transition-colors${
        active ? ' is-selected' : ''}${cursor ? ' is-cursor' : ''} ${
        active || cursor || !muted ? 'text-fg-default' : 'text-fg-48'
      }`}
      style={{ borderColor: 'var(--kol-oq-08)' }}
      onClick={onClick}
    >
      <span className="w-5 shrink-0 flex items-center justify-center text-fg-48">
        <Icon name={icon} size={14} />
      </span>
      <span className="kol-mono-12 flex-1 truncate">{label}</span>
      {trailing}
    </li>
  )
}

function Preview({ o, urlOf, kindOf, kindLabel, formatSize, renderPreview, width }) {
  // Pixel size and length come from the loaded media itself — the bucket stores
  // none. `{ w, h }` off an <img> load, `{ w, h, len }` off a <video>'s and
  // `{ len }` off an <audio>'s loadedmetadata (ColumnBrowserMediaFacts, kol-r2b2
  // 2026-08-27 — "missing pixel dimensions and length in info").
  const [dims, setDims] = useState(null)
  const kind = kindOf(o)
  const src = isImage(o) ? urlOf?.(o) : null
  const sized = src || kind === 'video'
  const timed = kind === 'video' || kind === 'audio'
  const facts = [
    ['Kind', kindLabel[kind] || 'file'],
    ['Type', o.contentType || '—'],
    ['Size', formatSize(o.size)],
    ...(sized ? [['Dimensions', dims?.w ? `${dims.w} × ${dims.h} px` : '…']] : []),
    ...(timed ? [['Length', dims?.len != null ? formatLength(dims.len) : '…']] : []),
    ['Date', o.uploaded ? new Date(o.uploaded).toISOString().slice(0, 10) : '—'],
  ]
  return (
    <div className="kol-column-browser-preview shrink-0 overflow-y-auto p-4 flex flex-col gap-4" style={{ width }}>
      {/* the media frame: an image is the organism's own <img> (it reads the
        * dimensions); anything else is `renderPreview(o)` or the DS KindPreview
        * (video · audio · code · text — SettingsPanelChromeAndColumnPreview,
        * 2026-08-27). Dimensions and Length also come off any <img> / <video> /
        * <audio> a custom node loads — captured on the frame, so consumer
        * `renderPreview` nodes count. */}
      {src && !renderPreview ? (
        <div className="w-full aspect-square bg-fg-04 rounded flex items-center justify-center overflow-hidden">
          <img
            src={src}
            alt=""
            className="max-w-full max-h-full object-contain"
            loading="lazy"
            onLoad={(e) => setDims({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
          />
        </div>
      ) : (
        <div
          className="kol-column-browser-media w-full min-h-[160px] max-h-[60vh] overflow-auto rounded bg-fg-04 flex items-center justify-center"
          onLoadCapture={(e) => { if (e.target?.tagName === 'IMG') setDims({ w: e.target.naturalWidth, h: e.target.naturalHeight }) }}
          onLoadedMetadataCapture={(e) => {
            const t = e.target
            if (t?.tagName === 'VIDEO') setDims({ w: t.videoWidth, h: t.videoHeight, len: t.duration })
            else if (t?.tagName === 'AUDIO') setDims({ len: t.duration })
          }}
        >
          {renderPreview ? renderPreview(o) : <KindPreview o={o} urlOf={urlOf} kindOf={kindOf} kindLabel={kindLabel} />}
        </div>
      )}
      <p className="kol-mono-12 text-fg-default break-all">{o.displayKey ?? o.key}</p>
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

/* one edge handle: captures the pointer, reports the delta along its axis;
 * `is-dragging` keeps the wash on while the pointer is captured */
function ResizeHandle({ axis, onDrag, onEnd }) {
  const [dragging, setDragging] = useState(false)
  const start = useRef(null)
  return (
    <div
      className={`kol-column-browser-resize-${axis} ${dragging ? 'is-dragging' : ''}`.trim()}
      role="separator"
      aria-orientation={axis === 'x' ? 'vertical' : 'horizontal'}
      onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); start.current = axis === 'x' ? e.clientX : e.clientY; setDragging(true) }}
      onPointerMove={(e) => { if (start.current == null) return; onDrag((axis === 'x' ? e.clientX : e.clientY) - start.current) }}
      onPointerUp={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); start.current = null; setDragging(false); onEnd?.() }}
      onPointerCancel={() => { start.current = null; setDragging(false); onEnd?.() }}
    />
  )
}

const MIN_H = 240
const MIN_W = 160
const PREVIEW_W = 320

export default function ColumnBrowser({
  objects = [],
  prefix = '',
  onPrefix = () => {},
  quickLook = null,
  onQuickLook,
  onPick,
  urlOf,
  kindOf = defaultKindOf,
  kindLabel = DEFAULT_KIND_LABEL,
  formatSize = defaultFormatSize,
  partition = defaultPartition,
  renderPreview,
  height,
  defaultHeight = 528,
  onHeightChange,
  columnWidth = 260,
  columnWidths,
  onColumnResize,
  autoFocus = false,
  className = '',
}) {
  /* height: controlled-or-uncontrolled like Slider; widths: organism-internal,
   * by column index (the preview keyed apart), seeded from `columnWidth` */
  const [ownH, setOwnH] = useState(defaultHeight)
  const h = height ?? ownH
  const [widths, setWidths] = useState({})
  const widthOf = (i) => columnWidths?.[i] ?? widths[i] ?? (i === 'preview' ? PREVIEW_W : columnWidth)
  const dragBase = useRef(null)
  const resizeCol = (i) => (dx) => {
    if (dragBase.current == null) dragBase.current = widthOf(i)
    const w = Math.max(MIN_W, Math.round(dragBase.current + dx))
    setWidths((prev) => (prev[i] === w ? prev : { ...prev, [i]: w }))
    onColumnResize?.(i, w)
  }
  const resizeH = (dy) => {
    if (dragBase.current == null) dragBase.current = h
    const next = Math.max(MIN_H, Math.round(dragBase.current + dy))
    if (height == null) setOwnH(next)
    onHeightChange?.(next)
  }
  const endDrag = () => { dragBase.current = null }
  const [picked, setPicked] = useState(null)
  /* `onPick` (ColumnBrowserOnPick, kol-r2b2 2026-08-27): the picked file, for
   * a Finder-style breadcrumb — fired whenever it changes; a folder pick or an
   * outside prefix change fires null */
  const pick = (o) => { setPicked(o); onPick?.(o) }
  /* picking a FILE in a column that has an open folder closes that folder
   * (Finder: one highlight per column) — the prefix collapses to the file's
   * level, and the cursor STAYS on the file instead of re-seeding
   * (SettingsPanelApproved §4, kol-r2b2 2026-08-27) */
  const keepCursor = useRef(false)
  const pickFile = (level, o) => {
    pick(o)
    if (prefix !== level) { keepCursor.current = true; pickedByCollapse.current = true; onPrefix(level) }
  }
  const pickedByCollapse = useRef(false)
  useEffect(() => { if (pickedByCollapse.current) { pickedByCollapse.current = false; return } if (picked) pick(null) }, [prefix]) // eslint-disable-line react-hooks/exhaustive-deps
  const levelsOf = (pfx) => {
    const out = ['']
    if (pfx) {
      const segs = pfx.replace(/\/$/, '').split('/')
      segs.forEach((_, i) => out.push(segs.slice(0, i + 1).join('/') + '/'))
    }
    return out
  }
  const itemsAt = (level) => {
    const { folders, files } = partition(objects.filter((o) => o.key.startsWith(level)), level)
    return [...folders.map((f) => ({ type: 'folder', name: f })), ...files.map((o) => ({ type: 'file', o }))]
  }
  // Keyboard cursor: which column, which row. Clicks keep it in sync.
  /* SEEDED on the open folder of the deepest column that has one (Finder's
   * start — ColumnBrowserCursorSeed, kol-r2b2 2026-08-27): with a deep `prefix`
   * the first ↓ used to act in column 0. Re-seeded when `prefix` changes; the
   * internal moves land on the same spot, so nothing jumps. */
  const seedCursor = (pfx) => {
    const lv = levelsOf(pfx)
    if (lv.length < 2) return { col: 0, idx: 0 }
    const col = lv.length - 2
    const opened = lv[col + 1].slice(lv[col].length)
    const idx = itemsAt(lv[col]).findIndex((it) => it.type === 'folder' && it.name === opened)
    return { col, idx: Math.max(0, idx) }
  }
  const [cursor, setCursor] = useState(() => seedCursor(prefix))
  useEffect(() => {
    if (keepCursor.current) { keepCursor.current = false; return }
    setCursor(seedCursor(prefix))
  }, [prefix, objects.length]) // eslint-disable-line react-hooks/exhaustive-deps
  /* the cursor is NOT drawn until the keyboard is used (ColumnBrowserCursorStart,
   * kol-r2b2 2026-08-27): at rest it sat on row 0 beside the open folder and
   * read as a second selection. Arrows arm it; a click seeds it. */
  const [cursorActive, setCursorActive] = useState(false)
  const rootRef = useRef(null)
  /* `autoFocus` (ColumnBrowserSeams, kol-r2b2 2026-08-28): the arrow keys were dead until a row was
   * clicked — nothing focused the root on mount, and the consumer reached into the DOM for it. Re-run
   * on `prefix`, so a bucket switch from the header (which takes focus) hands the keyboard back. */
  useEffect(() => { if (autoFocus) rootRef.current?.focus() }, [autoFocus, prefix])

  const land = (level, item) => {
    if (!item) return
    if (item.type === 'folder') { pick(null); onPrefix(level + item.name) }
    else pickFile(level, item.o)
  }

  const onKeyDown = (e) => {
    // Space = Quick Look over the picked column's files, starting at the picked one.
    if (e.key === ' ' && picked) {
      e.preventDefault()
      const siblings = itemsAt(levelsOf(prefix)[cursor.col] ?? '').filter((it) => it.type === 'file').map((it) => it.o)
      onQuickLook?.({ files: siblings, index: Math.max(0, siblings.findIndex((o) => o.key === picked.key)) })
      return
    }
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return
    e.preventDefault()
    setCursorActive(true)
    const lv = levelsOf(prefix)
    const col = Math.min(cursor.col, lv.length - 1)
    const items = itemsAt(lv[col])
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const idx = Math.max(0, Math.min(items.length - 1, cursor.idx + (e.key === 'ArrowDown' ? 1 : -1)))
      /* an arrow that did not move the cursor does nothing — re-landing on an
       * open folder re-fired onPrefix (ColumnBrowserCursorSeed) */
      if (idx === cursor.idx && col === cursor.col) return
      setCursor({ col, idx })
      land(lv[col], items[idx])
    } else if (e.key === 'ArrowRight') {
      // Into the open folder's column, first row.
      if (lv[col + 1]) {
        const next = itemsAt(lv[col + 1])
        setCursor({ col: col + 1, idx: 0 })
        land(lv[col + 1], next[0])
      }
    } else if (col > 0) {
      // Back to the parent column, on the folder we came out of.
      const parentItems = itemsAt(lv[col - 1])
      const opened = lv[col].slice(lv[col - 1].length)
      const idx = Math.max(0, parentItems.findIndex((it) => it.type === 'folder' && it.name === opened))
      setCursor({ col: col - 1, idx })
      pick(null)
      onPrefix(lv[col])
    }
  }
  // While Quick Look is open the overlay holds focus, so the same keys are read
  // off window: ↑/↓ step the picked file (overlay follows), space closes. The
  // opening keystroke bubbles from this component and is ignored.
  useEffect(() => {
    if (!quickLook) return
    const onKey = (e) => {
      if (rootRef.current?.contains(e.target)) return
      if (e.key === ' ') { e.preventDefault(); onQuickLook?.(null); return }
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
      e.preventDefault()
      const lv = levelsOf(prefix)
      const col = Math.min(cursor.col, lv.length - 1)
      const items = itemsAt(lv[col])
      let idx = cursor.idx
      const step = e.key === 'ArrowDown' ? 1 : -1
      do { idx += step } while (items[idx] && items[idx].type !== 'file')
      if (!items[idx]) return
      setCursor({ col, idx })
      pick(items[idx].o)
      const siblings = items.filter((it) => it.type === 'file').map((it) => it.o)
      onQuickLook?.({ files: siblings, index: siblings.findIndex((o) => o.key === items[idx].o.key) })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const levels = levelsOf(prefix) // '' → ['']; 'a/b/' → ['', 'a/', 'a/b/']
  // While Quick Look is open the overlay's index is the truth for the highlight.
  const shown = quickLook ? quickLook.files[quickLook.index] : picked

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      // 12 rows of 44px by default (user ruling 2026-08-27), so the browser never jumps as columns change; each column scrolls.
      // The scroll box is the INNER flex row: the bottom handle is absolute on this root, so it spans the visible width, not the scrolled one.
      className={`kol-column-browser relative border rounded outline-none ${className}`.trim()}
      style={{ borderColor: 'var(--kol-oq-08)', height: h }}
    >
      <div className="flex h-full overflow-x-auto">
      {levels.map((level, k) => {
        const { folders, files } = partition(objects.filter((o) => o.key.startsWith(level)), level)
        const next = levels[k + 1]
        const activeFolder = next ? next.slice(level.length) : null
        const last = k === levels.length - 1 && !shown
        return (
          <Fragment key={level || '/'}>
          <ul
            className="kol-column-browser-column shrink-0 overflow-y-auto border-r"
            style={{ borderColor: 'var(--kol-oq-08)', width: widthOf(k) }}
          >
            {folders.map((f, i) => (
              <Row
                key={f}
                icon="folder"
                label={f.replace(/\/$/, '')}
                active={f === activeFolder}
                cursor={cursorActive && cursor.col === k && cursor.idx === i}
                trailing={<Icon name="chevron-right" size={12} className="text-fg-32" />}
                onClick={() => { setCursor({ col: k, idx: i }); setCursorActive(true); rootRef.current?.focus(); pick(null); onPrefix(level + f) }}
              />
            ))}
            {files.map((o, i) => (
              <Row
                key={o.key}
                icon={COL_ICON[kindOf(o)] || 'file'}
                label={o.displayKey ?? o.key}
                active={shown?.key === o.key}
                cursor={cursorActive && cursor.col === k && cursor.idx === folders.length + i}
                onClick={() => { setCursor({ col: k, idx: folders.length + i }); setCursorActive(true); rootRef.current?.focus(); pickFile(level, o) }}
              />
            ))}
            {folders.length === 0 && files.length === 0 && (
              <li className="kol-mono-12 text-fg-32 px-4 py-3">empty</li>
            )}
          </ul>
          <ResizeHandle axis="x" onDrag={resizeCol(k)} onEnd={endDrag} />
          </Fragment>
        )
      })}
      {shown && (
        <>
          <Preview key={shown.key} o={shown} urlOf={urlOf} kindOf={kindOf} kindLabel={kindLabel} formatSize={formatSize} renderPreview={renderPreview} width={widthOf('preview')} />
          <ResizeHandle axis="x" onDrag={resizeCol('preview')} onEnd={endDrag} />
        </>
      )}
      </div>
      <ResizeHandle axis="y" onDrag={resizeH} onEnd={endDrag} />
    </div>
  )
}
