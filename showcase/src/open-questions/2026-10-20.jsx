import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Icon, KOL_ICON_SET_INTERFACE, KOL_ICON_SET_SIGNAL } from '@kolkrabbi/kol-icons'

/* Round 15 — a category level above the icon groups (user 2026-10-20: "should we not make sub categories? like
 * arrows … these are all arrows. or tools?"). The groups stay as they are; each category gathers several of them,
 * gets its own page and a ⌘K row, and folds its groups in the rail. Names and membership are the agent's proposal. */
export const meta = {
  round: 15,
  date: '2026-10-20',
  title: 'Icon categories',
  status: 'decided, review',
}
/* DECIDED ON THE RECOMMENDATION, for review (2026-10-20 — user: "icons sure whatever you want, you
 * choose"). Built as drawn here, with three names changed so a category's URL slug never collides with
 * a group folder in its set: Editing → Design tools, Misc → Other, Color → Color & gradient. The live
 * data is `nav/icon-categories.js`; the rail, the gallery and ⌘K read it. */

const SETS = [
  {
    title: 'Interface',
    groups: KOL_ICON_SET_INTERFACE,
    categories: [
      { name: 'Arrows', groups: ['chevron', 'arrow', 'arrow-diagonal', 'caret', 'traffic', 'transfer'] },
      { name: 'Actions', groups: ['add-remove', 'singletons', 'eye-lock', 'notify'] },
      { name: 'Navigation', groups: ['nav', 'layout'] },
      { name: 'Content', groups: ['files', 'code', 'components', 'atomic'] },
      { name: 'Editing', groups: ['tools', 'editing', 'typography'] },
      { name: 'Media', groups: ['playback', 'device'] },
      { name: 'Shapes', groups: ['shape-primitives', 'shape-forms', 'pattern'] },
      { name: 'Brand', groups: ['identity', 'social'] },
      { name: 'Misc', groups: ['misc'] },
    ],
  },
  {
    title: 'Signal',
    groups: KOL_ICON_SET_SIGNAL,
    categories: [
      { name: 'Waves', groups: ['wave', 'curve', 'ramp', 'shaper', 'filter'] },
      { name: 'Patterns', groups: ['dither', 'pattern', 'ascii', 'line', 'radial'] },
      { name: 'Color', groups: ['generator', 'color', 'gradient'] },
      { name: 'Control', groups: ['logic', 'sequence', 'transport', 'cable'] },
      { name: 'Geometry', groups: ['shape', 'cap'] },
    ],
  },
]

const label = (f) => f.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

function Category({ set, cat }) {
  const names = cat.groups.flatMap((g) => set.groups[g] ?? [])
  return (
    <div className="flex flex-col gap-3 p-4 rounded border border-fg-08">
      <div className="flex items-baseline justify-between">
        <span className="kol-mono-14 text-emphasis">{cat.name}</span>
        <span className="kol-mono-12 text-fg-48">{names.length}</span>
      </div>
      <ul className="flex flex-col gap-1">
        {cat.groups.map((g) => (
          <li key={g} className="flex justify-between kol-mono-12 text-fg-64">
            <span>{label(g)}</span>
            <span className="text-fg-48">{set.groups[g]?.length ?? 0}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 text-oq-80">
        {names.slice(0, 24).map((n) => <Icon key={n} name={n} size={16} title={n} />)}
      </div>
    </div>
  )
}

export default function OpenQuestionsRound15() {
  usePageMeta({ tags: [], related: [] })
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader eyebrow="Open questions · Round 15" title="Icon categories" lede="A level above the groups: each category is a page, a ⌘K row and a fold in the rail. Rename, move or drop any of them." />
      {SETS.map((set) => {
        const placed = new Set(set.categories.flatMap((c) => c.groups))
        const loose = Object.keys(set.groups).filter((g) => !placed.has(g))
        return (
          <DocSection key={set.title} id={set.title.toLowerCase()} title={set.title} lede={`${Object.keys(set.groups).length} groups in ${set.categories.length} categories${loose.length ? ` · not placed: ${loose.join(', ')}` : ''}`}>
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
              {set.categories.map((cat) => <Category key={cat.name} set={set} cat={cat} />)}
            </div>
          </DocSection>
        )
      })}
    </div>
  )
}
