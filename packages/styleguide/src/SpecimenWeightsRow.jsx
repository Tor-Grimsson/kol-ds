import { fontStack, rampType } from './specimenRamp.js'

/**
 * SpecimenWeightsRow — One step in every weight. The library master `SpecimenWeightsRow` (Styleguide page, Weights
 * section): the step in extra bold (200 wide), then the sample once per weight the font offers, 64 apart, all in the
 * step's ramp size and line height, so the row is exactly as tall as its `SpecimenRampRow`.
 *
 * @param {string} step        a ramp step, `d1` to `l12`
 * @param {string} [label]     the step as shown; default the step uppercased
 * @param {string} [sample]    the word set in each weight; default the master's: "Semi" under 400, "Bold" from 400
 * @param {Object} [font]      the sheet's font: `font.weights` (`[{ name, value }]`), `font.tracking[step]` (em)
 */
export default function SpecimenWeightsRow({ step, label, sample, font }) {
  const type = {
    ...rampType(step),
    fontFamily: fontStack(font),
    letterSpacing: font?.tracking?.[step] != null ? `${font.tracking[step]}em` : undefined,
  }
  return (
    <div className="flex items-center gap-8 whitespace-nowrap">
      <p className="m-0 w-50 shrink-0 font-extrabold text-auto" style={type}>{label ?? step.toUpperCase()}</p>
      <div className="flex items-center gap-16">
        {(font?.weights ?? []).map((w) => (
          <p key={w.value} className="m-0 text-auto" style={{ ...type, fontWeight: w.value }}>{sample ?? (w.value < 400 ? 'Semi' : 'Bold')}</p>
        ))}
      </div>
    </div>
  )
}
