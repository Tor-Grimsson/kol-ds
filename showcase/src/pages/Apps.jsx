import { DocHeader } from '@kolkrabbi/kol-workshop'
import { Table } from '@kolkrabbi/kol-component'

/**
 * Apps — the door to the apps tier (docs/operations/07-apps-tier). Each app is its own Vite build
 * published into this site's output under `/apps/<name>/`, so the links are plain anchors: a full
 * page load into another app, never a client-side route inside this one. Locally the apps run on
 * their own ports (`pnpm <name>`), and these links only resolve on the deployed site.
 */

const APPS = [
  { name: 'media', what: 'The media tool alone — the column browser, rows and grid over the fixture bucket.' },
  { name: 'media-shell', what: 'Media as it ships — the tool on kol-shell’s AppHub, with Library, Notes, Decks, Brand and Settings.' },
  { name: 'shell', what: 'The Hub alone, around a placeholder tool — the reference the -shell apps are judged against.' },
  { name: 'notes', what: 'The notes tool alone — kol-notes over the fixture’s notes table.' },
  { name: 'presentation', what: 'The deck tool alone — kol-deck: edit, present, export PDF · PNG · PPTX.' },
  { name: 'brand', what: 'The brand tool alone — kol-styleguide’s Brand: the brand book and its assets over one manifest.' },
  { name: 'editor', what: 'The design editor alone — @kolkrabbi/design-editor from source, on the fixture bucket and the fake D1.' },
  { name: 'controls', what: 'The controls reference — the parametric set, the app controls and the panels built from them, with where each is still hand-built.' },
  { name: 'curves', what: 'The envelope generator alone — a value over time as an equation or an ADSR envelope, on one signal engine, with its reference.' },
  { name: 'workshop', what: 'The workshop shell alone — header, rails, palette, tag browser and reader over an invented corpus.' },
  { name: 'markdown', what: 'The markdown engine alone — a doc beside what kol-markdown reads from it: rendered, frontmatter, structure, tags, inventory.' },
  { name: 'search', run: 'search-app', what: 'The search engine alone — the query, how it was read, ranked results with their reasons, and facets.' },
]

const columns = [
  { accessor: 'name', header: 'App', render: (r) => <a href={`/apps/${r.name}/`} className="kol-link underline">{r.name}</a> },
  { accessor: 'what', header: 'What it is', className: 'kol-table-cell-meta-strong' },
  { accessor: 'run', header: 'Local', render: (r) => <code>pnpm {r.run ?? r.name}</code> },
]

export default function Apps() {
  return (
    <>
      <DocHeader
        eyebrow="Apps tier"
        title="Apps"
        lede="The tools built on the design system, each running on the fixture. A tool’s features ship in the packages; the app is where they are judged."
      />
      <Table
        width="column"
        className="mt-8"
        caption="The apps tier"
        columns={columns}
        rows={APPS.map((a) => ({ ...a, id: a.name }))}
      />
    </>
  )
}
