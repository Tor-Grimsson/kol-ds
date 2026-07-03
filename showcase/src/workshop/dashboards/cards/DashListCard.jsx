import { Badge } from '@kolkrabbi/kol-component'
import CardHeader from './_shared/CardHeader'

const DashListCard = ({
  title,
  subtitle,
  icon,
  badge,
  items = [],
  variant = 'text',
  barColor = 'var(--kol-palette-yellow)',
  footer,
  className = ''
}) => {
  return (
    <div className={`dash-card ${className}`.trim()}>
      <div className="flex justify-between items-start">
        <CardHeader icon={icon} title={title} subtitle={subtitle} />
        {badge && <Badge>{badge}</Badge>}
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="dash-list-item">
            <ListItem item={item} variant={variant} barColor={barColor} />
          </div>
        ))}
      </div>

      {footer && (
        <div className="dash-card__footer">
          <span className="dash-detail text-fg-64">{footer}</span>
        </div>
      )}
    </div>
  )
}

const ListItem = ({ item, variant, barColor }) => {
  if (variant === 'meter') {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="dash-body text-fg-80">{item.label}</span>
          <span className="dash-body text-fg-88">{item.value}</span>
        </div>
        <div className="h-2 bg-fg-08 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${item.percent}%`, background: item.color || barColor }}
          />
        </div>
        {item.detail && (
          <span className="dash-list-item__detail dash-caption text-fg-64">{item.detail}</span>
        )}
      </div>
    )
  }

  if (variant === 'ratings') {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {item.color && <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />}
          <span className="dash-body text-fg-80">{item.label}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="dash-value">{item.value}</span>
          {item.detail && <span className="dash-detail text-fg-64">{item.detail}</span>}
        </div>
      </div>
    )
  }

  // variant === 'text' (default)
  return (
    <div className="flex justify-between items-center">
      <span className="dash-body text-fg-80">{item.label}</span>
      <span className="dash-body text-fg-88">{item.value}</span>
      {item.detail && (
        <span className="dash-list-item__detail dash-caption text-fg-64">{item.detail}</span>
      )}
    </div>
  )
}

export default DashListCard
