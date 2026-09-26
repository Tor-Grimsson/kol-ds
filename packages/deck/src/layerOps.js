import { SLIDE_W, SLIDE_H, newId } from './slideDoc.js'

/**
 * layerOps — the object-level edits, as pure functions on a slide document.
 *
 * Pure `(doc, …) => nextDoc` so the same operation can be reached from the
 * inspector's buttons, the stage's keyboard, and later a context menu, without
 * three copies of the maths. Nothing here touches React or history: the caller
 * hands the result to `onChange`, which is already one undo entry.
 *
 * ALIGN AND DISTRIBUTE follow the rule every design tool uses and which is not
 * obvious until you get it wrong: with ONE object selected you align it to the
 * CANVAS; with several, you align them to their COMMON BOUNDING BOX. Aligning a
 * lone box to its own bounds is a no-op, which reads as a broken button.
 *
 * Distribute needs three or more — with two there is no gap to equalise — and
 * spaces the INNER items, leaving the outer two where they are, which is what
 * keeps the operation stable when you run it twice.
 */

/* The bounding box of a set of layers, in stage coordinates. */
const bounds = (ls) => ({
  x1: Math.min(...ls.map((l) => l.x)),
  y1: Math.min(...ls.map((l) => l.y)),
  x2: Math.max(...ls.map((l) => l.x + l.w)),
  y2: Math.max(...ls.map((l) => l.y + l.h)),
})

/** Align `ids` on `axis` ('h'|'v') to `mode` ('start'|'center'|'end'). */
export function alignLayers(doc, ids, axis, mode) {
  const sel = doc.layers.filter((l) => ids.includes(l.id))
  if (!sel.length) return doc
  /* one box aligns to the CANVAS, several to their shared bounds */
  const b = sel.length === 1 ? { x1: 0, y1: 0, x2: SLIDE_W, y2: SLIDE_H } : bounds(sel)

  return {
    ...doc,
    layers: doc.layers.map((l) => {
      if (!ids.includes(l.id)) return l
      if (axis === 'h') {
        const x = mode === 'start' ? b.x1
          : mode === 'end' ? b.x2 - l.w
          : b.x1 + (b.x2 - b.x1 - l.w) / 2
        return { ...l, x: Math.round(x) }
      }
      const y = mode === 'start' ? b.y1
        : mode === 'end' ? b.y2 - l.h
        : b.y1 + (b.y2 - b.y1 - l.h) / 2
      return { ...l, y: Math.round(y) }
    }),
  }
}

/** Even gaps between three or more, along `axis`. Outer two stay put. */
export function distributeLayers(doc, ids, axis) {
  const sel = doc.layers.filter((l) => ids.includes(l.id))
  if (sel.length < 3) return doc
  const key = axis === 'h' ? 'x' : 'y'
  const size = axis === 'h' ? 'w' : 'h'
  const ordered = [...sel].sort((a, b) => a[key] - b[key])
  const first = ordered[0]
  const last = ordered[ordered.length - 1]
  const span = (last[key] + last[size]) - first[key]
  const used = ordered.reduce((sum, l) => sum + l[size], 0)
  const gap = (span - used) / (ordered.length - 1)

  const next = new Map()
  let cursor = first[key]
  ordered.forEach((l) => {
    next.set(l.id, Math.round(cursor))
    cursor += l[size] + gap
  })
  return { ...doc, layers: doc.layers.map((l) => (next.has(l.id) ? { ...l, [key]: next.get(l.id) } : l)) }
}

/* A copy sits slightly off its original so it is visibly a second object rather
   than looking like nothing happened. 20 stage px is Figma's nudge, scaled. */
const OFFSET = 20

/** Duplicate `ids`; returns `[nextDoc, newIds]` so the caller can select them. */
export function duplicateLayers(doc, ids) {
  const copies = doc.layers
    .filter((l) => ids.includes(l.id))
    .map((l) => ({ ...l, id: newId(l.type), x: l.x + OFFSET, y: l.y + OFFSET }))
  if (!copies.length) return [doc, []]
  return [{ ...doc, layers: [...doc.layers, ...copies] }, copies.map((c) => c.id)]
}

/** Paste previously-copied layer objects in, with fresh ids. */
export function pasteLayers(doc, clipboard) {
  if (!clipboard?.length) return [doc, []]
  const copies = clipboard.map((l) => ({ ...l, id: newId(l.type), x: l.x + OFFSET, y: l.y + OFFSET }))
  return [{ ...doc, layers: [...doc.layers, ...copies] }, copies.map((c) => c.id)]
}

/**
 * Z-ORDER. The array IS the order — first is bottom — so front/back is a
 * reordering, not a property. Moving a SET keeps the set's own relative order,
 * which is what stops a multi-selection scrambling when you send it back.
 */
export function reorderZ(doc, ids, where) {
  const moving = doc.layers.filter((l) => ids.includes(l.id))
  const rest = doc.layers.filter((l) => !ids.includes(l.id))
  if (!moving.length) return doc
  if (where === 'front') return { ...doc, layers: [...rest, ...moving] }
  if (where === 'back') return { ...doc, layers: [...moving, ...rest] }

  /* forward / backward step one place past the nearest non-selected neighbour */
  const idx = doc.layers.findIndex((l) => ids.includes(l.id))
  const last = doc.layers.map((l) => ids.includes(l.id)).lastIndexOf(true)
  const at = where === 'forward' ? Math.min(last + 2 - moving.length + 1, rest.length) : Math.max(idx - 1, 0)
  const next = [...rest]
  next.splice(at, 0, ...moving)
  return { ...doc, layers: next }
}

/**
 * DECK-WIDE SETTINGS (user 2026-09-03: "some streamline way to have a
 * view/modal where you set date and heading, or event and background color,
 * like per presentation settings … before you go in and individual edit").
 *
 * Writes through `role`, never through text matching — see slideDoc's ROLE.
 * Two slides can legitimately carry the same words, and a deck renamed once
 * would stop matching itself on the second pass.
 *
 * `undefined` means "leave alone", so a settings pass that only changes the
 * background does not blank the date. Empty string is a real value and clears.
 */
export function applyDeckSettings(slides, { name, date, background } = {}) {
  return slides.map((s) => {
    const layers = s.doc.layers.map((l) => {
      if (name !== undefined && l.role === 'deck-name') return { ...l, text: name }
      if (date !== undefined && l.role === 'deck-date') return { ...l, text: date }
      return l
    })
    const doc = { ...s.doc, layers }
    if (background !== undefined) doc.bg = background
    return { ...s, doc }
  })
}

/** Duplicate one slide, placed right after its original. */
export function duplicateSlide(slides, index) {
  const src = slides[index]
  if (!src) return slides
  const copy = {
    id: newId('slide'),
    doc: { ...src.doc, layers: src.doc.layers.map((l) => ({ ...l, id: newId(l.type) })) },
  }
  const next = [...slides]
  next.splice(index + 1, 0, copy)
  return next
}
