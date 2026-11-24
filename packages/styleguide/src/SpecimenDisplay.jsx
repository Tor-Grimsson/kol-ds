import { Chip } from '@kolkrabbi/kol-component'
import { fontStack } from './specimenRamp.js'

/* taxonomy-ok: nests kol-component's Chip (package import). */

/**
 * SpecimenDisplay — The "Aa" card that opens a sheet. The library master `SpecimenDisplay` (Styleguide page, Display
 * and cards; type-ramp plan 6.4): 640 tall on surface-secondary, 24 radius, 64 in, a title block left and the big
 * "Aa" (380 / 296, -2%) bottom right. `ramp` false (Styles): the font's name (extra bold 64/72), its link (medium 16/20
 * at fg-64) and a wrapping grid of `Chip`s, one per weight, "Aa" in the slot; the grid is 408 wide and clips, as the
 * master's does. `ramp` true: the plain titled card, "Ramp" over a regular "Aa".
 *
 * @param {boolean} [ramp]  default false (Figma `ramp`)
 * @param {Object}  [font]  `{ family, link, weights: [{ name, value }] }`
 */
export default function SpecimenDisplay({ ramp = false, font }) {
  const family = fontStack(font)
  return (
    <div className="flex h-160 items-end justify-between overflow-hidden rounded-3xl bg-surface-secondary p-16" style={{ fontFamily: family }}>
      <div className={`flex h-full flex-col justify-between ${ramp ? 'gap-12' : 'gap-8'}`}>
        <div className={`flex flex-col ${ramp ? 'gap-3' : 'gap-2 pb-4'}`}>
          <p className="m-0 text-[64px] leading-18 font-extrabold text-auto">{ramp ? 'Ramp' : font?.family}</p>
          {!ramp && font?.link && <p className="m-0 text-[16px] leading-5 font-medium text-fg-64">{font.link}</p>}
        </div>
        {!ramp && (
          <div className="flex w-102 flex-wrap gap-6 overflow-hidden">
            {(font?.weights ?? []).map((w) => (
              <Chip
                key={w.value}
                leading={<span className="text-[24px] leading-8 text-auto" style={{ fontFamily: family, fontWeight: w.value }}>Aa</span>}
                title={font.family}
                meta={w.name}
              />
            ))}
          </div>
        )}
      </div>
      <p className={`m-0 text-[380px] leading-[296px] tracking-[-0.02em] text-auto ${ramp ? 'font-normal' : 'font-extrabold'}`}>Aa</p>
    </div>
  )
}
