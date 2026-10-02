import { TagPath } from '@kolkrabbi/kol-workshop'

export default function TagPathPreview() {
  return (
    <div className="flex flex-col gap-2 kol-mono-12">
      <span><TagPath tag="domain/components/atoms" /></span>
      <span><TagPath tag="#pattern/action" /></span>
      <span><TagPath tag="search" /></span>
    </div>
  )
}
