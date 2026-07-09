import { Badge } from '@kolkrabbi/kol-component'

const DashAlertCard = ({
  label,
  value,
  trend = 'up',
  trendValue,
  alerts = [],
  footer,
  className = ''
}) => {
  const isPositive = trend === 'up'

  return (
    <div className={`dash-card ${className}`.trim()}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="dash-detail text-fg-64">{label}</span>
          <span className="dash-value">{value}</span>
        </div>
        {trendValue && (
          <Badge icon={isPositive ? 'trending-up' : 'trending-down'}>{trendValue}</Badge>
        )}
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {alerts.map((alert, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <span className="dash-subtitle">{alert.title}</span>
            <span className="dash-body text-fg-64">{alert.description}</span>
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

export default DashAlertCard
