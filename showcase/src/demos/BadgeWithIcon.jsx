import { Badge } from '@kolkrabbi/kol-component'

export default function BadgeWithIconDemo() {
  return (
    <>
      <Badge variant="success" icon="check">Verified</Badge>
      <Badge variant="warning" icon="alert-triangle">Pending</Badge>
      <Badge variant="critical" icon="x">Failed</Badge>
    </>
  )
}
