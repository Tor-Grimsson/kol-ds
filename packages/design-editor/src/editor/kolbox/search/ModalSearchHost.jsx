import { CommandOverlay } from '@kolkrabbi/kol-component'
import { useEffect, useState } from 'react'
import { appRows } from '../ui/MenuMain.jsx'
import { loadLibrary, pack, rowLabelForLayer, useComposeState, useTool } from '../editor/engine.js'
import { keymap } from '../editor/windows/WindowShortcuts.jsx'
import { insertImage } from '../editor/windows/InsertImage.jsx'
import { eyedrop } from '../editor/windows/eyedrop.jsx'
import { isSignedIn, openMedia, openSettings, signIn } from '../app/SettingsHost.jsx'
import { allRows, groupsFor, remember, results, suggestions, TABS } from './rows.js'

/* One search modal per screen (round 3, 9.1), mounted inside the screen's providers. It only listens: the top rail's ⌘K,
   the logo menu's Actions… and the editor dock's search cell all send `kolbox:search`, which toggles it, as float's ⌘K
   and dock pill toggle FloatCommandSearch.
   mode: 'editor' | 'labs' | 'morph' | 'home' | 'library'. menus: the screen's menus as the logo menu has them
   ([{ label, groups }]); absent, the app's own rows (MenuMain's appRows for the mode, under FXR, as the logo menu ends on
   them). Only the editor has tools and a document: there the compose state is read; elsewhere nothing of the editor is.
   Round 4, 14.1, the real hub's three groups on every screen: FILES (the library's own files, read from storage as the
   hub reads them; a file opens in its mode as Home opens it), PAGES (every page kolbox has, the real rail's order) and
   SHORTCUTS (the screen's keymap: the editor's on the Editor, Labs' on Labs and Morph, the keys that hold everywhere on
   a page with no chrome; a row presses its key). */
const cmd = (id) => () => window.dispatchEvent(new CustomEvent('kol:command', { detail: { id } }))
const VIEW = { editor: 'editor', labs: 'labs', morph: 'labs' }

/* The tools, as float lists them (FloatEditorShell's searchTools over FloatCompose's tools, moreTools and dockTools, once
   each by label, in that order). Insert image and Eyedropper run the editor's own (windows/InsertImage.jsx, eyedrop.jsx). */
function useEditorTools() {
  const { setTool } = useTool()
  const state = useComposeState()
  const list = [
    { id: 'select', icon: 'pointer', label: 'Select', kbd: 'V' },
    { id: 'zoom', icon: 'search', label: 'Zoom', kbd: 'Z' },
    { id: 'rect', icon: 'square', label: 'Rectangle', kbd: 'R' },
    { id: 'ellipse', icon: 'circle', label: 'Ellipse', kbd: 'O' },
    { id: 'text', icon: 'aa', label: 'Text', kbd: 'T' },
    { id: 'pen', icon: 'pen', label: 'Pen', kbd: 'P' },
    { id: 'image', icon: 'image', label: 'Insert image', run: insertImage },
    { id: 'pattern', icon: 'pattern-tool', label: 'Pattern' },
    { id: 'hand', icon: 'hand', label: 'Hand' },
    { id: 'orbit', icon: 'shape-torus', label: 'Orbit', kbd: 'C' },
    { label: 'Node select', icon: 'pointer-node', kbd: 'A', run: () => window.dispatchEvent(new CustomEvent('kol:node-edit')) },
    { id: 'triangle', icon: 'triangle', label: 'Triangle' },
    { id: 'line', icon: 'line', label: 'Line' },
    { id: 'polygon', icon: 'polygon', label: 'Polygon' },
    { id: 'star', icon: 'star', label: 'Star' },
    ...(pack('motion') ? [{ label: 'Kinetic type', icon: 'type-02', run: () => state.addLayer('kinetic') }] : []),
    { label: 'Fill / stroke', icon: 'swap', kbd: 'X', run: cmd('paint-toggle') },
    { label: 'Reset colours', icon: 'refresh', kbd: 'D', run: cmd('paint-default') },
    { label: 'Eyedropper', icon: 'eyedropper', kbd: 'I', run: eyedrop },
  ]
  /* C5.1b: the open document's layers, every depth, by their row label; a row selects its layer */
  const layers = []
  const walk = (list) => (list ?? []).forEach((l) => { layers.push({ id: l.id, name: rowLabelForLayer(l), kind: l.type, run: () => state.select(l.id) }); walk(l.children) })
  walk(state.layers)
  return { tools: list.map((t) => ({ ...t, run: t.run ?? (() => setTool(t.id)) })), layers }
}

