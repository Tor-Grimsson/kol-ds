import Divider from '../atoms/Divider.jsx'

/**
 * SpecList — compact definition list of [label | value] rows: label left and
 * muted, value right-aligned one tone brighter, Divider-separated between
 * rows (never after the last). Data-agnostic "key facts" strip — the caller
 * formats values before passing (e.g. "Limited (30)", "A3, A2, A1").
 *
 * @param {Array<{label: string, value: ReactNode}>} items rows, keyed by label
 * @param {boolean} framed wrap the list in leading + trailing Divider
 */
export default function SpecList({ items = [], framed = false }) {
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
