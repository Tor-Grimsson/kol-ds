import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PageLayout } from '@kolkrabbi/kol-framework'
import { PageHeader, Table } from '@kolkrabbi/kol-component'
import {
  Swatch, ColorAnatomy, ComboLab, TypeBlock, LogoCard, LogoScaling, AssetCard, AssetTable, MoodTile,
  BusinessCardFront, BusinessCardBack, Envelope, Letterhead, EmailSignature,
} from '@kolkrabbi/kol-styleguide'
import { VOYAGER } from 'voyager-fixture'

/* THE BRAND CATALOGUE (apps review §6c-7, 2026-09-29) — every building block a brand is made of,
 * one route each, on VOYAGER: colour options, ramps, swatches, type, clearspace, logo displays,
 * business card, stationery, the assets download table, the business-data table. What a client's
 * brand looks like WALKED THROUGH is apps/brand-hub now; this is the parts shelf that book and every
 * brand.<domain> site are built from.
 *
 * The frame is kol-framework's `PageLayout` — the brand-book layout (sidenav, drawer, TOC rail) every
 * consumer's BrandLayout.jsx copies — so the frame is proved here too. Routes are real paths under
 * the Vite base (`/apps/brand/…` built; vercel.json rewrites it). */

const { brand, logoSources, business, assets } = VOYAGER

const NAV = [
  { id: 'colour', label: 'Colour', icon: 'paint-drop', pages: [
    { to: '/colour/ramps', label: 'Ramps' },
    { to: '/colour/swatches', label: 'Swatches' },
    { to: '/colour/anchors', label: 'Anchors' },
    { to: '/colour/combinations', label: 'Combinations' },
  ] },
  { id: 'type', label: 'Type', icon: 'type', pages: [
    { to: '/type/families', label: 'Families' },
    { to: '/type/scale', label: 'Scale' },
  ] },
  { id: 'logo', label: 'Logo', icon: 'star', pages: [
    { to: '/logo/displays', label: 'Displays' },
    { to: '/logo/clearspace', label: 'Clearspace' },
    { to: '/logo/scaling', label: 'Scaling' },
  ] },
  { id: 'stationery', label: 'Stationery', icon: 'user', pages: [
    { to: '/stationery/business-card', label: 'Business card' },
    { to: '/stationery/set', label: 'Set' },
  ] },
  { id: 'assets', label: 'Assets', icon: 'download', pages: [
    { to: '/assets/downloads', label: 'Downloads' },
    { to: '/assets/imagery', label: 'Imagery' },
    { to: '/assets/business', label: 'Business data' },
  ] },
]

/* a raw SVG mark, sized by its box */
const Mark = ({ id, className = 'w-full h-full' }) => (
  <span className={`inline-flex items-center justify-center text-emphasis [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto ${className}`} dangerouslySetInnerHTML={{ __html: logoSources[id] ?? '' }} />
)

const stop = (id, n) => brand.ramps.find((r) => r.id === id).stops.find((s) => s.stop === n).value
const PALETTE = { paper: stop('cream', 50), ink: stop('burgundy', 900), accent: stop('burgundy', 500) }
const FONTS = { display: '"Right Grotesk", sans-serif', text: '"Right Grotesk", sans-serif', mono: 'var(--kol-font-family-mono)' }
const COMBO = {
  id: 'voyager', label: 'Voyager', description: 'Burgundy hero · cream ground · ink on paper',
  primary: stop('burgundy', 500), secondary: stop('cream', 50), light: stop('grey', 50), dark: stop('burgundy', 900), accent: stop('burgundy', 300),
}

