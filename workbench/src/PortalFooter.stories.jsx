import { PortalFooter } from '@kolkrabbi/kol-framework'

/* Zero-prop portal default — the favicon mark + Kolkrabbi credit line. */
export const Minimal = () => <PortalFooter />

const columns = [
  {
    title: 'Menu',
    links: [
      { label: 'Work', href: '#' },
      { label: 'Prints', href: '#' },
      { label: 'Stack', href: '#' },
      { label: 'Foundry', href: '#' },
      { label: 'Studio', href: '#' },
    ],
  },
  {
    title: 'Workshop',
    links: [
      { label: 'Design System', href: '#' },
      { label: 'Components', href: '#' },
      { label: 'Apparat', href: '#' },
      { label: 'Documentation', href: '#' },
    ],
  },
]

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/kolkrabbi_/' },
  { label: 'Behance', href: 'https://www.behance.net/kolkrabbi_' },
  { label: 'Dribbble', href: 'https://dribbble.com/kolkrabbi' },
  { label: 'YouTube', href: 'https://www.youtube.com/@kolkrabbi-io' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@kolkrabbi_' },
]

/* Rich site footer — brand slot (any node), link columns, socials strip, note. */
export const Rich = () => (
  <PortalFooter
    brand={<span className="kol-sans-heading-03 text-auto">Kolkrabbi</span>}
    columns={columns}
    socials={socials}
    note={`© ${new Date().getFullYear()} Kolkrabbi`}
  />
)
