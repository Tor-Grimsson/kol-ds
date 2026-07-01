import { Badge } from '@kolkrabbi/kol-component'

export default function BadgeWithIconDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="success" icon="check">Verified</Badge>
      <Badge variant="warning" icon="alert-triangle">Pending</Badge>
      <Badge variant="critical" icon="x">Failed</Badge>
    </div>
  )
}
