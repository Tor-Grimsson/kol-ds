import Divider from '../atoms/Divider.jsx'

/**
 * SpecList — Label and value rows. compact definition list of [label | value] rows: label left and
 * muted, value right-aligned one tone brighter, Divider-separated between
 * rows (never after the last). Data-agnostic "key facts" strip — the caller
 * formats values before passing (e.g. "Limited (30)", "A3, A2, A1").
 *
 * @param {Array<{label: string, value: ReactNode}>} items rows, keyed by label
 * @param {boolean} framed wrap the list in leading + trailing Divider
 * @param {'float'} [variant]  `float` (float-everything W8 row 126, 2026-11-04 — kol-float--style 48:3982): the info
 *        sheet — `title` in Inter 16 (`kol-float-body-lg`) over key · value rows on the sheet radius
 *        (`--kol-float-menu-r`, surface-secondary, 24 in), no dividers (the no-borders law): the key in
 *        `kol-float-hint` on fg-64 in a 126 column, the value beside it in Inter 13 on the emphasis ink, 12 between rows
 * @param {ReactNode} [title]  float: the sheet's heading (`Book information`)
 */
export default function SpecList({ items = [], framed = false, variant, title, className = '' }) {
  if (variant === 'float') {
    return (
      <section className={`flex w-full flex-col gap-5 rounded-[var(--kol-float-menu-r)] bg-surface-secondary p-6 ${className}`.trim()}>
        {title && <h3 className="kol-float-body-lg m-0 text-fg-emphasis">{title}</h3>}
        <dl className="m-0 flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.label} className="grid grid-cols-[126px_1fr] items-baseline gap-4">
              <dt className="kol-float-hint text-fg-64">{item.label}</dt>
              <dd className="kol-float-hint m-0 text-fg-emphasis" style={{ fontSize: 13 }}>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    )
  }
  return (
    <>
      {framed && <Divider />}
      <dl className="py-3">
        {items.map((item, index) => (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-6 py-3">
              <dt className="kol-helper-12 text-fg-48 whitespace-nowrap">{item.label}</dt>
              <dd className="kol-mono-12 text-right text-fg-64">{item.value}</dd>
            </div>
            {index < items.length - 1 && <Divider />}
          </div>
        ))}
      </dl>
      {framed && <Divider />}
    </>
  )
}
