import { Tooltip, Button } from '@kolkrabbi/kol-component'

export default function TooltipDemo() {
  return (
    <>
      <Tooltip label="Add item" shortcut="N" placement="bottom">
        <Button variant="outline" iconOnly="plus" />
      </Tooltip>
      <Tooltip label="Settings" placement="top">
        <Button variant="ghost" iconOnly="settings-01" />
      </Tooltip>
    </>
  )
}
