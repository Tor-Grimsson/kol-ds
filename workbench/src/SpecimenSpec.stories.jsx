import { SpecimenSpec, SpecimenSample } from '@kolkrabbi/kol-styleguide'

export const Default = () => (
  <div className="w-[900px]">
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
  </div>
)

export const NoLabel = () => (
  <div className="w-[900px]">
    <SpecimenSpec
      meta={[
        ['Family', 'Right Grotesk'],
        ['Weight', '400'],
        ['Size', '16px'],
      ]}
    >
      <SpecimenSample size={16} lineHeight={24}>
        Body copy at reading size, wrapping across a couple of lines to show
        measure and rhythm inside the sample track.
      </SpecimenSample>
    </SpecimenSpec>
  </div>
)
