import React from 'react'
import FeatureGrid from '../../ui/FeatureGrid.jsx'
import { SpecimenSectionHeader } from '@kolkrabbi/kol-foundry'

const FoundryOpentypeFeatures = () => {
  const features = [
    {
      title: 'Stylistic Alternates',
      description: 'Alternative character forms for enhanced typographic expression'
    },
    {
      title: 'Ligatures',
      description: 'Contextual and discretionary ligatures for improved readability'
    },
    {
      title: 'Kerning Pairs',
      description: 'Optimized spacing between character pairs'
    },
    {
      title: 'Extended Language Support',
      description: 'Support for Latin, Cyrillic, and Greek character sets'
    }
  ]

  return (
    <section className="w-full py-12 lg:py-16">
      <div className="max-w-[var(--kol-container-max)] mx-auto flex flex-col gap-8">
        <SpecimenSectionHeader
          label="OpenType Features"
          icon="variant-01"
          size="md"
          showDropdown={false}
        />

        <FeatureGrid features={features} variant="row" />
      </div>
    </section>
  )
}

export default FoundryOpentypeFeatures
