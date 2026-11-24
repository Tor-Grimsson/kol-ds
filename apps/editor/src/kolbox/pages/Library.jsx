import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import { downloadBlob, formatSize, pickImage } from '../home/engine.js'
import { GeneratorLibraryProvider, removeShipped, renameShipped, subscribeShipped, useGeneratorLibrary } from '../library/engine.js'
import { CHROMES, VIEWS, libraryList } from '../library/files.js'
import LibraryFile from '../library/LibraryFile.jsx'
import { askPrompt } from '@design-editor-src/editor/kolbox/ui/ask.js'
import { askConfirm } from '@design-editor-src/editor/kolbox/ui/ask.js'
import BrowserTopBar from '../home/BrowserTopBar.jsx'
import RailFile from '../home/RailFile.jsx'
import ModalSearchHost from '@design-editor-src/editor/kolbox/search/ModalSearchHost.jsx'
import { getMediaClient } from '@design-editor-src/editor/kolbox/editor/engine.js'
import { SAMPLE_LINE } from '@design-editor-src/editor/kolbox/app/sampleMedia.js'
import { Button, ButtonGroup, Dropdown, Input, Menu, TabsRow, SectionText, Table, ContentCard } from '@kolkrabbi/kol-component'
import { CatalogGrid, CatalogPage } from '@kolkrabbi/kol-shell'

/* The Library (round 4, W10): the real Library page (apps/editor-hub pages/Library.jsx on kol-shell's CatalogPage) in
   kolbox's kit. "Library", "Everything the app ships with, by chrome.", the view strip EDITOR, LABS, RANDOMISER, MORPH;
   under it "All <Chrome>" with the filter (the Group chips and "N of M") and the search (name, group and category), the
   grid or the list. Home's file browser parts carry it: the top bar (its mark is RailSwitcher's since plan-2026-11-20 W1.1), the title row,
   the card and row with their real parts (the chrome's mark, date and size, download, cog, trash, the right-click
   Rename, Duplicate, Delete) and the FILE rail the cog opens. What it lists is library/files.js.
   A double click (the real card's click) opens the file's own page; its Open goes to the file's chrome.
   THE ADDRESS, the real `/library/<chrome>/<id>` with the path in the hash:
     #/library                  the list, on the tab last seen (Labs at first, as the real page)
     #/library/<chrome>         the list on that tab (a tab press writes it, replacing, so back never walks tabs)
     #/library/<chrome>/<id>    the file's own page (a preset's id, `square-circle`; a shipped editor or morph file's id
                                after its `ship:<chrome>:`)
   WHERE YOU WERE: the tab, the chips, the search, grid or list and the scroll are kept for the session (the real
   CatalogPage keeps its place on Back), so back from a file's page or from the chrome a file opened in lands on them. */
const kept = { tab: 'labs', groups: [], query: '', filters: false, view: 'grid', scroll: 0, fromList: false }
/* the session's tags, notes and covers of a shipped file (the engine keeps only renames and removals of those; the
   real hub holds all of these in its state) */
const extras = new Map()

const typing = (t) => t?.closest?.('input, textarea, [contenteditable]')

/* THE MEDIA TAB (plan-2026-11-20 W4.2: Media is RailSwitcher's space, the Library): the media client the host passed to
   the editor (or the sample library, which says so in one line), its buckets in a dropdown, its files as cards. It
   reads; placing a picture is the editor's media window, on the same client. */
const MEDIA = { value: 'media', label: 'MEDIA' }
function MediaView({ view }) {
  const client = getMediaClient()
  const buckets = client.buckets?.() ?? []
  const [bucket, setBucket] = useState(buckets[0]?.id)
  const [files, setFiles] = useState([])
  useEffect(() => {
    let live = true
    Promise.resolve(client.listMedia('', { bucket })).then((list) => live && setFiles((list ?? []).filter((o) => !o.key.endsWith('/'))))
    return () => { live = false }
  }, [client, bucket])
  const cards = files.map((o) => ({
    id: o.key, name: o.key.split('/').pop(), icon: (o.contentType ?? '').startsWith('video') ? 'video' : 'image',
    thumb: (o.contentType ?? '').startsWith('image') ? client.mediaUrl(o.key, bucket) : undefined,
    modified: Date.parse(o.lastModified ?? '') || undefined, created: Date.parse(o.lastModified ?? '') || undefined, size: formatSize(o.size ?? 0),
  }))
  return (
    <>
      <div className="flex h-12 shrink-0 items-center gap-2 px-8 max-md:px-4" data-library-media>
        <Dropdown variant="kolbox" ariaLabel="Bucket" value={bucket} options={buckets.map((b) => ({ value: b.id, label: b.label ?? b.id }))} onChange={setBucket} className="w-44" />
        {client.sample && <span className="truncate text-help text-muted" data-media-sample>{SAMPLE_LINE}</span>}
        <span className="ml-auto font-mono text-meta text-muted" data-file-count>{cards.length} files</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        {view === 'grid'
          ? <CatalogGrid variant="kolbox">{cards.map((f) => <ContentCard variant="kolbox" key={f.id} file={f} />)}</CatalogGrid>
          : <Table variant="kolbox" rows={cards} sort="modified" />}
      </div>
    </>
  )
}

