import { DocumentationReader } from '@kolkrabbi/kol-workshop'
import { HOMES, HOME_MODULES } from '../lib/HomeDoc.jsx'

export const stage = 'full'

/* The markdown reader over one real document — the Lookup home — with its frontmatter panel. */
export default function DocumentationReaderPreview() {
  return (
    <DocumentationReader
      inventory={HOMES}
      modules={HOME_MODULES}
      docId="lookup"
      showFrontmatter
      rail={false}
      docHref={(id) => `/documentation/${id}`}
      routes={{ docsIndex: '/docs', components: '/components', docFilePath: (d) => `showcase/src/homes/${d}.md` }}
    />
  )
}
