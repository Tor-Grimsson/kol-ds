/* Is there a draft the restore prompt will offer? The engine's own test (compose/state.jsx's restore check): a stored
   slot whose `layers` is a non-empty list. The editor's slot is the engine's DRAFT_KEY, which it does not export (the
   File menu's New, editor/MenuBar.jsx, names it the same way). */
export function hasDraft(key = 'kol.editor.draft') {
  try { return (JSON.parse(localStorage.getItem(key))?.layers?.length ?? 0) > 0 } catch { return false }
}

/* Is this the editor's first-ever visit? The sample document seeds that one visit only (round 4, W5). Without the mark,
   File › New (which clears the draft and reloads, as the real one) found an empty document with no draft and seeded the
   sample again. True once, then false for good in this browser. */
export function firstVisit(key = 'kolbox.editor.seeded') {
  try { if (localStorage.getItem(key)) return false; localStorage.setItem(key, '1'); return true } catch { return false }
}
