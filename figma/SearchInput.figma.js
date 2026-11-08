// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=659-20624
// source=packages/component/src/molecules/SearchInput.jsx
// component=SearchInput
import figma from 'figma'
// variant default (square control) · float (the capsule); outline is a tone mode
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })
const size = instance.getEnum('size', { sm: 'sm', md: 'md', lg: 'lg' })
const placeholder = instance.getString('placeholder')
const hint = instance.getBoolean('kbd') ? ' shortcutHint="⌘K"' : ''
const v = variant === 'float' ? ' variant="float"' : ''
const sz = size !== 'md' ? ` size="${size}"` : ''
export default {
  example: figma.code`<SearchInput${v} value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} placeholder="${placeholder}"${hint}${sz} />`,
  imports: ["import { SearchInput } from \"@kolkrabbi/kol-component\""],
  id: 'SearchInput',
}
