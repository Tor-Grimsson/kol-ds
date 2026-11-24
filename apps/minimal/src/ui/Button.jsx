import Icon from './Icon.jsx'

const VARIANTS = {
  filled: 'bg-accent text-accent-fg',
  outline: 'border border-line-strong text-fg hover:bg-field',
  ghost: 'text-muted hover:bg-field hover:text-fg',
}

export default function Button({ variant = 'ghost', icon, chevron, children, className = '', ...rest }) {
  const iconOnly = !children
  return (
    <button
      type="button"
      className={`inline-flex h-7 shrink-0 items-center justify-center gap-2 rounded-full text-label font-medium whitespace-nowrap outline-none focus-visible:outline-1 focus-visible:outline-fg disabled:opacity-40 ${iconOnly ? 'w-7' : 'px-3'} ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} />}
      {children}
      {chevron && <Icon name="chevron-down" size={12} />}
    </button>
  )
}
