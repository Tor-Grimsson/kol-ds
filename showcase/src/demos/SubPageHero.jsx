import { SubPageHero } from '@kolkrabbi/kol-framework'

export const stage = 'full'

export default function SubPageHeroDemo() {
  // .kol-page-hero is min-h-72dvh by design — collapse it for the preview.
  return (
    <div className="w-full [&_.kol-page-hero]:min-h-0 [&_.kol-page-hero]:py-8">
      <SubPageHero
        backTo="/"
        backLabel="← BACK"
        label="REFERENCE"
        title="Icon inventory"
        lede="Every icon in the set, grouped by category."
      />
    </div>
  )
}
