// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=659-20624
// source=packages/component/src/molecules/SearchInput.jsx
// component=SearchInput
import figma from 'figma'

const instance = figma.selectedInstance
// variant float (2026-11-04): the capsule on the float well, the ⌘K cap drawn from shortcutHint
const size = instance.getEnum('size', { sm: 'sm', md: 'md', lg: 'lg' })
const placeholder = instance.getString('placeholder')
const kbd = instance.getBoolean('kbd')
const sz = size !== 'md' ? ` size="${size}"` : ''
const hint = kbd ? ' shortcutHint="⌘K"' : ''

export default {
  example: figma.code`<SearchInput variant="float" value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} placeholder="${placeholder}"${hint}${sz} />`,
  imports: ["import { SearchInput } from \"@kolkrabbi/kol-component\""],
  id: 'SearchInput',
}
