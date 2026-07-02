import { Button } from '@kolkrabbi/kol-component'

export default function ButtonDemo() {
  return (
    <>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="primary" iconLeft="plus">New</Button>
      <Button variant="outline" iconOnly="settings-01" />
    </>
  )
}
