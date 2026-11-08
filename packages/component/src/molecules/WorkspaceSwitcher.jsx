import Dropdown from './Dropdown.jsx'

/**
 * WorkspaceSwitcher — Which workspace you are in. `Personal / Kolkrabbi ⌄` (float-everything W4 row 58, 2026-11-04 —
 * the exploration's workspace selector at the top of a rail). A `Dropdown` of the workspaces — a button, no label of
 * its own (plan-2026-11-07-menu-system W1.2): the caller names it with `LabeledControl`
 * (`<LabeledControl label="Workspace" variant="float"><WorkspaceSwitcher … /></LabeledControl>`). `variant="float"` is
 * the float select on the well, the default the sm dropdown. A workspace is `{ value, label, icon? }`; a nested one
 * reads `Studio / Personal` in its label.
 *
 * @param {string}   [label]     what it chooses, for a screen reader — default `Workspace`
 * @param {Array}    workspaces  Dropdown options
 * @param {string}   value
 * @param {Function} onChange    `(value) => void`
 * @param {'float'}  [variant]
 * @param {string}   [className]
 */
export default function WorkspaceSwitcher({ label = 'Workspace', workspaces = [], value, onChange, variant, className = '' }) {
  const float = variant === 'float'
  return <Dropdown variant={float ? 'float' : undefined} size={float ? 'md' : undefined} options={workspaces} value={value} onChange={onChange} ariaLabel={label} className={className} />
}
