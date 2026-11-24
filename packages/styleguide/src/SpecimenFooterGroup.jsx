/**
 * SpecimenFooterGroup — A titled group in a sheet's footer. The library master `SpecimenFooterGroup` (Styleguide
 * page, Sheet section): the title in mono 12/16, uppercase, over the `content` slot (a library `Table`, or
 * `SpecimenNote`s), 12 apart.
 *
 * @param {string}    [title]      default "Parts"
 * @param {boolean}   [showTitle]  default true (Figma `show title`)
 * @param {ReactNode} children     the group's content (Figma slot `content`)
 */
export default function SpecimenFooterGroup({ title = 'Parts', showTitle = true, children }) {
  return (
    <div className="flex flex-col gap-3">
      {showTitle && <p className="kol-mono-12 m-0 uppercase tracking-[0.5px] text-auto">{title}</p>}
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}
