import { ColorSwatch } from '@kolkrabbi/kol-component'

export default function ColorSwatchDemo() {
  return (
    <div className="flex items-center gap-2">
      {['#0a0a0a', '#3b82f6', '#22c55e', '#ef4444'].map((c) => (
        <ColorSwatch key={c} hex={c} />
      ))}
    </div>
  )
}
