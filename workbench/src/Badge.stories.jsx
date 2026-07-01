import { Badge } from '@kolkrabbi/kol-component'

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
)

export const Variants = () => (
  <Row>
    {['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'critical', 'info'].map((v) => (
      <Badge key={v} variant={v}>{v}</Badge>
    ))}
  </Row>
)

export const Sizes = () => (
  <Row>
    <Badge size="sm">Small</Badge>
    <Badge size="md">Medium</Badge>
    <Badge size="lg">Large</Badge>
  </Row>
)

export const WithIcon = () => (
  <Row>
    <Badge icon="check" variant="success">Passed</Badge>
    <Badge icon="x" variant="destructive">Failed</Badge>
    <Badge icon="settings-01" variant="outline">Config</Badge>
  </Row>
)
