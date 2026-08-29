/**
 * QuadrantSync — the pinpoint overlay.
 *
 * Dev chrome for agreeing on WHICH element is being discussed before anyone
 * edits it. Draws a chess-style grid on a named node and emits one sync line —
 * `StageModuleGroup @ 1440w · e8 → h7` — that both sides restate. Born from a
 * real failure: ten messages to move one button, none of them wrong about CSS,
 * all of them about different elements.
 *
 * The rule that outranks every other: **the grid goes on what the USER named.**
 * Never redirected to a child or a parent. The owner is REPORTED, never
 * substituted — a grab-handle that moves a whole group lives at group level,
 * and quietly re-pointing the grid at a child answers a question nobody asked.
 *
 * Mark nodes with `data-handle="Name"` on divs that already exist — never a
 * wrapper added for the tool's benefit. Optionally `data-source="@kolkrabbi/…"`
 * so design-system ownership is a fact at selection time, not a discovery
 * mid-edit.
 *
 * A cell is a FRACTION of the named element, which is why `e8` means the same
 * relative place at 1440w and 760w and a pixel offset never does.
 *
 * Measures and positions over nodes from a fixed layer; it never wraps a node,
 * so grid position tracks the RENDERED layout rather than the tree. Renders
 * nothing when `enabled` is false — dev-only by default.
 *
 * @param {Object}   props
 * @param {HTMLElement} props.root        Subtree to hunt handles in (default document.body)
 * @param {string}   props.attr           Attribute naming a node (default 'data-handle')
 * @param {string}   props.sourceAttr     Attribute naming a node's origin (default 'data-source')
 * @param {Array}    props.bands          Breakpoint bands; the live one is READ from the window
 * @param {Object}   props.defaultDivisions  `{ cols, rows }` before `square` is applied
 * @param {string}   props.initialHandle  Handle name to select on mount
 * @param {Function} props.onSyncLine     (line, parts) => void, fired when the line changes
 * @param {string}   props.handleColor    Grid + outline color for the named node
 * @param {string}   props.pageColor      Grid color for the page reference
 * @param {boolean}  props.enabled        Render at all (default: off in production)
 */

import { useCallback, useEffect, useRef, useState } from 'react'

/* ── coordinates ─────────────────────────────────────────────────────────
 * Pure. No DOM writes. The invariant everything rests on: a cell is a
 * fraction of the box, so the same relative point resolves to the same cell
 * at any size.
 */

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'
export const MAX_COLS = 26
export const MAX_ROWS = 100
const SQUARE_TOLERANCE = 0.06

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

/** `a1` is TOP-LEFT — screen convention, not chess's bottom-left. */
const cellLabel = (c, r) => LETTERS[c] + (r + 1)

const rectOf = (el) => {
  const r = el.getBoundingClientRect()
  return { left: r.left, top: r.top, width: r.width, height: r.height, right: r.right, bottom: r.bottom }
}

/** Which cell of `box` holds the viewport point. Out-of-box points clamp. */
function cellAt (box, px, py, cols, rows) {
  return {
    c: clamp(Math.floor(((px - box.left) / box.width) * cols), 0, cols - 1),
    r: clamp(Math.floor(((py - box.top) / box.height) * rows), 0, rows - 1)
  }
}

/** An element SPANS cells, it does not sit in one — `c1–f8`, or one label if it fits one cell. */
function spanOf (child, parent, cols, rows) {
  const a = cellAt(parent, child.left + 1, child.top + 1, cols, rows)
  const b = cellAt(parent, child.right - 1, child.bottom - 1, cols, rows)
  const s = cellLabel(a.c, a.r)
  const e = cellLabel(b.c, b.r)
  return s === e ? s : `${s}–${e}`
}

function cellAspect (box, cols, rows) {
  if (!box || !box.width || !box.height) return null
  const cw = box.width / cols
  const ch = box.height / rows
  const ratio = cw / ch
  return { cw, ch, ratio, isSquare: Math.abs(ratio - 1) <= SQUARE_TOLERANCE }
}

