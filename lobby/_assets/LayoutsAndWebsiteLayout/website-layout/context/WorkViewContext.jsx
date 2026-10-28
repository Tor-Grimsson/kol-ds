import { createContext, useContext, useState } from 'react'

const WorkViewContext = createContext(null)

export function WorkViewProvider({ children }) {
  const [viewMode, setViewMode] = useState('list')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <WorkViewContext.Provider value={{ viewMode, setViewMode, searchQuery, setSearchQuery }}>
      {children}
    </WorkViewContext.Provider>
  )
}

export function useWorkView() {
  const ctx = useContext(WorkViewContext)
  if (!ctx) throw new Error('useWorkView must be used within WorkViewProvider')
  return ctx
}
