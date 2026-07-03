import { ProductDetailLayout, Button } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* Rendered inline-SVG frames — used as the big image and the thumbnail strip.
 * maxWidth/maxHeight let the same node shrink into the thumbnail buttons. */
const frame = (label, bg, fg, key) => (
  <svg
    key={key}
    viewBox="0 0 320 400"
    width="320"
    height="400"
    xmlns="http://www.w3.org/2000/svg"
    style={{ maxWidth: '100%', maxHeight: '100%' }}
  >
    <rect width="320" height="400" fill={bg} />
    <circle cx="160" cy="170" r="90" fill="none" stroke={fg} strokeWidth="2" />
    <path d="M50 300 L160 200 L270 300" fill="none" stroke={fg} strokeWidth="2" />
    <rect x="115" y="125" width="90" height="90" fill={fg} opacity="0.15" />
    <text x="24" y="48" fill={fg} fontFamily="monospace" fontSize="16">
      {label}
    </text>
  </svg>
)

const MEDIA = [
  frame('PLATE 01', '#1a1712', '#e8df00', 'a'),
  frame('PLATE 02', '#0e1a1a', '#5fd0c0', 'b'),
  frame('PLATE 03', '#1a0e14', '#ff6b9d', 'c'),
]

export default function ProductDetailLayoutDemo() {
  return (
    <ProductDetailLayout
      mediaItems={MEDIA}
      eyebrow="Limited Edition"
      title="Hverfjall Study No. 3"
      tags={['Giclée', 'Archival', 'Signed']}
      specs={[
        { label: 'Edition', value: 'Limited (30)' },
        { label: 'Paper', value: 'Hahnemühle 310gsm' },
        { label: 'Sizes', value: 'A3, A2, A1' },
        { label: 'Finish', value: 'Matte' },
      ]}
      tabs={[
        {
          id: 'about',
          label: 'About',
          content: (
            <p>
              A quiet study of the Hverfjall crater rim, drawn from a week of field
              sketches and printed on archival cotton rag.
            </p>
          ),
        },
        {
          id: 'shipping',
          label: 'Shipping',
          content: (
            <p>Rolled in a rigid tube and shipped within 5–7 working days.</p>
          ),
        },
      ]}
      price={{ amount: 180, currency: 'EUR', secondary: '(~24.900 ISK)' }}
      sizeOptions={['A3', 'A2', 'A1']}
      actions={
        <Button variant="primary" className="w-full">
          Add to cart
        </Button>
      }
      shippingNote="Free EU shipping over €150."
      backLink={
        <a href="#" className="kol-mono-12 text-fg-48" onClick={(e) => e.preventDefault()}>
          ← Back to catalogue
        </a>
      }
    />
  )
}
