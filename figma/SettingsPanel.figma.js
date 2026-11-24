// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1383-11577
// source=packages/component/src/organisms/SettingsPanel.jsx
// component=SettingsPanel
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('overlay', { "true": "overlay", "false": "rail" })
const v = variant === 'overlay' ? ' variant="overlay"' : ''

export default {
  example: figma.code`<SettingsPanel open={open}${v} title={title} onClose={onClose} footer={<SettingsFooter onReset={reset} />}>{sections}</SettingsPanel>`,
  imports: ["import { SettingsPanel, SettingsFooter } from \"@kolkrabbi/kol-component\""],
  id: 'SettingsPanel',
}
