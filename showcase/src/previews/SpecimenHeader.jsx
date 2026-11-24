import { useState } from 'react'
import { SpecimenHeader } from '@kolkrabbi/kol-styleguide'

export const stage = 'md'

export const sizes = ['lg', 'md', 'sm']

export default function SpecimenHeaderPreview({ size = 'lg' }) {
  const [style, setStyle] = useState('roman')
  const [weight, setWeight] = useState('400')

  return (
    <SpecimenHeader
      size={size}
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
