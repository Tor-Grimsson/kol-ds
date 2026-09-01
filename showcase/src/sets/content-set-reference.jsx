import { ActionButton, ContentCard, ContentRow, SizeOrDownload } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Content Set — variant reference',
  description: 'Every ContentCard/ContentRow variant rendered live in both forms, beside the box values that produce it and the repos that render it.',
  category: 'listing',
  type: 'reference',
  status: 'active',
  updated: '2026-08-29',
  tags: ['domain/design-system', 'pattern/sets'],
}
export const stage = 'full'

/* RowVariantNamesAndSpecs §1 + §3, 2026-08-29.
 *
 * The old `content-card-comparison` set answered "how does the new component
 * differ from the shipped one it absorbs" — a question that closed when those
 * components retired. Nothing then answered "what is in the system and what is
 * each piece called", which is how `catalog` and `print` sat byte-identical as
 * rows for a month, and how nobody noticed that `/prints` does not render the
 * `print` variant at all.
 *
 * That last fact is what killed the old naming. USER RULING: variants are named
 * by WHAT THE CONTENT IS, never by the page that first needed one. Six page
 * names became four kinds.
 *
 * Nothing here is a mockup. The specimens are the real ContentCard/ContentRow
 * out of @kolkrabbi/kol-component, rendered with the chrome their consumers
 * actually pass; the FACTS tables are transcribed from the box maps in source.
 * A drift between this page and the components is a real defect, not a stale doc. */

const IMGS = ['01', '02', '03', '04', '05', '06'].map((n) => `/kol-images/tt-${n}.jpg`)
const Shot = ({ i = 0 }) => <img src={IMGS[i % IMGS.length]} alt="" />

/* THE FOUR KINDS. `showcase` appears twice because one kind carries two
 * shapes — the drawer and the full-overlay specimen — split by `layout`,
 * not by a second variant name. */
const VARIANTS = [
  { key: 'file', variant: 'file', label: 'file' },
  { key: 'catalog', variant: 'catalog', label: 'catalog' },
  { key: 'article', variant: 'article', label: 'article' },
  { key: 'showcase', variant: 'showcase', label: 'showcase' },
  { key: 'showcaseCanvas', variant: 'showcase', layout: 'canvas', label: 'showcase layout="canvas"' },
]

const RENAMES = [
  ['default', 'file', 'named after being the fallback — that described its position in the map, not its content'],
  ['print', 'catalog', '/prints renders work rows and a plateless catalog card; flip + fade became props'],
  ['work', 'showcase', '/work is a location. A work is a piece being shown'],
  ['typeface', 'showcase layout="canvas"', 'same card, full overlay instead of a drawer'],
]

const TEXT = {
  file: { title: 'kolkrabbi-identity.jpg', date: '15 Aug 2026', size: '2.4 MB' },
  catalog: { title: 'EMPTY 7U', detail: 'power · perf · patch' },
  roster: { title: 'Tigran Petrosian', meta: 'Iron Tigran · 2600 · 1963' },
  article: {
    eyebrow: 'Field notes',
    title: 'Why two ways to say one thing always diverge',
    body: 'A month of adoption later, the variant names no longer predict anything.',
    date: '15 Aug 2026',
    size: '4 min',
  },
  showcase: {
    title: 'Kolkrabbi Identity',
    meta: 'Identity',
    date: '2024',
    body: 'Brand system, print and screen.',
  },
  showcaseCanvas: { title: 'Hrafn Grotesk', body: '14 styles · 2 variable axes', detail: 'Grotesque', date: '2024' },
}

/* A catalog CARD renders no plate when it is passed no text — which is exactly
 * how /prints uses it, and why folding `print` away cost that page nothing. */
const cardText = (key) => TEXT[key]

/* THE CHROME EACH KIND ACTUALLY SHIPS WITH. A bare title+date specimen made
 * `file` look like a stale copy of itself: in production (MediaLibrary, which
 * is r2b2's whole file browser) it carries a frame-corner download `control`,
 * inline controls in `actions`, and its size wrapped in SizeOrDownload.
 * Transcribed from MediaLibrary.jsx. */
