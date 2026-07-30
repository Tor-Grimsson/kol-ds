import { useEffect, useState } from 'react'
import { Table } from '@kolkrabbi/kol-component'
import { DocHeader, DocSection } from '@kolkrabbi/kol-workshop'
import { resolveCssVar, resolveTokenThemed } from '../lib/resolve-css-var.jsx'
import { BRAND_COLORS_SECTIONS, UI_COLORS_SECTIONS } from '../data/color.js'
import RampTuner from '../lib/RampTuner.jsx'

/**
 * FoundationsColor — the KOL color token reference, ported from the brand
 * app's Reference.jsx. Data lives in src/data/color.js (verbatim mirror of
 * the brand data file); table rendering + column factories are ported
 * faithfully. Hex values resolve live from the installed theme CSS.
 */

// ─── Ported cell primitives (Reference.jsx) ──────────────────────

const Chip = ({ value }) => (
  <span
    className="inline-block w-6 h-6 rounded-sm border border-fg-08 align-middle"
    style={{ background: value }}
  />
)

const TokenName = ({ children }) => (
  <code className="kol-helper-12 text-emphasis">{children}</code>
)

/** LiveHex — reads the resolved hex of a CSS custom property. Single source of
 *  truth: kol-color.css. Edit a token there, this column updates on next render. */
function LiveHex({ token }) {
  const [hex, setHex] = useState('')
  useEffect(() => { setHex(resolveCssVar(token)) }, [token])
  return <TokenName>{hex}</TokenName>
}

/** ThemedHex — one theme's declared value for a token, read from the loaded
 *  theme CSS via CSSOM (resolveTokenThemed). Chip + literal, no copied hex. */
function ThemedHex({ token, theme, chip = true }) {
  const [value, setValue] = useState('')
  useEffect(() => { setValue(resolveTokenThemed(token)[theme] || '') }, [token, theme])
  if (!chip) return <TokenName>{value}</TokenName>
  return (
    <span className="inline-flex items-center gap-2">
      <Chip value={value} />
      <TokenName>{value}</TokenName>
    </span>
  )
}

// ─── Color column factories ─────────────────────────────────────
// Bridge from string keys in src/data/color.js to JSX render funcs.

const COLOR_COLUMNS = {
  alias: [
    { accessor: 'token',      header: 'Token',       render: (r) => <TokenName>{r.token}</TokenName> },
    { accessor: 'swatch',     header: 'Swatch',      render: (r) => <Chip value={`var(${r.token})`} /> },
    { accessor: 'resolvesTo', header: 'Resolves to', render: (r) => <TokenName>{r.resolvesTo}</TokenName> },
    { accessor: 'use',        header: 'Use' },
  ],
  ramp: [
    { accessor: 'token',  header: 'Token',  style: { width: 220 }, render: (r) => <TokenName>{r.token}</TokenName> },
    { accessor: 'swatch', header: 'Swatch', style: { width: 80 },  render: (r) => <Chip value={`var(${r.token})`} /> },
    { accessor: 'hex',    header: 'Hex',    style: { width: 120 }, render: (r) => <LiveHex token={r.token} /> },
    { accessor: 'note',   header: 'Note' },
  ],
  surface: [
    { accessor: 'token', header: 'Token', render: (r) => <TokenName>{r.token}</TokenName> },
    { accessor: 'light', header: 'Light (live)', render: (r) => <ThemedHex token={r.token} theme="light" /> },
    { accessor: 'dark',  header: 'Dark (live)',  render: (r) => <ThemedHex token={r.token} theme="dark" /> },
    { accessor: 'use',   header: 'Use' },
  ],
  state: [
    { accessor: 'state',  header: 'State',  render: (r) => <TokenName>{r.state}</TokenName> },
    { accessor: 'sample', header: 'Sample', render: (r) => (
      <span style={{ color: `var(${r.token})`, fontWeight: 600 }}>{r.sample}</span>
    ) },
    { accessor: 'token',  header: 'Token',  render: (r) => <TokenName>{r.token}</TokenName> },
    { accessor: 'dark',   header: 'Dark (live)',  render: (r) => <ThemedHex token={r.token} theme="dark" chip={false} /> },
    { accessor: 'light',  header: 'Light (live)', render: (r) => <ThemedHex token={r.token} theme="light" chip={false} /> },
    { accessor: 'use',    header: 'Use' },
  ],
  'fg-primitives': [
    { accessor: 'token',   header: 'Token',           render: (r) => <TokenName>{r.token}</TokenName> },
    { accessor: 'swatch',  header: 'Swatch',          render: (r) => <Chip value={`var(${r.token})`} /> },
    { accessor: 'utility', header: 'Utility classes', render: (r) => <code className="kol-helper-12 text-meta">{r.utility}</code> },
    { accessor: 'use',     header: 'Use' },
  ],
  'fg-families': [
    { accessor: 'property', header: 'Family',        render: (r) => <TokenName>.{r.property}</TokenName> },
    { accessor: 'example',  header: 'Example',       render: (r) => <TokenName>.{r.example}</TokenName> },
    { accessor: 'hover',    header: 'Hover variant', render: (r) => r.hover === '—' ? <span className="text-subtle">—</span> : <TokenName>.{r.hover}</TokenName> },
    { accessor: 'use',      header: 'Use' },
  ],
}

