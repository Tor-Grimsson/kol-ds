import { Button } from '@kolkrabbi/kol-component'

/**
 * ButtonGroup — container for multiple KOL Buttons with consistent spacing and
 * alignment. Vendored into the foundry package: the monorepo shipped this as a
 * local `@kol/ui` molecule, but it is NOT (yet) part of the published
 * `@kolkrabbi/kol-component` surface, so it lives here as an internal leaf and
 * is imported relatively. If it later graduates into kol-component, delete this
 * file and repoint importers.
 *
 * Accepts an array of button configs (each an object of Button props, with
 * `label` as convenience for the child text).
 *
 * @param {Object} props
 * @param {string} props.title - Optional heading rendered above the buttons.
 * @param {Array} props.buttons - Array of Button prop objects ({ label|children, variant, ... }).
 * @param {'left'|'center'|'right'} props.align - Horizontal alignment (default 'center').
 * @param {string} props.className - Additional container classes.
 */
const ButtonGroup = ({
  title,
  buttons = [],
  align = 'center',
  className = ''
}) => {
  const alignClass = align === 'left'
    ? 'justify-start'
    : align === 'right'
    ? 'justify-end'
    : 'justify-center'

  const displayClass = align === 'center' ? 'flex sm:inline-flex' : 'flex'
  const widthClass = align === 'center' ? 'w-full sm:w-auto' : 'w-full'
  const marginClass = align === 'center' ? 'sm:mx-auto' : ''

  return (
    <div className={`${displayClass} flex-col ${widthClass} ${marginClass} ${className}`.trim()}>
      {title && (
        <h3 className="kol-heading-md mb-6 text-auto">{title}</h3>
      )}
      <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:${alignClass}`.trim()}>
        {buttons.map((button, index) => {
          const { label, children, ...buttonProps } = button
          return (
            <Button key={index} {...buttonProps} className={`w-full sm:w-auto ${buttonProps.className || ''}`.trim()}>
              {label || children}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default ButtonGroup
