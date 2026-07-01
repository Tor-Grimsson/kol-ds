import { Button } from '@kolkrabbi/kol-component'

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
)

export const Variants = () => (
  <Row>
    {['primary', 'secondary', 'accent', 'outline', 'ghost'].map((v) => (
      <Button key={v} variant={v}>{v}</Button>
    ))}
  </Row>
)

export const Sizes = () => (
  <Row>
    {['sm', 'md', 'lg'].map((s) => (
      <Button key={s} size={s}>Size {s}</Button>
    ))}
  </Row>
)

export const WithIcons = () => (
  <Row>
    <Button iconLeft="check">Confirm</Button>
    <Button iconRight="arrow-right">Next</Button>
    <Button variant="outline" iconOnly="settings-01" aria-label="Settings" />
  </Row>
)

export const States = () => (
  <Row>
    <Button>Default</Button>
    <Button disabled>Disabled</Button>
    <Button selected>Selected</Button>
    <Button quiet iconOnly="more-horizontal" aria-label="More" />
  </Row>
)

export const AsLink = () => (
  <Button href="#" variant="outline" iconRight="external-link">Link button</Button>
)
