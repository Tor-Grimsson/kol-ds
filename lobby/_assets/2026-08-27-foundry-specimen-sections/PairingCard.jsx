import React from 'react'
import { Divider } from '@kolkrabbi/kol-component'

/**
 * PairingCard - Font pairing display card
 *
 * Foundry atom for displaying font pairing recommendations
 * Shows two font examples side by side with tags and descriptions
 *
 * @param {Object} props
 * @param {string} props.leftTitle - Left font display text
 * @param {string} props.leftTag - Left category tag (e.g., "Stylistic")
 * @param {string} props.leftDescription - Left usage description
 * @param {string} props.leftFontFamily - CSS font-family for left title
 * @param {string} props.rightTitle - Right font display text
 * @param {string} props.rightTag - Right category tag (e.g., "Stylistic Alternates")
 * @param {string} props.rightDescription - Right usage description
 * @param {string} props.rightFontFamily - CSS font-family for right title
 * @param {string} props.className - Additional classes
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
          <div className="flex-1 kol-mono-14 uppercase text-emphasis">
            {leftTag}
          </div>
        </div>

        {/* Description */}
        <div className="self-stretch flex items-center gap-2">
          <div className="flex-1 kol-mono-12 text-meta">
            {leftDescription}
          </div>
        </div>
      </div>

      {/* Vertical divider */}
      <Divider variant="vertical" height={96} />

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
          <div className="flex-1 kol-mono-14 uppercase text-emphasis">
            {rightTag}
          </div>
        </div>

        {/* Description */}
        <div className="self-stretch flex items-center gap-2">
          <div className="flex-1 kol-mono-12 text-meta">
            {rightDescription}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PairingCard
