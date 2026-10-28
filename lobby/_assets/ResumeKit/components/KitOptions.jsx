import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { KIT_PAGES, KIT_PAGE_IDS, readKitOptions } from '../lib/kitOptions'
import LangToggle from './LangToggle'

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
 * inline); the default export floats it as a light-scoped overlay over a
 * treatment preview.
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
  const field =
    'kol-mono-12 w-full bg-surface-primary text-emphasis border border-fg-16 rounded px-2 py-1 outline-none focus:border-fg-64'

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
              <label key={p.id} className="kol-mono-12 flex items-center gap-2 text-emphasis cursor-pointer">
                <input
                  type="checkbox"
                  checked={pages.includes(p.id)}
                  onChange={() => togglePage(p.id)}
                  className="accent-current"
                />
                <span className="text-subtle">{String(i + 1).padStart(2, '0')}</span>
                {p.label}
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <p className={head}>Cover letter</p>
            <input className={field} placeholder="Role" value={role} onChange={(e) => set({ role: e.target.value })} />
            <input className={field} placeholder="Company" value={company} onChange={(e) => set({ company: e.target.value })} />
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

  return (
    <div className="fixed top-16 right-4 z-50 print:hidden flex flex-col items-end gap-2" data-theme="light">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="kol-mono-12 px-3 py-1.5 rounded bg-[#121215] text-white cursor-pointer"
      >
        {open ? 'Close options' : kit ? `Options · ${pages.length}/${KIT_PAGE_IDS.length}` : 'Options'}
      </button>

      {open && (
        <div className="w-64 bg-surface-tertiary border border-fg-08 rounded p-3 shadow-lg">
          <KitOptionsFields kit={kit} />
        </div>
      )}
    </div>
  )
}
