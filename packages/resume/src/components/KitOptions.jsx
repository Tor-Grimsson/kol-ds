import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Input, PopoverPanel, ToggleCheckbox, usePopover } from '@kolkrabbi/kol-component'
import { KIT_PAGES, KIT_PAGE_IDS, readKitOptions } from '../lib/kitOptions.js'
import LangToggle from './LangToggle.jsx'

/**
 * The export options — language, which numbered sections compile into the
 * kit, and the Role / Company the cover letter is addressed to.
 *
 * Everything writes straight to the URL query (lib/kitOptions.js, `?lang`):
 * the preview re-renders live, the Library's Open links carry the same query,
 * and the headless export reloads the very same URL — so what is set here is
 * exactly what compiles. `kit` = false (a layout treatment) shows language only.
 *
 * Two shells: `KitOptionsFields` is the bare form (the Library renders it
 * inline); the default export is its button and popover, in a treatment's toolbar.
 *
 * ON THE SYSTEM'S PARTS (LayoutsAppPages, 2026-10-29 — user: *"nothing here is DS, all inline"*): record had hand-built
 * the checkboxes, inputs and the floating panel; they are `ToggleCheckbox`, `Input`, `Button` and the `PopoverPanel` now.
 * The logic (everything in the URL) is record's, unchanged.
 */
export function KitOptionsFields({ kit = true }) {
  const [params, setParams] = useSearchParams()
  const { pages, role, company } = readKitOptions(params)

  // Always write every field, so a cleared input actually clears in the URL.
  const set = (next) => {
    const p = new URLSearchParams(params)
    const v = { pages, role, company, ...next }
    v.pages.length === KIT_PAGE_IDS.length ? p.delete('pages') : p.set('pages', v.pages.join(','))
    v.role ? p.set('role', v.role) : p.delete('role')
    v.company ? p.set('company', v.company) : p.delete('company')
    setParams(p, { replace: true })
  }

  const togglePage = (id) =>
    set({ pages: KIT_PAGE_IDS.filter((p) => (p === id ? !pages.includes(id) : pages.includes(p))) })

  const head = 'kol-helper-10 text-meta uppercase'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <p className={head}>Language</p>
        <LangToggle className="max-w-[8rem]" />
      </div>

      {kit && (
        <>
          <div className="flex flex-col gap-1.5">
            <p className={head}>Pages in PDF</p>
            {KIT_PAGES.map((p, i) => (
              <ToggleCheckbox key={p.id} checked={pages.includes(p.id)} onChange={() => togglePage(p.id)} label={`${String(i + 1).padStart(2, '0')}  ${p.label}`} />
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <p className={head}>Cover letter</p>
            <Input size="sm" placeholder="Role" value={role} onChange={(e) => set({ role: e.target.value })} />
            <Input size="sm" placeholder="Company" value={company} onChange={(e) => set({ company: e.target.value })} />
          </div>
        </>
      )}
    </div>
  )
}

export default function KitOptions({ kit = true }) {
  const [params] = useSearchParams()
  const { pages } = readKitOptions(params)
  const [open, setOpen] = useState(false)
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'bottom-start', offset: 8 })

  return (
    <>
      <span ref={popover.refs.setReference} {...popover.getReferenceProps()} className="inline-flex print:hidden">
        <Button size="sm" tone="outline" pressed={open}>
          {kit ? `Options · ${pages.length}/${KIT_PAGE_IDS.length}` : 'Options'}
        </Button>
      </span>
      <PopoverPanel popover={popover} className="w-72 p-4">
        <KitOptionsFields kit={kit} />
      </PopoverPanel>
    </>
  )
}
