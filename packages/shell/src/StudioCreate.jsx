import { useCallback, useEffect, useRef, useState } from 'react'
import { ActionButton, AppItemMenuProvider, ContentCard, ContentFilters, ContentRow, Divider, PageHeader, SECTION_TEXT_LEVELS, CanvasStudio, IconFrame, useMediaQuery } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import PageShell from './PageShell.jsx'
import CatalogGrid from './CatalogGrid.jsx'
import { warnJsx } from './warnJsx.js'

/* taxonomy-ok: organism — nests PageShell / CatalogGrid (relative) + kol-component's ContentFilters, ContentCard, ContentRow, CanvasStudio, PageHeader */

/**
 * StudioCreate — A catalog of parts beside a case. monitor's `CreatePage` made once
 * (plan-2026-10-23 § 3.4 — user: *"the create tab, which is a combination of catalog and studio, where monitor has rack
 * modules and mirror has mixer modules … reference monitor rather than mixer"*). The page is read off
 * `kol-monitor/src/pages/CreatePage.jsx`, structure for structure: a page that is FIXED on the case view and SCROLLS on
 * the parts view; the dot grid over the whole page, under the chrome; an editable masthead (the case's name and
 * description — the pencil in the filter row opens them); `ContentFilters` with the view strip CASE ⇄ PARTS, the parts
 * view a catalog of the parts (the consumer's groups, LIST and GRID), the case view the consumer's case on
 * `CanvasStudio`; a bottom bar with the zoom readout and the consumer's case actions. What a part is, what a row is,
 * and what Insert does are the consumer's — monitor's rows and HP, mirror's channel strips.
 *
 * @param {Object}   header        `{ title, subtitle, onTitleChange?, onSubtitleChange? }` — the masthead; with the
 *                                 handlers the pencil makes both editable (the consumer persists them), without them it
 *                                 is a plain masthead
 * @param {Array}    parts         the items of the parts catalog (ContentFilters filters and searches them; `name` /
 *                                 `title` are what the search reads)
 * @param {Array}    partGroups    ContentFilters' `[{ label, key, values, exclusive? }]` for the parts
 * @param {Function} toCard        `(part, { layout }) => card props` — spread onto a `catalog` card (grid) or row (list)
 *                                 on `CatalogGrid`, the Catalog's own grid; pass `zoom: false` to match a Library;
 *                                 `onClick` is the consumer's (monitor opens the part's page)
 * @param {Function} onPlace       `(part) => void` — the Insert action (`ActionButton` in the card's and the row's
 *                                 `actions` slot, the plate) on every part; a drag is the consumer's
 *                                 (`onPartPointerDown`), as monitor's is
 * @param {Function} onPartPointerDown  `(part, event) => void` — the seam for a consumer's own drag from the pool
 * @param {Object}   labels        `{ case: 'CASE', parts: 'PARTS', partsTitle: 'All Parts', caseTitle: 'Case' }` — the strip
 *                                 and the catalog titles (monitor: CASE, MODULES, All Modules)
 * @param {number}   caseCount     what the case holds, for the count beside the title (monitor: the placed modules)
 * @param {ReactNode} caseControls the consumer's controls ABOVE the case (monitor: the Add row and Set HP dialogs, each
 *                                 shown by one of its `caseActions`)
 * @param {ReactNode} caseActions  the consumer's buttons in the bottom bar's right (monitor: rows, HP, case preview)
 * @param {{label: string, onClick: Function}} caseLink  the link beside the zoom readout, drawn here (monitor: "Open in
 *                                 Rack"); a node is still drawn, with a dev warning (2026-10-24)
 * @param {boolean}  showCase      draw the case (default true; monitor's case-preview toggle)
 * @param {Object}   view · onViewChange · defaultView   the canvas view, the consumer's to persist (CanvasStudio's)
 * @param {'case'|'parts'} defaultPage  which view opens (default `case`)
 * @param {'case'|'parts'} page · {Function} onPageChange  the view, controlled — a consumer's Insert shows the case
 *                                 (monitor's rule), a slot on the case opens the parts (mirror's)
 * @param {Function} canvas        `({ gridRef, view, onViewChange }) => node` — a consumer that already HAS a viewport on
 *                                 `CanvasStudio` (monitor's `RackViewport`, with its snap keys and workbench) renders it
 *                                 here instead of `children`; it takes the page's gridRef and view so the whole-page grid
 *                                 and the zoom readout still follow it
 * @param {ReactNode} children     the case itself, drawn on this page's own `CanvasStudio` when no `canvas` is given
 * @param {string}   className · style   on the page
 */
