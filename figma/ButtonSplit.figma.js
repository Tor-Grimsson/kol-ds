// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1632-8621
// source=packages/component/src/molecules/ButtonSplit.jsx
// component=ButtonSplit
import figma from 'figma'

// ButtonSplit (plan-2026-11-12-one-header W4): the main action · a 1px divider · the ⌄ (12) opening the menu of the other
// actions. variant default · float; tone grey is the float well.
const instance = figma.selectedInstance
const float = instance.getEnum('float', { "false": false, "true": true })
const size = instance.getEnum('size', { sm: 'sm', md: 'md', lg: 'lg' })
const grey = instance.getEnum('grey', { "false": '', "true": ' tone="grey"' })

export default {
  example: float
    ? figma.code`<ButtonSplit variant="float"${grey} icon="download" onClick={exportPng} items={[{ label: 'Export loop (webm)', onPress: exportLoop }, { label: 'Record', onPress: record }, { label: 'Batch export', onPress: batch }]}>Export PNG</ButtonSplit>`
    : figma.code`<ButtonSplit${size === 'md' ? '' : ` size="${size}"`} onClick={run} items={items}>Run</ButtonSplit>`,
  imports: ["import { ButtonSplit } from \"@kolkrabbi/kol-component\""],
  id: 'ButtonSplit',
}
