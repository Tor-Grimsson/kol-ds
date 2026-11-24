import { useEffect, useMemo, useRef, useState } from 'react'
import { FRAME_MODEL, GeneratorLibraryProvider, LAYER_MODEL, downloadBlob, formatSize, getAppSettings, pickImage, useGeneratorLibrary } from '../home/engine.js'
import HomeRail, { FILES_TYPE } from '../ui/HomeRail.jsx'
import Icon from '@design-editor-src/editor/kolbox/ui/Icon.jsx'
import { askPrompt } from '@design-editor-src/editor/kolbox/ui/ask.js'
import { askConfirm } from '@design-editor-src/editor/kolbox/ui/ask.js'
import BrowserTopBar from '../home/BrowserTopBar.jsx'
import RailFile from '../home/RailFile.jsx'
import ModalSearchHost from '@design-editor-src/editor/kolbox/search/ModalSearchHost.jsx'
import { signIn } from '@design-editor-src/editor/kolbox/app/SettingsHost.jsx'
import { createFolder, DRAFTS, folderOf, forget, isStarred, listFolders, moveFile, placeOf, removeFolder, renameFolder, restoreFile, starredIds, toggleStar, trashedAt, trashFile, usePlaces } from '@design-editor-src/editor/kolbox/files/places.js'
import { pickPortable, portableFile, readPortable } from '@design-editor-src/editor/kolbox/files/portable.js'
import { sessionUser, signOut } from '@design-editor-src/editor/kolbox/files/account.js'
import { useSampleFiles } from '../home/samples.js'
import { Button, ButtonGroup, Dropdown, Menu, Tooltip, SectionText, Table, ContentCard } from '@kolkrabbi/kol-component'
import { CatalogGrid, CatalogPage } from '@kolkrabbi/kol-shell'

/* Home (round 3 plan 5.1): HomeRail beside the file browser, grid or list, on the engine's own file library (the
   Files window's). Recents and Drafts both list every file the library holds: it has no folders, no stars, no trash and
   no shared spaces, so those rows and the controls that would act on them were drawn disabled (T3.1 below).
   Opening a file hands its id to the package's `?open=` intent and goes to the file's own mode, #/morph for a morph
   file and #/editor for the rest, which loads it on mount (round 4, W9).
   Round 4, W13, the real Home's verbs (editor-hub AppLayout `home`, on the library's own calls): each card and row
   has the cog (the FILE rail, home/RailFile.jsx), the trash ("Delete “…”?", Delete), the cover's download (the stored
   file as `<name>.json`) and the right-click menu (Rename, Duplicate, Delete); the card shows its date, size and the
   chrome's mark. Rename, Duplicate, Delete and the cover are the library's renameItem, duplicateItem, removeItem and
   setThumb, so they outlive a reload. Tags and the note: the library keeps no field for either (its preset validator
   drops unknown keys on load), so, as the real hub does, they are held for the session (`extras`), and the Tags filter
   and its count read them.
   Round 4, W12, the way out: the KOL mark before the breadcrumb opens the one menu (MenuMain with appRows: Home, the
   Chromes, Settings…, the one Settings through app/SettingsHost.jsx).
   C8 (plan-2026-11-19-kolbox-whats-left, W30.3 and 30.4): Drafts and the account's folders are real (files/places.js):
   Drafts lists the files that live there, a folder its own; the rail's Folders group makes one; a file moves by its
   menu's Move to; Create makes the new file in the folder on screen, or opens a portable file (files/portable.js) into
   it; a cover's download is that portable file. The account chip sits at the rail's foot with its menu; signed out it
   says so and offers Sign in, whose window explains the account is not connected in this build.
   T3.1: the places the local library can hold are live, as Figma's file browser has them: Delete moves a file to Trash
   (no confirm, it comes back), Trash lists it with Restore and Permanently delete; the star on a card, a row and a
   folder's top bar, and the rail's Starred group; All folders lists the folders; a folder's title menu holds Rename and
   Delete.
   W3.1 (plan-2026-11-20, his ruling: "we wont have community resources share or notifications. admin and adjust just
   sounds like settings"): Community, Resources, Admin, Share, Adjust and the bell are off; Settings is RailSwitcher's
   foot, and so is the mark (W1.1). Their code is in _tmp/2026-11-20-w3-w4/retired-home-rows.jsx.
   W3.2, several files at once, as Figma's file browser: a press selects one, ⇧ press a range from the last pressed, ⌘
   press adds or takes one away, a drag over the empty ground selects what it crosses, a press on the ground clears.
   The menu's Move to, Duplicate, Delete, Star and, in Trash, Restore act on the whole selection; Delete and Backspace
   move it to Trash. A file or the selection drags onto a folder in the rail (Drafts, the account's folders, Trash) or
   onto a folder card in All folders, the folder lit while it is over it. */

