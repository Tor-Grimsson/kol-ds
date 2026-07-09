import { ButtonGroup, Button } from '@kolkrabbi/kol-component'

export const stage = 'full'

export default function ButtonGroupDemo() {
  return (
    <div className="flex w-full flex-col gap-10">
      <ButtonGroup title="Ready to start?">
        <Button variant="primary">Get started</Button>
        <Button variant="outline">Learn more</Button>
      </ButtonGroup>
      <ButtonGroup align="left">
        <Button variant="primary">Save changes</Button>
        <Button variant="outline">Discard</Button>
      </ButtonGroup>
    </div>
  )
}
