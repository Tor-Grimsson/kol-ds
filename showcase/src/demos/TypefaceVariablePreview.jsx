import { TypefaceVariablePreview } from '@kolkrabbi/kol-foundry'

export const stage = 'full'

/* FONT-ASSET SHIM — the preview maps 'TG Rót' to the fixed CSS family
 * 'TGRoot'; alias it to the in-repo variable font so every weightValue lands
 * on the real wght axis (100–900). */
const FONT_FACES = `
@font-face { font-family: 'TGRoot'; src: url('/fonts/TGRotVF.ttf') format('truetype'); font-weight: 100 900; }
`

const TYPEFACE = {
  name: 'TG Rót',
  classification: 'Geometric Sans',
  styles: 'Variable · 9 weights',
  status: 'Released',
  year: '2024',
}

/* Two list rows compare weights side by side — the specimen line is editable
 * and the Size / Leading / Spacing sliders are live. The card variant is the
 * static metrics readout. */
export default function TypefaceVariablePreviewDemo() {
  return (
    <div className="flex flex-col gap-6">
      <style>{FONT_FACES}</style>
      <TypefaceVariablePreview typeface={TYPEFACE} weight="Light" weightValue={300} variant="list" />
      <TypefaceVariablePreview typeface={TYPEFACE} weight="Black" weightValue={900} variant="list" />
      <div className="max-w-sm w-full">
        <TypefaceVariablePreview typeface={TYPEFACE} weight="Medium" weightValue={500} variant="card" />
      </div>
    </div>
  )
}
