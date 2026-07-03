import { ProductDetailLayout, Button } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Product panel',
  description: 'A product detail layout for an art print — media gallery, price, specs, tabs, quantity and add-to-cart',
  category: 'panel',
}
export const stage = 'full'

/* ProductDetailLayout is a slot skeleton: it composes PriceDisplay, SpecList,
 * TabsRow, Dropdown and QuantityInput internally from the props below, and
 * takes the media frames + CTA as slots. Everything here is inline fixture data
 * for a single fictional art print — no network, no required props. The prints
 * carry their own fixed palette (art is art regardless of UI theme). */
function PrintFrame({ children, bg }) {
  return (
    <div
      className="aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[var(--kol-radius-md)] border border-fg-08 shadow-[0_24px_64px_rgba(0,0,0,0.18)]"
      style={{ background: bg }}
    >
      <svg viewBox="0 0 400 500" width="100%" height="100%" role="img" aria-label="Art print artwork">
        {children}
      </svg>
    </div>
  )
}

const MEDIA = [
  <PrintFrame key="horizon" bg="#F4EDE2">
    <circle cx="200" cy="205" r="118" fill="#E4633A" />
    <rect x="0" y="322" width="400" height="178" fill="#2C2A26" />
    <rect x="0" y="300" width="400" height="24" fill="#C9A24B" />
  </PrintFrame>,
  <PrintFrame key="riso" bg="#EDE7DC">
    <circle cx="150" cy="200" r="120" fill="#3B6EA5" fillOpacity="0.85" />
    <circle cx="250" cy="270" r="120" fill="#E4633A" fillOpacity="0.75" />
    <circle cx="200" cy="150" r="90" fill="#C9A24B" fillOpacity="0.7" />
  </PrintFrame>,
  <PrintFrame key="strata" bg="#22201C">
    <rect x="0" y="0" width="400" height="500" fill="#22201C" />
    {[0, 1, 2, 3, 4, 5].map((row) => (
      <rect
        key={row}
        x="-40"
        y={40 + row * 78}
        width="480"
        height="34"
        transform={`rotate(-12 200 ${57 + row * 78})`}
        fill={['#E4633A', '#C9A24B', '#F4EDE2', '#3B6EA5', '#C9A24B', '#E4633A'][row]}
        fillOpacity="0.9"
      />
    ))}
  </PrintFrame>,
]

const SPECS = [
  { label: 'Edition', value: 'Limited (30)' },
  { label: 'Size', value: 'A2 · 420 × 594 mm' },
  { label: 'Paper', value: 'Hahnemühle 308 gsm' },
]

const TABS = [
  {
    id: 'description',
    label: 'Description',
    content: (
      <p>
        A ten-color giclée pulled from a hand-built risograph study. Each sheet is printed to order on
        heavyweight cotton rag, then signed and numbered on the reverse. Colours are matched under D50
        light so the orange holds its warmth from gallery to living room.
      </p>
    ),
  },
  {
    id: 'shipping',
    label: 'Shipping',
    content: (
      <p>
        Ships flat in a rigid board mailer within five working days. Tracked worldwide from Reykjavík;
        EU and UK duties are prepaid at checkout. Framed orders add one week and ship double-boxed.
      </p>
    ),
  },
]

export default function ProductPanel() {
  return (
    <ProductDetailLayout
      mediaItems={MEDIA}
      eyebrow="Risograph series"
      title="Horizon No. 4"
      tags={['Giclée', 'Signed', 'Numbered']}
      specs={SPECS}
      tabs={TABS}
      price={{ amount: 180, currency: 'EUR', secondary: '(unframed · incl. VAT)' }}
      sizeOptions={['A3', 'A2', 'A1']}
      defaultSize="A2"
      defaultQuantity={1}
      minQuantity={1}
      maxQuantity={10}
      actions={
        <Button variant="primary" size="lg" className="w-full" onClick={() => {}}>
          Add to cart
        </Button>
      }
      shippingNote="Free tracked shipping on orders over €150."
      backLink={
        <a href="#catalogue" onClick={(event) => event.preventDefault()} className="kol-mono-xs text-fg-48 hover:text-emphasis">
          ← Back to catalogue
        </a>
      }
    />
  )
}