const inline = (icon, label, confirmLabel) => (
  <ActionButton chrome="inline" size="sm" icon={icon} confirmIcon="check" label={label} confirmLabel={confirmLabel} onAction={() => {}} />
)
const EXTRAS = {
  file: {
    card: {
      control: <ActionButton chrome="media" icon="download" confirmIcon="check" label="Download" confirmLabel="Downloaded" onAction={() => {}} />,
      actions: <div className="flex h-full flex-col items-center justify-between">{inline('copy', 'Copy URL', 'Copied')}</div>,
      size: <SizeOrDownload href="#">2.4 MB</SizeOrDownload>,
    },
    row: {
      actions: (
        <div className="flex items-center gap-2">
          {inline('copy', 'Copy URL', 'Copied')}
          {inline('download', 'Download', 'Downloaded')}
        </div>
      ),
    },
  },
}
const extras = (key, form) => EXTRAS[key]?.[form] ?? {}

/* HOVER only fires on an INTERACTIVE root — both components gate every hover
 * class behind `href || onClick`. A specimen with neither is inert, which is
 * the other half of why this page read as a dead copy. */
const noop = () => {}

const Alphabet = () => (
  <div className="kol-sans-display-03 text-emphasis w-full truncate uppercase">
    ABCDEFGHIJKLMNOPQRSTUVWXYZ
  </div>
)

/* Box values, transcribed from ContentCard.jsx and ContentRow.jsx. */
const FACTS = {
  file: {
    card: [['Ratio', '1 / 1'], ['Layout', 'stack'], ['Frame', 'none'], ['Surface', 'fg-02'], ['Hover', 'oq-04']],
    row: [['Thumb', '48px square'], ['Frame', 'none — ruled divider'], ['Height', 'content'], ['Hover', 'none — ruled off 2026-08-29']],
  },
  catalog: {
    card: [['Ratio', '1 / 1.41421 (A4)'], ['Layout', 'fill-card'], ['Frame', 'transparent → fg-04 on hover'], ['Surface', 'fg-04'], ['Plate', 'top — omitted when no text is passed'], ['Props', 'flip · fade (was the print variant)']],
    row: [['Thumb', 'none'], ['Frame', 'fg-04'], ['Height', '36px'], ['Surface', 'surface-tertiary'], ['Hover', 'oq-04']],
  },
  article: {
    card: [['Ratio', '16 / 9'], ['Layout', 'stack'], ['Frame', 'opt-in via `frame`'], ['Surface', 'none'], ['Extra', 'zoom · `hero` form']],
    row: [['Thumb', '120px square, fg-12 tint'], ['Frame', 'none'], ['Height', 'content'], ['Hover', 'oq-02']],
  },
  showcase: {
    card: [['Ratio', '3 / 4'], ['Layout', 'drawer — title rises on hover'], ['Frame', 'fg-04'], ['Surface', 'none'], ['Hover', 'the drawer itself']],
    row: [['Thumb', 'fills the row height'], ['Frame', 'transparent → fg-08 on hover'], ['Height', '168px'], ['Surface', 'surface-secondary']],
  },
  showcaseCanvas: {
    card: [['Ratio', 'none — fixed 500px'], ['Layout', 'canvas — full overlay'], ['Frame', 'fg-08'], ['Surface', 'surface-primary'], ['Hover', 'surface-inverse']],
    row: [['Thumb', 'none'], ['Frame', 'fg-08'], ['Height', '160px'], ['Layout', 'COLUMN + full-width band'], ['Band', 'via `footer`']],
  },
}

/* WHERE EACH KIND ACTUALLY RENDERS — scanned across the estate 2026-08-29, not
 * guessed. Both call shapes are listed, because naming only the direct ones
 * hides the biggest consumers: an app can render a kind WITHOUT ever typing it,
 * by using a DS organism that does. */
