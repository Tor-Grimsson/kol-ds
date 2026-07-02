import { Link } from 'react-router-dom'
import DocLayout from '../lib/DocLayout.jsx'
import DocHeader, { DocSection } from '../lib/DocHeader.jsx'
import PreviewCard from '../lib/PreviewCard.jsx'
import { DEMOS } from '../lib/demos-registry.js'

/**
 * Docs · Menus — the menu family in one place: what each piece is for, the
 * composition standards, and the unification/deprecation state.
 */

const TOC = [
  { id: 'family', label: 'The family' },
  { id: 'which', label: 'Which one do I use?' },
  { id: 'standards', label: 'Standards' },
  { id: 'unification', label: 'Unification & roadmap' },
]

const FAMILY = [
  { name: 'Dropdown', role: 'Value select — pick one of N options; button shows the current value.', slug: 'dropdown' },
  { name: 'DropdownTagFilter', role: 'Multi-select filter — all options start selected; toggle off; "deselect all".', slug: 'dropdown-tag-filter' },
  { name: 'MenuItem', role: 'THE action-menu trigger — button + floating-ui panel holding arbitrary rows.', slug: 'menu-item' },
  { name: 'MenuDropdownItem', role: 'Action row — icon column, label, shortcut, disabled; closes the menu on click.', slug: 'menu-dropdown-item' },
  { name: 'MenuDropdownDivider', role: 'Rule between row groups.', slug: 'menu-dropdown-divider' },
  { name: 'MenuDropdownNest', role: 'Inline accordion row — expands sub-rows inside the same panel.', slug: 'menu-dropdown-nest' },
  { name: 'MenuPopover', role: 'DEPRECATED — alias of MenuItem since the 2026-07-02 unification.', slug: 'menu-popover', deprecated: true },
]

export default function DocsMenus() {
  return (
    <DocLayout toc={TOC}>
      <DocHeader
        eyebrow="Docs"
        title="Menus"
        lede="One trigger, one row vocabulary. The menu family is a compound system (Radix/shadcn DropdownMenu model): a trigger opens a panel, rows compose inside it. Value selection is a different job and has its own components."
      />

      <DocSection id="family" title="The family">
        <div className="overflow-x-auto rounded-[var(--kol-radius-md)] border border-fg-12">
          <table className="w-full text-left kol-sans-body-02">
            <thead>
              <tr className="border-b border-fg-12 text-meta">
                <th className="px-4 py-2.5 kol-helper-10 font-normal uppercase tracking-widest">Component</th>
                <th className="px-4 py-2.5 kol-helper-10 font-normal uppercase tracking-widest">Role</th>
              </tr>
            </thead>
            <tbody>
              {FAMILY.map((f) => (
                <tr key={f.name} className="border-b border-fg-08 align-top last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 kol-mono-12">
                    <Link to={`/components/${f.slug}`} className={f.deprecated ? 'text-subtle line-through hover:text-emphasis' : 'text-emphasis hover:underline'}>
                      {f.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-body">{f.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PreviewCard entry={DEMOS.MenuItem} minH="min-h-[16rem]" />
      </DocSection>

      <DocSection id="which" title="Which one do I use?">
        <ul className="flex list-disc flex-col gap-2 pl-5 kol-sans-body-02 text-body">
          <li><span className="kol-mono-12 text-emphasis">Dropdown</span> — the user picks ONE value and the control shows it (sort order, page size).</li>
          <li><span className="kol-mono-12 text-emphasis">DropdownTagFilter</span> — the user toggles a SET of values (content filters).</li>
          <li><span className="kol-mono-12 text-emphasis">MenuItem</span> + rows — the user triggers ACTIONS (File/Edit menus, per-item ⋯ menus). Compose with MenuDropdownItem / Divider / Nest.</li>
        </ul>
      </DocSection>

      <DocSection id="standards" title="Standards">
        <ul className="flex list-disc flex-col gap-2 pl-5 kol-sans-body-02 text-body">
          <li><span className="kol-mono-12 text-emphasis">Panel width</span> — set on the trigger: <code className="kol-mono-12">panelClassName="min-w-[180px] py-1"</code>. 180px floor for plain rows, 200px with icons/shortcuts.</li>
          <li><span className="kol-mono-12 text-emphasis">Icons</span> — always through the row's <code className="kol-mono-12">iconLeft</code> slot (fixed 16px column, rows stay aligned); 14px icons.</li>
          <li><span className="kol-mono-12 text-emphasis">Shortcuts / markers</span> — the row's trailing <code className="kol-mono-12">shortcut</code> slot.</li>
          <li><span className="kol-mono-12 text-emphasis">defaultOpen</span> — docs previews and restored UI state only; menus open closed in real flows.</li>
          <li><span className="kol-mono-12 text-emphasis">Not for value selection</span> — a menu that ends in a checkmark next to one chosen value should be a Dropdown.</li>
        </ul>
      </DocSection>

      <DocSection
        id="unification"
        title="Unification & roadmap"
        lede="2026-07-02: MenuPopover and MenuItem had identical APIs and duplicate implementations (hand-rolled fixed positioning vs floating-ui). MenuPopover is now a deprecated alias of MenuItem — one implementation, floating-ui. Next major: remove the alias, and rename the family to ecosystem convention (the trigger reading as a 'menu', the rows as 'items' — today's MenuItem-is-the-trigger naming inverts what Radix/shadcn readers expect)."
      />
    </DocLayout>
  )
}
