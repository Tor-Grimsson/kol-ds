import {
  TypefaceHero,
  VariableFontSection,
  GlyphMetricsGrid,
  FoundryCharacterSets,
  FontPreviewSection,
  SpecimenSectionHeader,
} from '@kolkrabbi/kol-foundry'
import { Table } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Type specimen',
  description:
    'The full type-specimen apparatus — hero, live weight-axis playground, parsed-metric glyph inspector, character-set browser, size ladder, and a type-scale recipe.',
  category: 'foundry',
  featured: true,
}
export const stage = 'full'

/* FONT-ASSET CONTRACT
 * -------------------
 * The specimen renders in "Right Grotesk" — the family already @font-face'd by
 * @kol/theme (weights 100–900 as discrete static faces), so it EXISTS in-repo
 * and needs no extra asset. Because it is not a true variable font, the weight
 * slider snaps between those discrete weights rather than morphing continuously
 * — swap in a variable .ttf to get a smooth axis. GlyphMetricsGrid parses REAL
 * metrics from the served static TTF at
 * /fonts/Right-Grotesk-ttf/PPRightGrotesk-Regular.ttf via opentype.js (a peer
 * dep, dynamically imported): after a central `pnpm install` the baseline /
 * x-height / cap / ascender / descender overlay draws from the font's own OS/2 +
 * hhea tables; without opentype installed the grids still render, minus the
 * overlay lines. */

const FAMILY = "'Right Grotesk', system-ui, sans-serif"
const METRICS_FONT_URL = '/fonts/Right-Grotesk-ttf/PPRightGrotesk-Regular.ttf'

const TYPEFACE = {
  id: 'Right Grotesk',
  displayName: 'Right Grotesk',
  fontFamily: FAMILY,
  fontStyle: 'normal',
  category: 'Grotesque / Display',
  description: 'A high-contrast grotesque cut for headlines that need to carry a room.',
}

const STYLE_CONFIG = {
  fontFamily: FAMILY,
  badgeText: 'Right Grotesk',
  styles: {
    hasWeight: true,
    hasWidth: false,
    hasItalic: true,
    weights: [
      { label: 'Thin', weight: 100 },
      { label: 'Light', weight: 300 },
      { label: 'Regular', weight: 400, isDefault: true },
      { label: 'Medium', weight: 500 },
      { label: 'Semibold', weight: 600 },
      { label: 'Bold', weight: 700 },
      { label: 'Black', weight: 900 },
    ],
  },
}

const PREVIEW_WEIGHTS = ['Thin', 'Light', 'Regular', 'Medium', 'Semibold', 'Bold', 'Black']

/* TypeScaleSection recipe — baked here rather than shipped as a component (per
 * the kit brief). A DS Table (simple variant) with a live Preview column that
 * renders the pangram at each stop's family/weight/size, capped at 20px so the
 * big stops stay in-row. */
const SCALE_ROWS = [
  { token: 'Display', weight: 700, size: 96, lh: '100%' },
  { token: 'H1', weight: 600, size: 64, lh: '104%' },
  { token: 'H2', weight: 600, size: 48, lh: '110%' },
  { token: 'H3', weight: 500, size: 32, lh: '116%' },
  { token: 'Body', weight: 400, size: 18, lh: '150%' },
  { token: 'Caption', weight: 400, size: 13, lh: '140%' },
]

const scaleColumns = (family) => [
  { header: 'Token', accessor: 'token', className: 'kol-table-cell-title' },
  { header: 'Weight', accessor: 'weight' },
  { header: 'Size / LH', accessor: 'sizelh', render: (r) => `${r.size} / ${r.lh}` },
  {
    header: 'Preview',
    accessor: 'preview',
    className: 'kol-table-cell-text',
    render: (r) => (
      <span
        style={{
          fontFamily: family,
          fontWeight: r.weight,
          fontSize: `${Math.min(r.size, 20)}px`,
          lineHeight: 1.2,
          whiteSpace: 'normal',
        }}
      >
        The quick brown fox
      </span>
    ),
  },
]

export default function FoundrySpecimenSet() {
  return (
    <div className="px-6 md:px-10">
      <TypefaceHero
        typeface={TYPEFACE}
        licenseNote="Free for personal and commercial use"
      />

      <VariableFontSection
        fontFamily={FAMILY}
        badgeText="Right Grotesk"
        text="Variable"
        minWeight={100}
        maxWeight={900}
      />

      {/* Glyph inspector with parsed-metric overlay */}
      <section className="w-full py-12 lg:py-16">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
          <SpecimenSectionHeader
            label="Glyph Metrics"
            size="sm"
            showDropdown={false}
            showWeightDropdown={false}
          />
          <GlyphMetricsGrid
            fontUrl={METRICS_FONT_URL}
            fontFamily={FAMILY}
            fontStyle="normal"
            initialGlyph="g"
          />
        </div>
      </section>

      <FoundryCharacterSets fontFamily={FAMILY} />

      <FontPreviewSection
        fontFamily={FAMILY}
        badgeText="Right Grotesk"
        availableWeights={PREVIEW_WEIGHTS}
        initialWeight="Regular"
      />

      {/* TypeScaleSection recipe */}
      <section className="w-full py-12 lg:py-16">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
          <SpecimenSectionHeader
            label="Type Scale"
            size="sm"
            showDropdown={false}
            showWeightDropdown={false}
          />
          <Table variant="simple" columns={scaleColumns(FAMILY)} rows={SCALE_ROWS} caption="Type scale" />
        </div>
      </section>
    </div>
  )
}
