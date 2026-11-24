export default function Input({ lead, unit, className = '', ...rest }) {
  return (
    <label className={`flex h-7 min-w-0 flex-1 items-center gap-2 rounded-field border border-transparent bg-field px-2 hover:bg-field-hover focus-within:border-fg ${className}`}>
      {lead && <span className="text-label text-faint">{lead}</span>}
      <input className="min-w-0 flex-1 bg-transparent font-mono text-label text-fg outline-none" {...rest} />
      {unit && <span className="text-label text-faint">{unit}</span>}
    </label>
  )
}
