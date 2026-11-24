export default function Toggle({ checked, onChange, ...rest }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      {...rest}
      className={`flex h-4 w-7 shrink-0 items-center rounded-full px-0.5 outline-none focus-visible:outline-1 focus-visible:outline-fg ${checked ? 'justify-end bg-accent' : 'justify-start bg-line-strong'}`}
    >
      <span className={`size-3 rounded-full ${checked ? 'bg-accent-fg' : 'bg-fg'}`} />
    </button>
  )
}
