import { Badge } from '@kolkrabbi/kol-component'
import CardHeader from './_shared/CardHeader'
import LegendRow from './_shared/LegendRow'

const DashChartCard = ({
  title,
  subtitle,
  icon,
  badge,
  metricLabel,
  currentValue,
  legends = [],
  footer,
  children,
  className = ''
}) => {
  return (
    <div className={`dash-card ${className}`.trim()}>
      <div className="flex items-start justify-between gap-4">
        <CardHeader icon={icon} title={title} subtitle={subtitle} />
        {(badge || metricLabel || currentValue) && (
          <div className="flex flex-col items-end gap-4">
            {badge && <Badge>{badge}</Badge>}
            {currentValue && <span className="dash-detail text-fg-64">{currentValue}</span>}
          </div>
        )}
      </div>

      <div className="relative w-full flex-1 min-h-0 flex flex-col">
        {children}
      </div>

      <LegendRow legends={legends} />

      {footer && (
        <div className="dash-card__footer">
          <span className="dash-detail text-fg-64">{footer}</span>
        </div>
      )}
    </div>
  )
}

export default DashChartCard
