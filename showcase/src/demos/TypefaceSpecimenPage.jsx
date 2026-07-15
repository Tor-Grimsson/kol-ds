import { TypefaceSpecimenPage, getTypefaceConfig } from '@kolkrabbi/kol-foundry'

export const stage = 'full'

/* The full severed-page composition, driven by the package's bundled Rót
 * config: hero → styles (weight + width axes) → preview → variable axis →
 * parsed glyph metrics, interleaved with the config's CDN editorial photos.
 * The config's fontUrl (/fonts/TGRotVF.ttf) ships with the showcase, so the
 * glyph-metrics overlay parses the real file; the shim below @font-face's the
 * config's 'TGRoot' family to that same variable font so every section renders
 * live weights. No linkComponent/HeroComponent injected — plain <a href> links
 * and the built-in DefaultHero. */
const FONT_FACES = `
@font-face { font-family: 'TGRoot'; src: url('/fonts/TGRotVF.ttf') format('truetype'); font-weight: 100 900; }
`

const typeface = getTypefaceConfig('rot')

export default function TypefaceSpecimenPageDemo() {
  return (
    <>
      <style>{FONT_FACES}</style>
      <TypefaceSpecimenPage typeface={typeface} />
    </>
  )
}
