// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-14165
// source=packages/shell/src/CatalogGrid.jsx
// component=CatalogGrid
import figma from 'figma'

// CatalogGrid variant="kolbox" (kolbox's FileGrid) round ContentCard kolbox. (F4, 2026-11-19)
const instance = figma.selectedInstance
const example = figma.code`<CatalogGrid variant="kolbox">{files.map((file) => <ContentCard variant="kolbox" key={file.id} file={file} onOpen={onOpen} />)}</CatalogGrid>`

export default {
  example,
  imports: ["import { CatalogGrid } from \"@kolkrabbi/kol-shell\"", "import { ContentCard } from \"@kolkrabbi/kol-component\""],
  id: 'CatalogGridKolbox',
  metadata: { nestable: true },
}
