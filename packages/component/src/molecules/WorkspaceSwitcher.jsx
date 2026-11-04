import Dropdown from './Dropdown.jsx'

/**
 * WorkspaceSwitcher — Which workspace you are in. `WORKSPACE · Personal / Kolkrabbi ⌄` (float-everything W4 row 58,
 * 2026-11-04 — the exploration's workspace selector at the top of a rail). A label in the float label role, tracked
 * and uppercased, over a `Dropdown` of the workspaces; `variant="float"` is the float select on the well, the default
 * the sm dropdown. A workspace is `{ value, label, icon? }`; a nested one reads `Studio / Personal` in its label.
 *
 * @param {string}   [label]     default `Workspace`
 * @param {Array}    workspaces  Dropdown options
 * @param {string}   value
 * @param {Function} onChange    `(value) => void`
 * @param {'float'}  [variant]
 * @param {string}   [className]
 */
export default function WorkspaceSwitcher({ label = 'Workspace', workspaces = [], value, onChange, variant, className = '' }) {
  const float = variant === 'float'
  return (
    <div className={`inline-flex flex-col gap-3 ${className}`.trim()}>
      <span className="kol-float-label uppercase tracking-[0.03em] text-fg-64">{label}</span>
      <Dropdown variant={float ? 'float' : undefined} size={float ? 'md' : undefined} options={workspaces} value={value} onChange={onChange} ariaLabel={label} />
    </div>
  )
}
