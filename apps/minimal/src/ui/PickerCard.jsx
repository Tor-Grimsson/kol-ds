import Icon from './Icon.jsx'

/* The start picker: a centred card over a scrim. A title (and a line under it), then one wide row per entry; `onBack` adds the Back row.
   A press on the scrim calls `onClose`. */
export function PickerCard({ title, subtitle, rows, onBack, onClose }) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center overflow-y-auto bg-ground/60 p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}
    >
      <div className="my-auto flex w-full max-w-sm flex-col gap-6 rounded-bar border border-line bg-panel p-4">
        <div className="flex flex-col gap-2">
          <span className="text-label font-medium text-muted">{title}</span>
          {subtitle && <span className="font-mono text-label text-muted">{subtitle}</span>}
        </div>
        <div className="flex flex-col gap-2">
          {rows.map((r) => <PickerCardRow key={r.key ?? r.label} icon={r.icon} onClick={r.onClick}>{r.label}</PickerCardRow>)}
          {onBack && <PickerCardRow icon="arrow-left" quiet onClick={onBack}>Back</PickerCardRow>}
        </div>
      </div>
    </div>
  )
}

export function PickerCardRow({ icon, quiet = false, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 items-center justify-between rounded-field px-4 text-nav font-medium outline-none focus-visible:outline-1 focus-visible:outline-fg ${quiet ? 'text-muted hover:bg-field hover:text-fg' : 'bg-field text-fg hover:bg-field-hover'}`}
    >
      <Icon name={icon} />
      <span>{children}</span>
      <Icon name={icon} />
    </button>
  )
}
