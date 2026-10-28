/* THE ONE BRAND RENDERER. kol-branding's guide renderer (src/template/book/BrandBook.jsx + Brand.jsx, 2026-10-24),
 * carried class-for-class for the brand guide outline (BrandGuideOutlineTwoVersions, kol-hq 2026-10-27) — and since
 * 0.11.0 what `BrandBook` and `BrandAssets` draw through too (user 2026-10-28, two contents pages for one thing: "if
 * you can't maintain it, it's too complicated"). The old book's own renderer, with its Swatch palette and KOL-type
 * chapters, is in `_tmp/2026-10-28-brand-book-one-renderer/`. Two things stay in kol-branding because a package cannot
 * carry them: the research line under each chapter (its own citations) and the router on the Contents card. */
import { useState } from 'react'
import { ColorRamp, ContentCollection, DocsToc, FullscreenOverlay, Graphic, GRAPHIC_RAW, Table } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import PageHero from '@kolkrabbi/kol-framework/src/PageHero.jsx'
import PageSection from '@kolkrabbi/kol-framework/src/PageSection.jsx'
import LogoCard from './LogoCard.jsx'
import AssetTable from './AssetTable.jsx'
import AssetCard from './AssetCard.jsx'
import BrandMark from './BrandMark.jsx'
import { BrandAvatar, PostEditorial, PostPhoto, StoryPhoto } from './SocialMocks.jsx'
import { BusinessCardBack, BusinessCardFront, EmailSignature, Envelope, Letterhead, LetterheadB } from './StationeryMocks.jsx'
import { brandInfo, STATIONERY_MARKS, BRANDED_ASSET_ROWS, scrollToAnchor, svgDims, downloadRecolored } from './brandBook.js'
import { guideSections, guideToc, stopHex, contrast } from './guideBook.js'

/* taxonomy-ok: organism — a brand guide: PageHero + one PageSection per chapter, each chapter the same anatomy, the chapters on a rail */

/**
 * BrandGuide — A brand guide. one scrolling page: the hero, then one chapter per row of the list it is handed, with the
 * chapters on a rail. Every chapter has one anatomy — eyebrow · title · lede · prose · rules · the specimen its `kind`
 * draws · spec table · do / don't · word list · closing prose — and only the specimen differs by kind. The outline is
 * `@kolkrabbi/kol-brand-template`'s `GUIDE_SECTIONS`; its blank copy is `GUIDE_TEMPLATE`.
 *
 * @param {Object}   brand        a brand manifest (`@kolkrabbi/kol-brand-template` schema; `book` carries the copy)
 * @param {Array}    sections     the chapter list (see `GUIDE_SECTIONS` for a row)
 * @param {Function} Logo         optional mark component, `<Logo variant="wordmark" />`
 * @param {Object}   logoSources  `{ [logoId]: rawSvg }` — drawn when no `Logo` is given
 * @param {Object}   structure    `{ [logoId]: { logo, grid, keyline } }` raw svgs — Lockups' clear-space toggle
 * @param {string}   className    classes on the root
 */
export default function BrandGuide({ brand, sections, Logo, logoSources, structure, className = '' }) {
  return (
    /* `xl:pr-32` — the rail is `position: fixed` on the right edge from xl up, and the pages' grids
       run to the frame's edge; the padding keeps the last column out from under it */
    <div className={`xl:pr-32 ${className}`.trim()}>
      <GuideChapters brand={brand} sections={sections} Logo={Logo} logoSources={logoSources} structure={structure} />
      <DocsToc variant="rail" toc={guideToc(brand, sections)} onNavigate={scrollToAnchor} className="hidden xl:flex" />
    </div>
  )
}

/** GuideChapters — the chapters alone, no rail: the hero, then one Chapter per row that shows for this manifest.
 *  `BrandBook` and `BrandAssets` are this over `BOOK_SECTIONS` and `ASSET_SECTIONS`; `Brand` puts the rail beside them. */
export function GuideChapters({ brand, sections, Logo, logoSources, structure }) {
  const list = guideSections(brand, sections)
  const mark = (id, props) => <BrandMark id={id} Logo={Logo} sources={logoSources} {...props} />
  const index = list.filter((s) => s.nav)
  return list.map((s) => (s.kind === 'hero'
    ? <PageHero key={s.key} id={s.id} label={s.label} title={s.title} lede={s.lede} />
    : <Chapter key={s.key} s={s} brand={brand} mark={mark} index={index} logoSources={logoSources} structure={structure} />))
}

