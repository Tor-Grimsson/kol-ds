import { TextPressure } from '@kolkrabbi/kol-component'

/* Hover the box: glyphs deform toward the pointer, then coast back to rest on
 * leave and the rAF loop auto-stops. The wdth/wght/ital axes only move on a
 * variable font (KOL's is a consumer asset) — these stories run on the theme
 * sans; the Alpha story reacts via opacity on any font. Toggle prefers-reduced-
 * motion in devtools to verify the static (no-listener, no-rAF) render. */

const Box = ({ children }) => (
  <div className="h-28 w-[520px] max-w-full">{children}</div>
)

export const Default = () => (
  <Box>
    <TextPressure text="KOLKRABBI" italic={false} minFontSize={32} />
  </Box>
)

export const Alpha = () => (
  <Box>
    <TextPressure text="PRESSURE" alpha width={false} weight={false} italic={false} minFontSize={32} />
  </Box>
)

export const Stroke = () => (
  <Box>
    <TextPressure text="OUTLINE" stroke italic={false} minFontSize={32} />
  </Box>
)

export const Freeze = () => (
  <Box>
    <TextPressure text="FROZEN" italic={false} returnToDefault={false} minFontSize={32} />
  </Box>
)
