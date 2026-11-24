import Button from '../atoms/Button.jsx'
import Dropdown from './Dropdown.jsx'

/* taxonomy-ok: molecule — a Dropdown with its previous and next Buttons */

/**
 * DropdownStepper — A Dropdown with the previous and next buttons round it (plan-2026-11-18-kolbox-system W31.2
 * batch 4, 2026-11-18; kolbox's, Labs' preset stepper): `onStep(-1)` and `onStep(1)` walk the options, the Dropdown picks
 * any. With one option the buttons are not drawn. It renders its three parts with no wrapper, so they sit in the
 * caller's row. `variant` reaches the Buttons (icon-only chevrons) and the Dropdown (`kolbox` is kolbox's look). Input.
 *
 * @param {string}   [value]
 * @param {Array}    [options]   Dropdown's options
 * @param {Function} [onChange]  `(value)`
 * @param {Function} [onStep]    `(-1 | 1)`
 * @param {string}   [prevLabel='Previous']  @param {string} [nextLabel='Next']  the buttons' names
 * @param {string}   [variant]
 * @param {string}   [className='min-w-0 flex-1']  the Dropdown's
 */
export default function DropdownStepper({ value, options = [], onChange, onStep, prevLabel = 'Previous', nextLabel = 'Next', variant, className = 'min-w-0 flex-1' }) {
  const steps = options.length > 1
  return (
    <>
      {steps && <Button variant={variant} iconOnly="chevron-left" aria-label={prevLabel} onClick={() => onStep?.(-1)} />}
      <Dropdown variant={variant} className={className} value={value} options={options} onChange={onChange} />
      {steps && <Button variant={variant} iconOnly="chevron-right" aria-label={nextLabel} onClick={() => onStep?.(1)} />}
    </>
  )
}
