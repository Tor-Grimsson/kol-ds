import { Fragment, useEffect, useRef, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import KindPreview, { KIND_GLYPH } from '../molecules/KindPreview.jsx'
import FileIcon from '../atoms/FileIcon.jsx'
import RowMenuButton from '../molecules/RowMenuButton.jsx'
import { formatLength } from '../molecules/AudioPreview.jsx'
import { kindOf as dsKindOf, KIND_LABEL as DS_KIND_LABEL } from '../utilities/mediaKinds.js'
import useGrabEdge from '../hooks/useGrabEdge.js'
import useMediaQuery from '../hooks/useMediaQuery.js'
import useMarquee from '../hooks/useMarquee.js'
import { GRAB_COLUMN } from '../utilities/motion.js'

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
 * Rows wear the DS Table's cell metrics (12px 16px, mono 12) with NO divider —
 * the row is a rounded pill on a constant 4px inset, so selecting never shifts
 * the layout (BrowsePageRulingsAndSeams, 2026-09-02). ONE fill on screen and it
 * means selected: hover and the bare keyboard cursor paint nothing, the trail is
 * `fg-02` and the deepest column holding a selection is `fg-04`.
 * Height defaults to 528px = 12 rows × 44px (user ruling); columns scroll. Both
 * the height and every column's width are DRAGGABLE, Finder-style
 * (ColumnBrowserResize, kol-r2b2 2026-08-27 — user: "column height drag yes and
 * individual column width drag" · "that should be a set in ds"): a strip along
 * the browser's bottom edge (`row-resize`) and one on each column's right edge
 * (`col-resize`, the border already there is the visual — the strip is the hit
 * area). Each strip carries the estate's GRAB PILL: hidden at rest, woken by
 * pointer PROXIMITY (`useGrabEdge`, the rail's hook) and travelling along the
 * line to meet the cursor. Pointer events with `setPointerCapture`, no library;
 * native CSS `resize:` was rejected.
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
 * @param {Function} formatDate   (isoString) => string — the row/preview date, ISO date-only by default
 * @param {Function} partition    (objects, level) => { folders: string[], files: object[] }
 * @param {Function} renderPreview  (file) => ReactNode — replaces the preview column's media frame (the facts stay — Dimensions and Length are read off whatever <img> / <video> / <audio> the node loads); without it images render the organism's <img>, everything else the DS KindPreview
 * @param {number|string} height    controlled height — px as a number, or ANY CSS length (`'100%'`, `'60vh'`,
 *                                  `'calc(100dvh - 240px)'`) so the browser can fill the space it is given
 *                                  (kol-client-olina 2026-09-22); a CSS length draws no height grabber;
 *                                  omit for uncontrolled
 * @param {number}   defaultHeight  uncontrolled start height (528); min 240
 * @param {Function} onHeightChange (px) => void — on every drag step, always px; the consumer persists it
 * @param {number}   columnWidth    every column's start width (260); the preview column starts at 320; min 160
 * @param {Object}   columnWidths   the CONTROLLED counterpart to `onColumnResize` (ColumnBrowserWidthsPersist,
 *                                  kol-r2b2 2026-08-27): a map keyed by column index plus `'preview'` —
 *                                  `{ 0: 300, 2: 190, preview: 420 }` — the same shape the callback reports,
 *                                  so a consumer hands back what it stored. A key with no column is ignored;
 *                                  any column it does not name falls back to the drag state, then `columnWidth`
 * @param {Function} onColumnResize (index, px) => void — the column's index, or `'preview'`
 * @param {Function} onDropFiles   (files, folderPath) => void — OS files dropped on a folder row or column; the consumer uploads
 * @param {string}   className    extra classes on the browser
 *
 * @param {Function} thumbnailFor  (o) => node — the 44px tile's content below the breakpoint; null falls back to the kind glyph. WHERE a thumbnail comes from is the consumer's: R2 and B2 serve originals, so a 44px tile can mean a 2 MB download
 * NOTE, both seams: the key/prefix they receive is the one the browser was GIVEN, verbatim. A
 * consumer that mounts a virtual root above real storage (multi-bucket browse hands these
 * `KOL-R2B2/<label>/…`) must strip its own prefix before it can look anything up or build a URL —
 * the browser has no idea which part of a path is yours (kol-r2b2 2026-09-04).
 * @param {Function} folderMeta  (prefix, view) => string — a folder's own meta line (`date · N items` in list, `N items` in grid). A SEAM, not a computation: counting by prefix is O(n) per folder, and a consumer that already holds a folder tree answers it for free
 * @param {'list'|'grid'} stackView  the mobile view below the breakpoint (default 'list'); `grid` is 3-up tiles, flat — a grid has nowhere to put an inline child list
 *
 * BELOW `md` (768) THIS IS A DIFFERENT TREE — one full-width inline-expanding
 * list, not columns (`ColumnBrowserStackMode`, kol-r2b2 2026-09-03, user-ruled
 * inline expand over push). `height` / `defaultHeight` / `onHeightChange`,
 * `columnWidth` / `columnWidths` / `onColumnResize` and the resize handles are
 * all DESKTOP-ONLY and inert there: a stored height is a value someone dragged
 * on a desktop, and the list takes the viewport instead. A file tap fires
 * `onQuickLook` rather than opening the preview column, so the consumer's
 * existing full-screen inspector is the phone's preview. Everything else —
 * `prefix`/`onPrefix`, `onPick`, the seams, the keyboard on a device that has
 * one — is unchanged.
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

/* THE STACK'S ROW LIST — the CURRENT LEVEL'S CONTENTS, and nothing above it.
 *
 * Lifted out of the component so the order is reachable by a check: the two
 * defects this function has had were both invisible to a structural assertion —
 * every row present, every `depth` right, and the LIST still wrong.
 *
 * D1 (2026-09-04) was order: a flat loop over the open path appended each level
 * after the whole level above it, so an open folder's children landed after its
 * last sibling and after that level's files. The walk is recursive now and a
 * subtree is contiguous under its parent.
 *
 * `StackModeChromeAndAncestors` (kol-r2b2, 2026-09-04) was MEMBERSHIP, and the
 * correction is theirs against their own spec: the browser walked from the root
 * down the open path, so every ANCESTOR of the current level rendered as a row —
 * at a bucket root, two rows and 120px of a 844px viewport restating the
 * breadcrumb directly above them, with rows indented to 56px because depth
 * counted from the root.
 *
 * The original spec held two rules that fight: "ancestors are reached by back,
 * not by a scroll nobody can see" and "inline expand, capped at three levels of
 * indent" — back means they are off screen, an indent cap implies they are on
 * it. The resolution is that NAVIGATING and EXPANDING were fused into one piece
 * of state and had to come apart:
 *
 *   the ROW opens the folder      → `onPrefix`, and the list re-bases to it
 *   the CHEVRON expands in place  → local state, children spliced under it
 *
 * which is what item 11 already said the two targets were for. So `base` is the
 * level the consumer navigated to, depth restarts there, and nothing above it is
 * ever a row.
 *
 * @param {object[]} objects     the flat key space
 * @param {string}   base        the current level — its contents are the list
 * @param {Function} isExpanded  (folderPath) => boolean; `() => false` is a flat list
 * @param {Function} partition   (objects, level) => { folders, files }
 * @param {number}   cap         deepest expansion below `base` (default INDENT_CAP)
 * @returns {object[]} rows — `folder` | `file` | `empty`, each with its `depth`
 */
export function stackRows(objects, base, isExpanded, partition, cap = INDENT_CAP) {
  const rows = []
  const walk = (level, depth) => {
    const { folders, files } = partition(objects.filter((o) => o.key.startsWith(level)), level)
    folders.forEach((f) => {
      const path = level + f
      const open = depth < cap && isExpanded(path)
      rows.push({ kind: 'folder', key: path, level, name: f, depth, open })
      if (open) walk(path, depth + 1)
    })
    files.forEach((o) => rows.push({ kind: 'file', key: o.key, o, depth, level }))
    if (!folders.length && !files.length) rows.push({ kind: 'empty', key: level + '·empty', depth })
  }
  walk(base, 0)
  return rows
}

/* A ROW SHOWS A DATE, NOT A TIMESTAMP. `2026-06-19T02:00:14.629Z` is storage
 * answering "when" in its own voice, and it shipped into the stack meta line
 * because the value arrives as a string and a string renders (D2, kol-r2b2
 * 2026-09-04). A seam beside `formatSize` for the same reason that one is a
 * seam: how a date reads is the consumer's call, not the DS's. The default is
 * ISO-8601 date-only — unambiguous everywhere, which no locale format is.
 * Anything unparseable comes through verbatim rather than as `Invalid Date`. */
const defaultFormatDate = (v) => {
  if (!v) return ''
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? String(v) : d.toISOString().slice(0, 10)
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
/* a drag carrying files from the OS, as opposed to one of our own rows */
export const isFileDrag = (e) => [...(e.dataTransfer?.types ?? [])].includes('Files')

/* kol-icons has no `audio` glyph yet — audio rows wear `file` until it does */
const COL_ICON = { image: 'image', video: 'video', audio: 'file', playlist: 'video' }

/* ColumnBrowserChromeCorrections (kol-r2b2 2026-08-28, four user rulings measured live on admin.):
 * every column keeps its right edge, the last included — without it the browser reads as an
 * open-sided container when the columns do not fill the box (Finder closes it); and ONE ink for
 * folders and files — the fill alone marks selection ("why is folder full opacity but not
 * files?"). `muted` stays a prop for other callers; the file rows no longer pass it.
 * NO ROW DIVIDERS (BrowsePageRulingsAndSeams, kol-r2b2 2026-09-02): the `border-b last:border-b-0
 * only:border-b` utilities and their inline `borderColor` are gone. The row is a PILL now — a
 * constant 4px inset on every row so selecting never shifts the layout, radius-sm on the fill —
 * and a hairline under a rounded pill draws the box the pill is trying not to be. The shape lives
 * in kol-components-molecules.css with the fill, not as utilities racing it (ARCHITECTURE §5);
 * this supersedes the `only:` hairline half of the 08-28 corrections, by the same repo's ruling.
 * STATE CLASSES (ColumnBrowserSeams, kol-r2b2 2026-08-28): `is-selected` / `is-cursor` on the row,
 * and the fill LIVES IN THE THEME now (kol-components-molecules.css) instead of a `bg-fg-04`
 * utility — the only hook a consumer had for "selected" was that utility, and a restyle that
 * changes it breaks every rule hanging off it silently (twice already in kol-r2b2). It also lets the
 * theme say the user's ruling — "ONLY one selected state can exist, not TWO": the selected row in
 * the deepest column that holds one is full strength, every column on the way there is the trail. */
/* `indent` and `meta` serve the STACK mode and are inert without it: the
 * columns pass neither, so a desktop row is byte-identical to what it was. */
/* Three levels of inline expansion below the current level, then the chevron
 * stops expanding — the user's cap (ColumnBrowserStackMode, 2026-09-03): a deep
 * path indents until the name has no room. Past it the ROW is the way down; it
 * re-bases the list and the back control names what it left. */
const INDENT_CAP = 3

/* The four-zone row's icon/thumbnail box. ONE constant because the glyph that
 * stands in for a missing thumbnail is sized off it — two numbers here is how
 * the box and its contents drifted apart in the first place. */
const ZONE_BOX = 44

/* THE FOUR-ZONE ROW (ColumnBrowserMobileViews §1, kol-r2b2 2026-09-03) is the
 * `zones` form. The first stack build inherited the DS Table's `12px 16px` with
 * a 14px glyph in a 20px slot, and the user's read was *"kinda underwhelming…
 * did you even look at the refs?"* — correctly, and the fault was the spec's.
 * iOS Files and Dropbox both draw four:
 *
 *   1 · disclosure  14px, FOLDERS ONLY, its own tap target — tapping it
 *                   expands in place, tapping the row opens. Without the split
 *                   there is no way to peek into a folder without leaving the
 *                   one you are in
 *   2 · icon        44×44 at radius 5 — a folder glyph, or a real THUMBNAIL
 *   3 · text        name, then meta beneath
 *   4 · trailing    20px, the row's own affordance
 *
 * Row height follows zone 2: 60px, not the table padding. The divider starts at
 * zone 3's left edge, not the row's — both references.
 *
 * `zones`, `thumb`, `onDisclose`, `disclosed`, `indent` and `meta` are all inert
 * without the stack: the columns pass none, so a desktop row is byte-identical
 * to what it was. */
function Row({
  icon, label, active, cursor = false, trailing, onClick, muted = false,
  indent = 0, meta, zones = false, thumb, onDisclose, disclosed, onContextMenu, drop, dropFiles, markKey,
}) {
  const [over, setOver] = useState(false)
  /* A COLUMN ROW IS THE SAME ROW as the list view's, so it takes the same two seams: right-click
   * and, for a folder, a drop target. Without them every handler is undefined and nothing moves.
   * `dropFiles(files)` is the OS half — files dragged in from the desktop, same highlight. */
  const takesFiles = (e) => dropFiles && isFileDrag(e)
  const dropProps = drop || dropFiles ? {
    draggable: !!drop,
    onDragStart: drop ? (e) => { e.stopPropagation(); drop.onDragStart(e, drop.path) } : undefined,
    onDragOver: (e) => { if (takesFiles(e) || (drop && !isFileDrag(e) && drop.canDrop(drop.path))) { e.preventDefault(); setOver(true) } },
    onDragLeave: () => setOver(false),
    onDrop: (e) => {
      e.preventDefault(); e.stopPropagation(); setOver(false)
      if (takesFiles(e)) dropFiles(e.dataTransfer.files)
      else if (drop && !isFileDrag(e)) drop.onDrop(drop.path)
    },
  } : {}
  return (
    <li
      onContextMenu={onContextMenu}
      {...dropProps}
      data-marquee-key={markKey}
      data-drop-over={over || undefined}
      /* Row metrics are the DS Table's (kol-components-organisms.css .kol-table-cell-*):
       * 12px 16px padding, mono 12, an oq-08 hairline between rows, none after the last.
       * The `zones` row sets its own 60px instead — a 44px thumbnail in a
       * 12px-padded row is three times too airy. */
      /* `cursor` = the keyboard row, drawn with the hover fill so ↑/↓ always shows where you are. */
      className={`kol-column-browser-row flex items-center gap-2 cursor-pointer transition-colors${
        zones ? ' kol-column-browser-row--zones px-4' : ' px-4 py-3'}${
        active ? ' is-selected' : ''}${cursor ? ' is-cursor' : ''} ${
        active || cursor || !muted ? 'text-fg-default' : 'text-fg-48'
      }`}
      onClick={onClick}
      /* the indent is a PADDING, not a nested list: one flat <ul> keeps the
       * rows one scroll box and one keyboard sequence, which a tree of nested
       * scrollers does not */
      style={indent ? { paddingLeft: `calc(var(--kol-spacing-4) + ${indent} * var(--kol-spacing-5))` } : undefined}
    >
      {/* ZONE 1 — disclosure, its own tap target. A bare span holds the column
          for files so every icon in the list lands on one x. */}
      {zones && (onDisclose ? (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDisclose() }}
          aria-expanded={!!disclosed}
          aria-label={disclosed ? 'Collapse folder' : 'Expand folder'}
          className="kol-column-browser-disclose shrink-0 inline-flex items-center justify-center"
          style={{ width: 14, alignSelf: 'stretch', color: 'var(--kol-accent-primary)' }}
        >
          <Icon name={disclosed ? 'chevron-down' : 'chevron-right'} size={12} />
        </button>
      ) : (
        <span aria-hidden="true" className="shrink-0" style={{ width: 14 }} />
      ))}

      {/* ZONE 2 — the icon box, or the thumbnail the consumer supplies.
          THE GLYPH FILLS THE BOX (StackModeChromeAndAncestors §3, kol-r2b2
          2026-09-04). It sat at 20 in a 44 box while a file's thumbnail filled
          its 44, so the icon column read ragged — thumbnails filling their
          squares, folder marks floating in the middle of theirs. The grid had
          it right already (tile-box 103, thumb 103); this is the list catching
          up, and it is what makes the column read as ONE RAIL.
          Not a glyph-ladder rung and not a contradiction of one: SOLO pairs
          12/16/20/24 with the CONTROL squares 22/26/32/40. This is not a
          control square — it is a MEDIA slot that a glyph stands in for when
          the consumer has no thumbnail, which is why an <img> fills it. */}
      {zones ? (
        <span
          className="kol-column-browser-thumb shrink-0 inline-flex items-center justify-center overflow-hidden"
          style={{ width: ZONE_BOX, height: ZONE_BOX, borderRadius: 5, background: thumb ? 'var(--kol-oq-04)' : 'transparent' }}
        >
          {thumb ?? <Icon name={icon} size={ZONE_BOX} className="text-oq-48" />}
        </span>
      ) : (
        <span className="w-5 shrink-0 flex items-center justify-center text-oq-48">
          {/* one glyph size for every row — a folder and a file side by side draw at the same size
              (user 2026-09-25; the file glyph was 14 against the folder's 18) */}
          <Icon name={icon} size={18} />
        </span>
      )}

      {/* ZONE 3 — name over meta */}
      {meta ? (
        <span className="flex-1 min-w-0 flex flex-col gap-0.5">
          <span className="kol-mono-12 truncate">{label}</span>
          <span className="kol-helper-10 text-fg-48 truncate">{meta}</span>
        </span>
      ) : (
        <span className="kol-mono-12 flex-1 truncate">{label}</span>
      )}

      {/* ZONE 4 */}
      {zones ? <span className="shrink-0 inline-flex justify-end" style={{ width: 20 }}>{trailing}</span> : trailing}
      {/* on touch the row's menu has a face — see RowMenuButton; the negative margins keep the row's
          height and inset what they were without it */}
      <RowMenuButton onOpen={onContextMenu} className="-my-2 -mr-2" />
    </li>
  )
}

function Preview({ o, urlOf, kindOf, kindLabel, formatSize, formatDate, renderPreview, width }) {
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
    ['Date', formatDate(o.uploaded) || '—'],
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
          className="kol-column-browser-media w-full min-h-[160px] max-h-[60vh] overflow-auto rounded bg-oq-04 flex items-center justify-center"
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
 * `is-dragging` keeps the pill lit while the pointer is captured.
 *
 * THE PILL FOLLOWS THE POINTER (BrowsePageRulingsAndSeams, kol-r2b2 2026-09-02,
 * user ruling). It used to sit dead centre and wake on :hover — the theme's own
 * comment said pointer-following "was built and rejected", while the SAME
 * gesture had shipped on the rail's grab edge the same day and has run in
 * kol-r2b2 since. `useGrabEdge` is that implementation; this is the second
 * consumer of it, which is why the hook grew an `axis` rather than a fork.
 *
 * The handle's axis is named for what it RESIZES — `x` drags the column's width
 * — and the pill on it travels the other way, down the vertical edge. So the
 * `x` handle takes `axis: 'y'` and the `y` handle `axis: 'x'`: the hook's axis
 * is the pill's travel, not the drag. Getting this pair backwards is the one
 * easy mistake here.
 *
 * `GRAB_COLUMN`, not the rail's `GRAB` (user 2026-09-02: *"its not like the
 * sidenav. the handles are different from the sidenav"*) — a 2.8s chase and a
 * 30px retarget, so the pill tracks the pointer instead of landing and holding
 * on the rail's 90px dwell. */
function ResizeHandle({ axis, onDrag, onEnd }) {
  const [dragging, setDragging] = useState(false)
  const start = useRef(null)
  const ref = useRef(null)
  useGrabEdge(ref, { axis: axis === 'x' ? 'y' : 'x', ...GRAB_COLUMN })
  return (
    <div
      ref={ref}
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
  /* `picked` — the file the CALLER holds picked (a key or an object; kol-client-olina 2026-09-25:
   * a pick made in rows or grid was lost on the switch to columns, because this browser kept its
   * own). Given, the browser opens on that file's level with its row selected and previewed, and
   * follows it when it changes; absent (`undefined`), the pick is internal exactly as before. */
  picked: pickedIn,
  urlOf,
  kindOf = defaultKindOf,
  kindLabel = DEFAULT_KIND_LABEL,
  formatSize = defaultFormatSize,
  formatDate = defaultFormatDate,
  partition = defaultPartition,
  renderPreview,
  height,
  defaultHeight = 528,
  onHeightChange,
  columnWidth = 260,
  columnWidths,
  onColumnResize,
  /* RIGHT-CLICK AND DROP, handed down (2026-09-21). `onRowContextMenu(event, { type, path, o })`
   * and `dragFor(path)` are the page's; this component owns the geometry of a row, never what a
   * row can have done to it. Absent, the columns behave exactly as they did. */
  onRowContextMenu,
  dragFor,
  /* `onDropFiles(files, folderPath)` — files dragged in FROM THE OS onto a folder row or a column
   * (kol-client-olina 2026-09-22). The browser hands over the `FileList` and the target path and
   * never uploads: each consumer's pipeline differs, so the upload is theirs, and they re-list.
   * Absent, an OS drag shows nothing and does nothing. */
  onDropFiles,
  /* MULTI-SELECT BY DRAG (user 2026-09-22). `selectedKeys` is the set the caller owns — paths for
   * folders, keys for files, exactly as this component hands them out — and `onSelectKeys(keys,
   * additive)` reports what a band touched. Without the pair, a drag on the background does
   * nothing, as before. */
  selectedKeys,
  onSelectKeys,
  /* `onSelectClick(key, event, columnKeys)` — every row click, modifiers included, handed to the
   * caller's selection model first (user 2026-09-23: ⇧-click *"should add to selection"*). Return
   * true when the click was a selection gesture and the browser must not navigate. */
  onSelectClick,
  /* `folderIcon(path)` — the glyph a folder row wears (default `folder`). The media pages mark a
   * bucket — a SOURCE, not a prefix — with `database` (user 2026-09-23). */
  folderIcon,
  /* THE TWO SEAMS THE MOBILE TICKET'S RULINGS POINT AT (ColumnBrowserMobileViews,
   * kol-r2b2 2026-09-03). Both are questions the DS must not answer for a
   * consumer, so neither is computed here:
   *
   * `thumbnailFor(o)` — a node for the 44px box, or null for the kind glyph.
   *   WHERE a thumbnail comes from is the consumer's and it is not free: R2 and
   *   B2 serve originals, so a 44px tile can mean downloading a 2 MB JPEG. That
   *   repo's own mitigations (lazy originals, a resolution-set that picks the
   *   smallest variant) and whether to buy image resizing are its calls.
   *
   * `folderMeta(prefix)` — the folder's own meta line, `date · N items` in the
   *   references. Counting `objects` by prefix is O(n) per folder against a
   *   3443-object bucket, and that repo already passes a baked folder tree
   *   carrying files and bytes. A seam, not a computation — the ticket says so
   *   and it is right. */
  thumbnailFor,
  folderMeta,
  /* `list` (default) or `grid` below the breakpoint — item 14. 3-up, and for a
   * media bucket the thumbnail IS the tile, so it carries counts and sizes
   * rather than dates (§2). Above the breakpoint the columns are unaffected. */
  stackView = 'list',
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
    /* a string height (`'100%'`, `calc()`) has no arithmetic — the drag starts from what it
     * RENDERED at, so there is no jump, and reports px from then on */
    if (dragBase.current == null) dragBase.current = typeof h === 'number' ? h : (rootRef.current?.getBoundingClientRect().height ?? MIN_H)
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
  const pickedInKey = typeof pickedIn === 'string' ? pickedIn : pickedIn?.key ?? null
  useEffect(() => {
    if (pickedIn === undefined || (picked?.key ?? null) === pickedInKey) return
    const o = typeof pickedIn === 'string' ? objects.find((x) => x.key === pickedIn) : pickedIn
    if (!o) { setPicked(null); return }
    const level = o.key.slice(0, o.key.lastIndexOf('/') + 1)
    setPicked(o)
    setCursor(seedCursor(level))
    if (prefix !== level) { keepCursor.current = true; pickedByCollapse.current = true; onPrefix(level) }
  }, [pickedInKey]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (pickedByCollapse.current) { pickedByCollapse.current = false; return } if (picked) pick(null) }, [prefix]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setExpanded((prev) => (prev.size ? new Set() : prev)) }, [prefix])
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
    /* a caller's `picked` file at this level is where the keyboard starts — on the file, not on
     * the folder that opened its column */
    if (pickedInKey?.startsWith(pfx) && !pickedInKey.slice(pfx.length).includes('/')) {
      const idx = itemsAt(pfx).findIndex((it) => it.type === 'file' && it.o.key === pickedInKey)
      if (idx >= 0) return { col: lv.length - 1, idx }
    }
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
  /* STACK EXPANSION IS NOT NAVIGATION (StackModeChromeAndAncestors, kol-r2b2
   * 2026-09-04). The chevron expands a folder where it stands; the ROW opens it
   * and re-bases the list. Fusing both into `prefix` is what put the whole
   * ancestor chain on screen as rows. Local because it is a VIEW state below a
   * breakpoint — a consumer persisting it would be storing a phone gesture, and
   * a desktop never reads it. Cleared whenever the level changes: expansions
   * belong to the list they were made in. */
  const [expanded, setExpanded] = useState(() => new Set())
  const toggleExpanded = (path) => setExpanded((prev) => {
    const next = new Set(prev)
    if (!next.delete(path)) next.add(path)
    return next
  })
  const rootRef = useRef(null)
  /* `autoFocus` (ColumnBrowserSeams, kol-r2b2 2026-08-28): the arrow keys were dead until a row was
   * clicked — nothing focused the root on mount, and the consumer reached into the DOM for it. Re-run
   * on `prefix`, so a bucket switch from the header (which takes focus) hands the keyboard back. */
  useEffect(() => { if (autoFocus) rootRef.current?.focus() }, [autoFocus, prefix])

  /* THE KEYBOARD SELECTS TOO (user 2026-09-23: *"the highlight focus is on the correct item, this
   * has been a problem for awhile"*). Clicks reported through `onSelectClick`; the arrows moved
   * the cursor and the pick and told the caller nothing, so its selection kept the last CLICKED
   * row lit beside the one the arrows had reached. Every keyboard move now replaces it. */
  const selectOnly = (key) => onSelectKeys?.(key ? [key] : [], false)
  const land = (level, item) => {
    if (!item) return
    if (item.type === 'folder') { pick(null); selectOnly(level + item.name); onPrefix(level + item.name) }
    else { selectOnly(item.o.key); pickFile(level, item.o) }
  }

  const shiftAnchor = useRef(null)
  const onKeyDown = (e) => {
    /* ⌘↑ / ⌘↓ (user 2026-09-23: *"all modes should 'command up down' to move up and down parent
     * child"*) — Finder's: ⌘↑ is ←, back to the enclosing folder; ⌘↓ opens what the cursor is on,
     * → for a folder and Quick Look for a file. */
    if (e.metaKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault()
      if (e.key === 'ArrowUp') return onKeyDown({ key: 'ArrowLeft', preventDefault() {} })
      if (picked) return onKeyDown({ key: ' ', preventDefault() {} })
      return onKeyDown({ key: 'ArrowRight', preventDefault() {} })
    }
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
      /* ⇧ + ↑↓ EXTENDS within the column (user 2026-09-23): the run from where it began to the
       * cursor becomes the selection; nothing opens, nothing is previewed but the stack */
      if (e.shiftKey && onSelectKeys) {
        /* a new run starts wherever the cursor is unless it is still where the last ⇧ step left it */
        const sa = shiftAnchor.current
        if (!sa || sa.col !== col || sa.last !== cursor.idx) shiftAnchor.current = { col, idx: cursor.idx }
        shiftAnchor.current.last = idx
        const a = shiftAnchor.current.idx
        const keyOf = (it) => (it.type === 'folder' ? lv[col] + it.name : it.o.key)
        setCursor({ col, idx })
        onSelectKeys(items.slice(Math.min(a, idx), Math.max(a, idx) + 1).map(keyOf), false)
        return
      }
      shiftAnchor.current = null
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
      selectOnly(lv[col])
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
      selectOnly(items[idx].o.key)
      const siblings = items.filter((it) => it.type === 'file').map((it) => it.o)
      onQuickLook?.({ files: siblings, index: siblings.findIndex((o) => o.key === items[idx].o.key) })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const levels = levelsOf(prefix) // '' → ['']; 'a/b/' → ['', 'a/', 'a/b/']
  // While Quick Look is open the overlay's index is the truth for the highlight.
  const shown = quickLook ? quickLook.files[quickLook.index] : picked

  /* ── THE STACK MODE (ColumnBrowserStackMode, kol-r2b2 2026-09-03) ─────────
   *
   * Miller columns put hierarchy on the X AXIS, and a phone has no width to
   * spend on it: at 390 two 260px columns plus a gutter overflow, the inner row
   * scrolls with nothing to say so, and a horizontal scroll inside a vertical
   * page is a gesture nobody goes looking for. Measured on a live site, in a
   * different repo running these same organisms — the layout ported and carried
   * the missing mobile story with it, which is what makes this the DS's.
   *
   * THE RULING IS INLINE EXPAND, not push-and-back (user, 2026-09-03). iOS
   * Files and Dropbox arrived at one-level-at-a-time independently and differ
   * only on the descent; push discards the very thing this organism exists for
   * — a parent that stays put while you look at its child — and leaves a
   * generic file list any component could render. Inline expand keeps the idea
   * and moves it from two axes onto one.
   *
   * CAPPED AT THREE LEVELS, then it pushes: a deep bucket path indents until
   * the name has no room. Past the cap the list re-bases on a deeper folder and
   * the back control NAMES the parent it returns to — a bare chevron does not
   * say where it goes.
   *
   * This is a different TREE, not the same tree restyled, which is why it forks
   * in JS on a media query rather than in the stylesheet. The breakpoint is
   * `md` (768) — the one `ContentFilters` already uses, so a page has one
   * responsive story and not two. */
  const stack = useMediaQuery('(max-width: 767px)')
  /* one band for the whole browser rather than one per column: a drag that starts in a column and
   * runs into the next is a drag the user meant */
  const marquee = useMarquee({
    enabled: !!onSelectKeys,
    onSelect: (keys, additive) => onSelectKeys?.(keys, additive),
  })
  const isPicked = (key) => selectedKeys?.has(key)
  /* THE DEEPEST COLUMN STAYS IN VIEW (user 2026-09-23: arrowing onto a file left the preview
   * clipped under the frame's right edge). Whenever the trail or the pick changes, the strip scrolls
   * to its end — the newest column, or the preview, is always the one you just reached. */
  useEffect(() => {
    const box = marquee.ref.current
    if (box && box.scrollWidth > box.clientWidth) box.scrollTo({ left: box.scrollWidth, behavior: 'smooth' })
  }, [prefix, picked?.key, selectedKeys?.size]) // eslint-disable-line react-hooks/exhaustive-deps

  if (stack) {
    /* THE CURRENT LEVEL IS THE LIST (StackModeChromeAndAncestors, kol-r2b2
     * 2026-09-04). `base` is where the consumer navigated to and depth restarts
     * there; nothing above it is ever a row. The back control is the only place
     * an ancestor appears, and it NAMES the one it returns to. */
    const base = prefix
    const parent = levels.length > 1 ? levels[levels.length - 2] : null

    /* The grid is FLAT — a tile has nowhere to put a child list, so expansion
     * is not offered there and the list is one level, as both references draw
     * it. */
    const rows = stackRows(objects, base, stackView === 'grid' ? () => false : (path) => expanded.has(path), partition)

    const metaOf = (o) => [o.size != null && formatSize(o.size), formatDate(o.uploaded)].filter(Boolean).join(' · ')

    return (
      <div
        /* NO FRAME BELOW `md` (StackModeChromeAndAncestors §2). On desktop this
           is a PANE — a thing with edges sitting in a page — so it is bordered
           and rounded. In stack mode it IS the page's content: rows run to the
           page's own padding and the only line is the divider between them.
           Neither reference frames it. */
        className={`kol-column-browser kol-column-browser--stack flex flex-col ${className}`.trim()}
        /* THE VIEWPORT IS THE HEIGHT (item 4). `height` is a value someone
         * dragged on a desktop; applied literally to a phone it painted a
         * black void the length of the viewport under two near-empty columns.
         * A desktop drag is not a phone measurement, so below the breakpoint
         * the stored one is ignored outright rather than clamped. */
      >
        {parent != null && (
          <button
            type="button"
            onClick={() => onPrefix(parent)}
            className="kol-column-browser-back flex items-center gap-2 px-4 py-3 border-b text-fg-default"
            style={{ borderColor: 'var(--kol-oq-08)' }}
          >
            <Icon name="chevron-left" size={14} className="text-oq-48" />
            {/* NAMES THE PARENT (item 2) — the folder it returns to, not '‹' */}
            <span className="kol-mono-12 truncate">
              {parent === '' ? 'All files' : parent.replace(/\/$/, '').split('/').pop()}
            </span>
          </button>
        )}
        {stackView === 'grid' ? (
          /* THE GRID (item 14). Flat — one level at a time, no inline expand:
             a grid of tiles has nowhere to put a child list, which is why both
             references drop disclosure in this view and navigate by tap. */
          <div className="kol-column-browser-grid flex-1 overflow-y-auto">
            {rows.filter((r) => r.kind !== 'empty').map((r) => {
              const isFolder = r.kind === 'folder'
              const o = r.o
              const menu = onRowContextMenu && ((e) => onRowContextMenu(e, isFolder ? { type: 'folder', path: r.level + r.name } : { type: 'file', path: o.key, o }))
              return (
                /* the wrapper exists so the `···` is a SIBLING of the tile, not a button inside one */
                <div key={r.key} className="relative min-w-0">
                <button
                  type="button"
                  className={`kol-column-browser-tile w-full${!isFolder && shown?.key === o.key ? ' is-selected' : ''}`}
                  onContextMenu={menu}
                  onClick={() => {
                    if (isFolder) { onPrefix(r.level + r.name); return }
                    const files = itemsAt(r.level ?? '').filter((it) => it.type === 'file').map((it) => it.o)
                    pick(o)
                    onQuickLook?.({ files: files.length ? files : [o], index: Math.max(0, files.findIndex((f) => f.key === o.key)) })
                  }}
                >
                  <span className="kol-column-browser-tile-box">
                    {isFolder
                      ? <Icon name="folder" size={28} className="text-oq-48" />
                      : (thumbnailFor?.(o) ?? <Icon name={COL_ICON[kindOf(o)] || 'file'} size={28} className="text-oq-48" />)}
                  </span>
                  <span className="kol-mono-12 truncate">{isFolder ? r.name.replace(/\/$/, '') : (o.displayKey ?? o.key)}</span>
                  {/* counts for a folder, size for a file — never dates (§2) */}
                  <span className="kol-helper-10 text-fg-48 truncate">
                    {isFolder ? folderMeta?.(r.level + r.name, 'grid') : (o.size != null ? formatSize(o.size) : '')}
                  </span>
                </button>
                <RowMenuButton variant="grey" onOpen={menu} className="absolute top-1 right-1" />
                </div>
              )
            })}
          </div>
        ) : (
        <ul className="kol-column-browser-column flex-1 overflow-y-auto"
          onContextMenu={(e) => onRowContextMenu?.(e, { type: 'level', path: prefix })}>
          {rows.map((r) =>
            /* Same ruling as the desktop column: nothing to say, so it says nothing. This is the
             * mobile stack's row for an empty folder. */
            r.kind === 'empty' ? (
              <li key={r.key} className="min-h-12" />
            ) : r.kind === 'folder' ? (
              <Row
                key={r.key}
                zones
                icon={folderIcon?.(r.level + r.name) ?? 'folder'}
                label={r.name.replace(/\/$/, '')}
                indent={r.depth}
                active={r.open}
                meta={folderMeta?.(r.level + r.name)}
                /* DISCLOSURE IS ITS OWN TARGET (item 11): the chevron expands
                 * in place, the ROW opens the folder. One control doing both is
                 * what left no way to peek without leaving where you are. */
                disclosed={r.open}
                /* the chevron expands where it stands and does NOT move the
                 * level; past the indent cap it has nothing left to offer, so
                 * the row is the only way down */
                onDisclose={r.depth < INDENT_CAP ? () => toggleExpanded(r.key) : undefined}
                /* THE ROW'S OWN MENU. Only the <ul> carried one, so a menu opened on a phone row
                 * targeted the LEVEL — the rename and delete the row was asking for were not there. */
                onContextMenu={onRowContextMenu && ((e) => onRowContextMenu(e, { type: 'folder', path: r.level + r.name }))}
                onClick={() => onPrefix(r.level + r.name)}
              />
            ) : (
              <Row
                key={r.key}
                zones
                icon={COL_ICON[kindOf(r.o)] || 'file'}
                thumb={thumbnailFor?.(r.o)}
                label={r.o.displayKey ?? r.o.key}
                indent={r.depth}
                meta={metaOf(r.o)}
                active={shown?.key === r.o.key}
                onContextMenu={onRowContextMenu && ((e) => onRowContextMenu(e, { type: 'file', path: r.o.key, o: r.o }))}
                /* A FILE IS A PUSH, NOT A PREVIEW PANE (item 6): there is no
                 * column for the preview to sit beside at this width, so the
                 * tap opens the full-screen inspector the consumer already
                 * renders for Quick Look. */
                onClick={() => {
                  const files = itemsAt(r.level ?? '').filter((it) => it.type === 'file').map((it) => it.o)
                  pick(r.o)
                  onQuickLook?.({ files: files.length ? files : [r.o], index: Math.max(0, files.findIndex((f) => f.key === r.o.key)) })
                }}
              />
            ),
          )}
        </ul>
        )}
      </div>
    )
  }

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
      {/* A CLICK ON THE BACKGROUND DESELECTS (user 2026-09-22) — the band's own closing click is
          swallowed by the hook, so this only ever fires on a real click into empty space. */}
      <div ref={marquee.ref} {...marquee.props} className="relative flex h-full overflow-x-auto"
        onClick={(e) => { if (!e.target.closest('[data-marquee-key]')) { pick(null); onSelectKeys?.([], false) } }}>
        {marquee.rect && <div className="kol-marquee" style={marquee.rect} />}
      {levels.map((level, k) => {
        const { folders, files } = partition(objects.filter((o) => o.key.startsWith(level)), level)
        const next = levels[k + 1]
        const activeFolder = next ? next.slice(level.length) : null
        const last = k === levels.length - 1 && !shown
        const colKeys = [...folders.map((f) => level + f), ...files.map((o) => o.key)]
        return (
          <Fragment key={level || '/'}>
          <ul
            className="kol-column-browser-column shrink-0 overflow-y-auto border-r"
            style={{ borderColor: 'var(--kol-oq-08)', width: widthOf(k) }}
            /* THE WHOLE COLUMN IS A TARGET, not just its rows and not just an empty column.
             *
             * RIGHT-CLICK: `openAt` stops propagation, so a row that was hit answers first and
             * this only fires on the blank area below the last row — where you reach for
             * "new folder" in every file manager.
             *
             * DROP: a column IS the folder it is showing, so dropping anywhere in it files the
             * item there. You could drop ON a folder row but not INTO the folder you were looking
             * at, which is the one target that was missing. The highlight goes straight to a data
             * attribute rather than through state — it is transient, it belongs to one node, and a
             * re-render per dragover across every column buys nothing. */
            onContextMenu={(e) => onRowContextMenu?.(e, { type: 'level', path: level })}
            onDragOver={(e) => {
              const files = onDropFiles && isFileDrag(e)
              /* `d.path`, never `level`: the caller may re-root the path it was handed (the media
               * pages prefix every level with `<title>/<bucket>/`), and moving to the raw level
               * renamed files under a prefix nothing lists — they vanished (user 2026-09-23). */
              const d = !isFileDrag(e) && dragFor?.(level)
              if (!files && !d?.canDrop(d.path)) return
              e.preventDefault()
              e.currentTarget.dataset.dropOver = '1'
            }}
            /* cleared however the drag ends: a drop on a row stops propagation, so capture runs
             * first; and leaving through a child fires on the child, not on the column */
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) delete e.currentTarget.dataset.dropOver }}
            onDropCapture={(e) => { delete e.currentTarget.dataset.dropOver }}
            onDrop={(e) => {
              if (onDropFiles && isFileDrag(e)) { e.preventDefault(); onDropFiles(e.dataTransfer.files, level); return }
              const d = !isFileDrag(e) && dragFor?.(level)
              if (!d?.canDrop(d.path)) return
              e.preventDefault()
              d.onDrop(d.path)
            }}
          >
            {folders.map((f, i) => (
              <Row
                key={f}
                icon={folderIcon?.(level + f) ?? 'folder'}
                label={f.replace(/\/$/, '')}
                markKey={level + f}
                active={f === activeFolder || isPicked(level + f)}
                cursor={cursorActive && cursor.col === k && cursor.idx === i}
                trailing={<Icon name="chevron-right" size={12} className="text-oq-32" />}
                onContextMenu={onRowContextMenu && ((e) => onRowContextMenu(e, { type: 'folder', path: level + f }))}
                drop={dragFor?.(level + f)}
                dropFiles={onDropFiles ? (list) => onDropFiles(list, level + f) : undefined}
                onClick={(e) => { if (onSelectClick?.(level + f, e, colKeys)) return; setCursor({ col: k, idx: i }); setCursorActive(true); rootRef.current?.focus(); pick(null); onPrefix(level + f) }}
              />
            ))}
            {files.map((o, i) => (
              <Row
                key={o.key}
                icon={COL_ICON[kindOf(o)] || 'file'}
                label={o.displayKey ?? o.key}
                markKey={o.key}
                active={shown?.key === o.key || isPicked(o.key)}
                cursor={cursorActive && cursor.col === k && cursor.idx === folders.length + i}
                onContextMenu={onRowContextMenu && ((e) => onRowContextMenu(e, { type: 'file', path: o.key, o }))}
                drop={dragFor?.(o.key)}
                onClick={(e) => { if (onSelectClick?.(o.key, e, colKeys)) return; setCursor({ col: k, idx: folders.length + i }); setCursorActive(true); rootRef.current?.focus(); pickFile(level, o) }}
              />
            ))}
            {/* AN EMPTY COLUMN IS VISIBLY EMPTY (user 2026-09-21). It used to print the word
              * "empty", which tells you what you can already see. The row stays as a right-click
              * target — that is the only thing it was ever load-bearing for — and says nothing. */}
            {folders.length === 0 && files.length === 0 && (
              <li className="flex-1 min-h-12"
                onContextMenu={(e) => onRowContextMenu?.(e, { type: 'level', path: level })} />
            )}
          </ul>
          <ResizeHandle axis="x" onDrag={resizeCol(k)} onEnd={endDrag} />
          </Fragment>
        )
      })}
      {selectedKeys?.size > 1 ? (
        <>
          <SelectionPreview keys={[...selectedKeys]} objects={objects} urlOf={urlOf} kindOf={kindOf} formatSize={formatSize} formatDate={formatDate} width={widthOf('preview')} />
          <ResizeHandle axis="x" onDrag={resizeCol('preview')} onEnd={endDrag} />
        </>
      ) : shown && (
        <>
          <Preview key={shown.key} o={shown} urlOf={urlOf} kindOf={kindOf} kindLabel={kindLabel} formatSize={formatSize} formatDate={formatDate} renderPreview={renderPreview} width={widthOf('preview')} />
          <ResizeHandle axis="x" onDrag={resizeCol('preview')} onEnd={endDrag} />
        </>
      )}
      </div>
      {/* A FILL HEIGHT HAS NO GRABBER (user 2026-09-22). A CSS length says "take the room you
        * are given"; dragging would fight it. A px height keeps its handle. */}
      {typeof h !== 'string' && <ResizeHandle axis="y" onDrag={resizeH} onEnd={endDrag} />}
    </div>
  )
}

