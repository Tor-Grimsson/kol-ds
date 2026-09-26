import { useEffect, useState } from 'react'
import { PageShell } from '@kolkrabbi/kol-shell'
import {
  PageHeader, Button, MediaTile, FileIcon, Pill, LabeledControlSection, DocumentEditor,
  listDrafts, DRAFTS_EVENT, parseFrontmatter,
} from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { kindOf, extOf } from '@kolkrabbi/kol-component/utilities/mediaKinds'

/* HOME (plan v2, P6) — what the database beside the bucket knows, as shelves: what you touched
 * last, what you starred, the saved queries, the edits not saved yet, and the tag vocabulary.
 * Composition only: every tile is the DS `MediaTile`, every shelf a `LabeledControlSection`, the
 * editor the DS `DocumentEditor`. */

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
/* a markdown file's frontmatter tags join its tags on save — the page does the same in Browse */
const fmTags = (key, text) => {
  if (!/\.(md|markdown)$/i.test(key)) return []
  const t = parseFrontmatter(text ?? '').tags
  return (Array.isArray(t) ? t : []).map((x) => String(x).trim().toLowerCase()).filter(Boolean)
}

function Shelf({ label, children }) {
  return (
    <LabeledControlSection label={label}>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(132px,1fr))]">{children}</div>
    </LabeledControlSection>
  )
}

export default function Home({ client, media, navigate }) {
  const bucket = media.bucketId
  const [data, setData] = useState({ objects: [], folders: {}, recent: [], smart: [] })
  const [drafts, setDrafts] = useState(() => listDrafts(bucket))
  const [editing, setEditing] = useState(null) // { mode: 'edit', o } | { mode: 'new' }
  const [text, setText] = useState(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let live = true
    Promise.all([
      client.listMedia('', { bucket }), client.folderInfo(bucket), client.recent(bucket, 12), client.smartFolders(bucket),
    ]).then(([objects, folders, recent, smart]) => live && setData({ objects, folders, recent, smart }))
    return () => { live = false }
  }, [bucket, media.refreshKey, nonce]) // eslint-disable-line react-hooks/exhaustive-deps
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
  /* an image or a video draws itself; anything else is the file as a page (FileIcon) with its
   * kind's glyph — a shelf is for recognising a file, not reading it */
  const GLYPH = { audio: 'music-note', json: 'code', code: 'code', yaml: 'code' }
  const preview = (o) => media.props.thumbnailFor(o) ?? <FileIcon ext={extOf(o.key)} glyph={GLYPH[kindOf(o)]} className="w-[56%]" />
  const folderTile = (path, extra) => (
    <MediaTile key={path} name={nameOf(path)} preview={<Icon name="folder" size="100%" className="text-oq-48" />}
      onClick={() => navigate(`/browse/${path}`)} {...extra} />
  )
  const fileTile = (o, extra) => (
    <MediaTile key={o.key} name={nameOf(o.key)} preview={preview(o)}
      onClick={() => (EDITABLE.has(kindOf(o)) && extra?.edit ? setEditing({ mode: 'edit', o }) : navigate(`/browse/${folderOf(o.key)}`))} />
  )

  const recent = data.recent.filter((e) => e.key.endsWith('/') || byKey.has(e.key))
  const favFiles = data.objects.filter((o) => o.favourite)
  const favFolders = Object.entries(data.folders).filter(([, f]) => f.favourite).map(([p]) => p)
  const draftFiles = drafts.map((d) => byKey.get(d.key)).filter(Boolean)
  const tagCounts = {}
  for (const o of data.objects) for (const t of o.tags ?? []) tagCounts[t] = (tagCounts[t] ?? 0) + 1
  for (const f of Object.values(data.folders)) for (const t of f.tags ?? []) tagCounts[t] = (tagCounts[t] ?? 0) + 1
  const tags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

  const done = () => { setEditing(null); setNonce((n) => n + 1); media.touched() }
  const assets = data.objects.map((o) => ({ key: o.key, name: nameOf(o.key), url: client.mediaUrl(o.key, bucket), contentType: o.contentType }))

  return (
    <PageShell>
      <div className="flex flex-col gap-10 py-6 px-6">
        <PageHeader title="Media" subtitle={`${media.bucket.label} · ${data.objects.length} files`}
          actions={media.bucket.writable && <Button size="sm" iconLeft="plus" onClick={() => setEditing({ mode: 'new' })}>New document</Button>} />

        {recent.length > 0 && (
          <Shelf label="Recent">
            {recent.map((e) => (e.key.endsWith('/') ? folderTile(e.key) : (
              <div key={e.key} className="flex flex-col gap-1">
                {fileTile(byKey.get(e.key))}
                <span className="kol-mono-12 text-fg-48 text-center">{e.kind} · {ago(e.at)}</span>
              </div>
            )))}
          </Shelf>
        )}
        {(favFiles.length > 0 || favFolders.length > 0) && (
          <Shelf label="Favourites">
            {favFolders.map((p) => folderTile(p))}
            {favFiles.map((o) => fileTile(o))}
          </Shelf>
        )}
        {data.smart.length > 0 && (
          <Shelf label="Smart folders">
            {data.smart.map((sf) => (
              <MediaTile key={sf.id} name={sf.name} preview={<Icon name="layers" size="100%" className="text-oq-48" />}
                onClick={() => navigate(`/smart/${sf.id}`)} />
            ))}
          </Shelf>
        )}
        {draftFiles.length > 0 && (
          <Shelf label="Unsaved drafts">
            {draftFiles.map((o) => fileTile(o, { edit: true }))}
          </Shelf>
        )}
        {tags.length > 0 && (
          <LabeledControlSection label="Tags">
            <div className="flex flex-wrap gap-2">
              {tags.map(([t, n]) => <Pill key={t} size="sm">{`#${t} · ${n}`}</Pill>)}
            </div>
          </LabeledControlSection>
        )}
      </div>

      {editing?.mode === 'edit' && (
        <DocumentEditor name={nameOf(editing.o.key)} kind={editing.o.contentType === 'image/svg+xml' ? 'svg' : kindOf(editing.o)} text={text}
          savedAt={editing.o.uploaded ? Date.parse(editing.o.uploaded) : 0} draft={{ bucket, key: editing.o.key }} assets={assets}
          onSave={async (t) => {
            await client.writeText(editing.o.key, t, bucket)
            const typed = fmTags(editing.o.key, t)
            if (typed.length) await client.setTags(editing.o.key, [...new Set([...(editing.o.tags ?? []), ...typed])], bucket)
          }} onClose={done} />
      )}
      {editing?.mode === 'new' && (
        <DocumentEditor mode="new" folder="" draft={{ bucket, key: '.new-document' }} assets={assets}
          onCreate={async ({ name, text: body }) => {
            if (byKey.has(name)) throw new Error(`${name} already exists`)
            await client.createFile(name, bucket, body)
            const typed = fmTags(name, body)
            if (typed.length) await client.setTags(name, typed, bucket)
            done()
          }}
          onClose={() => setEditing(null)} />
      )}
    </PageShell>
  )
}
