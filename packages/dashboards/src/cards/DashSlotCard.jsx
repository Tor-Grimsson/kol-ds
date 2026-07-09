import CardHeader from './_shared/CardHeader'

const DashSlotCard = ({
  title,
  subtitle,
  icon,
  chart,
  items = [],
  footer,
  className = ''
}) => {
  return (
    <div className={`dash-card ${className}`.trim()}>
      <CardHeader icon={icon} title={title} subtitle={subtitle} />

      {chart && (
        <div className="relative w-full flex-1 min-h-0 overflow-hidden">
          {chart}
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <span className="dash-caption text-fg-80">{item.label}</span>
              <span className="dash-caption text-fg-88">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {footer && (
        <div className="dash-card__footer">
          <div className="flex justify-between items-center">
            <span className="dash-detail text-fg-80">{footer.label}</span>
            <span className="dash-detail text-fg-88">{footer.value}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashSlotCard
