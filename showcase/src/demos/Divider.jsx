import { Divider } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function DividerDemo() {
  return (
    <div className="flex w-full max-w-xs items-center gap-6">
      <div className="flex-1">
        <Divider />
      </div>
      <div className="flex h-10 items-stretch">
        <Divider variant="vertical" />
      </div>
      <div className="flex-1">
        <Divider opacity="24" />
      </div>
    </div>
  )
}
