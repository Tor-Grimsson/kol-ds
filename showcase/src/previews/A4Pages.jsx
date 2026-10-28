import { A4Pages } from '@kolkrabbi/kol-styleguide'

export const stage = 'lg'

/* any content flowed across real A4 sheets (794 × 1123, 48px margins), breaks snapped between elements — record's kit
 * preview, now the DS's; the sheets print one per A4 page */
const SECTIONS = Array.from({ length: 14 }, (_, i) => i + 1)

export default function A4PagesPreview() {
  return (
    <div className="flex flex-col items-center gap-6" style={{ zoom: 0.5 }}>
      <A4Pages label="Preview">
        <div style={{ color: '#111', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
          <h1 style={{ fontSize: 40, margin: '0 0 24px' }}>A4 sheets for any content</h1>
          {SECTIONS.map((n) => (
            <section key={n} style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, margin: '0 0 8px' }}>Section {n}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>A block is measured off-screen at the page's content width; a page only ever ends between elements, so nothing is cut mid-line. When the content runs past a sheet, the next sheet takes the rest.</p>
            </section>
          ))}
        </div>
      </A4Pages>
    </div>
  )
}
