import { TypefaceLibraryGridWithVariables } from '@kolkrabbi/kol-foundry'

export const stage = 'full'

/* FONT-ASSET SHIM — the grid's items map typeface names to fixed CSS families;
 * TGRoot is the real in-repo variable font (wght 100–900), the rest alias
 * distinct Right Grotesk cuts so every row renders live. */
const FONT_FACES = `
@font-face { font-family: 'TGRoot'; src: url('/fonts/TGRotVF.ttf') format('truetype'); font-weight: 100 900; }
@font-face { font-family: 'TGMalromur'; src: url('/fonts/Right-Grotesk/PPRightGrotesk-RegularItalic.woff2') format('woff2'); font-style: italic; }
@font-face { font-family: 'TGGullhamrar'; src: url('/fonts/Right-Grotesk/PPRightGrotesk-Light.woff2') format('woff2'); }
@font-face { font-family: 'TGTrollatunga'; src: url('/fonts/Right-Grotesk/PPRightGrotesk-Black.woff2') format('woff2'); }
@font-face { font-family: 'TGDylgjur'; src: url('/fonts/Right-Grotesk/PPRightGrotesk-CompactBlack.woff2') format('woff2'); }
`

const TYPEFACES = [
  { name: 'TG Rót', classification: 'Geometric Sans', styles: 'Variable · 9 weights', year: '2024', status: 'Released', link: '#rot' },
  { name: 'TG Málrómur', classification: 'Grotesque', styles: 'Italic · 8 weights', year: '2023', status: 'Released', link: '#malromur' },
  { name: 'TG Gullhamrar', classification: 'Humanist Sans', styles: '8 weights', year: '2023', status: 'Released', link: '#gullhamrar' },
  { name: 'TG Tröllatunga', classification: 'Display', styles: '1 style', year: '2022', status: 'Released', link: '#trollatunga' },
  { name: 'TG Dylgjur', classification: 'Display', styles: '1 style', year: '2021', status: 'Released', link: '#dylgjur' },
]

/* Weight variants per typeface — pick "TG Rót" in the Typefaces filter to swap
 * the rows for TypefaceVariablePreview weight specimens (the real variable
 * font, so every weightValue lands on the actual wght axis). */
const TYPEFACE_WEIGHTS = {
  'TG Rót': [
    { weight: 'Thin', value: 100, axis: 'Weight' },
    { weight: 'Light', value: 300, axis: 'Weight' },
    { weight: 'Regular', value: 400, axis: 'Weight' },
    { weight: 'Medium', value: 500, axis: 'Weight' },
    { weight: 'Bold', value: 700, axis: 'Weight' },
    { weight: 'Black', value: 900, axis: 'Weight' },
  ],
  'TG Málrómur': [{ weight: 'Regular', value: 400, axis: 'Weight' }],
  'TG Gullhamrar': [{ weight: 'Regular', value: 400, axis: 'Weight' }],
  'TG Tröllatunga': [{ weight: 'Regular', value: 400, axis: 'Weight' }],
  'TG Dylgjur': [{ weight: 'Regular', value: 400, axis: 'Weight' }],
}

/* No linkComponent injected → items wrap in plain <a href>. */
export default function TypefaceLibraryGridWithVariablesDemo() {
  return (
    <>
      <style>{FONT_FACES}</style>
      <TypefaceLibraryGridWithVariables
        typefaces={TYPEFACES}
        typefaceWeights={TYPEFACE_WEIGHTS}
        totalCount={TYPEFACES.length}
      />
    </>
  )
}
