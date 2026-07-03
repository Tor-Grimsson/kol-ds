import { VariableFontSection } from '@kolkrabbi/kol-component/foundry'

export const stage = 'full'

/* Auto-oscillates the weight (reduced-motion aware); grabbing the slider pauses
 * it. Applied as CSS font-weight, so it steps through the family's real weights. */
export default function VariableFontSectionDemo() {
  return (
    <VariableFontSection
      fontFamily='"Right Grotesk", system-ui, sans-serif'
      badgeText="Variable axis"
      text="Kolkrabbi"
      minWeight={300}
      maxWeight={900}
    />
  )
}
