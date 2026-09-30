import Button from '../atoms/Button.jsx'
import IconFrame from '../atoms/IconFrame.jsx'

/**
 * CloseButton — the X that dismisses a thing. One component, so there is one.
 *
 * WHY IT EXISTS (user 2026-09-03: *"why are you FUCKING MAKING INDIVIDUAL
 * CHANGES this isnt difficult, this is a button component yes or no"*). It is a
 * Button, and that was the problem: "close" was never a component, it was four
 * props retyped at four call sites, so the four drifted —
 *
 *   ShellDrawer         Button variant="nav" size="md"        (+ a second,
 *                       hand-rolled <button> with an 18px icon for closeSide="start")
 *   FullscreenOverlay   Button variant="nav", Button's md default
 *   TabsRow             a hand-rolled <button> with a 12px icon and its own hover
 *   ShellLayout         Button variant="outline" quiet size="sm"
 *
 * — three sizes and two variants for one control, and `ShellLayout` was still
 * shipping the boxed outline that the 2026-09-01 one-idiom ruling retired. The
 * ruling was written down and then re-typed wrong three times, which is the
 * `HEADER_ICON` lesson again: a number is advice, a component is the only thing
 * that makes the box unwritable by hand.
 *
 * THE IDIOM, in one place: `variant="nav"` — bare glyph, no box, the wash on
 * hover — at `sm` (26), the same rung as the controls a close usually sits
 * beside. `size` is here because a close in a taller chrome row legitimately
 * takes that row's rung; it is the ONLY thing a call site may vary, and it must
 * be a rung, never an `iconSize`. The glyph follows from the rung.
 *
 * UTILITY, by the placement test (2026-08-09): an X on a canvas alone means
 * nothing — it is only ever worn BY the thing it dismisses, the same row
 * `FullscreenOverlay` is held on. It is also the only tier that works: a close
 * is needed by a utility (`FullscreenOverlay`), a molecule (`ShellDrawer`,
 * `TabsRow`) and a package shell alike, and utilities are the one folder every
 * tier may import while importing only atoms itself.
 *
 * TWO BASES, ONE IDIOM (user 2026-09-03: *"sometimes you dont want states"*).
 * `states` (default true) is a Button — hover wash, press, focus ring — which is
 * what a close in reachable chrome should be. `states={false}` is `IconFrame`,
 * which has NO interactive states by contract: for a close that is decoration
 * over something already dismissible, or one inside a surface that owns the
 * whole hit area, where a lighting-up X is noise. Same glyph, same variant, same
 * rung either way — only the state machine differs, which is exactly the
 * distinction IconFrame was promoted for (2026-08-01).
 *
 * @param {Function} onClick   dismiss
 * @param {boolean}  states    interactive states (default true → Button); false → IconFrame, no states
 * @param {'xs'|'sm'|'md'|'lg'} size  the rung (default 'sm'); match the row it sits in
 * @param {string}   label     accessible name (default 'Close')
 * @param {string}   className extra classes — positioning, never chrome
 */
export default function CloseButton({ onClick, size = 'sm', label = 'Close', states = true, className = '', ...rest }) {
  if (!states) {
    return (
      <IconFrame
        name="x"
        variant="nav"
        size={size}
        onClick={onClick}
        aria-label={label}
        className={className}
        {...rest}
      />
    )
  }
  return (
    <Button
      variant="nav"
      size={size}
      iconOnly="x"
      onClick={onClick}
      aria-label={label}
      className={className}
      {...rest}
    />
  )
}
