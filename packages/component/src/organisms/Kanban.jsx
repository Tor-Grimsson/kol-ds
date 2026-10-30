import { useState } from 'react'
import Button from '../atoms/Button.jsx'

/* taxonomy-ok: organism — nests Button (atom); the cards are the consumer's (`renderCard`). */

/**
 * Kanban — Cards in columns, moved between them. record's Capture board, made the DS's (DocumentLibraryAndBoardParts,
 * kol-website 2026-10-29 — *"DASHBOARD NEEDS TO CONSUME DS COMPONENTS"*). Controlled: the board draws `cards` in
 * `columns` by `order` and reports a move; the consumer owns the data and the write-back.
 *
 * A card moves three ways: dragged into a column (it lands last) or onto a card (it lands before it), within a column
 * or between, and by its ‹ › buttons, which a keyboard reaches and a phone can press — at 390 the columns stack.
 * Something dragged in from outside the board lands too: give `externalType`, the `dataTransfer` key the outside item
 * sets, and `onExternalDrop` receives its payload (record drags inbox lines in).
 *
 * @param {Array}    columns    `[{ id, label, tone? }]` — tone ∈ success · warning · error · info (the header's dot)
 * @param {Array}    cards      `[{ id, column, order, … }]` — a card with `archived` is not drawn
 * @param {Function} onMove     (cardId, toColumn, beforeId | null) => void
 * @param {Function} renderCard (card) => node — the card's body
 * @param {Function} cardActions   (card) => node — the hover row, right of ‹ ›
 * @param {Function} columnActions (column, cards) => node — beside the count ("archive all")
 * @param {ReactNode} footer    under the board (the archive list)
 * @param {string}   externalType  the `dataTransfer` key an outside drag carries
 * @param {Function} onExternalDrop (column, beforeId | null, payload) => void
 * @param {ReactNode} empty     a column with no cards (default `—`)
 */
const CARD_TYPE = 'application/x-kol-kanban-card'
const TONE = { success: 'var(--ui-success)', warning: 'var(--ui-warning)', error: 'var(--ui-error)', info: 'var(--ui-info)' }

export default function Kanban({ columns = [], cards = [], onMove, renderCard, cardActions, columnActions, footer, externalType, onExternalDrop, empty = '—', className = '' }) {
  const [over, setOver] = useState(null) // { column, before }
  const ids = columns.map((c) => c.id)
  const accepts = (e) => e.dataTransfer.types.includes(CARD_TYPE) || (externalType && e.dataTransfer.types.includes(externalType))

  const drop = (e, column, before) => {
    e.preventDefault()
    e.stopPropagation()
    setOver(null)
    const id = e.dataTransfer.getData(CARD_TYPE)
    if (id) { if (id !== before) onMove?.(id, column, before); return }
    if (externalType) {
      const payload = e.dataTransfer.getData(externalType)
      if (payload) onExternalDrop?.(column, before, payload)
    }
  }
  const dragOver = (column, before) => (e) => {
    if (!accepts(e)) return
    e.preventDefault()
    e.stopPropagation()
    if (over?.column !== column || over?.before !== before) setOver({ column, before })
  }
  const step = (card, d) => {
    const i = ids.indexOf(card.column) + d
    if (i >= 0 && i < ids.length) onMove?.(card.id, ids[i], null)
  }

  return (
    <div className={className}>
      <div className="kol-kanban" style={{ '--kol-kanban-cols': columns.length }} onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOver(null) }}>
        {columns.map((col, ci) => {
          const list = cards.filter((c) => c.column === col.id && !c.archived).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          return (
            <section
              key={col.id}
              aria-label={col.label}
              className={`kol-kanban-column${over?.column === col.id ? ' is-over' : ''}`}
              onDragOver={dragOver(col.id, null)}
              onDrop={(e) => drop(e, col.id, null)}
            >
              {/* wraps: a column action ("Archive") never runs past a narrow column */}
              <header className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <span className="flex items-center gap-1.5">
                  {col.tone && <span className="inline-block size-2 rounded-full" style={{ background: TONE[col.tone] }} />}
                  <span className="kol-mono-12 text-emphasis">{col.label}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="kol-mono-10 text-meta tabular-nums">{list.length}</span>
                  {columnActions?.(col, list)}
                </span>
              </header>
              <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                {list.map((card) => (
                  <li
                    key={card.id}
                    draggable
                    onDragStart={(e) => { e.dataTransfer.setData(CARD_TYPE, card.id); e.dataTransfer.effectAllowed = 'move' }}
                    onDragOver={dragOver(col.id, card.id)}
                    onDrop={(e) => drop(e, col.id, card.id)}
                    className={`kol-kanban-card group${over?.column === col.id && over.before === card.id ? ' is-drop-target' : ''}`}
                  >
                    {renderCard?.(card)}
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-0.5">
                        <Button variant="nav" size="sm" iconOnly="chevron-left" disabled={ci === 0} onClick={() => step(card, -1)} aria-label={`Move to ${columns[ci - 1]?.label ?? ''}`.trim()} />
                        <Button variant="nav" size="sm" iconOnly="chevron-right" disabled={ci === columns.length - 1} onClick={() => step(card, 1)} aria-label={`Move to ${columns[ci + 1]?.label ?? ''}`.trim()} />
                      </span>
                      {cardActions && <span className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">{cardActions(card)}</span>}
                    </div>
                  </li>
                ))}
                {!list.length && <li className="kol-sans-body-03 text-meta">{empty}</li>}
              </ul>
            </section>
          )
        })}
      </div>
      {footer}
    </div>
  )
}
