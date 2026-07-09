import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Singleton across duplicate module instances: Vite dev can serve this file
// under two URLs (barrel `?v=` vs direct import), which would otherwise create
// two distinct contexts and break useTagMode. Stash on globalThis so every
// instance shares one context object. Harmless in prod (single instance).
const TagModeContext = (globalThis.__KOL_TAGMODE_CONTEXT__ ||= createContext(null))

/**
 * Default route helpers. These are the ONLY place the old hardcoded workshop
 * routes survive — pass `docHref` / `tagHref` to the provider to point the tag
 * system at your app's routes. Consumers also inject their docs `inventory`
 * here so the overlay + graph stay decoupled from any Vite-glob singleton.
 */
const defaultDocHref = (id) => `/workshop/docs/${id}`
const defaultTagHref = (tag) => `/workshop/design-system/documentation?tag=${encodeURIComponent(tag)}`

export const TagModeProvider = ({
  children,
  inventory = [],
  docHref = defaultDocHref,
  tagHref = defaultTagHref
}) => {
  const [state, setState] = useState({ isOpen: false, activeTags: [] })

  const openTagMode = useCallback((tag = null) => {
    setState({ isOpen: true, activeTags: tag ? [tag] : [] })
  }, [])

  const closeTagMode = useCallback(() => {
    setState({ isOpen: false, activeTags: [] })
  }, [])

  const toggleTag = useCallback((tag) => {
    setState((prev) => ({
      ...prev,
      activeTags: prev.activeTags.includes(tag)
        ? prev.activeTags.filter((t) => t !== tag)
        : [...prev.activeTags, tag]
    }))
  }, [])

  const removeTag = useCallback((tag) => {
    setState((prev) => ({
      ...prev,
      activeTags: prev.activeTags.filter((t) => t !== tag)
    }))
  }, [])

  const clearTags = useCallback(() => {
    setState((prev) => ({ ...prev, activeTags: [] }))
  }, [])

  // Backward compat: activeTag = first tag (used by TagGraph)
  const activeTag = state.activeTags[0] || null

  // Backward compat: setActiveTag sets single tag
  const setActiveTag = useCallback((tag) => {
    setState((prev) => ({ ...prev, activeTags: tag ? [tag] : [] }))
  }, [])

  // Close on any route change
  const location = useLocation()
  useEffect(() => {
    if (state.isOpen) setState({ isOpen: false, activeTags: [] })
  }, [location.pathname])

  useEffect(() => {
    if (!state.isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeTagMode()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.isOpen, closeTagMode])

  const value = useMemo(() => ({
    isOpen: state.isOpen,
    activeTags: state.activeTags,
    activeTag,
    openTagMode,
    closeTagMode,
    toggleTag,
    removeTag,
    clearTags,
    setActiveTag,
    inventory,
    docHref,
    tagHref
  }), [state.isOpen, state.activeTags, activeTag, openTagMode, closeTagMode, toggleTag, removeTag, clearTags, setActiveTag, inventory, docHref, tagHref])

  return (
    <TagModeContext.Provider value={value}>
      {children}
    </TagModeContext.Provider>
  )
}

/**
 * No-provider fallback: tag mode degrades to inert (tags render, clicks no-op)
 * instead of crashing the reader. Wrap with TagModeProvider to enable it.
 */
const noop = () => {}
const DEFAULT_TAG_MODE = {
  isOpen: false,
  activeTags: [],
  activeTag: null,
  openTagMode: noop,
  closeTagMode: noop,
  toggleTag: noop,
  removeTag: noop,
  clearTags: noop,
  setActiveTag: noop,
  inventory: [],
  docHref: defaultDocHref,
  tagHref: defaultTagHref
}

export const useTagMode = () => useContext(TagModeContext) ?? DEFAULT_TAG_MODE

export default TagModeContext
