import { Avatar } from '@kolkrabbi/kol-component'

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
)

export const Sizes = () => (
  <Row>
    {['sm', 'md', 'lg', 'xl'].map((s) => (
      <Avatar key={s} initial="K" size={s} />
    ))}
  </Row>
)

export const Initials = () => (
  <Row>
    <Avatar initial="A" size="lg" />
    <Avatar initial="G" size="lg" />
    <Avatar initial="TG" size="lg" />
    <Avatar initial="" size="lg" />
  </Row>
)
