import CardHeader from './_shared/CardHeader'
import { Table } from '@kolkrabbi/kol-component'

const DashTableCard = ({
  title,
  subtitle,
  icon,
  badge,
  columns,
  rows,
  footer,
  className = ''
}) => {
  return (
    <div className={`dash-card ${className}`.trim()}>
      <CardHeader icon={icon} title={title} subtitle={subtitle} />

      <div className="flex-1 min-h-0">
        <Table columns={columns} rows={rows} />
      </div>

      {footer && (
        <div className="dash-card__footer">
          <span className="dash-detail text-fg-64">{footer}</span>
        </div>
      )}
    </div>
  )
}

export default DashTableCard
