import { Link } from 'react-router-dom'
import { Icon } from '@kolkrabbi/kol-icons'
import { Graphic } from '@kolkrabbi/kol-component'
import DocLayout from '../lib/DocLayout.jsx'
import DocHeader, { DocSection } from '../lib/DocHeader.jsx'
import PreviewCard from '../lib/PreviewCard.jsx'
import ApiTable from '../lib/ApiTable.jsx'

/**
 * Docs · Loaders — Icon and Graphic are functional infrastructure, not
 * visual UI components: they resolve names to SVG assets. They live here
 * (shadcn model: meta material in Docs, never in the components list);
 * the visual galleries stay on the Icons pages.
 */

const TOC = [
  { id: 'why', label: 'Why loaders are not components' },
  { id: 'icon', label: 'Icon' },
  { id: 'graphic', label: 'Graphic' },
  { id: 'data', label: 'Data exports' },
  { id: 'gotchas', label: 'Gotchas' },
]

export default function DocsLoaders() {
  return (
    <DocLayout toc={TOC}>
      <DocHeader
        eyebrow="KOL · Docs"
        title="Loaders"
        lede="Icon and Graphic resolve a name to an SVG asset. They are functional infrastructure — the pipe, not the water — so they're documented here rather than listed as components."
      />

      <DocSection
        id="why"
        title="Why loaders are not components"
        lede="A component is a visual UI element with its own anatomy. A loader is a registry lookup: it has an inventory, a resolution order, and a size prop. Docs treatment follows Shell & Layout's precedent — infrastructure lives in Docs; the galleries stay visual."
      >
        <p className="kol-sans-body-02 text-body">
          Browse the inventories on <Link className="text-emphasis underline" to="/icons">Icons</Link> and{' '}
          <Link className="text-emphasis underline" to="/icons/v1">kol-icon-set-v1</Link>.
        </p>
      </DocSection>

      <DocSection
        id="icon"
        title="Icon"
        lede="From @kolkrabbi/kol-icons. Resolves a filename-derived name across the canonical stroke set, the solid set, the legacy loader set, and the web app set — in that order, so the canonical cut always wins."
      >
        <PreviewCard>
          <div className="flex items-center gap-4">
            <Icon name="search" size={16} />
            <Icon name="chevron-down" size={16} />
            <Icon name="theme-toggle" size={18} />
            <Icon name="social-github" size={18} />
          </div>
        </PreviewCard>
        <ApiTable
          rows={[
            { prop: 'name', type: 'string', def: '—', desc: 'SVG filename without extension.' },
            { prop: 'variant', type: "'stroke' | 'solid'", def: "'stroke'", desc: 'Preferred cut; falls back to the other, then legacy sets.' },
            { prop: 'size', type: 'number | string', def: '16', desc: 'Rendered box size.' },
            { prop: 'className / style', type: 'string / object', def: '—', desc: 'Pass-through styling.' },
          ]}
        />
      </DocSection>

      <DocSection
        id="graphic"
        title="Graphic"
        lede="From @kolkrabbi/kol-component. The SVG illustration loader — addresses a graphic by category + name from its own globbed svg/** inventory."
      >
        <PreviewCard>
          <div className="flex items-center gap-6">
            <Graphic category="patterns" name="patt-03" title="Pattern 03" />
            <Graphic category="abstract" name="abstract-01" title="Abstract 01" />
          </div>
        </PreviewCard>
      </DocSection>

      <DocSection
        id="data"
        title="Data exports"
        lede="The loaders ship their inventories as data — these are maps and lists, not components, and never get doc pages."
      >
        <ApiTable
          rows={[
            { prop: 'ICON_ENTRIES', type: '{ name, folder }[]', def: 'kol-icons', desc: 'Flat list globbed from the canonical stroke SVGs.' },
            { prop: 'SOLID_ICON_ENTRIES', type: '{ name, folder }[]', def: 'kol-icons', desc: 'Solid-cut inventory (keys-only) for mirror-gap diffing.' },
            { prop: 'ICON_INDEX / ICONS', type: '{ [folder]: name[] }', def: 'kol-icons', desc: 'Inventory grouped by folder; ICONS aliases ICON_INDEX.' },
            { prop: 'ALL_ICONS / hasIcon / getCategory', type: 'list / fn / fn', def: 'kol-icons', desc: 'Flattened names + lookup helpers.' },
            { prop: 'GRAPHICS', type: '{ [category]: name[] }', def: 'kol-component', desc: 'Graphic inventory grouped by category (keys-only, no SVG content).' },
          ]}
        />
      </DocSection>

      <DocSection
        id="gotchas"
        title="Gotchas"
        lede="One real one: the registries are built with import.meta.glob, which Vite only expands in source-transformed files."
      >
        <p className="kol-sans-body-02 text-body">
          A consumer that pre-bundles <span className="kol-mono-12">@kolkrabbi/kol-icons</span> (Vite's default for
          node_modules) gets an <em>empty</em> registry in dev — every icon warns "not found" while prod builds are fine.
          Exclude it: <span className="kol-mono-12">optimizeDeps.exclude: ['@kolkrabbi/kol-icons']</span>.
        </p>
      </DocSection>
    </DocLayout>
  )
}
