import { createContext, useContext, useMemo, useRef } from 'react'
import { ComposeContext } from '../../../compose/composeContext.js'
import { contentView } from '../../../compose/layerModel.js'
import { ContentScope, contentOf, findLayerDeep, useComposeState } from '../engine.js'

/* ContentScopeAll (W8): ContentScope over several layers' rows of the same effect. The settings read as the first row;
   a write to it lands the same patch in every row (each layer keeps its own copy, the same settings), one undo step:
   inside a transaction the settings opened (a coalesced drag) the writes join it, else they open and close their own.
   `hits`: [{ hostId, rowKey }], the first is the one shown. A control reads `useMixed` to say Mixed where the rows
   disagree. */
const Views = createContext(null)

/* true where the rows the settings were opened on hold different values for `get` (read on each row as its layer) */
export function useMixed(get) {
  const views = useContext(Views)
  if (!views || views.length < 2) return false
  const first = JSON.stringify(get(views[0]))
  return views.some((v) => JSON.stringify(get(v)) !== first)
}
/* a control's name with Mixed beside it */
export const mixedLabel = (label, mixed) => (mixed ? <>{label}<span className="ml-2 text-muted">Mixed</span></> : label)

export default function ContentScopeAll({ hits, children }) {
  const state = useComposeState()
  const depth = useRef(0)
  const [a] = hits
  const views = hits.map((h) => { const l = findLayerDeep(state.layers, h.hostId); const r = contentOf(l).find((c) => c.key === h.rowKey); return l && r ? contentView(l, r) : null }).filter(Boolean)
  const value = useMemo(() => ({
    ...state,
    /* the settings read the selected layer: here, the row shown */
    selectedId: a.hostId,
    updateContent: (id, key, patch) => {
      if (id !== a.hostId || key !== a.rowKey) return state.updateContent(id, key, patch)
      const own = depth.current === 0
      if (own) state.beginTransaction()
      hits.forEach((h) => state.updateContent(h.hostId, h.rowKey, patch))
      if (own) state.commitTransaction()
      return undefined
    },
    beginTransaction: (label) => { depth.current += 1; state.beginTransaction(label) },
    commitTransaction: () => { depth.current = Math.max(0, depth.current - 1); if (!depth.current) state.commitTransaction() },
  }), [state, hits, a])
  return (
    <Views.Provider value={views}>
      <ComposeContext.Provider value={value}>
        <ContentScope hostId={a.hostId} rowKey={a.rowKey}>{children}</ContentScope>
      </ComposeContext.Provider>
    </Views.Provider>
  )
}
