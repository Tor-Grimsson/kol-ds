import { useEffect, useState } from 'react'
import ColorSwatch from '../molecules/ColorSwatch.jsx'
import { resolveCssVar, resolveCssColor, isLight } from '../hooks/cssVar.js'

/**
 * SpectrumGrid — matrix view of the whole ramp system: rows = ramps, columns =
 * stops (50 → 900). Each cell is a ColorSwatch tile with the stop number and
 * hex printed over it (text color contrast-corrected via isLight), so the whole
 * palette is scannable in one grid.
 *
 * Values resolve live from CSS custom properties at mount — the inline
 * getComputedStyle fork the source carried is replaced by the shared
 * resolveCssVar (declared value → printed hex) + resolveCssColor (computed rgb →
 * fed to isLight, robust to var() chains / color-mix). Edit a ramp in the theme
 * and the grid follows on next mount.
 *
 * @param {string[]} ramps         rows; each resolves `--{ramp}-{stop}`
 * @param {number[]} stops         columns (default 50…900)
 * @param {Array<{ramp:string, stop:number}>} brandAnchors  cells that get the anchor dot
 */

const DEFAULT_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

export default function SpectrumGrid({ ramps, stops = DEFAULT_STOPS, brandAnchors = [] }) {
  const [resolved, setResolved] = useState(null)

  useEffect(() => {
    const out = {}
    for (const ramp of ramps) {
      out[ramp] = {}
      for (const stop of stops) {
        const token = `--${ramp}-${stop}`
        out[ramp][stop] = { label: resolveCssVar(token), color: resolveCssColor(`var(${token})`) }
      }
    }
    setResolved(out)
  }, [ramps, stops])

  if (!resolved) return <div className="kol-spectrum-grid w-full min-h-[120px]" aria-busy="true" />

  const isBrandAnchor = (ramp, stop) => brandAnchors.some((a) => a.ramp === ramp && a.stop === stop)

  return (
    <div
      className="kol-spectrum-grid grid w-full"
      style={{
        gridTemplateColumns: `var(--kol-sg-label-w, 100px) repeat(${stops.length}, minmax(0, 1fr))`,
        gap: 'var(--kol-sg-gap, 4px)',
      }}
    >
      <div className="contents">
        <span aria-hidden="true" />
        {stops.map((s) => (
          <span key={s} className="kol-helper-12 text-fg-48 self-end pb-1">{s}</span>
        ))}
      </div>
      {ramps.map((ramp) => (
        <div key={ramp} className="contents">
          <span className="kol-helper-12 text-emphasis self-center pr-2">{ramp}</span>
          {stops.map((stop) => {
            const { label, color } = resolved[ramp][stop]
            const hex = label || color
            const textColor = isLight(color) ? '#000' : '#fff'
            const brand = isBrandAnchor(ramp, stop)
            return (
              <div
                key={stop}
                className="relative aspect-[5/3] rounded overflow-hidden transition-transform hover:scale-[1.04]"
                title={`${ramp}-${stop}  ${hex}${brand ? '  · brand anchor' : ''}`}
              >
                <ColorSwatch hex={`var(--${ramp}-${stop})`} size="stretch" radius="none" frame={false} className="absolute inset-0" />
                <div className="pointer-events-none absolute inset-0 px-2 py-1.5" style={{ color: textColor }}>
                  <span className="kol-helper-12 font-bold block">{stop}</span>
                  <span className="kol-helper-10 opacity-[.78] absolute bottom-1.5 left-2 max-[900px]:hidden">{hex}</span>
                  {brand && (
                    <span
                      className="absolute top-1.5 right-2 w-2.5 h-2.5 rounded-full opacity-[.85]"
                      style={{ background: 'currentColor' }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
