import { TypeSample } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function TypeSampleDemo() {
  return (
    <div>
      <TypeSample label="Sans · 400 · 32/38" size={32} lineHeight={38}>
        The quick brown fox jumps over the lazy dog
      </TypeSample>
      <TypeSample label="Sans · 700 · 24/30" weight={700} size={24} lineHeight={30}>
        The quick brown fox jumps over the lazy dog
      </TypeSample>
      <TypeSample label="Sans · 400 italic · 18" italic size={18}>
        The quick brown fox jumps over the lazy dog
      </TypeSample>
    </div>
  )
}
