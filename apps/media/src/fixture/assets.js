/* REAL FILES — the size table. Pure data, no imports, so the store's Node
 * self-check can read it; the URLs live in `assets-urls.js`, which uses Vite's
 * asset imports and only resolves in the browser.
 *
 * A fixture file that claims a size and a kind but has nothing behind it is a
 * lie the product then renders: `walkthrough.mp4` reported 30.4 MB and opened a
 * player at 00:00 / 00:00 with no video. These are the kinds that cannot be
 * honestly generated — video, PDF, photographic stills — so they are carried as
 * actual bytes.
 *
 * The numbers are the real byte counts. `listMedia` reports a size before
 * anything is fetched, so the meta line must not disagree with what then loads.
 *
 * Provenance: the three renders are kol-labs-single's, the PDF is kol-proofer's
 * kerning specimen, the stills are this repo's own `public/kol-images`. */

export const ASSET_SIZES = {
  'video/reels/studio-loop.mp4': 253748,
  'video/reels/press-cut.mp4': 295018,
  'video/walkthrough.mp4': 851585,
  'docs/brand-guidelines.pdf': 491750,
  'img/01-shoots/contact-sheet.pdf': 868934,
  'img/01-shoots/reykjavik/harbour-01.jpg': 398407,
  'img/01-shoots/reykjavik/harbour-02.jpg': 356880,
  'img/01-shoots/reykjavik/harbour-03.jpg': 368135,
}

export const assetSize = (key) => ASSET_SIZES[key] ?? null
