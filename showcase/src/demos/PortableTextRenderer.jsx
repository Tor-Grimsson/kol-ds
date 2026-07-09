import { PortableTextRenderer } from '@kolkrabbi/kol-content'

export const stage = 'full'

const blocks = [
  { type: 'heading', level: 2, text: 'Composing long-form content' },
  {
    type: 'paragraph',
    text: [
      'The renderer walks a flat block array and maps each entry to a prose tag or a design-system component. Inline marks like ',
      { mark: 'link', href: '#', text: 'links' },
      ' and segment titles are supported through the array text form.',
    ],
  },
  {
    type: 'list',
    style: 'bullet',
    items: [
      'Headings become anchored h2/h3 tags',
      'Custom blocks resolve to design-system components',
      'Unknown block types are skipped, never thrown',
    ],
  },
  {
    type: 'code',
    language: 'js',
    code: "const doc = [{ type: 'heading', text: 'Hello' }]\nrender(doc)",
  },
  {
    type: 'quote',
    text: 'Structure the content once; the stylesheet renders it everywhere the same way.',
    cite: 'KOL prose guidelines',
  },
]

export default function PortableTextRendererDemo() {
  return <PortableTextRenderer blocks={blocks} />
}
