import { Divider } from '@kolkrabbi/kol-component'

/**
 * PairingCard — font-pairing display card. Foundry atom showing two font
 * examples side by side, each with a tag and usage description, split by a
 * vertical Divider. Titles render in an injectable `*FontFamily` (falls back to
 * the `.foundry-title` default face).
 *
 * Text casing: titles, tags and descriptions render verbatim as authored.
 *
 * @param {Object} props
 * @param {string} props.leftTitle - Left font display text.
 * @param {string} props.leftTag - Left category tag.
 * @param {string} props.leftDescription - Left usage description.
 * @param {string} props.leftFontFamily - CSS font-family for the left title.
 * @param {string} props.rightTitle - Right font display text.
 * @param {string} props.rightTag - Right category tag.
 * @param {string} props.rightDescription - Right usage description.
 * @param {string} props.rightFontFamily - CSS font-family for the right title.
 * @param {string} props.className - Additional classes.
 */
const PairingCard = ({
  leftTitle,
  leftTag,
  leftDescription,
  leftFontFamily,
  rightTitle,
  rightTag,
  rightDescription,
  rightFontFamily,
  className = ''
}) => {
  return (
    <div
      className={`pairing-card p-4 md:p-5 lg:p-6 rounded flex justify-between items-center overflow-hidden ${className}`.trim()}
    >
      {/* Left text section */}
      <div className="flex flex-col justify-start items-start w-[128px] md:w-[240px] lg:w-[320px]">
        {/* Title */}
        <div className="pb-2 md:pb-3 flex items-center gap-2">
          <div
            className="foundry-title text-[20px] md:text-[28px] lg:text-[36px]"
            style={leftFontFamily ? { fontFamily: leftFontFamily } : undefined}
          >
            {leftTitle}
          </div>
        </div>

        {/* Tag */}
        <div className="self-stretch pb-3 md:pb-4 flex items-center gap-2">
          <div className="flex-1 kol-mono-sm-regular text-fg-64 text-[12px] md:text-[13px] lg:text-[14px]">
            {leftTag}
          </div>
        </div>

        {/* Description */}
        <div className="self-stretch flex items-center gap-2">
          <div className="flex-1 kol-helper-regular-xxxs italic text-fg-32 md:text-[13px] lg:text-[14px]">
            {leftDescription}
          </div>
        </div>
      </div>

      {/* Vertical divider */}
      <Divider variant="vertical" />

      {/* Right text section */}
      <div className="flex flex-col justify-start items-start w-[128px] md:w-[240px] lg:w-[320px]">
        {/* Title */}
        <div className="pb-2 md:pb-3 flex items-center gap-2">
          <div
            className="foundry-title text-[20px] md:text-[28px] lg:text-[36px]"
            style={rightFontFamily ? { fontFamily: rightFontFamily } : undefined}
          >
            {rightTitle}
          </div>
        </div>

        {/* Tag */}
        <div className="self-stretch pb-3 md:pb-4 flex items-center gap-2">
          <div className="flex-1 kol-mono-sm-regular text-fg-64 text-[12px] md:text-[13px] lg:text-[14px]">
            {rightTag}
          </div>
        </div>

        {/* Description */}
        <div className="self-stretch flex items-center gap-2">
          <div className="flex-1 kol-helper-regular-xxxs italic text-fg-32 md:text-[13px] lg:text-[14px]">
            {rightDescription}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PairingCard
