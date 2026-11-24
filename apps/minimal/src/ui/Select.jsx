export default function Select({ value, onChange, options, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`select h-7 min-w-0 flex-1 appearance-none rounded-field bg-field pr-7 pl-2 text-label text-fg outline-none hover:bg-field-hover focus-visible:outline-1 focus-visible:outline-fg ${className}`}
    >
      {/* an option is a string, or { value, label } */}
      {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  )
}
