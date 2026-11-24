import SpecimenFontFace from './SpecimenFontFace.jsx'
import SpecimenSample from './SpecimenSample.jsx'
import { fontStack } from './specimenRamp.js'

/* taxonomy-ok: nests SpecimenFontFace and SpecimenSample (relative). */

/**
 * SpecimenFontSheet — A font's sheet: the word, the pair, every weight. The library master `SpecimenFontSheet`
 * (Styleguide page, Display and cards): on surface-primary, 96 / 64 in, three blocks 128 apart. The title (100 down):
 * the font's role in palette blue (medium 28, in the KOL sans, the pair's text face) over the word (bold 160/160, in the
 * font). The faces (`showFaces`): one `SpecimenFontFace` per face of the pair, 32 apart. The weights: one
 * `SpecimenSample horizontal` per weight, the weight's name beside the alphabet, 32 apart.
 *
 * @param {Object}   [font]       `{ family, role, weights: [{ name, value }] }`
 * @param {Object[]} [faces]      the pair, each `{ family, description, detail }`
 * @param {boolean}  [showFaces]  default false (Figma `show faces`)
 * @param {string}   [word]       default "Typography"
 * @param {string}   [sample]     each weight's sample; default the alphabet, the lower case and the figures
 */
export default function SpecimenFontSheet({
  font,
  faces = [],
  showFaces = false,
  word = 'Typography',
  sample = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n0123456789!@#$%^&*()[]?+',
}) {
  return (
    <div className="flex w-full flex-col gap-32 bg-surface-primary px-16 py-24">
      <div className="flex flex-col gap-8 pt-25">
        <p className="m-0 text-[28px] leading-[1.1] font-medium text-[var(--kol-palette-blue)]">{font?.role}</p>
        <p className="m-0 text-[160px] leading-[160px] font-bold text-auto" style={{ fontFamily: fontStack(font) }}>{word}</p>
      </div>
      {showFaces && (
        <div className="flex gap-8">
          {faces.map((f) => <SpecimenFontFace key={f.family} font={f} />)}
        </div>
      )}
      <div className="flex flex-col gap-8">
        {(font?.weights ?? []).map((w) => (
          <SpecimenSample key={w.value} horizontal label={w.name} family={font.family} weight={w.value} size={28.8} lineHeight={37.44}>
            {sample}
          </SpecimenSample>
        ))}
      </div>
    </div>
  )
}
