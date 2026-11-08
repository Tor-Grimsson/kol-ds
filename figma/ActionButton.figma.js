// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1265-5297
// source=packages/component/src/molecules/ActionButton.jsx
// component=ActionButton
import figma from 'figma'
// state rest → done: the rest glyph crossfades to the confirm glyph after onAction
const instance = figma.selectedInstance
const state = instance.getEnum('state', { "rest": "rest", "done": "done" })
export default {
  example: figma.code`<ActionButton icon="copy" confirmIcon="check" label="Copy" confirmLabel="Copied" size="sm" onAction={copy} />`,
  imports: ["import { ActionButton } from \"@kolkrabbi/kol-component\""],
  id: 'ActionButton',
}
