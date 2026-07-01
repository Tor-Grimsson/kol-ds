import { Button } from '@kolkrabbi/kol-component'

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="primary" iconLeft="plus">New</Button>
      <Button variant="outline" iconOnly="settings-01" />
    </div>
  )
}
