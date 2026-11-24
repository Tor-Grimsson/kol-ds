/**
 * Link — A text action in the link color. a button drawn as a link: a short action inside a line of text, a toast's
 * "Show in …" or a share sheet's "Copy link" (kolbox's Link, Figma 188:20997, carried class for class:
 * plan-2026-11-18-kolbox-system W31.2, 2026-11-18). Size 11 on a 15 line in the link color, no underline until hover,
 * one line; the family and weight are the row's. The focus ring is the accent's. Chrome in kol-theme `.kol-link`.
 *
 *   <Link onClick={reveal}>Show in folder</Link>
 *
 * A link that navigates is an <a>; this is an action, so it is a button.
 *
 * @param {ReactNode} children - The words
 * @param {string} [className] - Extra classes on the button
 */
export default function Link({ children, className = '', ...rest }) {
  return (
    <button type="button" className={`kol-link shrink-0 whitespace-nowrap outline-none hover:underline focus-visible:outline-solid focus-visible:outline-1 ${className}`} {...rest}>
      {children}
    </button>
  )
}
