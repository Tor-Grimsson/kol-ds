import { ExhibitLinkCard } from '@kolkrabbi/kol-workshop'

export const stage = 'sm'

/* The card an exhibit's landing page shows for each child page. */
export default function ExhibitLinkCardPreview() {
  return <ExhibitLinkCard label="Setup" subtitle="Install and wire the data" description="Four steps" icon="book-open" href="/components/exhibit-link-card" />
}
