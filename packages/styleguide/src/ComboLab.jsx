import { useState } from 'react'
import { ViewToggle } from '@kolkrabbi/kol-component'
import { LAYOUT_COMPONENTS, COMBO_LAYOUTS } from './comboLayouts.jsx'
import { generatePalette } from './comboMath.js'

/**
 * ComboLab — the 60 / 30 / 10 color-combination playground.
 *
 * A layout picker + logo toggle + randomize over a role-palette
 * (primary / secondary / light / dark / accent), a live stage that renders the
 * selected layout primitive, and a hex readout. The "Applied card" layout is
 * the brand-application ("business card") mockup.
 *
 * Fully data-injected — nothing is read from an editor store:
 *   - `palette`  — the initial role-palette (defaults to the Kolkrabbi comp).
 *   - `palettes` — optional named set; when present a Palette toggle appears
 *                  and Randomize picks among them.
 *   - `pool`     — optional hex array; when present Randomize *generates* a new
 *                  palette by sampling it (see comboMath). With neither
 *                  `palettes` nor `pool`, Randomize derives a fresh palette from
 *                  the current primary (seed mode).
 *   - `logo`     — a React node dropped into the logo slots.
 *
 * Chrome (borders, type, state) is DS-owned via `.kol-combo-*` +
 * `kol-helper-*` + `text-*` utilities; the only inline values are the palette's
 * literal hex, which are content, not tokens.
 *
 * See the monorepo severance notes in lobby/ComboLab.md.
 */

/* Canonical Kolkrabbi composition. Literal hex (this is a plain module with no
   CSS-var resolver) mirroring the DS brand tokens:
   yellow-300 / red-200 / cream-100 / blue-400 / orange-300. */
export const DEFAULT_PALETTE = {
  id: 'kolkrabbi',
  label: 'Kolkrabbi',
  description: 'Yellow hero · rust secondary · navy ink on cream — the canonical composition',
  primary:   '#FFCF33',
  secondary: '#AD5038',
  light:     '#FAF7F0',
  dark:      '#222D3D',
  accent:    '#DF760B',
}

const ROLE_LABELS = ['Primary', 'Secondary', 'Light', 'Dark', 'Accent']

const toOptions = (items) => items.map((i) => ({ value: i.id, label: i.label }))
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

/* Pick a random item whose id differs from `currentId` where possible. */
const pickDifferent = (arr, currentId) => {
  const others = arr.filter((i) => i.id !== currentId)
  return others.length ? pickRandom(others) : arr[0]
}

/* [primary, secondary, light, dark, accent, bg?] → role-palette object. */
const toPalette = (colors) => ({
  id: 'generated',
  label: 'Generated',
  description: 'Generated combination',
  primary:   colors[0],
  secondary: colors[1],
  light:     colors[2],
  dark:      colors[3],
  accent:    colors[4],
  bg:        colors[5],
})

const paletteToColors = (p) => [p.primary, p.secondary, p.light, p.dark, p.accent, p.bg ?? p.light]

function Row({ label, children }) {
  return (
    <div className="kol-combo-row">
      <span className="kol-combo-row-label kol-helper-10 text-meta">{label}</span>
      <div className="kol-combo-row-controls">{children}</div>
    </div>
  )
}

function SwatchRow({ label, hex }) {
  return (
    <div className="kol-combo-swatch-row">
      <span className="kol-combo-swatch-chip" style={{ background: hex }} />
      <span className="kol-combo-swatch-label kol-helper-12 text-auto">{label}</span>
      <span className="kol-combo-swatch-hex kol-helper-12 text-meta">{hex.toUpperCase()}</span>
    </div>
  )
}

export default function ComboLab({
  palette,
  palettes,
  layout,
  layouts = COMBO_LAYOUTS,
  logo = null,
  pool,
  mode = 'random',
  className = '',
}) {
  const initialPalette = palette ?? palettes?.[0] ?? DEFAULT_PALETTE

  const [layoutId, setLayoutId] = useState(layout ?? layouts[0]?.id ?? COMBO_LAYOUTS[0].id)
  const [active, setActive]     = useState(initialPalette)
  const [logoOn, setLogoOn]     = useState(Boolean(logo))

  const LayoutComponent = LAYOUT_COMPONENTS[layoutId] ?? LAYOUT_COMPONENTS[COMBO_LAYOUTS[0].id]
  const activeLayout    = layouts.find((l) => l.id === layoutId) ?? layouts[0] ?? COMBO_LAYOUTS[0]
  const colorsKey       = paletteToColors(active).join('')

  const randomize = () => {
    setLayoutId(pickDifferent(layouts, layoutId).id)

    if (Array.isArray(palettes) && palettes.length) {
      setActive(pickDifferent(palettes, active.id))
      return
    }

    const noLocks = [false, false, false, false, false, false]
    const current = paletteToColors(active)
    const colors = Array.isArray(pool) && pool.length
      ? generatePalette(pool, mode, current, noLocks)            // pool path
      : generatePalette([], mode, current, noLocks, active.primary) // seed path
    setActive(toPalette(colors))
  }

  return (
    <div className={`kol-combo-lab ${className}`.trim()}>
      <div className="kol-combo-controls">
        <Row label="Layout">
          <ViewToggle
            viewMode={layoutId}
            onViewChange={setLayoutId}
            options={toOptions(layouts)}
          />
        </Row>

        {Array.isArray(palettes) && palettes.length > 0 && (
          <Row label="Palette">
            <ViewToggle
              viewMode={active.id}
              onViewChange={(id) => setActive(palettes.find((p) => p.id === id) ?? active)}
              options={toOptions(palettes)}
            />
          </Row>
        )}

        {logo && (
          <Row label="Logo">
            <ViewToggle
              variant="single"
              viewMode={logoOn ? 'on' : 'off'}
              onViewChange={(v) => setLogoOn(v === 'on')}
              options={[
                { value: 'off', label: 'No logo' },
                { value: 'on', label: 'Logo' },
              ]}
            />
          </Row>
        )}

        <div className="kol-combo-footer">
          <button type="button" className="kol-combo-randomize kol-helper-10" onClick={randomize}>
            ↻ Randomize
          </button>
          {active.description && (
            <span className="kol-combo-footer-desc kol-helper-10 text-meta">
              {active.description}
            </span>
          )}
        </div>
      </div>

      <div className="kol-combo-stage-wrap">
        <div key={`${layoutId}-${colorsKey}`} className="kol-combo-stage-anim">
          <LayoutComponent palette={active} logo={logoOn ? logo : null} />
        </div>
      </div>

      <div className="kol-combo-readout">
        {ROLE_LABELS.map((label) => (
          <SwatchRow key={label} label={label} hex={active[label.toLowerCase()]} />
        ))}
      </div>

      <p className="kol-combo-summary kol-helper-10 text-meta">
        <span className="text-emphasis">{activeLayout.label}</span>
        {' × '}
        <span className="text-emphasis">{active.label}</span>
        {' × '}
        <span className="text-emphasis">{logoOn ? 'Logo' : 'No logo'}</span>
      </p>
    </div>
  )
}
