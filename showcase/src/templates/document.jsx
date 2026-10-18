import { SectionHero, SectionText, Table } from '@kolkrabbi/kol-component'

/* DOCUMENT — structured text and media: a hero, then sections of text, a contained media plate and a table
 * (brand.kolkrabbi.io's brand page; the asset pages are the same template) */
export const stage = 'full'
const bg = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#1d1d21"/><circle cx="1150" cy="320" r="300" fill="none" stroke="#8a8a94" stroke-width="2"/></svg>')}`

export default function DocumentTemplate() {
  return (
    <div className="flex flex-col gap-12 w-full">
      <SectionHero media={{ src: bg, kind: 'image', alt: '' }} height="md" overlayOpacity={24} label="BRAND" headline="The mark and its rules" body="Clear space, minimum sizes and the lockups — one page per subject." />
      <div className="flex flex-col gap-10 px-8 pb-8">
        <SectionText label="CLEAR SPACE" headline="The logomark is the unit" headlineSize="heading-03" body="Clear space equals the logomark's height on every side. Nothing enters it — type, edges, other marks." />
        <figure className="kol-doc-figure flex items-center justify-center" style={{ height: 220 }}><span className="kol-mono-12 text-meta">media container</span></figure>
        <Table width="column" caption="Minimum sizes" columns={[{ accessor: 'mark', header: 'Mark' }, { accessor: 'print', header: 'Print' }, { accessor: 'screen', header: 'Screen' }]}
          rows={[{ id: 'a', mark: 'Logomark', print: '8 mm', screen: '16 px' }, { id: 'b', mark: 'Wordmark', print: '20 mm', screen: '64 px' }]} />
      </div>
    </div>
  )
}
