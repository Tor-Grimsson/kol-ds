import { useState } from 'react'
import { PaletteHarmonyWheel, HARMONIES, harmonyColors } from '@kolkrabbi/kol-component'

export const stage = 'md'

/**
 * Controlled on `hue`; every drag / arrow-key emits { hue, colors } — one hex
 * per role offset of the active harmony, matching the satellite markers 1:1.
 * The caller owns S/L; the wheel stays a pure hue picker.
 */
export default function PaletteHarmonyWheelDemo() {
  const [harmony, setHarmony] = useState('analogous')
  const [hue, setHue] = useState(200)
  const [colors, setColors] = useState(() => harmonyColors(200, 'analogous'))

  const pickHarmony = (id) => {
    setHarmony(id)
    setColors(harmonyColors(hue, id))
  }

  return (
    <div className="flex flex-col items-start gap-6">
      <PaletteHarmonyWheel
        hue={hue}
        harmony={harmony}
        onChange={({ hue: h, colors: c }) => {
          setHue(h)
          setColors(c)
        }}
      />

      <div className="flex flex-wrap gap-3">
        {HARMONIES.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() => pickHarmony(h.id)}
            className={`kol-mono-12 underline-offset-2 ${
              h.id === harmony ? 'text-fg underline' : 'text-fg-48'
            }`}
          >
            {h.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-3">
        {colors.map((c, i) => (
          <div key={`${c}-${i}`} className="flex flex-col items-center gap-1">
            <div className="h-10 w-10 rounded" style={{ background: c }} />
            <span className="kol-mono-10 text-fg-48">{c}</span>
          </div>
        ))}
      </div>

      <p className="kol-helper-12 text-fg-48">
        Drag the ring or focus it and use arrow keys (shift = 15°) · hue {Math.round(hue)}°
      </p>
    </div>
  )
}
