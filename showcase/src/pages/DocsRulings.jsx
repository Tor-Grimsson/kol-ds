import DocLayout from '../lib/DocLayout.jsx'
import { Button } from '@kolkrabbi/kol-component'
import { DocHeader, DocSection } from '@kolkrabbi/kol-workshop'

/**
 * Docs · Rulings — a staging page for pending USER design rulings (2026-07-28
 * burn-down). Not in the sidebar; visit /docs/rulings directly. Each section
 * renders the candidates side by side; the user picks, the agent executes,
 * this page dies when both rulings land.
 */

const TOC = [
  { id: 'ghost', label: 'Ruling 1 — ghost resting ink' },
  { id: 'palette', label: 'Ruling 2 — chart palette' },
]

const INKS = ['48', '56', '64']

const PALETTE = [
  ['blue', '#3740D3', '#c8caf4'],
  ['teal', '#49a0a2', '#d0e8e9'],
  ['green', '#66a44c', '#d4e6cb'],
  ['yellow', '#ffe32e', '#d0d79d'],
  ['red', '#ce4646', '#f0caca'],
  ['orange', '#db8000', '#f5ddb3'],
  ['purple', '#9437FF', '#e0c8ff'],
]

export default function DocsRulings() {
  return (
    <DocLayout toc={TOC}>
      <DocHeader
        eyebrow="KOL · Rulings"
        title="Pending rulings"
        lede="Two open design calls, staged for a ten-minute eyeball. Pick; I execute; this page dies."
      />

      <DocSection
        id="ghost"
        title="Ruling 1 — ghost button resting ink"
        lede="Ghost rests at oq-48 today, flagged for AA contrast since the un-retire. Same button at three resting inks, on both surface tints — pick the darkest row that still reads quiet."
      >
        {INKS.map((ink) => (
          <div key={ink} className="flex items-center gap-6 border-b border-fg-04 pb-4">
            <span className="kol-doc-eyebrow w-20">oq-{ink}{ink === '48' ? ' · now' : ''}</span>
            <div className="flex items-center gap-3">
              <Button variant="ghost" style={{ color: `var(--kol-oq-${ink})` }}>Ghost action</Button>
              <Button variant="ghost" style={{ color: `var(--kol-oq-${ink})` }} iconLeft="copy">With icon</Button>
            </div>
            <div className="flex items-center gap-3 rounded-[var(--kol-radius-sm)] bg-fg-04 p-3">
              <Button variant="ghost" style={{ color: `var(--kol-oq-${ink})` }}>On tint</Button>
            </div>
          </div>
        ))}
      </DocSection>

      <DocSection
        id="palette"
        title="Ruling 2 — chart palette"
        lede="The categorical palette as shipped (--kol-palette-* + light variants). The green/purple hexes are raid-era provisionals. Rule per swatch: keep, retune, or kill."
      >
        <div className="flex flex-col gap-2">
          {PALETTE.map(([name, hex, light]) => (
            <div key={name} className="flex items-center gap-4 border-b border-fg-04 pb-2">
              <span className="kol-doc-eyebrow w-20">{name}</span>
              <span className="h-10 w-24 rounded-[var(--kol-radius-sm)]" style={{ background: `var(--kol-palette-${name}, ${hex})` }} />
              <span className="h-10 w-24 rounded-[var(--kol-radius-sm)] border border-fg-08" style={{ background: `var(--kol-palette-${name}-light, ${light})` }} />
              <span className="kol-doc-caption">{hex} · light {light}</span>
              {(name === 'green' || name === 'purple') && <span className="kol-card-tag">provisional</span>}
            </div>
          ))}
        </div>
      </DocSection>
    </DocLayout>
  )
}
