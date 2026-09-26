import { useEffect, useState } from 'react'
import { useModal } from '@kolkrabbi/kol-component'
import NotesCatalog from './NotesCatalog.jsx'
import NoteEditor from './NoteEditor.jsx'
import { slugFor, starterBody, titleOf } from './notes.js'

/* taxonomy-ok: organism — the notes tool: NotesCatalog ⇄ NoteEditor over a consumer-injected client */

/**
 * Notes — the whole tool: the list, and a note open in the page. ONE component so every app that
 * carries notes renders the same tool (apps/notes alone, media-shell's Notes tab).
 *
 * THE CLIENT is olina's notes API, as verbs (the fixture fakes them; the real one is a Pages Function
 * over D1):
 *   listNotes()                 → [{ slug, title, preview, favourite, updated_at }]   no bodies
 *   loadNote(slug)              → { slug, title, body, favourite, updated_at }
 *   saveNote({ slug, title, body?, favourite }) → { updated_at }   upsert; `body` undefined = keep it
 *   deleteNote(slug)
 *
 * New note asks for a name (the DS modal — the app mounts `ModalProvider`), creates the row with a
 * starter body and opens it. Needs `ModalProvider` above it.
 *
 * @param {Object}  client   the verbs above
 * @param {Array}   assets   `[{ key, name, url, contentType }]` — what the editor's Attach offers
 * @param {Object}  header   PageHeader props for the list
 * @param {string}  open · onOpenChange   controlled open note slug (`null` = the list); or internal
 */
export default function Notes({ client, assets, header, open: openProp, onOpenChange }) {
  const [openState, setOpenState] = useState(null)
  const open = openProp !== undefined ? openProp : openState
  const setOpen = (slug) => { if (openProp === undefined) setOpenState(slug); onOpenChange?.(slug) }

  /* `null` IS the loading state (olina's note: one value, three states) */
  const [notes, setNotes] = useState(null)
  const [note, setNote] = useState(null)
  const [error, setError] = useState(null)
  const [reload, setReload] = useState(0)
  const refresh = () => setReload((n) => n + 1)
  const { prompt, confirm } = useModal()
  const fail = (err) => setError(err.message || String(err))

  useEffect(() => {
    let ignore = false
    client.listNotes().then((rows) => { if (!ignore) { setNotes(rows); setError(null) } }, (err) => { if (!ignore) { setNotes([]); fail(err) } })
    return () => { ignore = true }
  }, [client, reload]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) { setNote(null); return undefined }
    let ignore = false
    setNote(null)
    client.loadNote(open).then((n) => { if (!ignore) setNote(n) }, (err) => { if (!ignore) { fail(err); setOpen(null) } })
    return () => { ignore = true }
  }, [client, open]) // eslint-disable-line react-hooks/exhaustive-deps

  const create = async () => {
    const title = await prompt('Name the new note', 'Untitled note', { okLabel: 'Create' })
    if (!title) return
    const slug = slugFor(title)
    try {
      await client.saveNote({ slug, title, body: starterBody(title), favourite: false })
      refresh()
      setOpen(slug)
    } catch (err) { fail(err) }
  }
  const toggleFavourite = async (n) => {
    try { await client.saveNote({ slug: n.slug, title: n.title, body: undefined, favourite: !n.favourite }); refresh() } catch (err) { fail(err) }
  }
  const remove = async (n) => {
    if (!(await confirm(`Delete “${n.title || 'Untitled'}”?`, { okLabel: 'Delete' }))) return
    try { await client.deleteNote(n.slug); refresh() } catch (err) { fail(err) }
  }

  if (open) return (
    <NoteEditor
      note={note}
      assets={assets}
      onSave={async (body) => {
        const res = await client.saveNote({ slug: note.slug, title: titleOf(body, note.title), body, favourite: note.favourite })
        setNote((n) => ({ ...n, body, title: titleOf(body, n.title), updated_at: res?.updated_at ?? n.updated_at }))
      }}
      onClose={() => { setOpen(null); refresh() }}
    />
  )

  return (
    <>
      {error && <p className="kol-mono-12 text-fg-64 px-6 pt-4">{error}</p>}
      <NotesCatalog notes={notes} header={header} onOpen={(n) => setOpen(n.slug)} onNew={create} onFavourite={toggleFavourite} onDelete={remove} />
    </>
  )
}
