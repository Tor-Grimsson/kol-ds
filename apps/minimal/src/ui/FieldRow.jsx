export default function FieldRow({ label, children, align = 'center', stacked = false }) {
  if (stacked) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-label text-muted">{label}</span>
        <div className="flex min-w-0 items-center gap-1">{children}</div>
      </div>
    )
  }
  return (
    <div className={`flex min-h-7 gap-2 ${align === 'start' ? 'items-start' : 'items-center'}`}>
      <span className={`w-[84px] shrink-0 text-label text-muted ${align === 'start' ? 'pt-1.5' : ''}`}>{label}</span>
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
    </div>
  )
}
