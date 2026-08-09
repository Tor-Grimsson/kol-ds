import { useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@kolkrabbi/kol-icons'
import Button from '../atoms/Button'
import SearchInput from '../molecules/SearchInput'
import ToggleCheckbox from '../atoms/ToggleCheckbox'
import IconFrame from '../atoms/IconFrame'
import ShellDrawer from '../molecules/ShellDrawer'
import FieldRow, { StatusChip } from '../molecules/FieldRow'
import { Tooltip } from '../utilities/Popover'
import Table from './Table'
import MediaLibrary from './MediaLibrary'

/* TOOLBAR ICONS ARE BARE GLYPHS (user ruling 2026-08-09, verbatim: "did I
 * ask for a button?? … the only thing that should hover is full opacity and
 * popover"): no Button chrome, no fill, no box — body ink at rest, emphasis
 * on hover, a Tooltip as the name. */
const ToolbarIcon = ({ name, label, onClick, active = false, triggerClassName }) => (
  <Tooltip label={label} placement="bottom" triggerClassName={triggerClassName}>
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      /* PRESSED gets the box (user ruling, reference frame 2026-08-09): a
       * snug rounded fill hugging the glyph — "container relative to the
       * icon, and only when pressed". Rest is bare; hover is ink only. */
      /* 20px glyph, half-step pad — "TOO SMALL, TOO MUCH PADDING" (user
       * frames 2026-08-09): the reference icons nearly fill their box. */
      className={`inline-flex cursor-pointer rounded-sm border-0 p-0.5 transition-colors duration-150 ${active ? 'bg-fg-08 text-emphasis' : 'bg-transparent text-body hover:text-emphasis'}`}
    >
      <Icon name={name} size={20} />
    </button>
  </Tooltip>
)

/**
 * RecordManager — full-screen CMS record surface (lobby: RecordManager,
 * reference: Framer CMS). A reorderable record table plus a slide-over detail
 * panel of FieldRows.
 *
 * Composes existing DS only: Table (with rowClassName), ShellDrawer as the
 * slide-over, FieldRow/StatusChip for the panel, MediaLibrary variant="modal"
 * as the media picker (client INJECTED via `mediaClient`, never imported —
 * ARCHITECTURE §3), ToggleCheckbox for row selection, SearchInput/Button for
 * the toolbar.
 *
 * Columns use Table's contract (accessor/header/render/sortable…), plus an
 * optional `type` this organism resolves before handing them down:
 *   'title'  → truncating cell + hover-reveal open affordance (opens the panel)
 *   'status' → StatusChip; column carries `options` + `onStatusChange(row, v)`
 *   'select' → Dropdown;   column carries `options` + `onSelectChange(row, v)`
 *   'thumb'  → small fixed-aspect thumbnail (row[accessor] = {thumb|url, name})
 *
 * Reorder is a ~50-line pointer sort (the brief's call: util before any
 * dependency): pointerdown on the ⠿ handle, row rects measured once, live
 * over-index on pointermove, onReorder(from, to) on release. The floating
 * "Reorder row N" label rides the existing .kol-tooltip chrome. Handles render
 * only when onReorder is passed.
 *
 * Fields follow FieldRow's contract: {key, label, type, options?, accept?,
 * placeholder?, hint? (value or fn(record))}. The open record's values come
 * from `value` (falling back to the row object); edits bubble through
 * onChange(key, next) — data is consumer-owned, this surface never fetches.
 */
export default function RecordManager({
  columns = [],
  rows = [],
  onReorder,
  onSelectRow,
  fields = [],
  value,
  onChange,
  onAdd,
  onSortToggle,
  onFilterToggle,
  query,
  onQueryChange,
  searchPlaceholder,
  onSelectionChange,
  saveState,
  onPublish,
  publishLabel = 'Publish',
  onPreview,
  onOverflow,
  mediaClient,
  reorderLabel = (n) => `Reorder row ${n}`,
  /* pressed states for the toolbar's sort/filter controls — the consumer owns
   * those panels, so it tells the toolbar which control is open */
  sortActive = false,
  filterActive = false,
  className = '',
}) {
  const wrapRef = useRef(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const dragRef = useRef(null)
  const [drag, setDrag] = useState(null) // { from, over, x, y } during a drag
  const [active, setActive] = useState(null)
  const [picker, setPicker] = useState(null) // the field being picked for
  const [selected, setSelected] = useState(() => new Set())

  const rowId = (row, i) => row.id ?? i

  /* panel = 60% of the table area (user ruling 2026-08-09) — the surface's
   * own width IS the table pane, measured at open. ponytail: not re-measured
   * on live resize. */
  const [panelW, setPanelW] = useState(null)

  const openRecord = (row) => {
    const w = wrapRef.current?.getBoundingClientRect().width
    setPanelW(w ? Math.round(w * 0.6) : null)
    setActive(row)
    onSelectRow?.(row)
  }

  const updateSelection = (next) => {
    setSelected(next)
    onSelectionChange?.([...next])
  }

  /* ── pointer sort ─────────────────────────────────────────────────────── */
  const startDrag = (e, from) => {
    if (!onReorder) return
    e.preventDefault()
    const rowEls = wrapRef.current?.querySelectorAll('.kol-table-row')
    if (!rowEls?.length) return
    const rects = [...rowEls].map((el) => el.getBoundingClientRect())
    const move = (ev) => {
      const hit = rects.findIndex((r) => ev.clientY < r.bottom)
      const over = hit === -1 ? rects.length - 1 : hit
      dragRef.current = { from, over, x: ev.clientX, y: ev.clientY }
      setDrag(dragRef.current)
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      const d = dragRef.current
      dragRef.current = null
      setDrag(null)
      if (d && d.over !== d.from) onReorder(d.from, d.over)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    document.body.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'
    dragRef.current = { from, over: from, x: e.clientX, y: e.clientY }
    setDrag(dragRef.current)
  }

  /* ── columns: resolve types, prepend handle + checkbox ────────────────── */
  const builtColumns = useMemo(() => {
    const resolved = columns.map((col) => {
      if (col.type === 'title') {
        return {
          ...col,
          render: (row) => (
            /* the open affordance is the reference's BOXED toggle-overlay
             * button, pinned at the cell's end — not an inline icon riding
             * the text (user frames 2026-08-09). Hover-revealed per row. */
            <span className="flex items-center justify-between gap-2 min-w-0 max-w-full">
              <span className="truncate text-emphasis">{col.render ? col.render(row) : row[col.accessor]}</span>
              {/* the ICON CONTAINER is IconFrame (2026-08-01 ruling), box-model
                * proper (user 2026-08-09, "padding should control the size"):
                * the box stays pinned, the glyph FILLS the content box, and
                * padding is the only inset knob — p-[3px] on user instruction
                * (2026-08-09, "use 3px … use [3px]"); arbitrary utilities have
                * missed consumer generation before — if this renders unpadded
                * in a consumer, this class is why. */}
              <IconFrame
                name="toggle-overlay"
                variant="outline"
                size="sm"
                iconSize="100%"
                aria-label="Toggle overlay"
                onClick={() => openRecord(row)}
                className="p-[3px] opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
              />
            </span>
          ),
        }
      }
      if (col.type === 'status') {
        return {
          ...col,
          render: (row) => (
            <StatusChip
              value={row[col.accessor]}
              options={col.options ?? []}
              onChange={(next) => col.onStatusChange?.(row, next)}
            />
          ),
        }
      }
      if (col.type === 'select') {
        return {
          ...col,
          /* the reference's select cell ("Center ▾") is a PILL, not the square
           * Dropdown trigger — the StatusChip apparatus in its NEUTRAL grey,
           * the same chip Archived wears (user ruling 2026-08-09: "grey like
           * 'archived'"). Panel select fields stay Dropdown. */
          render: (row) => (
            <StatusChip
              value={row[col.accessor]}
              options={col.options ?? []}
              onChange={(next) => col.onSelectChange?.(row, next)}
            />
          ),
        }
      }
      if (col.type === 'thumb') {
        return {
          ...col,
          render: (row) => {
            const media = row[col.accessor]
            return media ? (
              /* measured off the reference frame: the tile is chip-height —
               * ~24px tall, 2:1 — not a 40px block (user re-call 2026-08-09) */
              <img src={media.thumb ?? media.url} alt={media.name ?? ''} className="h-6 w-12 rounded object-cover bg-fg-04" />
            ) : (
              <span className="kol-helper-10 text-meta">—</span>
            )
          },
        }
      }
      return col
    })

    /* ONE LEADING FIELD (reference row anatomy, user frames 2026-08-09:
     * "reorder and the toggle is the same field — look at the sizes"): the
     * grip and the row checkbox share a single cell at matched sizes. The
     * grip is rest-visible, dim; the header keeps only the select-all box,
     * with the grip column held as space so the checkboxes align. */
    const prefix = [{
      accessor: '__lead',
      header: (
        <span className="inline-flex items-center gap-2">
          {onReorder && <span className="w-4" aria-hidden="true" />}
          <ToggleCheckbox
            checked={rows.length > 0 && selected.size === rows.length}
            onChange={() =>
              updateSelection(selected.size === rows.length ? new Set() : new Set(rows.map(rowId)))
            }
          />
        </span>
      ),
      className: 'kol-table-cell-text w-14',
      render: (row) => {
        const i = rows.indexOf(row)
        const id = rowId(row, i)
        return (
          <span className="inline-flex items-center gap-2">
            {onReorder && (
              <button
                type="button"
                aria-label={reorderLabel(i + 1)}
                className="inline-flex w-4 cursor-grab touch-none justify-center border-0 bg-transparent p-0 text-meta hover:text-emphasis"
                onPointerDown={(e) => startDrag(e, i)}
              >
                <Icon name="drag-handle" size={16} />
              </button>
            )}
            <ToggleCheckbox
              checked={selected.has(id)}
              onChange={() => {
                const next = new Set(selected)
                next.has(id) ? next.delete(id) : next.add(id)
                updateSelection(next)
              }}
            />
          </span>
        )
      },
    }]
    return [...prefix, ...resolved]
  }, [columns, rows, selected, onReorder, drag]) // eslint-disable-line react-hooks/exhaustive-deps

  const record = value ?? active
  const hasToolbar = onAdd || onSortToggle || onFilterToggle || onQueryChange

  return (
    <div ref={wrapRef} className={`flex flex-col min-w-0 ${className}`}>
      {hasToolbar && (
        /* the reference cluster (user screenshots 2026-08-09): bare + · ↑↓ ·
         * ≡ · 🔍, search expanding into a COMPACT field on press, … far right */
        <div className="flex items-center gap-2 pb-3">
          {onAdd && <ToolbarIcon name="plus" label="Add" onClick={onAdd} />}
          {onSortToggle && <ToolbarIcon name="arrows-vertical" label="Sort" active={sortActive} onClick={onSortToggle} />}
          {onFilterToggle && <ToolbarIcon name="filter-lines" label="Filter" active={filterActive} onClick={onFilterToggle} />}
          {onQueryChange && (searchOpen || query ? (
            <SearchInput
              autoFocus
              size="sm"
              className="w-56"
              value={query ?? ''}
              onChange={(e) => onQueryChange(e?.target ? e.target.value : e)}
              placeholder={searchPlaceholder}
              onClear={() => { onQueryChange(''); setSearchOpen(false) }}
              onBlur={() => { if (!query) setSearchOpen(false) }}
            />
          ) : (
            <ToolbarIcon name="search" label="Search" onClick={() => setSearchOpen(true)} />
          ))}
          {onOverflow && (
            <ToolbarIcon name="more" label="More" triggerClassName="ml-auto" onClick={() => onOverflow(null)} />
          )}
        </div>
      )}

      <Table
        columns={builtColumns}
        rows={rows}
        width="column"
        compact
        /* align-middle: cell content centres in the row (reference grammar,
         * user frame 2026-08-09) — scoped here; Table's base stays v-top */
        rowClassName={(row, i) =>
          `group align-middle${drag && i === drag.from ? ' opacity-40' : ''}${
            drag && i === drag.over && drag.over !== drag.from ? ' bg-fg-04' : ''
          }`
        }
      />

      {/* floating reorder label — the existing .kol-tooltip chrome, ridden
        * imperatively (hover machinery doesn't fit a drag) */}
      {drag &&
        createPortal(
          <div className="kol-tooltip fixed" style={{ left: drag.x + 12, top: drag.y + 12 }}>
            {reorderLabel(drag.from + 1)}
          </div>,
          document.body,
        )}

      {/* detail panel — ShellDrawer owns the slide-over chrome AND the close ×;
        * this header carries only the record actions (reference: … ▶ save-state
        * Publish). aria-label defaults follow ShellDrawer's own precedent. */}
      <ShellDrawer
        open={!!active}
        onClose={() => setActive(null)}
        side="right"
        width={panelW ? `${panelW}px` : '50vw'}
        closeSide="start"
        backdrop={false}
        header={
          /* reference header anatomy (frame 45, 2026-08-09): × leads the row
           * (closeSide above); every action clusters at the far end —
           * … ▶ save-state Publish. */
          <div className="flex items-center justify-end gap-2 min-w-0">
            {onOverflow && (
              <ToolbarIcon name="more" label="More" onClick={() => onOverflow(record)} />
            )}
            {onPreview && (
              <ToolbarIcon name="play" label="Preview" onClick={() => onPreview(record)} />
            )}
            {saveState != null && <span className="kol-helper-10 text-meta truncate">{saveState}</span>}
            {onPublish && (
              <Button variant="primary" size="sm" onClick={() => onPublish(record)}>
                {publishLabel}
              </Button>
            )}
          </div>
        }
      >
        {record && (
          /* border-t: the reference rules EVERY seam — including above the
           * first row; each FieldRow carries its own border-b (frame 2026-08-09) */
          <div className="flex flex-col border-t border-fg-08">
            {fields.map((f) => (
              <FieldRow
                key={f.key}
                label={f.label}
                type={f.type}
                options={f.options}
                placeholder={f.placeholder}
                hint={typeof f.hint === 'function' ? f.hint(record) : f.hint}
                value={record[f.key]}
                onChange={(next) => onChange?.(f.key, next)}
                onPick={
                  (f.type === 'media' || f.type === 'file') && mediaClient ? () => setPicker(f) : undefined
                }
                disabled={f.disabled}
              />
            ))}
          </div>
        )}
      </ShellDrawer>

      {/* media picker — the EXISTING MediaLibrary organism, modal variant;
        * client injected, never imported (§3). accept comes from the field. */}
      {picker && mediaClient && (
        <MediaLibrary
          variant="modal"
          open
          client={mediaClient}
          accept={picker.accept ?? 'all'}
          onClose={() => setPicker(null)}
          onSelect={(asset) => {
            onChange?.(picker.key, asset)
            setPicker(null)
          }}
        />
      )}
    </div>
  )
}