/**
 * Derive the second axis so cells come out square on THIS box.
 *
 * One-shot on purpose. Recomputing on every reflow would silently change what
 * a coordinate means, which is the confusion this whole thing exists to remove.
 * After a reflow the cells stretch into rectangles — expected, and fine.
 *
 * The axis caps can make a naive first pass unusable on an extreme box (a 5.7:1
 * strip at 8 columns wants 1.4 rows), so re-anchor on the other axis and derive
 * back through the cap.
 */
function squareDivisions (box, cols, rows) {
  if (!box || !box.width || !box.height) return { cols, rows }
  const ar = box.width / box.height
  let c = clamp(cols, 1, MAX_COLS)
  let r = Math.round(c / ar)

  if (r < 2) {
    r = 2
    c = clamp(Math.round(r * ar), 1, MAX_COLS)
    r = clamp(Math.round(c / ar), 1, MAX_ROWS)
  } else if (r > MAX_ROWS) {
    r = MAX_ROWS
    c = clamp(Math.round(r * ar), 1, MAX_COLS)
    r = clamp(Math.round(c / ar), 1, MAX_ROWS)
  }
  return { cols: c, rows: r }
}

/* ── the tree ─────────────────────────────────────────────────────────── */

/** Nearest ancestor carrying a handle. A REPORT, never a redirect. */
function ownerOf (el, attr) {
  let p = el.parentElement
  while (p && p !== document.body && !p.hasAttribute(attr)) p = p.parentElement
  return p && p.hasAttribute(attr) ? p : null
}

function chainOf (el, attr) {
  const names = []
  let cur = ownerOf(el, attr)
  while (cur) {
    names.unshift(cur.getAttribute(attr))
    cur = ownerOf(cur, attr)
  }
  return names
}

/** The owner's layout mode, and which axis it actually makes reachable. */
function layoutOf (el) {
  const cs = getComputedStyle(el)
  if (cs.display === 'flex' || cs.display === 'inline-flex') {
    const column = cs.flexDirection.startsWith('column')
    return { mode: `flex ${column ? 'column' : 'row'}`, axis: column ? 'y' : 'x' }
  }
  if (cs.display === 'grid' || cs.display === 'inline-grid') return { mode: 'grid', axis: 'xy' }
  return { mode: cs.display, axis: 'y' }
}

/* A cell says WHERE, never what CSS to change. When a cell is unreachable in
 * the owner's mode, saying so is the feature — a diff that cannot work is worse
 * than an honest no. */
function reachability (layout) {
  if (layout.axis === 'x') return 'Horizontal order reachable; vertical needs align/self.'
  if (layout.axis === 'y') return "Vertical order reachable; horizontal needs the owner's layout mode changed."
  return 'Both axes reachable via grid placement.'
}

/* ── breakpoint bands: read from the window, never chosen ─────────────── */

export const DEFAULT_BANDS = [
  { name: 'Mobile', min: 0, max: 559 },
  { name: 'Tablet', min: 560, max: 859 },
  { name: 'Laptop', min: 860, max: 1279 },
  { name: 'Desktop', min: 1280, max: Infinity }
]

const bandFor = (w, bands) => bands.find((b) => w >= b.min && w <= b.max) || bands[bands.length - 1]

/* ── the deliverable ──────────────────────────────────────────────────── */

/** `StageModuleGroup @ 1440w · e8 → h7` */
function formatSyncLine (handle, width, from, to) {
  let s = `${handle} @ ${width}w`
  if (from) {
    s += ` · ${from}`
    if (to) s += ` → ${to}`
  }
  return s
}

const IS_PROD = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production'