function Chapter({ s, brand, mark, index, logoSources, structure }) {
  const Specimen = SPECIMENS[s.kind ?? 'prose']
  return (
    <PageSection id={s.id} label={s.label} title={s.title} body={s.lede}>
      <Prose blocks={s.blocks} />
      {s.rules?.length > 0 && <Rules items={s.rules} />}
      {Specimen && <Specimen s={s} brand={brand} mark={mark} index={index} logoSources={logoSources} structure={structure} />}
      {s.spec && <Spec spec={s.spec} />}
      {(s.dos?.length > 0 || s.donts?.length > 0) && <Pair left={{ title: 'Do', items: s.dos }} right={{ title: "Don't", items: s.donts }} />}
      {s.words && <Pair left={{ title: 'Words we use', items: s.words.use }} right={{ title: 'Words we avoid', items: s.words.avoid }} />}
      <Prose blocks={s.after} />
    </PageSection>
  )
}

/** Book copy → `.kol-prose`: a string is a paragraph, `{ h }` a sub-heading, `{ lead, text }` a
 *  paragraph opening on a bold lead. `head` renders inside the same block, after the copy. */
function Prose({ blocks, head, className = 'mt-12' }) {
  if (!blocks?.length && !head) return null
  return (
    <div className={`kol-prose ${className}`}>
      {(blocks ?? []).map((b, i) => {
        if (typeof b === 'string') return <p key={i}>{b}</p>
        if (b.h) return <h3 key={i}>{b.h}</h3>
        return <p key={i}><strong>{b.lead}</strong> {b.text}</p>
      })}
      {head}
    </div>
  )
}

/* The rules, as a list in the prose voice. */
function Rules({ items }) {
  return <div className="kol-prose mt-8"><ul>{items.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
}

/* Two lists side by side — do / don't, use / avoid. */
/* Two lists side by side (do / don't, words). A side with no items is left out; the titles are labels, not headings. */
function Pair({ left, right }) {
  const cols = [left, right].filter((c) => c.items?.length)
  if (!cols.length) return null
  return (
    <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 max-w-panel">
      {cols.map(({ title, items }) => (
        <div key={title} className="flex flex-col gap-3">
          <h3 className="kol-prose-label m-0">{title}</h3>
          <div className="kol-prose"><ul>{items.map((t, i) => <li key={i}>{t}</li>)}</ul></div>
        </div>
      ))}
    </div>
  )
}

/* A measured spec — columns and rows from the manifest, on the DS table. */
function Spec({ spec }) {
  const columns = spec.columns.map((h, i) => ({ accessor: `c${i}`, header: h, wrap: true }))
  const rows = spec.rows.map((r, n) => Object.fromEntries([['id', n], ...r.map((v, i) => [`c${i}`, v])]))
  return <Table variant="simple" caption={spec.caption ?? 'Specification'} columns={columns} rows={rows} className="mt-8" />
}

/* The contents: every indexed chapter as a row, its eyebrow carrying the number; grouped by `part` when the list has parts.
 * A row with `to` is a route, opened through `onNavigate` (a plain link otherwise); without one it is an in-page anchor
 * — apps/document's index reads it this way (plan-2026-10-28-document W3.3). */
export function Contents({ index, onNavigate }) {
  if (!index.length) return null
  const parts = [...new Set(index.map((s) => s.part ?? ''))]
  const go = (to) => (e) => { if (!onNavigate || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; e.preventDefault(); onNavigate(to) }
  const row = (s) => (
    <li key={s.to ?? s.id}>
      <IndexCard href={s.href ?? s.to ?? `#${s.id}`} onClick={s.onClick ?? (s.to ? go(s.to) : scrollToAnchor)} label={s.label} title={s.title ?? s.nav} meta={s.meta} />
    </li>
  )
  return (
    <div className="mt-12 flex flex-col gap-10 max-w-panel">
      {parts.map((p) => (
        <div key={p || 'all'} className="flex flex-col gap-4">
          {p && <h3 className="kol-prose-label m-0">{p}</h3>}
          <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 md:grid-cols-2">{index.filter((s) => (s.part ?? '') === p).map(row)}</ul>
        </div>
      ))}
    </div>
  )
}

/* The book's index card — the Contents row: a label, the title, one small line and the arrow (kol-branding's IndexCard,
 * the in-page anchor half). */
function IndexCard({ href, onClick, label, title, meta }) {
  return (
    <a href={href} onClick={onClick} className="kol-card kol-card-interactive flex items-center justify-between gap-4 px-4 py-3 no-underline group">
      <span className="flex min-w-0 flex-col gap-1">
        {label && <span className="kol-mono-12 text-meta uppercase">{label}</span>}
        <span className="kol-mono-14 text-emphasis">{title}</span>
        {meta && <span className="kol-mono-10 text-meta mt-1">{meta}</span>}
      </span>
      <Icon name="arrow-right" size={16} className="shrink-0 text-oq-48 group-hover:text-emphasis transition-colors" />
    </a>
  )
}

/* ── the specimens, by kind ───────────────────────────────────────────────────────────────────── */

function Marks({ s, mark }) {
  return <div className="kol-grid mt-12">{(s.marks ?? []).map((id) => <LogoCard key={id} logo={mark(id)} frame={false} />)}</div>
}

/* A raw svg string as a layer node — ClearspaceDiagram stretches the svg inside to its box. */
const Raw = ({ svg }) => <span dangerouslySetInnerHTML={{ __html: svg }} />

/* With a mark's construction (`structure[id]`) the card draws the padded diagram and offers the clear-space toggle. */
function Lockups({ s, brand, mark, structure }) {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 max-w-panel">
      {(s.marks ?? []).map((id) => {
        const st = structure?.[id]
        return (
          <LogoCard key={id} logo={st ? <Raw svg={st.logo} /> : mark(id)} grid={st && <Raw svg={st.grid} />} keyline={st && <Raw svg={st.keyline} />}
            caption={brand?.logos?.find((l) => l.id === id)?.name ?? id} className="[&_figcaption]:uppercase" />
        )
      })}
    </div>
  )
}

/* Colour — one compact ramp row per family (its name, its role, the anchor dot), then the approved pairs with their contrast. */
function Color({ s, brand }) {
  const ramps = brand?.ramps ?? []
  return (
    <>
      {/* chips at one fixed height instead of ColorRamp's squares, so a family is a strip, not a screen */}
      <div className="mt-12 max-w-panel [&_.aspect-square]:aspect-auto [&_.aspect-square]:h-14">
        {ramps.map((r) => (
          <ColorRamp key={r.id} label={r.label} note={r.note} anchor={`${r.id}-${r.anchor}`}
            colors={(r.stops ?? []).map((st) => [`${r.id}-${st.stop}`, st.value])} />
        ))}
      </div>
      {s.pairs?.length > 0 && <Pairs pairs={s.pairs} brand={brand} />}
    </>
  )
}

/* Approved text / background pairs, contrast computed from the ramps — the accessibility rule, kept where the values are. */
function Pairs({ pairs, brand }) {
  const grade = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA, large text only' : 'fails')
  const rows = pairs.map((p, i) => {
    const [t, b] = [stopHex(brand, p.text), stopHex(brand, p.bg)]
    const r = contrast(t, b)
    return { id: i, text: `${p.text}${t ? ` · ${t}` : ''}`, bg: `${p.bg}${b ? ` · ${b}` : ''}`, ratio: r ? `${r.toFixed(2)} : 1` : '—', passes: r ? grade(r) : '—', use: p.use ?? '' }
  })
  const columns = [{ accessor: 'text', header: 'Text' }, { accessor: 'bg', header: 'Background' }, { accessor: 'ratio', header: 'Contrast' }, { accessor: 'passes', header: 'WCAG 2' }, { accessor: 'use', header: 'Use', wrap: true }]
  return <Table variant="simple" caption="Approved color pairs" columns={columns} rows={rows} className="mt-8" />
}

/* Type — the brand's families, each set in its own cut. The brand's scale is copy (`spec` or `after`), not KOL's system. */
function Typography({ brand }) {
  const families = brand?.type?.families ?? []
  if (!families.length) return null
  return (
    <div className="mt-12 flex flex-col gap-6">
      {families.map((f) => (
        <div key={f.token} className="flex flex-col gap-2 border-b border-fg-08 py-3">
          <span className="kol-mono-12 text-meta uppercase tracking-wider">{f.token}</span>
          <span className="text-emphasis" style={{ fontFamily: `var(${f.token})`, fontSize: 28 }}>{f.cut}</span>
          <span className="kol-mono-12 text-subtle">{f.role}</span>
        </div>
      ))}
      {brand?.type?.note && <p className="kol-mono-14 text-meta m-0">{brand.type.note}</p>}
    </div>
  )
}

/* The pair the Logos table's Color column swings between. */
const INK_TOKENS = { ink: '--kol-surface-on-primary', surface: '--kol-surface-primary' }

/* The logo asset table — ink toggle, zoom, recoloured download. */
function LogosTable({ brand, mark, logoSources }) {
  const [zoom, setZoom] = useState(null)
  const rows = (brand?.logos ?? []).map((logo) => {
    const raw = logoSources?.[logo.id]
    return {
      id: logo.id, name: logo.id.replace(/-/g, ' / '), preview: mark(logo.id), previewWidth: logo.previewWidth ?? 48,
      path: logo.file?.replace(/^\.\//, ''), format: 'SVG', dimensions: svgDims(raw), raw,
      onDownload: raw ? (row, ink) => downloadRecolored(row.raw, ink, `${logo.id}.svg`) : undefined,
    }
  })
  return (
    <>
      <AssetTable caption="Logos" rows={rows} inkTokens={INK_TOKENS} onPreviewZoom={(row, ink) => setZoom({ row, ink })} className="mt-8" />
      <FullscreenOverlay open={!!zoom} onClose={() => setZoom(null)}>
        {zoom && <span className="inline-flex items-center p-12" style={{ color: zoom.ink, width: 'min(60vw, 480px)' }}>{zoom.row.preview}</span>}
      </FullscreenOverlay>
    </>
  )
}

const TokenName = ({ children }) => <code className="kol-helper-12 text-emphasis">{children}</code>
const brandedAssetCols = [
  { accessor: 'item', header: 'Item', render: (r) => <TokenName>{r.item}</TokenName> },
  { accessor: 'aspect', header: 'Aspect' },
  { accessor: 'surface', header: 'Surface' },
  { accessor: 'status', header: 'Status', render: (r) => <span className="kol-helper-12 text-meta uppercase tracking-widest">{r.status}</span> },
  { accessor: 'note', header: 'Note' },
]
function Branded() {
  return <Table variant="simple" caption="Branded assets" columns={brandedAssetCols} rows={BRANDED_ASSET_ROWS} className="mt-8" />
}

/* Stationery — the five mocks with the manifest's marks and contact details. */
function Stationery({ brand, mark }) {
  const marks = { ...STATIONERY_MARKS, ...(brand?.stationery?.marks ?? {}) }
  const info = brandInfo(brand)
  return (
    <div className="kol-grid mt-8">
      <div className="col-span-2"><AssetCard caption="Business card, front"><div className="aspect-[85/55]"><BusinessCardFront mark={mark(marks.card, { className: 'max-h-[70%]' })} /></div></AssetCard></div>
      <div className="col-span-2"><AssetCard caption="Envelope"><div className="aspect-[220/110]"><Envelope mark={mark(marks.envelope)} info={info} /></div></AssetCard></div>
      <div className="col-span-2 flex flex-col gap-3">
        <AssetCard caption="Business card, back"><div className="aspect-[85/55]"><BusinessCardBack info={info} /></div></AssetCard>
        <AssetCard caption="Email signature"><EmailSignature mark={mark(marks.signature)} info={info} /></AssetCard>
      </div>
      <div className="col-span-2"><AssetCard caption="Letterhead"><div className="aspect-[210/297]"><Letterhead mark={mark(marks.letter, { style: { height: '100%', width: 'auto' } })} info={info} /></div></AssetCard></div>
      {/* the second letterhead, its own row (kol-website's Stationery page): `stationery.letterheadB: true` */}
      {brand?.stationery?.letterheadB && (
        <div className="col-span-2">
          <AssetCard caption="Letterhead, A4 [B]"><LetterheadB mark={mark(marks.letter, { style: { display: 'inline-block', height: 48, width: 'auto' } })} info={info} /></AssetCard>
        </div>
      )}
    </div>
  )
}

/* the drawn social mocks a template may name instead of a photo (kol-website's Social page, 2026-10-14) */
const SOCIAL_MOCKS = { PostPhoto, PostEditorial, StoryPhoto }

/* Social — one frame per template at its ratio: a drawn mock when the row names one (`mock` — a SOCIAL_MOCKS name or a
 * node; it carries the brand's logomark itself, so no overlay; `ratio` boxes one that does not size itself), the image
 * when it has `src`, the mark on a plain ground when it has neither. */
function Social({ brand, mark }) {
  const templates = brand?.social?.templates ?? []
  const marks = { ...STATIONERY_MARKS, ...(brand?.stationery?.marks ?? {}) }
  if (!templates.length) return null
  return (
    <ContentCollection cols={3} className="mt-8 items-start">
      {templates.map(({ caption, ratio, src, mock }) => mock ? (
        <AssetCard key={caption ?? String(mock)} caption={caption}>
          {(() => {
            const Mock = typeof mock === 'string' ? SOCIAL_MOCKS[mock] : null
            const node = Mock ? <Mock mark={mark(marks.avatar)} /> : mock
            return ratio ? <div className="overflow-hidden rounded-sm" style={{ aspectRatio: ratio }}>{node}</div> : node
          })()}
        </AssetCard>
      ) : (
        <AssetCard key={caption ?? src} caption={caption}>
          <div className={`relative overflow-hidden ${src ? '' : 'bg-fg-08'}`} style={{ aspectRatio: ratio }}>
            {src && <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
            {src && <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />}
            <div className={`absolute bottom-[6%] left-[6%] w-[42%] ${src ? 'text-fg-inverse' : 'text-emphasis'}`}>
              {mark(brand.social.mark ?? 'wordmark', { title: brand?.meta?.name })}
            </div>
          </div>
        </AssetCard>
      ))}
    </ContentCollection>
  )
}

function Profile({ brand, mark }) {
  const avatars = brand?.social?.avatars ?? []
  const marks = { ...STATIONERY_MARKS, ...(brand?.stationery?.marks ?? {}) }
  if (!avatars.length) return null
  return (
    <div className="kol-grid mt-8 items-start">
      {avatars.map(({ bg, polarity }, i) => <AssetCard key={i}><BrandAvatar mark={mark(marks.avatar, { className: 'w-1/2' })} bg={bg} polarity={polarity} /></AssetCard>)}
    </div>
  )
}

/* a graphic from kol-component's set as an asset row — kol-website's graphicRows, its 80px preview */
const graphicRows = (category, names = []) => names.map((name) => {
  const raw = GRAPHIC_RAW[category]?.[name]
  return {
    id: `${category}/${name}`, name, preview: <Graphic category={category} name={name} />, previewWidth: 80,
    path: `packages/component/src/graphics/svg/${category}/${name}.svg`, format: 'SVG', dimensions: svgDims(raw), raw,
    onDownload: raw ? (row, ink) => downloadRecolored(row.raw, ink, `${name}.svg`) : undefined,
  }
})

/* Graphics · Patterns — the manifest's `graphics[category]` names on the asset table, ink toggle and recoloured download */
function Graphics({ s, brand }) {
  return <AssetTable caption={s.title} rows={graphicRows(s.category, brand?.graphics?.[s.category])} inkTokens={INK_TOKENS} className="mt-8" />
}

/* the same names as square tiles with their category / name — kol-website's GraphicCard grid */
function GraphicCards({ s, brand }) {
  return (
    <div className="kol-grid mt-8">
      {(brand?.graphics?.[s.category] ?? []).map((name) => (
        <figure key={name}>
          <div className="aspect-square flex items-center justify-center rounded-[4px] overflow-hidden bg-surface-inverse">
            <Graphic category={s.category} name={name} />
          </div>
          <figcaption className="kol-helper-12 uppercase tracking-wider text-meta mt-2">{s.category} / {name}</figcaption>
        </figure>
      ))}
    </div>
  )
}

const SPECIMENS = {
  contents: Contents,
  graphics: Graphics,
  'graphics-cards': GraphicCards,
  logo: Marks,
  lockups: Lockups,
  color: Color,
  typography: Typography,
  'logos-table': LogosTable,
  branded: Branded,
  stationery: Stationery,
  social: Social,
  profile: Profile,
}
