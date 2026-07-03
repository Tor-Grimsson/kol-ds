import { PortalFooter } from '@kolkrabbi/kol-framework'

export const stage = 'full'

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

/* Rich configuration — brand slot, link columns, socials strip, legal note.
   Zero-prop <PortalFooter /> stays the minimal favicon + credit line. */
export default function PortalFooterDemo() {
  return (
    <PortalFooter
      brand={
        <a href="https://kolkrabbi.io" target="_blank" rel="noopener" aria-label="Kolkrabbi Vinnustofa">
          <img src="/favicon/favicon.svg" alt="" width="40" height="40" />
        </a>
      }
      columns={columns}
      socials={socials}
      note={`© ${new Date().getFullYear()} Kolkrabbi`}
    />
  )
}
