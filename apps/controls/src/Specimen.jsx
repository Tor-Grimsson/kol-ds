/* One specimen: what it is, where it ships, where the same thing is still hand-built.
 * The stage is the surface consumers mount on — kol-monitor's modules sit on bg-surface-secondary
 * (modules/utility/Module.jsx). `--kol-ctl-hw-case` is a fixed #141414 and the labels follow the
 * page theme, so it is not a stage.
 * `handBuilt` is the adoption list (plan §6) — the repos a lobby ticket goes to when this ships. */
/* `does` — what the control DOES, one line each: the behaviour this reference exists to show (plan-2026-10-31-menu-engine
 * W3.2 — user: *"apps/controls is a pnpm controls reference of how they work and behave"*) */
/* `bare` — no fill behind the controls: a menu trigger rests on the page's own ground, the same surface the box
 * would paint, so in the box it vanished (user 2026-10-31: *"I cant view what you did"*) */
export default function Specimen({ title, ships, does = [], handBuilt = [], bare = false, children }) {
  return (
    <section className="flex flex-col gap-3 border-t border-fg-08 py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="kol-doc-section-title">{title}</h2>
        {ships && <code className="kol-doc-code-inline">{ships}</code>}
      </div>
      <div
        className={`flex flex-wrap items-start gap-4 overflow-x-auto rounded-[var(--kol-radius-sm)] p-4 ${bare ? '' : 'bg-surface-secondary'}`}
      >
        {children}
      </div>
      {does.length > 0 && (
        <ul className="kol-doc-caption flex flex-col gap-1">
          {does.map((d) => <li key={d}>{d}</li>)}
        </ul>
      )}
      {handBuilt.length > 0 && (
        <ul className="kol-doc-caption flex flex-col gap-1">
          {handBuilt.map((h) => <li key={h}>Hand-built · {h}</li>)}
        </ul>
      )}
    </section>
  )
}
