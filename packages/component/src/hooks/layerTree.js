/**
 * layerTree — the labels and the tree walk a layer stack reads.
 *
 * Lifted verbatim from kol-fxr's engine (`compose/labels.js` +
 * `compose/helpers.js`, `editor-panels-the-held-specs` A1, 2026-09-03) as
 * `LayerStack`'s DEFAULTS. A consumer's layer taxonomy is its own — the stack
 * takes `labelFor` and `iconFor` seams — and these are what those seams fall
 * back to when a consumer's layers happen to speak the same `type` vocabulary.
 * In `src/hooks` for the reason `glyphLadders.js` and `pathMath.js` are: the
 * taxonomy's one non-component folder.
 *
 * Convention: Title Case everywhere. A user-set `layer.name` always wins,
 * verbatim — no casing applied.
 */

export const TYPE_LABELS = {
  background: 'Background',
  pattern:    'Pattern',
  photo:      'Photo',
  shape:      'Shape',
  text:       'Text',
  group:      'Group',
  bool:       'Boolean',
  loop:       'Loop',
  kinetic:    'Kinetic type',
  misc:       'Misc',
}

export const BOOL_OP_LABELS = {
  unite:     'Unite',
  subtract:  'Subtract',
  intersect: 'Intersect',
  exclude:   'Exclude',
}

export const SHAPE_KIND_LABELS = {
  logo:     'Logo',
  rect:     'Rectangle',
  ellipse:  'Ellipse',
  triangle: 'Triangle',
  line:     'Line',
  polygon:  'Polygon',
  star:     'Star',
  flatten:  'Flatten',
}

/* Inspector title — verbose form, e.g. "Shape · Rectangle". */
export function labelForLayer(layer) {
  if (layer.type === 'shape') {
    const kind = SHAPE_KIND_LABELS[layer.kind ?? 'logo'] ?? 'Shape'
    return `Shape · ${kind}`
  }
  if (layer.type === 'bool') {
    const op = BOOL_OP_LABELS[layer.op]
    return op ? `Boolean · ${op}` : TYPE_LABELS.bool
  }
  if (layer.type === 'loop' && layer.presetLabel) return `Loop · ${layer.presetLabel}`
  if (layer.type === 'misc' && layer.presetLabel) return `Misc · ${layer.presetLabel}`
  if (layer.type === 'kinetic' && layer.presetLabel) return `Kinetic · ${layer.presetLabel}`
  return TYPE_LABELS[layer.type] ?? layer.type
}

/* Compact label for a layer-stack row. A user-set `layer.name` (inline
 * rename in the layer stack) always wins, verbatim — no casing applied.
 * Otherwise shapes show their kind directly (Figma idiom — "Rectangle"
 * not "Shape · Rectangle"); text rows show the actual content (truncated
 * by the row's CSS). */
export function rowLabelForLayer(layer) {
  if (layer.name) return layer.name
  if (layer.type === 'text') return layer.text || TYPE_LABELS.text
  if (layer.type === 'shape') {
    return SHAPE_KIND_LABELS[layer.kind ?? 'logo'] ?? TYPE_LABELS.shape
  }
  if (layer.type === 'bool') return BOOL_OP_LABELS[layer.op] ?? TYPE_LABELS.bool
  if (layer.type === 'loop' || layer.type === 'misc') return layer.presetLabel || TYPE_LABELS[layer.type]
  if (layer.type === 'kinetic') return layer.presetLabel || TYPE_LABELS.kinetic
  return TYPE_LABELS[layer.type] ?? layer.type
}

/* Walk the layer tree (including group/bool children) and return the layer
 * with `id`, or null if none. Single source of truth — the engine had four
 * inline copies drifting independently before this. */
export function findLayerDeep(layers, id) {
  for (const l of layers) {
    if (l.id === id) return l
    if (Array.isArray(l.children)) {
      const found = findLayerDeep(l.children, id)
      if (found) return found
    }
  }
  return null
}
