// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=570-19825
// source=packages/shell/src/GlobalActions.jsx
// component=GlobalActions
import figma from 'figma'

const instance = figma.selectedInstance

export default {
  example: figma.code`<GlobalActions onUndo={undo} onRedo={redo} onAction={exportScene} onAccount={openAccount} />`,
  imports: ["import { GlobalActions } from \"@kolkrabbi/kol-shell\""],
  id: 'GlobalActions',
}
