import { SpecimenSample } from '@kolkrabbi/kol-styleguide'

export const stage = 'md'

/* both layouts: caption above (the default) and caption beside (`horizontal`, the font sheet's weight rows) */
export default function SpecimenSamplePreview() {
  return (
    <div className="flex flex-col gap-8">
      <SpecimenSample label="Sans, 400, 32/38" size={32} lineHeight={38}>
        The quick brown fox jumps over the lazy dog
      </SpecimenSample>
      <SpecimenSample horizontal label="Bold" weight={700} size={24} lineHeight={30}>
        The quick brown fox jumps over the lazy dog
      </SpecimenSample>
    </div>
  )
}
