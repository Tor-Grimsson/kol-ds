/**
 * Styleguide set — brand/style-guide-origin components (apps/brand styleguide/).
 *
 * One presentation surface that gathers the components lifted out of
 * apps/brand's styleguide/ folder so they read together as a brand
 * style guide: color (swatch / ramp / spectrum / hex input), type
 * (sample + spec card), assets & layout (asset grid + feature split),
 * long-form prose, and the applied-brand block — the combination lab,
 * mood tiles, logo construction / scaling, type blocks, colour anatomy,
 * and an asset manifest. Every member is already built + published — this
 * file only imports and frames them; nothing is rehomed here.
 *
 * The applied-brand components now ship from @kolkrabbi/kol-styleguide
 * (raided out of apps/brand, 2026-07); their CSS lives in @kolkrabbi/kol-theme
 * (.kol-combo-* / .kol-anatomy-* / .kol-mood-tile-* / .kol-logo-* / …). They
 * are data-injected, so the sample marks / palettes / rows are authored here.
 */
import { useState } from 'react'
import {
  AssetGrid,
  FeatureSplit,
  ProsePreview,
  SpectrumGrid,
  ColorRamp,
  ColorSwatch,
  ColorInputRow,
} from '@kolkrabbi/kol-component'
import { TypeSample, TypeSpecCard } from '@kolkrabbi/kol-foundry'
import {
  ComboLab,
  DEFAULT_PALETTE,
  MoodTile,
  LogoCard,
  LogoScaling,
  TypeBlock,
  AssetTable,
  ColorAnatomy,
} from '@kolkrabbi/kol-styleguide'

export const meta = {
  title: 'Styleguide',
  description:
    'The brand style-guide surface — color (swatch, ramp, spectrum matrix, hex input), type (sample + spec card), assets & layout (asset grid, feature split), and a long-form prose specimen, all sourced from apps/brand styleguide origin components.',
  category: 'foundry',
  featured: false,
}
export const stage = 'full'

/* Real KOL brand hexes (packages/framework/kol-brand-color.css). The ramps
 * below read the live --kol-color-* custom properties; these literals feed the
 * standalone chips + the palette-picker refs, mirroring the same values. */
const BRAND_CHIPS = [
  { name: 'Yellow 300', hex: '#FFCF33' },
  { name: 'Red 200', hex: '#AD5038' },
  { name: 'Blue 400', hex: '#222D3D' },
  { name: 'Teal 300', hex: '#49A0A2' },
  { name: 'Cream 100', hex: '#FAF7F0' },
]

/* Pre-resolved palette entries for the ColorInputRow popover (refs mode wants
 * { value, label, hex } — no resolver seam, the values ARE the hexes here). */
const PALETTE_REFS = BRAND_CHIPS.map((c) => ({ value: c.hex, label: c.name, hex: c.hex }))

/* Hoisted so SpectrumGrid's resolve-on-mount effect keys off stable refs. */
const SPECTRUM_RAMPS = ['kol-color-yellow', 'kol-color-red', 'kol-color-blue', 'kol-color-teal']
const SPECTRUM_STOPS = [100, 200, 300, 400, 500]
const SPECTRUM_ANCHORS = [
  { ramp: 'kol-color-yellow', stop: 300 },
  { ramp: 'kol-color-red', stop: 200 },
  { ramp: 'kol-color-blue', stop: 400 },
  { ramp: 'kol-color-teal', stop: 300 },
]

/* Right Grotesk — the family @font-face'd by @kol/theme, so it exists in-repo
 * (same font the type specimen renders in). */
const FAMILY = 'Right Grotesk'
const SPECIMEN = 'Kolkrabbi — a design system with a spine'
const BODY_TEXT =
  'Body copy at reading size. The style guide gathers every brand-facing primitive on one surface so color, type, layout, and prose can be reviewed against each other rather than in isolation.'

/* Asset tiles — showcase public placeholders (served from /public/kol-images). */
const TILES = ['/kol-images/tt-01.jpg', '/kol-images/tt-02.jpg', '/kol-images/tt-03.jpg', '/kol-images/tt-04.jpg']

