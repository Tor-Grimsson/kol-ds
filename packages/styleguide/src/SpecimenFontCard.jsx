import { Chip } from '@kolkrabbi/kol-component'
import { fontStack } from './specimenRamp.js'

/* taxonomy-ok: nests kol-component's Chip (package import). */

const STEPS = [
  ['H1', 'Wave front', 58, 64, 700], ['H2', 'Manual sweep', 48, 56, 700], ['H3', 'Ranging shields', 44, 52, 700],
  ['H4', 'Evasive manoeuvres', 36, 44, 700], ['H5', 'Scanning frequencies', 28, 32, 700],
  ['H6', 'Attack decay sustain release', 22, 28, 700], ['B1', 'Comparing molecular integrity', 18, 28, 400],
  ['B2', 'Filter envelope modulation', 16, 24, 400], ['B3', 'Sensor reset', 14, 20, 400],
  ['L1', 'Extrapolating', 14, 16, 500], ['L2', 'Resistance capacity', 12, 16, 700], ['L3', 'Interpreting', 10, 12, 700],
]

/**
 * SpecimenFontCard — A font's card, in two layouts. The library set `SpecimenFontCard` (Styleguide page, Display and
 * cards; type-ramp plan 6.11): 1280 × 800 on white, 96 / 64 in, for any font. `ramp` false: the font's name on top, the
 * alphabet and figures (bold 76/88, centred) in the middle, its role at the foot (bold 22/28), all in the font. `ramp`
 * true: left (392) the mark ("Aa" bold 96, -2%) beside the role (semibold 36/44) and the family (regular 18/28) in the
 * KOL sans, the cuts (one `Chip` per weight, "Aa" in the slot, two to a row, 8 apart) and the alphabet (bold 16/28,
 * 2%); right (560) the font's own ramp, step beside sample, each at its size.
 *
 * @param {boolean} [ramp]   default false (Figma `ramp`)
 * @param {Object}  [font]   `{ family, role, weights: [{ name, value }] }`
 * @param {Array}   [steps]  `ramp` only: `[label, sample, size, lineHeight, weight]` rows; default the master's twelve
 */
export default function SpecimenFontCard({ ramp = false, font, steps = STEPS }) {
  const face = { fontFamily: fontStack(font) }
  if (!ramp) {
    return (
      <div className="flex h-200 w-320 flex-col items-center justify-between bg-[var(--kol-color-white)] px-16 py-24 font-bold text-auto" style={face}>
        <p className="m-0 text-[22px] leading-7">{font?.family}</p>
        <div className="flex flex-col items-center text-center text-[76px] leading-22">
          <p className="m-0 whitespace-pre-line">{'Aa Bb Cc Dd Ee\nFf Gg Hh Ii Jj Kk Ll Mm\nNn Oo Pp Qq Rr Ss\nTt Uu Vv Ww Xx Yy Zz'}</p>
          <p className="m-0">0123456789</p>
        </div>
        <p className="m-0 text-[22px] leading-7">{font?.role}</p>
      </div>
    )
  }
  return (
    <div className="flex h-200 w-320 justify-between overflow-hidden bg-[var(--kol-color-white)] px-16 py-24 text-auto">
      <div className="flex w-98 flex-col justify-between overflow-hidden">
        <div className="flex flex-col gap-24">
          <div className="flex w-90 items-end justify-between p-1">
            <p className="m-0 text-[96px] leading-24 font-bold tracking-[-0.02em]" style={face}>Aa</p>
            <div className="flex w-36 flex-col py-[7px] font-[family-name:var(--kol-font-family-sans)]">
              <p className="m-0 text-[36px] leading-11 font-semibold">{font?.role}</p>
              <p className="m-0 text-[18px] leading-7">{font?.family}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(font?.weights ?? []).map((w) => (
              <Chip
                key={w.value}
                leading={<span className="text-[24px] leading-8 text-auto" style={{ ...face, fontWeight: w.value }}>Aa</span>}
                title={font.family}
                meta={w.name}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col text-[16px] leading-7 font-bold tracking-[0.02em]" style={face}>
          <p className="m-0">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
          <p className="m-0">abcdefghijklmnopqrstuvwxyz</p>
          <p className="m-0">0123456789  !?&amp;%#$€()</p>
        </div>
      </div>
      <div className="flex w-140 flex-col justify-between overflow-hidden" style={face}>
        {steps.map(([label, sample, size, lh, weight]) => (
          <div key={label} className="grid grid-cols-[75px_minmax(0,1fr)] items-baseline gap-12 whitespace-nowrap" style={{ fontSize: size, lineHeight: `${lh}px` }}>
            <span className="text-right font-bold">{label}</span>
            <span style={{ fontWeight: weight }}>{sample}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
