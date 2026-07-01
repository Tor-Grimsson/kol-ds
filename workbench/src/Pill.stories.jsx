import { Pill } from '@kolkrabbi/kol-component'

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
)

export const Variants = () => (
  <Row>
    {['outline', 'subtle', 'inverse'].map((v) => (
      <Pill key={v} variant={v}>{v}</Pill>
    ))}
  </Row>
)

export const Sizes = () => (
  <Row>
    <Pill size="sm">Small</Pill>
    <Pill size="md">Medium</Pill>
    <Pill size="lg">Large</Pill>
  </Row>
)
