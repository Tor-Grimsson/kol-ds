import { Icon } from '@kolkrabbi/kol-icons'

const CardHeader = ({ icon, title, subtitle }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {icon && <Icon name={icon} size={24} className="text-oq-88" />}
        <span className="dash-title">{title}</span>
      </div>
      {/* dash-lede, not dash-detail: the subtitle is a sentence that WRAPS, and
        * dash-detail is line-height-1 single-line chrome (DashDetailWrapsWithoutLeading).
        * And not dash-subtitle — that is the 16→22 medium SUB-HEADING, a different voice. */}
      {subtitle && <span className="dash-lede text-fg-64">{subtitle}</span>}
    </div>
  )
}

export default CardHeader