/* ── Applied-brand sample data ──────────────────────────────────────────
 * The @kolkrabbi/kol-styleguide components are asset-agnostic — mark, grid,
 * keyline, palettes, and rows are consumer-injected. These inline SVG nodes
 * are self-contained brand stand-ins (currentColor so the surrounding ink
 * drives their fill), all authored to one 120×40 viewBox so the grid and
 * x-height keyline align to the wordmark. */
const WORDMARK = (
  <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="KOL">
    <text x="60" y="30" textAnchor="middle" fontFamily="'Right Grotesk', sans-serif" fontWeight="700" fontSize="34" letterSpacing="1" fill="currentColor">
      KOL
    </text>
  </svg>
)

const LOGOMARK = (
  <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="KOL mark">
    <rect x="1.5" y="1.5" width="37" height="37" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <text x="20" y="28" textAnchor="middle" fontFamily="'Right Grotesk', sans-serif" fontWeight="700" fontSize="22" fill="currentColor">
      K
    </text>
  </svg>
)

const GRID = (
  <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {[0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120].map((x) => (
      <line key={`v${x}`} x1={x} y1="0" x2={x} y2="40" stroke="currentColor" strokeWidth="0.25" opacity="0.3" />
    ))}
    {[0, 8, 16, 24, 32, 40].map((y) => (
      <line key={`h${y}`} x1="0" y1={y} x2="120" y2={y} stroke="currentColor" strokeWidth="0.25" opacity="0.3" />
    ))}
  </svg>
)

const KEYLINE = (
  <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="6" y="6" width="108" height="28" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.6" />
    <line x1="0" y1="10" x2="120" y2="10" stroke="currentColor" strokeWidth="0.4" opacity="0.55" />
    <line x1="0" y1="30" x2="120" y2="30" stroke="currentColor" strokeWidth="0.4" opacity="0.55" />
  </svg>
)

/* Named palette set for ComboLab — a Palette toggle appears and Randomize
 * picks among these. Literal hex is content, mirroring the DS brand tokens. */
const COMBO_PALETTES = [
  DEFAULT_PALETTE,
  {
    id: 'teal-rise',
    label: 'Teal rise',
    description: 'Teal hero · yellow spark · navy ink on cream',
    primary: '#49A0A2',
    secondary: '#FFCF33',
    light: '#FAF7F0',
    dark: '#222D3D',
    accent: '#DF760B',
  },
]

const SCALING_VARIANTS = [
  { label: 'Logomark', node: LOGOMARK, widthMul: 1 },
  { label: 'Wordmark', node: WORDMARK, widthMul: 3 },
]

/* Preview cell node for the asset manifest. */
const AssetPreview = ({ children, bg }) => (
  <span className="inline-flex h-10 w-16 items-center justify-center rounded-[3px] border border-fg-08 text-emphasis" style={{ background: bg }}>
    {children}
  </span>
)

const ASSET_ROWS = [
  { id: 'wordmark-svg', name: 'KOL wordmark', preview: <AssetPreview>{WORDMARK}</AssetPreview>, format: 'SVG', dimensions: '120 × 40', href: '/kol-images/tt-01.jpg', filename: 'kol-wordmark.svg' },
  { id: 'logomark-svg', name: 'KOL logomark', preview: <AssetPreview bg="#222D3D">{LOGOMARK}</AssetPreview>, format: 'SVG', dimensions: '40 × 40', href: '/kol-images/tt-02.jpg', filename: 'kol-logomark.svg' },
  { id: 'wordmark-png', name: 'KOL wordmark', preview: <AssetPreview bg="#FFCF33"><span className="kol-helper-12" style={{ color: '#222D3D' }}>KOL</span></AssetPreview>, format: 'PNG @2x', dimensions: '240 × 80', onDownload: (row) => console.log('download', row.name) },
]

/* Inline section frame — a kol-* heading class over the section body, matching
 * the set convention (foundry-specimen frames each block with a header). */
