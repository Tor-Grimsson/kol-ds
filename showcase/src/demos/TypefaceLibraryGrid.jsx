import { TypefaceLibraryGrid } from '@kolkrabbi/kol-foundry'
import { ContentCard, ContentRow } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* FONT-ASSET SHIM — TypefaceLibraryItem maps typeface names to fixed CSS
 * families (TGRoot, TGMalromur, …). The showcase ships the real Rót variable
 * font; the other four families alias distinct in-repo Right Grotesk cuts so
 * every library row renders a live, visually distinct face (the same runtime
 * @font-face injection TextPressure does for its fontUrl). */
const FONT_FACES = `
@font-face { font-family: 'TGRoot'; src: url('/fonts/tg-typefaces/TGRotVF.ttf') format('truetype'); font-weight: 100 900; }
@font-face { font-family: 'TGMalromur'; src: url('/fonts/right-grotesk/PPRightGrotesk-RegularItalic.woff2') format('woff2'); font-style: italic; }
@font-face { font-family: 'TGGullhamrar'; src: url('/fonts/right-grotesk/PPRightGrotesk-Light.woff2') format('woff2'); }
@font-face { font-family: 'TGTrollatunga'; src: url('/fonts/right-grotesk/PPRightGrotesk-Black.woff2') format('woff2'); }
@font-face { font-family: 'TGDylgjur'; src: url('/fonts/right-grotesk/PPRightGrotesk-CompactBlack.woff2') format('woff2'); }
`

/* MIGRATED 2026-08-30 (ContentSetRetirement step 3): `TypefaceLibraryItem` was
 * dropped. The shape below is the one kol-foundry's own
 * TypefaceLibraryGridWithVariables already shipped — reused rather than
 * reinvented. `showcase` + layout canvas/column is the renamed `typeface`. */
const FACE = {
  'TG Rót': 'TGRoot',
  'TG Málrómur': 'TGMalromur',
  'TG Gullhamrar': 'TGGullhamrar',
  'TG Tröllatunga': 'TGTrollatunga',
  'TG Dylgjur': 'TGDylgjur',
}

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
        renderItem={(typeface, viewMode) => {
          const face = { fontFamily: FACE[typeface.name] }
          return viewMode === 'list' ? (
            <ContentRow
              key={typeface.name}
              variant="showcase"
              layout="column"
              title={typeface.name}
              body={typeface.styles}
              detail={typeface.classification}
              date={typeface.year}
              footer={
                <div className="w-full truncate text-5xl leading-none" style={face}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                </div>
              }
            />
          ) : (
            <ContentCard
              key={typeface.name}
              variant="showcase"
              layout="canvas"
              title={typeface.name}
              body={typeface.styles}
              media={
                <div className="flex h-full w-full items-end justify-start p-8">
                  <span className="text-[140px] leading-none lg:text-[160px]" style={face}>Ðð</span>
                </div>
              }
            />
          )
        }}
      />
    </>
  )
}
