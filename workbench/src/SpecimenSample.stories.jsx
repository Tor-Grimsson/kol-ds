import { SpecimenSample } from '@kolkrabbi/kol-styleguide'

export const Default = () => (
  <div className="w-[560px]">
    <SpecimenSample label="Sans, 400, 32/38" size={32} lineHeight={38}>
      The quick brown fox jumps over the lazy dog
    </SpecimenSample>
  </div>
)

export const Stacked = () => (
  <div className="w-[560px]">
    <SpecimenSample label="Sans, 700, 40/44" weight={700} size={40} lineHeight={44}>
      Hamburgefonstiv
    </SpecimenSample>
    <SpecimenSample label="Sans, 400, 24/30" size={24} lineHeight={30}>
      Hamburgefonstiv
    </SpecimenSample>
    <SpecimenSample label="Sans, 400 italic, 16" italic size={16}>
      Hamburgefonstiv
    </SpecimenSample>
  </div>
)

export const Unlabeled = () => (
  <div className="w-[560px]">
    <SpecimenSample size={56}>Aa Bb Cc 0123</SpecimenSample>
  </div>
)
