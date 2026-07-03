import { FontPreviewSection } from '@kolkrabbi/kol-component/foundry'

export const stage = 'full'

/* A size ladder (96 / 64 / 48 / 24 px) over one editable sample; size, leading
 * and spacing are live per row. */
export default function FontPreviewSectionDemo() {
  return (
    <FontPreviewSection
      fontFamily='"Right Grotesk", system-ui, sans-serif'
      badgeText="Preview"
      initialWeight="Regular"
    />
  )
}
