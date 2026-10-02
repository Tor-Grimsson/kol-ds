// Module wrapper — kol-hardware's ModuleFrame (lifted from this file, 2026-09-27) fed
// the rack's own state: the edit context and the case's power arrive as props.
import { createContext, useContext } from 'react'
import { ModuleFrame } from '@kolkrabbi/kol-hardware'
import { useCasePower } from '../../hooks/useCasePower.jsx'

export const ModuleEditContext = createContext(null)

export default function Module(props) {
  const editCtx = useContext(ModuleEditContext)
  const { power } = useCasePower()
  return <ModuleFrame powered={power} editMode={editCtx?.editMode} onRemove={editCtx?.onRemove} {...props} />
}
