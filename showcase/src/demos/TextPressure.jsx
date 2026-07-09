import { TextPressure } from '@kolkrabbi/kol-foundry'

export const stage = 'lg'

/**
 * Move the pointer across the text: each glyph deforms toward the cursor and
 * coasts back to rest when you leave. The wdth / wght / ital axes only move
 * when the resolved font is a VARIABLE font — the KOL variable font is a
 * consumer asset, so here we run on the theme sans (var(--kol-font-family-sans))
 * and also show the `alpha` axis, which reacts via plain opacity regardless of
 * the font. Casing is authored in the string — no text-transform.
 */
export default function TextPressureDemo() {
  return (
    <div className="flex w-full flex-col gap-10">
      <div>
        <p className="kol-helper-12 mb-3 text-fg-48">width + weight + italic (needs a variable font to move)</p>
        <div className="h-28 w-full">
          <TextPressure text="KOLKRABBI" minFontSize={32} italic={false} />
        </div>
      </div>

      <div>
        <p className="kol-helper-12 mb-3 text-fg-48">alpha axis — per-glyph opacity, visible on any font</p>
        <div className="h-28 w-full">
          <TextPressure text="PRESSURE" alpha width={false} weight={false} italic={false} minFontSize={32} />
        </div>
      </div>

      <div>
        <p className="kol-helper-12 mb-3 text-fg-48">stroke — outlined ghost layer</p>
        <div className="h-28 w-full">
          <TextPressure text="OUTLINE" stroke italic={false} minFontSize={32} />
        </div>
      </div>
    </div>
  )
}
