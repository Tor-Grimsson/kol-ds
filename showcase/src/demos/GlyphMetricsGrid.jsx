import { GlyphMetricsGrid } from '@kolkrabbi/kol-foundry'

export const stage = 'full'

/* No fontUrl → no fetch and no opentype parse, so the metric overlay degrades
 * to none while the glyph viewer + grids still render in the given family. */
export default function GlyphMetricsGridDemo() {
  return (
    <GlyphMetricsGrid
      fontFamily='"Right Grotesk", system-ui, sans-serif'
      initialGlyph="g"
    />
  )
}
