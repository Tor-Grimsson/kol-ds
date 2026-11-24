/**
 * SpecimenNote — One labelled note line. The library master `SpecimenNote` (Styleguide page, Sheet section): a 320
 * label cell (mono 12/16, uppercase) and a text cell (mono 10/16 at fg-64) behind an oq-08 rule on its left.
 *
 * @param {string} [label]  default "NOTE 1"
 * @param {string} text
 */
export default function SpecimenNote({ label = 'NOTE 1', text }) {
  return (
    <div className="flex">
      <div className="flex w-80 shrink-0 py-2">
        <p className="kol-mono-12 m-0 uppercase tracking-[0.5px] text-auto">{label}</p>
      </div>
      <div className="flex min-w-0 flex-1 border-l border-oq-08 px-4 py-2">
        <p className="kol-mono-10 m-0 leading-4 text-fg-64">{text}</p>
      </div>
    </div>
  )
}
