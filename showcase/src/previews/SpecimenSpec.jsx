import { SpecimenSpec, SpecimenSample } from '@kolkrabbi/kol-styleguide'

export const stage = 'full'

export default function SpecimenSpecPreview() {
  return (
    <SpecimenSpec
      label="Heading 01"
      meta={[
        ['Family', 'Right Grotesk'],
        ['Weight', '700'],
        ['Size', '48px'],
        ['Line height', '52px'],
        ['Tracking', '0'],
      ]}
    >
      <SpecimenSample weight={700} size={48} lineHeight={52}>
        The quick brown fox jumps over the lazy dog
      </SpecimenSample>
    </SpecimenSpec>
  )
}