// ─── Section renderer ────────────────────────────────────────────
// Ported from Reference.jsx's SystemSection; PageSection (brand chapter
// chrome) becomes DocSection (the docs-shell section contract). DocSection's
// column gap replaces the brand mt-8 spacing.

function SystemSection({ section, columnsDict }) {
  return (
    <DocSection id={section.id} title={section.title} lede={section.intro}>
      {section.reasoning && (
        <div className="kol-prose max-w-[var(--kol-content-measure)]">
          <p className="text-meta">{section.reasoning}</p>
        </div>
      )}
      {/* panel caps tables (kol-theme "Content widths"). Uncapped, these ran
        * the full shell — a 24-row colour table stretched to 1800px with the
        * value column marooned at the far edge. */}
      {section.tables.map((t, i) => (
        <div key={`${section.id}-${i}`} className="max-w-[var(--kol-content-panel)]">
          <Table
            caption={t.caption}
            columns={typeof t.columns === 'string' ? columnsDict[t.columns] : t.columns}
            rows={t.rows}
            variant="simple"
          />
        </div>
      ))}
    </DocSection>
  )
}

// ─── Page ────────────────────────────────────────────────────────


/* The ramp the tuner starts from is READ FROM THE THEME, never transcribed —
 * same rule as every other value on this page, and the reason
 * `pnpm validate:foundations` exists. A hardcoded starting ramp would be a
 * copy that silently stops matching kol-brand-color.css. */
const RED_STOPS = [100, 200, 300, 400, 500]

function useRedRamp() {
  const [ramp, setRamp] = useState(null)
  useEffect(() => {
    const read = () => {
      const next = {}
      for (const s of RED_STOPS) {
        const v = resolveCssVar(`--kol-color-red-${s}`)
        if (v) next[s] = v.toUpperCase()
      }
      setRamp(Object.keys(next).length === RED_STOPS.length ? next : null)
    }
    read()
    const obs = new MutationObserver(read)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    return () => obs.disconnect()
  }, [])
  return ramp
}

export default function FoundationsColor() {
  const redRamp = useRedRamp()
  return (
    <>
      <DocHeader
        eyebrow="KOL · Foundations"
        title="Color"
        lede="Two layers: brand identity (aliases · hue ramps · cream · greyscale) and UI chrome (surface · state · absolute · fg-* opacity). Hex values resolve live from kol-color.css — edit a token there, this page updates on next render."
      />

      {/* Brand colors — identity layer (aliases · hue ramps · cream · grey) */}
      {BRAND_COLORS_SECTIONS.map((section) => (
        <SystemSection key={section.id} section={section} columnsDict={COLOR_COLUMNS} />
      ))}

      <DocSection
        id="tune-red"
        title="Tune the rust anchor"
        lede="Retune red-200 in the page that documents it. The other four stops hold their measured offsets from the anchor, so the ramp moves as one — or turn that off and move the anchor alone. Nothing is written to the theme: kol-brand-color.css is a source file, so this hands over the CSS to paste."
      >
        {redRamp ? (
          <RampTuner
            name="Red — rust / terracotta. ★ anchor at 200 (light-side)."
            cssVarPrefix="--kol-color-red"
            anchor={200}
            stops={redRamp}
            notes={{
              100: 'light rust',
              200: 'anchor · brand secondary',
              500: 'deepest rust',
            }}
          />
        ) : (
          <p className="kol-mono-12 text-meta">
            Ramp unavailable — <code>--kol-color-red-*</code> did not resolve from the loaded theme.
          </p>
        )}
      </DocSection>

      {/* UI colors — chrome layer (surface · state · absolute · fg-* opacity) */}
      {UI_COLORS_SECTIONS.map((section) => (
        <SystemSection key={section.id} section={section} columnsDict={COLOR_COLUMNS} />
      ))}
    </>
  )
}
