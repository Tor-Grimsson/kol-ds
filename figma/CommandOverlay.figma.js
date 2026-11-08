// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=744-24387
// source=packages/component/src/organisms/CommandOverlay.jsx
// component=CommandOverlay
import figma from 'figma'

const instance = figma.selectedInstance
const tabs = instance.getEnum('tabs', { "true": "true", "false": "false" })
const anchor = instance.getEnum('anchor', { "true": "true", "false": "false" })
const tb = tabs === 'true' ? ' tabs={tabs} shortcutHint="⌘K"' : ''
const an = anchor === 'true' ? ' anchor={dockRef}' : ''
export default {
  example: figma.code`<CommandOverlay open={open} onClose={close} results={results} suggestions={suggestions} query={query} onQueryChange={setQuery} onSelect={go} placeholder="Search…"${tb}${an} />`,
  imports: ["import { CommandOverlay } from \"@kolkrabbi/kol-component\""],
  id: 'CommandOverlay',
}
