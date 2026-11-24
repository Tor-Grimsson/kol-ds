export default function Segmented({ value, onChange, options, className = '' }) {
  return (
    <div className={`flex h-7 items-center gap-0.5 rounded-field bg-field p-0.5 ${className}`}>
      {/* an option is a string, or { value, label, ariaLabel } */}
      {options.map((o) => (
        <button
          key={o.value ?? o}
          type="button"
          aria-label={o.ariaLabel}
          onClick={() => onChange(o.value ?? o)}
          className={`h-6 flex-1 rounded-inner px-2 text-label font-medium outline-none focus-visible:outline-1 focus-visible:outline-fg ${(o.value ?? o) === value ? 'bg-field-hover text-fg' : 'text-muted hover:text-fg'}`}
        >
          {o.label ?? o}
        </button>
      ))}
    </div>
  )
}
