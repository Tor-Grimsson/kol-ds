import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { CatalogPage } from '@kolkrabbi/kol-shell'

/* Round 14 — the three header levels in a catalog (tickets PageHeaderAppLevel + PageHeaderAppLevelDisplay, kol-monitor
 * 2026-10-18). The same CatalogPage three times, only `header.level` changed: page (the hero) · app (between, what
 * kol-shell's app pages default to) · section. The app title is display-01 at 46 · 60 from 768 (monitor's numbers);
 * its 19/26 light lede is the agent's pick between page's 22/28 and section's 16/24. */
export const meta = {
  round: 14,
  date: '2026-10-18',
  title: 'Header levels in a catalog',
  status: 'decided, review',
}

const KINDS = ['deck', 'note', 'image', 'video']
const ITEMS = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'].map((name, i) => ({ name, title: `${name} ${KINDS[i % 4]}`, kind: KINDS[i % 4], date: `2026-10-${String(18 - i).padStart(2, '0')}`, size: `${(i + 1) * 64} KB` }))
const LEVELS = [
  { level: 'page', lede: 'display-01 (56 · 80 · 96) over the 22/28 lede — the hero' },
  { level: 'app', lede: 'display-01 at 46 · 60 over a 19/26 lede — kol-shell’s app pages' },
  { level: 'section', lede: 'display-03 (36 · 42 · 48) over the 16/24 lede' },
]

export default function OpenQuestionsRound14() {
  usePageMeta({ tags: [], related: [] })
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader eyebrow="Open questions · Round 14" title="Header levels in a catalog" lede="page · app · section, each on the same CatalogPage. Is app the right step between the two?" />
      {LEVELS.map((l) => (
        <DocSection key={l.level} id={l.level} title={`level="${l.level}"`} lede={l.lede}>
          <div className="rounded border border-fg-08 overflow-hidden bg-surface-primary" style={{ height: 640 }}>
            <CatalogPage
              header={{ level: l.level, title: 'Catalog', subtitle: `${ITEMS.length} items` }}
              items={ITEMS}
              searchKeys={['title', 'kind']}
              filtersTitle="All Items"
              filterGroups={[{ label: 'Kind', key: 'kind', values: KINDS }]}
              toCard={(it) => ({ key: it.name, title: it.title, detail: it.kind, date: it.date, size: it.size, media: false })}
            />
          </div>
        </DocSection>
      ))}
    </div>
  )
}
