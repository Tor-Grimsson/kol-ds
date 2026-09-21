import { useCallback, useRef, useState } from 'react'

/**
 * useHistory — undo/redo over a value the CONSUMER owns, with transactions.
 *
 * Packaged 2026-09-04 (`export-and-history-want-packaging`, kol-fxr for
 * kol-client-olina, who had copied it on our advice and came back asking for
 * it by name). **Generic over the value, deliberately**: one editor's snapshot
 * is `{ slides, active, selectedIds }`, another's is compose state. The
 * consumer's words, and they are right — *if it knows about layers it stops
 * being reusable*. Nothing here inspects what it stores.
 *
 * TWO THINGS MAKE IT WORTH PACKAGING, and both are behaviour rather than code:
 *
 * 1. **Selection rides INSIDE the snapshot.** Undo restores what was selected,
 *    not only what was drawn — so put the selection in the value. An undo that
 *    redraws the old shape but leaves a stale selection is the version everyone
 *    writes first and nobody wants.
 * 2. **A drag is ONE entry.** `begin()` before a gesture and `end()` after it:
 *    every `set` between them updates the live value without pushing, and `end`
 *    pushes once. Without it a pointer-move drag floods the stack.
 *
 * ⚠ **NEVER PUSH INSIDE A `setState` UPDATER.** React StrictMode invokes
 * updaters twice, so every entry doubles — silently, in dev only, and it looks
 * like undo "skipping". The next value is computed against a ref here, outside
 * the updater, which is what makes that impossible rather than merely avoided.
 *
 *   const { value, set, begin, end, undo, redo, reset, canUndo, canRedo } = useHistory(initial)
 *   onPointerDown={begin} onPointerMove={(e) => set(next(e))} onPointerUp={end}
 *
 * @param {*} initialValue - The first snapshot; any shape
 * @param {number} [limit=100] - Entries kept before the oldest is dropped
 * @returns {{value: *, set: Function, begin: Function, end: Function, undo: Function, redo: Function, reset: Function, canUndo: boolean, canRedo: boolean}}
 */
export default function useHistory(initialValue, limit = 100) {
  const [value, setValue] = useState(initialValue)
  /* The ref is the truth the history reads. State drives the render; this
   * drives the stack, so a push never depends on an updater running once. */
  const valueRef = useRef(initialValue)
  const past = useRef([])
  const future = useRef([])
  const txn = useRef(null)   /* the value as it was when begin() was called */
  const [, bump] = useState(0)
  const rerender = () => bump((n) => n + 1)

  const commit = useCallback((next) => {
    valueRef.current = next
    setValue(next)
  }, [])

  /* `set` takes a value or a producer. The producer is called HERE, against
   * the ref, never inside setState — see the StrictMode note above. */
  const set = useCallback((nextOrFn) => {
    const prev = valueRef.current
    const next = typeof nextOrFn === 'function' ? nextOrFn(prev) : nextOrFn
    if (Object.is(next, prev)) return
    if (txn.current === null) {
      past.current = [...past.current, prev].slice(-limit)
      future.current = []
    }
    commit(next)
    rerender()
  }, [commit, limit])

  /* Open a transaction: `set` keeps updating the live value, and the entry
   * that lands on `end` is the value as it was when this was called. */
  const begin = useCallback(() => {
    if (txn.current === null) txn.current = { from: valueRef.current }
  }, [])

  const end = useCallback(() => {
    const open = txn.current
    txn.current = null
    if (!open) return
    if (Object.is(open.from, valueRef.current)) return  /* a gesture that moved nothing is not an entry */
    past.current = [...past.current, open.from].slice(-limit)
    future.current = []
    rerender()
  }, [limit])

  const undo = useCallback(() => {
    if (!past.current.length) return
    const prev = past.current[past.current.length - 1]
    past.current = past.current.slice(0, -1)
    future.current = [valueRef.current, ...future.current]
    commit(prev)
    rerender()
  }, [commit])

  const redo = useCallback(() => {
    if (!future.current.length) return
    const next = future.current[0]
    future.current = future.current.slice(1)
    past.current = [...past.current, valueRef.current].slice(-limit)
    commit(next)
    rerender()
  }, [commit, limit])

  /* Drop the whole stack and start again (a fresh document, a loaded file).
   * Not an undoable step — there is nothing behind it. Omit `next` to return
   * to the value the hook was initialised with. */
  const reset = useCallback((next) => {
    past.current = []
    future.current = []
    txn.current = null
    commit(next === undefined ? initialValue : next)
    rerender()
  }, [commit, initialValue])

  return {
    value,
    set,
    begin,
    end,
    undo,
    redo,
    reset,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
  }
}
