import { useState } from 'react'
import { SpecimenSectionHeader } from '@kolkrabbi/kol-component/foundry'

export const stage = 'md'

export default function SpecimenSectionHeaderDemo() {
  const [style, setStyle] = useState('roman')
  const [weight, setWeight] = useState('400')

  return (
    <SpecimenSectionHeader
      label="Character Set"
      icon="foundation"
      selectedStyle={style}
      onStyleChange={setStyle}
      selectedWeight={weight}
      onWeightChange={setWeight}
      weightOptions={[
        { label: 'Regular', value: '400' },
        { label: 'Medium', value: '500' },
        { label: 'Bold', value: '700' },
      ]}
    />
  )
}
