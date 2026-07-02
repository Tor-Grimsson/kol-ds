import { Tag } from '@kolkrabbi/kol-component'

export default function TagDemo() {
  return (
    <>
      <Tag>design</Tag>
      <Tag>system</Tag>
      <Tag solid>kol</Tag>
      <Tag hash={false}>plain</Tag>
    </>
  )
}
