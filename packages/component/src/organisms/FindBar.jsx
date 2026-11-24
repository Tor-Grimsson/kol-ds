import { IconLoader } from '@kolkrabbi/kol-icons'
import Input from '../atoms/Input.jsx'
import Button from '../atoms/Button.jsx'
import ButtonGroup from '../molecules/ButtonGroup.jsx'

/**
 * FindBar — find and replace over a document, one bar across its top (Folio's FindBar, 2026-11-22). It holds no
 * document state: the host keeps the query, the replacement, the count and match case, and does the finding.
 *
 * The find field takes focus when the bar mounts. In either field Enter is the next match, Shift+Enter the previous;
 * Escape anywhere in the bar closes it. Chrome in kol-theme `.kol-find-bar--kolbox` and `.kol-find-bar--folio`.
 *
 *   <FindBar query={q} onQueryChange={setQ} replacement={r} onReplacementChange={setR} count="3 found"
 *     onPrev={prev} onNext={next} onReplace={one} onReplaceAll={all} matchCase={mc} onMatchCase={setMc} onClose={close} />
 *
 * @param {'kolbox'|'folio'} [variant='kolbox'] - kolbox: 48 high on the rail ground, the kolbox line under it, kolbox's
 *   Input md (the rail's search) and Buttons. folio: Folio's bar carried class for class (48, its surface, its rule).
 * @param {string} query - The find field's text
 * @param {(value: string) => void} onQueryChange
 * @param {string} replacement - The replace field's text
 * @param {(value: string) => void} onReplacementChange
 * @param {ReactNode} [count] - What the find matched, as the host words it ("3 found", "none")
 * @param {() => void} onPrev - The previous match
 * @param {() => void} onNext - The next match
 * @param {() => void} onReplace - Replace the current match
 * @param {() => void} onReplaceAll - Replace every match
 * @param {boolean} matchCase
 * @param {(on: boolean) => void} onMatchCase
 * @param {() => void} onClose
 * @param {string} [className] - Extra classes on the bar
 */
export default function FindBar({ variant = 'kolbox', query, onQueryChange, replacement, onReplacementChange, count, onPrev, onNext, onReplace, onReplaceAll, matchCase, onMatchCase, onClose, className = '' }) {
  /* Enter steps only from a field, so a focused button still presses on Enter */
  const onKeyDown = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose?.() }
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); e.shiftKey ? onPrev?.() : onNext?.() }
  }

  if (variant === 'folio') return (
    <div className={`kol-find-bar--folio flex h-[48px] shrink-0 items-center gap-[10px] border-b px-[56px] ${className}`.trim()} onKeyDown={onKeyDown}>
      <IconLoader name="search" size={16} />
      <Input variant="folio" autoFocus aria-label="Find" placeholder="Find" value={query} onChange={(e) => onQueryChange(e.target.value)} className="w-[220px]" />
      <span className="kol-find-bar-count w-[64px] tabular-nums">{count}</span>
      <ButtonGroup layout="joined" variant="folio" ariaLabel="Matches" options={[{ icon: 'arrow-left', ariaLabel: 'Previous match', onPress: onPrev }, { icon: 'arrow-right', ariaLabel: 'Next match', onPress: onNext }]} />
      <button type="button" aria-pressed={matchCase} onClick={() => onMatchCase(!matchCase)} className={`kol-find-bar-case${matchCase ? ' is-on' : ''} h-[28px] rounded-[3px] px-[8px]`}>Aa</button>
      <span className="kol-find-bar-rule mx-[8px] h-[20px] w-px" />
      <Input variant="folio" aria-label="Replace with" placeholder="Replace with" value={replacement} onChange={(e) => onReplacementChange(e.target.value)} className="w-[220px]" />
      <Button variant="folio" onClick={onReplace}>Replace</Button>
      <Button variant="folio" onClick={onReplaceAll}>Replace all</Button>
      <Button variant="folio" iconOnly="x" aria-label="Close find" onClick={onClose} className="kol-find-bar-close ml-auto" />
    </div>
  )

  /* kolbox: the rail header's 48 and its insets (12 in, 8 at the end), the rail's search field (Input md) and kolbox's
     own find's buttons; Folio's order and words */
  return (
    <div className={`kol-find-bar--kolbox flex h-12 shrink-0 items-center gap-2 border-b pr-2 pl-3 ${className}`.trim()} onKeyDown={onKeyDown}>
      <Input variant="kolbox" size="md" iconLeft="search" autoFocus aria-label="Find" placeholder="Find" value={query} onChange={(e) => onQueryChange(e.target.value)} className="w-60" />
      <span className="kol-find-bar-count kol-kolbox-row w-16 shrink-0 tabular-nums">{count}</span>
      <Button variant="kolbox" iconOnly="chevron-up" aria-label="Previous match" onClick={onPrev} />
      <Button variant="kolbox" iconOnly="chevron-down" aria-label="Next match" onClick={onNext} />
      <Button variant="kolbox" tone="ghost" pressed={Boolean(matchCase)} aria-label="Match case" onClick={() => onMatchCase(!matchCase)}>Aa</Button>
      <span className="kol-find-bar-rule mx-2 h-5 w-px shrink-0" />
      <Input variant="kolbox" size="md" iconLeft="arrow-right" aria-label="Replace with" placeholder="Replace with" value={replacement} onChange={(e) => onReplacementChange(e.target.value)} className="w-60" />
      <Button variant="kolbox" onClick={onReplace}>Replace</Button>
      <Button variant="kolbox" onClick={onReplaceAll}>Replace all</Button>
      <Button variant="kolbox" iconOnly="x" aria-label="Close find" onClick={onClose} className="ml-auto" />
    </div>
  )
}
