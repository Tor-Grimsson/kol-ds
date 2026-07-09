import { Badge } from '@kolkrabbi/kol-component'
import CardHeader from './_shared/CardHeader'
import LegendRow from './_shared/LegendRow'

const DashFeaturedCard = ({
  badge,
  title,
  icon,
  description,
  metricLabel,
  metricValue,
  chart,
  legends = [],
  className = ''
}) => {
  return (
    <div className={`dash-card ${className}`.trim()}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          {badge && <Badge className="self-start">{badge}</Badge>}
          <CardHeader icon={icon} title={title} subtitle={description} />
        </div>
        {metricValue && (
          <div className="text-right">
            <span className="dash-detail text-fg-64">{metricLabel}</span>
            <p className="dash-value">{metricValue}</p>
          </div>
        )}
      </div>

      {chart && (
        <div className="flex-1 flex flex-col gap-3">
          {chart}
        </div>
      )}

      <LegendRow legends={legends} wrap />
    </div>
  )
}

export default DashFeaturedCard