const SORTS = [{ value: 'modified', label: 'Last modified' }, { value: 'created', label: 'Created' }, { value: 'name', label: 'Name' }]
const BY = {
  modified: (a, b) => b.modified - a.modified,
  created: (a, b) => b.created - a.created,
  name: (a, b) => a.name.localeCompare(b.name),
}
/* a file's type is the chrome it was saved from (the spec's `mode`, editor when older files carry none) */
const TYPE_LABEL = { editor: 'Editor', labs: 'Labs', morph: 'Morph', randomiser: 'Randomiser' }
/* the chrome's mark on the cover, the real hub's glyphs (editor-hub AppLayout CHROMES) */
const MARK_ICON = { editor: 'desktop', labs: 'globe', randomiser: 'refresh', morph: 'swap' }

/* the session's tags and notes, by file id, and the session's sign-in: module state, so they outlive a trip to the
   editor and back as the real AppLayout's state does, and go with a reload as the real ones do */
const extras = new Map()

/* the library writes its storage after React commits the new file, and the editor reads storage on mount: a file is
   opened once it is there (up to a second), or the editor finds no file */
const whenStored = (id) => new Promise((resolve) => {
  const t0 = Date.now()
  const look = () => {
    let hit = false
    try { hit = (JSON.parse(localStorage.getItem('kol.editor.library.v3') || '{}').preset ?? []).some((x) => x.id === id) } catch { /* unreadable: give up waiting */ }
    if (hit || Date.now() - t0 > 1000) resolve(); else requestAnimationFrame(look)
  }
  look()
})

const open = (id, mode) => {
  const url = new URL(window.location.href)
  url.searchParams.set('open', id)
  url.hash = mode === 'morph' ? '#/morph' : '#/editor'
  /* a new entry carrying the intent, so Home's own entry stays clean for back (App routes on hashchange) */
  window.history.pushState(null, '', url.pathname + url.search + url.hash)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}