function Page({ eyebrow, title, lede, children }) {
  return (
    <div className="kol-page flex flex-col gap-10">
      <PageHeader eyebrow={eyebrow} title={title} subtitle={lede} size="sm" voice="mono" />
      {children}
    </div>
  )
}
const Grid = ({ min = 220, children }) => <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(${min}px, 100%), 1fr))` }}>{children}</div>
const Rows = ({ columns, rows }) => (
  <Table width="column" columns={columns.map((c) => ({ accessor: c, header: c[0].toUpperCase() + c.slice(1) }))} rows={rows.map((r, i) => ({ id: r.id ?? i, ...r }))} />
)

/* ── colour ── */
const Ramps = () => (
  <Page eyebrow="Colour" title="Ramps" lede="Every ramp the brand carries, stop by stop — the anchor dotted.">
    {brand.ramps.map((r) => (
      <section key={r.id} className="flex flex-col gap-3">
        <h2 className="kol-doc-eyebrow">{r.label} — {r.note}</h2>
        <Grid min={96}>{r.stops.map((s) => <Swatch key={s.stop} hex={s.value} name={`${r.id}-${s.stop}`} anchor={s.stop === r.anchor} height={72} />)}</Grid>
      </section>
    ))}
  </Page>
)
const Swatches = () => (
  <Page eyebrow="Colour" title="Swatches" lede="The palette as it is used — the anchors of each ramp, large.">
    <Grid min={200}>{brand.ramps.map((r) => <Swatch key={r.id} hex={r.stops.find((s) => s.stop === r.anchor).value} name={r.label} anchor height={160} />)}</Grid>
  </Page>
)
const Anchors = () => (
  <Page eyebrow="Colour" title="Anchors" lede="The colour roles — which token each one is, and what it is for.">
    <Grid min={240}>{brand.colors.anchors.map((a) => <ColorAnatomy key={a.token} sample={a.value} hex={a.value} code={`${a.token} → ${a.resolvesTo}`} caption={a.use} />)}</Grid>
  </Page>
)
const Combinations = () => (
  <Page eyebrow="Colour" title="Combinations" lede="The combination lab over the brand's five roles.">
    <ComboLab palette={COMBO} palettes={[COMBO]} logo={<Mark id="logomark" />} />
  </Page>
)

/* ── type ── */
const Families = () => (
  <Page eyebrow="Type" title="Families" lede={brand.book.typography.lede}>
    {brand.type.families.map((f) => (
      <section key={f.token} className="flex flex-col gap-3">
        <h2 className="kol-doc-eyebrow">{f.role} — {f.cut} · {f.weights.join(' / ')}</h2>
        <TypeBlock
          text={brand.meta.name}
          cut={/Text/.test(f.cut) ? 'Text' : /Mono/.test(f.cut) ? 'mono' : 'base'}
          weight={f.weights.at(-1)}
          italic={/Playfair/.test(f.cut)}
          size={64}
          style={/Playfair/.test(f.cut) ? { fontFamily: '"Playfair", serif' } : undefined}
        />
      </section>
    ))}
  </Page>
)
const Scale = () => (
  <Page eyebrow="Type" title="Scale" lede="The type scale, largest first.">
    {brand.type.scale.map((s) => (
      <section key={s.cls} className="flex flex-col gap-2">
        <h2 className="kol-doc-eyebrow">{s.cls} — {s.family} · {s.weight} · {s.size}</h2>
        <TypeBlock
          text={s.family === 'serif' ? business.BIO.quote : 'Go further, leave less.'}
          weight={s.weight}
          italic={s.family === 'serif'}
          size={parseInt(s.size, 10)}
          lineHeight={1.15}
          style={s.family === 'serif' ? { fontFamily: '"Playfair", serif' } : undefined}
        />
      </section>
    ))}
  </Page>
)

/* ── logo ── */
const Displays = () => (
  <Page eyebrow="Logo" title="Displays" lede="Every mark the manifest names, on the ground it is drawn for.">
    <Grid min={280}>{brand.logos.map((l) => <LogoCard key={l.id} caption={`${l.name} — ${l.use}`} logo={<Mark id={l.id} />} aspect={l.id.includes('hori') || l.id === 'wordmark' ? '2 / 1' : '1 / 1'} />)}</Grid>
  </Page>
)
const Clearspace = () => (
  <Page eyebrow="Logo" title="Clearspace" lede={brand.clearspace.rule}>
    <Grid min={320}>
      {assets.DIAGRAMS.map((d) => (
        <AssetCard key={d.name} caption={d.id}>
          <img src={d.url} alt={d.id} className="w-full h-auto" />
        </AssetCard>
      ))}
    </Grid>
  </Page>
)
const Scaling = () => (
  <Page eyebrow="Logo" title="Scaling" lede="Each mark from 128px down — where it stops holding up.">
    <LogoScaling variants={[
      { label: 'Logomark', node: <Mark id="logomark" />, widthMul: 1 },
      { label: 'Vertical lockup', node: <Mark id="lockup-vert" />, widthMul: 1 },
      { label: 'Horizontal lockup', node: <Mark id="lockup-hori" />, widthMul: 2.5 },
      { label: 'Wordmark', node: <Mark id="wordmark" />, widthMul: 2.5 },
    ]} />
  </Page>
)

/* ── stationery ── */
const BusinessCard = () => (
  <Page eyebrow="Stationery" title="Business card" lede="Front and back, drawn from the brand info.">
    <Grid min={320}>
      <AssetCard caption="Front"><BusinessCardFront mark={<Mark id="logomark" />} palette={PALETTE} /></AssetCard>
      <AssetCard caption="Back"><BusinessCardBack info={business.BRAND_INFO} palette={PALETTE} fonts={FONTS} /></AssetCard>
    </Grid>
  </Page>
)
const StationerySet = () => (
  <Page eyebrow="Stationery" title="Set" lede="The printed and digital set — drawn, then the carried files.">
    <Grid min={320}>
      <AssetCard caption="Envelope"><Envelope mark={<Mark id="logomark" />} info={business.BRAND_INFO} palette={PALETTE} fonts={FONTS} /></AssetCard>
      <AssetCard caption="Letterhead"><Letterhead mark={<Mark id="wordmark" />} info={business.BRAND_INFO} palette={PALETTE} fonts={FONTS} /></AssetCard>
      <AssetCard caption="Email signature"><EmailSignature mark={<Mark id="logomark" />} info={business.BRAND_INFO} palette={PALETTE} fonts={FONTS} role={business.BRAND_INFO.identity.role} /></AssetCard>
    </Grid>
    <Grid min={280}>{assets.STATIONERY.map((f) => <AssetCard key={f.name} caption={f.id}><img src={f.url} alt={f.id} className="w-full h-auto" /></AssetCard>)}</Grid>
  </Page>
)

/* ── assets ── */
const Downloads = () => (
  <Page eyebrow="Assets" title="Downloads" lede="Every file the brand carries, with its format — download any of them.">
    {assets.ASSET_GROUPS.filter((g) => g.id !== 'mood').map((g) => (
      <section key={g.id} className="flex flex-col gap-3">
        <h2 className="kol-doc-eyebrow">{g.label} — {g.files.length}</h2>
        <AssetTable
          caption={g.label}
          rows={g.files.map((f) => ({
            id: `${g.id}/${f.name}`,
            name: f.id,
            path: `${g.id}/${f.name}`,
            format: f.rendered ? 'JPG (render)' : f.format.toUpperCase(),
            dimensions: '—',
            href: f.url,
            preview: <img src={f.url} alt="" className="max-h-10 w-auto" />,
          }))}
        />
      </section>
    ))}
  </Page>
)
const Imagery = () => (
  <Page eyebrow="Assets" title="Imagery" lede="Mood, patterns and composed graphics.">
    <Grid min={260}>{assets.MOOD.map((m) => <MoodTile key={m.name} src={m.url} alt={m.id} caption={m.id} logo={<Mark id="logomark" />} />)}</Grid>
    {Object.entries(assets.GRAPHICS).map(([c, files]) => (
      <section key={c} className="flex flex-col gap-3">
        <h2 className="kol-doc-eyebrow">{c} — {files.length}</h2>
        <Grid min={200}>{files.map((f) => <AssetCard key={f.name} caption={f.id}><img src={f.url} alt={f.id} loading="lazy" className="w-full h-auto" /></AssetCard>)}</Grid>
      </section>
    ))}
  </Page>
)
const Business = () => (
  <Page eyebrow="Assets" title="Business data" lede="Who the brand is on paper — the shape every client site carries.">
    <section className="flex flex-col gap-3">
      <h2 className="kol-doc-eyebrow">Brand info</h2>
      <Rows columns={['section', 'field', 'value']} rows={Object.entries(business.BRAND_INFO).flatMap(([section, o]) => Object.entries(o).map(([field, value]) => ({ id: `${section}.${field}`, section, field, value })))} />
    </section>
    <section className="flex flex-col gap-3">
      <h2 className="kol-doc-eyebrow">Timeline</h2>
      <Rows columns={['year', 'kind', 'title', 'org']} rows={business.TIMELINE.map((t) => ({ year: t.year ?? '—', kind: t.kind, title: t.title, org: t.org }))} />
    </section>
    <section className="flex flex-col gap-3">
      <h2 className="kol-doc-eyebrow">Companies · collaborations</h2>
      <Rows columns={['name', 'role', 'years', 'status']} rows={business.COMPANIES} />
      <Rows columns={['client', 'type', 'notes']} rows={business.COLLABORATIONS} />
    </section>
    <section className="flex flex-col gap-3">
      <h2 className="kol-doc-eyebrow">Social · vendors</h2>
      <Rows columns={['platform', 'handle', 'notes']} rows={business.SOCIAL} />
      <Rows columns={['name', 'role', 'status']} rows={business.VENDORS} />
    </section>
  </Page>
)

const ROUTES = [
  ['/colour/ramps', Ramps], ['/colour/swatches', Swatches], ['/colour/anchors', Anchors], ['/colour/combinations', Combinations],
  ['/type/families', Families], ['/type/scale', Scale],
  ['/logo/displays', Displays], ['/logo/clearspace', Clearspace], ['/logo/scaling', Scaling],
  ['/stationery/business-card', BusinessCard], ['/stationery/set', StationerySet],
  ['/assets/downloads', Downloads], ['/assets/imagery', Imagery], ['/assets/business', Business],
]

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route element={<PageLayout navTree={NAV} pageWash="var(--kol-fg-02)" />}>
          {ROUTES.map(([path, El]) => <Route key={path} path={path} element={<El />} />)}
          <Route path="*" element={<Navigate to="/colour/ramps" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

