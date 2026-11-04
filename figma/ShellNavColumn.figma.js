// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=370-10261
// source=packages/workshop/src/shell/ShellLayout.jsx
// component=ShellNavColumn
import figma from 'figma'

export default {
  example: figma.code`<ShellNavColumn mode="open">{(mode) => <ShellSidebar routes={routes} basePath="/" />}</ShellNavColumn>`,
  imports: ["import { ShellNavColumn, ShellSidebar } from \"@kolkrabbi/kol-workshop\""],
  id: 'ShellNavColumn',
}
