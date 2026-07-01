import { SectionLabel } from '@kolkrabbi/kol-component'

const Col = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</div>
)

export const Default = () => <SectionLabel text="Featured Work" />

export const Sizes = () => (
  <Col>
    {['sm', 'md', 'lg'].map((s) => (
      <SectionLabel key={s} text="Featured Work" size={s} />
    ))}
  </Col>
)

export const LongText = () => (
  <SectionLabel text="Selected projects, experiments and collaborations" />
)
