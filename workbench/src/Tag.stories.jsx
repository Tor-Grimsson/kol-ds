import { useState } from 'react'
import { Tag } from '@kolkrabbi/kol-component'

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
)

export const Variants = () => (
  <Row>
    {['default', 'naked', 'inverse', 'solid'].map((v) => (
      <Tag key={v} variant={v}>{v}</Tag>
    ))}
  </Row>
)

export const Sizes = () => (
  <Row>
    <Tag size="sm">small</Tag>
    <Tag size="md">medium</Tag>
    <Tag size="lg">large</Tag>
  </Row>
)

export const States = () => (
  <Row>
    <Tag active>active</Tag>
    <Tag solid>solid</Tag>
    <Tag hash={false}>no-hash</Tag>
    <Tag icon="check">verified</Tag>
  </Row>
)

export const Removable = () => {
  const [tags, setTags] = useState(['draft', 'review', 'final'])
  return (
    <Row>
      {tags.map((t) => (
        <Tag key={t} onRemove={() => setTags((prev) => prev.filter((x) => x !== t))}>
          {t}
        </Tag>
      ))}
    </Row>
  )
}
