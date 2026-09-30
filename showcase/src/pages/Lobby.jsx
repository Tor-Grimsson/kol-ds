import { Routes, Route, Navigate } from 'react-router-dom'
import { DocumentationReader } from '@kolkrabbi/kol-workshop'
import { buildInventory } from '@kolkrabbi/kol-workshop/engine'
import { useFrontmatter } from '../lib/frontmatter.jsx'

/**
 * Lobby (dev only) — the repo's work queue, read like the phase log (2026-09-30, the names audit:
 * *"if it represents a log, then should it not do like RECORDS and just update and archive
 * older?"*). The ledger (`lobby/INDEX.md`) is the index; the rail holds Inbox · Done · Archive as
 * chapters with their counts. It globbed `lobby/*.md` + `lobby/done/`, a layout the lobby left for
 * `inbox/` · `done/` · `archive/` — so it showed a stale queue — and padded itself against the
 * shell's own padding (the 2026-09-28 rule: the shell owns page padding).
 */
const MODULES = {
  ...import.meta.glob('../../../lobby/INDEX.md', { eager: true, query: '?raw', import: 'default' }),
  ...import.meta.glob('../../../lobby/inbox/*.md', { eager: true, query: '?raw', import: 'default' }),
  ...import.meta.glob('../../../lobby/done/*.md', { eager: true, query: '?raw', import: 'default' }),
  ...import.meta.glob('../../../lobby/archive/*.md', { eager: true, query: '?raw', import: 'default' }),
}
const INVENTORY = buildInventory(MODULES)
const LEDGER = INVENTORY.find((d) => /lobby\/INDEX\.md$/.test(d.file))

const lobbyHref = (id) => `/lobby/${id}`

/* The rail's Lobby category — one chapter per state folder, the ledger on the category's link. */
export const LOBBY_CHAPTERS = ['inbox', 'done', 'archive'].map((state) => ({
  id: `lobby-${state}`,
  label: state.charAt(0).toUpperCase() + state.slice(1),
  children: INVENTORY
    .filter((d) => d.file.includes(`/lobby/${state}/`))
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((d) => ({ id: `lobby-${d.id}`, label: d.title, path: lobbyHref(d.id) })),
})).filter((c) => c.children.length)
export const LOBBY_INDEX = LEDGER ? lobbyHref(LEDGER.id) : '/lobby'

function Reader() {
  const show = useFrontmatter('page')
  return (
    <DocumentationReader
      inventory={INVENTORY}
      modules={MODULES}
      docHref={lobbyHref}
      routes={{ docsIndex: LOBBY_INDEX, components: '/components', docFilePath: (id) => INVENTORY.find((d) => d.id === id)?.file ?? id }}
      showFrontmatter={show}
    />
  )
}

export default function Lobby() {
  return (
    <Routes>
      <Route index element={LEDGER ? <Navigate to={LOBBY_INDEX} replace /> : null} />
      <Route path=":docId" element={<Reader />} />
    </Routes>
  )
}
