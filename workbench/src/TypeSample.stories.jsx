import { TypeSample } from '@kolkrabbi/kol-foundry'

export const Default = () => (
  <div className="w-[560px]">
    <TypeSample label="Sans · 400 · 32/38" size={32} lineHeight={38}>
      The quick brown fox jumps over the lazy dog
    </TypeSample>
  </div>
)

export const Stacked = () => (
  <div className="w-[560px]">
    <TypeSample label="Sans · 700 · 40/44" weight={700} size={40} lineHeight={44}>
      Hamburgefonstiv
    </TypeSample>
    <TypeSample label="Sans · 400 · 24/30" size={24} lineHeight={30}>
      Hamburgefonstiv
    </TypeSample>
    <TypeSample label="Sans · 400 italic · 16" italic size={16}>
      Hamburgefonstiv
    </TypeSample>
  </div>
)

export const Unlabeled = () => (
  <div className="w-[560px]">
    <TypeSample size={56}>Aa Bb Cc 0123</TypeSample>
  </div>
)
