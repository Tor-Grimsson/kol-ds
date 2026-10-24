import { CategoryPage } from '@kolkrabbi/kol-framework'

export const stage = 'full'

const strip = (colors) => <div className="flex size-full">{colors.map((c) => <span key={c} className="flex-1" style={{ background: c }} />)}</div>

/* the rail's tree, as SideNav reads it — a page row's `card` puts it on its category's overview; the
 * overview row itself (no card) is the link the rail opens. The `to`s here are hashes so the preview
 * stays on this page. */
const NAV = [
  { id: 'research', label: 'Research', icon: 'bookmark', lede: 'Three shapes of a research page: a comparison, a document, a board gallery.', pages: [
    { to: '#overview', label: 'Overview' },
    { to: '#compare', label: 'Compare', card: { eyebrow: 'Compare', body: 'Three ramps on one stop set, lined up by the page\'s own controls.', meta: '3 ramps', media: strip(['#F8F8F8', '#D9D9D9', '#A3A3A4', '#5B5B5D', '#2E2E30', '#121215']) } },
    { to: '#sheet', label: 'Sheet', card: { eyebrow: 'Document', body: 'The document voice, shown on itself: headings, meta lines, footnotes, the outline.', meta: '6 headings', media: strip(['#F3EADF', '#E8D9C6']) } },
    { to: '#boards', label: 'Boards', card: { eyebrow: 'Gallery', body: 'Every board the brand carries, by set, at its own aspect.', meta: '18 boards', media: strip(['#7A1F2B', '#A3313F', '#C9565F']) } },
  ] },
]

/* The foldernote: a rail category's overview from the nav tree — its label and lede over its pages as
 * the article card. Nothing listed by hand; a page added to the rail is on the overview the same moment. */
export default function CategoryPagePreview() {
  // .kol-page-hero is min-h-72dvh by design — collapse it for the preview.
  return (
    <div className="w-full [&_.kol-page-hero]:min-h-0 [&_.kol-page-hero]:py-8">
      <CategoryPage navTree={NAV} id="research" />
    </div>
  )
}
