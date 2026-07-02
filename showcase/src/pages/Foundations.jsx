import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DocLayout from '../lib/DocLayout.jsx'
import DocHeader, { DocSection } from '../lib/DocHeader.jsx'
import Swatch from '../lib/Swatch.jsx'
import { TOTAL } from '../lib/registry.js'
import {
  OPACITY_SCALE, FG_SEMANTIC, SURFACES, BRAND_RAMPS, GREY_RAMP,
  TYPE_SCALE, RADII, SHADOWS, ALL_TOKENS,
} from '../lib/tokens.js'

/**
 * Foundations — the KOL token reference. DocLayout (wide) + the shared
 * content contract (DocHeader/DocSection); swatch primitives come from the
 * framework CSS (.kol-grid, .kol-swatch, .kol-ramp-chips). Every value is
 * read LIVE from the installed theme so the page can't drift.
 */

const TOC = [
  { id: 'opacity', label: 'Opacity & foreground' },
  { id: 'surfaces', label: 'Surface tiers' },
  { id: 'brand', label: 'Brand ramps' },
  { id: 'type', label: 'Type scale' },
  { id: 'radius', label: 'Corner radius' },
  { id: 'shadow', label: 'Shadow scale' },
  { id: 'components', label: 'Components' },
]

// Read live CSS-var values off <html>; re-read on theme change. Chip *fills*
// use var() directly and re-colour on their own — this is only for the text.
function useResolved(tokens) {
  const [vals, setVals] = useState({})
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement)
      const next = {}
      for (const t of tokens) next[t] = cs.getPropertyValue(t).trim()
      setVals(next)
    }
    read()
    const obs = new MutationObserver(read)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    return () => obs.disconnect()
  }, [tokens.join('|')])
  return vals
}

/* Swatch is the ported brand styleguide swatch (lib/Swatch.jsx, E2) —
 * token name meta-left, resolved value strong-right. */

export default function Foundations() {
  const resolved = useResolved(ALL_TOKENS)
  const val = (t) => resolved[t]

  return (
    <DocLayout wide toc={TOC}>
      <DocHeader
        eyebrow="KOL · Foundations"
        title="Foundations"
        lede="The tokens, scales, and primitives every KOL component is built from — read live from the installed @kolkrabbi/kol-theme, so this page is always the truth."
      />

      <DocSection
        id="opacity"
        title="Opacity & foreground scale"
        lede="KOL's signature: a 14-stop translucent-ink scale for layered editor UI — more expressive than flat fg/bg pairs."
      >
        <div className="kol-grid">
          {OPACITY_SCALE.map((t) => <Swatch key={t.token} {...t} resolved={val(t.token)} />)}
        </div>
        <p className="kol-helper-10 text-meta uppercase mt-6 mb-2">Semantic foreground</p>
        <div className="kol-grid">
          {FG_SEMANTIC.map((t) => <Swatch key={t.token} {...t} resolved={val(t.token)} />)}
        </div>
      </DocSection>

      <DocSection id="surfaces" title="Surface tiers">
        <div className="kol-grid">
          {SURFACES.map((t) => <Swatch key={t.token} {...t} resolved={val(t.token)} />)}
        </div>
      </DocSection>

      <DocSection id="brand" title="Brand ramps">
        <div className="flex flex-col gap-8">
          {[...BRAND_RAMPS, GREY_RAMP].map((ramp) => (
            <div key={ramp.name}>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="kol-sans-body-02 text-emphasis capitalize">{ramp.name}</span>
                <span className="kol-helper-10 text-meta uppercase">{ramp.note}</span>
              </div>
              <div className="kol-ramp-chips">
                {ramp.stops.map((s) => <Swatch key={s.token} {...s} resolved={val(s.token)} />)}
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="type" title="Type scale">
        <div>
          {TYPE_SCALE.map((t) => (
            <div key={t.cls} className="kol-type-sample flex flex-col gap-3 py-6 sm:flex-row sm:items-baseline sm:gap-10">
              <div className="sm:w-44 shrink-0">
                <p className="kol-mono-12 text-emphasis">.{t.cls}</p>
                <p className="kol-helper-10 text-meta uppercase">{t.label}{t.size && ` · ${t.size}`}</p>
              </div>
              <p className={t.cls} style={{ margin: 0 }}>{t.sample}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="radius" title="Corner radius">
        <div className="kol-grid">
          {RADII.map((t) => (
            <Swatch
              key={t.token}
              token="--kol-fg-08"
              label={t.label}
              resolved={val(t.token)}
              style={{ borderRadius: `var(${t.token})` }}
            />
          ))}
        </div>
      </DocSection>

      <DocSection id="shadow" title="Shadow scale">
        <div className="kol-grid">
          {SHADOWS.map((t) => (
            <div key={t.token} className="kol-swatch">
              <div
                className="kol-swatch-chip bg-surface-primary border border-fg-04"
                style={{ boxShadow: `var(${t.token})` }}
              />
              <div className="kol-swatch-meta kol-helper-10"><span className="text-emphasis">{t.label}</span></div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection
        id="components"
        title="Components"
        lede="Tokens become components on their own pages — every one live, with a canonical snippet and real mined usage."
      >
        <Link
          to="/components"
          className="inline-flex w-fit items-center gap-2 kol-mono-13 text-emphasis border border-fg-16 hover:border-fg-40 rounded-[var(--kol-radius-sm)] px-4 py-2 transition-colors"
        >
          Browse all {TOTAL} components →
        </Link>
      </DocSection>
    </DocLayout>
  )
}
