import React from 'react'
import FeatureGrid from '../../ui/FeatureGrid.jsx'
import { Button, ButtonGroup } from '@kolkrabbi/kol-component'
import { SpecimenSectionHeader } from '@kolkrabbi/kol-foundry'

const FoundryTypefaceDetails = () => {
  const details = [
    { title: 'Designer', description: 'Tor Grimsson', icon: 'foundation' },
    { title: 'Categories', description: 'Serif, Italic, Display', icon: 'foundation' },
    { title: 'Styles', description: '4 Weights', icon: 'foundation' },
    { title: 'Format', description: 'OTF, WOFF2', icon: 'foundation' }
  ]

  return (
    <section className="w-full py-12 lg:py-16">
      <div className="max-w-[var(--kol-container-max)] mx-auto flex flex-col gap-8">
        <SpecimenSectionHeader
          label="Font Details"
          icon="info"
          size="md"
          showDropdown={false}
        />

        <FeatureGrid variant="row" features={details} />

        <div className="flex flex-col items-center gap-2 pt-10 pb-4">
          <ButtonGroup align="center">
            <Button variant="primary">Download Font</Button>
            <Button variant="outline">View Specimen</Button>
          </ButtonGroup>
        </div>
      </div>
    </section>
  )
}

export default FoundryTypefaceDetails