/* The preview column, for the media page's ROW view (user 2026-09-22 — Finder's "Show preview"):
 * one preview, the same pane beside rows as beside columns. Not in the barrel. */
export { Preview, SelectionPreview }

/* SelectionPreview — the preview pane for MORE THAN ONE selected item (user 2026-09-23, Finder's:
 * *"preview of 3 overlapping files, 2 and 3 slightly rotated behind 1 … the info fields should say
 * how many files and calculated size"*). The pane kept describing one file while four were lit.
 * The stack says "several"; the facts do the counting. Shared by the column and row panes.
 *
 * `keys` — the selected keys (folders end in `/`); `objects` — every object the view knows, for
 * sizes, kinds and dates; `urlOf(o)` — an image's own picture. */
function SelectionPreview({ keys, objects, urlOf, kindOf = dsKindOf, formatSize = (n) => `${n} B`, formatDate = (d) => d, width }) {
  const byKey = new Map(objects.map((o) => [o.key, o]))
  const folders = keys.filter((k) => k.endsWith('/'))
  const files = keys.filter((k) => !k.endsWith('/')).map((k) => byKey.get(k)).filter(Boolean)
  const inFolders = objects.filter((o) => folders.some((f) => o.key.startsWith(f)))
  const all = [...files, ...inFolders]
  const bytes = all.reduce((n, o) => n + (o.size || 0), 0)
  const dates = all.map((o) => o.uploaded).filter(Boolean).sort()
  const range = dates.length ? (dates[0] === dates[dates.length - 1] ? formatDate(dates[0]) : `${formatDate(dates[0])} – ${formatDate(dates[dates.length - 1])}`) : '—'
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`
  const kinds = [files.length && plural(files.length, 'document'), folders.length && plural(folders.length, 'folder')].filter(Boolean).join(', ')
  const face = (k) => {
    if (k.endsWith('/')) return <FileIcon glyph="folder" className="w-[46%]" />
    const o = byKey.get(k)
    if (o && isImage(o) && urlOf) return <img src={urlOf(o)} alt="" className="w-full h-full object-cover" />
    const ext = k.split('.').pop()
    return <FileIcon ext={ext} glyph={o ? KIND_GLYPH[kindOf(o)] : undefined} className="w-[46%]" />
  }
  const stack = keys.slice(0, 3)
  return (
    <div className="kol-column-browser-preview shrink-0 overflow-y-auto p-4 flex flex-col gap-4" style={{ width }}>
      <div className="kol-selection-stack">
        {stack.map((k, i) => (
          <div key={k} className="kol-selection-stack-card" data-depth={i}>{face(k)}</div>
        ))}
      </div>
      <p className="kol-mono-12 text-fg-default">{plural(keys.length, 'item')}</p>
      <dl className="flex flex-col gap-1">
        {[['Kind', kinds], ['Size', formatSize(bytes)], ['Date', range]].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 kol-mono-12">
            <dt className="text-fg-48">{k}</dt>
            <dd className="text-fg-default text-right break-all">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
