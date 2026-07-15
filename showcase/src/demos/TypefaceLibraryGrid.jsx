import { TypefaceLibraryGrid, TypefaceLibraryItem } from '@kolkrabbi/kol-foundry'

export const stage = 'full'

/* FONT-ASSET SHIM — TypefaceLibraryItem maps typeface names to fixed CSS
 * families (TGRoot, TGMalromur, …). The showcase ships the real Rót variable
 * font; the other four families alias distinct in-repo Right Grotesk cuts so
 * every library row renders a live, visually distinct face (the same runtime
 * @font-face injection TextPressure does for its fontUrl). */
const FONT_FACES = `
@font-face { font-family: 'TGRoot'; src: url('/fonts/TGRotVF.ttf') format('truetype'); font-weight: 100 900; }
@font-face { font-family: 'TGMalromur'; src: url('/fonts/Right-Grotesk/PPRightGrotesk-RegularItalic.woff2') format('woff2'); font-style: italic; }
@font-face { font-family: 'TGGullhamrar'; src: url('/fonts/Right-Grotesk/PPRightGrotesk-Light.woff2') format('woff2'); }
@font-face { font-family: 'TGTrollatunga'; src: url('/fonts/Right-Grotesk/PPRightGrotesk-Black.woff2') format('woff2'); }
@font-face { font-family: 'TGDylgjur'; src: url('/fonts/Right-Grotesk/PPRightGrotesk-CompactBlack.woff2') format('woff2'); }
`

const TYPEFACES = [
  { name: 'TG Rót', classification: 'Geometric Sans', styles: 'Variable · 9 weights', year: '2024' },
  { name: 'TG Málrómur', classification: 'Grotesque', styles: 'Italic · 8 weights', year: '2023' },
  { name: 'TG Gullhamrar', classification: 'Humanist Sans', styles: '8 weights', year: '2023' },
  { name: 'TG Tröllatunga', classification: 'Display', styles: '1 style', year: '2022' },
  { name: 'TG Dylgjur', classification: 'Display', styles: '1 style', year: '2021' },
]

/* Classification + Styles filter groups and the card/list toggle come from the
 * DS ContentFilters; the parent owns item rendering via renderItem. */
export default function TypefaceLibraryGridDemo() {
  return (
    <>
      <style>{FONT_FACES}</style>
      <TypefaceLibraryGrid
        typefaces={TYPEFACES}
        totalCount={TYPEFACES.length}
        renderItem={(typeface, viewMode) => (
          <TypefaceLibraryItem key={typeface.name} typeface={typeface} variant={viewMode} />
        )}
      />
    </>
  )
}
