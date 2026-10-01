import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { DocumentationReader } from '@kolkrabbi/kol-workshop'
import { buildInventory } from '@kolkrabbi/kol-workshop/engine'
import { useFrontmatter } from '../lib/frontmatter.jsx'
import ChapterHome from '../lib/ChapterHome.jsx'

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
const LOBBY_STATES = ['inbox', 'done', 'archive']
const stateDocs = (state) => INVENTORY
  .filter((d) => d.file.includes(`/lobby/${state}/`))
  .sort((a, b) => a.title.localeCompare(b.title))
const stateLabel = (state) => state.charAt(0).toUpperCase() + state.slice(1)
export const LOBBY_CHAPTERS = LOBBY_STATES.map((state) => ({
  id: `lobby-${state}`,
  label: stateLabel(state),
  /* each state folder is a group, so it has a page (W3, 2026-09-30 — Inbox opened its first ticket) */
  path: `/lobby/state/${state}`,
  children: stateDocs(state)
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

/** A state folder's page — its home, then its tickets (W3, 2026-09-30). */
function LobbyState() {
  const { state } = useParams()
  if (!LOBBY_STATES.includes(state)) return <Navigate to={LOBBY_INDEX} replace />
  return <ChapterHome home={`lobby-${state}`} title="Tickets" noteHeader="Ticket" items={stateDocs(state).map((d) => ({ to: lobbyHref(d.id), label: d.title, note: d.metadata?.status ?? d.metadata?.state }))} />
}

export default function Lobby() {
  return (
    <Routes>
      <Route index element={LEDGER ? <Navigate to={LOBBY_INDEX} replace /> : null} />
      <Route path="state/:state" element={<LobbyState />} />
      <Route path=":docId" element={<Reader />} />
    </Routes>
  )
}
