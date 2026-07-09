import { TypeSample, TypeSpecCard } from '@kolkrabbi/kol-foundry'

export const meta = {
  title: 'Type scale',
  description: 'A display-to-caption specimen with two annotated spec cards',
  category: 'content',
}
export const stage = 'full'

const PANGRAM = 'The quick brown fox jumps over the lazy dog'

export default function TypeScale() {
  return (
    <div className="flex w-full flex-col gap-8 px-6 py-10 md:px-10">
      {/* The scale, display → caption. Sizes are px on purpose (spec, not stops). */}
      <div className="flex flex-col">
        <TypeSample label="Display · 700 · 64/68" weight={700} size={64} lineHeight={68}>
          Kolkrabbi
        </TypeSample>
        <TypeSample label="Heading · 600 · 40/46" weight={600} size={40} lineHeight={46}>
          {PANGRAM}
        </TypeSample>
        <TypeSample label="Title · 500 · 28/34" weight={500} size={28} lineHeight={34}>
          {PANGRAM}
        </TypeSample>
        <TypeSample label="Body · 400 · 18/28" size={18} lineHeight={28}>
          {PANGRAM}
        </TypeSample>
        <TypeSample label="Caption · 400 · 13/18" size={13} lineHeight={18}>
          {PANGRAM}
        </TypeSample>
      </div>

      {/* Spec sheets — numeric metrics beside a live rendering of the style. */}
      <TypeSpecCard
        label="Display 01"
        meta={[
          ['Family', 'Right Grotesk'],
          ['Weight', '700'],
          ['Size', '64px'],
          ['Line height', '68px'],
          ['Tracking', '-0.02em'],
        ]}
      >
        <TypeSample weight={700} size={64} lineHeight={68}>
          Kolkrabbi
        </TypeSample>
      </TypeSpecCard>

      <TypeSpecCard
        label="Body"
        meta={[
          ['Family', 'Right Grotesk'],
          ['Weight', '400'],
          ['Size', '18px'],
          ['Line height', '28px'],
          ['Tracking', '0'],
        ]}
      >
        <TypeSample size={18} lineHeight={28}>
          {PANGRAM}
        </TypeSample>
      </TypeSpecCard>
    </div>
  )
}
