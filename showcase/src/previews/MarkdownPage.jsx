import { MarkdownPage } from '@kolkrabbi/kol-framework'
import { TABS, docSource, assetUrl } from 'document-fixture'

export const stage = 'full'

/* The document page on one of kol-atlas's own documents (document-fixture, copied as written): a numbered document
 * with its milestone, phase and item levels, meta lines, marks, and the notes under each passage — every external link
 * a note, as kol-atlas's Project has it. The TOC is off here; a page in a frame publishes it to the frame's rail. */
const PROJECT = TABS.find((t) => t.id === 'project')

export default function MarkdownPagePreview() {
  return (
    <div className="w-full overflow-auto" style={{ maxHeight: 720 }}>
      <MarkdownPage source={docSource(PROJECT.file)} numbered linkNotes toc={false} assetUrl={(name) => assetUrl(PROJECT.file, name)} />
    </div>
  )
}
