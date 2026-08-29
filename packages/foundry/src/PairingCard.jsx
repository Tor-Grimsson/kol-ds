import { Divider } from '@kolkrabbi/kol-component'

/**
 * PairingCard — a font-pairing recommendation: two faces side by side around a
 * vertical seam, each with its name IN ITS OWN FACE, a tag and a description.
 * kol-website's `ui/PairingCard.jsx`, ruled on screen and shipped verbatim
 * (FoundrySpecimenSections, 2026-08-27): the tag wears the typeface row's
 * title voice (`kol-mono-14 uppercase text-emphasis`), the description the
 * row's body voice (`kol-mono-12 text-meta`), the divider is 96px — it reads
 * as the card's seam. Frame + hover chrome: `.kol-pairing-card` (kol-theme).
 *
 * @param {string} leftTitle · rightTitle          the face names, rendered in their family
 * @param {string} leftTag · rightTag              the role ("Body Text", "Headings")
 * @param {string} leftDescription · rightDescription
 * @param {string} leftFontFamily · rightFontFamily  CSS font-family for the name
 * @param {string} className
 */
const Side = ({ title, tag, description, fontFamily }) => (
  <div className="flex flex-col justify-start items-start w-[128px] md:w-[240px] lg:w-[320px]">
    <div className="pb-2 md:pb-3 flex items-center gap-2">
      {/* the name in its own face — 20 / 28 / 36, leading 100% (was .foundry-title) */}
      <div className="text-auto leading-none text-[20px] md:text-[28px] lg:text-[36px]" style={fontFamily ? { fontFamily, fontStyle: 'normal', fontWeight: 'normal' } : undefined}>
        {title}
      </div>
    </div>
    <div className="self-stretch pb-3 md:pb-4 flex items-center gap-2">
      <div className="flex-1 kol-mono-14 uppercase text-emphasis">{tag}</div>
    </div>
    <div className="self-stretch flex items-center gap-2">
      <div className="flex-1 kol-mono-12 text-meta">{description}</div>
    </div>
  </div>
)

export default function PairingCard({
  leftTitle, leftTag, leftDescription, leftFontFamily,
  rightTitle, rightTag, rightDescription, rightFontFamily,
  className = '',
}) {
  return (
    <div className={`kol-pairing-card p-4 md:p-5 lg:p-6 rounded flex justify-between items-center overflow-hidden ${className}`.trim()}>
      <Side title={leftTitle} tag={leftTag} description={leftDescription} fontFamily={leftFontFamily} />
      <Divider variant="vertical" height={96} />
      <Side title={rightTitle} tag={rightTag} description={rightDescription} fontFamily={rightFontFamily} />
    </div>
  )
}
