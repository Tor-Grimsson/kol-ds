import { useNavigate } from 'react-router-dom'
import { Button, Pill } from '@kolkrabbi/kol-component'
import TopBar from '../lib/TopBar.jsx'
import DemoStage from '../lib/DemoStage.jsx'
import { DEMOS } from '../lib/demos-registry.js'

/**
 * Home — the KOL design-system front door.
 *
 * shadcn-style landing: top nav (no sidebar), centered hero, and a full-bleed
 * masonry "bento wall" of live components that scales 1→5 columns and up to
 * ~1900px, mirroring shadcn's own grid. Every tile is a real @kolkrabbi
 * component from `DEMOS`, error-boundaried — the page is the proof.
 */

// Curated tile order — leads with the moat (inspector/opacity/colour controls),
// mixes short + tall cards so the masonry packs with rhythm.
const WALL = [
  'Button', 'Slider', 'Badge', 'LabeledControl', 'Input', 'SegmentedToggle',
  'Tag', 'PropertyInput', 'ToggleSwitch', 'ColorSwatch', 'Icon', 'Stepper',
  'ViewToggle', 'Pill', 'ToggleBracket', 'Textarea', 'ToggleCheckbox', 'ThemeToggle',
]

function Tile({ name }) {
  const entry = DEMOS[name]
  if (!entry) return null
  return (
    <div className="mb-4 break-inside-avoid rounded-[var(--kol-radius-md)] border border-fg-08 bg-surface-primary p-5">
      <p className="kol-helper-10 text-meta uppercase mb-4">{name}</p>
      <div className="flex justify-center">
        <DemoStage entry={entry} />
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <TopBar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="text-center px-5 pt-20 md:pt-28 pb-16">
        <div className="mb-6 flex justify-center">
          <Pill variant="subtle">Source-available · v0.1.1</Pill>
        </div>
        {/* Headline: full-width centred block → one line on desktop, wraps
            only when the viewport is narrower than the text. */}
        <h1 className="kol-prose-display">The design system for KOL tools.</h1>
        {/* Lede: max-w on the element (so `ch` is measured in its 24px font);
            centre via flex since the kol-prose-* `margin` clobbers mx-auto. */}
        <div className="flex justify-center">
          <p className="kol-prose-lede max-w-[58ch]">
            A set of source-available React components — inspectors, colour and
            transparency controls, an icon loader, and an opacity token scale.
            Installed from npm, rendered live on this page.
          </p>
        </div>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" iconRight="arrow-right" onClick={() => navigate('/components')}>
            Browse components
          </Button>
          <Button variant="outline" iconLeft="code" href="https://github.com/Tor-Grimsson/kol-ds">
            Source
          </Button>
        </div>
        <p className="kol-mono-12 text-meta mt-8">
          <span className="opacity-50">$</span> npm i @kolkrabbi/kol-component
        </p>
      </section>

      {/* ── Bento wall — full-bleed, scales 1→5 cols up to 1900px (shadcn model) ── */}
      <section className="px-5 md:px-8 pb-24">
        <p className="kol-helper-12 text-meta uppercase mb-6 text-center">
          Live components — all rendered from the packages
        </p>
        <div className="mx-auto gap-4 columns-1 md:columns-2 lg:columns-3 min-[1400px]:columns-4 min-[1900px]:columns-5 md:max-w-3xl lg:max-w-none xl:max-w-[1600px] 2xl:max-w-[1900px]">
          {WALL.map((name) => (
            <Tile key={name} name={name} />
          ))}
        </div>
      </section>
    </>
  )
}
