import { DocumentIndex } from '@kolkrabbi/kol-styleguide'
import { TABS, assetUrl } from 'document-fixture'

export const stage = 'full'

/* A folder's pages as the brand book's contents cards: kol-atlas's Reference group from the document fixture's tab
 * table, each card's eyebrow its parent page. The `to`s are hashes so the preview stays on this page. The last part is
 * the folder's files — two of the fixture's images as `documentFiles` rows would come — a click opens the Quick Look. */
const MEDIA = TABS.find((t) => t.id === 'media')
const FILES = [['logomarks-wall.svg', 'Logomarks wall'], ['ref-logomarks-2.jpg', 'Logomarks 2']].map(([f, title]) => ({ id: f, file: assetUrl(MEDIA.file, f), title, ext: f.split('.').pop(), kind: 'image', part: 'Files' }))
const ROWS = [...TABS.filter((t) => t.group === 'Reference' || t.parent).map((t) => ({ id: t.id, to: `#${t.id}`, label: t.parent ? TABS.find((p) => p.id === t.parent)?.title : undefined, title: t.title, part: t.parent ? 'Entries' : 'Pages' })), ...FILES]

export default function DocumentIndexPreview() {
  return (
    <div className="w-full">
      <DocumentIndex rows={ROWS} title="Reference" lede="The client's reading: brief, brand summary, updates and the research papers." onNavigate={() => {}} />
    </div>
  )
}