function Screen() {
  const { library, addItem, renameItem, duplicateItem, removeItem, setThumb } = useGeneratorLibrary()
  /* a library with no files of its own gets the sample files, once (home/samples.js) */
  useSampleFiles()
  usePlaces()
  const [createOpen, setCreateOpen] = useState(false)
  const [adjustOpen, setAdjustOpen] = useState(false)
  const adjustRef = useRef(null)
  const createRef = useRef(null)
  const [, setTick] = useState(0)
  const [place, setPlace] = useState('recents')
  const [view, setView] = useState('grid')
  const [sort, setSort] = useState('modified')
  const [type, setType] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [railId, setRailId] = useState(null)
  const [menu, setMenu] = useState(null)
  const [railHidden, setRailHidden] = useState(false)

  /* Home has no top rail, so it sends the search event on ⌘K itself, as TopRail does on the other screens */
  useEffect(() => {
    const on = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k' || e.target.closest?.('input, textarea, [contenteditable]')) return
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('kolbox:search'))
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [])
  /* ⇧\ hides and shows the rail, the real shell's rail key (round 4, the shell's hide rail), never while typing */
  useEffect(() => {
    const on = (e) => {
      if (e.code !== 'Backslash' || !e.shiftKey || e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.('input, textarea, [contenteditable]')) return
      e.preventDefault()
      setRailHidden((v) => !v)
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [])
  /* the account row reads the shell's sign-in, again when it changes */
  useEffect(() => {
    const on = () => setTick((n) => n + 1)
    window.addEventListener('kolbox:account', on)
    return () => window.removeEventListener('kolbox:account', on)
  }, [])

  const stored = useMemo(() => (library.preset ?? []).filter((p) => !p.shipped), [library])
  const all = stored.map((p) => {
    const type = p.mode ?? 'editor'
    const x = extras.get(p.id) ?? {}
    return {
      id: p.id,
      name: p.name || 'Untitled',
      type,
      thumb: p.thumb,
      modified: p.updatedAt ?? p.savedAt,
      created: p.savedAt,
      /* the real hub's: the stored file's JSON length, as formatSize prints it */
      size: formatSize(new Blob([JSON.stringify(p)]).size),
      mark: { icon: MARK_ICON[type] ?? 'desktop', label: TYPE_LABEL[type] ?? type },
      tags: x.tags ?? [],
      note: x.note ?? '',
      starred: isStarred(p.id),
      trashed: trashedAt(p.id),
    }
  })
  const live = all.filter((f) => !f.trashed)
  const types = [...new Set(all.map((f) => f.type))]
  const tags = [...new Set(all.flatMap((f) => f.tags))]
  const q = query.trim().toLowerCase()
  /* the account's folders as cards (All folders): last modified is their newest file's */
  const folderCards = () => listFolders().filter((d) => !d.builtIn).map((d) => {
    const inside = live.filter((f) => placeOf(f.id) === d.id)
    return { id: d.id, name: d.name, icon: 'folder', folder: true, starred: isStarred(d.id), created: d.created, modified: Math.max(d.created ?? 0, ...inside.map((f) => f.modified ?? 0)) }
  })
  /* where the screen is: Recents holds every live file, Drafts and a folder the files that live there, Trash the
     trashed ones, All folders the folders */
  const pool = place === 'folders' ? folderCards() : place === 'trash' ? all.filter((f) => f.trashed) : live.filter((f) => place === 'recents' || placeOf(f.id) === place)
  const files = pool
    .filter((f) => (f.folder || ((type === 'all' || f.type === type) && (tagFilter === 'all' || f.tags.includes(tagFilter)))) && (!q || f.name.toLowerCase().includes(q)))
    .sort(BY[sort])

  /* Create: a new, empty editor file in the library, then opened */
  const create = () => {
    const aspect = getAppSettings().defaultAspect
    /* marked in today's models, so it opens as an empty page (C1); unmarked, the editor read it as an old file and gave it a frame */
  const id = addItem('preset', { mode: 'editor', layers: [], frameModel: FRAME_MODEL, layerModel: LAYER_MODEL, ...(aspect && aspect !== 'custom' ? { aspect } : {}) })
    if (id) { moveFile(id, here); whenStored(id).then(() => open(id)) }
  }
  /* the folder a new file lands in: the one on screen, Drafts from Recents */
  const here = place === 'recents' ? DRAFTS.id : place
  /* Open file…: a portable file from disk, a new file in the folder on screen, then opened */
  const openPortable = async () => {
    const file = await pickPortable()
    if (!file) return
    try {
      const spec = await readPortable(file)
      const id = addItem('preset', spec)
      if (id) { moveFile(id, here); await whenStored(id); open(id, spec.mode) }
    } catch (e) { askConfirm({ title: e.message, action: 'OK', cancel: null }) }
  }
  const newFolder = async () => {
    const n = (await askPrompt({ title: 'New folder', value: '', placeholder: 'Folder name', action: 'Create' }))?.trim()
    const id = n && createFolder(n)
    if (id) setPlace(id)
    return id
  }

  /* the verbs, each the library's own call (the real AppLayout `home` handlers, with the stored file in place of its
     session copy); the prompts and the confirm in the real words */
  const putExtra = (id, patch) => { extras.set(id, { ...extras.get(id), ...patch }); setTick((n) => n + 1) }
  const verbs = {
    rename: (f, name) => renameItem('preset', f.id, name),
    duplicate: (f) => {
      const id = duplicateItem('preset', f.id)
      if (id) moveFile(id, placeOf(f.id))
      if (id && extras.has(f.id)) extras.set(id, { ...extras.get(f.id) })
    },
    /* Delete moves the file to Trash, as Figma's Move to trash: no confirm, Restore brings it back */
    remove: async (f) => { trashFile(f.id); return true },
    restore: (f) => restoreFile(f.id),
    purge: async (f) => {
      const ok = await askConfirm({ title: `Permanently delete “${f.name || 'Untitled'}”?`, action: 'Delete' })
      if (ok) { removeItem('preset', f.id); forget(f.id) }
      return ok
    },
    star: (f) => toggleStar(f.id),
    /* the stored file as one portable file (files/portable.js), which Open file… reads back */
    download: async (f) => {
      const p = stored.find((x) => x.id === f.id)
      if (p) { const out = await portableFile(p, f.name); downloadBlob(out.blob, out.name) }
    },
    cover: async (f) => { const src = await pickImage(); if (src) setThumb('preset', f.id, src) },
  }
  const askRename = async (f) => {
    const next = await askPrompt({ title: 'Rename:', value: f.name })
    if (next != null && next.trim() && next.trim() !== f.name) verbs.rename(f, next.trim())
  }

  /* the right-click menu, at the pointer: a point for an anchor */
  const at = (x, y) => ({ getBoundingClientRect: () => new DOMRect(x, y, 0, 0), contains: () => false })
  /* SEVERAL FILES (W3.2): the selection, the last pressed (a range's start), the band dragged over the ground */
  const [sel, setSel] = useState(() => new Set())
  const last = useRef(null)
  const boxRef = useRef(null)
  const [band, setBand] = useState(null)
  const [dropOver, setDropOver] = useState(null)
  useEffect(() => { setSel(new Set()); last.current = null }, [place])
  const ids = files.map((f) => f.id)
  const itemOf = (t) => t?.closest?.('[data-file-card], [data-file-row]')
  const idOf = (el) => el.getAttribute('data-file-card') ?? el.getAttribute('data-file-row')
  const pick = (id, e) => {
    if (e.shiftKey && last.current && ids.includes(last.current)) {
      const a = ids.indexOf(last.current), b = ids.indexOf(id)
      setSel(new Set(ids.slice(Math.min(a, b), Math.max(a, b) + 1)))
      return
    }
    last.current = id
    if (e.metaKey || e.ctrlKey) setSel((cur) => { const n = new Set(cur); if (n.has(id)) n.delete(id); else n.add(id); return n })
    else setSel(new Set([id]))
  }
  /* the files a verb acts on: the selection when the pressed file is in it, else that file alone */
  const targetsOf = (f) => (sel.has(f.id) ? files.filter((x) => sel.has(x.id)) : [f])
  const moveAll = (list, to) => { list.forEach((id) => moveFile(id, to)); setSel(new Set()) }
  const trashAll = (list) => { list.forEach((id) => trashFile(id)); setSel(new Set()) }
  const purgeAll = async (list) => {
    const ok = await askConfirm({ title: list.length === 1 ? `Permanently delete “${list[0].name || 'Untitled'}”?` : `Permanently delete ${list.length} files?`, action: 'Delete' })
    if (ok) { list.forEach((f) => { removeItem('preset', f.id); forget(f.id) }); setSel(new Set()) }
  }
  const onMenu = (f, e) => {
    if (!sel.has(f.id)) { setSel(new Set([f.id])); last.current = f.id }
    setMenu({ file: f, files: targetsOf(f), anchor: at(e.clientX, e.clientY) })
  }
  /* a press on a card or row picks it; on the ground it clears (a band drag has already chosen) */
  const onBoxClick = (e) => {
    if (e.target.closest('button, input')) return
    const el = itemOf(e.target)
    if (el) pick(idOf(el), e)
    else if (!band?.moved) setSel(new Set())
  }
  /* the band over the empty ground: what it crosses is selected (⌘ or ⇧ adds to the selection there was) */
  const onBoxDown = (e) => {
    if (e.button !== 0 || itemOf(e.target) || e.target.closest('button, input')) return
    const x0 = e.clientX, y0 = e.clientY
    const before = e.metaKey || e.ctrlKey || e.shiftKey ? new Set(sel) : new Set()
    const els = [...(boxRef.current?.querySelectorAll('[data-file-card], [data-file-row]') ?? [])]
    const move = (m) => {
      const r = { left: Math.min(x0, m.clientX), top: Math.min(y0, m.clientY), right: Math.max(x0, m.clientX), bottom: Math.max(y0, m.clientY) }
      if (r.right - r.left < 3 && r.bottom - r.top < 3) return
      setBand({ ...r, moved: true })
      const hit = new Set(before)
      els.forEach((el) => { const b = el.getBoundingClientRect(); if (b.left < r.right && b.right > r.left && b.top < r.bottom && b.bottom > r.top) hit.add(idOf(el)) })
      setSel(hit)
    }
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); setTimeout(() => setBand(null)) }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }
  /* a card or row drags the selection (or itself) out; a folder card in All folders takes it */
  const onBoxDragStart = (e) => {
    const el = itemOf(e.target)
    if (!el) return
    const id = idOf(el)
    const moving = sel.has(id) ? [...sel] : [id]
    if (!sel.has(id)) setSel(new Set([id]))
    e.dataTransfer.setData(FILES_TYPE, JSON.stringify(moving))
    e.dataTransfer.effectAllowed = 'move'
  }
  const folderCardOf = (e) => { const el = place === 'folders' && e.dataTransfer.types.includes(FILES_TYPE) && itemOf(e.target); return el ? idOf(el) : null }
  const onBoxDragOver = (e) => { const id = folderCardOf(e); if (!id) return; e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDropOver(id) }
  const onBoxDrop = (e) => { const id = folderCardOf(e); setDropOver(null); if (!id) return; e.preventDefault(); moveAll(JSON.parse(e.dataTransfer.getData(FILES_TYPE)), id) }
  /* the selection's marks on the kit's cards and rows, which take none of their own: selected, lit as a drop target, draggable */
  useEffect(() => {
    boxRef.current?.querySelectorAll('[data-file-card], [data-file-row]').forEach((el) => {
      const id = idOf(el)
      el.toggleAttribute('data-selected', sel.has(id))
      el.toggleAttribute('data-drop-over', dropOver === id)
      el.draggable = place !== 'folders' && place !== 'trash'
    })
  })
  /* Delete and Backspace move the selection to Trash (not in Trash or All folders), never while typing */
  useEffect(() => {
    const on = (e) => {
      if (!['Delete', 'Backspace'].includes(e.key) || !sel.size || place === 'trash' || place === 'folders' || e.target.closest?.('input, textarea, [contenteditable]')) return
      e.preventDefault()
      trashAll([...sel])
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  })

  const railFile = all.find((f) => f.id === railId)
  const details = (f) => {
    const p = stored.find((x) => x.id === f.id) ?? {}
    return [
      { label: 'Date', value: new Date(f.modified).toISOString().slice(0, 10) },
      { label: 'Size', value: f.size },
      { label: 'Chrome', value: f.mark.label },
      { label: 'Layers', value: p.layers?.length ?? 0 },
      { label: 'Aspect', value: p.aspect ?? '1:1' },
      { label: 'Location', value: folderOf(placeOf(f.id)).name },
    ]
  }

  const PLACES = [
    { id: 'recents', icon: 'clock', label: 'Recents' },
    { id: 'drafts', icon: 'file', label: 'Drafts' },
    { id: 'folders', icon: 'grid-2x2', label: 'All folders' },
    { id: 'trash', icon: 'trash', label: 'Trash' },
  ]
  const folders = listFolders().filter((f) => !f.builtIn)
  const title = PLACES.find((p) => p.id === place)?.label ?? folderOf(place).name
  /* a folder of the account (not Drafts, not a place) has its own rows and its own star */
  const folder = folders.find((f) => f.id === place)
  const renameAsk = async (d) => {
    const next = (await askPrompt({ title: 'Rename:', value: d.name }))?.trim()
    if (next && next !== d.name) renameFolder(d.id, next)
  }
  const deleteFolder = async (d) => {
    const ok = await askConfirm({ title: `Delete “${d.name}”?`, action: 'Delete' })
    if (!ok) return
    removeFolder(d.id)
    if (place === d.id) setPlace('folders')
  }
  const folderRows = (d) => [[{ label: 'Rename', icon: 'edit', run: () => renameAsk(d) }, { label: 'Delete', icon: 'trash', run: () => deleteFolder(d) }]]
  /* the rail's Starred group: what is starred, in the order it was starred; a file opens, a folder is gone to */
  const starred = starredIds().map((id) => {
    const d = folders.find((x) => x.id === id)
    if (d) return { id, icon: 'folder', label: d.name, selected: place === id, onClick: () => setPlace(id) }
    const f = live.find((x) => x.id === id)
    return f && { id, icon: 'file', label: f.name, onClick: () => open(f.id, f.type) }
  }).filter(Boolean)
  /* each place's card and row verbs: Trash restores and deletes for good, All folders opens and stars a folder */
  const cardProps = place === 'trash'
    ? { onRemove: verbs.purge, onMenu }
    : place === 'folders'
      ? { onOpen: (d) => setPlace(d.id), onStar: verbs.star, onMenu }
      : { onOpen: (x) => open(x.id, x.type), onDownload: verbs.download, onStar: verbs.star, onSettings: (x) => setRailId(x.id), onRemove: verbs.remove, onMenu }
  /* the account chip's menu: with a session, the profile and the plan as lines (the account service has no page for
     either yet) and Sign out; signed out, the line that says so and Sign in */
  /* the host's account (W4.1, files/account.js): the editor's `account` prop, nothing else */
  const user = sessionUser()
  const accountMenu = user
    ? [[{ label: user.name || user.email || 'Profile', icon: 'user', disabled: true }, { label: `Plan: ${user.plan ?? 'Free'}`, icon: 'star', disabled: true }], [{ label: 'Sign out', run: () => { signOut(); setTick((n) => n + 1) } }]]
    : [{ title: 'Not signed in', rows: [{ label: 'Sign in…', icon: 'user', run: signIn }] }]

  /* the rail's search panel (Figma's file-browser search, 2026-11-24): Type: and In: set the browser's own Type filter
     and place, By: the signed-in account only; Recent lists the newest live files those and the query leave */
  const recent = {
    files: live
      .filter((f) => (type === 'all' || f.type === type) && (['recents', 'folders', 'trash'].includes(place) || placeOf(f.id) === place) && (!q || f.name.toLowerCase().includes(q)))
      .sort(BY.modified).slice(0, 5)
      .map((f) => ({ id: f.id, name: f.name, icon: f.mark.icon, folder: folderOf(placeOf(f.id)).name, modified: f.modified, onOpen: () => open(f.id, f.type) })),
    filters: [
      { id: 'type', label: 'Type:', hint: 'Filter by resource type', value: type !== 'all' && (TYPE_LABEL[type] ?? type),
        groups: [[{ value: 'all', label: 'All types' }, ...types.map((t) => ({ value: t, label: TYPE_LABEL[t] ?? t }))].map((o) => ({ label: o.label, check: type === o.value, run: () => setType(o.value) }))] },
      { id: 'by', label: 'By:', hint: 'Filter by file creator',
        groups: [[user ? { label: user.name || user.email, icon: 'user', check: true } : { label: 'Not signed in', icon: 'user', disabled: true }]] },
      { id: 'in', label: 'In:', hint: 'Filter by folder', value: !['recents', 'folders', 'trash'].includes(place) && folderOf(place).name,
        groups: [[{ id: 'recents', name: 'Recents' }, ...listFolders()].map((d) => ({ label: d.name, check: place === d.id, run: () => setPlace(d.id) }))] },
    ],
  }
  /* the rail's places that take dragged files: Drafts moves them there, Trash trashes them */
  const DROPS = { drafts: (list) => moveAll(list, DRAFTS.id), trash: trashAll }
  return (
    <CatalogPage variant="kolbox"
      sidebar={!railHidden && (
        <HomeRail
          account={{ name: user?.name || user?.email || 'Not signed in', initial: (user?.name || user?.email)?.[0] }}
          accountMenu={accountMenu}
          starred={starred}
          search={query}
          onSearch={setQuery}
          recent={recent}
          items={PLACES.map((p) => ({ ...p, selected: p.id === place, onClick: () => setPlace(p.id), onDrop: DROPS[p.id] }))}
        />
      )}
    >
      <BrowserTopBar
        crumbs={[title]}
        actions={(
          <>
            <span ref={createRef} className="flex">
              <Button variant="kolbox" tone="primary" iconLeft="plus" aria-haspopup="menu" aria-expanded={createOpen} onClick={() => setCreateOpen((o) => !o)} className="h-8!">Create<Icon name="chevron-down" size={12} /></Button>
            </span>
            <Menu variant="kolbox" aria-label="Create" anchor={createRef} open={createOpen} onClose={() => setCreateOpen(false)} onSelect={(r) => r.run?.()}
              groups={[[{ label: 'New file', icon: 'plus', run: create }, { label: 'Open file…', icon: 'upload', run: openPortable }]]} />
            <Button variant="kolbox" tone="outline" className="h-8!" onClick={() => navigator.clipboard?.writeText(location.href)}>Share</Button>
            <span ref={adjustRef} className="flex">
              <Tooltip variant="kolbox" label="View options"><Button variant="kolbox" tone="outline" aria-label="View options" aria-haspopup="menu" aria-expanded={adjustOpen} onClick={() => setAdjustOpen((o) => !o)} className="size-8! px-0!"><Icon name="nav-settings-vertical" size={20} /></Button></Tooltip>
            </span>
            <Menu variant="kolbox" aria-label="View options" anchor={adjustRef} open={adjustOpen} onClose={() => setAdjustOpen(false)} onSelect={(r) => r.run?.()}
              groups={[[{ label: 'Grid view', icon: 'grid', run: () => setView('grid') }, { label: 'List view', icon: 'list-bullet', run: () => setView('list') }], SORTS.map((s) => ({ label: s.label, run: () => setSort(s.value) }))]} />
            <Tooltip variant="kolbox" label={folder && isStarred(folder.id) ? 'Unstar' : 'Star'}><Button variant="kolbox" tone="outline" aria-label="Star" disabled={!folder} onClick={() => folder && toggleStar(folder.id)} className="size-8! px-0!"><Icon name="star-solid" size={20} className="text-accent" /></Button></Tooltip>
          </>
        )}
      />
      <SectionText variant="kolbox"
        headline={title}
        menu={folder && <Button variant="kolbox" iconOnly="chevron-down" aria-label={`${title} menu`} onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setMenu({ folder, anchor: at(r.left, r.bottom) }) }}/>}
        actions={(
          <>
            <span className="mr-1 font-mono text-meta text-muted" data-file-count>{files.length} of {pool.length}</span>
            {place !== 'folders' && tags.length > 0 && <Dropdown variant="kolbox" size="xs" ariaLabel="Tags" value={tagFilter} onChange={setTagFilter} options={[{ value: 'all', label: 'All tags' }, ...tags.map((t) => ({ value: t, label: t }))]} />}
            {place !== 'folders' && <Dropdown variant="kolbox" size="xs" ariaLabel="Type" value={type} onChange={setType} options={[{ value: 'all', label: 'All types' }, ...types.map((t) => ({ value: t, label: TYPE_LABEL[t] ?? t }))]} />}
            <Dropdown variant="kolbox" size="xs" ariaLabel="Sort" value={sort} onChange={setSort} options={SORTS} />
            <ButtonGroup layout="joined" variant="kolbox" tone="sunken" options={[
              { icon: 'grid', ariaLabel: 'Grid view', pressed: view === 'grid', onPress: () => setView('grid') },
              { icon: 'list-bullet', ariaLabel: 'List view', pressed: view === 'list', onPress: () => setView('list') },
            ]}/>
          </>
        )}
      />
      <div ref={boxRef} className="relative flex min-h-0 flex-1 flex-col [&_[data-file-card][data-selected]]:border-accent [&_[data-file-card][data-selected]]:outline-1 [&_[data-file-card][data-selected]]:outline-accent [&_[data-file-card][data-selected]]:outline-solid [&_[data-file-card][data-drop-over]]:border-accent [&_[data-file-card][data-drop-over]]:bg-accent-tint [&_[data-file-row][data-selected]]:bg-accent-tint"
        onClick={onBoxClick} onPointerDown={onBoxDown} onDragStart={onBoxDragStart} onDragOver={onBoxDragOver} onDragLeave={() => setDropOver(null)} onDrop={onBoxDrop} data-file-box>
      {view === 'grid'
        ? <CatalogGrid variant="kolbox">{files.map((f) => <ContentCard variant="kolbox" key={f.id} file={f} {...cardProps} />)}</CatalogGrid>
        : <Table variant="kolbox" rows={files} sort={sort} {...cardProps} />}
      {band?.moved && <div aria-hidden className="pointer-events-none fixed z-30 border border-accent bg-accent-tint" style={{ left: band.left, top: band.top, width: band.right - band.left, height: band.bottom - band.top }} data-select-band />}
      </div>
      {railFile && (
        <RailFile
          key={railFile.id}
          file={{ ...railFile, details: details(railFile) }}
          onClose={() => setRailId(null)}
          onRename={(name) => verbs.rename(railFile, name)}
          onTags={(t) => putExtra(railFile.id, { tags: t })}
          onNote={(n) => putExtra(railFile.id, { note: n })}
          onCover={() => verbs.cover(railFile)}
          onDownload={() => verbs.download(railFile)}
          onDuplicate={() => verbs.duplicate(railFile)}
          onRemove={() => verbs.remove(railFile)}
        />
      )}
      <Menu variant="kolbox"
        aria-label="File"
        anchor={menu?.anchor}
        open={!!menu}
        onClose={() => setMenu(null)}
        onSelect={(row) => row.run?.()}
        groups={menu?.folder ? folderRows(menu.folder) : menu?.file?.folder ? folderRows(menu.file) : menu?.file?.trashed ? [[
          /* each verb on every selected file (W3.2) */
          { label: 'Restore', icon: 'undo', run: () => { menu.files.forEach(verbs.restore); setSel(new Set()) } },
          { label: 'Permanently delete', icon: 'trash', run: () => purgeAll(menu.files) },
        ]] : menu ? [[
          ...(menu.files.length === 1 ? [{ label: 'Rename', icon: 'edit', run: () => askRename(menu.file) }] : []),
          { label: 'Duplicate', icon: 'copy', run: () => menu.files.forEach(verbs.duplicate) },
          { label: 'Move to', icon: 'folder', submenu: [
            listFolders().map((d) => ({ label: d.name, check: menu.files.every((f) => placeOf(f.id) === d.id), run: () => moveAll(menu.files.map((f) => f.id), d.id) })),
            [{ label: 'New folder…', run: async () => { const list = menu.files.map((f) => f.id); const id = await newFolder(); if (id) moveAll(list, id) } }],
          ] },
          { label: menu.files.every((f) => f.starred) ? 'Unstar' : 'Star', icon: 'star', run: () => { const all = menu.files.every((f) => f.starred); menu.files.filter((f) => all || !f.starred).forEach((f) => toggleStar(f.id)) } },
          { label: 'Delete', icon: 'trash', run: () => trashAll(menu.files.map((f) => f.id)) },
        ]] : []}
      />
      <ModalSearchHost mode="home" />
    </CatalogPage>
  )
}

export default function Home() {
  return (
    <GeneratorLibraryProvider>
      <Screen />
    </GeneratorLibraryProvider>
  )
}
