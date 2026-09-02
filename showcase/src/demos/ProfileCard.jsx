import { ProfileCard } from '@kolkrabbi/kol-component'
import { Asset } from '@kolkrabbi/kol-brand/svg'

export const stage = 'lg'

/* THE REAL CARD, not a stand-in (user, 2026-09-01: "website has the info
 * fields you should design for"). Every field is the studio's own — the b2
 * photo, the kol-brand lockup through the `logo` slot, the name, the mailto
 * and the five socials — exactly what `/studio` passes. The component bakes
 * none of it; the demo is where the design is checked against the content
 * it exists for. */
const CARD = {
  image: 'https://b2.kolkrabbi.io/website/asset-library/studio/card-about/studio-about-1200.jpg',
  alt: 'Tór Grímsson — Kolkrabbi',
  logo: <Asset name="kol-lockup-vert" title="Kolkrabbi" />,
  name: 'Tór Grímsson',
  email: 'hello@kolkrabbi.io',
  socials: [
    { icon: 'social-instagram-2', href: 'https://www.instagram.com/kolkrabbi_/', label: 'Instagram' },
    { icon: 'social-dribbble', href: 'https://dribbble.com/kolkrabbi', label: 'Dribbble' },
    { icon: 'social-behance', href: 'https://www.behance.net/kolkrabbi_', label: 'Behance' },
    { icon: 'social-youtube', href: 'https://www.youtube.com/@kolkrabbi', label: 'YouTube' },
    { icon: 'social-tiktok', href: 'https://www.tiktok.com/@kolkrabbi', label: 'TikTok' },
  ],
}

/* Press the disclosure (plus → minus) to open the shelf: vertical grows the
 * card, sized by the browser to the rack — no size clips; horizontal holds the
 * square and crops the photo as the shelf slides in. The first two are /studio
 * as the site renders it (StudioProcessCard): lg vertical below md, lg
 * horizontal from md, both w-full. The second row shows the shelf's seams:
 * `shelfTheme="light"` (ink and lockup follow the stamp), a `primary` control,
 * `pad="lg"`; then a `secondary`-surface shelf on a `light` stamp. */
export default function ProfileCardDemo() {
  return (
    <div className="flex flex-col items-start gap-8">
      <ProfileCard {...CARD} size="lg" className="w-full" defaultOpen />
      <div className="flex flex-wrap items-start gap-8">
        <div className="w-[320px]">
          <ProfileCard {...CARD} size="lg" orientation="horizontal" shelfTheme="light" controlVariant="primary" pad="lg" defaultOpen />
        </div>
        <ProfileCard {...CARD} size="sm" shelfTheme="light" shelfBackground="secondary" defaultOpen />
      </div>
    </div>
  )
}
