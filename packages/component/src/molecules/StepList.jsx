import { useRef } from 'react'
import Button from '../atoms/Button.jsx'
import { Icon } from '@kolkrabbi/kol-icons'
import usePointerSort from '../hooks/usePointerSort.js'

/**
 * StepList — A numbered list of slots ordered by hand. the Morph rail's steps in kol-fxr (each row a
 * generator preset, the morph tweening from row 1 to row N), generic enough for any ordered slots —
 * a playlist, a chain of stages (lobby: StepList, kol-fxr 2026-10-09). One row is active, × removes
 * a row, the dashed last row adds one.
 *
 *   <StepList items={steps} activeIndex={i} onSelect={setI} onRemove={remove} onMove={move} onAdd={add} />
 *
 * Reorder is `usePointerSort` — the pointer sort `RecordManager` runs — not the HTML drag the brief
 * named from `LayerStack`: HTML drag does nothing under a finger, and fxr runs on a phone. The
 * `arrows` variant is the keyboard path.
 *
 * @param {{ id: string|number, label: import('react').ReactNode }[]} items  the rows, in order
 * @param {number|null} activeIndex  the highlighted (editing) row
 * @param {'grab'|'arrows'} reorder  `grab`: a ⠿ handle and a pointer drag (touch too) · `arrows`: ↑ ↓ quiet buttons, one slot a press
 * @param {boolean} readOnly  no handle or arrows, no ×, no add row; the body does not open
 * @param {'xs'|'sm'|'md'|'lg'} size  the control rung the × and the arrows ride
 * @param {(index: number) => void} onSelect  the body pressed
 * @param {(index: number) => void} onRemove  ×
 * @param {(from: number, to: number) => void} onMove  after a drop or an arrow press
 * @param {() => void} onAdd  the dashed row
 * @param {import('react').ReactNode} addLabel  the dashed row's words — the consumer's copy
 * @param {string} className  on the list
 */
export default function StepList({
  items = [],
  activeIndex = null,
  reorder = 'grab',
  readOnly = false,
  size = 'sm',
  onSelect,
  onRemove,
  onMove,
  onAdd,
  addLabel = 'Add a step',
  className = '',
}) {
  const listRef = useRef(null)
  const { drag, startDrag } = usePointerSort(readOnly ? null : onMove)
  const grab = !readOnly && reorder === 'grab' && !!onMove
  const arrows = !readOnly && reorder === 'arrows' && !!onMove
  const rows = () => listRef.current?.querySelectorAll('.kol-step-list-item')

  return (
    <ul ref={listRef} className={`flex flex-col gap-1 ${className}`.trim()}>
      {items.map((it, i) => {
        const active = i === activeIndex
        const dragging = drag && drag.from === i
        const over = drag && drag.over === i && drag.over !== drag.from
        const mark = over ? (drag.over > drag.from ? 'bottom-0' : 'top-0') : null
        return (
          <li
            key={it.id}
            className={`kol-step-list-item relative flex items-center gap-2 rounded px-2 py-1${active ? ' bg-fg-08' : ''}${dragging ? ' opacity-40' : ''}`}
          >
            {/* the drop mark: a 1px accent line above or below the row under the pointer */}
            {mark && <span aria-hidden="true" className={`absolute left-2 right-2 h-px ${mark}`} style={{ background: 'var(--kol-accent-primary)' }} />}
            {grab && (
              <button
                type="button"
                aria-label={`Reorder step ${i + 1}`}
                className="cursor-grab shrink-0 touch-none border-0 bg-transparent p-0"
                onPointerDown={(e) => startDrag(e, i, rows())}
              >
                <Icon name="drag-handle" size={12} className="text-oq-48" />
              </button>
            )}
            {arrows && (
              <span className="flex shrink-0 items-center">
                <Button tone="ghost" quiet iconOnly="chevron-up" size={size} aria-label={`Move step ${i + 1} up`} disabled={i === 0} onClick={() => onMove(i, i - 1)} />
                <Button tone="ghost" quiet iconOnly="chevron-down" size={size} aria-label={`Move step ${i + 1} down`} disabled={i === items.length - 1} onClick={() => onMove(i, i + 1)} />
              </span>
            )}
            <button
              type="button"
              className="flex min-w-0 flex-1 items-center gap-2 border-0 bg-transparent p-0 text-left"
              onClick={readOnly ? undefined : () => onSelect?.(i)}
              disabled={readOnly}
            >
              <span className="kol-helper-10 text-meta tabular-nums w-4 shrink-0">{i + 1}</span>
              <span className="kol-mono-12 text-emphasis truncate">{it.label}</span>
            </button>
            {!readOnly && onRemove && (
              <Button tone="ghost" quiet iconOnly="x" size={size} aria-label={`Remove step ${i + 1}`} onClick={() => onRemove(i)} />
            )}
          </li>
        )
      })}
      {!readOnly && onAdd && (
        <li>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded border border-dashed border-oq-16 px-2 py-1 text-meta hover:text-body hover:border-oq-24"
            onClick={onAdd}
          >
            <span className="kol-helper-10 tabular-nums w-4 shrink-0">{items.length + 1}</span>
            <Icon name="plus" size={12} className="text-oq-48" />
            <span className="kol-mono-12">{addLabel}</span>
          </button>
        </li>
      )}
    </ul>
  )
}
