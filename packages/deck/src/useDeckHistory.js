import { useCallback, useRef, useState } from 'react'

/**
 * useDeckHistory — undo / redo for the deck editor.
 *
 * The model is kol-fxr's (`compose/state.jsx`), copied rather than imported on
 * their own advice: it welds to the layer model, and ours is not theirs. What
 * carries over is the two decisions that make it feel right, both of which are
 * easy to get wrong:
 *
 * 1. **Selection rides with the content.** The snapshot is the WHOLE editor
 *    value — `{ slides, active, selectedId }` — not just the documents. Deleting
 *    a selected layer clears the selection, so an undo that restored only the
 *    layers would put the shape back with nothing selected, and the next undo
 *    would appear to do nothing. Restoring both is what makes it read as a
 *    reversal rather than a glitch.
 *
 * 2. **A drag is ONE entry.** A resize fires an update per mousemove — sixty-odd
 *    for a short drag — and pushing each one makes undo useless: you tap it
 *    twelve times and the box has barely moved. `begin()` takes a single
 *    snapshot at mousedown, every update inside the transaction mutates without
 *    pushing, and `end()` closes it. `undo` BAILS while a transaction is open
 *    rather than unwinding a half-finished drag into the stack.
 *
 * Discrete actions (add, delete, reorder, a field edit) push directly.
 *
 * Why the value is mirrored in a ref: pushing history inside a `setState`
 * updater would be a side effect in a function React is free to call twice, and
 * StrictMode does exactly that — every entry would be duplicated. So the next
 * value is computed against the ref, outside the updater, and the ref is the
 * one source both `set` and `undo`/`redo` read.
 *
 * ponytail: a flat capped stack of whole-value snapshots. A deck is fourteen
 * small JSON documents, so a snapshot is cheap and structural sharing would be
 * complexity with nothing to show for it. If a deck ever grows big enough that
 * this matters, the seam to change is here and nowhere else.
 */
const LIMIT = 100

export default function useDeckHistory(initial) {
  const [value, setValue] = useState(initial)
  const ref = useRef(value)          /* the live value, readable outside a render */
  const past = useRef([])
  const future = useRef([])
  const txn = useRef(null)           /* the pre-drag snapshot while a drag is open */

  const commit = useCallback((next) => {
    ref.current = next
    setValue(next)
  }, [])

  /** Apply a change. `updater` is a value or `(prev) => next`, like setState. */
  const set = useCallback((updater) => {
    const prev = ref.current
    const next = typeof updater === 'function' ? updater(prev) : updater
    if (next === prev) return
    if (!txn.current) {
      past.current.push(prev)
      if (past.current.length > LIMIT) past.current.shift()
      future.current = []
    }
    commit(next)
  }, [commit])

  /** Open a transaction — every `set` until `end()` collapses into one entry. */
  const begin = useCallback(() => {
    if (txn.current) return
    txn.current = ref.current
  }, [])

  /** Close it, pushing the pre-drag snapshot iff anything actually changed. */
  const end = useCallback(() => {
    const before = txn.current
    txn.current = null
    if (!before || before === ref.current) return
    past.current.push(before)
    if (past.current.length > LIMIT) past.current.shift()
    future.current = []
  }, [])

  const undo = useCallback(() => {
    if (txn.current) return          /* never unwind a drag in flight */
    const prev = past.current.pop()
    if (prev === undefined) return
    future.current.push(ref.current)
    commit(prev)
  }, [commit])

  const redo = useCallback(() => {
    if (txn.current) return
    const next = future.current.pop()
    if (next === undefined) return
    past.current.push(ref.current)
    commit(next)
  }, [commit])

  /** Replace the value without recording history — for loading a draft. */
  const reset = useCallback((next) => {
    past.current = []
    future.current = []
    txn.current = null
    commit(next)
  }, [commit])

  /* No `canUndo` / `canRedo`: the depths live in refs, and reading a ref during
     render is exactly what React tells you not to do — it would not re-render
     when the stack changed, so a disabled button would lie. Nothing renders one
     today. If a toolbar ever wants them, they become state updated inside these
     callbacks, not reads of `past.current`. */
  return { value, set, begin, end, undo, redo, reset }
}
