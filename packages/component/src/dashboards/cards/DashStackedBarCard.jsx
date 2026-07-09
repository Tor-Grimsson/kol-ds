import { Icon } from '@kolkrabbi/kol-icons'

const DashStackedBarCard = ({
  title,
  value,
  data = [],
  icon,
  label,
  trend,
  footerLeft,
  footerRight,
  className = ''
}) => {
  const compact = !!icon

  return (
    <div className={`dash-card ${className}`.trim()}>
      {compact ? (
        <>
          <div className="flex justify-between items-center">
            <span className="dash-detail text-fg-88">{title}</span>
            <Icon name={icon} size={24} className="text-fg-88" />
          </div>
          <div className="flex items-end gap-3">
            <span className="dash-subtitle">{value}</span>
            {label && <span className="dash-detail text-fg-64 mb-1">{label}</span>}
            {trend && (
              <Icon
                name={trend === 'up' ? 'trending-up' : 'trending-down'}
                size={16}
                className="text-fg-64 mb-1"
              />
            )}
          </div>
        </>
      ) : (
        <>
          <span className="dash-detail text-fg-88">{title}</span>
          <span className="dash-subtitle">{value}</span>
        </>
      )}

      <div className="flex-1 flex items-stretch gap-1 min-h-[80px]">
        {data.map((item, i) => {
          const winRate = item.total > 0 ? (item.win / item.total) * 100 : 0
          const drawRate = item.total > 0 ? (item.draw / item.total) * 100 : 0
          const lossRate = item.total > 0 ? (item.loss / item.total) * 100 : 0

          return (
            <div key={i} className="flex-1 flex flex-col gap-0.5">
              <div className="flex-1" />
              <div className="rounded-sm" style={{ flex: `${winRate} 0 0`, background: 'var(--kol-palette-green)' }} />
              <div className="rounded-sm" style={{ flex: `${drawRate} 0 0`, background: 'var(--kol-palette-blue)' }} />
              <div className="rounded-sm" style={{ flex: `${lossRate} 0 0`, background: 'var(--kol-palette-red)' }} />
            </div>
          )
        })}
      </div>

      {(footerLeft || footerRight) && (
        <div className="flex justify-between items-center">
          {footerLeft && <span className="dash-detail text-fg-64">{footerLeft}</span>}
          {footerRight && <span className="dash-detail text-fg-64">{footerRight}</span>}
        </div>
      )}
    </div>
  )
}

export default DashStackedBarCard
