import { PageHero } from '@kolkrabbi/kol-framework'

export const stage = 'full'

/* The page kit's opening band — label · title · lede on `SectionText` in the
 * `kol-prose-*` voices; `backTo` adds the sub-page's back link, `mark` a node
 * beside the text. `BrandHero` and `SubPageHero` alias it. */
export default function PageHeroDemo() {
  // .kol-page-hero is min-h-72dvh by design — collapse it for the preview.
  return (
    <div className="w-full [&_.kol-page-hero]:min-h-0 [&_.kol-page-hero]:py-8">
      <PageHero
        backTo="/"
        backLabel="← BACK"
        label="Kolkrabbi Vinnustofa"
        title="Brand portal"
        lede="Everything the brand ships — guidelines, assets, components — in one place."
      />
    </div>
  )
}
