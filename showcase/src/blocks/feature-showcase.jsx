import { FeaturesCardSection, Button } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Feature showcase',
  description: 'A three-up feature-card band with icons, product copy and a centered CTA row',
  category: 'marketing',
}
export const stage = 'full'

const FEATURES = [
  {
    title: 'Composable primitives',
    icon: 'layers',
    description: 'Every atom, molecule and organism ships from one barrel — import, compose, done.',
  },
  {
    title: 'Themed by tokens',
    icon: 'customize',
    description: 'Colours, type and spacing resolve from CSS variables, so light and dark stay honest.',
  },
  {
    title: 'Accessible by default',
    icon: 'shield-check',
    description: 'Focus states, ARIA wiring and keyboard paths are built in, not bolted on later.',
  },
]

export default function FeatureShowcase() {
  return (
    <FeaturesCardSection
      headerLabel="Everything you need to ship"
      headerDescription="A production-ready toolkit that scales from a single button to a full marketing page — no design debt, no divergence."
      features={FEATURES}
      headerClassName="w-full pt-4"
      ctasClassName="pt-10 pb-4"
      ctas={
        <>
          <Button variant="primary" size="md" href="#docs">Read the docs</Button>
          <Button variant="secondary" size="md" href="#components">Browse components</Button>
        </>
      }
    />
  )
}
