import { useState } from 'react'
import { SectionText, TabsRow } from '@kolkrabbi/kol-component'

/* One float family page (plan-2026-11-04-float-set W1): the family's head, text tabs that switch every part between
 * the solid ground and the two glass skins, and the parts — `children(surface)` renders them on that surface.
 * Glass sits over a picture so the skin reads. Layout glue only; the parts come from their packages. */
const SURFACES = [{ id: 'solid', label: 'Solid' }, { id: 'glass-dark', label: 'Glass dark' }, { id: 'glass-light', label: 'Glass light' }]
const IMAGE = `${import.meta.env.BASE_URL}images/stack-hero-1600.jpg`

export default function FamilyPage({ title, body, children }) {
  const [surface, setSurface] = useState('solid')
  const glass = surface !== 'solid'
  return (
    <div className="flex flex-col gap-6" data-surface={surface}>
      <SectionText variant="float" headline={title} body={body} />
      <TabsRow variant="text" tabs={SURFACES} value={surface} onChange={setSurface} />
      <div className={`flex flex-col gap-10 rounded-[var(--kol-float-window-r)] ${glass ? 'bg-cover bg-center p-8' : ''}`}
        style={glass ? { backgroundImage: `url(${IMAGE})` } : undefined}>
        {children(surface)}
      </div>
    </div>
  )
}

/* one named part on a family page — `data-part` is what the acceptance script reads; `slug` links the part's showcase
 * component page (`/components/:slug`). On glass the label row sits on the solid ground so it reads over the picture. */
const GLASS = 'in-[[data-surface^=glass]]:bg-[var(--kol-surface-secondary)] in-[[data-surface^=glass]]:px-3 in-[[data-surface^=glass]]:py-1.5'
export function Part({ name, slug, children, className = '' }) {
  return (
    <section data-part={name} className={`flex flex-col gap-3 ${className}`}>
      <div className={`flex items-center gap-3 self-start rounded-full ${GLASS}`}>
        <span className="kol-float-ruler text-fg-64">{name}</span>
        {slug && <a href={`/components/${slug}`} className="kol-float-ruler text-fg-48 hover:text-fg-96">Component page ↗</a>}
      </div>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  )
}
