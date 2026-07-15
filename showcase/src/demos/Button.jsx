import { Button } from '@kolkrabbi/kol-component'

export default function ButtonDemo() {
  return (
    <>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="grey">Grey</Button>
      <Button variant="primary" iconLeft="plus">New</Button>
      <Button variant="outline" iconOnly="settings-01" />
    </>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  return <Button variant="primary">Button</Button>
}
