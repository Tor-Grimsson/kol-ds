// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=10-39
// source=packages/component/src/organisms/CommandOverlay.jsx
// component=CommandOverlay
import figma from 'figma'

export default {
  example: figma.code`<CommandOverlay open={open} onClose={close} results={results} suggestions={suggestions} query={query} onQueryChange={setQuery} onSelect={go} placeholder="Search…" />`,
  imports: ["import { CommandOverlay } from \"@kolkrabbi/kol-component\""],
  id: 'CommandOverlay',
}
