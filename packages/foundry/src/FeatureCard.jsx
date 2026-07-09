import { Icon } from '@kolkrabbi/kol-component'

/**
 * FeatureCard — title + description card with an opacity hover flip (50% → 100%
 * via the `.feature-card` / `.active` CSS). Foundry atom for OpenType-feature
 * and font-detail listings. Optional trailing Icon.
 *
 * Text casing: title and description render verbatim as authored.
 *
 * @param {Object} props
 * @param {string} props.title - Feature title.
 * @param {string} props.description - Feature description.
 * @param {string} props.icon - Optional KOL Icon name.
 * @param {boolean} props.isActive - Whether this card is the last-hovered/active one.
 * @param {Function} props.onMouseEnter - Callback fired on mouse enter.
 * @param {string} props.className - Additional classes.
 */
const FeatureCard = ({ title, description, icon, isActive = false, onMouseEnter, className = '' }) => {
  return (
    <div
      className={`feature-card ${isActive ? 'active' : ''} ${className}`.trim()}
      onMouseEnter={onMouseEnter}
    >
      {icon ? (
        <div className="flex flex-row justify-between items-start">
          <h3 className="kol-helper-uc-md">
            {title}
          </h3>
          <Icon name={icon} size={16} />
        </div>
      ) : (
        <h3 className="kol-helper-uc-md">
          {title}
        </h3>
      )}
      <p className="kol-mono-sm-regular text-fg-64">
        {description}
      </p>
    </div>
  )
}

export default FeatureCard
