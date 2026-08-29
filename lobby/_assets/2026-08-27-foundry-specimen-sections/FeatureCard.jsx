import React from 'react'
import { Icon } from '@kolkrabbi/kol-icons'

/**
 * FeatureCard - Title and description card
 *
 * Foundry atom for displaying individual OpenType features
 * Features bordered card with opacity hover effect (50% → 100%)
 *
 * @param {Object} props
 * @param {string} props.title - Feature title
 * @param {string} props.description - Feature description
 * @param {string} props.icon - Optional icon name (e.g., 'foundation')
 * @param {boolean} props.isActive - Whether this card is currently active (last hovered)
 * @param {Function} props.onMouseEnter - Callback fired on mouse enter
 * @param {string} props.className - Additional classes
 */
const FeatureCard = ({ title, description, icon, className = '' }) => {
  return (
    <div className={`feature-card ${className}`.trim()}>
      {icon ? (
        <div className="flex flex-row justify-between items-start">
          <h3 className="kol-card-title uppercase">
            {title}
          </h3>
          <Icon name={icon} size={16} />
        </div>
      ) : (
        <h3 className="kol-card-title uppercase">
          {title}
        </h3>
      )}
      <p className="kol-card-excerpt text-fg-64">
        {description}
      </p>
    </div>
  )
}

export default FeatureCard
