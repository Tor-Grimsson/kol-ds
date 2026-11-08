// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1269-5710
// source=packages/workshop/src/shell/ShellSidebar.jsx
// component=ShellSidebar
import figma from 'figma'
// mode comes from ShellRailModeContext: open (RailSection + RailRow) · icons (a Button nav per route)
const instance = figma.selectedInstance
const mode = instance.getEnum('mode', { "open": "open", "icons": "icons" })
export default {
  example: mode === 'icons'
    ? figma.code`<ShellRailModeContext.Provider value="icons"><ShellSidebar routes={routes} basePath="/" /></ShellRailModeContext.Provider>`
    : figma.code`<ShellSidebar routes={routes} basePath="/" label="Documentation" />`,
  imports: ["import { ShellSidebar, ShellRailModeContext } from \"@kolkrabbi/kol-workshop\""],
  id: 'ShellSidebar',
}
