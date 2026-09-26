import { useEffect, useState } from 'react'
import { Button, FileIcon, DocumentEditor, parseFrontmatter, formatSize, listDrafts, DRAFTS_EVENT } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { kindOf, extOf } from '@kolkrabbi/kol-component/utilities/mediaKinds'

/* THE LIBRARY — the Hub's Home, at `/library` (user, 2026-09-26: "the point of this is not to bury
 * media, the column browser is what we want loaded"). kol-shell's HubHome draws it — masthead,
 * RECENT · FAVOURITES · DRAFTS, LIST · GRID, the cards, the walkthrough — so this file only says what
 * the three sets ARE and what a click does. Smart folders were ruled out; the tag vocabulary is
 * Settings → TAGS.
 *
 * A hook, not a page: AppHub renders the page, the app hands it the props. */

const folderOf = (key) => key.slice(0, key.lastIndexOf('/') + 1)
const nameOf = (path) => path.replace(/\/$/, '').split('/').pop() || path
const ago = (iso) => {
  const m = Math.round((Date.now() - Date.parse(iso)) / 60000)
  if (m < 1) return 'now'
  if (m < 60) return `${m} min ago`
  if (m < 1440) return `${Math.round(m / 60)} h ago`
  return `${Math.round(m / 1440)} d ago`
}
const EDITABLE = new Set(['markdown', 'json', 'yaml', 'text', 'code'])
const GLYPH = { audio: 'music-note', json: 'code', code: 'code', yaml: 'code' }
/* a markdown file's frontmatter tags join its tags on save — the page does the same in Browse */
const fmTags = (key, text) => {
  if (!/\.(md|markdown)$/i.test(key)) return []
  const t = parseFrontmatter(text ?? '').tags
  return (Array.isArray(t) ? t : []).map((x) => String(x).trim().toLowerCase()).filter(Boolean)
}

export const HOME_VIEWS = [
  { value: 'recent', label: 'RECENT' },
  { value: 'favourites', label: 'FAVOURITES' },
  { value: 'drafts', label: 'DRAFTS' },
]

export function useLibrary({ client, media, navigate }) {
  const bucket = media.bucketId
  const [data, setData] = useState({ objects: [], folders: {}, recent: [] })
  const [editing, setEditing] = useState(null) // { mode: 'edit', o } | { mode: 'new' }
  const [text, setText] = useState(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let live = true
    Promise.all([client.listMedia('', { bucket }), client.folderInfo(bucket), client.recent(bucket, 24)])
      .then(([objects, folders, recent]) => live && setData({ objects, folders, recent }))
    return () => { live = false }
  }, [bucket, media.refreshKey, nonce]) // eslint-disable-line react-hooks/exhaustive-deps
  const [drafts, setDrafts] = useState(() => listDrafts(bucket))
  useEffect(() => {
    const read = () => setDrafts(listDrafts(bucket))
    read()
    window.addEventListener(DRAFTS_EVENT, read)
    return () => window.removeEventListener(DRAFTS_EVENT, read)
  }, [bucket])
  useEffect(() => {
    if (editing?.mode !== 'edit') return undefined
    let live = true
    setText(null)
    client.readText(editing.o.key, bucket).then((r) => live && setText(r.text))
    return () => { live = false }
  }, [editing]) // eslint-disable-line react-hooks/exhaustive-deps

  const byKey = new Map(data.objects.map((o) => [o.key, o]))
  /* one item shape for both sets: a file carries its object, a folder only its path */
  const fileItem = (o, extra) => ({ key: o.key, title: nameOf(o.key), o, ...extra })
  const folderItem = (path, extra) => ({ key: path, title: nameOf(path), folder: true, ...extra })

  const recent = data.recent
    .filter((e) => e.key.endsWith('/') || byKey.has(e.key))
    .map((e) => (e.key.endsWith('/')
      ? folderItem(e.key, { detail: `${e.kind} · ${ago(e.at)}` })
      : fileItem(byKey.get(e.key), { detail: `${e.kind} · ${ago(e.at)}` })))
  const favourites = [
    ...Object.entries(data.folders).filter(([, f]) => f.favourite).map(([p]) => folderItem(p, { detail: p })),
    ...data.objects.filter((o) => o.favourite).map((o) => fileItem(o, { detail: folderOf(o.key) || '/' })),
  ]

  /* an edit not saved yet — the DocumentEditor draft this browser holds, reopened where it left off */
  const draftItems = drafts.map((d) => byKey.get(d.key)).filter(Boolean).map((o) => fileItem(o, { detail: 'unsaved edits' }))

  /* an image or a video draws itself; anything else is the file as a page with its kind's glyph */
  const preview = (it) => (it.folder
    ? <Icon name="folder" size="100%" className="text-oq-48" />
    : media.props.thumbnailFor(it.o) ?? <FileIcon ext={extOf(it.o.key)} glyph={GLYPH[kindOf(it.o)]} className="w-[56%]" />)
  const open = (it) => {
    if (it.folder) return navigate(`/browse/${it.key}`)
    if (EDITABLE.has(kindOf(it.o))) return setEditing({ mode: 'edit', o: it.o })
    return navigate(`/browse/${folderOf(it.key)}`)
  }

  const done = () => { setEditing(null); setNonce((n) => n + 1); media.touched() }
  const assets = data.objects.map((o) => ({ key: o.key, name: nameOf(o.key), url: client.mediaUrl(o.key, bucket), contentType: o.contentType }))

  const editor = editing?.mode === 'edit' ? (
    <DocumentEditor name={nameOf(editing.o.key)} kind={editing.o.contentType === 'image/svg+xml' ? 'svg' : kindOf(editing.o)} text={text}
      savedAt={editing.o.uploaded ? Date.parse(editing.o.uploaded) : 0} draft={{ bucket, key: editing.o.key }} assets={assets}
      onSave={async (t) => {
        await client.writeText(editing.o.key, t, bucket)
        const typed = fmTags(editing.o.key, t)
        if (typed.length) await client.setTags(editing.o.key, [...new Set([...(editing.o.tags ?? []), ...typed])], bucket)
      }} onClose={done} />
  ) : editing?.mode === 'new' ? (
    <DocumentEditor mode="new" folder="" draft={{ bucket, key: '.new-document' }} assets={assets}
      onCreate={async ({ name, text: body }) => {
        if (byKey.has(name)) throw new Error(`${name} already exists`)
        await client.createFile(name, bucket, body)
        const typed = fmTags(name, body)
        if (typed.length) await client.setTags(name, typed, bucket)
        done()
      }}
      onClose={() => setEditing(null)} />
  ) : null

  return {
    fileCount: data.objects.length,
    home: {
      title: 'Library',
      subtitle: `${media.bucket.label} · ${data.objects.length} files`,
      views: HOME_VIEWS,
      items: (view) => (view === 'favourites' ? favourites : view === 'drafts' ? draftItems : recent),
      filtersTitle: 'All Files',
      searchKeys: ['title', 'key'],
      toCard: (it) => ({
        key: it.key,
        title: it.title,
        detail: it.detail,
        media: preview(it),
        date: it.o?.uploaded ? String(it.o.uploaded).slice(0, 10) : undefined,
        size: it.o ? formatSize(it.o.size) || undefined : undefined,
        onClick: () => open(it),
      }),
      actions: media.bucket.writable && <Button variant="grey" size="md" iconLeft="plus" onClick={() => setEditing({ mode: 'new' })}>New document</Button>,
      children: editor,
    },
  }
}
