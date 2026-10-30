import { WebsiteNavbar, WorkViewProvider } from '@kolkrabbi/kol-framework'
import { SITE } from '../lib/websiteFixture.jsx'

export const stage = 'full'
/* the bar is fixed to the top of its document */
export const frame = 360

/* kolkrabbi.io's ONE top bar: the wordmark, an optional tools slot, the menu button that opens the takeover. It hides on
 * scroll down and comes back on scroll up. */
export default function WebsiteNavbarPreview() {
  return (
    <WorkViewProvider>
      <WebsiteNavbar {...SITE} />
      <div className="h-[200vh] pt-[var(--kol-nav-h)] px-8 kol-sans-body-02 text-meta">Scroll to hide the bar; scroll up to bring it back. The button opens the takeover.</div>
    </WorkViewProvider>
  )
}
