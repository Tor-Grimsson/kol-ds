import { WebsiteFooter } from '@kolkrabbi/kol-framework'
import { SITE } from '../lib/websiteFixture.jsx'

export const stage = 'full'

/* the website's footer: `© <year> <owner>` and back to top */
export default function WebsiteFooterPreview() {
  return <div className="w-full"><WebsiteFooter owner={SITE.name} /></div>
}
