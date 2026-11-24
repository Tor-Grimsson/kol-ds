import { fontStack } from './specimenRamp.js'

/**
 * SpecimenFontFace — One face of a pair, described. The library master `SpecimenFontFace` (Styleguide page, Display
 * and cards): the face's name (black 28/30) over its description and detail (regular 20/22, 16 apart), all in the face.
 *
 * @param {Object} [font]  `{ family, description, detail }`
 */
export default function SpecimenFontFace({ font }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6 pr-6 text-auto" style={{ fontFamily: fontStack(font) }}>
      <p className="m-0 text-[28px] leading-[30px] font-black">{font?.family}</p>
      <div className="flex flex-col gap-4 text-[20px] leading-[22px]">
        {font?.description && <p className="m-0">{font.description}</p>}
        {font?.detail && <p className="m-0">{font.detail}</p>}
      </div>
    </div>
  )
}
