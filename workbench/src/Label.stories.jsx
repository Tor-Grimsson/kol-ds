import { Label } from '@kolkrabbi/kol-component'

const Col = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
)

export const Default = () => <Label>Display name</Label>

export const WithControl = () => (
  <Col>
    <Label htmlFor="email">Email address</Label>
    <input id="email" type="email" placeholder="you@example.com" />
  </Col>
)

export const TypeClasses = () => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
    <Label className="kol-helper-10">Helper 10</Label>
    <Label className="text-fg-48">Muted default</Label>
  </div>
)
