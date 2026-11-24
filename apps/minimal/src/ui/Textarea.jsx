export default function Textarea({ className = '', ...rest }) {
  return (
    <textarea
      className={`min-h-14 w-full resize-y rounded-field border border-transparent bg-field px-2 py-1.5 font-mono text-label text-fg outline-none hover:bg-field-hover focus:border-fg ${className}`}
      {...rest}
    />
  )
}
