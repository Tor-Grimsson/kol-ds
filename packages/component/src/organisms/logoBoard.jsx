import { useEffect, useState } from 'react'
import { KeylineGuide } from '../atoms/IconPlate.jsx'

/* What LogoSystem and LogoTuner share (from apps/tuner, W27.4 2026-11-19): the board, the keylines on it, the labels,
 * the ground the keylines are drawn on. The board is the Line Swell canvas's 1200 x 800 frame with its origin at the
 * centre; it scales to its box and keeps its ratio. Its inks are `.kol-logo-*` rules in kol-components-organisms.css. */

/* which ground the keylines sit on: the page's data-theme, followed on a flip */
export function useLight() {
  const read = () => document.documentElement.dataset.theme === 'light'
  const [light, setLight] = useState(read)
  useEffect(() => {
    const o = new MutationObserver(() => setLight(read()))
    o.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => o.disconnect()
  }, [])
  return light
}

/* the 24-unit keylines from KeylineGuide, laid on the board at `box` around (ox, oy) */
export function Keylines({ box, ox = 0, oy = 0, light }) {
  return (
    <foreignObject x={ox - box / 2} y={oy - box / 2} width={box} height={box} pointerEvents="none">
      <div style={{ position: 'relative', width: '100%', height: '100%' }}><KeylineGuide light={light} /></div>
    </foreignObject>
  )
}

/* the canvas's palettes (line-swell.js PALETTES), ink then ground; `custom` takes the settings' own ink and ground */
const PALETTES = {
  'ink on paper': ['#111111', '#f4f4f4'], 'paper on ink': ['#ffffff', '#000000'], 'white on blue': ['#ffffff', '#0a1fff'],
  'blue on paper': ['#0a1fff', '#f1f1f1'], 'red on ink': ['#e5303f', '#111111'], 'light on grey': ['#fafafa', '#35363a'],
}
/* the board's own inks when the settings carry a palette (as the canvas boards draw), else null: the theme's inks.
   `light` says which keylines suit the ground (the engine's keylines rule: luminance over 128) */
export function inksOf(p) {
  if (!p?.palette) return null
  const pal = PALETTES[p.palette] ?? PALETTES['ink on paper'], custom = p.palette === 'custom'
  const ink = custom ? (p.ink || pal[0]) : pal[0], ground = custom ? (p.ground || pal[1]) : pal[1]
  const g = String(ground).replace('#', ''), lum = g.length === 6 ? parseInt(g.slice(0, 2), 16) * 0.299 + parseInt(g.slice(2, 4), 16) * 0.587 + parseInt(g.slice(4, 6), 16) * 0.114 : 255
  return { ink, ground, light: lum > 128 }
}

/* the board: the 1200 x 800 frame, centred and scaled to fit; `svgRef` reads pointer positions in board units.
   `inks` (inksOf): the ground behind the board and the ink of its form, lines and labels; the grey form is the
   canvas's #b3b3b3 there */
export function Board({ svgRef, label, inks = null, children }) {
  return (
    <svg ref={svgRef} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet" role="img" aria-label={label}
      style={inks ? { '--kol-logo-ink': inks.ink, '--kol-logo-ground': inks.ground } : undefined}
      className={`kol-logo-board block h-full w-full touch-none select-none${inks ? ' is-inked' : ''}`}>
      <g transform="translate(600 400)">{children}</g>
    </svg>
  )
}

/* labels the engine places on the board, as text in board units so they scale with it; the canvas laid them as 15/16
 * HTML with its top 13 above the point, so the baseline lands 1 above it */
export function Labels({ list }) {
  return list.map((l, i) => <text key={i} x={l.x} y={l.y - 1} className="kol-logo-label" pointerEvents="none" xmlSpace="preserve">{l.t}</text>)
}
