import { TypeSpecCard, TypeSample } from '@kolkrabbi/kol-foundry'

export const stage = 'full'

export default function TypeSpecCardDemo() {
  return (
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
  )
}