export default function StudioCreate({
  header = {},
  parts = [],
  partGroups = [],
  toCard,
  onPlace,
  onPartPointerDown,
  labels = {},
  caseCount = 0,
  caseControls,
  caseActions,
  caseLink,
  showCase = true,
  view,
  onViewChange,
  defaultView,
  defaultPage = 'case',
  page: pageProp,
  onPageChange,
  canvas,
  children,
  className = '',
  style,
}) {
  const L = { case: 'CASE', parts: 'PARTS', partsTitle: 'All Parts', caseTitle: 'Case', ...labels }
  const [ownPage, setOwnPage] = useState(defaultPage)
  const page = pageProp ?? ownPage
  const setPage = (p) => { setOwnPage(p); onPageChange?.(p) }
  const [editing, setEditing] = useState(false)
  const titleRef = useRef(null)
  const gridRef = useRef(null)
  const editable = !!(header.onTitleChange || header.onSubtitleChange)

  /* the canvas view: the consumer's when passed, else this page's — the zoom readout reads and writes it either way */
  const [ownView, setOwnView] = useState(defaultView ?? { zoom: 1, x: 0, y: 0 })
  const v = view ?? ownView
  const setV = useCallback((next) => {
    const resolved = typeof next === 'function' ? next(view ?? ownView) : next
    if (!view) setOwnView(resolved)
    onViewChange?.(resolved)
  }, [view, ownView, onViewChange])
  const applyZoom = (fn) => setV((cur) => ({ ...cur, zoom: Math.min(2, Math.max(0.1, fn(cur.zoom))) }))
  const [zoomInput, setZoomInput] = useState('100')
  const zoomEditing = useRef(false)
  useEffect(() => { if (!zoomEditing.current) setZoomInput(String(Math.round(v.zoom * 100))) }, [v.zoom])

  /* the exclusive groups, by key; the flag stays here */
  const exclusive = partGroups.filter((g) => g.exclusive).map((g) => g.key)
  const groups = partGroups.map(({ exclusive: _x, ...g }) => g)

  /* THE PAGE MASTHEAD, EDITABLE (review 2, § 7.3 — *"create page both desktop and mobile is using a different header than all
   * other pages?"*): both fields wear `SECTION_TEXT_LEVELS.app`'s own classes — the title's and the lede's — with no
   * height or line-height of their own, inside `PageHeader level="app"`, so an uneditable Create and Library's masthead
   * are the same header; editing shows only the caret and the underline */
  const titleCls = SECTION_TEXT_LEVELS.app.title
  const ledeCls = SECTION_TEXT_LEVELS.app.lede
  const field = (value, onChange, cls) => (
    <input
      ref={cls === titleCls ? titleRef : undefined}
      type="text"
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
      onBlur={() => setEditing(false)}
      onKeyDown={(e) => { if (e.key === 'Enter') setEditing(false) }}
      readOnly={!editing}
      className={`block p-0 bg-transparent text-inherit outline-none border-none ${cls}`}
      /* `1lh` — the class's own line-height: an input otherwise sizes to the font's metrics (69 for the 60 title) */
      style={{ width: `${String(value ?? '').length + 1}ch`, height: '1lh', cursor: editing ? 'text' : 'default', boxShadow: editing ? 'inset 0 -1px 0 var(--kol-fg-12)' : 'none', caretColor: editing ? 'auto' : 'transparent', pointerEvents: editing ? 'auto' : 'none' }}
    />
  )

  /* INSERT is its own control, never the card's click (monitor, user 2026-09-02): the card opens the part's page. It is
   * the card's and the row's `actions` slot — the plate, where an app card carries its cog and trash (review 2, § 3.1:
   * *"someone attached an insert to the end of a random card"*) */
  const insert = (part) => onPlace ? (
    <ActionButton chrome="inline" size="sm" icon="plus" label="Insert" onAction={(e) => { e?.stopPropagation(); onPlace(part) }} />
  ) : undefined
  const [cols, setCols] = useState(null)
  /* a phone gets the rows alone, no LIST GRID line — CatalogPage's `phoneLayout` rule, the same rung (768) */
  const phoneRows = useMediaQuery('(max-width: 767px)')

  return (
    /* Create sits on the app tier's fg-02 wash and holds still on both views: the case is a fixed canvas, the parts scroll in their own region */
    <PageShell mode="fixed" className={className} style={{ '--kol-shell-page-wash': 'var(--kol-fg-02)', '--kol-catalog-n': cols ?? undefined, position: 'relative', isolation: 'isolate', ...style }}>
      {/* the dot grid on the WHOLE page — over the wash, under the chrome, the padding ignored; CanvasStudio drives it
        * through gridRef so it rides the zoom and the pan (monitor, user 2026-08-27) */}
      {page === 'case' && showCase && <div ref={gridRef} aria-hidden style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none' }} />}
      {/* the chrome floats ABOVE the canvas: the case runs under the masthead and the filter row (monitor, 2026-09-02) */}
      <div style={{ position: 'relative', zIndex: 'var(--kol-z-sticky)' }}>
        <PageHeader
          level="app"
          title={editable ? field(header.title, header.onTitleChange, titleCls) : header.title}
          subtitle={editable ? field(header.subtitle, header.onSubtitleChange, ledeCls) : header.subtitle}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative', zIndex: 'var(--kol-z-sticky)' }}>
        <ContentFilters
          tone="sunken"
          items={page === 'case' ? [] : parts}
          title={page === 'case' ? L.caseTitle : L.partsTitle}
          totalCount={page === 'case' ? caseCount : parts.length}
          filterGroups={page === 'case' ? [] : groups}
          mutuallyExclusiveFilters={exclusive}
          showCountOnlyWhenFiltering
          headerActions={editable ? (
            /* BARE, as the filter and the search beside it (user 2026-10-23: *"icon frame with background color? breaks
             * consistency"*) — IconFrame nav, 16 in the 32 box; the press keeps the title's focus, the click toggles */
            <IconFrame
              name="edit"
              variant="nav"
              size="md"
              iconSize={16}
              aria-label="Rename"
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => {
                setEditing((prev) => {
                  if (prev) { titleRef.current?.blur(); window.getSelection()?.removeAllRanges(); return false }
                  requestAnimationFrame(() => { titleRef.current?.focus(); titleRef.current?.select() })
                  return true
                })
              }}
            />
          ) : undefined}
          viewModeOptions={[{ value: 'case', label: L.case }, { value: 'parts', label: L.parts }]}
          viewMode={page}
          onViewModeChange={setPage}
          layoutOptions={page === 'parts' && !phoneRows ? [{ value: 'list', label: 'LIST' }, { value: 'grid', label: 'GRID' }] : undefined}
          defaultLayout="list"
          layout={phoneRows ? 'list' : undefined}
          renderItem={(items, _mode, layout) => {
            if (page === 'case') {
              return (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                  {caseControls}
                  {caseControls && <Divider className="mb-4" />}
                  {showCase && (canvas ? canvas({ gridRef, view: v, onViewChange: setV }) : (
                    /* the canvas is the whole page: the case is never cut by the viewport's box (monitor, 2026-09-02) */
                    <CanvasStudio gridRef={gridRef} view={v} onViewChange={setV} style={{ flex: 1, margin: '0 calc(var(--kol-shell-page-pad) * -1)', overflow: 'visible' }}>
                      {children}
                    </CanvasStudio>
                  ))}
                </div>
              )
            }
            /* ONE CARD FOR THE SET (user 2026-10-23: *"why are we using a different card for PARTS? when file has so many
             * props"*): a part is the `app` card and row, the files' own — no verbs, so no cog or trash; INSERT is the
             * plate's action. On `CatalogGrid`, the Catalog's own grid, six at most, the list three across */
            return (
              /* the parts scroll in their own region — the page holds still on both views (user 2026-10-23). ONE MENU AND
               * ONE RAIL for the parts too (0.78.1): a part is the Library's card — every field and icon — so its cog opens
               * the same file rail and its right-click the same menu CatalogPage mounts */
              <AppItemMenuProvider>
              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingBottom: 'calc(var(--kol-spacing-6) + var(--kol-shell-bar-clear, 0px))' }}>
              <CatalogGrid layout={layout} onColumns={setCols} listColumns={3}>
                {items.map((part) => {
                  const { key, ...props } = toCard ? toCard(part, { layout }) : { title: part.title ?? part.name }
                  const k = key ?? part.id ?? part.name
                  /* INSERT rides the one card (2026-10-24): the cover's other corner on a card, before the plate on a row —
                   * the part keeps every field and icon the Library's card has; `insert` (the plate action) is the shape a
                   * card without a plate still takes */
                  const place = onPlace ? { onInsert: () => onPlace(part) } : {}
                  const item = layout === 'grid'
                    ? <ContentCard key={onPartPointerDown ? undefined : k} variant="app" {...props} {...place} actions={props.verbs || props.onTags ? undefined : insert(part)} />
                    : <ContentRow key={onPartPointerDown ? undefined : k} variant="app" {...props} {...place} actions={props.verbs || props.onTags ? undefined : insert(part)} />
                  return onPartPointerDown ? <div key={k} onPointerDown={(e) => onPartPointerDown(part, e)}>{item}</div> : item
                })}
              </CatalogGrid>
              </div>
              </AppItemMenuProvider>
            )
          }}
        />

        {/* the bottom bar — the zoom readout is the canvas's; the right side is the consumer's (monitor: rows, HP, the case preview) */}
        {page === 'case' && (
          /* above the phone bar or pill when the shell draws one (`--kol-shell-bar-h`, 2026-10-23: it sat under the bar) */
          <div className="fixed flex items-center justify-between" style={{ bottom: 'calc(var(--kol-shell-bar-h, 0px) + var(--kol-shell-bar-clear, 0px) + 24px)', left: 'calc(var(--kol-shell-rail-width, 0px) + 24px)', right: 24, zIndex: 'var(--kol-z-sticky)' }}>
            <div className="flex items-center gap-2">
              <span onClick={() => applyZoom((z) => z - 0.1)} className="kol-helper-12 text-fg-48 hover:text-fg-96 cursor-pointer select-none">−</span>
              <input
                type="text"
                inputMode="numeric"
                value={zoomInput}
                onFocus={(e) => { zoomEditing.current = true; e.target.select() }}
                onChange={(e) => setZoomInput(e.target.value)}
                onBlur={() => {
                  zoomEditing.current = false
                  const n = parseInt(zoomInput, 10)
                  if (!isNaN(n)) applyZoom(() => n / 100)
                  else setZoomInput(String(Math.round(v.zoom * 100)))
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur() }}
                className="kol-helper-12 text-fg-64 bg-transparent text-right border-none outline-none"
                style={{ width: 32 }}
                aria-label="Zoom"
              />
              <span className="kol-helper-12 text-fg-32">%</span>
              <span onClick={() => applyZoom((z) => z + 0.1)} className="kol-helper-12 text-fg-48 hover:text-fg-96 cursor-pointer select-none">+</span>
              {caseLink && (
                <span style={{ marginLeft: 16 }}>
                  {caseLink.label != null
                    ? <span onClick={caseLink.onClick} className="kol-helper-12 text-fg-48 hover:text-fg-96 cursor-pointer select-none">{caseLink.label}</span>
                    : (warnJsx('StudioCreate caseLink', 'Pass { label, onClick }.'), caseLink)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">{caseActions}</div>
          </div>
        )}
      </div>
    </PageShell>
  )
}

/* a bar button for `caseActions` — monitor's rows / HP / case-preview toggles wear this; exported so a consumer
 * writes the three in one line each */
export function StudioCreateAction({ icon, label, onClick, pressed }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className={`${pressed ? 'text-oq-96' : 'text-oq-80'} hover:text-oq-96 transition-colors cursor-pointer bg-transparent border-none p-2 leading-none`}
    >
      <Icon name={icon} size={20} />
    </button>
  )
}
