import { Tooltip, Button } from '@kolkrabbi/kol-component'

export default function TooltipPreview() {
  return (
    <>
      <Tooltip label="Add item" shortcut="N" placement="bottom">
        <Button tone="outline" iconOnly="plus" />
      </Tooltip>
      <Tooltip label="Settings" placement="top">
        <Button tone="ghost" iconOnly="settings-01" />
      </Tooltip>
    </>
  )
}
