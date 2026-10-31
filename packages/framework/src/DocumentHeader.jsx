import { SectionText, TabsRow, Menu, MenuTrigger } from '@kolkrabbi/kol-component'

/**
 * DocumentHeader — a document page's header (kol-atlas's tabs header, apps/document 2026-10-31): the title as SectionText
 * `variant="document"` (headline only — user: *"this without section header is how atlas does it"*), then ONE navigation
 * row under a fg-12 rule: TabsRow for the plain tabs, the groups as Menus at its right end. Layout carried from the hand-
 * written header it replaced: `.kol-page` inset with no bottom pad, 16 between title and row, 24 between the row's parts.
 *
 * @param {ReactNode} title     the headline (the client's name)
 * @param {ReactNode} [eyebrow] · [lede]  passed through to SectionText; off by default
 * @param {Array}     tabs      TabsRow tabs `[{ id, label }]` · `value` · `onChange(id)`
 * @param {Array}     menus     `[{ label, items, current }]` — `items` are Menu rows; `current` holds the trigger pressed
 *                              (one of its pages is open)
 * @param {string}    [className]  extra classes on the block
 */
export default function DocumentHeader({ title, eyebrow, lede, tabs = [], value = '', onChange, menus = [], ariaLabel = 'Pages', className = '' }) {
  return (
    <div className={`kol-page pb-0 flex flex-col gap-4 ${className}`.trim()}>
      <SectionText variant="document" eyebrow={eyebrow} headline={title} body={lede} style={{ marginBottom: 0 }} />
      <div className="flex items-end gap-6 border-b border-fg-12">
        <TabsRow tabs={tabs} value={value} onChange={onChange} ariaLabel={ariaLabel} className="!border-0" />
        {menus.length > 0 && (
          <div className="ml-auto flex items-end gap-2 pb-2">
            {menus.map((m) => (
              <Menu key={m.label} align="end" minWidth={220} items={m.items}
                trigger={({ open, props }) => <MenuTrigger open={open || !!m.current} iconRight="chevron-down" {...props}>{m.label}</MenuTrigger>} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
