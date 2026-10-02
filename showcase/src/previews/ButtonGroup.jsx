import { ButtonGroup, Button } from '@kolkrabbi/kol-component'

export const stage = 'full'

export default function ButtonGroupPreview() {
  return (
    <div className="flex w-full flex-col gap-10">
      <ButtonGroup title="Ready to start?">
        <Button tone="primary">Get started</Button>
        <Button tone="outline">Learn more</Button>
      </ButtonGroup>
      <ButtonGroup align="left">
        <Button tone="primary">Save changes</Button>
        <Button tone="outline">Discard</Button>
      </ButtonGroup>
    </div>
  )
}
