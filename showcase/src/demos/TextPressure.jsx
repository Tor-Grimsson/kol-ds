import { TextPressure } from '@kolkrabbi/kol-foundry'

export const stage = 'lg'

/* The KOL variable font (TGRotVF) ships with the showcase, so every axis is
 * live — move the pointer across a line: glyphs nearest the cursor deform
 * (width / weight / italic) and coast back to rest when you leave.
 * Casing is authored in the strings — no text-transform. */
const VF = { fontFamily: 'TG Rot VF', fontUrl: '/fonts/TGRotVF.ttf' }

export default function TextPressureDemo() {
  return (
    <div className="flex w-full flex-col gap-10">
      <div>
        <p className="kol-helper-12 mb-3 text-fg-48">width + weight — hover to deform</p>
        <div className="h-28 w-full">
          <TextPressure text="KOLKRABBI" minFontSize={32} italic={false} {...VF} />
        </div>
      </div>

      <div>
        <p className="kol-helper-12 mb-3 text-fg-48">alpha axis — per-glyph opacity</p>
        <div className="h-28 w-full">
          <TextPressure text="PRESSURE" alpha width={false} weight={false} italic={false} minFontSize={32} {...VF} />
        </div>
      </div>

      <div>
        <p className="kol-helper-12 mb-3 text-fg-48">stroke — outlined ghost layer</p>
        <div className="h-28 w-full">
          <TextPressure text="OUTLINE" stroke italic={false} minFontSize={32} {...VF} />
        </div>
      </div>
    </div>
  )
}

/* Index card: one live line, nothing else. */
export function Card() {
  return (
    <div className="h-20 w-full">
      <TextPressure text="KOLKRABBI" minFontSize={24} italic={false} {...VF} />
    </div>
  )
}
