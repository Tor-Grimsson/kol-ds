import { TypeSpecCard, TypeSample } from '@kolkrabbi/kol-foundry'

export const Default = () => (
  <div className="w-[900px]">
    <TypeSpecCard
      label="Heading 01"
      meta={[
        ['Family', 'Right Grotesk'],
        ['Weight', '700'],
        ['Size', '48px'],
        ['Line height', '52px'],
        ['Tracking', '0'],
      ]}
    >
      <TypeSample weight={700} size={48} lineHeight={52}>
        The quick brown fox jumps over the lazy dog
      </TypeSample>
    </TypeSpecCard>
  </div>
)

export const NoLabel = () => (
  <div className="w-[900px]">
    <TypeSpecCard
      meta={[
        ['Family', 'Right Grotesk'],
        ['Weight', '400'],
        ['Size', '16px'],
      ]}
    >
      <TypeSample size={16} lineHeight={24}>
        Body copy at reading size, wrapping across a couple of lines to show
        measure and rhythm inside the sample track.
      </TypeSample>
    </TypeSpecCard>
  </div>
)
