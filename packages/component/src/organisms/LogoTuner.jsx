import { useMemo } from 'react'
import { tuner } from '@kolkrabbi/kol-tuner'
import { Board, Keylines, Labels, inksOf, useLight } from './logoBoard.jsx'

/* LOGOTUNER (W27.4, 2026-11-19): the Tuner board of @kolkrabbi/kol-tuner (the canvas's tuner-01-form), a dropped logo
 * rebuilt from circles and lines on one ladder. It draws the form, the traced line, the circles and dots, the curvature
 * comb, the grid, the keylines and the labels. The settings are the host's: `settings` is the engine's Tuner props,
 * `image` the `Image` it reads (an SVG carries its text as `image.__svg`), and a file dropped on the board or picked by
 * a click calls `onFile(file)`; the host reads it into `image`. `peek` draws the tuned form alone. */
export default function LogoTuner({ settings: p, image = null, peek = false, onFile, className = '' }) {
  const inks = inksOf(p), themeLight = useLight(), light = inks ? inks.light : themeLight
  const v = useMemo(() => tuner(peek ? { ...p, view: 'tuned' } : p, image), [p, image, peek])
  const grey = p.fill !== 'ink', strokeAlpha = grey ? 0.85 : 0.5
  const pick = (e) => { onFile?.(e.target.files[0]); e.target.value = '' }

  return (
    <label className={`block h-full w-full cursor-pointer ${className}`.trim()} title="Choose a logo: an SVG or a black and white image"
      onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile?.(e.dataTransfer.files[0]) }}>
      <Board inks={inks} label="A form rebuilt from circles and lines">
        {!peek && v.gridD && <path d={v.gridD} className="kol-logo-grid" />}
        <path d={v.d} className={`kol-logo-form${grey && !peek ? ' is-grey' : ''}`} fillRule={v.fillRule || 'evenodd'} />
        {!peek && [v.comb0, v.comb1, v.comb2].map((d, i) => d && <path key={i} d={d} className={`kol-logo-comb is-${i}`} />)}
        {!peek && p.outline && p.view !== 'original' && <path d={v.orig} className="kol-logo-trace" />}
        {!peek && <path d={(p.construction ? v.circles : '') + (p.math ? v.guides : '')} className="kol-logo-lines" opacity={strokeAlpha} />}
        {!peek && p.construction && <path d={v.dots} className="kol-logo-dots" />}
        {!peek && p.keylines && <Keylines box={(v.box || 480) * 1.2} ox={v.boxX} oy={v.boxY} light={light} />}
        {!peek && p.math && <Labels list={v.labels} />}
      </Board>
      <input type="file" accept="image/*,.svg" aria-label="Choose a logo: an SVG or a black and white image" className="sr-only" onChange={pick} />
    </label>
  )
}
