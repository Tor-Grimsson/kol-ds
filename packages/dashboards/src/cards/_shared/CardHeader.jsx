import { Icon } from '@kolkrabbi/kol-icons'

const CardHeader = ({ icon, title, subtitle }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {icon && <Icon name={icon} size={24} className="text-fg-88" />}
        <span className="dash-title">{title}</span>
      </div>
      {subtitle && <span className="dash-detail text-fg-64">{subtitle}</span>}
    </div>
  )
}

export default CardHeader
