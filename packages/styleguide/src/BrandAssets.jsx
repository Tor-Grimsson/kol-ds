import { useState } from 'react'
import { ContentCollection, FullscreenOverlay, Table } from '@kolkrabbi/kol-component'
import PageSection from '@kolkrabbi/kol-framework/src/PageSection.jsx'
import AssetTable from './AssetTable.jsx'
import AssetCard from './AssetCard.jsx'
import { ProfileAvatar } from './SocialMocks.jsx'
import { BusinessCardBack, BusinessCardFront, EmailSignature, Envelope, Letterhead } from './StationeryMocks.jsx'
import BrandMark from './BrandMark.jsx'
import { Prose, SectionIndex } from './BrandBook.jsx'
import {
  brandSections, brandInfo, STATIONERY_MARKS, BRANDED_ASSET_ROWS, svgDims, downloadRecolored,
} from './brandBook.js'

/* taxonomy-ok: organism — the brand book's assets page: PageSection chapters over AssetTable, Table, AssetCard and the stationery / social mocks */

/* The pair the Logos table's Color column swings between. */
const INK_TOKENS = { ink: '--kol-surface-on-primary', surface: '--kol-surface-primary' }

const TokenName = ({ children }) => (
  <code className="kol-helper-12 text-emphasis">{children}</code>
)

const brandedAssetCols = [
  { accessor: 'item',   header: 'Item',   render: (r) => <TokenName>{r.item}</TokenName> },
  { accessor: 'aspect', header: 'Aspect' },
  { accessor: 'surface', header: 'Surface' },
  { accessor: 'status', header: 'Status', render: (r) => <span className="kol-helper-12 text-meta uppercase tracking-widest">{r.status}</span> },
  { accessor: 'note',   header: 'Note' },
]

/**
 * BrandAssets — The brand book's assets page. the ASSETS page of the brand tool: what you download or reproduce. Logos (the
 * mark table, with the ink toggle, zoom and recoloured download), the branded-asset register,
 * stationery, social post sizes and profile avatars.
 *
 * kol-olina's apps/brand `pages/assets/*`, carried class-for-class; the client's marks, contact
 * details, templates and avatar grounds come from the manifest (`logos`, `meta`, `stationery.marks`,
 * `social`). Sections with nothing to show are left out — see `brandSections`.
 *
 * @param {Object}   brand     a brand manifest (`@kolkrabbi/kol-brand-template` schema)
 * @param {Function} Logo      optional mark component, `<Logo variant="wordmark" />`
 * @param {Object}   logoSources  `{ [logoId]: rawSvg }` — the table's dimensions and downloads, and
 *                             the marks themselves when no `Logo` is given
 */
export default function BrandAssets({ brand, Logo, logoSources }) {
  const sections = brandSections(brand, 'assets')
  const mark = (id, props) => <BrandMark id={id} Logo={Logo} sources={logoSources} {...props} />
  const index = sections.filter((s) => s.nav)
  const marks = { ...STATIONERY_MARKS, ...(brand?.stationery?.marks ?? {}) }
  const info = brandInfo(brand)
  const [zoom, setZoom] = useState(null)

  const logoRows = (brand?.logos ?? []).map((logo) => {
    const raw = logoSources?.[logo.id]
    return {
      id:           logo.id,
      name:         logo.id.replace(/-/g, ' / '),
      preview:      mark(logo.id),
      previewWidth: logo.previewWidth ?? 48,
      path:         logo.file?.replace(/^\.\//, ''),
      format:       'SVG',
      dimensions:   svgDims(raw),
      raw,
      onDownload:   raw ? (row, ink) => downloadRecolored(row.raw, ink, `${logo.id}.svg`) : undefined,
    }
  })

  return (
    <>
      {sections.map((s) => {
        const head = { id: s.id, label: s.label, title: s.title, body: s.lede }
        switch (s.key) {
          case 'assetsOverview': return (
            <PageSection key={s.key} {...head}>
              <SectionIndex sections={index} />
            </PageSection>
          )
          case 'logos': return (
            <PageSection key={s.key} {...head}>
              <AssetTable
                caption="Logos"
                rows={logoRows}
                inkTokens={INK_TOKENS}
                onPreviewZoom={(row, ink) => setZoom({ row, ink })}
              />
              <FullscreenOverlay open={!!zoom} onClose={() => setZoom(null)}>
                {zoom && (
                  <span
                    className="inline-flex items-center p-12"
                    style={{ color: zoom.ink, width: 'min(60vw, 480px)' }}
                  >
                    {zoom.row.preview}
                  </span>
                )}
              </FullscreenOverlay>
            </PageSection>
          )
          case 'branded': return (
            <PageSection key={s.key} {...head}>
              <Table caption="Branded assets" columns={brandedAssetCols} rows={BRANDED_ASSET_ROWS} className="mt-8" />
            </PageSection>
          )
          case 'stationery': return (
            <PageSection key={s.key} {...head}>
              <div className="kol-grid mt-8">
                <div className="col-span-2"><AssetCard><BusinessCardFront mark={mark(marks.card, { className: 'max-h-[70%]' })} /></AssetCard></div>
                <div className="col-span-2"><AssetCard><Envelope mark={mark(marks.envelope)} info={info} /></AssetCard></div>
                <div className="col-span-2 flex flex-col gap-3">
                  <AssetCard><BusinessCardBack info={info} /></AssetCard>
                  <AssetCard><EmailSignature mark={mark(marks.signature)} info={info} /></AssetCard>
                </div>
                <div className="col-span-2"><AssetCard><Letterhead mark={mark(marks.letter, { style: { height: '100%', width: 'auto' } })} info={info} /></AssetCard></div>
              </div>
            </PageSection>
          )
          case 'social': return (
            <PageSection key={s.key} {...head}>
              <ContentCollection cols={3} className="mt-8 items-start">
                {brand.social.templates.map(({ caption, ratio, src }) => (
                  <AssetCard key={caption ?? src} caption={caption}>
                    <div className="relative overflow-hidden" style={{ aspectRatio: ratio }}>
                      <img src={src} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
                      <div className="absolute bottom-[6%] left-[6%] w-[42%] text-fg-inverse">
                        {mark(brand.social.mark ?? 'wordmark', { title: brand?.meta?.name })}
                      </div>
                    </div>
                  </AssetCard>
                ))}
              </ContentCollection>
            </PageSection>
          )
          case 'profile': return (
            <PageSection key={s.key} {...head}>
              <div className="kol-grid mt-8 items-start">
                {brand.social.avatars.map(({ bg, polarity }, i) => (
                  <AssetCard key={i}><ProfileAvatar mark={mark(marks.avatar, { className: 'w-1/2' })} bg={bg} polarity={polarity} /></AssetCard>
                ))}
              </div>
            </PageSection>
          )
          default: return (
            <PageSection key={s.key} {...head}>
              <Prose blocks={s.blocks} />
              <Prose blocks={s.after} />
            </PageSection>
          )
        }
      })}
    </>
  )
}
