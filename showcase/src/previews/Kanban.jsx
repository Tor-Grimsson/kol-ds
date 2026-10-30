import { useState } from 'react'
import { Button, Kanban, StatusChip, formatAge } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* record's board, on invented VOYAGER work: drag a card between or within columns, or ‹ ›; drag an inbox line onto a
 * column (an outside drop, `externalType`); the size chip cycles S · M · L; Done archives all */
const COLUMNS = [
  { id: 'lobby', label: 'Lobby' },
  { id: 'backlog', label: 'Backlog', tone: 'info' },
  { id: 'working', label: 'Working', tone: 'warning' },
  { id: 'done', label: 'Done', tone: 'success' },
]
const SIZES = [{ value: 'small', label: 'S' }, { value: 'medium', label: 'M' }, { value: 'big', label: 'L' }]
const H = 36e5
const SEED = [
  { id: 'a', column: 'lobby', order: 0, text: 'Kit list for the glacier route', size: 'small', enteredAt: Date.now() - 2 * H },
  { id: 'b', column: 'backlog', order: 0, text: 'Field Manual 2027: weather windows', size: 'big', enteredAt: Date.now() - 50 * H },
  { id: 'c', column: 'working', order: 0, text: 'Season poster proofs', enteredAt: Date.now() - 600000 },
  { id: 'd', column: 'done', order: 0, text: 'Press release, Icelandic', size: 'medium', enteredAt: Date.now() - 90 * H },
]
const INBOX_TYPE = 'application/x-voyager-inbox'

export default function KanbanPreview() {
  const [cards, setCards] = useState(SEED)
  const [inbox, setInbox] = useState(['Call the hut warden', 'Photos from the recce'])
  /* the card into `column` before `before` (last when null); its age restarts only when the column changes */
  const place = (all, card, column, before) => {
    const rest = all.filter((c) => c.id !== card.id)
    const col = rest.filter((c) => c.column === column).sort((x, y) => x.order - y.order)
    const at = before ? Math.max(0, col.findIndex((c) => c.id === before)) : col.length
    col.splice(at, 0, { ...card, column, enteredAt: card.column === column ? card.enteredAt : Date.now() })
    return [...rest.filter((c) => c.column !== column), ...col.map((c, i) => ({ ...c, order: i }))]
  }
  const move = (id, column, before) => setCards((all) => place(all, all.find((c) => c.id === id), column, before))
  const patch = (id, p) => setCards((all) => all.map((c) => (c.id === id ? { ...c, ...p } : c)))
  return (
    <div className="flex w-full flex-col gap-6">
      <ul className="flex flex-wrap gap-2 m-0 p-0 list-none" aria-label="Inbox">
        {inbox.map((t) => (
          <li key={t} draggable onDragStart={(e) => e.dataTransfer.setData(INBOX_TYPE, t)} className="kol-mono-12 cursor-grab rounded border border-fg-08 px-2 py-1">{t}</li>
        ))}
      </ul>
      <Kanban
        columns={COLUMNS}
        cards={cards}
        onMove={move}
        externalType={INBOX_TYPE}
        onExternalDrop={(column, before, text) => {
          setInbox((l) => l.filter((x) => x !== text))
          setCards((all) => place(all, { id: `in-${text}`, text, enteredAt: Date.now() }, column, before))
        }}
        renderCard={(c) => (
          <>
            <span className="kol-sans-body-03 text-body">{c.text}</span>
            <span className="flex items-center gap-1.5">
              <StatusChip cycle options={SIZES} value={c.size} placeholder="·" onChange={(size) => patch(c.id, { size })} ariaLabel="Size" />
              <span className="kol-mono-10 text-meta">{formatAge(c.enteredAt)}</span>
            </span>
          </>
        )}
        cardActions={(c) => <Button variant="nav" size="sm" iconOnly="trash" aria-label="Delete" onClick={() => setCards((all) => all.filter((x) => x.id !== c.id))} />}
        columnActions={(col, list) => (col.id === 'done' && list.length > 0
          ? <Button variant="nav" size="sm" onClick={() => setCards((all) => all.map((c) => (c.column === 'done' ? { ...c, archived: true } : c)))}>Archive</Button>
          : null)}
      />
    </div>
  )
}
