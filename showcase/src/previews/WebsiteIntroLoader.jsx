import { WebsiteIntroLoader } from '@kolkrabbi/kol-foundry'
import { SITE } from '../lib/websiteFixture.jsx'

export const stage = 'full'
/* a full-screen curtain over its document */
export const frame = 560

/* kolkrabbi.io's intro: the word fades in, then the arrow; scroll, swipe or a key slides it away. The word and its
 * variable font are the site's (kolkrabbi.io: KOLKRABBI in TG Rot) — here VOYAGER in the theme's sans. */
export default function WebsiteIntroLoaderPreview() {
  return <WebsiteIntroLoader text={SITE.name.toUpperCase()} onEnter={() => {}} />
}
