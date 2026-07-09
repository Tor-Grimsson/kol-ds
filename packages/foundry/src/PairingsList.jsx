import PairingCard from './PairingCard.jsx'

/**
 * PairingsList — vertical list of PairingCard atoms with consistent spacing.
 *
 * @param {Object} props
 * @param {Array} props.pairings - Array of pairing objects:
 *   { leftTitle, leftTag, leftDescription, leftFontFamily?, rightTitle, rightTag, rightDescription, rightFontFamily? }
 * @param {string} props.className - Additional classes.
 */
const PairingsList = ({ pairings, className = '' }) => {
  return (
    <div className={`w-full flex flex-col gap-4 ${className}`.trim()}>
      {pairings.map((pairing, index) => (
        <PairingCard
          key={index}
          leftTitle={pairing.leftTitle}
          leftTag={pairing.leftTag}
          leftDescription={pairing.leftDescription}
          leftFontFamily={pairing.leftFontFamily}
          rightTitle={pairing.rightTitle}
          rightTag={pairing.rightTag}
          rightDescription={pairing.rightDescription}
          rightFontFamily={pairing.rightFontFamily}
        />
      ))}
    </div>
  )
}

export default PairingsList
