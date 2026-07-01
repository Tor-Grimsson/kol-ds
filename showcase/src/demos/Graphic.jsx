import { Graphic } from '@kolkrabbi/kol-component'

export default function GraphicDemo() {
  return (
    <div className="grid grid-cols-3 gap-4 max-w-md">
      <Graphic category="patterns" name="patt-03" title="Pattern 03" />
      <Graphic category="patterns" name="patt-07" title="Pattern 07" />
      <Graphic category="patterns" name="patt-12" title="Pattern 12" />
      <Graphic category="abstract" name="abstract-01" title="Abstract 01" />
      <Graphic category="social" name="social-05" title="Social 05" />
      <Graphic category="structure" name="diagram-grid-logomark" title="Grid logomark" />
    </div>
  )
}
