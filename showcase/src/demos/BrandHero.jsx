import { BrandHero } from '@kolkrabbi/kol-framework'

export const stage = 'full'

export default function BrandHeroDemo() {
  // .kol-page-hero is min-h-72dvh by design — collapse it for the preview.
  return (
    <div className="w-full [&_.kol-page-hero]:min-h-0 [&_.kol-page-hero]:py-8">
      <BrandHero
        label="Kolkrabbi Vinnustofa"
        title="Brand portal"
        lede="Everything the brand ships — guidelines, assets, components — in one place."
      />
    </div>
  )
}
