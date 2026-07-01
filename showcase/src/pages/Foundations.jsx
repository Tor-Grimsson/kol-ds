import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageSection } from '@kolkrabbi/kol-framework'
import { TOTAL } from '../lib/registry.js'
import {
  OPACITY_SCALE, FG_SEMANTIC, SURFACES, BRAND_RAMPS, GREY_RAMP,
  TYPE_SCALE, RADII, SHADOWS, ALL_TOKENS,
} from '../lib/tokens.js'

/**
 * Foundations — the KOL token reference as one authored scroll.
 *
 * Built on the framework's own layout classes (.kol-grid, .kol-swatch,
 * .kol-ramp-chips, .kol-type-sample) inside plain PageSection chapters — NOT
 * hand-rolled Tailwind. Every value is read LIVE from the installed theme so
 * the page can't drift.
 */

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

// Only show the resolved value when it's a short literal (hex/rgb). The
// opacity tokens resolve to a long color-mix() string — the label carries the
// meaning there, so we don't print the noise.
const shortVal = (v) => (v && v.length <= 9 ? v : '')

function Swatch({ token, label, resolved, style }) {
  return (
    <div className="kol-swatch">
      <div className="kol-swatch-chip border border-fg-08" style={{ background: `var(${token})`, ...style }} />
      <div className="kol-swatch-meta">
        <span className="text-emphasis">{label}</span>
        <span className="text-meta">{shortVal(resolved)}</span>
      </div>
    </div>
  )
}

export default function Foundations() {
  const resolved = useResolved(ALL_TOKENS)
  const val = (t) => resolved[t]

  return (
    <div>
      <PageSection
        label="KOL · Foundations"
        title="Foundations"
        body="The tokens, scales, and primitives every KOL component is built from — read live from the installed @kolkrabbi/kol-theme, so this page is always the truth."
      />

      {/* 01 — Opacity & foreground scale (the moat) */}
      <PageSection
        id="opacity"
        label="01 — Colour"
        title="Opacity & foreground scale"
        body="KOL's signature: a 14-stop translucent-ink scale for layered editor UI — more expressive than flat fg/bg pairs."
        divider
      >
        <div className="kol-grid">
          {OPACITY_SCALE.map((t) => <Swatch key={t.token} {...t} resolved={val(t.token)} />)}
        </div>
        <p className="kol-helper-10 text-meta uppercase mt-10 mb-4">Semantic foreground</p>
        <div className="kol-grid">
          {FG_SEMANTIC.map((t) => <Swatch key={t.token} {...t} resolved={val(t.token)} />)}
        </div>
      </PageSection>

      {/* 02 — Surfaces */}
      <PageSection id="surfaces" label="02 — Colour" title="Surface tiers" divider>
        <div className="kol-grid">
          {SURFACES.map((t) => <Swatch key={t.token} {...t} resolved={val(t.token)} />)}
        </div>
      </PageSection>

      {/* 03 — Brand ramps */}
      <PageSection id="brand" label="03 — Colour" title="Brand ramps" divider>
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
      </PageSection>

      {/* 04 — Type scale */}
      <PageSection id="type" label="04 — Type" title="Type scale" divider>
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
      </PageSection>

      {/* 05 — Radius */}
      <PageSection id="radius" label="05 — Primitives" title="Corner radius" divider>
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
      </PageSection>

      {/* 06 — Shadow */}
      <PageSection id="shadow" label="06 — Primitives" title="Shadow scale" divider>
        <div className="kol-grid">
          {SHADOWS.map((t) => (
            <div key={t.token} className="kol-swatch">
              <div
                className="kol-swatch-chip bg-surface-primary border border-fg-04"
                style={{ boxShadow: `var(${t.token})` }}
              />
              <div className="kol-swatch-meta"><span className="text-emphasis">{t.label}</span></div>
            </div>
          ))}
        </div>
      </PageSection>

      {/* 07 — Components hop */}
      <PageSection id="components" label="07 — Components" title="Components" body="Tokens become components on their own page — every one live, with a canonical snippet and real mined usage." divider>
        <Link
          to="/components"
          className="inline-flex items-center gap-2 kol-mono-13 text-emphasis border border-fg-16 hover:border-fg-40 rounded-[var(--kol-radius-sm)] px-4 py-2 transition-colors"
        >
          Browse all {TOTAL} components →
        </Link>
      </PageSection>
    </div>
  )
}
