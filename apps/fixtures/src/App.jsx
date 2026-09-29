import { useEffect, useState } from 'react'
import { Dropdown, PageHeader, SegmentedToggle, Table, Tag, Tooltip } from '@kolkrabbi/kol-component'
import { PageShell } from '@kolkrabbi/kol-shell'
import * as bucket from 'media-fixture/bucket'
import { listNotes, listDecks } from 'media-fixture/library'
import { CORPUS, COMPONENTS, BLOCKS, SETS, SPACES } from 'workshop-fixture'
import { VOYAGER } from 'voyager-fixture'

/* EVERY FIXTURE, ON ONE PAGE (apps review §6c-6b, 2026-09-29) — a dropdown between them, what each
 * holds shown as data, the way apps/markdown shows an engine. A fixture has no page of its own; this
 * is where you check what an app is going to be handed before you open the app.
 *
 *   media     the imagined olina setup — a bucket, a D1 beside it, notes and decks
 *   workshop  the invented docs corpus, the component catalogue, the spaces
 *   voyager   the fake client — files, the brand manifest, the business data
 *
 * The fixture and view ride the hash (`#voyager/files`), so a reload lands where you were. */

const kb = (n) => (n == null ? '—' : n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(1)} MB`)
const Section = ({ title, children }) => (
  <section className="flex flex-col gap-3">
    <h2 className="kol-doc-eyebrow">{title}</h2>
    {children}
  </section>
)
const Rows = ({ columns, rows }) => (
  <Table width="column" columns={columns.map((c) => (typeof c === 'string' ? { accessor: c, header: c[0].toUpperCase() + c.slice(1) } : c))} rows={rows.map((r, i) => ({ id: r.id ?? i, ...r }))} />
)

/* ── media ── */
function MediaBuckets() {
  return (
    <Section title={`buckets() — ${bucket.buckets().length}`}>
      <Rows columns={['id', 'label', 'files', 'size']} rows={bucket.buckets().map((b) => {
        const files = bucket.list(b.id)
        return { id: b.id, label: b.label, files: files.length, size: kb(files.reduce((n, f) => n + (f.size ?? 0), 0)) }
      })} />
    </Section>
  )
}
function MediaFiles() {
  const [b, setB] = useState(bucket.buckets()[0].id)
  const files = bucket.list(b).filter((f) => !f.key.endsWith('/'))
  return (
    <Section title={`list('${b}') — ${files.length} files`}>
      <Dropdown className="w-56" value={b} onChange={setB} options={bucket.buckets().map((x) => ({ value: x.id, label: x.label }))} aria-label="Bucket" />
      <Rows columns={['key', 'type', 'size']} rows={files.map((f) => ({ id: f.key, key: f.key, type: f.contentType ?? '—', size: kb(f.size) }))} />
    </Section>
  )
}
function MediaLibrary() {
  return (
    <>
      <Section title={`listNotes() — ${listNotes().length}`}>
        <Rows columns={['slug', 'title']} rows={listNotes().map((n) => ({ id: n.slug, slug: n.slug, title: n.title }))} />
      </Section>
      <Section title={`listDecks() — ${listDecks().length}`}>
        <Rows columns={['slug', 'name', 'slides']} rows={listDecks().map((d) => ({ id: d.slug, slug: d.slug, name: d.name, slides: d.slides?.length ?? 0 }))} />
      </Section>
    </>
  )
}

/* ── workshop ── */
function WorkshopDocs() {
  const { inventory } = CORPUS
  return (
    <Section title={`the corpus — ${inventory.length} docs`}>
      <Rows columns={['title', 'file', 'tags']} rows={inventory.map((d) => ({ id: d.id, title: d.title, file: d.file.replace(/^\.\/docs\//, ''), tags: (d.metadata?.tags ?? []).join(' · ') || '—' }))} />
    </Section>
  )
}
function WorkshopComponents() {
  return (
    <>
      <Section title={`COMPONENTS — ${COMPONENTS.length}`}>
        <Rows columns={['name', 'category', 'fn', 'description']} rows={COMPONENTS.map((c) => ({ id: c.slug, name: c.name, category: c.category, fn: c.fn, description: c.description }))} />
      </Section>
      <Section title={`BLOCKS — ${BLOCKS.length} · SETS — ${SETS.length}`}>
        <Rows columns={['title', 'kind', 'description']} rows={[...BLOCKS.map((b) => ({ id: `b-${b.key}`, title: b.title, kind: 'block', description: b.description })), ...SETS.map((s) => ({ id: `s-${s.key}`, title: s.title, kind: 'set', description: s.description }))]} />
      </Section>
    </>
  )
}
function WorkshopSpaces() {
  return (
    <Section title={`SPACES — ${SPACES.length}`}>
      <Rows columns={['id', 'label']} rows={SPACES.map((s) => ({ id: s.id, label: s.label }))} />
    </Section>
  )
}

/* ── voyager ── */
function VoyagerFiles() {
  return VOYAGER.assets.ASSET_GROUPS.map((g) => (
    <Section key={g.id} title={`${g.label} — ${g.files.length}`}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {g.files.map((f) => (
          <figure key={f.name} className="flex flex-col gap-2">
            <div className="aspect-[4/3] overflow-hidden rounded bg-oq-04 flex items-center justify-center">
              <img src={f.url} alt={f.name} loading="lazy" className="max-h-full max-w-full object-contain" />
            </div>
            <figcaption className="kol-helper-12 text-meta flex items-center gap-2">
              {f.name}
              {f.rendered && <Tooltip label="Carried as a 1600px render — the source SVG embeds rasters over 2 MB"><span><Tag text="render" /></span></Tooltip>}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  ))
}
function VoyagerBrand() {
  const b = VOYAGER.brand
  return (
    <>
      <Section title="meta">
        <Rows columns={['field', 'value']} rows={Object.entries(b.meta).filter(([, v]) => typeof v === 'string').map(([field, value]) => ({ id: field, field, value }))} />
      </Section>
      <Section title={`ramps — ${b.ramps.length}`}>
        {b.ramps.map((r) => (
          <div key={r.id} className="flex flex-col gap-2">
            <span className="kol-helper-12 text-meta">{r.label} — anchor {r.anchor}</span>
            <div className="flex flex-wrap gap-1">
              {r.stops.map((s) => (
                <Tooltip key={s.stop} label={`${r.id}-${s.stop} · ${s.value}`}>
                  <span className="block h-10 w-10 rounded-sm" style={{ background: s.value }} />
                </Tooltip>
              ))}
            </div>
          </div>
        ))}
      </Section>
      <Section title={`logos — ${b.logos.length}`}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {b.logos.map((l) => (
            <figure key={l.id} className="flex flex-col gap-2">
              <div className="aspect-[4/3] rounded bg-oq-04 flex items-center justify-center p-6 text-emphasis [&_svg]:max-h-full [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: VOYAGER.logoSources[l.id] ?? '' }} />
              <figcaption className="kol-helper-12 text-meta">{l.id} — {l.use}</figcaption>
            </figure>
          ))}
        </div>
      </Section>
      <Section title="type.families">
        <Rows columns={['role', 'cut', 'weights']} rows={b.type.families.map((f) => ({ id: f.token, role: f.role, cut: f.cut, weights: f.weights.join(' · ') }))} />
        <p className="text-2xl italic" style={{ fontFamily: '"Playfair", serif' }}>“The best route is the one you can still walk back from.”</p>
      </Section>
    </>
  )
}
function VoyagerBusiness() {
  const b = VOYAGER.business
  return (
    <>
      <Section title="BRAND_INFO">
        <Rows columns={['section', 'field', 'value']} rows={Object.entries(b.BRAND_INFO).flatMap(([section, o]) => Object.entries(o).map(([field, value]) => ({ id: `${section}.${field}`, section, field, value })))} />
      </Section>
      <Section title={`TIMELINE — ${b.TIMELINE.length}`}>
        <Rows columns={['year', 'kind', 'title', 'org']} rows={b.TIMELINE.map((t, i) => ({ id: i, year: t.year ?? '—', kind: t.kind, title: t.title, org: t.org }))} />
      </Section>
      <Section title={`VENDORS — ${b.VENDORS.length}`}>
        <Rows columns={['name', 'role', 'status']} rows={b.VENDORS.map((v) => ({ id: v.name, name: v.name, role: v.role, status: v.status }))} />
      </Section>
      <Section title={`STACK — ${b.STACK.length}`}>
        <Rows columns={['layer', 'choice', 'status']} rows={b.STACK.map((s) => ({ id: s.layer, ...s }))} />
      </Section>
      <Section title={`LIVE_SITE_MAP — ${b.LIVE_SITE_MAP.length}`}>
        <Rows columns={['live', 'label', 'ours', 'coverage']} rows={b.LIVE_SITE_MAP.map((s) => ({ id: s.live, ...s }))} />
      </Section>
      <Section title={`OPEN_QUESTIONS — ${b.OPEN_QUESTIONS.length}`}>
        <Rows columns={['topic', 'note']} rows={b.OPEN_QUESTIONS.map((q) => ({ id: q.topic, ...q }))} />
      </Section>
    </>
  )
}

const FIXTURES = {
  media: { label: 'media-fixture', what: 'The imagined olina setup — a bucket, a D1 beside it, notes and decks.', views: { buckets: ['Buckets', MediaBuckets], files: ['Files', MediaFiles], library: ['Notes · Decks', MediaLibrary] } },
  workshop: { label: 'workshop-fixture', what: 'The invented docs corpus, the component catalogue and the spaces.', views: { docs: ['Docs', WorkshopDocs], components: ['Components', WorkshopComponents], spaces: ['Spaces', WorkshopSpaces] } },
  voyager: { label: 'voyager-fixture', what: 'VOYAGER, the fake client — its files, its brand manifest, its business data.', views: { files: ['Files', VoyagerFiles], brand: ['Brand', VoyagerBrand], business: ['Business', VoyagerBusiness] } },
}

const parse = () => {
  const [f, v] = decodeURIComponent(location.hash.slice(1)).split('/')
  const fixture = FIXTURES[f] ? f : 'media'
  const view = FIXTURES[fixture].views[v] ? v : Object.keys(FIXTURES[fixture].views)[0]
  return { fixture, view }
}

export default function App() {
  const [at, setAt] = useState(parse)
  useEffect(() => {
    const on = () => setAt(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const go = (fixture, view) => { location.hash = `${fixture}/${view ?? Object.keys(FIXTURES[fixture].views)[0]}` }
  const fx = FIXTURES[at.fixture]
  const View = fx.views[at.view][1]

  return (
    <PageShell>
      <PageHeader
        title="FIXTURES"
        subtitle={fx.what}
        actions={
          <Tooltip label="Fixture">
            <Dropdown value={at.fixture} onChange={(f) => go(f)} options={Object.entries(FIXTURES).map(([value, f]) => ({ value, label: f.label }))} aria-label="Fixture" />
          </Tooltip>
        }
      />
      <div className="flex flex-col gap-10 pb-12">
        <SegmentedToggle value={at.view} onChange={(v) => go(at.fixture, v)} options={Object.entries(fx.views).map(([value, [label]]) => ({ value, label }))} size="sm" ariaLabel="View" />
        <View />
      </div>
    </PageShell>
  )
}
