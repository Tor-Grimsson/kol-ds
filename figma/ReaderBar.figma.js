// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=571-20208
// source=packages/shell/src/ReaderBar.jsx
// component=ReaderBar
import figma from 'figma'

const instance = figma.selectedInstance

export default {
  example: figma.code`<ReaderBar path={['My library', 'The Waves']} onBack={back} onContents={contents} onSearch={search} onBookmark={bookmark} onTools={tools} />`,
  imports: ["import { ReaderBar } from \"@kolkrabbi/kol-shell\""],
  id: 'ReaderBar',
}
