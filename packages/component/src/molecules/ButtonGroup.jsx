/* taxonomy-ok: composes consumer-passed Buttons via children — nesting happens at the call site */

/**
 * ButtonGroup — responsive layout wrapper for a group of Buttons: stacked
 * full-width on mobile, horizontal row from `sm` up, aligned left / center /
 * right. Pure layout — children compose at the call site and render as-is
 * (nothing is cloned, no props injected); all button behavior lives on each
 * Button. `center` (default) hugs its content and self-centers; `left` /
 * `right` stay full-width block. Alignment classes come from static lookup
 * maps of complete literals — never interpolated — so Tailwind's scanner
 * sees them.
 *
 * @param {'left'|'center'|'right'} align horizontal alignment + container layout mode (default 'center')
 * @param {string}    title     optional heading rendered above the group, authored at the call site
 * @param {string}    className extra container classes (appended)
 * @param {ReactNode} children  the Buttons
 */

const CONTAINER = {
  left: 'flex flex-col w-full',
  center: 'flex sm:inline-flex flex-col w-full sm:w-auto sm:mx-auto',
  right: 'flex flex-col w-full',
}

const JUSTIFY = {
  left: 'sm:justify-start',
  center: 'sm:justify-center',
  right: 'sm:justify-end',
}

export default function ButtonGroup({ align = 'center', title, className = '', children }) {
  return (
    <div className={[CONTAINER[align] || CONTAINER.center, className].filter(Boolean).join(' ')}>
      {title && <h3 className="kol-sans-heading-05 text-emphasis mb-6">{title}</h3>}
      <div
        className={[
          'flex flex-col gap-4 sm:flex-row sm:items-center',
          JUSTIFY[align] || JUSTIFY.center,
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  )
}
