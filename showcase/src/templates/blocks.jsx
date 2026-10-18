import { Link } from 'react-router-dom'
import { DocHeader, DocSection } from '@kolkrabbi/kol-workshop'
import { SectionText, Table } from '@kolkrabbi/kol-component'

/* THE BLOCKS a template body is made of (2026-10-17 — user: "text, media, iframe, importing layouts (media),
 * headings, sections, etc."). Each is a live specimen; a template page links to the ones it uses. */
const link = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'

export const TEMPLATE_BLOCKS = [
  { slug: 'heading', title: 'Heading', description: 'A page or section title with its eyebrow and lede.', builtFrom: ['DocHeader (kol-workshop)'],
    Preview: () => <DocHeader eyebrow="References" title="Tokens" lede="230 tokens, ranked by weighted inbound." /> },
  { slug: 'text', title: 'Text', description: 'Label, headline and body — the ruled text block.', builtFrom: ['SectionText'],
    Preview: () => <SectionText label="CLEAR SPACE" headline="The logomark is the unit" headlineSize="heading-04" body="Clear space equals the logomark's height on every side." /> },
  { slug: 'section', title: 'Section', description: 'A titled section with an anchor the right rail lists.', builtFrom: ['DocSection (kol-workshop)'],
    Preview: () => <DocSection id="how-to-read-this" title="How to read this"><p>An edge exists only if changing the node would change the dependent.</p></DocSection> },
  { slug: 'media', title: 'Media', description: 'An image or video in its container, with a caption.', builtFrom: ['kol-doc-figure'],
    Preview: () => <figure className="kol-doc-figure flex flex-col items-center justify-center gap-2" style={{ height: 200 }}><span className="kol-mono-12 text-meta">image · video</span></figure> },
  { slug: 'table', title: 'Table', description: 'Rows of facts with a caption; sortable columns opt in.', builtFrom: ['Table'],
    Preview: () => <Table width="column" caption="Minimum sizes" columns={[{ accessor: 'mark', header: 'Mark' }, { accessor: 'screen', header: 'Screen' }]} rows={[{ id: 'a', mark: 'Logomark', screen: '16 px' }, { id: 'b', mark: 'Wordmark', screen: '64 px' }]} /> },
  { slug: 'link-list', title: 'Link list', description: 'Pages as links, one line each.', builtFrom: ['Link + kol-doc-body'],
    Preview: () => <div className="flex flex-col gap-2"><p><Link to="/references" className={link}>References</Link> <span className="text-meta">— what depends on what.</span></p><p><Link to="/quarantine" className={link}>Quarantine</Link> <span className="text-meta">— what the sidebar holds.</span></p></div> },
  { slug: 'iframe', title: 'Iframe', description: 'Another page, live, inside this one (`?embed=1` drops its chrome).', builtFrom: ['iframe + ?embed=1'],
    Preview: () => <iframe title="embedded page" src="/icons/kol-icon-set-interface/chevron?embed=1" className="block w-full border border-fg-08 rounded" style={{ height: 320 }} /> },
  { slug: 'imported-layout', title: 'Imported layout', description: 'A whole layout from another system, with its own header — the media browser.', builtFrom: ['MediaLibrary'],
    Preview: () => <iframe title="media browser" src="/components/preview/MediaLibrary" className="block w-full border border-fg-08 rounded" style={{ height: 480 }} /> },
]
