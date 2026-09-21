/* The carried files themselves. Vite hashes each into the build like any other
 * asset; the size table beside this one is in `assets.js` and stays importable
 * from Node, which is why the two are split. */

import softforms from './assets/softforms.mp4'
import softforms3d from './assets/softforms-3d.mp4'
import opticReaction from './assets/optic-reaction.mp4'
import kerner from './assets/kol-kerner.pdf'
import tt01 from './assets/tt-01.jpg'
import tt02 from './assets/tt-02.jpg'
import tt03 from './assets/tt-03.jpg'

export const ASSET_URLS = {
  'video/reels/studio-loop.mp4': softforms,
  'video/reels/press-cut.mp4': softforms3d,
  'video/walkthrough.mp4': opticReaction,
  'docs/brand-guidelines.pdf': kerner,
  'img/01-shoots/reykjavik/harbour-01.jpg': tt01,
  'img/01-shoots/reykjavik/harbour-02.jpg': tt02,
  'img/01-shoots/reykjavik/harbour-03.jpg': tt03,
}

export const assetUrl = (key) => ASSET_URLS[key] ?? null
