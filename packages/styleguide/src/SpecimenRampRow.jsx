import { useRef } from 'react'
import { useMeasuredType } from './SpecimenLive.jsx'
import { fontStack, rampType } from './specimenRamp.js'

/* the columns the ramp's heads and rows share: step 160, sample, size, line height, tracking 128 each */
export const RAMP_COLUMNS = 'grid grid-cols-[160px_minmax(0,1fr)_128px_128px_128px] items-center'

/**
 * SpecimenRampRow — One ramp step. The library master `SpecimenRampRow` (Styleguide page, Ramp section): the step and
 * the sample in the step's own size and line height (`--kol-ramp-size-*` / `--kol-ramp-line-height-*`), then its size,
 * line height and tracking. The numbers are MEASURED off the rendered sample with `SpecimenLive`'s measuring
 * (`useMeasuredType`), so they can never drift from the tokens; `size` / `lineHeight` override them when given.
 *
 * @param {string}  step          a ramp step, `d1` to `l12`
 * @param {string}  [label]       the step as shown; default the step uppercased, e.g. "T4"
 * @param {string}  [sample]      default "Jump really high"
 * @param {string}  [size]        overrides the measured size column
 * @param {string}  [lineHeight]  overrides the measured line height column
 * @param {boolean} [case]        the sample in capitals (Figma `case`)
 * @param {boolean} [italic]
 * @param {boolean} [underline]
 * @param {Object}  [font]        the sheet's font; `font.tracking[step]` (em) sets the step's tracking
 */
export default function SpecimenRampRow({
  step,
  label,
  sample = 'Jump really high',
  size,
  lineHeight,
  case: upper = false,
  italic = false,
  underline = false,
  font,
}) {
  const ref = useRef(null)
  const m = useMeasuredType(ref, `${step}${font?.family}`)
  const type = {
    ...rampType(step),
    fontFamily: fontStack(font),
    letterSpacing: font?.tracking?.[step] != null ? `${font.tracking[step]}em` : undefined,
  }
  const pct = m ? `${((m.raw.letterSpacing / m.raw.size) * 100).toFixed(1)}%` : ''
  const data = 'm-0 text-[16px] leading-5 font-medium text-auto'

  return (
    /* the row is exactly the step's line height (the master's fixed height), so it meets its SpecimenWeightsRow */
    <div className={`${RAMP_COLUMNS} grid-rows-[minmax(0,1fr)]`} style={{ height: `var(--kol-ramp-line-height-${step})` }}>
      <p className="m-0 font-normal text-auto" style={type}>{label ?? step.toUpperCase()}</p>
      <p
        ref={ref}
        className={`m-0 truncate font-normal text-auto ${upper ? 'uppercase' : ''} ${italic ? 'italic' : ''} ${underline ? 'underline' : ''}`}
        style={type}
      >
        {sample}
      </p>
      <p className={data} style={{ fontFamily: type.fontFamily }}>{size ?? (m ? +m.raw.size.toFixed(1) : '')}</p>
      <p className={data} style={{ fontFamily: type.fontFamily }}>{lineHeight ?? (m && !Number.isNaN(m.raw.lineHeight) ? +m.raw.lineHeight.toFixed(1) : '')}</p>
      <p className={data} style={{ fontFamily: type.fontFamily }}>{pct}</p>
    </div>
  )
}
