import { useState } from 'react'
import { PageShell } from '@kolkrabbi/kol-shell'
import { PageHeader, ContentFilters } from '@kolkrabbi/kol-component'
import Icon from '../../../mixer/src/components/icons/Icon.jsx'

/**
 * IconsPage — /icons, every glyph in mirror's local registry, searchable
 * (user 2026-08-28: "set these icons up in a page where we can search for
 * it"). The same `import.meta.glob` the Icon component uses, so the page can
 * never drift from what actually renders — a name here is a name that works.
 *
 * THE FILTER ROW IS `ContentFilters` (2026-10-03, user ruling) — the page drew
 * its own search field and group chips where the organism ships. The tiles are
 * still this page's.
 *
 * Click a tile to copy its name.
 */
const svgModules = import.meta.glob('../../../mixer/src/components/icons/svg/**/*.svg', { eager: true, query: '?raw', import: 'default' })

/* `group` is the chip — the folder without its ordering prefix; `folder` is the path as it is */
const ICONS = Object.keys(svgModules)
  .map((path) => {
    const parts = path.split('/')
    const name = (parts.pop() || '').replace('.svg', '')
    const folder = parts.pop() || ''
    return { name, folder, group: folder.replace(/^\d+-/, '') }
  })
  .sort((a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name))

const GROUPS = [...new Set(ICONS.map((i) => i.group))]

export default function IconsPage() {
  const [copied, setCopied] = useState(null)

  return (
    <PageShell>
      <PageHeader title="Icons" subtitle={`${ICONS.length} glyphs in the local registry`} size="sm" voice="mono" />

      <ContentFilters
        items={ICONS}
        title="All Icons"
        totalCount={ICONS.length}
        searchKeys={['name']}
        filterGroups={[{ label: 'Groups', key: 'group', values: GROUPS }]}
        mutuallyExclusiveFilters={['group']}
        renderItem={(shown) => (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
            {shown.map((i) => (
              <div
                key={`${i.folder}/${i.name}`}
                onClick={() => { navigator.clipboard?.writeText(i.name); setCopied(i.name) }}
                className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                style={{ border: '1px solid var(--kol-fg-08)', borderRadius: 'var(--kol-radius-xs)', padding: '16px 8px', minHeight: 92 }}
                title={`${i.folder}/${i.name}.svg`}
              >
                <Icon name={i.name} size={24} className="text-oq-96" />
                <span className="kol-helper-10 text-fg-48 text-center" style={{ wordBreak: 'break-all' }}>
                  {copied === i.name ? 'copied' : i.name}
                </span>
              </div>
            ))}
          </div>
        )}
      />
    </PageShell>
  )
}
