import { useEffect, useState } from 'react'
import { AppHub } from '@kolkrabbi/kol-shell'
import { Notes, NEW_NOTE } from '@kolkrabbi/kol-notes'
import logomark from '@kolkrabbi/kol-brand/svg/favicon-01.svg?url'
import { createFixtureClient } from 'media-fixture'
import { useNotesTool } from 'media-fixture/wiring'

/* NOTES ON THE HUB (apps review 2026-09-29) — Shell + Hub + kol-notes, the same tool apps/notes shows
 * alone. It LOADS ON A BLANK NOTE: you open it and write, then decide what the note is.
 *
 *   Write   /          a blank note (NEW_NOTE) — the first Save names and files it
 *   Notes   /notes     the list · /notes/<slug> a note
 *
 * Reference for the pages and their conventions: kol-olina apps/brand (Notes · NoteEdit). No Home
 * (the mark goes to Write) and no Settings yet — both are AppHub opt-ins, and notes has none to give.
 * Routing is the hash. */

const client = createFixtureClient()
const parse = () => decodeURIComponent(location.hash.slice(1)) || '/'

const ITEMS = [
  { icon: 'edit', path: '/', label: 'Write' },
  { icon: 'layers', path: '/notes', label: 'Notes' },
]

export default function App() {
  const [path, setPath] = useState(parse)
  useEffect(() => {
    const on = () => setPath(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const navigate = (p) => { location.hash = encodeURI(p) }
  const notes = useNotesTool({ client })

  /* the path IS the open value: `/` a blank note, `/notes` the list, `/notes/<slug>` one note */
  const slug = path.match(/^\/notes\/(.+)$/)?.[1]
  const open = path === '/' ? NEW_NOTE : slug ? decodeURIComponent(slug) : null
  const onOpenChange = (s) => navigate(s === NEW_NOTE ? '/' : s ? `/notes/${encodeURIComponent(s)}` : '/notes')

  return (
    <AppHub
      app={{ name: 'Notes', logomark }}
      items={ITEMS}
      /* no Home, so `homePath` is never matched — the tool owns `/` */
      currentPath={path.startsWith('/notes') ? '/notes' : '/'}
      onNavigate={navigate}
    >
      <Notes {...notes.props} open={open} onOpenChange={onOpenChange} />
    </AppHub>
  )
}
