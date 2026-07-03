import { FoundryCharacterSets } from '@kolkrabbi/kol-component/foundry'

export const stage = 'full'

/* Glyph categories collapsed under a fade with a "Show All Glyphs" reveal. */
export default function FoundryCharacterSetsDemo() {
  return (
    <FoundryCharacterSets fontFamily='"Right Grotesk", system-ui, sans-serif' />
  )
}