function Screen() {
  const { addItem } = useGeneratorLibrary()
  const [, bump] = useReducer((n) => n + 1, 0)
  useEffect(() => subscribeShipped(bump), [])

  /* the address */
  const [, , seg, raw] = window.location.hash.replace(/^#/, '').split('/')
  const tab = CHROMES[seg] || seg === MEDIA.value ? seg : kept.tab
  kept.tab = tab
  const slug = raw != null ? decodeURIComponent(raw) : null

  const [s, setS] = useState(() => ({ groups: kept.groups, query: kept.query, filters: kept.filters, view: kept.view, searching: !!kept.query }))
  const set = (patch) => setS((o) => ({ ...o, ...patch }))
  useEffect(() => { Object.assign(kept, { groups: s.groups, query: s.query, filters: s.filters, view: s.view }) }, [s])
  const [railId, setRailId] = useState(null)
  const [menu, setMenu] = useState(null)
  const listRef = useRef(null)

  useEffect(() => {
    const on = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k' || typing(e.target)) return
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('kolbox:search'))
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [])

  const setTab = (t) => {
    kept.tab = t
    set({ groups: [], query: '', searching: false })
    kept.scroll = 0
    setRailId(null)
    window.history.replaceState(window.history.state, '', `#/library/${t}`)
    bump()
  }

  const all = (tab === MEDIA.value ? [] : libraryList(tab)).map((f) => {
    const x = extras.get(f.id) ?? {}
    return {
      ...f, ...x,
      /* FileCard's and FileListRow's fields */
      thumb: x.cover ?? f.cover, modified: f.date, created: f.date, size: formatSize(f.bytes),
      mark: { icon: CHROMES[f.chrome].icon, label: CHROMES[f.chrome].label },
    }
  })
  const groups = [...new Set(all.map((f) => f.group).filter(Boolean))]
  const q = s.query.trim().toLowerCase()
  const files = all.filter((f) => (!s.groups.length || s.groups.includes(f.group)) && (!q || [f.name, f.group, f.sub].some((v) => v?.toLowerCase().includes(q))))

  /* back to the list: the scroll where it was */
  useLayoutEffect(() => {
    if (slug != null) return
    const el = listRef.current?.querySelector('[data-file-grid], [data-file-list]')
    if (el) el.scrollTop = kept.scroll
  }, [slug, s.view])

  const page = (f) => { kept.fromList = true; window.location.hash = `#/library/${f.chrome}/${encodeURIComponent(f.slug)}` }
  const back = () => { if (kept.fromList) { kept.fromList = false; window.history.back() } else window.location.hash = `#/library/${tab}` }

  const putExtra = (id, patch) => { extras.set(id, { ...extras.get(id), ...patch }); bump() }
  const verbs = {
    rename: (f, name) => renameShipped(f.id, name),
    /* a copy is the user's: it lists on Home (the package's applyDuplicate: "a copy of a shipped file is the user's") */
    duplicate: (f) => addItem('preset', { ...f.spec(), name: `${f.name} copy`, thumb: f.thumb }),
    remove: async (f) => {
      const ok = await askConfirm({ title: `Delete “${f.name || 'Untitled'}”?`, action: 'Delete' })
      if (ok) removeShipped(f.id)
      return ok
    },
    download: (f) => downloadBlob(new Blob([JSON.stringify({ name: f.name, ...f.spec() }, null, 2)], { type: 'application/json' }), `${f.name}.json`),
    cover: async (f) => { const src = await pickImage(); if (src) putExtra(f.id, { cover: src }) },
  }
  const askRename = async (f) => {
    const next = await askPrompt({ title: 'Rename:', value: f.name })
    if (next != null && next.trim() && next.trim() !== f.name) verbs.rename(f, next.trim())
  }
  const at = (x, y) => ({ getBoundingClientRect: () => new DOMRect(x, y, 0, 0), contains: () => false })
  const onMenu = (f, e) => setMenu({ file: f, anchor: at(e.clientX, e.clientY) })

  const railFile = all.find((f) => f.id === railId)
  const details = (f) => [
    { label: 'Date', value: new Date(f.date).toISOString().slice(0, 10) },
    { label: 'Size', value: f.size },
    { label: 'Chrome', value: f.mark.label },
    ...f.details,
  ]

  const file = slug != null ? all.find((f) => f.slug === slug) : null
  const toggleGroup = (g) => set({ groups: s.groups.includes(g) ? s.groups.filter((x) => x !== g) : [...s.groups, g] })

  return (
    <CatalogPage variant="kolbox">
      <BrowserTopBar
        crumbs={['Library', ...(slug != null ? [file?.name ?? 'File not found'] : [])]}
      />
      {slug != null ? (
        <LibraryFile
          file={file}
          slug={slug}
          onBack={back}
          onOpen={() => file.open()}
          onDuplicate={() => verbs.duplicate(file)}
        />
      ) : (
        <>
          <SectionText variant="kolbox"
            headline="Library"
            menu={<span className="ml-3 truncate text-value text-muted max-md:ml-0 max-md:basis-full max-md:whitespace-normal">Everything the app ships with, by chrome.</span>}
            actions={<TabsRow variant="kolbox" tabs={[MEDIA, ...VIEWS]} value={tab} onChange={setTab} className="w-136 max-md:w-full" />}
          />
          {tab === MEDIA.value ? <MediaView view={s.view} /> : (<>
          <div className="flex h-12 shrink-0 items-center gap-2 px-8 max-md:px-4" data-library-filters>
            <span className="text-label text-text">{`All ${CHROMES[tab].label}`}</span>
            <span aria-hidden className="mx-2 h-4 w-px bg-border" />
            <Button variant="kolbox" iconOnly="filter" aria-label="Toggle filters" pressed={s.filters} onClick={() => set({ filters: !s.filters })}/>
            {s.searching || s.query
              ? <Input variant="kolbox" size="md" iconLeft="search" aria-label="Search" autoFocus={!s.query} value={s.query} onChange={(e) => set({ query: e.target.value })} onBlur={() => !s.query && set({ searching: false })} onKeyDown={(e) => e.key === 'Escape' && set({ query: '', searching: false })} className="w-56 max-md:w-auto max-md:min-w-0 max-md:flex-1"/>
              : <Button variant="kolbox" iconOnly="search" aria-label="Search" onClick={() => set({ searching: true })}/>}
            <span className="ml-auto font-mono text-meta text-muted" data-file-count>{s.filters && `${files.length} of ${all.length}`}</span>
            <ButtonGroup layout="joined" variant="kolbox" tone="sunken" options={[
              { icon: 'grid', ariaLabel: 'Grid view', pressed: s.view === 'grid', onPress: () => { kept.scroll = 0; set({ view: 'grid' }) } },
              { icon: 'list-bullet', ariaLabel: 'List view', pressed: s.view === 'list', onPress: () => { kept.scroll = 0; set({ view: 'list' }) } },
            ]}/>
          </div>
          {s.filters && (
            <div className="flex shrink-0 items-start gap-3 px-8 pb-3 max-md:px-4" data-library-groups>
              <span className="flex h-control shrink-0 items-center text-help text-muted">Group</span>
              <div className="flex flex-wrap gap-1">
                {groups.map((g) => {
                  const on = s.groups.includes(g)
                  return <Button variant="kolbox" key={g} pressed={on} aria-pressed={on} onClick={() => toggleGroup(g)}>{g}</Button>
                })}
              </div>
            </div>
          )}
          <div ref={listRef} className="flex min-h-0 flex-1 flex-col" onScrollCapture={(e) => { if (e.target.matches?.('[data-file-grid], [data-file-list]')) kept.scroll = e.target.scrollTop }}>
            {s.view === 'grid'
              ? <CatalogGrid variant="kolbox">{files.map((f) => <ContentCard variant="kolbox" key={f.id} file={f} onOpen={page} onDownload={verbs.download} onSettings={(x) => setRailId(x.id)} onRemove={verbs.remove} onMenu={onMenu} />)}</CatalogGrid>
              : <Table variant="kolbox" rows={files} sort="modified" onOpen={page} onSettings={(f) => setRailId(f.id)} onRemove={verbs.remove} onMenu={onMenu} />}
          </div>
          </>)}
        </>
      )}
      {railFile && slug == null && (
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
        groups={menu ? [[
          { label: 'Rename', icon: 'edit', run: () => askRename(menu.file) },
          { label: 'Duplicate', icon: 'copy', run: () => verbs.duplicate(menu.file) },
          { label: 'Delete', icon: 'trash', run: () => verbs.remove(menu.file) },
        ]] : []}
      />
      <ModalSearchHost mode="library" />
    </CatalogPage>
  )
}

export default function Library() {
  return (
    <GeneratorLibraryProvider>
      <Screen />
    </GeneratorLibraryProvider>
  )
}
