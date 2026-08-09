import { useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@kolkrabbi/kol-icons'
import Button from '../atoms/Button'
import SearchInput from '../molecules/SearchInput'
import ToggleCheckbox from '../atoms/ToggleCheckbox'
import ShellDrawer from '../molecules/ShellDrawer'
import Dropdown from '../molecules/Dropdown'
import FieldRow, { StatusChip } from '../molecules/FieldRow'
import Table from './Table'
import MediaLibrary from './MediaLibrary'

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
  className = '',
}) {
  const wrapRef = useRef(null)
  const dragRef = useRef(null)
  const [drag, setDrag] = useState(null) // { from, over, x, y } during a drag
  const [active, setActive] = useState(null)
  const [picker, setPicker] = useState(null) // the field being picked for
  const [selected, setSelected] = useState(() => new Set())

  const rowId = (row, i) => row.id ?? i

  const openRecord = (row) => {
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
            <span className="inline-flex items-center gap-2 min-w-0 max-w-full">
              <span className="truncate text-emphasis">{col.render ? col.render(row) : row[col.accessor]}</span>
              <Button
                variant="nav"
                size="sm"
                iconOnly="maximize"
                iconSize={12}
                aria-label={typeof col.header === 'string' ? col.header : 'Open'}
                className="shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                onClick={() => openRecord(row)}
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
          render: (row) => (
            <Dropdown
              options={col.options ?? []}
              value={row[col.accessor]}
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
              <img src={media.thumb ?? media.url} alt={media.name ?? ''} className="h-10 w-14 rounded object-cover bg-fg-04" />
            ) : (
              <span className="kol-helper-10 text-meta">—</span>
            )
          },
        }
      }
      return col
    })

    const prefix = []
    if (onReorder) {
      prefix.push({
        accessor: '__handle',
        header: '',
        className: 'kol-table-cell-text w-8',
        render: (row) => {
          const i = rows.indexOf(row)
          return (
            <button
              type="button"
              aria-label={reorderLabel(i + 1)}
              className="cursor-grab touch-none bg-transparent border-0 p-0 text-meta hover:text-emphasis opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
              onPointerDown={(e) => startDrag(e, i)}
            >
              <Icon name="resize-grip" size={14} />
            </button>
          )
        },
      })
    }
    prefix.push({
      accessor: '__select',
      header: (
        <ToggleCheckbox
          checked={rows.length > 0 && selected.size === rows.length}
          onChange={() =>
            updateSelection(selected.size === rows.length ? new Set() : new Set(rows.map(rowId)))
          }
        />
      ),
      className: 'kol-table-cell-text w-8',
      render: (row) => {
        const id = rowId(row, rows.indexOf(row))
        return (
          <ToggleCheckbox
            checked={selected.has(id)}
            onChange={() => {
              const next = new Set(selected)
              next.has(id) ? next.delete(id) : next.add(id)
              updateSelection(next)
            }}
          />
        )
      },
    })
    return [...prefix, ...resolved]
  }, [columns, rows, selected, onReorder, drag]) // eslint-disable-line react-hooks/exhaustive-deps

  const record = value ?? active
  const hasToolbar = onAdd || onSortToggle || onFilterToggle || onQueryChange

  return (
    <div ref={wrapRef} className={`flex flex-col min-w-0 ${className}`}>
      {hasToolbar && (
        <div className="flex items-center gap-1 pb-3">
          {onAdd && <Button variant="nav" size="md" iconOnly="plus" iconSize={14} onClick={onAdd} aria-label="Add" />}
          {onSortToggle && <Button variant="nav" size="md" iconOnly="swap" iconSize={14} onClick={onSortToggle} aria-label="Sort" />}
          {onFilterToggle && <Button variant="nav" size="md" iconOnly="filter" iconSize={14} onClick={onFilterToggle} aria-label="Filter" />}
          {onQueryChange && (
            <SearchInput
              value={query ?? ''}
              onChange={(e) => onQueryChange(e?.target ? e.target.value : e)}
              placeholder={searchPlaceholder}
              size="sm"
              className="ml-2"
            />
          )}
        </div>
      )}

      <Table
        columns={builtColumns}
        rows={rows}
        width="column"
        rowClassName={(row, i) =>
          `group${drag && i === drag.from ? ' opacity-40' : ''}${
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
        width="min(37.5rem, 92vw)"
        header={
          <div className="flex items-center gap-2 min-w-0">
            {onOverflow && (
              <Button variant="nav" size="md" iconOnly="more" iconSize={14} onClick={() => onOverflow(record)} aria-label="More" />
            )}
            {onPreview && (
              <Button variant="nav" size="md" iconOnly="play" iconSize={14} onClick={() => onPreview(record)} aria-label="Preview" />
            )}
            {saveState != null && <span className="kol-helper-10 text-meta ml-auto truncate">{saveState}</span>}
            {onPublish && (
              <Button variant="primary" size="sm" className={saveState == null ? 'ml-auto' : ''} onClick={() => onPublish(record)}>
                {publishLabel}
              </Button>
            )}
          </div>
        }
      >
        {record && (
          <div className="flex flex-col">
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
