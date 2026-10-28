import { SiteHero } from '@kolkrabbi/kol-framework'
import { Button } from '@kolkrabbi/kol-component'
import logomark from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?url'

export const stage = 'full'

const mood = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a5d78"/><stop offset="1" stop-color="#1d1d21"/></linearGradient></defs><rect width="1600" height="1000" fill="url(#g)"/><circle cx="1150" cy="380" r="300" fill="none" stroke="#8a8a94" stroke-width="2"/></svg>')}`

/* a site's landing: the image, the 32 % / 80 % wash, the mark from a url, the name, a tagline, one action */
export default function SiteHeroPreview() {
  return (
    <SiteHero
      image={{ src: mood }}
      mark={logomark}
      markTitle="Kolkrabbi"
      title="Kolkrabbi"
      tagline="A design studio rooted in craft and clarity."
      actions={<Button tone="primary" size="md">Styleguide</Button>}
      minHeight="560px"
    />
  )
}
