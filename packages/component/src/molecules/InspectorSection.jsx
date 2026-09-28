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
 * `pane` (editor inspector rebuild, 2026-09-27 — user: "why are we not sectioning off the panes?
 * saying 'this is type' 'this is transform'"): the Affinity panel shape instead of a labelled form
 * group — a titled header strip, a padded body, and a FULL-WIDTH rule between panes. Mount panes
 * in a container with no horizontal padding; each pane pads itself, so its rule runs edge to edge.
 *
 * @param {ReactNode} label    the group's name
 * @param {ReactNode} actions  controls on the label's row, right-aligned
 * @param {boolean}   divided  a hairline between divided siblings
 * @param {boolean}   pane     the panel shape: header strip + body, full-width rules between panes
 * @param {string}    className
 */
export default function InspectorSection({ label, actions = null, children, divided = false, pane = false, className = '' }) {
  if (pane) {
    return (
      <section className={`kol-inspector-pane ${className}`.trim()}>
        {(label || actions) && (
          <header className="kol-inspector-pane-head">
            {label && <h3 className="kol-inspector-pane-title">{label}</h3>}
            {actions}
          </header>
        )}
        <div className="kol-inspector-pane-body">{children}</div>
      </section>
    )
  }
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
