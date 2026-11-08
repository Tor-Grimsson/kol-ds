/* A colour key as a card's foot draws it: a dot, its label and an optional value. */
export default function ColorKey({ color, label, value }) {
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />{label}{value != null && <span className="text-fg-80">{value}</span>}</span>
  )
}
