// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1269-5710
// source=packages/workshop/src/shell/ShellRail.jsx
// component=ShellRail
import figma from 'figma'
// mode comes from ShellRailModeContext: open (RailSection + RailRow) · icons (a Button nav per route)
const instance = figma.selectedInstance
const mode = instance.getEnum('mode', { "open": "open", "icons": "icons" })
export default {
  example: mode === 'icons'
    ? figma.code`<ShellRailModeContext.Provider value="icons"><ShellRail routes={routes} basePath="/" /></ShellRailModeContext.Provider>`
    : figma.code`<ShellRail routes={routes} basePath="/" label="Documentation" />`,
  imports: ["import { ShellRail, ShellRailModeContext } from \"@kolkrabbi/kol-workshop\""],
  id: 'ShellRail',
}
