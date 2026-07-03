import { useEffect, useState } from 'react'
import ColorSwatch from './ColorSwatch.jsx'
import { resolveCssVar, isLight } from '../hooks/cssVar.js'

/**
 * ColorRamp — one specimen row of color chips for a token-doc page. A label
 * (+ optional note) above a run of ColorSwatch chips, each captioned with its
 * name and resolved value. Merges the former Ramp (static hex) + ColorRamp
 * (live CSS var) widgets into one component with two mutually-exclusive inputs:
 *
 *   live  — `vars` (custom-property names) or the `ramp` + `stops` sugar. Each
 *           chip resolves `--{token}` on mount via resolveCssVar and prints the
 *           declared value; the swatch fill reads the same var() live, so the
 *           theme file stays the single source of truth.
 *   static — `colors` (literal color strings). No resolution; the literal is
 *            both the fill and the printed value. This is the old Ramp mode.
 *
 * Precedence: colors > vars > ramp/stops. The local Chip/Swatch dups the two
 * source files carried are gone — every chip is a DS ColorSwatch. The anchor
 * marker is a dot whose fill flips black/white through isLight so it reads on
 * any stop.
 *
 * Presentational — resolves once on mount; no theme subscription.
 *
 * @param {string}   label   row heading (defaults to `ramp`); omit in vars/colors mode to hide
 * @param {string}   ramp    ramp key sugar → each chip resolves `--{ramp}-{stop}`
 * @param {number[]} stops   stop list for the `ramp` sugar (default 100–500)
 * @param {Array<string|[string,string]>} vars    live custom-property names (bare, or [name, token])
 * @param {Array<string|[string,string]>} colors  static literal colors (bare, or [name, color])
 * @param {string|number} anchor  chip that gets the anchor dot + ★ — matches a stop, name, or index
 * @param {string}   note    right-aligned italic caption
 */

/** Flatten any of the three inputs into a uniform chip list. */
function buildChips({ ramp, stops, vars, colors }) {
  if (colors) {
    return colors.map((c, i) => {
      const [name, literal] = Array.isArray(c) ? c : [c, c]
      return { key: `c-${i}-${literal}`, name, literal }
    })
  }
  if (vars) {
    return vars.map((v, i) => {
      const [name, raw] = Array.isArray(v) ? v : [v.replace(/^--/, ''), v]
      const token = raw.startsWith('--') ? raw : `--${raw}`
      return { key: `v-${i}-${token}`, name, token }
    })
  }
  return stops.map((s) => ({
    key: `r-${ramp}-${s}`,
    name: `${ramp}-${s}`,
    token: `--${ramp}-${s}`,
    stop: s,
  }))
}

export default function ColorRamp({
  label,
  ramp,
  stops = [100, 200, 300, 400, 500],
  vars,
  colors,
  anchor,
  note,
}) {
  const chips = buildChips({ ramp, stops, vars, colors })
  const [values, setValues] = useState({})

  useEffect(() => {
    const next = {}
    for (const c of chips) {
      if (c.token) next[c.key] = resolveCssVar(c.token)
    }
    setValues(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ramp, JSON.stringify(stops), JSON.stringify(vars), JSON.stringify(colors)])

  const rampLabel = label ?? ramp
  const cols = Math.min(chips.length, 10)

  return (
    <div className="flex flex-col gap-3 py-5 border-b border-fg-08 last:border-b-0">
      {(rampLabel || note) && (
        <div className="flex items-baseline justify-between gap-6 flex-wrap">
          {rampLabel && <span className="kol-helper-12 tracking-widest text-emphasis">{rampLabel}</span>}
          {note && <span className="kol-mono-12 text-meta italic max-w-[60ch] text-right">{note}</span>}
        </div>
      )}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {chips.map((c, i) => {
          const value = c.literal ?? values[c.key] ?? ''
          const fill = c.literal ?? `var(${c.token})`
          const isAnchor = anchor != null && (anchor === c.stop || anchor === c.name || anchor === i)
          return (
            <div key={c.key} className="flex flex-col gap-1.5">
              <div className="relative">
                <ColorSwatch hex={fill} size="fill" radius="sm" title={`${c.name} ${value}`} />
                {isAnchor && value && (
                  <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: isLight(value) ? '#000' : '#fff' }} />
                  </span>
                )}
              </div>
              <div className="flex flex-col items-start gap-0.5 leading-tight">
                <span className="kol-helper-10 text-emphasis">{c.name}{isAnchor && ' ★'}</span>
                <span className="kol-helper-10 text-meta">{value}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
