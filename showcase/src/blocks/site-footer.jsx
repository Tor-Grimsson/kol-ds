import { PortalFooter } from '@kolkrabbi/kol-framework'

export const meta = {
  title: 'Site footer',
  description: 'The rich portal footer with a brand block, link columns, socials and a legal note',
  category: 'footer',
}
export const stage = 'full'

/* Inline data, plain <a href> — router-agnostic. Socials pass label-only, so
 * they render as text links (the footer feeds each label into aria-label). */
const COLUMNS = [
  {
    title: 'Catalogue',
    links: [
      { label: 'Art prints', href: '#prints' },
      { label: 'Limited editions', href: '#editions' },
      { label: 'Studies', href: '#studies' },
      { label: 'Gift cards', href: '#gift-cards' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'About the studio', href: '#about' },
      { label: 'Journal', href: '#journal' },
      { label: 'Exhibitions', href: '#exhibitions' },
      { label: 'Stockists', href: '#stockists' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Shipping & returns', href: '#shipping' },
      { label: 'Framing guide', href: '#framing' },
      { label: 'Care instructions', href: '#care' },
      { label: 'Contact', href: '#contact' },
    ],
  },
]

const SOCIALS = [
  { label: 'Instagram', href: '#instagram' },
  { label: 'Are.na', href: '#arena' },
  { label: 'Newsletter', href: '#newsletter' },
]

export default function SiteFooter() {
  return (
    <div className="flex h-full min-h-full w-full flex-col justify-end bg-surface-primary">
      <PortalFooter
        brand={
          <div className="flex max-w-xs flex-col gap-3">
            <span className="kol-sans-heading-02 text-emphasis">Kolkrabbi</span>
            <p className="kol-mono-12 text-fg-48">
              Archival art prints and limited editions, printed and shipped from the studio in Reykjavík.
            </p>
          </div>
        }
        columns={COLUMNS}
        socials={SOCIALS}
        note="© 2026 Kolkrabbi Vinnustofa. All rights reserved."
      />
    </div>
  )
}
