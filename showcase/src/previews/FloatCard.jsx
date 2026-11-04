import { FloatCard } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — the float style's own glass recipe, over a stage with something behind it.
export default function FloatCardPreview() {
  return (
    <div className="relative w-full max-w-[520px] h-[300px] rounded-[var(--kol-float-menu-r)] overflow-hidden bg-surface-sunken">
      <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(circle at 70% 30%, var(--kol-palette-blue) 0, transparent 45%), radial-gradient(circle at 20% 80%, var(--kol-palette-purple) 0, transparent 40%)' }} />
      <div className="absolute left-8 top-8 w-[220px]">
        <FloatCard title="01 / Chrome" support="Pills · rail · transport" lines={['#151619 / 54%', 'Background blur / 24 px', 'Edge / 1 px white 12%', 'Shadow / 0 8 24 −8', 'Black / 25%']} />
      </div>
    </div>
  )
}