export default function QuadrantSync ({
  root = null,
  attr = 'data-handle',
  sourceAttr = 'data-source',
  bands = DEFAULT_BANDS,
  defaultDivisions = { cols: 8, rows: 8 },
  initialHandle = '',
  onSyncLine,
  handleColor = 'var(--kol-accent-primary)',
  pageColor = 'var(--kol-fg-40, color-mix(in srgb, var(--kol-surface-on-primary) 40%, transparent))',
  enabled = !IS_PROD
}) {
  const [handle, setHandle] = useState(null)
  const [cols, setCols] = useState(defaultDivisions.cols)
  const [rows, setRows] = useState(defaultDivisions.rows)
  const [fade, setFade] = useState(0.7)
  const [showPage, setShowPage] = useState(false)
  const [showHandle, setShowHandle] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [width, setWidth] = useState(0)
  const [, setTick] = useState(0)

  const rootEl = root || (typeof document !== 'undefined' ? document.body : null)

  /* re-measure whenever the world moves — the grid tracks the rendered layout */
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined
    const bump = () => {
      setWidth(window.innerWidth)
      setTick((t) => t + 1)
    }
    bump()
    window.addEventListener('resize', bump)
    window.addEventListener('scroll', bump, true)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(bump) : null
    if (ro && rootEl) ro.observe(rootEl)
    return () => {
      window.removeEventListener('resize', bump)
      window.removeEventListener('scroll', bump, true)
      if (ro) ro.disconnect()
    }
  }, [enabled, rootEl])

  /* click-to-name */
  useEffect(() => {
    if (!enabled || !rootEl) return undefined
    const onClick = (e) => {
      const t = e.target
      if (!t || !t.closest || t.closest('[data-quadrant-chrome]')) return
      const el = t.closest(`[${attr}]`)
      if (!el) return
      e.preventDefault()
      e.stopPropagation()
      setHandle(el)
      setFrom(null)
      setTo(null)
    }
    rootEl.addEventListener('click', onClick, true)
    return () => rootEl.removeEventListener('click', onClick, true)
  }, [enabled, rootEl, attr])

  useEffect(() => {
    if (!enabled || !initialHandle || handle || typeof document === 'undefined') return
    const el = document.querySelector(`[${attr}="${initialHandle}"]`)
    if (el) setHandle(el)
  }, [enabled, initialHandle, handle, attr])

  /* outline the handle and its owner, restoring whatever was there before */
  useEffect(() => {
    if (!enabled) return undefined
    const own = handle ? ownerOf(handle, attr) : null
    const prev = []
    if (handle) {
      prev.push([handle, handle.style.outline, handle.style.outlineOffset])
      handle.style.outline = `2px solid ${handleColor}`
      handle.style.outlineOffset = '1px'
    }
    if (own) {
      prev.push([own, own.style.outline, own.style.outlineOffset])
      own.style.outline = `2px dashed ${pageColor}`
      own.style.outlineOffset = '5px'
    }
    return () => prev.forEach(([el, o, off]) => {
      el.style.outline = o
      el.style.outlineOffset = off
    })
  }, [enabled, handle, attr, handleColor, pageColor])

  const owner = handle && enabled ? ownerOf(handle, attr) : null
  const handleBox = handle && enabled ? rectOf(handle) : null
  const rootBox = rootEl && enabled ? rectOf(rootEl) : null
  const aspect = cellAspect(handleBox, cols, rows)

  const syncLine = handle ? formatSyncLine(handle.getAttribute(attr), width, from, to) : null

  useEffect(() => {
    if (syncLine && onSyncLine) {
      onSyncLine(syncLine, { handle: handle && handle.getAttribute(attr), width, from, to })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncLine])

  /** First click sets `from`, second sets `to`, third restarts. */
  const choose = useCallback((id) => {
    if (!from || to) { setFrom(id); setTo(null) } else if (id === from) setTo(null)
    else setTo(id)
  }, [from, to])

  const applySquare = useCallback(() => {
    if (!handleBox) return
    const next = squareDivisions(handleBox, cols, rows)
    setCols(next.cols)
    setRows(next.rows)
  }, [handleBox, cols, rows])

  /* square once per newly-named element, so the grid STARTS square */
  const squaredFor = useRef(null)
  useEffect(() => {
    if (!enabled || !handle) return
    if (squaredFor.current === handle) return
    squaredFor.current = handle
    const next = squareDivisions(rectOf(handle), cols, rows)
    setCols(next.cols)
    setRows(next.rows)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, handle])

  if (!enabled || typeof document === 'undefined') return null

  const band = bandFor(width, bands)
  const untreated = bands.filter((b) => b !== band).map((b) => b.name).join(' · ')
  const labelsUsable = showLabels && cols <= 16 && rows <= 16
  const anyGrid = showHandle || (showPage && handle !== rootEl)
  const layout = owner ? layoutOf(owner) : null
  const handleSource = handle ? handle.getAttribute(sourceAttr) || 'local' : null
  const ownerSource = owner ? owner.getAttribute(sourceAttr) || 'local' : null
  const BAR = 46

  const renderGrid = (box, kind) => {
    const live = kind === 'handle'
    const cells = []
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const id = cellLabel(c, r)
        const picked = id === to ? 0.4 : id === from ? 0.22 : 0
        cells.push(
          <button
            key={id}
            type="button"
            data-quadrant-chrome=""
            aria-label={live ? `Cell ${id}` : undefined}
            tabIndex={live ? 0 : -1}
            onClick={live ? () => choose(id) : undefined}
            className="absolute m-0 p-0 block text-left border-0"
            style={{
              left: `${(c / cols) * 100}%`,
              top: `${(r / rows) * 100}%`,
              width: `${100 / cols}%`,
              height: `${100 / rows}%`,
              borderRight: c === cols - 1 ? 'none' : '1px solid currentColor',
              borderBottom: r === rows - 1 ? 'none' : '1px solid currentColor',
              background: picked ? `color-mix(in srgb, currentColor ${picked * 100}%, transparent)` : 'transparent',
              color: 'inherit',
              cursor: live ? 'pointer' : 'default'
            }}
          >
            {labelsUsable && (
              <span
                className="kol-helper-8 block"
                style={{ padding: '2px 3px', fontWeight: picked ? 700 : 500 }}
              >
                {id}
              </span>
            )}
          </button>
        )
      }
    }
    return (
      <div
        key={kind}
        style={{
          position: 'absolute',
          left: box.left,
          top: box.top,
          width: box.width,
          height: box.height,
          color: live ? handleColor : pageColor,
          opacity: live ? fade : fade * 0.32,
          pointerEvents: live ? 'auto' : 'none'
        }}
      >
        {live && <span style={{ position: 'absolute', inset: 0, border: '1px solid currentColor', pointerEvents: 'none' }} />}
        {cells}
      </div>
    )
  }

  const q = (n, title, value, sub, subClass = 'text-fg-48') => (
    <div>
      <div className="kol-helper-8 text-fg-40" style={{ marginBottom: 5, letterSpacing: '0.12em' }}>
        <span style={{ color: handleColor }}>{n}</span>{'  '}{title.toUpperCase()}
      </div>
      <div className="kol-mono-12 text-fg-96" style={{ overflowWrap: 'anywhere' }}>{value}</div>
      {sub ? <div className={`kol-mono-10 ${subClass}`} style={{ marginTop: 3, overflowWrap: 'anywhere' }}>{sub}</div> : null}
    </div>
  )

  return (
    <div data-quadrant-chrome="" className="kol-quadrant-sync">
      {/* ── overlays ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 'var(--kol-z-nav, 1000)' }}>
        {showPage && rootBox && handle !== rootEl ? renderGrid(rootBox, 'page') : null}
        {showHandle && handleBox ? renderGrid(handleBox, 'handle') : null}
      </div>

      {/* ── settings: preferences only, never a report on the view ── */}
      <aside
        className="bg-surface-primary border border-fg-16"
        style={{
          position: 'fixed', top: 14, right: 14, width: 250, borderRadius: 4,
          zIndex: 'var(--kol-z-tooltip, 300)'
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ gap: 8, padding: '8px 10px', borderBottom: settingsOpen ? '1px solid var(--kol-border-default)' : 'none' }}
        >
          <span className="kol-helper-10 text-fg-40">GRID SETTINGS</span>
          <button
            type="button"
            className="kol-helper-12 text-fg-64 border border-fg-16"
            aria-expanded={settingsOpen}
            aria-label={settingsOpen ? 'Close grid settings' : 'Open grid settings'}
            onClick={() => setSettingsOpen((v) => !v)}
            style={{ minWidth: 21, height: 19, borderRadius: 4, background: 'transparent', cursor: 'pointer' }}
          >
            {settingsOpen ? '–' : '+'}
          </button>
        </div>

        {settingsOpen && (
          <div className="flex flex-col" style={{ gap: 12, padding: '11px 10px 12px' }}>
            <div>
              <div className="kol-helper-8 text-fg-40" style={{ marginBottom: 6, letterSpacing: '0.11em' }}>DIVISIONS</div>
              <div className="flex items-center" style={{ gap: 6 }}>
                <input
                  type="number" min={1} max={MAX_COLS} value={cols} aria-label="Columns"
                  onChange={(e) => setCols(clamp(parseInt(e.target.value, 10) || 1, 1, MAX_COLS))}
                  className="kol-mono-12 text-fg-96 bg-fg-04 border border-fg-16"
                  style={{ width: 52, padding: '5px 6px', textAlign: 'center', borderRadius: 4 }}
                />
                <span className="kol-helper-10 text-fg-40">×</span>
                <input
                  type="number" min={1} max={MAX_ROWS} value={rows} aria-label="Rows"
                  onChange={(e) => setRows(clamp(parseInt(e.target.value, 10) || 1, 1, MAX_ROWS))}
                  className="kol-mono-12 text-fg-96 bg-fg-04 border border-fg-16"
                  style={{ width: 52, padding: '5px 6px', textAlign: 'center', borderRadius: 4 }}
                />
                <button
                  type="button" onClick={applySquare}
                  title="Set divisions so cells come out square at the current size"
                  className="kol-helper-10 text-fg-96 border border-fg-16"
                  style={{ marginLeft: 'auto', padding: '5px 9px', borderRadius: 4, background: 'transparent', cursor: 'pointer' }}
                >
                  square
                </button>
              </div>
              {aspect && (
                <div className="kol-mono-10 text-fg-48" style={{ marginTop: 6 }}>
                  Cell{' '}
                  <span className="text-fg-96">{Math.round(aspect.cw)}×{Math.round(aspect.ch)}</span>{' · '}
                  {aspect.isSquare
                    ? <span style={{ color: 'var(--ui-success)' }}>square</span>
                    : `${aspect.ratio.toFixed(2)}:1`}
                </div>
              )}
            </div>

            <div>
              <label className="kol-helper-8 text-fg-40 block" htmlFor="kq-fade" style={{ marginBottom: 6, letterSpacing: '0.11em' }}>FADE</label>
              <input
                id="kq-fade" type="range" min={15} max={100} value={Math.round(fade * 100)}
                onChange={(e) => setFade(Number(e.target.value) / 100)}
                style={{ width: '100%', accentColor: handleColor, display: 'block' }}
              />
            </div>

            {/* page sits above handle — the page is the parent */}
            <div className="flex flex-col" style={{ gap: 7 }}>
              <label className="kol-mono-12 text-fg-96 flex items-center" style={{ gap: 7, cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" checked={showPage} onChange={(e) => setShowPage(e.target.checked)} style={{ accentColor: handleColor, width: 12, height: 12, margin: 0 }} />
                <span style={{ width: 7, height: 7, borderRadius: 2, background: pageColor, flex: 'none' }} />
                Page grid
              </label>
              <label className="kol-mono-12 text-fg-96 flex items-center" style={{ gap: 7, cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" checked={showHandle} onChange={(e) => setShowHandle(e.target.checked)} style={{ accentColor: handleColor, width: 12, height: 12, margin: 0 }} />
                <span style={{ width: 7, height: 7, borderRadius: 2, background: handleColor, flex: 'none' }} />
                Handle grid
              </label>
              <div style={{ borderTop: '1px solid var(--kol-border-default)', margin: '2px 0 1px' }} />
              <label
                className="kol-mono-12 text-fg-96 flex items-center"
                style={{ gap: 7, cursor: anyGrid ? 'pointer' : 'not-allowed', userSelect: 'none', opacity: anyGrid ? 1 : 0.38 }}
              >
                <input type="checkbox" checked={showLabels} disabled={!anyGrid} onChange={(e) => setShowLabels(e.target.checked)} style={{ accentColor: handleColor, width: 12, height: 12, margin: 0 }} />
                Cell labels
              </label>
            </div>
          </div>
        )}
      </aside>

      {/* ── report: what is in view. a banner, not a setting ── */}
      {reportOpen && (
        <div
          className="bg-surface-secondary border-t border-fg-16"
          style={{
            position: 'fixed', left: 0, right: 0, bottom: BAR, padding: '14px 18px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 22,
            zIndex: 'var(--kol-z-tooltip, 300)'
          }}
        >
          {q(1, 'Looking at', handle ? handle.getAttribute(attr) : '—',
            <>{width}w · <span className="text-fg-96">{band.name}</span><br />Untreated: {untreated}</>)}
          {q(2, 'Lives in',
            handle ? [...chainOf(handle, attr), handle.getAttribute(attr)].join(' › ') : '—',
            handle && owner ? <>Spans <span className="text-fg-96">{owner.getAttribute(attr)}:{spanOf(handleBox, rectOf(owner), cols, rows)}</span></> : null)}
          {q(3, 'Owned by',
            handle
              ? <span className="kol-helper-10" style={{ padding: '1px 6px', borderRadius: 4, background: handleSource === 'local' ? 'color-mix(in srgb, var(--ui-success) 20%, transparent)' : 'color-mix(in srgb, var(--ui-warning) 20%, transparent)', color: handleSource === 'local' ? 'var(--ui-success)' : 'var(--ui-warning)' }}>{handleSource}</span>
              : '—',
            ownerSource && ownerSource !== 'local'
              ? <>Owner ships from <span style={{ color: 'var(--ui-warning)' }}>{ownerSource}</span> — local shim now, DS ticket with the diff</>
              : owner ? <>Owner <span style={{ color: 'var(--ui-success)' }}>{owner.getAttribute(attr)}</span> is local — editable here</> : null)}
          {q(4, 'Change via',
            owner && layout ? `${owner.getAttribute(attr)} · ${layout.mode}` : handle ? 'page root' : '—',
            layout ? reachability(layout) : handle ? 'Nothing above it decides its position.' : null)}
        </div>
      )}

      {/* ── the deliverable ── */}
      <div
        className="bg-surface-primary border-t border-fg-16 flex items-center"
        style={{ position: 'fixed', left: 0, right: 0, bottom: 0, height: BAR, padding: '0 16px', gap: 13, zIndex: 'var(--kol-z-tooltip, 300)' }}
      >
        <span className="kol-helper-8 text-fg-40" style={{ letterSpacing: '0.14em', flex: 'none' }}>SYNC LINE</span>
        <div className="kol-mono-14 text-fg-96" style={{ flex: '1 1 auto', minWidth: 0, overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {handle ? (
            <>
              <span style={{ color: handleColor }}>{handle.getAttribute(attr)}</span>
              <span className="text-fg-40"> @ </span>
              <span className="text-fg-64">{width}w</span>
              {from ? (
                <>
                  <span className="text-fg-40"> · </span>{from}
                  {to
                    ? <><span className="text-fg-40"> → </span><span style={{ color: handleColor }}>{to}</span></>
                    : <span className="text-fg-40"> → pick a destination</span>}
                </>
              ) : showHandle ? <span className="text-fg-40"> · pick a cell</span> : null}
            </>
          ) : <span className="text-fg-40">Click an element to name it.</span>}
        </div>
        <div className="flex" style={{ gap: 6, flex: 'none' }}>
          <button
            type="button" aria-expanded={reportOpen} onClick={() => setReportOpen((v) => !v)}
            className="kol-helper-12 border border-fg-16"
            style={{ padding: '6px 12px', borderRadius: 4, background: 'transparent', cursor: 'pointer', color: reportOpen ? handleColor : 'var(--kol-surface-on-primary)' }}
          >
            Report
          </button>
          <button
            type="button"
            onClick={() => { setHandle(null); setFrom(null); setTo(null) }}
            className="kol-helper-12 text-fg-96 border border-fg-16"
            style={{ padding: '6px 12px', borderRadius: 4, background: 'transparent', cursor: 'pointer' }}
          >
            Clear
          </button>
          <button
            type="button" disabled={!syncLine}
            onClick={() => {
              if (!syncLine || !navigator.clipboard) return
              navigator.clipboard.writeText(syncLine).catch(() => {}).then(() => {
                setCopied(true)
                window.setTimeout(() => setCopied(false), 1400)
              })
            }}
            className="kol-helper-12"
            style={{
              padding: '6px 12px', borderRadius: 4, cursor: syncLine ? 'pointer' : 'default',
              background: handleColor, color: 'var(--kol-accent-on-primary)',
              border: `1px solid ${handleColor}`, opacity: syncLine ? 1 : 0.45
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}
