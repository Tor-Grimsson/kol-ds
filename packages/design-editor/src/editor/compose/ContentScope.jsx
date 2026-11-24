import { useMemo } from 'react'
import { ComposeContext } from './composeContext'
import { useComposeState } from './state'
import { findLayerDeep } from './helpers'
import { contentOf, contentView } from './layerModel'

/**
 * ContentScope (W22, ./layerModel.js) — the settings of an effect row that draws (pattern, kinetic type, generate,
 * motion) are the old layer's own settings surfaces, reused unchanged: inside the scope the layer reads as the row's
 * old layer (its params on the layer's box) and every write to the layer's id lands in the row. Writes to any other
 * layer pass through. The row's params live in the layer, so undo, duplicate and save carry them.
 */
const swapDeep = (list, id, next) => list.map((l) => (l.id === id ? next : Array.isArray(l.children) ? { ...l, children: swapDeep(l.children, id, next) } : l))

export default function ContentScope({ hostId, rowKey, children }) {
  const state = useComposeState()
  const host = findLayerDeep(state.layers, hostId)
  const row = contentOf(host).find((c) => c.key === rowKey)
  const view = useMemo(() => (host && row ? contentView(host, row) : null), [host, row])
  const value = useMemo(() => (view ? {
    ...state,
    layers: swapDeep(state.layers, hostId, view),
    updateLayer: (id, patch) => (id === hostId ? state.updateContent(hostId, rowKey, patch) : state.updateLayer(id, patch)),
  } : state), [state, view, hostId, rowKey])
  if (!view) return null
  return <ComposeContext.Provider value={value}>{children}</ComposeContext.Provider>
}
