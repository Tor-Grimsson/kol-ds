import { TreeRow } from '@kolkrabbi/kol-component'
import { rowLabelForLayer, useComposeState } from '../engine.js'
import WindowPane from './WindowPane.jsx'

/* What changed between two snapshots, in one line: HistoryPanel's own `describe`, carried verbatim (the real file keeps
   it private). */
function describe(a, b) {
  const before = new Map(a.layers.map((l) => [l.id, l]))
  const after = new Map(b.layers.map((l) => [l.id, l]))
  const added = b.layers.find((l) => !before.has(l.id))
  if (added) return `Add ${rowLabelForLayer(added)}`
  const removed = a.layers.find((l) => !after.has(l.id))
  if (removed) return `Delete ${rowLabelForLayer(removed)}`
  const changed = b.layers.find((l) => before.get(l.id) !== l)
  if (changed) {
    const was = before.get(changed.id)
    const keys = Object.keys({ ...was, ...changed }).filter((k) => was[k] !== changed[k])
    const moved = keys.every((k) => k === 'x' || k === 'y')
    return `${moved ? 'Move' : 'Edit'} ${rowLabelForLayer(changed)}`
  }
  if (a.layers.map((l) => l.id).join() !== b.layers.map((l) => l.id).join()) return 'Reorder layers'
  return 'Select'
}

/* History, as the real HistoryPanel (compose/HistoryPanel.jsx): the undo stack as rows, oldest at the top, the current
   state lit, undone steps dimmed below it; a press steps back or forward to that row through the engine's own undo and
   redo, so the stacks stay one truth. "No history yet." while there is only the open state. */
export default function WindowHistory({ onClose }) {
  const { historyPast: past, historyFuture: future, layers, selectedIds, undo, redo } = useComposeState()
  const states = [...past, { layers, selectedIds }, ...future]
  const current = past.length
  const goTo = (i) => {
    for (let k = current; k > i; k--) undo()
    for (let k = current; k < i; k++) redo()
  }
  return (
    <WindowPane title="History" name="history" onClose={onClose}>
      {states.length === 1 ? (
        <p className="text-help text-muted">No history yet.</p>
      ) : (
        <div className="-mx-2 flex max-h-96 flex-col overflow-y-auto" data-history>
          {states.map((st, i) => (
            <span key={i} className={i > current ? 'opacity-60' : ''}>
              <TreeRow variant="kolbox" label={i === 0 ? 'Open' : describe(states[i - 1], st)} active={i === current} onClick={() => goTo(i)} data-history-row={i} />
            </span>
          ))}
        </div>
      )}
    </WindowPane>
  )
}