const USES = {
  file: [
    ['kol-r2b2', 'the whole file browser — via MediaLibrary'],
    ['kol-website', 'brand app: LibraryLocal · SlideDeckManager'],
    ['kol-component', 'MediaLibrary organism itself'],
  ],
  catalog: [
    ['kol-monitor · kol-mirror · kol-fxr', 'Home + Library — via kol-shell CatalogPage'],
    ['kol-monitor', 'CreatePage'],
    ['kol-mirror', 'LibraryPage'],
    ['kol-website', 'brand app: IconsGallery · /prints grid (was `print`)'],
  ],
  article: [['kol-website', '/stack · StackLatest']],
  showcase: [
    ['kol-website', '/work · WorkDetail · /prints list'],
    ['kol-content', 'ParallaxShelf'],
  ],
  showcaseCanvas: [['kol-foundry', 'TypefaceLibraryGridWithVariables']],
}

function FactList({ rows }) {
  return (
    <dl className="m-0 flex flex-col gap-1">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 border-b border-fg-08 pb-1">
          <dt className="kol-mono-12 text-meta shrink-0">{k}</dt>
          <dd className="kol-mono-12 text-emphasis m-0 text-right">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

function Uses({ rows }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="kol-helper-12 text-meta">In use</span>
      {rows.map(([repo, where]) => (
        <div key={repo + where} className="flex flex-wrap gap-x-3">
          <span className="kol-mono-12 text-emphasis">{repo}</span>
          <span className="kol-mono-12 text-meta">{where}</span>
        </div>
      ))}
    </div>
  )
}

function Variant({ spec, i }) {
  const { key, variant, layout, label } = spec
  const column = key === 'showcaseCanvas'
  return (
    <section className="flex flex-col gap-6 border-t border-fg-08 pt-8">
      <header className="flex flex-col gap-2">
        <h2 className="kol-sans-heading-05 text-emphasis">variant=&quot;{label}&quot;</h2>
        <Uses rows={USES[key]} />
      </header>

      <div className="flex flex-wrap items-start gap-10">
        <div className="flex shrink-0 flex-col gap-3" style={{ width: 260 }}>
          <span className="kol-helper-12 text-meta">Card</span>
          <ContentCard
            variant={variant}
            layout={layout}
            media={<Shot i={i} />}
            onClick={noop}
            {...cardText(key)}
            {...extras(key, 'card')}
          />
          <FactList rows={FACTS[key].card} />
        </div>

        <div className="flex min-w-[26rem] flex-1 flex-col gap-3">
          <span className="kol-helper-12 text-meta">Row</span>
          <ContentRow
            variant={variant}
            layout={column ? 'column' : undefined}
            media={<Shot i={i} />}
            footer={column ? <Alphabet /> : undefined}
            onClick={noop}
            {...TEXT[key]}
            {...extras(key, 'row')}
          />
          <FactList rows={FACTS[key].row} />
        </div>
      </div>
    </section>
  )
}

export default function ContentSetReferenceSet() {
  return (
    <div className="flex flex-col gap-10 p-8">
      <header className="flex max-w-[52rem] flex-col gap-3">
        <h1 className="kol-sans-heading-03 text-emphasis">Content Set — variant reference</h1>
        <p className="kol-mono-14 text-body">
          Four content kinds drive both <code>ContentCard</code> and <code>ContentRow</code>.
          Every specimen is the real component out of <code>@kolkrabbi/kol-component</code>,
          rendered with the chrome its consumers pass; every value beside it is
          transcribed from the box maps in source.
        </p>
      </header>

      {/* THE RULING, on the page rather than in a changelog nobody opens. The
        * old set was named after the pages that first needed each variant, and
        * the names stopped predicting anything the moment /prints rendered
        * `work`. Kinds survive that; locations do not. */}
      <section className="flex flex-col gap-4 rounded-[var(--kol-radius-sm)] border border-fg-16 p-6">
        <header className="flex flex-col gap-1">
          <h2 className="kol-sans-heading-05 text-emphasis">Six page names → four content kinds</h2>
          <p className="kol-mono-12 text-meta">
            Ruled 2026-08-29. A variant is named for what the content <em>is</em>, never for
            the page that first needed it. Every old name still works as an alias.
          </p>
        </header>
        <dl className="m-0 flex flex-col gap-2">
          {RENAMES.map(([from, to, why]) => (
            <div key={from} className="flex flex-wrap items-baseline gap-x-3 border-b border-fg-08 pb-2">
              <dt className="kol-mono-12 text-meta w-20 shrink-0 line-through">{from}</dt>
              <dd className="kol-mono-12 text-emphasis m-0 w-52 shrink-0">→ {to}</dd>
              <span className="kol-mono-12 text-meta flex-1">{why}</span>
            </div>
          ))}
        </dl>
      </section>

      {VARIANTS.map((spec, i) => (
        <Variant key={spec.key} spec={spec} i={i} />
      ))}

      {/* ROSTER — a ROW-ONLY kind, so it is not in VARIANTS: that map renders
        * both forms, and a card here would be ContentCard silently falling back
        * to `file`'s box and the page telling a lie about a shape that does not
        * exist. kol-chess wanted no card and none was minted. */}
      <section className="flex flex-col gap-6 border-t border-fg-08 pt-8">
        <header className="flex flex-col gap-1">
          <h2 className="kol-sans-heading-05 text-emphasis">roster — the pickable row</h2>
          <p className="kol-mono-12 text-meta">
            Row only. A filled tile with no border and no divider, a <strong>fixed 56px</strong> the
            content fills rather than sets, a 40px square thumb and two truncated lines. Every other
            row in the family follows its content; a grid of pick-targets whose heights drift with
            their own copy reads as broken.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          {[
            { title: 'Tigran Petrosian', meta: 'Iron Tigran · 2600 · 1963' },
            { title: 'José Raúl Capablanca', meta: 'The Chess Machine · a meta line long enough to clip' },
            { title: 'Vera Menchik', meta: 'Menchik Club · 1927' },
          ].map((t, n) => (
            <ContentRow key={t.title} variant="roster" media={<Shot i={n} />} onClick={noop} {...t} />
          ))}
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 md:grid-cols-4">
          {[['Row', '56px FIXED'], ['Padding', '8 all round'], ['Thumb', '40px square, fg-04'], ['Gap', '8'],
            ['Title', 'kol-mono-14 / fg-96, truncated'], ['Meta', 'kol-mono-12 / fg-48, truncated'],
            ['Surface', 'surface-secondary'], ['Hover', 'fg-04']].map(([k, v]) => (
            <div key={k} className="flex flex-col">
              <dt className="kol-helper-12 uppercase text-meta">{k}</dt>
              <dd className="kol-mono-12 text-emphasis">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* `specs` — built the same day for §2 of the same ticket. A slot that
        * rides every kind is exactly what a per-variant reference would hide. */}
      <section className="flex flex-col gap-6 border-t border-fg-08 pt-8">
        <header className="flex flex-col gap-1">
          <h2 className="kol-sans-heading-05 text-emphasis">specs — the kind-independent slot</h2>
          <p className="kol-mono-12 text-meta">
            <code>specs=&#123;[&#123; label, value &#125;]&#125;</code> rides the trailing edge of every
            horizontal kind, so an extra field never needs a new variant.
          </p>
        </header>
        <div className="flex flex-col gap-4">
          <ContentRow
            variant="showcase"
            media={<Shot i={2} />}
            onClick={noop}
            {...TEXT.showcase}
            specs={[
              { label: 'Type', value: 'Identity' },
              { label: 'Year', value: '2024' },
            ]}
          />
          <ContentRow
            variant="file"
            media={<Shot i={3} />}
            onClick={noop}
            {...TEXT.file}
            specs={[
              { label: 'Format', value: 'JPEG' },
              { label: 'Colour', value: 'sRGB' },
            ]}
          />
        </div>
      </section>
    </div>
  )
}
