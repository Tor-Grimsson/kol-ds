import { TypefaceLibraryItem } from '@kolkrabbi/kol-foundry'

export const stage = 'full'

/* FONT-ASSET SHIM — the item maps 'TG Rót' to the fixed CSS family 'TGRoot';
 * alias it to the in-repo variable font so the Ðð preview and the clipped
 * alphabet render the real face. */
const FONT_FACES = `
@font-face { font-family: 'TGRoot'; src: url('/fonts/TGRotVF.ttf') format('truetype'); font-weight: 100 900; }
`

const TYPEFACE = {
  name: 'TG Rót',
  classification: 'Geometric Sans',
  styles: 'Variable · 9 weights',
  year: '2024',
}

/* Both variants: card (hover flips the Ðð glyph to a pangram) and list (the
 * alphabet preview binary-search clips to the row width via ResizeObserver). */
export default function TypefaceLibraryItemDemo() {
  return (
    <div className="flex flex-col gap-6">
      <style>{FONT_FACES}</style>
      <div className="max-w-sm w-full">
        <TypefaceLibraryItem typeface={TYPEFACE} variant="card" />
      </div>
      <TypefaceLibraryItem typeface={TYPEFACE} variant="list" />
    </div>
  )
}
