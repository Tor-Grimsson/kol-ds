import { GlyphMetricsSection } from '@kolkrabbi/kol-foundry'

export const stage = 'full'

/* Real font I/O: the section fetches the served static TTF, injects the face,
 * and (opentype.js is installed in the showcase) draws the baseline / x-height /
 * cap / ascender / descender overlay from the font's own OS/2 + hhea tables.
 * The Roman/Italic dropdown swaps to the italic TTF and re-parses. */
export default function GlyphMetricsSectionDemo() {
  return (
    <GlyphMetricsSection
      fontFamily='"Right Grotesk", system-ui, sans-serif'
      fontUrlRoman="/fonts/right-grotesk-ttf/PPRightGrotesk-Regular.ttf"
      fontUrlItalic="/fonts/right-grotesk-ttf/PPRightGrotesk-RegularItalic.ttf"
      fontStyle="normal"
      badgeText="Right Grotesk"
      showDropdown
    />
  )
}
