export default function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-1.5 border-b border-line px-3 py-2.5">
      {title && <h3 className="pb-1 text-label font-medium text-fg">{title}</h3>}
      {children}
    </section>
  )
}