function Section({ title, children }) {
  return (
    <section className="w-full py-12 lg:py-16">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
        <h2 className="kol-sans-heading-04 text-auto">{title}</h2>
        {children}
      </div>
    </section>
  )
}

export default function StyleguideSet() {
  const [fill, setFill] = useState('#FFCF33')
  const [accent, setAccent] = useState('#AD5038')

  return (
    <div className="px-6 md:px-10">
      {/* 1 — COLOR */}
      <Section title="Color">
        {/* Standalone chips */}
        <div className="flex flex-wrap gap-4">
          {BRAND_CHIPS.map((c) => (
            <div key={c.hex} className="flex flex-col items-start gap-1.5">
              <ColorSwatch hex={c.hex} size={48} radius="sm" title={`${c.name} ${c.hex}`} />
              <span className="kol-helper-10 text-meta">{c.name}</span>
            </div>
          ))}
        </div>

        {/* Live token ramps — each chip resolves --{ramp}-{stop} from the theme */}
        <div className="flex flex-col">
          <ColorRamp ramp="kol-color-yellow" anchor={300} note="Pure-yellow lock — anchor at 300." />
          <ColorRamp ramp="kol-color-red" anchor={200} note="Rust / terracotta — anchor at 200." />
          <ColorRamp ramp="kol-color-blue" anchor={400} note="Steel into deep navy — anchor at 400." />
          <ColorRamp ramp="kol-color-teal" anchor={300} note="Cool counterpoint — anchor at 300." />
        </div>

        {/* Spectrum matrix — ramps × stops */}
        <SpectrumGrid ramps={SPECTRUM_RAMPS} stops={SPECTRUM_STOPS} brandAnchors={SPECTRUM_ANCHORS} />

        {/* Hex input rows — plain + palette-ref popover */}
        <div className="flex max-w-[420px] flex-col gap-3">
          <ColorInputRow label="Fill" value={fill} onChange={setFill} />
          <ColorInputRow label="Accent" value={accent} onChange={setAccent} refs={PALETTE_REFS} />
        </div>
      </Section>

      {/* 2 — TYPE */}
      <Section title="Type">
        {/* Sample stack — one family across a weight / size ladder */}
        <div className="flex flex-col">
          <TypeSample family={FAMILY} weight={700} size={56} label="Display / Bold 700">
            {SPECIMEN}
          </TypeSample>
          <TypeSample family={FAMILY} weight={500} size={32} label="Heading / Medium 500">
            {SPECIMEN}
          </TypeSample>
          <TypeSample family={FAMILY} weight={400} size={18} label="Body / Regular 400">
            {BODY_TEXT}
          </TypeSample>
        </div>

        {/* Spec card — numeric metrics beside a live sample */}
        <TypeSpecCard
          label="Right Grotesk / Regular"
          meta={[
            ['Family', 'Right Grotesk'],
            ['Weight', '400 Regular'],
            ['Size', '24px'],
            ['Line height', '32px'],
            ['Tracking', '0'],
          ]}
        >
          <TypeSample family={FAMILY} weight={400} size={24} lineHeight={32}>
            {SPECIMEN}
          </TypeSample>
        </TypeSpecCard>
      </Section>

      {/* 3 — ASSETS & LAYOUT */}
      <Section title="Assets & layout">
        {/* Asset grid — placeholder tiles */}
        <AssetGrid cols={4} gap="gap-4">
          {TILES.map((src) => (
            <div key={src} className="aspect-[4/3] overflow-hidden rounded border border-fg-08 bg-surface-secondary">
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </AssetGrid>

        {/* Feature split — editorial media-and-text section */}
        <FeatureSplit
          kicker="Brand system"
          title={
            <>
              A design system with a <em>spine</em>
            </>
          }
          body="From the foundry up: hue ramps, accent roles, and a type scale that all trace back to one theme file, so a rebrand is a handful of token edits rather than a sweep."
          meta={[
            { num: '7', label: 'Hue ramps' },
            { num: '5', label: 'Stops each' },
            { num: '1', label: 'Source of truth' },
          ]}
          media={<img src="/kol-images/tt-05.jpg" alt="" className="h-full w-full object-cover" />}
          caption="Kolkrabbi — brand foundations"
        />
      </Section>

      {/* 4 — PROSE */}
      <Section title="Prose">
        <ProsePreview
          h1="The long-form specimen"
          paragraph="Body paragraph exercising the KOL prose stylesheet end to end — the heading ladder, lede, blockquote, indented passage, code block, pullout, and both list kinds all render from the shared prose rules with nothing styled locally."
          code={"const accent = getComputedStyle(root).getPropertyValue('--kol-accent-primary')"}
          pullout="The theme file is the single source of truth."
          quote="Above as below — justice is a starfield."
        />
      </Section>

      {/* ============================================================
          Applied brand — the real components (raided from apps/brand,
          now shipping from @kolkrabbi/kol-styleguide). Data-injected:
          the marks / palettes / rows above feed them.
          ============================================================ */}

      {/* 5 — COMBINATION LAB */}
      <Section title="Combination lab">
        <ComboLab palettes={COMBO_PALETTES} layout="applied-card" logo={WORDMARK} />
      </Section>

      {/* 6 — LOGO CONSTRUCTION & SCALING */}
      <Section title="Logo construction">
        <div className="max-w-[560px]">
          <LogoCard caption="Wordmark — clearspace & grid" aspect="2 / 1" logo={WORDMARK} grid={GRID} keyline={KEYLINE} />
        </div>
        <LogoScaling variants={SCALING_VARIANTS} steps={[96, 64, 48, 32, 24, 16, 12, 8]} />
      </Section>

      {/* 7 — MOOD */}
      <Section title="Mood">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MoodTile src="/kol-images/tt-01.jpg" alt="Plate 01" logo={WORDMARK} caption="Logo lockup over image" />
          <MoodTile src="/kol-images/tt-02.jpg" alt="Plate 02" logo={WORDMARK} caption="Cover crop — centered" />
          <MoodTile src="/kol-images/tt-03.jpg" alt="Plate 03" caption="Image only — no overlay" />
          <MoodTile src="/kol-images/tt-04.jpg" alt="Plate 04" logo={WORDMARK} overlay={false} caption="Overlay off" />
        </div>
      </Section>

      {/* 8 — TYPE BLOCKS */}
      <Section title="Type blocks">
        <div className="flex flex-col gap-8 text-auto">
          <TypeBlock text="The quick brown fox" cut="base" weight={700} size={64} lineHeight={1} />
          <TypeBlock text="The quick brown fox" cut="Wide" weight={500} size={36} tracking={0.02} lineHeight={1.1} />
          <TypeBlock text="const fox = () => jump()" cut="mono" weight={400} size={18} lineHeight={1.4} />
        </div>
      </Section>

      {/* 9 — COLOR ANATOMY */}
      <Section title="Color anatomy">
        <div className="flex flex-wrap items-start gap-10">
          <ColorAnatomy hex="#FFCF33" code="--kol-color-yellow-300" caption="Pure-yellow hero, straight from the ramp token." />
          <ColorAnatomy
            sample={<span className="h-24 w-24 rounded-[3px] border border-fg-08" style={{ background: 'color-mix(in srgb, #AD5038 60%, transparent)' }} />}
            code="color-mix(in srgb, var(--kol-color-red-200) 60%, transparent)"
            caption="Rust at 60% over the surface — a translucent accent wash."
          />
          <ColorAnatomy
            sample={<span className="h-24 w-24 rounded-[3px] border border-fg-08" style={{ background: 'color-mix(in srgb, #222D3D, #FAF7F0 16%)' }} />}
            code="color-mix(in srgb, var(--kol-color-blue-400), var(--kol-color-cream-100) 16%)"
            caption="Navy ink lifted 16% toward cream — softened body text."
          />
        </div>
      </Section>

      {/* 10 — ASSET MANIFEST */}
      <Section title="Asset manifest">
        <AssetTable rows={ASSET_ROWS} caption="KOL brand asset manifest" />
      </Section>
    </div>
  )
}
