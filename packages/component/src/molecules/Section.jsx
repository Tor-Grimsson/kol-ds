/**
 * Section — labeled control group for inspector/editor panels.
 *
 * A small-caps label above a vertical content stack. Used across the editor
 * inspector panels (palette / pattern / type modes): `<Section label="Aspect">…</Section>`.
 *
 * `divided` (InspectorSectionRhythm, 2026-08-15) adds the between-siblings
 * hairline every rail consumer was retyping locally — the rule lives on the
 * ADJACENT pair (`.kol-section--divided + .kol-section--divided`) in
 * kol-components-molecules.css, so the first section in a stack never carries
 * a stray top border. Set it on every section in the stack; a rail that mixes
 * divided and plain sections divides only between the divided ones.
 *
 * ponytail: a `SectionStack` parent could own this instead of each child
 * declaring it — that is the upgrade path if a consumer ever needs the stack
 * to vary the rule per-gap. One prop is a smaller API than a new component.
 */
export default function Section({ label, children, divided = false, className = '' }) {
  return (
    <div className={`flex flex-col gap-2${divided ? ' kol-section--divided' : ''} ${className}`}>
      {label && (
        <p className="kol-helper-10 tracking-widest text-meta">{label}</p>
      )}
      {children}
    </div>
  )
}
