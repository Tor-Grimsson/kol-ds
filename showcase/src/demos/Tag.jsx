import { Tag } from '@kolkrabbi/kol-component'

export default function TagDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag>design</Tag>
      <Tag>system</Tag>
      <Tag solid>kol</Tag>
      <Tag hash={false}>plain</Tag>
    </div>
  )
}