const go = (hash) => () => { window.location.hash = hash }

/* a file opens as Home opens one (pages/Home.jsx): its id to the package's `?open=` intent, its own mode, a new entry */
const openFile = (id, mode) => {
  const url = new URL(window.location.href)
  url.searchParams.set('open', id)
  url.hash = mode === 'morph' ? '#/morph' : '#/editor'
  window.history.pushState(null, '', url.pathname + url.search + url.hash)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}
/* a file's hint is when it was last edited (C5.1b: two "Untitled" files told apart) */
const edited = (t) => (t ? `Edited ${new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}, ${new Date(t).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}` : undefined)
const filesOf = () => (loadLibrary().preset ?? []).filter((p) => !p.shipped)
  .map((p) => ({ id: p.id, name: p.name || 'Untitled', hint: edited(p.updatedAt ?? p.savedAt), run: () => openFile(p.id, p.mode ?? 'editor') }))

/* The pages: the open document (on the editor, float's row), then the real rail top to bottom, the mark's Home first,
   its foot last, each with the real row's glyph; the Randomiser after Labs, as the real rail has it (#/randomiser).
   Dev only on a dev server, as the real row. */
/* C5.1b: the open document's row ran nothing and was a file among pages; it is gone (decided for review) */
const pagesFor = () => [
  { id: '/home', icon: 'home-01', label: 'Home', run: go('#/home') },
  { id: '/library', icon: 'nav-library', label: 'Library', run: go('#/library') },
  { id: '/editor', icon: 'desktop', label: 'Editor', run: go('#/editor') },
  { id: '/labs', icon: 'globe', label: 'Labs', run: go('#/labs') },
  { id: '/randomiser', icon: 'refresh', label: 'Randomiser', run: go('#/randomiser') },
  { id: '/morph', icon: 'swap', label: 'Morph', run: go('#/morph') },
  ...(import.meta.env.DEV ? [{ id: '/dev', icon: 'code', label: 'Dev', run: go('#/dev/controls') }] : []),
  { id: 'media', icon: 'image', label: 'Media', run: openMedia },
  { id: 'sign-in', icon: isSignedIn() ? 'cloud' : 'user', label: isSignedIn() ? 'Signed in' : 'Sign in', run: signIn },
  { id: 'settings', icon: 'nav-settings', label: 'Settings', run: () => openSettings() },
].map((p) => ({ hint: 'Page', ...p }))

function Search({ mode, menus, tools = [], layers = [] }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState(TABS[0].value)
  const [active, setActive] = useState(0)
  useEffect(() => {
    const on = () => setOpen((o) => !o)
    window.addEventListener('kolbox:search', on)
    return () => window.removeEventListener('kolbox:search', on)
  }, [])
  useEffect(() => { if (!open) { setQuery(''); setTab(TABS[0].value) } }, [open])

  /* read while open only: the editor renders on every edit, and its menus hold every generator preset */
  const rows = open ? allRows({ menus, tools, layers, pages: pagesFor(), files: filesOf(), shortcuts: keymap(VIEW[mode] ?? 'home') }) : []
  const groups = open ? groupsFor(query ? results(rows, query) : suggestions(rows), tab) : []
  const flat = groups.flatMap((g) => g.rows)
  /* the lit row goes back to the first live row on every query, tab or open, and when the rows change under them */
  const rowsKey = flat.map((r) => r.id).join('\u0000')
  useEffect(() => { setActive(Math.max(0, flat.findIndex((r) => !r.disabled))) }, [query, open, tab, rowsKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const run = (row) => {
    remember(row.key ?? row.id)
    setOpen(false)
    row.run?.()
  }
  return (
    <CommandOverlay variant="kolbox"
      open={open}
      onClose={() => setOpen(false)}
      query={query}
      onQueryChange={setQuery}
      tabs={TABS}
      tab={tab}
      onTab={setTab}
      groups={groups}
      active={active}
      onActive={setActive}
      onSelect={run}
      empty={mode === 'editor' ? 'Search files, layers, pages, tools, menu actions and shortcuts by name.' : 'Search files, pages, menu actions and shortcuts by name.'}
    />
  )
}

function EditorSearch({ menus }) {
  const { tools, layers } = useEditorTools()
  return <Search mode="editor" menus={menus} tools={tools} layers={layers} />
}

export default function ModalSearchHost({ mode, menus }) {
  if (mode === 'editor') return <EditorSearch menus={menus ?? []} />
  return <Search mode={mode} menus={menus ?? [{ label: 'FXR', groups: [appRows({ mode })] }]} />
}
