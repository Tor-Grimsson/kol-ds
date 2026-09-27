/**
 * InspectorSection — labeled control group for inspector/editor panels.
 * Renamed from `Section` 2026-08-26 (SectionSet): the website-section family
 * took the `Section*` prefix and this one sat inside it as a stranger.
 * `Section` stays exported as an alias. Same classes, same render.
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
 *
 * @param {ReactNode} label    the group's name
 * @param {ReactNode} actions  controls on the label's row, right-aligned
 * @param {boolean}   divided  a hairline between divided siblings
 * @param {string}    className
 */
export default function InspectorSection({ label, actions = null, children, divided = false, className = '' }) {
  return (
    <div className={`flex flex-col gap-2${divided ? ' kol-section--divided' : ''} ${className}`}>
      {/* `actions` — controls on the label's row, right-aligned (Figma's eye / plus on Fill and
        * Stroke). From the design editor's own Section, retired into this (editor DS sync,
        * 2026-09-27). */}
      {(label || actions) && (
        <div className="flex items-center gap-2 min-h-6">
          {label && <p className="kol-helper-10 tracking-widest text-meta flex-1">{label}</p>}
          {actions}
        </div>
      )}
      {children}
    </div>
  )
}
