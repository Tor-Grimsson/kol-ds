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
  /* `view` lives in the CONTEXT, not in the overlay (2026-08-01). The overlay
   * held its own `viewMode` state, so the graph could only be reached by
   * finding an unlabelled glyph inside the already-open overlay — a caller
   * could open tag mode but not say which mode. The rail's "Graph view" row
   * needs exactly that. */
  const [state, setState] = useState({ isOpen: false, activeTags: [], view: 'list', text: '', expanded: false })

  /* ONE QUERY (user ruling 2026-08-01: "a system that accepts both tags and
   * keywords"). `text` + `activeTags` are two facets of the SAME query, not
   * two searches — ShellLayout used to hold `searchQuery` in its own local
   * state while tags lived here, which is the whole reason the app had two
   * surfaces. `expanded` is the palette's second state: Enter commits the
   * query and opens the results body, Escape collapses it. */
  const openTagMode = useCallback((tag = null, { view = 'list', expanded = false } = {}) => {
    setState((prev) => ({
      isOpen: true,
      activeTags: tag ? [tag] : prev.activeTags,
      view,
      text: '',
      expanded: expanded || !!tag,
    }))
  }, [])

  const setText = useCallback((text) => {
    setState((prev) => ({ ...prev, isOpen: true, text }))
  }, [])

  const setExpanded = useCallback((expanded) => {
    setState((prev) => ({ ...prev, expanded }))
  }, [])

  const setView = useCallback((view) => {
    setState((prev) => ({ ...prev, view }))
  }, [])

  const closeTagMode = useCallback(() => {
    setState({ isOpen: false, activeTags: [], view: 'list', text: '', expanded: false })
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
    if (state.isOpen) setState({ isOpen: false, activeTags: [], view: 'list', text: '', expanded: false })
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
    /* Lets a consumer tell a real provider from the inert fallback, so
     * ShellLayout can own its own palette state when mounted without one
     * instead of silently no-op'ing every keystroke. */
    isProvided: true,
    isOpen: state.isOpen,
    activeTags: state.activeTags,
    activeTag,
    view: state.view,
    setView,
    text: state.text,
    setText,
    expanded: state.expanded,
    setExpanded,
    openTagMode,
    closeTagMode,
    toggleTag,
    removeTag,
    clearTags,
    setActiveTag,
    inventory,
    docHref,
    tagHref
  }), [state.isOpen, state.activeTags, state.view, state.text, state.expanded, setView, setText, setExpanded, activeTag, openTagMode, closeTagMode, toggleTag, removeTag, clearTags, setActiveTag, inventory, docHref, tagHref])

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
  isProvided: false,
  isOpen: false,
  activeTags: [],
  activeTag: null,
  view: 'list',
  setView: noop,
  text: '',
  setText: noop,
  expanded: false,
  setExpanded: noop,
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
