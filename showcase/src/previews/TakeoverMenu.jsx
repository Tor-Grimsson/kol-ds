import { TakeoverMenu } from '@kolkrabbi/kol-framework'
import { SITE } from '../lib/websiteFixture.jsx'

export const stage = 'full'
/* a full-bleed takeover — it covers its document */
export const frame = 560

/* the website's one navigation surface, open: the big mark, the studio block with its social link and the theme toggle,
 * the links bottom-right. Escape and any link close it (here it stays open). */
export default function TakeoverMenuPreview() {
  const { logomark, name, navItems, takeover } = SITE
  return <TakeoverMenu open onClose={() => {}} logomark={logomark} name={name} navItems={navItems} {...takeover} />
}
