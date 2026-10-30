import { useState } from 'react'
import Button from '../atoms/Button.jsx'

/* taxonomy-ok: organism — nests Button (atom, the drag handle); the items are the consumer's (`renderItem`). */

/**
 * SortableGrid — A grid of cards reordered by drag. record's Projects grid (DocumentLibraryAndBoardParts, kol-website
 * 2026-10-29): `auto-fill` tracks at least `min` wide, each item dragged by its handle onto another to take its place.
 * The handle is a button, so a keyboard reorders too — ← ↑ one back, → ↓ one on. The item's wrapper wears
 * `is-dragging` and `is-drop-target` (kol-theme `.kol-sortable-item`).
 *
 * @param {Array}    items
 * @param {Function} getId       (item) => key (default `item.id`)
 * @param {Function} renderItem  (item, { handle, dragging, dropTarget, index }) => node — put `handle` where the grip goes
 * @param {Function} onReorder   (from, to) => void — indexes into `items`
 * @param {number}   min         the smallest track, px (default 280, record's)
 */
const TYPE = 'application/x-kol-sortable'

export default function SortableGrid({ items = [], getId = (it) => it.id, renderItem, onReorder, min = 280, className = '' }) {
  const [drag, setDrag] = useState(null)
  const [target, setTarget] = useState(null)
  const end = () => { setDrag(null); setTarget(null) }
  const move = (from, to) => { if (to >= 0 && to < items.length && to !== from) onReorder?.(from, to) }
  return (
    <div className={`kol-sortable-grid ${className}`.trim()} style={{ '--kol-sortable-min': `${min}px` }}>
      {items.map((item, i) => {
        const handle = onReorder ? (
          <Button
            variant="nav" size="sm" iconOnly="drag-handle" aria-label="Drag to reorder"
            className="kol-sortable-handle"
            draggable
            onDragStart={(e) => { e.dataTransfer.setData(TYPE, String(i)); e.dataTransfer.effectAllowed = 'move'; setDrag(i) }}
            onDragEnd={end}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(i, i - 1) }
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(i, i + 1) }
            }}
          />
        ) : null
        return (
          <div
            key={getId(item)}
            className={`kol-sortable-item${drag === i ? ' is-dragging' : ''}${target === i && drag !== i ? ' is-drop-target' : ''}`}
            onDragOver={(e) => { if (!e.dataTransfer.types.includes(TYPE)) return; e.preventDefault(); if (target !== i) setTarget(i) }}
            onDrop={(e) => { const from = Number(e.dataTransfer.getData(TYPE)); e.preventDefault(); end(); if (!Number.isNaN(from)) move(from, i) }}
          >
            {renderItem?.(item, { handle, dragging: drag === i, dropTarget: target === i && drag !== i, index: i })}
          </div>
        )
      })}
    </div>
  )
}
