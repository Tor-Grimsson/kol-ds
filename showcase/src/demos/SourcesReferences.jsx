import { SourcesReferences } from '@kolkrabbi/kol-content'

export const stage = 'lg'

export default function SourcesReferencesDemo() {
  return (
    <SourcesReferences
      sources={[
        { title: 'Live', href: 'https://monitor.kolkrabbi.io', note: 'https://monitor.kolkrabbi.io' },
        { title: 'Repo', href: 'https://github.com/Tor-Grimsson/kol-monitor', note: 'https://github.com/Tor-Grimsson/kol-monitor' },
        { title: 'Butterick, Practical Typography', note: 'Print reference — no link, renders as a plain box.' },
      ]}
    />
  )
}
